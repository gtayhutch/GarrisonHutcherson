---
id: standards/git-workflow
version: 2.0.0
load_when: Creating branches, writing commit messages, opening or merging pull requests, promoting between environments, hotfixes, releases.
---

# Git workflow

## Branch model

```text
feat/*, fix/*, chore/* ──squash──▶ test ──merge──▶ staging ──merge──▶ production
                                                                    ▲
hotfix/* ───────────────────────────────────────────────────────────┘
          (then back-merge production → staging → test)
```

| Branch | Purpose | Deployed to | Who merges |
| --- | --- | --- | --- |
| `test` | Integration branch; default branch on the remote | Nothing (local environment) | Anyone, via PR with green checks |
| `staging` | Release candidate | The staging target in `stack.md` | Promotion PR from `test` |
| `production` | What users run | The production target in `stack.md` | Promotion PR from `staging`, with approval |
| `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>` | One change each | — | Author |
| `hotfix/<slug>` | Urgent production fix | — | Author, PR into `production` |

## Rules

- **GIT-01 Protected branches.** `test`, `staging`, and `production` accept
  changes only through pull requests with all required checks passing. No
  direct pushes, no force pushes, no deletion. `production` additionally
  requires an approval and a deployment-environment approval for deploy jobs
  (GitHub Environments or the host's equivalent).
- **GIT-02 Short-lived branches** from `test`, named `<type>/<short-slug>`
  (`feat/invite-members`). Merge within a few days; rebase on `test` rather
  than merging `test` into the branch.
- **GIT-03 Conventional Commits.** `type(scope): summary` in the imperative,
  ≤ 72 characters, no trailing period. Types: `feat`, `fix`, `refactor`,
  `perf`, `test`, `docs`, `build`, `ci`, `chore`, `security`. Breaking changes
  use `!` (`feat(api)!: …`) and a `BREAKING CHANGE:` footer. The body explains
  *why* and cites rule IDs or ADRs when relevant.
- **GIT-04 Small pull requests.** One concern per PR; aim for under ~400
  changed lines excluding generated files and lockfiles. Split refactors from
  behavior changes.
- **GIT-05 Merge strategies.**
  - Feature → `test`: **squash** (one clean commit per change).
  - `test` → `staging` and `staging` → `production`: **merge commit** (or
    fast-forward). Never squash promotion PRs; squashing makes the branches
    diverge and causes repeated conflicts.
- **GIT-06 Promotion PRs.** Title `release: test → staging (YYYY-MM-DD)` or
  `release: staging → production (vX.Y.Z)`. The body lists included changes,
  migrations, rules/index/function changes, and the checklist from
  `docs/checklists/release.md`.
- **GIT-07 Hotfixes** branch from `production`, merge into `production` by PR,
  and are immediately back-merged `production → staging → test` so no branch
  loses the fix.
- **GIT-08 Releases are tagged.** Each merge to `production` is tagged
  `vMAJOR.MINOR.PATCH` (Semantic Versioning). Release notes are generated from
  commit messages.
- **GIT-09 Nothing sensitive is committed.** `.gitignore` covers `.env*`
  (except `.env.example`), local secret overlays, local emulator or database
  exports, credential files, `CLAUDE.local.md`, and build output, plus the
  entries the stack profile lists. Secret scanning and push protection are on
  (SEC-03).
- **GIT-10 PR description.** Use `.github/pull_request_template.md`: what and
  why, how it was verified, rule IDs that apply, security impact and abuse
  cases, docs updated.
- **GIT-11 Reviews.** Every PR gets a review against
  `docs/checklists/pr-review.md`. On solo projects, required approvals may be
  zero, but the author still completes the checklist and an AI review is run;
  required status checks are never optional.
- **GIT-12 Agents commit, humans promote.** Agents may create branches, commit,
  push feature branches, and open PRs into `test`. Merging promotion PRs into
  `staging` or `production` is a human action (ENV-04).

## Commit message examples

```text
feat(invites): let workspace admins invite members by email

Adds the inviteMember entry point and its access-policy tests.
Rate limited to 20 invites/hour per workspace (SEC-IO-19).

Refs: #42
```

```text
fix(auth)!: require recent sign-in before changing email

BREAKING CHANGE: changeEmail now returns REAUTH_REQUIRED when the session
is older than 5 minutes (SEC-SES-06).
```

## Branch protection settings

Shown with GitHub's names; other Git hosts have equivalent settings.

| Setting | `test` | `staging` | `production` |
| --- | --- | --- | --- |
| Require PR | ✓ | ✓ | ✓ |
| Required status checks (`verify`) | ✓ | ✓ | ✓ |
| Require branch up to date | ✓ | ✓ | ✓ |
| Required approvals | 0–1 | 0–1 | 1 (or Environment approval on solo projects) |
| Restrict who can merge | — | Maintainers | Maintainers |
| Block force push and deletion | ✓ | ✓ | ✓ |
| Require linear history | ✓ (squash) | — (merge commits) | — (merge commits) |
