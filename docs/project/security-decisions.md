---
id: project/security-decisions
version: 1.0.0
load_when: Implementing or reviewing anything whose security behavior depends on a chosen value — headers, CSP origins, third parties, hosting settings, logging.
---

# Security decisions

This file holds the decisions the ASVS "documentation requirements" ask for.
Code implements exactly what is recorded here (SEC-11). Change a value here and
in code in the same PR.

## 1. Profile

- ASVS level: **L1** (public content only; see ADR 0002)
- Not applicable: V6 authentication, V7 sessions, and V8 authorization for
  visitors (the site has no accounts); V5 file handling (no uploads); V17
  WebRTC; V10 OAuth/OIDC; V4.3 GraphQL; server-side API controls (no
  endpoints, ACF-01).
- If any of these become applicable, that is a stack change (SEL-10), and this
  file is revisited in the same PR.

## 2. Authentication `[ASVS 6.1.1, 6.1.2, 6.1.3]`

Visitors never authenticate. The only sign-ins are operator access:

| Pathway | Enabled | MFA | Notes |
| --- | --- | --- | --- |
| Cloudflare dashboard (owner) | yes | Required; security key preferred | No other account members |
| GitHub (owner) | yes | Required | |
| Cloudflare Access for staging | yes | Email one-time PIN | Allow policy: the owner's email only; 24-hour session |

## 3. Sessions `[ASVS 7.1.1, 7.1.2, 7.1.3]`

No site sessions or cookies. The Cloudflare Access session on staging lasts
24 hours (§2).

## 4. Authorization matrix `[ASVS 8.1.1, 8.1.2]`

| Resource | Action | visitor | owner |
| --- | --- | --- | --- |
| Production pages | read | ✓ | ✓ |
| Staging pages | read | ✗ (Access login) | ✓ |
| Content and code | change | ✗ | ✓ via PR (GIT-01) |

## 5. Input rules and business limits `[ASVS 2.1.1, 2.1.2, 2.1.3]`

The site accepts no visitor input (no forms; contact is a `mailto:` link). The
only input is repository content, and
the collection schemas in `src/content.config.ts` validate it at build time
(ACF-03).

## 6. Rate limits `[ASVS 2.4.1, 6.1.1]`

None at the application level; there are no operations to limit. Cloudflare's
default DDoS protection applies.

## 7. File uploads `[ASVS 5.1.1]`

None.

## 8. Browser security features `[ASVS 3.1.1]`

Required: HTTPS, HSTS, the static CSP from OVR-003, and `frame-ancestors
'none'`. The exact headers are in `docs/stacks/astro-cloudflare/README.md`
(Security implementation) and `public/_headers`.
Allowed third-party origins in CSP: `https://static.cloudflareinsights.com`
(script) and `https://cloudflareinsights.com` (connect), for Web Analytics
only. Unsupported browsers: the site works without JavaScript, so there is
nothing to block.

## 9. Third parties and data sharing `[ASVS 14.2.3]`

| Processor | Purpose | Data sent (class) | DPA / terms |
| --- | --- | --- | --- |
| Cloudflare | DNS, hosting (Workers), Access, Web Analytics | Visitor request metadata (IP, user agent) to the edge; cookieless analytics beacon | Cloudflare Self-Serve Subscription Agreement and DPA |
| GitHub | Source hosting, CI | Repository contents (Public) | GitHub Terms of Service |
| Cloudflare Email Routing | Forwards `garrison@garrisonhutcherson.com` to the owner's inbox (ADR 0003) | Messages that senders choose to send | Cloudflare terms and DPA |

## 10. Cryptographic inventory `[ASVS 11.1.1, 11.1.2]`

| Key / secret | Purpose | Algorithm | Stored in | Rotation | Owner |
| --- | --- | --- | --- | --- | --- |
| TLS certificates | HTTPS for all hostnames | Cloudflare-managed (Universal SSL) | Cloudflare | Automatic | Cloudflare |
| Workers Builds API tokens | Deploy each Worker | Cloudflare API token | Cloudflare (never in GitHub) | Revoke and reconnect if exposed | Owner |

## 11. External communications `[ASVS 13.1.1, 13.2.4]`

| Direction | Host / service | Purpose | Auth |
| --- | --- | --- | --- |
| Outbound (browser) | `static.cloudflareinsights.com`, `cloudflareinsights.com` | Web Analytics beacon | None (cookieless) |
| Inbound | GitHub → Cloudflare Workers Builds | Build on push to `staging` / `production` | Cloudflare GitHub App, scoped to this repo |

## 12. Logging inventory `[ASVS 16.1.1]`

| Layer | Events | Destination | Retention | Readers |
| --- | --- | --- | --- | --- |
| Edge (static assets) | Request metrics, Web Analytics | Cloudflare dashboard | Cloudflare plan default | Owner |
| Staging Access | Sign-in attempts and grants | Cloudflare Zero Trust logs | Plan default | Owner |
| Account | Configuration changes | Cloudflare audit log | Plan default | Owner |
| Builds | Build and deploy output | Workers Builds logs | Plan default | Owner |

## 13. Resource-demanding features `[ASVS 15.1.3]`

None. Static asset requests are free and uncounted (ACF-01, ACF-09).

## 14. Platform settings record

One row per item in `docs/stacks/astro-cloudflare/setup.md` (Hardening
checklist). Fill in "Last verified" when each setting is applied.

| Setting (profile rule) | Staging | Production | Last verified |
| --- | --- | --- | --- |
| Account MFA, no extra members, no stray API tokens | shared account | shared account | — |
| GitHub MFA; Cloudflare GitHub App limited to this repo | — | — | — |
| Always Use HTTPS, min TLS 1.2, TLS 1.3, HTTPS rewrites | zone-wide | zone-wide | — |
| DNSSEC and CAA records | zone-wide | zone-wide | — |
| `workers_dev` and `preview_urls` off (ACF-11) | off | off | — |
| Cloudflare Access on staging hostname | on | n/a | — |
| `www` → apex 301 redirect rule | n/a | on | — |
| Web Analytics | off | on | — |
| Email Routing: `garrison@` rule, verified destination, MX and SPF records (ADR 0003) | zone-wide | zone-wide | — |
| Budget alerts | n/a (free plan, static assets) | n/a | — |
