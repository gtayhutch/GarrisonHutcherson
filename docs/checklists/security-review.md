---
id: checklists/security-review
version: 2.0.0
load_when: A change touches authentication, sessions, access policies, roles, the data model, server entry points, headers, cookies, CORS, secrets, configuration, dependencies, file handling, or third parties. Also before each production release.
---

# Security review

A condensed walk through our ASVS 5.0 profile. Check only the sections the
change touches; every unchecked applicable item is either fixed or recorded in
`docs/project/overrides.md`. Levels show when an item becomes mandatory.

## Access control (V8) — `security/access-control.md`

- [ ] L1 Default deny in the server data access layer and in any database policies (SEC-AZ-01).
- [ ] L1 Object-level check on every read/write; no IDOR (SEC-AZ-02).
- [ ] L2 Protected fields not client-writable; field-level restrictions tested (SEC-AZ-03).
- [ ] L1 Roles assigned only by server code, never read from client-writable data (SEC-AZ-05).
- [ ] L2 Tenant isolation in every query and policy (SEC-AZ-07).
- [ ] L1 Authorization matrix in `security-decisions.md` matches tests (SEC-AZ-06).

## Input, output, files (V1, V2, V5) — `security/input-output.md`

- [ ] L1 Server-side schema that rejects unknown fields on every entry point (SEC-IO-14, SEC-IO-15).
- [ ] L1 No raw HTML from users without a sanitizer; safe URL schemes (SEC-IO-01, SEC-IO-02).
- [ ] L1 No query fields, paths, or commands built from input (SEC-IO-04, SEC-IO-05).
- [ ] L2 Outbound fetches of user URLs go through the SSRF-safe helper (SEC-IO-07).
- [ ] L1 Multi-step flows enforced in order on the server (SEC-IO-16).
- [ ] L2 Business limits documented and enforced; atomic writes (SEC-IO-17, SEC-IO-18).
- [ ] L2 Rate limits + client attestation on abusable operations (SEC-IO-19).
- [ ] L1 Uploads: size and real type checked; generated paths (SEC-IO-22, SEC-IO-24).
- [ ] L2 Upload policy documented; files served from a separate origin (SEC-IO-21, SEC-IO-25).

## Web and API (V3, V4) — `security/web-and-api.md`

- [ ] L1 HSTS; L2 CSP with nonce, `frame-ancestors`, `nosniff`, Referrer-Policy (SEC-WEB-01..04).
- [ ] L1 Session cookie `Secure`, `__Host-` or recorded override; L2 `HttpOnly`, `SameSite` (SEC-WEB-07).
- [ ] L1 State changes use unsafe methods; Origin checked on cookie-auth handlers (SEC-WEB-08, SEC-WEB-09).
- [ ] L1 CORS allowlist, no `*` with credentials (SEC-WEB-10).
- [ ] L2 Redirect targets allowlisted (SEC-WEB-14).
- [ ] L1 Responses return only permitted fields (SEC-API-02).
- [ ] Webhooks verify signatures before parsing (SEC-API-06).

## Authentication and sessions (V6, V7, V9, V10) — `security/auth-sessions.md`

- [ ] L1 All auth pathways documented; unused providers disabled (SEC-AUTH-01).
- [ ] L1 Password policy without composition rules, if passwords are on (SEC-AUTH-03).
- [ ] L1 Brute-force protection and email enumeration protection on (SEC-AUTH-04).
- [ ] L2 MFA for privileged roles; end-user MFA decision recorded (SEC-AUTH-06).
- [ ] L1 Tokens verified with the provider's SDK or a vetted library, never just decoded (SEC-TOK-01).
- [ ] L1 Sessions verified server-side; revoked on logout, disable, delete (SEC-SES-02, -03, -05).
- [ ] L2 Timeouts documented; re-authentication for sensitive changes (SEC-SES-04, SEC-SES-06).
- [ ] L2 Third-party OAuth tokens server-side only, PKCE + state (SEC-OAUTH-02).

## Crypto, config, secrets (V11, V12, V13) — `security/crypto-secrets-config.md`

- [ ] L1 Approved algorithms only; no custom crypto (SEC-CRY-01, SEC-CRY-02).
- [ ] L2 CSPRNG for tokens and codes (SEC-CRY-04).
- [ ] L2 Secrets in the secrets manager, scoped per workload (SEC-CFG-02).
- [ ] L2 Dedicated least-privilege service identities; no long-lived keys (SEC-CFG-03).
- [ ] L2 No debug, source maps, test routes, or internal endpoints in production (SEC-CFG-04).
- [ ] L1 HTTPS everywhere; certificate validation never disabled (SEC-TLS-01, SEC-TLS-02).

## Data protection (V14) — `security/data-protection.md`

- [ ] L2 New fields classified, with owner and retention (SEC-DATA-01).
- [ ] L1 No sensitive data in URLs (SEC-DATA-03).
- [ ] L2 Personalized responses not cached; nothing sensitive in browser storage (SEC-DATA-04, SEC-DATA-05).
- [ ] L2 Third parties receive only documented data (SEC-DATA-06).
- [ ] Account deletion and export still cover the new data (SEC-DATA-08, SEC-DATA-09).

## Logging and errors (V16) — `observability.md`

- [ ] L2 Security events logged with stable event names (OBS-07).
- [ ] L2 No secrets or personal values in logs (OBS-08).
- [ ] L2 Generic user-facing errors; fail closed (OBS-04, OBS-05).

## Dependencies and platform (V15) — `dependencies.md` + the profile's hardening checklist

- [ ] L1 No dependency past its remediation deadline (DEP-05).
- [ ] New dependency justified; license allowed (DEP-01); new stack components decided by the user (SEL-10).
- [ ] L2 Client attestation and rate limits on abusable operations the change adds (SEC-08, SEC-IO-19).
- [ ] L2 Resource-heavy features have caps on cost and concurrency (DEP-14).
- [ ] Every item in the stack profile's hardening checklist that the change touches is still met.

## Abuse cases

- [ ] The PR lists at least three ways the feature could be abused and how each
      is prevented.
