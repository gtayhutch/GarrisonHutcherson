---
paths:
  - "**/*.test.*"
  - "**/*.spec.*"
  - "**/*_test.*"
  - "**/test_*.py"
  - "tests/**"
  - "test/**"
---
# Tests

Read `docs/standards/testing.md` (and the stack profile's testing doc).

- The local `test` environment only; never hosted environments (TEST-05).
- Deterministic: inject clock and randomness; no sleeps (TEST-06).
- Names describe behavior; one behavior per test (TEST-07).
- Build data with factories (TEST-08); mock only at boundaries (TEST-12).
- Access-policy changes need allowed and denied tests per actor (TEST-04).
