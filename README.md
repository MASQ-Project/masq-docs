# MASQ Docs

Public documentation site for MASQ Network, built with [Docusaurus](https://docusaurus.io/).

- **Test URL:** https://test-docs.masqbrowser.com
- **Source content migrated from:** [masq-public-docs](https://github.com/MASQ-Project/masq-public-docs) (GitBook markdown backup)

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

## Content conversion

GitBook markdown can be re-imported with:

```bash
python scripts/convert_gitbook.py
```

(Requires a `gitbook-src/` staging copy of the GitBook repo; see `.gitignore`.)

## Cutover note

This site is first published on `test-docs.masqbrowser.com`. When ready, point `docs.masqbrowser.com` at the same GitHub Pages deployment and update `url` + `static/CNAME`.
