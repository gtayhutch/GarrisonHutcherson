---
id: standards/security/auth-sessions
version: 2.0.0
load_when: Sign-in, sign-up, password reset, MFA, account linking, sessions, token verification, logout, account disablement, re-authentication, third-party OAuth integrations.
---

# Authentication, sessions, tokens

ASVS 5.0 chapters V6 (Authentication), V7 (Session Management), V9
(Self-contained Tokens), and the client and resource-server parts of V10
(OAuth and OIDC). Requirement text is paraphrased. The identity provider is a
stack decision; the profile's security doc shows how each rule is configured
or coded with it.

## Rules

### Authentication pathways (V6)

- **SEC-AUTH-01 Document every pathway.** `security-decisions.md` lists each
  enabled sign-in method, the MFA policy, the recovery flow, and the
  anti-automation controls. Methods not listed are disabled in the identity
  provider. No undocumented pathways (test logins, backdoors) exist in any
  hosted environment. `[ASVS 6.1.1 · L1, 6.1.3, 6.3.4 · L2]`
- **SEC-AUTH-02 Prefer phishing-resistant and password-free sign-in:**
  passkeys, federated sign-in (Google, Apple, Microsoft), or email links.
  Passwords are enabled only when a product need is recorded.
- **SEC-AUTH-03 If passwords are enabled:**
  - Policy: minimum length ≥ 8 (15 recommended), maximum ≥ 64, **no**
    character-composition requirements. `[ASVS 6.2.1, 6.2.5 · L1, 6.2.9 · L2]`
  - Inputs use `type="password"` (or the platform's secure field) with an
    optional show toggle; paste and password managers work; passwords are never
    truncated or case-folded. `[ASVS 6.2.6, 6.2.7, 6.2.8 · L1]`
  - Changing a password requires the current one (re-authenticate first).
    `[ASVS 6.2.2, 6.2.3 · L1]`
  - New passwords are checked against common and breached passwords. If the
    identity provider doesn't do this, route sign-up and password changes
    through server code that checks before the credential is created.
    `[ASVS 6.2.4 · L1, 6.2.11, 6.2.12 · L2]`
  - No forced periodic rotation. `[ASVS 6.2.10 · L2]`
- **SEC-AUTH-04 Brute-force and stuffing defenses.** Turn on the identity
  provider's abuse protection, account-enumeration protection, and rate limits;
  add rate limits and client attestation on your own auth endpoints. Record the
  settings. `[ASVS 6.1.1, 6.3.1 · L1]`
- **SEC-AUTH-05 No default or shared accounts; no secret questions.** Admins
  are ordinary accounts with a role. `[ASVS 6.3.2, 6.4.2 · L1]`
- **SEC-AUTH-06 MFA.** At L2 the ASVS requires MFA (or an equivalent
  combination of factors) to access the application. Admin and privileged
  roles MUST always use MFA (passkeys or TOTP preferred). If end users are not
  required to use MFA, record an override with the compensating controls. SMS
  is a fallback only, to previously verified numbers.
  `[ASVS 6.3.3, 6.6.1 · L2]`
- **SEC-AUTH-07 Recovery doesn't bypass MFA,** and replacing a lost second
  factor requires identity proofing as strong as enrollment (a documented
  manual process). `[ASVS 6.4.3, 6.4.4 · L2]`
- **SEC-AUTH-08 Identify users by the provider's immutable subject ID,** never
  by email. Link accounts across sign-in methods only on verified email, so one
  provider cannot impersonate another's user. `[ASVS 6.8.1, 10.5.2 · L2]`
- **SEC-AUTH-09 Generated codes and initial secrets** (invites, activation
  links) come from a CSPRNG, are single-use, and expire quickly.
  `[ASVS 6.4.1 · L1, 6.5.1, 6.5.3 · L2]`

### Tokens (V9)

- **SEC-TOK-01 Verify, never just decode.** Server code accepts only tokens
  verified with the provider's SDK or a vetted JWT library: signature against
  the issuer's trusted keys, an allowlisted algorithm, issuer, audience, and
  expiry. Decoding a token without verifying it is never used for a security
  decision. `[ASVS 9.1.1, 9.1.2, 9.1.3, 9.2.1 · L1, 9.2.3 · L2]`
- **SEC-TOK-02 Use each token for its purpose.** ID tokens identify a user to
  this app, access tokens authorize API calls, attestation tokens vouch for the
  client; none substitutes for another. `[ASVS 9.2.2 · L2]`
- **SEC-TOK-03 Avoid custom JWTs.** If one is unavoidable, use an allowlisted
  algorithm, set and check `aud`, `iss`, `exp`, and a type claim, and record it
  in the crypto inventory. `[ASVS 9.1.2 · L1, 9.2.4 · L2]`

### Sessions (V7)

- **SEC-SES-01 Server-verified sessions.** Web sessions use an `HttpOnly`
  cookie (SEC-WEB-07) holding either a server-side session reference (≥ 128
  bits from a CSPRNG) or a provider-issued, signed session token. Lifetime is
  set in `security-decisions.md`. A new session is issued on every sign-in and
  re-authentication. Native clients store tokens only in the platform's secure
  storage (Keychain, Keystore). `[ASVS 7.2.3, 7.2.4 · L1, 7.3.2 · L2]`
- **SEC-SES-02 Verify on every request** in the data access layer
  (`requireUser()` or equivalent). Mutations and sensitive reads also check
  that the session hasn't been revoked. `[ASVS 7.2.1 · L1]`
- **SEC-SES-03 Logout invalidates the session** on the server, not just in the
  browser: delete the server-side session or revoke the provider's tokens, clear
  the cookie, and send `Clear-Site-Data`. Self-contained tokens need revocation
  support or short lifetimes. `[ASVS 7.4.1 · L1]`
- **SEC-SES-04 Timeouts are decisions.** Inactivity timeout and absolute
  lifetime are recorded with their reasoning and enforced.
  `[ASVS 7.1.1, 7.3.1, 7.3.2 · L2]`
- **SEC-SES-05 Disable or delete → revoke now.** Disabling or deleting an
  account ends its sessions immediately. Admins can end a user's sessions.
  After a password or MFA change, offer to end other sessions.
  `[ASVS 7.4.2 · L1, 7.4.3, 7.4.5 · L2]`
- **SEC-SES-06 Re-authenticate for sensitive changes** (email, password, MFA,
  account deletion, payout details): require a sign-in within the window
  recorded in `security-decisions.md`. `[ASVS 7.5.1 · L2]`
- **SEC-SES-07 Visible logout** on every authenticated screen; where session
  records exist, users can see and end their sessions.
  `[ASVS 7.4.4, 7.5.2 · L2]`
- **SEC-SES-08 Sessions are dynamic tokens,** never static API keys. Note that
  some platforms ship public client identifiers that look like keys (for
  example a Firebase web `apiKey`); those are not secrets and not sessions, and
  protection comes from server-side authorization and key restrictions.
  `[ASVS 7.2.2 · L1]`

### OAuth and OIDC (V10)

- **SEC-OAUTH-01 Provider-side requirements apply only if we are the
  provider.** V10.4, V10.6, and V10.7 apply only if the project builds its own
  authorization server or OpenID provider, which needs an ADR and the full
  chapter.
- **SEC-OAUTH-02 When we sign users in through OIDC or call third-party APIs on
  their behalf:** authorization code flow with PKCE and `state` (and `nonce`
  for OIDC), exact redirect URIs, minimum scopes, and tokens kept server-side
  only (never in browser storage), encrypted at rest.
  `[ASVS 10.1.1, 10.1.2, 10.2.1, 10.5.1 · L2]`
- **SEC-OAUTH-03 As a resource server,** our APIs accept only access tokens
  whose audience is this API and enforce the scopes and claims they carry.
  `[ASVS 10.3.1, 10.3.2 · L2]`

## Example: requiring a recent sign-in (TypeScript)

```ts
/** Maximum age of a sign-in, in seconds, for sensitive account changes. */
const REAUTH_WINDOW_SECONDS = 5 * 60;

/** Throws `ReauthRequiredError` unless the user signed in within the window. */
export function assertRecentSignIn(session: VerifiedSession, nowSeconds: number): void {
  if (nowSeconds - session.authTime > REAUTH_WINDOW_SECONDS) {
    throw new ReauthRequiredError();
  }
}
```
