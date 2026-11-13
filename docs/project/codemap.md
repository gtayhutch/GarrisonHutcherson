---
id: project/codemap
version: 0.2.0
load_when: Start of any coding task. Read this instead of crawling the repository.
---

# Codemap

One line per module: where it is and what it is responsible for. Update it in
the same commit as any structural change (DOC-06). Keep it under 150 lines; if
a feature needs more detail, put it in the module header of that feature's
public interface (DOC-03).

Paths below are examples; use the layout from the stack profile.

## Top level

| Path | Responsibility |
| --- | --- |
| {{`src/app/`}} | {{Routes or screens only; thin}} |
| {{`src/features/`}} | Vertical feature slices (see below) |
| {{`src/components/ui/`}} | Shared presentational components |
| {{`src/lib/`}} | Config, errors, logger, client initialization |
| {{`src/lib/server/`}} | Server-only: privileged clients, session, authorization helpers |
| {{`jobs/` or `functions/`}} | Event handlers, queue consumers, scheduled jobs |
| {{`tests/e2e/`, `tests/policies/`}} | End-to-end and access-policy tests |
| `scripts/` | Seed data, migrations, one-off tooling |

## Features

| Feature | Path | Responsibility | Public interface | Patterns |
| --- | --- | --- | --- | --- |
| {{auth}} | {{`src/features/auth/`}} | {{Sign-in, session exchange, sign-out}} | {{`signIn`, `signOut`}} | {{Facade}} |

## Shared modules

| Module | Responsibility | Notes |
| --- | --- | --- |
| {{config}} | Validated configuration (ARCH-07) | Only place that reads environment variables |
| {{errors}} | Application errors, `ActionResult` (OBS-02) | |
| {{logger}} | Structured logger (OBS-06) | |
| {{authz}} | Data-access-layer authorization (SEC-AZ-01) | Mirrors any database policies |

## Background jobs

| Job | Trigger | Responsibility | Idempotency key |
| --- | --- | --- | --- |
| {{onUserDeleted}} | {{account deleted}} | {{Deletes user data (SEC-DATA-08)}} | {{user ID}} |

## Scripts

| Script | Purpose |
| --- | --- |
| {{`scripts/seed`}} | Synthetic data for the local and staging environments (ENV-07) |
