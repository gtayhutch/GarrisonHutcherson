---
id: stacks/astro-cloudflare
version: 0.1.0
load_when: The project's stack.md names this profile and the task needs stack-specific details (layout, commands, framework rules, security headers, testing).
---

# Profile: Astro (static) on Cloudflare Workers static assets

Status: Draft (PRF-05) · Rule prefix: `ACF-`

Environments, CI and deploy, hardening, and setup steps are in `setup.md` in
this folder.

## Rules

- **ACF-01 Static output only.** `astro.config.mjs` sets `output: 'static'`
  with no server adapter. No on-demand routes (`prerender = false`), no API
  endpoints, no Worker script (`main`) in `wrangler.jsonc`. Adding any of these
  is a stack change (SEL-10).
- **ACF-02 Zero JavaScript by default.** Pages ship no client JS unless a
  feature needs it. If one does, use a small `<script>` in the component
  (Astro bundles it as an external module) or an island with
  `client:visible`/`client:idle`. No UI-framework integration (React, Svelte,
  and so on) without SEL-10. Avoid `is:inline` scripts; if one is unavoidable,
  add its hash to the CSP (OVR-003).
- **ACF-03 Content goes through collections.** Every content file under
  `src/content/` belongs to a collection whose schema in
  `src/content.config.ts` validates it at build time (SEC-02 at the build
  boundary). Components read content only through `src/lib/content.ts`.
- **ACF-04 Images via `astro:assets`.** Local images use `<Image>`/`<Picture>`
  with `alt`, explicit dimensions, and modern formats. The LCP image uses
  `loading="eager"` and `fetchpriority="high"`; all others lazy-load.
- **ACF-05 No raw HTML injection.** `set:html` is allowed only for Markdown
  that Astro rendered at build time from repository content (SEC-IO-01).
- **ACF-06 Self-hosted fonts.** No font or asset CDNs. Import a Fontsource
  package's CSS from the global stylesheet (Vite emits the WOFF2 files to
  `/_astro/`), use `font-display: swap`, and preload the Latin face via a
  `?url` import. Don't use Astro's `<Font>` component: it emits an inline
  `<style>`, which the static CSP (`style-src 'self'`) blocks.
- **ACF-07 One home for headers.** Response headers live only in
  `public/_headers`, and an e2e test asserts them (SEC-WEB-01..06).
- **ACF-08 Framework-reserved names.** File names in `src/pages/` become URLs
  (kebab-case). `.astro` components and layouts use PascalCase
  (`BaseLayout.astro`), as Astro and its tooling expect; TypeScript modules
  keep TS-08 snake_case. `astro.config.mjs`, `src/content.config.ts`, and
  tool configs (`playwright.config.ts`, `eslint.config.js`) are
  framework-required names and may default-export (TS-03 exception).
- **ACF-09 No Cloudflare bindings.** No KV, D1, R2, Durable Objects, or
  secrets. Adding one ends OVR-001 and needs SEL-10.

## Summary

Astro builds every page to static HTML and CSS at build time. Cloudflare
Workers static assets serves the `dist/` folder from Cloudflare's edge with no
Worker code running. This suits public, content-driven sites (portfolios,
documentation, marketing pages) that must be very fast and cheap to run.

**Choose it when:** content is public, changes through commits, and needs no
per-request logic.
**Avoid it when:** you need user accounts, stored user data, forms that post
to your own backend, or per-request personalization. Use a profile with a
server runtime instead.

## Components and versions

| Component | Choice | Version policy |
| --- | --- | --- |
| Languages | TypeScript (`astro/tsconfigs/strictest`), CSS, Markdown/YAML | Latest stable that `typescript-eslint` and `@astrojs/check` support |
| Framework(s) | Astro, static output | Latest stable major; upgrade within 3 months of a new major |
| Database | None | — |
| Authentication | None for the site; Cloudflare Access gates staging | — |
| Hosting | Cloudflare Workers static assets via Wrangler | Wrangler latest stable |
| Local `test` environment | `astro dev`; `wrangler dev` serving `dist/` | — |
| Runtime / packages | Node.js active LTS, pnpm | Pinned in `.nvmrc` and `packageManager` (DEP-04) |
| Tests | Playwright + `@axe-core/playwright` | Latest stable |

## Folder layout and concept map

```text
src/
  pages/          routes only; thin (index.astro, 404.astro, …)
  layouts/        page shells: <head>, meta, nav, footer
  components/
    ui/           shared presentational components
    <section>/    one folder per page section (hero, experience, skills, …)
  content/        Markdown/YAML entries, one folder per collection
  content.config.ts  collection schemas
  lib/            config.ts, content.ts (typed content access), helpers
  styles/         tokens.css (custom properties), global.css (reset, base)
  assets/         images processed by astro:assets
public/           copied as-is: _headers, robots.txt, fonts/, favicon
tests/e2e/        Playwright specs
astro.config.mjs · wrangler.jsonc · playwright.config.ts
```

| Universal concept | In this stack |
| --- | --- |
| Feature module and its public interface (ARCH-02) | `src/components/<section>/`; its entry component is the interface |
| Server-only boundary and how it's enforced (ARCH-03) | No runtime server code. Build-time code runs only in frontmatter and `src/lib/` |
| Entry points: UI mutations, HTTP routes, RPC, jobs (ARCH-04) | `src/pages/` static routes only |
| Repositories (ARCH-06) | `src/lib/content.ts` over `astro:content` |
| Config module (ARCH-07) | `astro.config.mjs` (`site`) and `src/lib/config.ts`; any build-time variables are declared with `astro:env` schemas |
| Errors / logger modules (OBS-02, OBS-06) | None at runtime. Build fails loudly; `src/pages/404.astro` |
| Security headers (SEC-WEB-01..06) | `public/_headers` |
| Database access policies, if any (SEC-AZ-01) | n/a |
| Error boundaries (OBS-14) | n/a (no client framework); the 404 page covers unknown routes |

## Commands (CI-01)

Defined as `package.json` scripts.

| Task | Command |
| --- | --- |
| `format-check` / `lint` / `typecheck` | `pnpm format:check` (`prettier --check .`) · `pnpm lint` (ESLint, Stylelint, markdownlint) · `pnpm typecheck` (`astro check`) |
| `test` / `test-policies` / `test-e2e` | n/a (OVR-002) · n/a · `pnpm test:e2e` (`playwright test`) |
| `build` / `verify` | `pnpm build` (`astro build`) · `pnpm verify` (format:check → lint → typecheck → build → test:e2e) |
| Local run | `pnpm dev` (`astro dev`) · `pnpm preview` (`wrangler dev`, serves `dist/` with `_headers` applied) |

Playwright starts `wrangler dev` itself (`webServer` in `playwright.config.ts`)
against the already-built `dist/`, so `pnpm build` must run first;
`pnpm verify` does.

## Security implementation

- **Authentication and sessions:** none on the site. Staging uses a
  Cloudflare Access application (see `setup.md`).
- **Access control:** all content is public. Nothing private may be committed
  to `src/content/` or `public/`.
- **Headers** (`public/_headers`, for `/*`):
  `Strict-Transport-Security: max-age=31536000; includeSubDomains` ·
  `Content-Security-Policy: default-src 'self'; script-src 'self' https://static.cloudflareinsights.com; connect-src 'self' https://cloudflareinsights.com; img-src 'self' data:; style-src 'self'; font-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; upgrade-insecure-requests` ·
  `X-Content-Type-Options: nosniff` ·
  `Referrer-Policy: strict-origin-when-cross-origin` ·
  `Permissions-Policy: camera=(), microphone=(), geolocation=()` ·
  `Cross-Origin-Opener-Policy: same-origin`.
  `astro.config.mjs` sets `build.inlineStylesheets: 'never'` so
  `style-src 'self'` holds; the dev toolbar is disabled.
- **Secrets:** none exist. Wrangler and Workers Builds credentials stay in
  Cloudflare. `.dev.vars` and `.env*` are gitignored anyway.
- **Client storage:** none. Web Analytics is cookieless.

## Data

No database. Content collections are the data model: each collection's
schema in `src/content.config.ts` is its migration-free contract (DB-08).
Record the collections in `docs/project/data-model.md`.

## Testing

| TEST-02 layer | Tool | Notes |
| --- | --- | --- |
| Unit | Vitest, added with the first logic module (OVR-002) | — |
| Integration / access policies | n/a | No server, no database |
| End-to-end | Playwright against `pnpm preview` (`wrangler dev` on `dist/`) | Runs with the real `_headers` |

Every page gets a smoke test: it returns 200, has no console errors, passes
an axe scan with no violations (TEST-11), and ships no unexpected `<script>`
(ACF-02). One spec asserts every header in `public/_headers` (TEST-10).

```ts
test('home page passes axe with no violations', async ({page}) => {
  await page.goto('/');
  const results = await new AxeBuilder({page}).analyze();
  expect(results.violations).toEqual([]);
});
```

## Agent rules

`agent-rules/claude/` and `agent-rules/antigravity/` hold path-scoped rules
for content, UI components, and headers/deploy config. They are copied into
`.claude/rules/` and `.agents/rules/`.
