---
id: stacks/nextjs-firebase/firebase-hardening
version: 2.0.0
load_when: Creating or configuring Firebase/Google Cloud projects, App Check, Auth settings, IAM, Cloud Functions options, Storage buckets, backups, budgets, or extensions.
---

# Firebase and Google Cloud hardening

Part of the `nextjs-firebase` profile. Controls specific to the Firebase
platform; each one supports ASVS requirements in the universal security docs.
This file is the checklist for console and project configuration. Settings
that a console click can change are also recorded in
`docs/project/security-decisions.md`.

## Rules

### Projects and environments

- **SEC-FB-01 One project per hosted environment (ENV-11).** `staging` and
  `production` are separate Firebase/Google Cloud projects with separate Auth
  user pools,
  databases, buckets, secrets, and service accounts. Local work uses a
  `demo-` project, which can only talk to emulators. Tag the production
  project with the "production" environment type.
- **SEC-FB-02 Staging is not public.** Staging carries `X-Robots-Tag: noindex`
  and limits sign-in to an allowlist of test accounts or domains.

### App Check

- **SEC-FB-03 App Check on every Firebase resource the client uses:**
  Firestore, Storage, Cloud Functions (`enforceAppCheck: true` on callables),
  and your own route handlers (verify the `X-Firebase-AppCheck` header with the
  Admin SDK). Providers: reCAPTCHA Enterprise (web), Play Integrity (Android),
  App Attest (Apple). Roll out in monitoring mode, then enforce.
- **SEC-FB-04 Replay protection for sensitive callables** with limited-use
  tokens (`consumeAppCheckToken: true`). Debug tokens exist only for local and
  CI use and are never committed.

### Authentication settings

- **SEC-FB-05 Auth console baseline:** only documented providers enabled;
  email enumeration protection on; "one account per email address"; password
  policy per SEC-AUTH-03; client-side sign-up disabled when sign-up must pass
  server checks; authorized domains limited to real domains (remove
  `localhost` in production); email action links point to your domain; SMS
  region policy restricted to the countries you serve, if phone auth is on.
- **SEC-FB-06 MFA (TOTP) enabled** in the project, required for privileged
  roles (SEC-AUTH-06).

### Rules, data, and storage

- **SEC-FB-07 Rules are deployed from the repo,** tested in CI (TEST-04), and
  promoted with the app. Console edits are forbidden (SEC-CFG-06).
- **SEC-FB-08 Firestore protection in production:** point-in-time recovery
  enabled, scheduled backups with a retention that matches SEC-DATA-07, and
  database delete protection on.
- **SEC-FB-09 Storage buckets are private.** Access goes through Storage rules
  or short-lived signed URLs; bucket CORS lists explicit origins.

### Identity and access (IAM)

- **SEC-FB-10 Humans:** roles are granted to groups, not individuals; nobody
  uses Owner or Editor day to day; production access is limited to the people
  who operate it.
- **SEC-FB-11 Workloads:** the App Hosting backend and each sensitive Cloud
  Function run as dedicated service accounts with minimal roles. No service
  account keys; GitHub Actions authenticates with Workload Identity Federation
  (SEC-CFG-03).
- **SEC-FB-12 API key restrictions:** the browser API key is restricted by
  HTTP referrer (web) or app identity (mobile) and to the APIs the app uses
  (SEC-CFG-05).

### Cloud Functions

- **SEC-FB-13 Function options are explicit:** `region`, `memory`,
  `timeoutSeconds`, `maxInstances` (caps cost and abuse), `secrets` (only what
  the function needs), `cors` (explicit origins), and `invoker: 'private'` for
  functions that only other services call. `[ASVS 15.1.3, 15.2.2 · L2]`
- **SEC-FB-14 Triggers are idempotent** (ARCH-09) and validate the event
  payload with a schema before use (SEC-02).

### Cost and abuse monitoring

- **SEC-FB-15 Budgets and alerts** on every hosted project, with alerts on
  unusual spikes in reads, writes, function invocations, egress, and SMS.
  Denial-of-wallet is a security incident.
- **SEC-FB-16 Audit logs:** Admin Activity logs are on by default; enable
  Data Access audit logs for Auth and Firestore in production when the project
  is L2 or higher and the cost is acceptable (OBS-09).

### Extensions and Remote Config

- **SEC-FB-17 Extensions are dependencies.** Review their permissions and
  source like any package (DEP-01) and pin their versions.
- **SEC-FB-18 Remote Config is client-visible.** Never store secrets or
  authorization decisions in it.
