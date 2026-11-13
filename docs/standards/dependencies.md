---
id: standards/dependencies
version: 2.0.0
load_when: Adding, upgrading, or removing a package, platform extension, CI action, or third-party script; responding to a vulnerability advisory.
---

# Dependencies and supply chain

Covers the dependency parts of ASVS 5.0 chapter V15 (Secure Coding and
Architecture). Requirement text is paraphrased.

## Rules

- **DEP-01 Every new dependency is justified** in the PR description:
  - the need, and why the platform or an existing dependency can't meet it;
  - health: recent releases, active maintainers, issue response, adoption;
  - license is on the allowlist (MIT, Apache-2.0, BSD-2/3-Clause, ISC,
    0BSD); anything else needs approval;
  - security: no open high/critical advisories; provenance where available;
  - cost: install size and, for client code, bundle impact (FE-11).
- **DEP-02 Latest stable at adoption.** New dependencies and new projects start
  on the latest stable release. No pre-release versions in `staging` or
  `production`.
- **DEP-03 Lockfiles are committed** and installs are frozen in CI (CI-06). One
  package manager per repo.
- **DEP-04 Runtimes are pinned** with each ecosystem's mechanism (for example
  `.nvmrc` plus `engines`, `.python-version`, Gradle toolchains,
  `rust-toolchain.toml`, `go.mod`'s `toolchain`).
- **DEP-05 Remediation timelines** (from advisory publication or first alert):

  | Severity | Fix or mitigate within |
  | --- | --- |
  | Critical | 72 hours |
  | High | 7 days |
  | Medium | 30 days |
  | Low | 90 days |
  | Routine updates (no advisory) | Monthly |
  | Major versions of core frameworks | Within 6 months of release, unless an override records why not |

  A component past its deadline blocks releases to `production`.
  `[ASVS 15.1.1, 15.2.1 · L1]`
- **DEP-06 Automated update PRs** (Dependabot or Renovate), weekly, grouped by
  ecosystem; security updates immediately. Each update PR must pass `verify`.
- **DEP-07 SBOM.** CI produces a CycloneDX SBOM for each production release
  (for example `npm sbom`, `cyclonedx-py`, the CycloneDX Gradle plugin, or
  `syft`) and stores it with the
  release. Dependencies come only from the official registries.
  `[ASVS 15.1.2 · L2]`
- **DEP-08 Audit in CI.** The ecosystem's audit tool (or OSV-Scanner) fails PRs on
  high/critical advisories in production dependencies.
- **DEP-09 Install scripts are not trusted.** Configure the package manager to
  block dependency lifecycle scripts unless the package is allowlisted.
- **DEP-10 No trivial dependencies.** Don't add a package for something that is
  a few lines of code or a platform API.
- **DEP-11 Remove what you don't use.** Unused dependencies are detected in CI
  (for example `knip`, `deptry`, or the build tool's analyzer) and removed.
- **DEP-12 Aligned platform SDKs.** SDKs from the same platform (client,
  server/admin, functions runtime, CLI) are upgraded together and tested
  against the local environment.
- **DEP-13 Everything executable counts:** GitHub Actions (pinned to a commit
  SHA, CI-07), platform extensions and plugins, CDN scripts (SEC-WEB-15), and
  container base images follow the same rules.
- **DEP-14 Resource-heavy features are documented.** Features that are
  expensive to run (AI calls, exports, image processing) are listed in
  `security-decisions.md` with their limits, and protected by rate limits,
  quotas, and concurrency or instance caps. `[ASVS 15.1.3, 15.2.2 · L2]`
