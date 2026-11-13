---
id: project/stack
version: 1.1.0
load_when: Start of every session (with status.md and codemap.md). Before using any language, framework, library, service, or tool.
---

# Stack

**Status:** `decided` <!-- undecided | decided -->
**Decided:** 2026-11-12 · **ADR:** `decisions/0002-stack-selection.md`
**Stack profile(s):** `docs/stacks/astro-cloudflare/` (Draft)

Anything not listed below is not part of the stack: ask before adding it
(SEL-10).

## Requirements (from the interview)

| Question | Answer |
| --- | --- |
| Product and users | GarrisonHutcherson.com: a professional site showcasing Garrison Hutcherson's experience and skills, for recruiters, hiring managers, and contacts |
| Platforms | Web (mobile and desktop browsers) |
| Data held → ASVS level | Public content only; no sign-up, sign-in, purchases, or stored user data → **L1** |
| Special needs | None yet. Priorities: clean, professional design and extremely fast loads |
| First-year scale | Small (< 1k visitors/month) |
| Preferences and constraints | No language preference. Host on Cloudflare (decided). Domain `garrisonhutcherson.com` is already on Cloudflare DNS |
| Team | Solo, with AI agents |

## Decisions

Versions were checked again at scaffold time (2026-11-13). Exact versions are
in `package.json` and `pnpm-lock.yaml`.

| Category | Choice | Version policy | Alternatives considered | Why |
| --- | --- | --- | --- | --- |
| Languages | TypeScript (strict) | 6.0.x until typescript-eslint and @astrojs/check support 7 (see Differences) | JavaScript; no code language | Type errors caught before shipping, little overhead |
| Web frontend | Astro, static output (`output: 'static'`) | Latest stable (7.x) | Eleventy, Hugo, plain HTML/CSS | Built for content sites, zero JS by default, typed content collections, image optimization |
| Mobile / desktop clients | Not needed | — | — | Responsive web covers mobile |
| Backend and API style | Not needed | — | — | Static pages only |
| Content source | Markdown/YAML in the repo via Astro content collections | — | JSON/TS data files; headless CMS | Versioned in git, schema-checked at build time, no extra service |
| Database | Not needed | — | — | No stored data |
| Authentication | Not needed for the site. Staging is gated by Cloudflare Access (Zero Trust free tier, email one-time PIN) | — | Public staging with `noindex` | Keeps unfinished work private and unindexed |
| File storage | Not needed (images live in the repo, optimized by Astro) | — | — | |
| Hosting (staging, production) | Cloudflare Workers static assets: Worker `garrisonhutcherson-staging` and Worker `garrisonhutcherson`, one Cloudflare account | Wrangler latest stable (4.x) | Cloudflare Pages; two Cloudflare accounts | Cloudflare's current recommendation for new projects; one account accepted under OVR-001 |
| Local `test` environment | `astro dev` for authoring; `wrangler dev` serving the built `dist/` for tests | — | — | Fully offline; no hosted data exists |
| Background jobs / scheduling | Not needed | — | — | |
| Styling / UI kit | Hand-written CSS: design tokens (custom properties) in `src/styles/`, component-scoped `<style>` in `.astro` files | — | Tailwind CSS; component library | No dependency, smallest output, a distinct personal look |
| Secrets manager | Not needed for the app (no secrets). Cloudflare Workers secrets if one is ever added | — | — | |
| Observability | Cloudflare Web Analytics (cookieless) plus Cloudflare's built-in request metrics | — | None; GA4 | Free, no consent banner, reports Core Web Vitals |
| Package manager / task runner | pnpm, via `package.json` scripts; Node.js LTS pinned in `.nvmrc` and `packageManager` | pnpm latest (12.x); Node active LTS (26.x) | npm; Bun | Strict about undeclared dependencies, reviewable lockfile |
| Format / lint | Prettier with `gts` settings + `prettier-plugin-astro`; ESLint (`typescript-eslint` strict-type-checked + `eslint-plugin-astro`); Stylelint; markdownlint; `astro check` | Latest stable | — | Required by `docs/standards/code-style/README.md` |
| Testing tools | Playwright (end-to-end) with `@axe-core/playwright` (accessibility) | Latest stable (1.6x) | Vitest + Playwright (+ Lighthouse CI) | User's choice; no unit layer while there is no logic (OVR-002) |
| CI/CD | GitHub Actions runs `verify` on pull requests; Cloudflare Workers Builds deploys the `staging` and `production` branches | Actions pinned to SHAs (CI-07) | GitHub Actions deploying with a Cloudflare API token | No Cloudflare credential stored in GitHub (CI-05) |
| Third-party services | Cloudflare (DNS, Workers, Access, Web Analytics); GitHub (repo, Actions) | — | — | |
| Not needed (deliberately) | Backend/API, database, user auth, file storage, background jobs, app secrets, error tracker | — | — | Static, public-content site |

## Commands

The standard tasks (CI-01). Every agent uses these exact commands. They are
defined in `package.json`; CI runs `pnpm verify` (`.github/workflows/ci.yml`).

| Task | Command |
| --- | --- |
| Install | `pnpm install --frozen-lockfile` |
| Run locally (`test` environment) | `pnpm dev` (authoring) · `pnpm preview` (built site on `wrangler dev`) |
| Format check / lint / typecheck | `pnpm format:check` · `pnpm lint` · `pnpm typecheck` |
| Unit and integration tests | n/a until the first logic module lands (OVR-002) |
| Access-policy tests (if the stack has database policies) | n/a (no database) |
| End-to-end tests | `pnpm test:e2e` |
| **Verify (everything CI runs)** | `pnpm verify` |

## Environments

| | test | staging | production |
| --- | --- | --- | --- |
| Git branch | `test` | `staging` | `production` |
| Runs on | Local machine | Worker `garrisonhutcherson-staging` at `staging.garrisonhutcherson.com` (behind Cloudflare Access) | Worker `garrisonhutcherson` at `garrisonhutcherson.com` (`www` redirects to apex) |
| Project / account | None (offline) | Shared Cloudflare account (OVR-001) | Shared Cloudflare account (OVR-001) |
| Config source | `wrangler.jsonc` top level + `.dev.vars` (untracked, empty by default) | `wrangler.jsonc` `env.staging` | `wrangler.jsonc` top level (`env.production` if needed) |
| Secrets | None | None | None |

## Where the standards live in this stack

| Concept | Location in this project |
| --- | --- |
| Feature modules (ARCH-02) | `src/components/<section>/` for page sections; shared UI in `src/components/ui/` |
| Entry points: UI mutations, HTTP routes, jobs (ARCH-04) | `src/pages/` (static routes only; no mutations, endpoints, or jobs) |
| Data access layer and authorization helpers (ARCH-06, SEC-AZ-01) | `src/lib/content.ts` wraps `astro:content`; no authorization (public content) |
| Database access policies, if any (SEC-AZ-01) | n/a |
| Configuration module (ARCH-07) | `astro.config.mjs` (`site`, build options) and `src/lib/config.ts` |
| Errors and logger modules (OBS-02, OBS-06) | n/a at runtime (no server code); build errors fail the build. `src/pages/404.astro` |
| Security headers (SEC-WEB-01..06) | `public/_headers` (served by Workers static assets), asserted by an e2e test |
| Schema / migration / index files (DB-08) | `src/content.config.ts` (content collection schemas) |

## Differences from the stack profile

| Profile rule or default | What this project does instead | Why |
| --- | --- | --- |
| Latest stable TypeScript (SEL-11) | TypeScript 6.0.x; Dependabot ignores `>=6.1.0` | TypeScript 7 (native) isn't supported yet by `typescript-eslint` (needs `<6.1`) or `@astrojs/check` (needs `<7`). Revisit when both support it |
| Prettier formats Markdown (STY-01 tooling table) | Prettier skips docs and agent-rule Markdown; markdownlint checks it (OVR-004). Site content in `src/content/` is still formatted | Prettier pads every table to full width, bloating always-loaded agent context and diverging from template docs |
| `pnpm` install scripts | Only `esbuild` and `workerd` may run install scripts (`pnpm-workspace.yaml` `allowBuilds`) | pnpm blocks dependency install scripts by default; these two need native binaries |
