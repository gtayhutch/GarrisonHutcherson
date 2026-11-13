---
paths:
  - "public/_headers"
  - "wrangler.jsonc"
  - "astro.config.ts"
  - ".github/workflows/**"
---
# Headers and deploy config

Read `docs/standards/security/web-and-api.md` and `docs/stacks/astro-cloudflare/setup.md`.

- Headers live only in `public/_headers`; keep the e2e header test in sync (ACF-07, SEC-WEB-01..06).
- CSP stays `'self'` plus the origins listed in `security-decisions.md` (OVR-003).
- Static output, no adapter, no `main`, no bindings (ACF-01, ACF-09).
- `workers_dev` and `preview_urls` stay false in every environment (ACF-11).
- CI holds no Cloudflare credentials; never run `wrangler deploy` unless the human asks this session (ACF-12, ENV-04).
