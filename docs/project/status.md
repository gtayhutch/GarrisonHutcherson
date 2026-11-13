---
id: project/status
version: 0.5.0
load_when: Start of every coding session (with codemap.md), and end of every session to leave a handoff.
---

# Status

Short-lived state for continuity between sessions and agents. Keep it under
40 lines; history belongs in git and ADRs, not here.

**Last updated:** 2026-11-13 by Claude Code

## Current focus

- New-project setup (`docs/checklists/new-project-setup.md`). §0 (stack) and
  §1 (repository) are done; §4 and §6 are partly done.

## In progress

- Public repo `gtayhutch/GarrisonHutcherson`; `test` is the default branch.
  Rulesets make `test`/`staging`/`production` PR-only (no deletion or
  force-push); secret scanning, push protection, and Dependabot alerts are on.
- `.claude/settings.json` denies deploys, rollbacks, pushes to `staging` or
  `production`, and `gh pr merge` for agents; Claude attribution is off.

## Next up

1. Define the site's scope and sections with the owner (`overview.md`), then
   the content collections (`data-model.md`).
2. Add `verify` as a required status check once `ci.yml` exists; enable
   CodeQL and `dependabot.yml` with the scaffold (§4).
3. §2 Scaffold per `docs/stacks/astro-cloudflare/setup.md` on `feat/scaffold`.
4. Decide whether to rewrite the 3 initial commits to drop the Claude
   co-author trailer (needs the rulesets briefly disabled).

## Blockers and open questions

- None.

## Handoff notes

- Overrides OVR-001..003 are active until 2027-11-12.
- The `astro-cloudflare` profile is Draft. Check its config snippets against
  current Astro and Wrangler docs while scaffolding.
- `codemap.md` lists the planned layout as "planned"; update it as paths are
  created.
- Local Node.js is 26.13.1 LTS; pnpm runs through a global Corepack install.
