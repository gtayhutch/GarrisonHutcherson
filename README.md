# GarrisonHutcherson.com

The professional website of Garrison Hutcherson: a fast, clean showcase of
experience and skills in technical support and client success. It serves
public content only. There are no accounts, forms, or stored visitor data.

## Quick start

Prerequisites: Node.js 26.x LTS (pinned in `.nvmrc`) and pnpm (pinned in
`package.json` `packageManager`). Node 26 doesn't bundle Corepack, so run
`npm install -g corepack` and then `corepack enable pnpm`.

```bash
pnpm install --frozen-lockfile   # install dependencies
pnpm dev                         # start the site locally (astro dev)
pnpm verify                      # everything CI runs: format, lint, types, build, e2e, dependency audit
```

## Stack

- [Astro](https://astro.build) with static output, TypeScript, and
  hand-written CSS. The site ships no JavaScript of its own; the only script
  is the cookieless Cloudflare Web Analytics beacon, which staging builds
  leave out (`PUBLIC_WEB_ANALYTICS=false`).
- Colors live in `src/styles/tokens.css`; the hero's space scene is an SVG
  animated with CSS only and stays still for visitors who prefer reduced
  motion.
- Images (headshot, logo) are optimized at build time by `astro:assets`;
  the favicon set and web manifest live in `public/`.
- Content lives in Markdown and YAML collections under `src/content/`,
  validated by the schemas in `src/content.config.ts`.
- Hosted on Cloudflare Workers static assets (`wrangler.jsonc`), with
  security headers and the HTML charset in `public/_headers`. Cloudflare
  Workers Builds deploys the `staging` and `production` branches.
- Playwright end-to-end tests, including axe accessibility checks, in
  `tests/e2e/`.

## Environments

| Environment | Git branch | Where it runs |
| --- | --- | --- |
| test | `test` | Local machine |
| staging | `staging` | `staging.garrisonhutcherson.com` (Cloudflare Worker, behind Cloudflare Access) |
| production | `production` | `garrisonhutcherson.com` (Cloudflare Worker) |

Changes go through pull requests: feature branch → `test` → `staging` →
`production`. Every pull request must pass `pnpm verify` in CI.

## License

© Garrison Hutcherson. All rights reserved.
