---
id: stacks/nextjs-firebase/security
version: 2.0.0
load_when: Implementing auth, sessions, Security Rules, headers, cookies, secrets, or client storage in a Next.js + Firebase project.
---

# Security on Next.js + Firebase

How this stack meets the universal security standards. Read the matching
standard first; these rules say how, not what.

## Rules

### Authentication (SEC-AUTH)

- **NXF-20 Providers.** Enable only the sign-in methods recorded in
  `security-decisions.md`; disable the rest in the Firebase console.
- **NXF-21 Password policy (SEC-AUTH-03).** If email/password is on: set the
  Firebase password policy to minimum length ≥ 8 (15 recommended), maximum
  ≥ 64, and no character requirements. Firebase Auth does not check breached
  passwords, so disable client-side sign-up in the Authentication settings and
  create accounts in a Server Action that checks the password and then calls
  the Admin SDK.
- **NXF-22 Abuse protection (SEC-AUTH-04).** Turn on email enumeration
  protection and the reCAPTCHA Enterprise integration where available; add App
  Check to your own endpoints.
- **NXF-23 MFA (SEC-AUTH-06).** Enable TOTP MFA (Identity Platform); require it
  for admin roles.
- **NXF-24 One account per email (SEC-AUTH-08).** Use the `uid` as the user
  identity; link providers only on verified email.

### Tokens and sessions (SEC-TOK, SEC-SES)

- **NXF-25 Verify with the Admin SDK (SEC-TOK-01).** `verifyIdToken` and
  `verifySessionCookie` check signature, issuer, audience, and expiry. Never
  decode a token without verifying it.
- **NXF-26 Session cookies for SSR (SEC-SES-01).** After client sign-in, a
  Server Action exchanges the ID token for a session cookie with
  `createSessionCookie` (lifetime between 5 minutes and 2 weeks, from
  `security-decisions.md`).
- **NXF-27 Revocation checks (SEC-SES-02).** Mutations and sensitive reads call
  `verifySessionCookie(cookie, true)` to check revocation.
- **NXF-28 Logout and disablement (SEC-SES-03, -05).** Clear the cookie, send
  `Clear-Site-Data`, and call `revokeRefreshTokens(uid)` (this signs the user
  out everywhere). For per-device logout, keep a server-side session record and
  check it on each request. Disabling an account also revokes its tokens.
- **NXF-29 Re-authentication (SEC-SES-06).** Compare the token's `auth_time`
  with the window in `security-decisions.md`.
- **NXF-30 The web `apiKey` is public (SEC-SES-08, SEC-CFG-05).** It identifies
  the project; restrict it in Google Cloud and rely on rules and App Check.

### Access control (SEC-AZ)

- **NXF-31 Two gates.** Firestore and Storage Security Rules gate client SDK
  traffic; `src/lib/server/authz.ts` gates server traffic, because the Admin SDK
  bypasses rules.
- **NXF-32 Roles are custom claims (SEC-AZ-05)** set only by the Admin SDK.
  Keep them small and force a token refresh after changing them.
- **NXF-33 Rules are not filters (SEC-AZ-08).** Client queries must include the
  constraints the rules require, or Firestore rejects the whole query.
- **NXF-34 Field-level reads (SEC-AZ-04).** Rules authorize whole documents;
  put stricter data in a separate document or subcollection
  (`users/{uid}/private/profile`).

### Web, cookies, client storage

- **NXF-35 Headers.** Static headers in `next.config.ts` `headers()`; the CSP
  nonce per request in `proxy.ts` (SEC-WEB-01..06).
- **NXF-36 Cookie name (SEC-WEB-07).** Prefer `__Host-session`. Classic Firebase
  Hosting rewrites forward only a cookie named `__session`; if your setup
  depends on that, record an override. Verify App Hosting's behavior on the
  first staging deploy.
- **NXF-37 Popup sign-in and COOP (SEC-WEB-05).** Firebase Auth popup sign-in
  needs `Cross-Origin-Opener-Policy: same-origin-allow-popups`, or use the
  redirect flow.
- **NXF-38 CSRF (SEC-WEB-09).** Server Actions accept only POST and compare
  `Origin` with the host; keep `serverActions.allowedOrigins` empty or minimal.
  Cookie-authenticated route handlers verify `Origin`.
- **NXF-39 Firestore offline cache (SEC-DATA-05).** Firestore web persistence
  stores documents in IndexedDB. Disable it for Confidential data on shared
  devices, or call `terminate()` then `clearIndexedDbPersistence()` on logout.

### Secrets (SEC-CFG)

- **NXF-40 Secret Manager everywhere.** App Hosting references secrets with
  `secret:` in `apphosting*.yaml`; each backend gets access only to its own.
  Cloud Functions declare secrets per function with `defineSecret`.
  `NEXT_PUBLIC_*` values are compiled into browser code and are never secrets.

## Firestore rules skeleton

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }
    function isMember(workspaceId) {
      return signedIn() && exists(
        /databases/$(database)/documents/workspaces/$(workspaceId)/members/$(request.auth.uid));
    }
    function changesOnly(fields) {
      return request.resource.data.diff(resource.data).affectedKeys().hasOnly(fields);
    }

    match /workspaces/{workspaceId}/projects/{projectId} {
      allow read: if isMember(workspaceId);
      allow create: if isMember(workspaceId)
        && request.resource.data.keys().hasOnly(['name', 'createdBy', 'createdAt'])
        && request.resource.data.name is string
        && request.resource.data.name.size() <= 100
        && request.resource.data.createdBy == request.auth.uid
        && request.resource.data.createdAt == request.time;
      allow update: if isMember(workspaceId) && changesOnly(['name'])
        && request.resource.data.name is string
        && request.resource.data.name.size() <= 100;
      allow delete: if false; // Deleted by the server after authorization.
    }

    // Anything not matched above is denied. Kept explicit for reviewers.
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
