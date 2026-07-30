# MASQ Docs

Public documentation site for MASQ Network, built with [Docusaurus](https://docusaurus.io/).

- **Live URL:** https://docs.masqbrowser.com
- **Source content migrated from:** [masq-public-docs](https://github.com/MASQ-Project/masq-public-docs) (GitBook markdown backup)
- **Branches:** work on `dev` (staging); merge to `main` to deploy GitHub Pages

## Local development

```bash
npm install
npm start
```

## Build

```bash
npm run build
npm run serve
```

## Branching

| Branch | Role |
|--------|------|
| `dev` | Staging / day-to-day commits (build CI only) |
| `main` | Production deploy via GitHub Actions → Pages |

See [`AGENTS.md`](AGENTS.md) for agent/contributor rules and [`CUTOVER.md`](CUTOVER.md) for the `docs.masqbrowser.com` cutover.

## Content conversion

GitBook markdown can be re-imported with:

```bash
python scripts/convert_gitbook.py
```

(Requires a `gitbook-src/` staging copy of the GitBook repo; see `.gitignore`.)
