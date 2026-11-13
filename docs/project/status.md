---
id: project/status
version: 0.3.0
load_when: Start of every coding session (with codemap.md), and end of every session to leave a handoff.
---

# Status

Short-lived state for continuity between sessions and agents. Keep it under
40 lines; history belongs in git and ADRs, not here.

**Last updated:** 2026-11-12 by Claude Code

## Current focus

- New-project setup (`docs/checklists/new-project-setup.md`). §0 (stack) is
  done: Astro + TypeScript on Cloudflare Workers static assets (ADR 0002).

## In progress

- Nothing on a branch yet. The folder is not a git repository.

## Next up

1. Define the site's scope and sections with the owner (`overview.md`).
2. §1 Repository: `git init`, delete the unused `docs/stacks/nextjs-firebase/`,
   create branches `test`/`staging`/`production`, `.gitignore`,
   `.editorconfig`, and fill the remaining `{{…}}` placeholders.
3. §2 Scaffold per `docs/stacks/astro-cloudflare/setup.md`.
4. §5 Docs: ADR 0001 is written; `codemap.md`, `data-model.md`,
   `security-decisions.md`, and `glossary.md` remain.

## Blockers and open questions

- None. Local Node.js upgraded to 26.13.1 LTS on 2026-11-13; pnpm runs
  through a globally installed Corepack.

## Handoff notes

- Overrides OVR-001 (one Cloudflare account), OVR-002 (no unit layer yet), and
  OVR-003 (static CSP without a nonce) are active until 2027-11-12.
- The `astro-cloudflare` profile is Draft and was written before scaffolding.
  Check its config snippets (`_headers`, `wrangler.jsonc`, Workers Builds
  settings) against current Astro and Wrangler docs during setup.
