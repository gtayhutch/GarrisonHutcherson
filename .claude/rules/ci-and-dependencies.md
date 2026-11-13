---
paths:
  - ".github/**"
  - "**/package.json"
  - "**/package-lock.json"
  - "**/pnpm-lock.yaml"
  - "**/pyproject.toml"
  - "**/requirements*.txt"
  - "**/build.gradle.kts"
  - "**/settings.gradle.kts"
  - "**/Cargo.toml"
  - "**/go.mod"
  - "**/Package.swift"
---
# CI and dependencies

Read `docs/standards/ci-cd.md` and `docs/standards/dependencies.md`.

- Keep the standard task names and the `verify` contract (CI-01).
- New dependencies are justified in the PR: need, health, license, security, size (DEP-01).
- A new language, framework, database, or hosted service is a stack change: ask the user first (SEL-10).
- CI actions are pinned to commit SHAs; minimal permissions (CI-07).
- Deploy commands name their target environment explicitly (ENV-03).
