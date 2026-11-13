---
id: project/status
version: 0.4.0
load_when: Start of every coding session (with codemap.md), and end of every session to leave a handoff.
---

# Status

Short-lived state for continuity between sessions and agents. Keep it under
40 lines; history belongs in git and ADRs, not here.

**Last updated:** 2026-11-13 by Claude Code

## Current focus

- New-project setup (`docs/checklists/new-project-setup.md`). §0 (stack) and
  §1 (repository, local part) are done.

## In progress

- Nothing on a feature branch. Local repo exists with branches `test`
  (default), `staging`, and `production` at the same commit; no remote yet.

## Next up

1. Define the site's scope and sections with the owner (`overview.md`), then
   the content collections (`data-model.md`).
2. 👤 Create the GitHub repository, push the three branches, make `test` the
   default (new-project-setup §1 and §4).
3. §2 Scaffold per `docs/stacks/astro-cloudflare/setup.md` on `feat/scaffold`.
4. §6 `.claude/settings.json` deny rules for deploys and pushes to
   `staging`/`production`.

## Blockers and open questions

- None.

## Handoff notes

- Overrides OVR-001..003 are active until 2027-11-12.
- The `astro-cloudflare` profile is Draft. Check its config snippets against
  current Astro and Wrangler docs while scaffolding.
- `codemap.md` lists the planned layout as "planned"; update it as paths are
  created.
- Local Node.js is 26.13.1 LTS; pnpm runs through a global Corepack install.
