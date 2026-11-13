---
id: project/overrides
version: 0.2.0
load_when: A standard can't be followed as written, or you need to know which deviations are approved for this project.
---

# Overrides

Approved deviations from `docs/standards/`. An override is valid only if it is
listed here with every column filled in. Expired overrides are fixed or
renewed in a PR; they are never silently left in place.

| ID | Rule | Deviation | Reason | Compensating control | Approved by | Expires | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| OVR-001 | ENV-11 | `staging` and `production` are two separate Workers in one Cloudflare account, not separate accounts | Static site with no data, bindings, or secrets, so nothing sensitive is shared; a second account adds logins and DNS delegation for no real gain | Separate Workers and hostnames; staging behind Cloudflare Access; MFA on the Cloudflare account; Workers Builds deploy tokens scoped per Worker. Revisit if any binding (KV, D1, R2) or secret is added | Garrison Hutcherson | 2027-11-12 | Active |
| OVR-002 | TEST-02 (unit layer), TEST-03 (coverage floors) | Playwright end-to-end tests only; no unit tests or coverage gate | The site has no domain logic: pages render schema-checked content | Content schemas in `src/content.config.ts` fail the build on bad data; Playwright plus axe covers every page. Add Vitest and coverage in the same PR as the first logic module in `src/lib/` | Garrison Hutcherson | 2027-11-12 | Active |
| OVR-003 | SEC-WEB-02 | CSP has no per-request nonce. It is static, in `public/_headers`: `script-src 'self'` plus hashes for any inline script, `object-src 'none'; base-uri 'none'; frame-ancestors 'none'` | Prebuilt static HTML cannot carry a per-request nonce without adding server code; the nonce requirement is ASVS L2, and the target is L1 | No inline scripts except hashed ones; no user-generated content; allowed third-party origins (Web Analytics only) listed in `security-decisions.md`; an e2e test asserts the header | Garrison Hutcherson | 2027-11-12 | Active |
| OVR-004 | STY-01 (Markdown row of the tooling table) | Prettier does not format docs or agent-rule Markdown; markdownlint (`.markdownlint-cli2.jsonc`) is the only Markdown check outside `src/content/` | Prettier pads tables to full width, which bloats `AGENTS.md` and other always-loaded agent context and diverges from the shared template docs | markdownlint runs in `pnpm verify` on all project-owned Markdown; site content Markdown is still Prettier-formatted | Garrison Hutcherson (on merging the scaffold PR) | 2027-11-13 | Active |

## Status values

- **Active** — in effect.
- **Resolved** — the standard is now met; keep the row for history.
- **Expired** — past its date; must be resolved or renewed in the next PR.
