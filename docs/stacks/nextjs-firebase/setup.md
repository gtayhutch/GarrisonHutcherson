---
id: stacks/nextjs-firebase/setup
version: 2.0.0
load_when: Running step 2 of docs/checklists/new-project-setup.md for a project that chose the nextjs-firebase profile.
---

# Setup: Next.js + Firebase

The stack-specific part of `docs/checklists/new-project-setup.md`. Steps
marked 👤 need a human in a browser console.

## Application scaffold

- [ ] Create the Next.js app (App Router, TypeScript, Tailwind, `src/`
      directory) on the latest stable versions (DEP-02).
- [ ] Apply the compiler flags in TS-01; install Prettier with `gts` settings,
      ESLint with import-boundary rules, Vitest, Playwright,
      `@firebase/rules-unit-testing`, zod, and `server-only`.
- [ ] Add the npm scripts from the profile README (CI-01) and pin Node
      (`engines`, `.nvmrc`).
- [ ] Create `src/lib/config.ts`, `errors.ts`, `logger.ts`, and
      `src/lib/server/{admin,session,authz}.ts` skeletons.
- [ ] Add the header baseline in `next.config.ts` and the CSP nonce in
      `src/proxy.ts`, with a test that asserts the headers (NXF-35).

## Firebase projects 👤

- [ ] Create `{{APP_SLUG}}-staging` and `{{APP_SLUG}}-prod`; tag production with
      the "production" environment type (NXF-13).
- [ ] In both: enable Authentication (recorded providers only), Firestore (same
      region for both), Storage, and App Check (monitoring mode first).
- [ ] `firebase init` for Firestore, Storage, Functions, and Emulators
      (including App Hosting); write `.firebaserc` with `default` →
      `demo-{{APP_SLUG}}`, plus `staging` and `production` aliases (NXF-12).
- [ ] Deny-all `firestore.rules` and `storage.rules` with rules tests, deployed
      to both projects from the repo.

## App Hosting 👤

- [ ] One backend per project, connected to the repo. Live branch `staging` /
      `production`; environment name `staging` / `production`.
- [ ] Decide automatic vs. CI-triggered rollouts and record it in an ADR
      (NXF-51).
- [ ] Commit `apphosting.yaml`, `apphosting.staging.yaml`,
      `apphosting.production.yaml`, `apphosting.emulator.yaml` (NXF-14, NXF-15).
- [ ] Create secrets in each project's Secret Manager and grant each backend
      access only to its own (NXF-40).

## Platform hardening 👤

- [ ] Work through `firebase-hardening.md` and record the settings in
      `docs/project/security-decisions.md` (Platform settings record).

## CI

- [ ] Add `ci.yml` and `deploy-backend.yml` from `ci-deploy.md`; set up Workload
      Identity Federation and the `WIF_PROVIDER` / `DEPLOY_SERVICE_ACCOUNT`
      variables in the `staging` and `production` GitHub Environments.

## Agent rules

- [ ] Copy `agent-rules/claude/*.md` into `.claude/rules/` and
      `agent-rules/antigravity/*.md` into `.agents/rules/`.
- [ ] Fill in `docs/project/stack.md` (Commands, Environments, Where the
      standards live) from this profile.
