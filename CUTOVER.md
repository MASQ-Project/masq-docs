# Cutover: test-docs → docs.masqbrowser.com

## Current (production config in repo)

| Item | Value |
|------|--------|
| Repo | https://github.com/MASQ-Project/masq-docs |
| Config `url` | `https://docs.masqbrowser.com` |
| `static/CNAME` | `docs.masqbrowser.com` |
| GitHub Pages | Settings → Pages → Source: **GitHub Actions** |
| Working branch | `dev` (staging). Only merges to `main` publish Pages. |

Former staging domain: `test-docs.masqbrowser.com` (CNAME → `masq-project.github.io`).

## Cutover checklist

1. Lower DNS TTL on `docs.masqbrowser.com` ahead of time if possible.
2. [x] In this repo, change:
   - `docusaurus.config.js` → `url: 'https://docs.masqbrowser.com'`
   - `static/CNAME` → `docs.masqbrowser.com`
3. [ ] Merge `dev` → `main` (or commit and push to `main`) so Actions redeploy.
4. [ ] Update DNS: point `docs.masqbrowser.com` to GitHub Pages (`masq-project.github.io` CNAME only for the subdomain).
5. [ ] In GitHub Pages settings, confirm custom domain shows `docs.masqbrowser.com` and HTTPS is enabled / Enforce HTTPS.
6. [ ] Detach / remove the custom domain from GitBook so it no longer serves the old site.
7. [ ] Smoke-test key pages and external inbound links. Client redirects for GitBook `/masq/...` (plus privacy-browser and `untitled-*` slug renames) are wired in `docusaurus.config.js` via `@docusaurus/plugin-client-redirects`.

## Local commands

```bash
npm install
npm start          # http://localhost:3000
npm run build
npm run serve
```

## Re-import from GitBook backup

```bash
# Stage content from masq-public-docs into gitbook-src/, then:
python scripts/convert_gitbook.py
```
