# GarrisonHutcherson.com

The professional website of Garrison Hutcherson: a fast, clean showcase of
professional experience and skills for recruiters, hiring managers, and
contacts. It serves public content only. There are no accounts, forms, or
stored user data.

## Quick start (local `test` environment)

Prerequisites: Node.js 26.x LTS (pinned in `.nvmrc`) and pnpm (pinned in
`package.json` `packageManager`; Node 26 doesn't bundle Corepack, so run
`npm install -g corepack` and then `corepack enable pnpm`). See
`docs/project/stack.md`.

```bash
pnpm install --frozen-lockfile   # install dependencies
pnpm dev                         # start the site locally (astro dev)
pnpm verify                      # everything CI runs: format, lint, types, build, e2e
```

The local environment cannot reach hosted data, so nothing you do locally can
touch staging or production.

## Stack

Astro (static output) + TypeScript + hand-written CSS, with content in
Markdown/YAML collections, hosted on Cloudflare Workers static assets. Full
decisions, versions, and commands: `docs/project/stack.md`.

## Environments

| Environment | Git branch | Where it runs |
| --- | --- | --- |
| test | `test` | Your machine |
| staging | `staging` | `staging.garrisonhutcherson.com` (Cloudflare Worker, behind Cloudflare Access) |
| production | `production` | `garrisonhutcherson.com` (Cloudflare Worker) |

Promotion is always by pull request: feature → `test` → `staging` →
`production`. See `docs/standards/environments.md` and
`docs/standards/git-workflow.md`.

## Documentation

| Start here | For |
| --- | --- |
| `AGENTS.md` | Rules every contributor follows, and which doc to read for which task |
| `docs/README.md` | Map of all documentation and how the standards are organized |
| `docs/project/overview.md` | What this project is, its scope, and its key decisions |
| `docs/project/codemap.md` | Where everything lives in the code |

## Contributing

Read `AGENTS.md`, branch from `test`, and open a pull request using the
template. Every change must pass the verify command and the Definition of
Done in `docs/checklists/definition-of-done.md`.
