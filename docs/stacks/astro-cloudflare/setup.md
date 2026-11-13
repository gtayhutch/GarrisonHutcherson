---
id: stacks/astro-cloudflare/setup
version: 0.1.0
load_when: Setting up, deploying, promoting, or rolling back an astro-cloudflare project, or changing Cloudflare or CI settings.
---

# astro-cloudflare: environments, deploy, hardening, setup

## Rules

- **ACF-10 One Worker per hosted environment.** `wrangler.jsonc` defines
  production at the top level and staging under `env.staging` (Worker
  `<name>-staging`). They share no bindings, routes, or hostnames.
- **ACF-11 No unauthenticated side doors.** Set `workers_dev: false` and
  `preview_urls: false` at the top level and in every environment, so
  `*.workers.dev` URLs cannot bypass Cloudflare Access on staging.
- **ACF-12 Cloudflare deploys; GitHub verifies.** Workers Builds deploys only
  the `staging` and `production` branches. GitHub Actions runs `pnpm verify`
  and holds no Cloudflare credentials (CI-05).
- **ACF-13 Pin everything.** `compatibility_date` is fixed, and is bumped only
  in a reviewed PR. Actions are pinned to SHAs (CI-07). Node and pnpm are
  pinned (DEP-04).

## Environments (ENV-01..11)

| | test | staging | production |
| --- | --- | --- | --- |
| Runs | `astro dev` / `wrangler dev` (offline) | Worker `<name>-staging` | Worker `<name>` |
| Hostname | `localhost` | `staging.<domain>` (custom domain, behind Access) | `<domain>`; `www` redirected by a zone Redirect Rule |
| Deployed by | — | Workers Builds on push to `staging` | Workers Builds on push to `production` |

Reference `wrangler.jsonc` (static assets only, no `main`):

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "garrisonhutcherson",
  "compatibility_date": "2026-11-12",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "404-page",
    "html_handling": "auto-trailing-slash"
  },
  "workers_dev": false,
  "preview_urls": false,
  "routes": [{"pattern": "garrisonhutcherson.com", "custom_domain": true}],
  "env": {
    "staging": {
      "workers_dev": false,
      "preview_urls": false,
      "routes": [{"pattern": "staging.garrisonhutcherson.com", "custom_domain": true}]
    }
  }
}
```

**Rollback:** in the Cloudflare dashboard, open Workers → the Worker →
Deployments and roll back to the previous version. Alternatively, run
`wrangler rollback` locally (with the owner's login, never from CI). Then
revert the commit on the branch so git matches what is live.

## CI and deploy (CI-01..10)

- `.github/workflows/ci.yml` runs on pull requests to `test`, `staging`, and
  `production`. Steps: checkout → setup Node from `.nvmrc` → `npm install
  -g corepack && corepack enable pnpm` → `pnpm install --frozen-lockfile` → install Playwright browsers →
  `pnpm verify`. It needs read-only permissions and no secrets.
- **Workers Builds:** connect the GitHub repo to each Worker in the Cloudflare
  dashboard.

  | Worker | Production branch | Build command | Deploy command | Non-production branch builds |
  | --- | --- | --- | --- | --- |
  | `<name>` | `production` | `pnpm install --frozen-lockfile && pnpm build` | `pnpm exec wrangler deploy` | Off |
  | `<name>-staging` | `staging` | same | `pnpm exec wrangler deploy --env staging` | Off |

  Set the Node version in the build settings to match `.nvmrc`. Workers Builds
  creates its own API token per Worker, scoped to deploys. No token is ever
  copied into GitHub.
- **Deploy order (CI-04):** one artifact, so there is nothing to order.
- **Smoke (CI-08):** after a production deploy, run the Playwright `smoke`
  project against `https://<domain>` (a manually triggered workflow that only
  reads the public site). Smoke-check staging by hand in the browser, signed in
  through Access.
- Branch protection, required checks, and promotion follow
  `docs/standards/git-workflow.md` and `docs/checklists/release.md`.

## Hardening checklist

Record each item in `docs/project/security-decisions.md` §14.

- [ ] **Account:** MFA on the Cloudflare login (security key preferred); no
      extra members; no user-created API tokens left over after setup; review
      the audit log after setup.
- [ ] **GitHub:** MFA; the Cloudflare GitHub App is limited to this one
      repository.
- [ ] **Zone SSL/TLS:** Always Use HTTPS on; minimum TLS 1.2; TLS 1.3 on;
      Automatic HTTPS Rewrites on. HSTS comes from `_headers`; don't also
      enable the zone HSTS setting with different values.
- [ ] **DNS:** DNSSEC on; CAA records limit certificate issuers to the CAs
      Cloudflare uses; no stray records.
- [ ] **Workers:** `workers_dev` and `preview_urls` off for both Workers
      (ACF-11); custom domains only.
- [ ] **Access (staging):** a self-hosted application for
      `staging.<domain>`; policy Allow → emails = the owner's address;
      one-time PIN login; 24-hour session. Verify signed-out requests get the
      Access login page.
- [ ] **Redirect:** a zone Redirect Rule sends `www.<domain>/*` to
      `https://<domain>/$1` with a 301. `www` needs a proxied DNS record.
- [ ] **Web Analytics:** enable for the production hostname only. Confirm
      the beacon origins match the CSP in `_headers`.
- [ ] **Cost:** Workers free plan. Static asset requests are free and
      uncounted, so no budget alert is needed while ACF-01/09 hold.
- [ ] **Backups:** git is the source of truth. Keep a second remote or a
      local clone (DB-15 is n/a).

## Setup

The steps that `docs/checklists/new-project-setup.md` §2 delegates here.

1. Install the Node active LTS and pin it in `.nvmrc`. Node 25+ no longer
   bundles Corepack, so run `npm install -g corepack` and then
   `corepack enable pnpm`.
2. Scaffold Astro (minimal template, TypeScript `strictest`) into the repo
   root. Set `output: 'static'` and `site` in `astro.config.mjs`.
3. Add dev dependencies: `wrangler`, `@playwright/test`,
   `@axe-core/playwright`, `prettier`, `prettier-plugin-astro`, `gts`
   (config only), `eslint`, `typescript-eslint`, `eslint-plugin-astro`,
   `stylelint` (+ a standard config), `markdownlint-cli2`, `@astrojs/check`.
   Justify each in the PR (DEP-01).
4. Add the `package.json` scripts from the README's Commands table, and
   `packageManager`.
5. Add `wrangler.jsonc` (above), `public/_headers`, `public/robots.txt`,
   `src/pages/404.astro`, `src/styles/tokens.css`, `src/content.config.ts`,
   and `src/lib/content.ts`.
6. Add `playwright.config.ts` with a `webServer` that runs `wrangler dev` on
   the built `dist/`, and the header, axe, and no-script specs. Run
   `pnpm verify` until it is green.
   - TypeScript must be a version `typescript-eslint` and `@astrojs/check`
     support (6.0.x at the time of writing), plus `@types/node`.
   - Approve install scripts only for `esbuild` and `workerd`
     (`pnpm approve-builds esbuild workerd`).
   - Set `ASTRO_TELEMETRY_DISABLED=1` and `WRANGLER_SEND_METRICS=false` in CI.
7. 👤 In Cloudflare: work through the hardening checklist, create both Workers
   through Workers Builds (the first deploy creates them), attach the custom
   domains, then the Access application, then Web Analytics.
8. 👤 In GitHub: branches `test` (default), `staging`, `production`; branch
   protection; `ci.yml` required on all three.
