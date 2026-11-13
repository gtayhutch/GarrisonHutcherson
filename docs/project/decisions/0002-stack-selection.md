# 0002. Stack selection: Astro + TypeScript on Cloudflare Workers static assets

- **Status:** Accepted
- **Date:** 2026-11-12
- **Deciders:** Garrison Hutcherson (stack interview run by Claude Code)
- **Rules affected:** SEL-01..12, ENV-02, ENV-11, CI-05, TEST-02, TEST-03, SEC-WEB-02, STY-02

## Context

GarrisonHutcherson.com is a professional site that presents Garrison
Hutcherson's experience and skills. It serves public content only: no
sign-up, sign-in, purchases, or stored user data, so the target is ASVS L1.
The priorities are a clean, professional design and extremely fast loads on
mobile and desktop. Expected traffic is under 1k visitors a month. One person
builds and maintains it with AI agents. Cloudflare hosting was a firm
preference, and the domain is already on Cloudflare DNS.

## Options considered

1. **Framework.** Astro (chosen): content-focused, zero JS by default, typed
   content collections, image optimization. Eleventy: minimal and mature, but
   weaker typing and image tooling. Hugo: fastest builds, but Go templates and
   no TypeScript. Plain HTML/CSS: no build step, but repeated markup and no
   content model.
2. **Language.** TypeScript (chosen) over JavaScript (less tooling help) or no
   code language (blocks interactive features later).
3. **Cloudflare product.** Workers static assets (chosen): Cloudflare's current
   recommendation for new projects, where new features land first. Cloudflare
   Pages: simpler Git integration and per-branch previews, but new platform
   work goes to Workers.
4. **Environment isolation.** Two Workers in one account (chosen, OVR-001) over
   two Cloudflare accounts (full ENV-11 isolation, but two logins and DNS
   delegation for no real gain on a site with no data or secrets).
5. **Styling.** Hand-written CSS with tokens (chosen) over Tailwind CSS (extra
   dependency, busy markup) or a component library (heavier, generic look).
6. **Content.** Markdown/YAML in the repo (chosen) over JSON/TS data files
   (awkward for prose) or a headless CMS (extra hosted service).
7. **Testing.** Playwright with axe (chosen, OVR-002) over Vitest + Playwright,
   with or without Lighthouse CI.
8. **CI/CD.** GitHub Actions for `verify` plus Cloudflare Workers Builds for
   deploys (chosen), over GitHub Actions deploying with a long-lived Cloudflare
   API token (Cloudflare offers no OIDC federation, so that would need a CI-05
   override).
9. **Supporting choices.** pnpm (over npm and Bun); Cloudflare Web Analytics
   (over none and GA4); staging behind Cloudflare Access (over public staging
   with `noindex`).

## Decision

Build the site with Astro (static output) in strict TypeScript, styled with
hand-written CSS, with content in Markdown/YAML collections. Host it on
Cloudflare Workers static assets: one Worker per environment, both in one
Cloudflare account, with staging behind Cloudflare Access. GitHub Actions runs
`verify`; Cloudflare Workers Builds deploys the `staging` and `production`
branches. The main reason: this gives a static, zero-JS-by-default site served
from Cloudflare's edge, which is the fastest and cheapest setup to run for a
solo maintainer.

A new stack profile, `docs/stacks/astro-cloudflare/`, is created as Draft
(SEL-09) and flagged for the template repository.

## Consequences

- Pages are prebuilt HTML on a global CDN: very fast, nearly free, and with no
  server code to secure or patch.
- Content edits are commits. There is no editing UI, by choice.
- Three standards are relaxed by overrides in `docs/project/overrides.md`:
  ENV-11 (one Cloudflare account, OVR-001), TEST-02/03 (no unit layer until
  logic exists, OVR-002), and SEC-WEB-02 (static CSP without a per-request
  nonce, OVR-003).
- `.astro` files have no Google style guide (STY-02). They follow the
  TypeScript and HTML/CSS guides, formatted by Prettier's Astro plugin.
- Adding any server feature later (a contact form, an API route, KV, or D1) is
  a stack change under SEL-10 and needs a new ADR.
- Follow-ups: scaffold per the profile's setup steps; create the two Workers,
  the Access application, and the Web Analytics site; and upgrade local Node.js
  to the 26.x LTS.
