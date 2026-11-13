---
id: standards/testing
version: 2.0.0
load_when: Writing or changing tests, fixing a bug, changing access policies, or deciding what to test for a change.
---

# Testing

Stack-neutral. Test frameworks are chosen in the stack interview and listed in
`docs/project/stack.md`; the stack profile shows setup and examples.

## Rules

- **TEST-01 Behavior changes ship with tests** in the same PR. A PR that changes
  behavior without a test explains why in its description.
- **TEST-02 Test pyramid.**

  | Layer | Tests | Runs against | Example tools |
  | --- | --- | --- | --- |
  | Unit | Pure domain functions, schemas, utilities | Nothing external | Vitest/Jest, pytest, JUnit/Kotest, XCTest, `go test`, `cargo test` |
  | Integration | Repositories, services, entry points, jobs | The local `test` environment (emulators or containers) | Same, plus Testcontainers or platform emulators |
  | Access policies | Every database access policy, every role | Local emulator or database | The platform's policy-testing library |
  | End-to-end | Critical user journeys | Built app + local environment | Playwright, Cypress, Maestro, XCUITest, Espresso |

  Most tests are unit tests. End-to-end tests cover the journeys listed in
  `docs/project/overview.md`, not every edge case.
- **TEST-03 Coverage floors** (enforced in CI): domain code ≥ 90% lines and
  branches; overall ≥ 80% lines. Coverage is a floor, not a goal; untested
  error paths fail review even when the number is met.
- **TEST-04 Authorization is tested at every enforcement point.** Server-side
  authorization always; database access policies (for example Firestore
  Security Rules or PostgreSQL row-level security) whenever the stack has
  them. Each rule has at least one *allowed* and one *denied* test per relevant
  actor: signed out, owner, other user, other tenant, each role. Field-level
  restrictions (SEC-AZ-03) have a test that tries to write a forbidden field.
- **TEST-05 Never test against hosted environments.** Tests use the local `test`
  environment only. The one exception is the post-deploy smoke suite (CI-08),
  which uses dedicated test accounts.
- **TEST-06 Deterministic tests.** Inject the clock, random sources, and IDs.
  No sleeps; wait for conditions. Each test sets up and clears its own data.
- **TEST-07 Names describe behavior:** `applyDiscount` →
  "caps the discount at the order subtotal". One behavior per test;
  arrange–act–assert.
- **TEST-08 Build data with factories** (`buildUser({role: 'admin'})`), not
  shared mutable fixtures. Factories create valid objects by default.
- **TEST-09 Bugs get a regression test first.** Write the failing test, then
  fix it. Reference the issue in the test name or a comment.
- **TEST-10 Security behavior is tested.** Authorization matrix (allowed and
  denied per role), invalid and oversized input rejected, security headers
  present, rate limits trigger, re-authentication enforced.
- **TEST-11 Accessibility is tested.** UI end-to-end tests run an automated
  accessibility check on each critical screen (for example axe on the web, the
  platform's accessibility audits on mobile) (FE-09).
- **TEST-12 Mock only at boundaries.** Mock third-party HTTP and the clock. Do
  not mock your own modules to make tests pass; use the local environment
  instead.
- **TEST-13 Flaky tests are bugs.** Quarantine within a day with a linked issue;
  fix or delete within a week.

## What to test for a change

| Change | Minimum tests |
| --- | --- |
| New domain rule | Unit tests for normal, boundary, and invalid cases |
| New entry point | Integration: success, invalid input, unauthenticated, unauthorized |
| Access-policy change | Allowed + denied per actor (TEST-04) |
| New screen or flow | E2E for the happy path if it is a critical journey; accessibility check |
| Bug fix | Regression test that failed before the fix |
| Migration | Dry run on seeded local data; idempotency (run twice) |
