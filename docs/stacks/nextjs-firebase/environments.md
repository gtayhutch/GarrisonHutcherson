---
id: stacks/nextjs-firebase/environments
version: 2.0.0
load_when: Setting up Firebase projects, App Hosting backends, emulators, environment config, or rolling back in a Next.js + Firebase project.
---

# Environments on Firebase

Implements `docs/standards/environments.md` (ENV-01..11).

| | **test** | **staging** | **production** |
| --- | --- | --- | --- |
| Git branch | `test` | `staging` | `production` |
| Firebase project | `demo-{{APP_SLUG}}` (emulators only) | `{{APP_SLUG}}-staging` | `{{APP_SLUG}}-prod` |
| `.firebaserc` alias | `default` | `staging` | `production` |
| App Hosting backend | — | Live branch `staging`, environment name `staging` | Live branch `production`, environment name `production` |
| Config files | `apphosting.yaml` + `apphosting.emulator.yaml` (+ gitignored `apphosting.local.yaml`) | `apphosting.yaml` + `apphosting.staging.yaml` | `apphosting.yaml` + `apphosting.production.yaml` |

## Rules

- **NXF-11 `demo-` project locally (ENV-02).** The emulators run under a
  project ID starting with `demo-`, which has no real resources, so code can
  only reach emulators. The app connects to emulators when
  `NEXT_PUBLIC_USE_EMULATORS=true`.
- **NXF-12 Safe default alias (ENV-03).** `.firebaserc` sets `default` to the
  demo project. Every Firebase CLI command that targets a hosted environment
  passes `--project staging` or `--project production`.
- **NXF-13 One Firebase project per hosted environment (ENV-11).** Tag the
  production project with the "production" environment type.
- **NXF-14 Config overlays.** Shared defaults go in `apphosting.yaml`; only the
  differences go in `apphosting.staging.yaml` / `apphosting.production.yaml`.
  App Hosting picks the overlay matching the backend's environment name.
- **NXF-15 Local config.** `apphosting.emulator.yaml` (committed) holds
  non-secret local values. Test-mode third-party credentials go in
  `apphosting.local.yaml`, which is gitignored (also add emulator exports and
  any service-account JSON to `.gitignore`, GIT-09).
- **NXF-16 Firebase web config per project.** App Hosting can supply the web
  app config to the build automatically; otherwise set the
  `NEXT_PUBLIC_FIREBASE_*` values in each overlay. Either way it is read
  through `src/lib/config.ts`.
- **NXF-17 Rollback (ENV-10).** Roll the App Hosting backend back to the
  previous rollout in the console, redeploy rules/indexes/functions from the
  previous `production` commit if they changed, then open a revert PR.

## Config examples

```yaml
# apphosting.yaml — shared defaults (production-safe).
runConfig:
  minInstances: 0
  maxInstances: 10   # Caps cost and abuse; see SEC-FB-13.
env:
  - variable: NEXT_PUBLIC_APP_ENV
    value: production
    availability: [BUILD, RUNTIME]
  - variable: STRIPE_SECRET_KEY
    secret: stripe-secret-key   # Secret Manager, per project.
```

```yaml
# apphosting.staging.yaml — only what differs in staging.
runConfig:
  maxInstances: 2
env:
  - variable: NEXT_PUBLIC_APP_ENV
    value: staging
    availability: [BUILD, RUNTIME]
```

## Local workflow (`test`)

```bash
npm run dev     # firebase emulators:start (incl. the App Hosting emulator)
npm run seed    # loads synthetic data into the emulators (ENV-07)
npm run verify  # what CI runs
```

Emulator state is disposable; use seed scripts, never exported production
snapshots.
