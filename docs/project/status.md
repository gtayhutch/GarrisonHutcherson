---
id: project/status
version: 0.7.0
load_when: Start of every coding session (with codemap.md), and end of every session to leave a handoff.
---

# Status

Short-lived state for continuity between sessions and agents. Keep it under
40 lines; history belongs in git and ADRs, not here.

**Last updated:** 2026-11-13 by Claude Code

## Current focus

- Design PR (`feat/site-design`): design system from the owner's mock-up and
  all pages (Home, About, Experience, Skills, Projects, Contact, Résumé),
  with real content from the owner's résumé. `pnpm verify` passes locally.

## In progress

- `feat/site-design` → `test`, awaiting the owner's review of the content
  wording and the design.

## Next up

1. 👤 Cloudflare setup (`docs/stacks/astro-cloudflare/setup.md` step 7):
   hardening, Workers Builds for both Workers, custom domains, Access on
   staging, Web Analytics, and Email Routing for `garrison@` (ADR 0003).
2. First promotion `test` → `staging`, then check headers, Access, and the
   pages on staging before `production` (`docs/checklists/release.md`).
3. Optional: add a LinkedIn link once the owner provides the URL
   (`CONTACT` in `src/lib/config.ts` and the contact band).

## Blockers and open questions

- None for the code. Deploys wait on the owner's Cloudflare setup.

## Handoff notes

- Content lives in `src/content/` (see `data-model.md`). Never add the
  owner's phone, street address, or personal email; a test enforces it.
- The About page and strength cards are drafted from the résumé; the owner
  may rewrite them.
- Overrides OVR-001..004 are active. TypeScript is pinned to 6.0.x.
