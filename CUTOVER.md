# Cutover: test-docs → docs.masqbrowser.com

## Current (test)

| Item | Value |
|------|--------|
| Repo | https://github.com/MASQ-Project/masq-docs |
| Config `url` | `https://test-docs.masqbrowser.com` |
| `static/CNAME` | `test-docs.masqbrowser.com` |
| GitHub Pages | Settings → Pages → Source: **GitHub Actions** |
| DNS | CNAME `test-docs` → `masq-project.github.io` |

## When ready for production

1. Lower DNS TTL on `docs.masqbrowser.com` ahead of time if possible.
2. In this repo, change:
   - `docusaurus.config.js` → `url: 'https://docs.masqbrowser.com'`
   - `static/CNAME` → `docs.masqbrowser.com`
3. Commit and push to `main` (Actions redeploy).
4. Update DNS: point `docs.masqbrowser.com` to GitHub Pages (`masq-project.github.io` CNAME, or GitHub A records).
5. In GitHub Pages settings, confirm custom domain shows `docs.masqbrowser.com` and HTTPS is enabled.
6. Detach / remove the custom domain from GitBook so it no longer serves the old site.
7. Smoke-test key pages and external inbound links; add redirects later if old `/masq/...` URLs matter.

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
