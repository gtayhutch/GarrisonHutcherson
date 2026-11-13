---
id: stacks/nextjs-firebase
version: 2.0.0
load_when: stack.md names this profile and the task needs Next.js or Firebase specifics — folder layout, commands, framework rules. Open the other files in this folder only when the routing table says "+ profile".
---

# Profile: Next.js + Firebase

Status: Maintained · Rule prefixes: `NXF-` (this profile), `FS-` (Firestore),
`SEC-FB-` (Firebase hardening)

## Summary

A server-rendered web app on Next.js (App Router) and TypeScript, with Firebase
for authentication, Firestore, Cloud Storage, Cloud Functions, and App Hosting.
Little infrastructure to run, realtime and offline support built in, and a full
local emulator suite.

**Choose it when:** a web app (optionally with Firebase-backed mobile clients)
needs auth, a document database, file storage, and background functions with
minimal operations work.
**Avoid it when:** the data is heavily relational or needs complex ad-hoc
queries and reporting, strict data residency rules out Google Cloud, or the
team needs to avoid platform lock-in.

## Files in this profile

| File | Open when |
| --- | --- |
| `environments.md` | Firebase projects, App Hosting config, emulators, rollback |
| `security.md` | Firebase Auth, session cookies, Security Rules, headers, secrets |
| `firebase-hardening.md` | Console, IAM, App Check, backups, budgets |
| `data-firestore.md` | Firestore and Storage modeling, limits, indexes |
| `testing.md` | Vitest, rules tests, Playwright, emulators |
| `ci-deploy.md` | GitHub Actions, deploy order, Workload Identity Federation |
| `setup.md` | New-project steps for this stack |
| `agent-rules/` | Path-scoped rules to copy into `.claude/rules/` and `.agents/rules/` |

## Components and versions

| Component | Choice | Version policy |
| --- | --- | --- |
| Language | TypeScript (strict, TS-01) | Latest stable |
| Web framework | Next.js App Router, React | Latest stable major |
| Styling | Tailwind CSS (WEB-11..14 apply) | Latest stable |
| Validation | zod | Latest stable |
| Auth | Firebase Authentication (Identity Platform features as needed) | — |
| Database / files | Cloud Firestore / Cloud Storage for Firebase | — |
| Backend jobs | Cloud Functions for Firebase (2nd gen) | Latest `firebase-functions` |
| Hosting | Firebase App Hosting | — |
| Local `test` environment | Firebase Emulator Suite under a `demo-` project ID | Latest `firebase-tools` |
| Tests | Vitest, `@firebase/rules-unit-testing`, Playwright, axe | Latest stable |

## Folder layout and concept map

```text
src/
  app/                        # Routes only: page, layout, route, loading, error
  features/<feature>/
    index.ts                  # Public interface (ARCH-02)
    components/               # Feature UI (server components by default)
    actions.ts                # Server Actions: entry points (ARCH-04)
    service.ts  domain.ts  schema.ts
    repository.ts             # Firestore/Storage access (server-only)
  components/ui/              # Shared presentational components
  lib/
    config.ts  errors.ts  logger.ts
    firebase/client.ts        # Client SDK init
    server/                   # server-only: admin.ts, session.ts, authz.ts
  proxy.ts                    # Request proxy: CSP nonce, redirects (not authz)
functions/                    # Cloud Functions; same layering, own package.json
tests/e2e/  tests/rules/
firestore.rules  storage.rules  firestore.indexes.json
apphosting.yaml  apphosting.staging.yaml  apphosting.production.yaml
apphosting.emulator.yaml  firebase.json  .firebaserc
```

| Universal concept | Here |
| --- | --- |
| Server-only boundary (ARCH-03) | `import 'server-only'` in every server module (NXF-03) |
| Entry points (ARCH-04) | `actions.ts` (Server Actions), `src/app/api/v1/**/route.ts`, `functions/src/**` |
| Data access layer and authz helpers (SEC-AZ-01) | `src/lib/server/authz.ts`, `src/lib/server/session.ts` |
| Database access policies | `firestore.rules`, `storage.rules` |
| Config module (ARCH-07) | `src/lib/config.ts` |
| Security headers | `next.config.ts` `headers()` + `src/proxy.ts` (CSP nonce) |
| Error boundaries (OBS-14) | `error.tsx` per route group, `global-error.tsx` at the root |
| Import-boundary lint | `eslint-plugin-boundaries` or `import/no-restricted-paths`, `import/no-cycle` |

## Commands (CI-01)

npm scripts (swap in `pnpm` if chosen):

| Task | Script |
| --- | --- |
| `format-check` / `lint` / `typecheck` | `npm run format:check` · `npm run lint` · `npm run typecheck` |
| `test` / `test-policies` / `test-e2e` | `npm run test` · `npm run test:rules` · `npm run test:e2e` |
| Local app + emulators | `npm run dev` |
| `build` / `verify` | `npm run build` · `npm run verify` |

## Framework rules

- **NXF-01 Default-export exception (TS-03).** Only Next.js special files use
  `export default`: `page`, `layout`, `template`, `loading`, `error`,
  `global-error`, `not-found`, `default`, plus tool config files
  (`next.config.ts`, etc.). Route handlers (`route.ts`) use named exports
  (`GET`, `POST`). Route folders are URL segments in `kebab-case` (TS-08).
- **NXF-02 Server components by default.** Add `'use client'` only to the
  smallest interactive leaf that needs it (was TS-25).
- **NXF-03 Server-only modules** start with `import 'server-only';` so a client
  import fails the build (ARCH-03; was TS-26).
- **NXF-04 Server Actions are public endpoints.** Every action follows the
  ARCH-04 pipeline and is documented per DOC-02 (was TS-27).
- **NXF-05 Route states.** Each route segment has `loading.tsx` (or Suspense
  fallbacks), `error.tsx`, and `not-found.tsx` where meaningful; the root has
  `global-error.tsx` (FE-05, OBS-14).
- **NXF-06 Forms** submit through a Server Action with `useActionState` and
  render `fieldErrors` from `ActionResult` (FE-04).
- **NXF-07 Platform components:** `next/image` with explicit sizes,
  `next/font`, `next/link`, and `next/script` for third parties (FE-12).
- **NXF-08 Metadata** through `generateMetadata` or `metadata` exports (FE-13).
- **NXF-09 Firestore in the browser** only for realtime or offline views over
  data the rules allow (FE-02); everything else goes through server components
  or Server Actions.
- **NXF-10 `proxy.ts` is not an authorization boundary.** It sets the CSP nonce
  and redirects; authorization lives in `authz.ts` and every action
  (SEC-AZ-10).

## The pipeline in this stack (ARCH-04)

```ts
/**
 * Renames a project the caller can edit.
 * Security: authenticated session; workspace membership (SEC-AZ-02).
 */
export async function renameProject(input: unknown): Promise<ActionResult<{id: string}>> {
  const parsed = renameProjectSchema.safeParse(input);        // 1. parse
  if (!parsed.success) return invalidInput(parsed.error);
  const user = await requireUser();                           // 2. authenticate
  const project = await projectRepository.get(parsed.data.projectId);
  await assertCanEdit(user, project);                         // 3. authorize
  const renamed = applyRename(project, parsed.data.name);     // 4. execute (pure)
  await projectRepository.save(renamed);
  return ok({id: renamed.id});                                // 5. map result
}
```
