---
id: project/status
version: 0.6.0
load_when: Start of every coding session (with codemap.md), and end of every session to leave a handoff.
---

# Status

Short-lived state for continuity between sessions and agents. Keep it under
40 lines; history belongs in git and ADRs, not here.

**Last updated:** 2026-11-13 by Claude Code

## Current focus

- Scaffold PR (`feat/scaffold`): Astro, tooling, `_headers`, Playwright, CI.
  `pnpm verify` passes locally. Next: the design and pages PR.

## In progress

- `feat/scaffold` → `test`. After its CI run, add `verify` as a required
  status check on all three rulesets and enable CodeQL default setup.

## Next up

1. Owner sends real content: profile, experience, skills, strengths,
   projects, contact email, LinkedIn and GitHub URLs.
2. Design PR (`feat/site-design`): tokens from the mock-up, header nav,
   contact band, SVG hero, content collections, and pages Home, About,
   Experience, Skills, Projects, Contact, and `/resume` (HTML).
3. 👤 Cloudflare: hardening checklist, Workers Builds for both Workers,
   custom domains, Access on staging, Web Analytics (`setup.md` step 7).

## Blockers and open questions

- The design PR waits on the owner's real content (no placeholders on the
  live site).

## Handoff notes

- Overrides OVR-001..004 are active (OVR-004: Prettier skips docs Markdown).
- TypeScript is pinned to 6.0.x until `typescript-eslint` and
  `@astrojs/check` support 7; Dependabot ignores `>=6.1.0`.
- `.astro` components use PascalCase names (ACF-08).
- Local Node.js is 26.13.1 LTS; pnpm runs through a global Corepack install.
