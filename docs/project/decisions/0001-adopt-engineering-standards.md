# 0001. Adopt engineering standards v2.0.0

- **Status:** Accepted
- **Date:** 2026-11-12
- **Deciders:** Garrison Hutcherson
- **Rules affected:** All (`docs/standards/`, `docs/checklists/`)

## Context

The project was started from the engineering-standards template, so that
agents and humans share one set of rules for style, security, testing, and
delivery from the first commit.

## Options considered

1. **Adopt the template standards v2.0.0** — consistent rules and agent
   routing from day one. Cons: some rules are heavier than a static site needs;
   those deviations are recorded as overrides.
2. **Do nothing** — ad hoc conventions. Cons: inconsistent agent output and no
   security baseline.

## Decision

Adopt the standards at template version `2.0.0`. Project-specific deviations
go in `docs/project/overrides.md`.

## Consequences

- Every change follows `AGENTS.md`, the routing table, and the Definition of
  Done.
- Template updates are synced deliberately, and each sync records the new
  version here or in a superseding ADR.
