---
id: project/codemap
version: 1.1.0
load_when: Start of any coding task. Read this instead of crawling the repository.
---

# Codemap

One line per module: where it is and what it is responsible for. Update it in
the same commit as any structural change (DOC-06). Keep it under 150 lines; if
a feature needs more detail, put it in the module header of that feature's
public interface (DOC-03).

## Top level

| Path | Responsibility |
| --- | --- |
| `src/pages/` | Static routes only, thin (ACF-01): `index`, `about`, `experience`, `skills`, `projects`, `contact`, `resume`, `404` |
| `src/layouts/BaseLayout.astro` | `<head>` metadata, font preload, skip link, header, `<main>`, contact band, footer |
| `src/components/<section>/` | Page sections (feature slices), listed below |
| `src/components/ui/` | Shared presentational components: `Button`, `Icon`, `IconTile`, `Tag`, `SectionHeading`, `GitHubIcon` |
| `src/content/` + `src/content.config.ts` | Content entries and their schemas (ACF-03); see `data-model.md` |
| `src/lib/` | `config.ts` (identity, contact, nav), `content.ts` (typed content access) |
| `src/styles/` | `tokens.css` (design tokens), `global.css` (font import, reset, base, print) |
| `public/` | `_headers`, `robots.txt`, `favicon.svg` |
| `tests/e2e/` | Playwright: `pages.test.ts` (smoke, axe, no-script, 404), `site.test.ts` (nav, order, contact, mobile menu, print), `security_headers.test.ts`; `routes.ts` lists every page |
| `astro.config.mjs`, `wrangler.jsonc`, `playwright.config.ts` | Build, hosting, and test config |
| `eslint.config.js`, `prettier.config.mjs`, `.stylelintrc.json`, `.markdownlint-cli2.jsonc` | Lint and format config (STY-01) |
| `.github/workflows/ci.yml`, `.github/dependabot.yml` | CI `verify` on PRs; weekly dependency PRs into `test` |
| `.claude/launch.json` | Local preview servers for the Claude desktop browser pane (`astro dev`, `wrangler dev`) |
| `docs/` | Standards, profile, and project docs |
| `.claude/rules/`, `.agents/rules/` | Path-scoped agent rules |

## Features

| Feature | Path | Responsibility | Public interface |
| --- | --- | --- | --- |
| site | `src/components/site/` | Header with no-JS mobile menu, contact band, footer, inner-page header | `SiteHeader`, `ContactBand`, `SiteFooter`, `PageHeader` |
| home | `src/components/home/` | Hero with SVG mountain scene, key strengths | `Hero`, `HeroScene`, `Strengths` |
| experience | `src/components/experience/` | Employer timeline, `compact` (home) or `full` (Experience page) | `ExperienceTimeline` |
| skills | `src/components/skills/` | Skill groups, `list` (home) or `grid` (Skills page) | `SkillGroups` |

## Shared modules

| Module | Responsibility | Notes |
| --- | --- | --- |
| config | `src/lib/config.ts`: `SITE`, `CONTACT`, `NAV`, `RESUME_PATH`, `pageTitle()` (ARCH-07) | The only place for identity and contact values; public data only |
| content | `src/lib/content.ts`: `getExperience`, `getSkillGroups`, `getStrengths`, `getProjects`, `getPage` (ARCH-06) | Components never call `getCollection` directly |
| errors / logger | n/a: no runtime server code | The build fails on errors |
| authz | n/a: all content is public | |

## Background jobs

None (static site).

## Scripts

None yet.
