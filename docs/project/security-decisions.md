---
id: project/security-decisions
version: 0.2.0
load_when: Implementing or reviewing anything whose security behavior depends on a chosen value — providers, MFA, timeouts, rate limits, roles, upload rules, third parties, keys, logging.
---

# Security decisions

This file holds the decisions the ASVS "documentation requirements" ask for.
Code implements exactly what is recorded here (SEC-11). Change a value here and
in code in the same PR.

## 1. Profile

- ASVS level: **L1** (public content only; see ADR 0002)
- Not applicable: V17 WebRTC (no WebRTC); V10.4/V10.6/V10.7 (we are not an
  OAuth/OIDC provider); V4.3 GraphQL (none). {{Adjust.}}

## 2. Authentication `[ASVS 6.1.1, 6.1.2, 6.1.3]`

| Pathway | Enabled | MFA | Notes |
| --- | --- | --- | --- |
| Google | {{yes}} | Via Google account; TOTP for admins | |
| Apple | {{yes/no}} | | |
| Email link | {{yes/no}} | | |
| Email + password | {{no}} | | If yes: policy below, server-side sign-up |
| Phone (SMS) | {{no}} | | Region policy: {{countries}} |

- Password policy (if enabled): min {{15}}, max {{128}}, no composition rules;
  checked against common/breached lists and these context words:
  {{product name, company name, domain}}.
- MFA policy: admins required (TOTP); end users {{required/optional — if
  optional at L2, record an override}}.
- Anti-automation: {{identity provider's abuse protection, client attestation
  on our endpoints, rate limits below}}.
- Account recovery: {{email reset; lost-MFA process: …}}

## 3. Sessions `[ASVS 7.1.1, 7.1.2, 7.1.3]`

| Setting | Value | Reason |
| --- | --- | --- |
| Session cookie lifetime (absolute) | {{5 days}} | {{consumer app; re-auth for sensitive actions}} |
| Inactivity timeout | {{none / 24 h}} | |
| Re-authentication window for sensitive changes | {{5 minutes}} | SEC-SES-06 |
| Concurrent sessions | {{unlimited}} | |
| Logout behavior | {{clear cookie + revoke all refresh tokens}} | SEC-SES-03 |

## 4. Authorization matrix `[ASVS 8.1.1, 8.1.2]`

| Resource | Action | signed out | user (self) | member | admin | server only |
| --- | --- | --- | --- | --- | --- | --- |
| {{users}} | read | ✗ | ✓ | {{✓ displayName only}} | ✓ | |
| {{users}} | update `displayName`, `photoUrl` | ✗ | ✓ | ✗ | ✗ | |
| {{resource}} | {{action}} | | | | | |

Field-level rules: {{e.g. `role`, `ownerId`, `billing.*` are server-only}}.

## 5. Input rules and business limits `[ASVS 2.1.1, 2.1.2, 2.1.3]`

Input contracts are the schemas in each feature's schema module (SEC-IO-13).

| Limit | Per user | Global | Enforced in |
| --- | --- | --- | --- |
| {{Workspaces created}} | {{3 (free)}} | — | {{createWorkspace action}} |
| {{Invites sent}} | {{20/hour}} | {{1,000/hour}} | {{inviteMember action}} |

## 6. Rate limits `[ASVS 2.4.1, 6.1.1]`

| Operation | Limit | Key | Response |
| --- | --- | --- | --- |
| {{Sign-up}} | {{5/hour}} | {{IP + client attestation}} | `RATE_LIMITED` |

## 7. File uploads `[ASVS 5.1.1]`

| Feature | Types / extensions | Max size (unpacked) | Stored at | Served how | Scanned |
| --- | --- | --- | --- | --- | --- |
| {{Avatar}} | {{png, jpg, webp}} | {{2 MB}} | `users/{userId}/avatars/` | {{storage URL, separate origin}} | {{n/a — not shared}} |

## 8. Browser security features `[ASVS 3.1.1]`

Required: HTTPS, HSTS, CSP with nonce, `frame-ancestors 'none'`. Allowed
third-party origins in CSP: {{list}}. Behavior on unsupported browsers:
{{warn / block}}.

## 9. Third parties and data sharing `[ASVS 14.2.3]`

| Processor | Purpose | Data sent (class) | DPA / terms |
| --- | --- | --- | --- |
| {{Hosting / backend platform}} | {{Hosting, auth, database}} | {{All}} | {{terms link}} |
| {{Error tracker}} | {{Errors}} | {{Internal only; PII off}} | {{link}} |

## 10. Cryptographic inventory `[ASVS 11.1.1, 11.1.2]`

| Key / secret | Purpose | Algorithm | Stored in | Rotation | Owner |
| --- | --- | --- | --- | --- | --- |
| {{field-encryption-key}} | {{Encrypt Restricted fields}} | {{AES-256-GCM via a KMS}} | {{KMS name}} | {{yearly}} | {{name}} |

## 11. External communications `[ASVS 13.1.1, 13.2.4]`

| Direction | Host / service | Purpose | Auth |
| --- | --- | --- | --- |
| Outbound | {{api.stripe.com}} | {{Payments}} | {{Secret key in the secrets manager}} |
| Inbound | {{Stripe webhooks → /api/v1/webhooks/stripe}} | {{Payment events}} | {{Signature verification}} |

## 12. Logging inventory `[ASVS 16.1.1]`

| Layer | Events | Destination | Retention | Readers |
| --- | --- | --- | --- | --- |
| {{App server}} | Requests, OBS-07 security events | {{platform logging}} | {{30 days}} | {{ops group}} |
| {{Background jobs}} | Triggers, errors, security events | {{platform logging}} | {{30 days}} | {{ops group}} |

## 13. Resource-demanding features `[ASVS 15.1.3]`

| Feature | Cost driver | Protection |
| --- | --- | --- |
| {{AI summary}} | {{Model calls}} | {{10/day per user, max 5 instances}} |

## 14. Platform settings record

One row per item in the stack profile's hardening checklist.

| Setting (profile rule) | Staging | Production | Last verified |
| --- | --- | --- | --- |
| {{Client attestation enforced}} | {{enforced}} | {{enforced}} | {{date}} |
| {{Account-enumeration protection}} | {{on}} | {{on}} | |
| {{Backups / point-in-time recovery / delete protection}} | — | {{on / daily / on}} | |
| {{Budget alerts}} | {{$}} | {{$}} | |
