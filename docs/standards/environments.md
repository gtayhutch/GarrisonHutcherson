---
id: standards/environments
version: 2.0.0
load_when: Setting up a project, running locally, changing configuration or environment variables, deploying, promoting between environments, or anything that touches a hosted environment.
---

# Environments: test, staging, production

Every project has the same three environments, whatever its stack. Where each
one runs is a stack decision, recorded in `docs/project/stack.md`
(Environments) and implemented by the stack profile.

## The three environments

| | **test** | **staging** | **production** |
| --- | --- | --- | --- |
| Git branch | `test` | `staging` | `production` |
| Runs on | The developer's machine | Hosted (target in `stack.md`) | Hosted (target in `stack.md`) |
| Reaches hosted data? | **Never** | Its own only | Its own only |
| Data | Seeded, synthetic | Seeded, synthetic | Real users |
| Deployed by | — (never deployed) | Merge to `staging` | Merge to `production` + approval |
| Who uses it | Developer and agents | Developer, testers, allowlisted accounts | Users |

The `test` branch is pushed to the remote so CI runs on it, but it is never
deployed to a hosted environment.

## Rules

- **ENV-01 One mapping, everywhere.** Branch names and the table above are the
  same in every project. The concrete targets (projects, accounts, URLs) are
  recorded once, in `docs/project/stack.md`.
- **ENV-02 Local can't reach hosted data.** The `test` environment runs on
  local emulators, local containers, or isolated credentials that have no
  access to staging or production (for example an emulator-only project ID, a
  Docker Compose database, or a sandbox account). Code cannot reach a hosted
  resource even by mistake.
- **ENV-03 The default target is the safe one.** Every CLI, script, and config
  defaults to the local environment. Commands that target a hosted environment
  name it explicitly (`--env staging`, `--project production`, or the tool's
  equivalent).
- **ENV-04 Agents never touch hosted environments on their own.** No deploys,
  console changes, data writes, or deletions in `staging` or `production`
  unless a human asks for that specific action in the current session.
  Promotion happens through pull requests (GIT-06), not commands.
- **ENV-05 Same code, different config.** Environments differ only through
  configuration, secrets, and platform settings. No
  `if (env === 'production')` branches in application logic; use a config
  value or a feature flag.
- **ENV-06 Staging mirrors production.** Same providers, access policies,
  indexes, background jobs, headers, and abuse protection; smaller resource
  limits are fine. Anything enabled in production is enabled in staging first.
- **ENV-07 Data never flows down.** Production data is not copied to staging or
  local machines (SEC-12). Each environment has a seed task (the local one runs
  automatically; the staging one is run by a human).
- **ENV-08 Visible environment.** Non-production environments show an
  environment banner in the UI, are not indexed by search engines, and restrict
  sign-in to allowlisted accounts.
- **ENV-09 Every client knows its environment.** Mobile, desktop, and other
  clients have one build configuration per environment (for example bundle IDs
  ending in `.staging`). Release builds point only at production.
- **ENV-10 Rollback is ready.** Production can be returned to the previous
  release quickly; the exact steps are in the stack profile and
  `docs/checklists/release.md`.
- **ENV-11 Isolation.** `staging` and `production` are separate projects or
  accounts on the hosting platform, with separate databases, user pools, file
  storage, secrets, and service identities. They never share a resource.

## Configuration layering

Whatever the stack, configuration is layered the same way and read through the
config module (ARCH-07):

| Layer | Holds | Committed? |
| --- | --- | --- |
| Base | Shared, production-safe defaults | Yes |
| Environment overlay (`staging`, `production`) | Only what differs per environment | Yes |
| Local overlay | Non-secret local values (emulator hosts, feature flags) | Yes |
| Local secrets | Test-mode third-party credentials | **No** (gitignored) |
| Hosted secrets | Real credentials, by reference to the secrets manager | References only |

The stack profile names the actual files.

## Promotion path

```text
feat/* ──PR (squash)──▶ test ──PR (merge)──▶ staging ──PR (merge + approval)──▶ production
```

Each arrow is a pull request with required checks (`docs/standards/ci-cd.md`).
What must be true before each step is in `docs/checklists/release.md`.
