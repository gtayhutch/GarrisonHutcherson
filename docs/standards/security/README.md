---
id: standards/security
version: 2.0.0
load_when: Any security-relevant work (auth, data access, input handling, config, secrets, headers, uploads, third parties). Read this, then only the chapter file the task needs.
---

# Security baseline

Our security standard is a project-specific profile of the
**OWASP Application Security Verification Standard (ASVS) 5.0.0**, as the
ASVS itself recommends: irrelevant sections are removed, and requirements are
restated as rules that hold in any stack. *How* each rule is met in a given
stack is written in that stack profile's security doc (for example
`docs/stacks/nextjs-firebase/security.md`). A component that can't meet the
project's level is flagged during the stack interview (SEL-06).

## Levels

| Level | Applies to | Meaning |
| --- | --- | --- |
| **L1** | Everything deployed, including `staging` | Floor. First-line defenses against common attacks. |
| **L2** | Any app with real users or personal data (**default**) | What most applications should meet. Includes all L1. |
| **L3** | Payments, health, high-value or regulated data | Defense in depth. Includes all L1 and L2. |

The project's level is set in `AGENTS.md` (project card). Requirements are
tagged `[ASVS <id> · L<n>]`; a requirement is mandatory at its level and above.
Anything required at the project's level that is not met is recorded in
`docs/project/overrides.md` with a reason, a compensating control, and an
expiry date.

## Non-negotiables (all levels)

- **SEC-01 Server-side authorization, default deny.** Every read and write is
  authorized on the server. If the stack also has database access policies
  (for example Firestore Security Rules or PostgreSQL row-level security), they
  are default-deny too. Privileged credentials (admin SDKs, service roles)
  bypass those policies, so server code MUST authorize every operation itself.
  `[ASVS 8.2.1, 8.2.2, 8.3.1 · L1]`
- **SEC-02 Schema validation at the trust boundary** for every input: UI
  mutation handlers, HTTP routes, RPC methods, event handlers, webhooks, and
  file uploads. Client-side validation is UX only. `[ASVS 2.2.1, 2.2.2 · L1]`
- **SEC-03 Secrets stay secret.** Hosted secrets live in a secrets manager and
  are referenced by name. Never in the repo, in public client variables (any
  variable compiled into a client bundle or app binary), in logs, in URLs, or
  in error messages. `[ASVS 13.3.1 · L2, 14.2.1 · L1]`
- **SEC-04 Contextual output encoding.** Rely on the UI framework's automatic
  escaping. Never inject untrusted HTML without a vetted sanitizer. `[ASVS 1.2.1, 1.3.1, 3.2.2 · L1]`
- **SEC-05 HTTPS everywhere** with HSTS, and the security header baseline in
  `web-and-api.md`. `[ASVS 12.2.1, 3.4.1 · L1]`
- **SEC-06 Sessions are verified on the server** on every request, and revoked
  on logout, account disablement, and deletion. `[ASVS 7.2.1, 7.4.1, 7.4.2 · L1]`
- **SEC-07 Least privilege** for users, roles, service accounts, and API keys.
  `[ASVS 13.2.2, 13.3.2 · L2]`
- **SEC-08 Abuse resistance.** Rate limits, plus client attestation where the
  platform offers it (for example Firebase App Check, Play Integrity, App
  Attest), on sign-in, sign-up, password reset, and any expensive or costly
  operation.
  `[ASVS 2.4.1 · L2, 6.3.1 · L1]`
- **SEC-09 Safe failure.** Users get generic error messages; detailed context
  goes to server logs, without secrets or personal data. Errors fail closed.
  `[ASVS 16.5.1, 16.5.3 · L2]`
- **SEC-10 Patched dependencies** within the timelines in
  `docs/standards/dependencies.md`. `[ASVS 15.1.1, 15.2.1 · L1]`
- **SEC-11 Documented security decisions.** ASVS "documentation requirements"
  (session timeouts, rate limits, upload rules, role matrix, data
  classification) are recorded in `docs/project/security-decisions.md` before
  the feature ships, and the code implements exactly what is recorded.
- **SEC-12 Production data stays in production.** No copying real user data to
  `staging` or local environments; use synthetic seed data.

## Chapter router

| ASVS 5.0 chapter | Our doc | Applicability |
| --- | --- | --- |
| V1 Encoding and Sanitization | `input-output.md` | Applies (V1.4 only for native or `unsafe` code) |
| V2 Validation and Business Logic | `input-output.md` | Applies |
| V3 Web Frontend Security | `web-and-api.md` | Applies to web apps |
| V4 API and Web Service | `web-and-api.md` | Applies (V4.3 only if GraphQL; V4.4 only for custom WebSockets) |
| V5 File Handling | `input-output.md` | Applies if the app accepts or serves files |
| V6 Authentication | `auth-sessions.md` | Applies; much is configured in the identity provider |
| V7 Session Management | `auth-sessions.md` | Applies |
| V8 Authorization | `access-control.md` | Applies |
| V9 Self-contained Tokens | `auth-sessions.md` | Applies whenever JWTs or signed tokens are used |
| V10 OAuth and OIDC | `auth-sessions.md` | Client and resource-server parts; provider parts only if we build an identity provider |
| V11 Cryptography | `crypto-secrets-config.md` | Applies |
| V12 Secure Communication | `crypto-secrets-config.md` | Applies; TLS termination is often managed by the platform |
| V13 Configuration | `crypto-secrets-config.md` | Applies |
| V14 Data Protection | `data-protection.md` | Applies |
| V15 Secure Coding and Architecture | `docs/standards/dependencies.md`, `web-and-api.md` | Applies |
| V16 Security Logging and Error Handling | `docs/standards/observability.md` | Applies |
| V17 WebRTC | — | Not applicable unless the app uses WebRTC; add a doc first |

Platform-specific controls that cut across chapters (console settings, IAM,
attestation, backups, budgets) are in the stack profile's hardening checklist,
for example `docs/stacks/nextjs-firebase/firebase-hardening.md`.

## Working practices

- **Abuse cases in every feature PR.** For features that touch data or money,
  the PR description lists at least three ways the feature could be abused and
  how each is prevented. This is our lightweight threat model.
- **Security review trigger.** Changes to auth, access policies, data model,
  server entry points, headers, secrets, dependencies with native code, or
  file handling require `docs/checklists/security-review.md`.
- **Secret leak response.** If a secret is exposed (commit, screenshot, log,
  chat): revoke or rotate it **first**, then purge it from history, then check
  logs for misuse, then write a short incident note in
  `docs/project/decisions/`. Enable GitHub secret scanning and push protection
  on every repository.
- **Referencing ASVS.** Short IDs mean version 5.0.0 (`8.2.2` =
  `v5.0.0-8.2.2`). Consult the official ASVS document for exact wording.
