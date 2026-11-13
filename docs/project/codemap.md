---
id: project/codemap
version: 1.0.0
load_when: Start of any coding task. Read this instead of crawling the repository.
---

# Codemap

One line per module: where it is and what it is responsible for. Update it in
the same commit as any structural change (DOC-06). Keep it under 150 lines; if
a feature needs more detail, put it in the module header of that feature's
public interface (DOC-03).

**State:** scaffolded (2026-11-13). Rows marked "planned" arrive with the
design PR; change them to "exists" as each path is created.

## Top level

| Path | Responsibility | State |
| --- | --- | --- |
| `src/pages/` | Static routes only; thin (ACF-01). Now: `index.astro` (placeholder), `404.astro` | exists |
| `src/layouts/` | Page shells. Now: `BaseLayout.astro` (`<head>`, canonical URL, `<main>`) | exists |
| `src/components/<section>/` | One folder per page section (feature slice) | planned |
| `src/components/ui/` | Shared presentational components | planned |
| `src/content/` + `src/content.config.ts` | Content entries and their schemas (ACF-03) | planned |
| `src/lib/` | `config.ts` (site identity, `pageTitle`) exists; `content.ts` (typed content access) planned | partly |
| `src/styles/` | `tokens.css` (design tokens), `global.css` (reset, base) | planned |
| `src/assets/` | Images processed by `astro:assets` | planned |
| `public/` | `_headers`, `robots.txt`, `favicon.svg` exist; `fonts/` planned | partly |
| `tests/e2e/` | Playwright specs: `pages.test.ts` (smoke, axe, no-script, 404), `security_headers.test.ts`; `routes.ts` lists every page | exists |
| `astro.config.mjs`, `wrangler.jsonc`, `playwright.config.ts` | Build, hosting, and test config | exists |
| `eslint.config.js`, `prettier.config.mjs`, `.stylelintrc.json`, `.markdownlint-cli2.jsonc` | Lint and format config (STY-01) | exists |
| `.github/workflows/ci.yml`, `.github/dependabot.yml` | CI `verify` on PRs; weekly dependency PRs into `test` | exists |
| `docs/` | Standards, profile, and project docs | exists |
| `.claude/rules/`, `.agents/rules/` | Path-scoped agent rules | exists |

## Features

Page sections are defined with the site's scope (`overview.md`); add one row
each when created.

| Feature | Path | Responsibility | Public interface | Patterns |
| --- | --- | --- | --- | --- |
| — | — | — | — | — |

## Shared modules

| Module | Responsibility | Notes |
| --- | --- | --- |
| config | `src/lib/config.ts`: `SITE` metadata and `pageTitle()` (ARCH-07) | The only place for site identity values |
| content | `src/lib/content.ts`: typed reads over `astro:content` (ARCH-06) | Components never call `getCollection` directly |
| errors / logger | n/a: no runtime server code | The build fails on errors |
| authz | n/a: all content is public | |

## Background jobs

None (static site).

## Scripts

None yet.
