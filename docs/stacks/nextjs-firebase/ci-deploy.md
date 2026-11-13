---
id: stacks/nextjs-firebase/ci-deploy
version: 2.0.0
load_when: Editing GitHub Actions workflows, deploying, or rolling back a Next.js + Firebase project.
---

# CI and deploy on Next.js + Firebase

Implements `docs/standards/ci-cd.md`.

## Rules

- **NXF-50 Who deploys what (CI-03).**

  | Artifact | Staging | Production |
  | --- | --- | --- |
  | Next.js app | App Hosting rollout from the `staging` branch | App Hosting rollout from the `production` branch |
  | Firestore rules + indexes, Storage rules | CI job on push to `staging` | CI job on push to `production`, behind an Environment approval |
  | Cloud Functions | CI job on push to `staging` | CI job on push to `production`, behind approval |

- **NXF-51 Deploy order (CI-04).** Either disable automatic rollouts on the
  App Hosting backend and trigger the rollout from CI after the backend deploy
  succeeds, or keep automatic rollouts and make every backend change backward
  compatible. Record the choice in an ADR.
- **NXF-52 Keyless auth (CI-05).** GitHub Actions authenticates with Workload
  Identity Federation (`google-github-actions/auth`) to a deploy service
  account per project with deploy-only roles.
- **NXF-53 Emulators in CI.** The verify job installs Java 21 (required by the
  emulators) and runs tests inside `firebase emulators:exec`.
- **NXF-54 Reproducibility (CI-06).** App Hosting builds from source, so pin
  Node (`engines`, `.nvmrc`) and use `npm ci`.

## Workflows

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
      - uses: actions/setup-node@<sha>
        with: {node-version-file: .nvmrc, cache: npm}
      - uses: actions/setup-java@<sha>   # Firebase emulators need Java
        with: {distribution: temurin, java-version: '21'}
      - run: npm ci
      - run: npm run verify
```

```yaml
# .github/workflows/deploy-backend.yml (sketch)
on:
  push:
    branches: [staging, production]
jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: ${{ github.ref_name }}   # production requires approval
    permissions: {contents: read, id-token: write}
    steps:
      - uses: actions/checkout@<sha>
      - uses: google-github-actions/auth@<sha>   # Workload Identity Federation
        with:
          workload_identity_provider: ${{ vars.WIF_PROVIDER }}
          service_account: ${{ vars.DEPLOY_SERVICE_ACCOUNT }}
      - run: npm ci
      - run: npx firebase-tools deploy --only firestore,storage,functions --project ${{ github.ref_name }} --non-interactive
```

Branch names double as `.firebaserc` aliases (`staging`, `production`), so
`--project ${{ github.ref_name }}` always names its target explicitly.

## Rollback (CI-09)

1. Roll the App Hosting backend back to the previous rollout in the console.
2. Re-run `deploy-backend` on the previous `production` commit if rules,
   indexes, or functions changed.
3. Open a revert PR on `production`.
4. Write an incident note (OBS-13).
