#!/usr/bin/env python3
"""Convert staged GitBook markdown into Docusaurus MDX docs."""

from __future__ import annotations

import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "gitbook-src"
DOCS = ROOT / "docs"
STATIC_ASSETS = ROOT / "static" / "img" / "assets"
SKIP_NAMES = {
    "SUMMARY.md",
    "LICENSE",
    ".gitbook.yaml",
    "convert_gitbook_to_mdx3.py",
}
SKIP_DIRS = {".git", ".agent", "scripts"}

HINT_MAP = {
    "info": "info",
    "success": "tip",
    "warning": "warning",
    "danger": "danger",
}


def slugify_filename(name: str) -> str:
    stem = Path(name).stem
    suffix = Path(name).suffix.lower()
    slug = stem.lower()
    slug = re.sub(r"[^\w\s-]", "", slug, flags=re.UNICODE)
    slug = re.sub(r"[-\s]+", "-", slug).strip("-")
    if not slug:
        slug = "asset"
    return f"{slug}{suffix}"


def build_asset_map() -> dict[str, str]:
    assets_dir = SRC / ".gitbook" / "assets"
    mapping: dict[str, str] = {}
    if not assets_dir.exists():
        return mapping

    STATIC_ASSETS.mkdir(parents=True, exist_ok=True)
    used: set[str] = set()

    for path in sorted(assets_dir.rglob("*")):
        if not path.is_file():
            continue
        new_name = slugify_filename(path.name)
        base = Path(new_name).stem
        ext = Path(new_name).suffix
        candidate = new_name
        i = 2
        while candidate in used:
            candidate = f"{base}-{i}{ext}"
            i += 1
        used.add(candidate)
        shutil.copy2(path, STATIC_ASSETS / candidate)
        mapping[path.name] = candidate
        # Also map URL-encoded / angle-bracket variants by basename
        mapping[path.name.replace(" ", "%20")] = candidate
    return mapping


def rewrite_images(content: str, asset_map: dict[str, str]) -> str:
    def replace_name(raw: str) -> str:
        name = raw.strip().strip("<>").replace("\\", "/").split("/")[-1]
        name = name.replace("%20", " ")
        return asset_map.get(name, slugify_filename(name))

    def is_remote(raw: str) -> bool:
        s = raw.strip().strip("<>")
        return s.startswith(("http://", "https://", "data:"))

    # Prefer angle-bracket GitBook form so filenames may contain ')'
    content = re.sub(
        r"!\[([^\]]*)\]\(\s*<([^>]+)>\s*\)",
        lambda m: (
            m.group(0)
            if is_remote(m.group(2))
            else f"![{m.group(1)}](/img/assets/{replace_name(m.group(2))})"
        ),
        content,
    )
    # Local / relative GitBook assets only — leave remote CDN URLs (e.g. googleusercontent) intact
    content = re.sub(
        r"!\[([^\]]*)\]\(\s*((?:(?:\.\./)*(?:\.gitbook/assets/)?)[^)\s]+)\s*\)",
        lambda m: (
            m.group(0)
            if is_remote(m.group(2))
            else f"![{m.group(1)}](/img/assets/{replace_name(m.group(2))})"
        ),
        content,
    )
    content = re.sub(
        r'<img([^>]*?)src="(?:\.\./)*(?:\.gitbook/assets/)?([^"]+)"([^>]*?)/?>',
        lambda m: f'<img{m.group(1)}src="/img/assets/{replace_name(m.group(2))}"{m.group(3)} />',
        content,
    )
    # Repair any previously mangled "![](/img/assets/foo).png>)" forms if re-run on bad output
    content = re.sub(
        r"!\[([^\]]*)\]\(/img/assets/([^)\s]+)\)\.(png|jpg|jpeg|gif|svg|webp)>?\)",
        r"![\1](/img/assets/\2.\3)",
        content,
        flags=re.IGNORECASE,
    )
    return content


def fix_html_void_tags(content: str) -> str:
    content = re.sub(r"<br\s*>", "<br />", content, flags=re.IGNORECASE)
    content = re.sub(r"<hr\s*>", "<hr />", content, flags=re.IGNORECASE)
    content = re.sub(r"<img([^>]*?)(?<!/)>", r"<img\1 />", content, flags=re.IGNORECASE)
    return content


def rewrite_md_links(content: str) -> str:
    def repl(match: re.Match[str]) -> str:
        text, url = match.group(1), match.group(2)
        if url.startswith(("http://", "https://", "mailto:", "#", "/img/")):
            return match.group(0)
        # strip .md / .mdx for Docusaurus doc links
        new_url = re.sub(r"\.mdx?(#[^)]*)?$", r"\1", url)
        if new_url.endswith("/README") or new_url.endswith("/readme"):
            new_url = new_url.rsplit("/", 1)[0] or "/"
        return f"[{text}]({new_url})"

    return re.sub(r"\[([^\]]+)\]\(([^)]+)\)", repl, content)


def convert_html_comments(content: str) -> str:
    return re.sub(
        r"<!--(.*?)-->",
        lambda m: "{/*" + m.group(1) + "*/}",
        content,
        flags=re.DOTALL,
    )


def escape_mdx_hazards(content: str) -> str:
    """Escape curly braces in prose, but not in import/JSX/code blocks."""

    parts = content.split("```")
    out = []
    for i, part in enumerate(parts):
        if i % 2 == 1:
            out.append(part)
            continue
        lines = []
        for line in part.splitlines():
            stripped = line.strip()
            if (
                stripped.startswith("import ")
                or stripped.startswith("<Tabs")
                or stripped.startswith("<TabItem")
                or stripped.startswith("</")
                or stripped.startswith(":::")
                or stripped.startswith("{/*")
            ):
                lines.append(line)
                continue
            # Don't escape lines that are primarily JSX/HTML tags
            if re.match(r"^\s*</?[A-Za-z]", line):
                lines.append(line)
                continue
            lines.append(line.replace("{", "\\{").replace("}", "\\}"))
        out.append("\n".join(lines))
    return "```".join(out)


def convert_hints(content: str) -> str:
    pattern = re.compile(
        r'\{%\s*hint\s+style="([^"]+)"\s*%\}\s*(.*?)\s*\{%\s*endhint\s*%\}',
        re.DOTALL | re.IGNORECASE,
    )

    def repl(match: re.Match[str]) -> str:
        style = HINT_MAP.get(match.group(1).lower(), "info")
        body = match.group(2).strip()
        return f":::{style}\n\n{body}\n\n:::"

    return pattern.sub(repl, content)


def convert_tabs(content: str) -> str:
    if "{% tabs %}" not in content and "{%tabs%}" not in content.lower():
        return content

    # Ensure Tabs imports once per file when tabs present
    needs_import = True

    def tabs_block(match: re.Match[str]) -> str:
        nonlocal needs_import
        inner = match.group(1)
        tab_pat = re.compile(
            r'\{%\s*tab\s+title="([^"]*)"\s*%\}\s*(.*?)\s*\{%\s*endtab\s*%\}',
            re.DOTALL | re.IGNORECASE,
        )
        items = []
        for title, body in tab_pat.findall(inner):
            body = body.strip()
            value = re.sub(r"[^\w.-]+", "-", title.lower()).strip("-")
            value = value.replace(".", "-")
            items.append(
                f'<TabItem value="{value}" label="{title}">\n\n{body}\n\n</TabItem>'
            )
        block = "<Tabs>\n" + "\n".join(items) + "\n</Tabs>"
        return block

    content = re.sub(
        r"\{%\s*tabs\s*%\}(.*?)\{%\s*endtabs\s*%\}",
        tabs_block,
        content,
        flags=re.DOTALL | re.IGNORECASE,
    )

    if "<Tabs>" in content and "from '@theme/Tabs'" not in content:
        content = (
            "import Tabs from '@theme/Tabs';\n"
            "import TabItem from '@theme/TabItem';\n\n"
            + content
        )
    return content


def convert_embeds(content: str) -> str:
    content = re.sub(
        r'\{%\s*embed\s+url="([^"]+)"[^%]*%\}',
        r"[Open link](\1)",
        content,
        flags=re.IGNORECASE,
    )
    content = re.sub(r"\{%\s*endembed\s*%\}", "", content, flags=re.IGNORECASE)
    return content


def convert_content_refs(content: str) -> str:
    pattern = re.compile(
        r"\{%\s*content-ref\s+url=\"([^\"]+)\"\s*%\}\s*(?:\[([^\]]*)\]\([^)]*\))?\s*\{%\s*endcontent-ref\s*%\}",
        re.DOTALL | re.IGNORECASE,
    )

    def repl(match: re.Match[str]) -> str:
        url = match.group(1).strip()
        text = (match.group(2) or url).strip()
        if url.startswith("/broken/") or "broken" in url:
            return f"<!-- broken content-ref removed: {url} -->"
        # Normalize .md links to doc-relative paths without extension where possible
        clean = url
        if clean.endswith(".md"):
            clean = clean[:-3]
        if clean.endswith("/"):
            clean = clean.rstrip("/")
        return f"[{text}]({clean})"

    return pattern.sub(repl, content)


def expand_includes(content: str, current_file: Path) -> str:
    pattern = re.compile(
        r'\{%\s*include\s+"([^"]+)"\s*%\}',
        re.IGNORECASE,
    )

    def repl(match: re.Match[str]) -> str:
        rel = match.group(1)
        include_path = (current_file.parent / rel).resolve()
        if not include_path.exists():
            # try from SRC root
            include_path = (SRC / rel.lstrip("./")).resolve()
        if not include_path.exists():
            return f"<!-- missing include: {rel} -->"
        included = include_path.read_text(encoding="utf-8")
        return included

    # Expand repeatedly in case nested (unlikely)
    for _ in range(3):
        if "{% include" not in content.lower():
            break
        content = pattern.sub(repl, content)
    return content


def strip_gitbook_frontmatter(content: str) -> str:
    if not content.startswith("---"):
        return content
    end = content.find("\n---", 3)
    if end == -1:
        return content
    fm = content[3:end]
    body = content[end + 4 :].lstrip("\n")
    # Drop GitBook-only keys; keep description/title if present
    keep_lines = []
    for line in fm.splitlines():
        key = line.split(":", 1)[0].strip()
        if key in {"description", "title", "sidebar_label", "slug", "id"}:
            keep_lines.append(line)
    if keep_lines:
        return "---\n" + "\n".join(keep_lines) + "\n---\n\n" + body
    return body


def simplify_card_tables(content: str) -> str:
    # Replace GitBook card tables with a simple markdown list of links when possible
    if 'data-view="cards"' not in content:
        return content

    def table_repl(match: re.Match[str]) -> str:
        table = match.group(0)
        links = re.findall(r'<a href="([^"]+)">([^<]*)</a>', table)
        if not links:
            return ""
        lines = []
        # Pair file cover + content-ref roughly: keep content-ref style .md links
        for href, text in links:
            if href.endswith(".md") or href.endswith("/"):
                label = text or Path(href).stem
                clean = href[:-3] if href.endswith(".md") else href.rstrip("/")
                lines.append(f"- [{label}]({clean})")
        return "\n".join(lines) + "\n" if lines else ""

    return re.sub(r"<table\b[^>]*>.*?</table>", table_repl, content, flags=re.DOTALL | re.IGNORECASE)


def escape_mdx_hazards(content: str) -> str:
    # Escape bare <words> that are not HTML tags / already JSX
    # Conservative: escape comparison-like patterns and email-unrelated lone <foo>
    def escape_line(line: str) -> str:
        if line.strip().startswith("```") or line.strip().startswith("import "):
            return line
        # Skip lines that look like HTML/JSX
        if re.search(r"</?[A-Za-z][^>]*>", line):
            return line
        line = line.replace("{", "\\{").replace("}", "\\}")
        return line

    parts = content.split("```")
    out = []
    for i, part in enumerate(parts):
        if i % 2 == 1:
            out.append(part)  # code fence interior
        else:
            out.append("\n".join(escape_line(l) for l in part.splitlines()))
    return "```".join(out)


def convert_pre_code_blocks(content: str) -> str:
    pattern = re.compile(
        r'<pre[^>]*>\s*<code[^>]*>(?:<strong>)?(.*?)(?:</strong>)?</code>\s*</pre>',
        re.DOTALL | re.IGNORECASE,
    )

    def repl(match: re.Match[str]) -> str:
        body = match.group(1)
        body = re.sub(r"<[^>]+>", "", body)
        body = body.strip("\n")
        return f"```bash\n{body}\n```"

    return pattern.sub(repl, content)


def convert_file(path: Path, asset_map: dict[str, str], rel: Path) -> None:
    content = path.read_text(encoding="utf-8")
    content = expand_includes(content, path)
    content = strip_gitbook_frontmatter(content)
    content = simplify_card_tables(content)
    content = convert_pre_code_blocks(content)
    content = convert_hints(content)
    content = convert_tabs(content)
    content = convert_embeds(content)
    content = convert_content_refs(content)
    content = convert_html_comments(content)
    content = fix_html_void_tags(content)
    content = rewrite_images(content, asset_map)
    content = rewrite_md_links(content)
    content = escape_mdx_hazards(content)

    # Map README.md -> index.mdx for Docusaurus category indexes
    out_rel = rel
    if out_rel.name.lower() == "readme.md":
        out_rel = out_rel.with_name("index.mdx")
    else:
        out_rel = out_rel.with_suffix(".mdx")

    out_path = DOCS / out_rel
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(content, encoding="utf-8")
    print(f"OK {rel} -> {out_rel}")


def main() -> None:
    if DOCS.exists():
        for child in DOCS.iterdir():
            if child.is_file() or child.is_dir():
                if child.name == ".gitkeep":
                    continue
                if child.is_dir():
                    shutil.rmtree(child)
                else:
                    child.unlink()

    asset_map = build_asset_map()
    print(f"Assets mapped: {len(asset_map)}")

    for path in sorted(SRC.rglob("*.md")):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        if path.name in SKIP_NAMES:
            continue
        # Skip files under .gitbook except we already expanded includes from there
        if ".gitbook" in path.parts:
            continue
        rel = path.relative_to(SRC)
        convert_file(path, asset_map, rel)

    print("Conversion complete.")


if __name__ == "__main__":
    main()
