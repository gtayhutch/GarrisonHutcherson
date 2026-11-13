---
id: standards/ci-cd
version: 2.0.0
load_when: Editing CI workflows, task-runner scripts, deploy configuration, or diagnosing a failed check, deploy, or rollback.
---

# CI/CD

Stack-neutral. The CI provider, task runner, and deploy mechanics are stack
decisions (`docs/project/stack.md`); the stack profile shows the concrete
workflows.

## Rules

- **CI-01 The `verify` contract.** Every project defines these tasks in its
  task runner (npm scripts, `make`, `just`, Gradle, Cargo aliases, …), spelled
  the runner's way, and `verify` runs them in this order. CI runs exactly
  `verify`, so "it passes locally" means "it passes in CI". The actual
  commands are listed in `stack.md`.

  | Task | Does |
  | --- | --- |
  | `format-check` | Formatter in check mode for every language (STY-01) |
  | `lint` | Linters, including import-boundary rules (ARCH-01..08) |
  | `typecheck` | Type checkers, where the language has one |
  | `test` | Unit and integration tests against the local `test` environment |
  | `test-policies` | Database access-policy tests, if the stack has policies (TEST-04) |
  | `build` | Production build of every deployable |
  | `test-e2e` | End-to-end tests against the built app in the local environment |
  | `verify` | All of the above |

- **CI-02 Required checks on every PR** into `test`, `staging`, and
  `production`: `verify`, dependency audit (DEP-08), secret scanning, and code
  scanning. A red check blocks the merge; no "merge anyway".
- **CI-03 Every deployable has a defined path.** For each artifact (app,
  database schema and indexes, access policies, functions or workers,
  infrastructure), the profile and `stack.md` say how it reaches `staging` and
  `production`. Production deploys require an approval step. Every deploy
  command names its target explicitly (ENV-03).
- **CI-04 Deploy order.** Backend changes (schema, indexes, policies, workers)
  deploy before the app that depends on them, or every backend change is made
  backward compatible (expand → migrate → contract, DB-09). Record the chosen
  approach in an ADR.
- **CI-05 Keyless authentication.** CI authenticates to the hosting platform
  with short-lived OIDC federation (for example GitHub OIDC to Google Workload
  Identity Federation, AWS IAM roles, or Azure federated credentials), using a
  deploy identity per environment with only deploy permissions. No long-lived
  keys in CI secrets unless the platform offers no alternative; record that as
  an override.
- **CI-06 Reproducible builds.** A committed lockfile, a pinned runtime
  version, and frozen installs. Where the platform allows, build once and
  promote the same artifact; where it builds from source, the lockfile and
  pinned runtime provide reproducibility.
- **CI-07 Pinned actions.** Third-party CI actions or plugins are pinned to a
  full commit SHA (or an immutable digest). Workflow permissions default to
  read-only and are widened per job only as needed.
- **CI-08 Smoke tests after deploy.** After a staging deploy, a small e2e suite
  runs against the staging URL (sign-in with a test account, a read, a write,
  security headers present). Production gets a read-only smoke test.
- **CI-09 Rollback is a documented, rehearsed path.**
  1. App: return to the previous release using the platform's rollback (steps
     in the profile).
  2. Schema, policies, workers: redeploy the previous `production` commit.
  3. Open a revert PR on `production` so the branch matches what is live.
  4. Write an incident note (OBS-13).
- **CI-10 Fast feedback.** Cache dependencies and local-environment downloads;
  run independent jobs in parallel; keep the PR pipeline under ~10 minutes.

## Workflow shape

Shown for GitHub Actions; the profile has the complete, stack-specific version.

```yaml
# .github/workflows/ci.yml (sketch — pin every action to a commit SHA)
name: ci
on:
  pull_request:
    branches: [test, staging, production]
permissions:
  contents: read
jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@<sha>
      # Set up the toolchain(s) from stack.md, with dependency caching.
      # Start the local test environment if tests need it.
      - run: <install command from stack.md>
      - run: <verify command from stack.md>
```

Deploy workflows run on pushes to `staging` and `production`, use a
deployment environment (approval required for production), authenticate with
OIDC (CI-05), and deploy in the order chosen under CI-04.
