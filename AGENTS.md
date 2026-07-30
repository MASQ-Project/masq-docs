# AGENTS.md — masq-docs

Guidance for AI agents working in this repository.

## What this repo is

Public **MASQ Network documentation** site: **Docusaurus 3** → **GitHub Pages**.

| | |
|---|---|
| Live (test) | https://test-docs.masqbrowser.com |
| Prod (planned) | https://docs.masqbrowser.com — see [`CUTOVER.md`](CUTOVER.md) |
| GitHub | https://github.com/MASQ-Project/masq-docs |
| Content | `docs/**/*.mdx` |
| Assets | `static/img/assets/` (kebab-case filenames) |
| Nav | `sidebars.js` |
| Config | `docusaurus.config.js` |
| Deploy | `.github/workflows/deploy.yml` — **only** on push to `main` |
| Staging branch | `dev` — day-to-day work; does **not** deploy Pages |

**Do not treat this as a GitBook repo.** The GitBook markdown backup is the sibling repo `masq-public-docs` — leave it untouched unless the user explicitly asks to change it.

## Branch workflow

| Branch | Purpose |
|--------|---------|
| `dev` | Default working / staging branch. Commit and push here for QA and hardening. |
| `main` | Production. Push/merge here triggers GitHub Pages deploy to the live custom domain. |

Rules for agents:

1. **Do day-to-day work on `dev`.** Check out `dev` at session start if not already on it.
2. **Do not push straight to `main`** unless the user explicitly asks to publish/deploy.
3. Ship to the live site by merging `dev` → `main` (PR preferred) after `npm run build` is clean and the user approves.
4. CI: pushes and PRs to `dev` run a **build-only** check. Only `main` runs the Pages deploy workflow.

```powershell
git fetch origin
git checkout dev
git pull origin dev
```

## Environment

- Host OS for local work: **Windows 11 / PowerShell**
- Node ≥ 20; use `npm` (lockfile committed)
- Python 3 for `scripts/convert_gitbook.py` only when re-importing

```powershell
npm install
npm start          # http://localhost:3000
npm run build      # must succeed before relying on deploy
npm run serve
```

## Git identity (required)

This repo uses **local** git identity (not personal global):

- `user.name` = `KauriHero`
- `user.email` = `kaurihero@masq.ai`

Before any commit:

```powershell
git config --show-origin --get-regexp "user\.(name|email)"
# expect file:.git/config → KauriHero / kaurihero@masq.ai
```

If missing, set with `git config --local` (never change the user's global config). Prefer:

```powershell
git -c user.name=KauriHero -c user.email=kaurihero@masq.ai commit ...
```

Do not commit or force-push unless the user asks. If rewriting author on an already-pushed commit, only with explicit approval.

## Layout agents must respect

```
masq-docs/                 # this repo — edit here
  docs/                    # published MDX
  static/img/assets/       # images referenced as /img/assets/...
  scripts/convert_gitbook.py
  working-docs/            # gitignored — local plans / QA / handover
  gitbook-src/             # gitignored — optional convert staging (not a git backup)
masq-public-docs/          # sibling — GitBook sync backup (read-only by default)
```

- `working-docs/` and `gitbook-src/` are **gitignored**. Keep notes/QA there; do not force-add them.
- Tracked handoff for prod DNS: [`CUTOVER.md`](CUTOVER.md)
- Local session notes (if present): `working-docs/HANDOVER-HARDENING.md`

## Content rules

1. **Prefer surgical MDX edits** over full re-convert. Re-running the converter can overwrite hand fixes.
2. Images: lowercase kebab-case under `static/img/assets/`; in MDX use `/img/assets/<file>`. No spaces in filenames.
3. MDX is strict: self-close void tags (`<br />`), no HTML comments (`<!-- -->` → `{/* */}`), unique `<Tabs>` / `<TabItem value=...>`.
4. GitBook leftovers to convert if found: `{% hint %}` → admonitions (`:::info` / `:::tip` / `:::warning`), `{% tabs %}` → `@theme/Tabs`, embeds → links.
5. Internal doc links: no `.md` / `.mdx` suffix; `README` paths map to folder `index` routes.
6. Sidebar changes go in `sidebars.js` (source of truth was GitBook `SUMMARY.md`).
7. Docs are served at site root (`routeBasePath: '/'`) — not under `/docs/`.

### Re-import from GitBook backup (rare)

```powershell
robocopy "..\masq-public-docs" "gitbook-src" /E /XD .git .agent
python scripts\convert_gitbook.py
npm run build
```

## Deploy & domains

- Pages source: **GitHub Actions** (not `gh-pages` branch upload by hand).
- Test domain is configured via `url` in `docusaurus.config.js` and `static/CNAME`.
- Subdomains need a **CNAME → `masq-project.github.io`** only (no GitHub A records unless apex).
- Production cutover steps: follow [`CUTOVER.md`](CUTOVER.md) exactly; do not flip `docs.masqbrowser.com` without user confirmation.

## Current hardening focus

When continuing polish / visual QA (see `working-docs/HANDOVER-HARDENING.md` if present):

1. Brand: replace default Docusaurus logo / favicon / social card
2. Homepage (`docs/index.mdx`) labels and optional card layout
3. Image-heavy pages and admonitions/tabs spot-check vs old GitBook
4. Rename `untitled-*` slugs; fix nested `<a>` / link warnings
5. Only then: prod cutover

`onBrokenLinks` / markdown image/link hooks are currently `warn` so the site can ship; tighten to `throw` once QA is clean.

## PR / change hygiene

- Keep diffs scoped: content vs config vs workflows — don’t mix unrelated refactors.
- After substantive MDX or config changes, run `npm run build` locally.
- Do not download or execute untrusted third-party “migration” scripts; use/extend `scripts/convert_gitbook.py`.
- Do not commit secrets, `.env`, or staging trees.

## Quick verification

```powershell
git status -sb
npm run build
# spot-check: npm start → /, /masq-privacy-browser, /resources/installer-checksums
```
