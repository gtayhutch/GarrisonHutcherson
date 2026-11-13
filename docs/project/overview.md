---
id: project/overview
version: 1.0.0
load_when: A task needs product context — scope, users, roles, critical journeys, stack versions, environment URLs.
---

# GarrisonHutcherson.com — project overview

## Purpose

People evaluating Garrison Hutcherson professionally (recruiters, hiring
managers, collaborators) need a fast, credible place to see Garrison's experience
and skills. GarrisonHutcherson.com is that place: a clean, professional site that
loads almost instantly on any device.

## Users and roles

| Role | Who | Can do |
| --- | --- | --- |
| Visitor | Anyone on the public internet | Read public pages. No sign-in, no input |
| Owner | Garrison Hutcherson | Edits content and code through pull requests; manages Cloudflare and GitHub |

## Scope

**In scope for the current milestone:** to be defined with the owner before
scaffolding. Candidates: home/intro, experience, skills, projects, contact
links.

**Non-goals** (things we are deliberately not building):

- User accounts, sign-in, or any stored visitor data
- Purchases or payments
- A CMS or editing UI (content lives in the repo)
- Server-side features (forms, APIs). Adding one is a stack change (SEL-10)

## Critical user journeys

These are covered by end-to-end tests (TEST-02) and the staging smoke suite
(CI-08). Finalize them with the scope.

1. Open the home page on mobile → see who Garrison is and how to get in touch.
2. Navigate to experience and skills → read the details → follow a contact or
   profile link.

## Platforms and stack

Platforms: web (mobile and desktop browsers).
Stack, versions, and commands: see `stack.md`.

## Performance budgets

Web: Core Web Vitals "good" per FE-10 on mobile (LCP ≤ 2.5 s, INP ≤ 200 ms,
CLS ≤ 0.1). The aim is well under these limits: zero JavaScript by default and
optimized images.

## Security profile

- ASVS level: **L1**
- Data classes present: Public only
- Regulations to consider: none known (no personal data collected;
  cookieless analytics)
- Open overrides: see `overrides.md` (OVR-001..003)

## Environments

| Environment | URL | Console |
| --- | --- | --- |
| test | `http://localhost:4321` (`astro dev`) · `http://localhost:8787` (`wrangler dev`) | — |
| staging | `https://staging.garrisonhutcherson.com` (Cloudflare Access) | Cloudflare dashboard → Workers → `garrisonhutcherson-staging` |
| production | `https://garrisonhutcherson.com` | Cloudflare dashboard → Workers → `garrisonhutcherson` |

## Key decisions

See `decisions/README.md` for the full index. The most important:

- ADR-0001 Adopt engineering standards v2.0.0
- ADR-0002 Stack selection: Astro + TypeScript on Cloudflare Workers static
  assets
