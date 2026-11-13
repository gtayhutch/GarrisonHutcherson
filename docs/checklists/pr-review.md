---
id: checklists/pr-review
version: 2.0.0
load_when: Reviewing a pull request (human or AI review).
---

# Pull request review

Review in this order; stop and request changes at the first blocking issue
in a section. Cite rule IDs in comments so authors can look them up.

## 1. Intent

- [ ] The description says what changed and why, and how it was verified.
- [ ] The PR does one thing (GIT-04). Refactors are separate from behavior
      changes.

## 2. Security (blocking)

- [ ] Every new or changed entry point validates input, authenticates, and
      authorizes the specific object (ARCH-04, SEC-AZ-02).
- [ ] Server checks and any database access policies agree, and tests cover
      allowed and denied cases (SEC-AZ-09, TEST-04).
- [ ] No secrets, tokens, or personal data in code, logs, errors, or URLs.
- [ ] Responses return only the fields the caller may see (SEC-API-02).
- [ ] If the change touches auth, access policies, data model, headers, config, files,
      or dependencies: `security-review.md` is completed.

## 3. Correctness

- [ ] Edge cases handled: empty, missing, duplicate, concurrent, oversized.
- [ ] Multi-record changes are atomic (DB-10); triggers are idempotent
      (ARCH-09).
- [ ] Errors are not swallowed; users see generic messages (OBS-03, OBS-04).
- [ ] Tests would fail if the change were reverted.

## 4. Design and readability

- [ ] Code is in the right layer and folder (ARCH-01..03).
- [ ] Any pattern is justified by a real problem and named (PAT-01, PAT-05).
- [ ] Names are descriptive; functions are small (STY-04, STY-05, ARCH-10).
- [ ] Doc comments let a new reader use each export without reading its body
      (DOC-01, DOC-02).

## 5. Operations

- [ ] Config read through the config module; no environment-specific branches
      (ARCH-07, ENV-05).
- [ ] Migrations follow expand → migrate → contract and have a dry run (DB-09).
- [ ] New logs are structured, with stable event names and no sensitive data
      (OBS-06, OBS-08).
- [ ] New dependencies are justified (DEP-01).

## 6. Docs

- [ ] Codemap, data model, security decisions, ADRs updated as needed (DOC-06).

## Comment labels

Prefix review comments so priority is clear: **blocking:**, **should:**,
**nit:** (non-blocking style or taste), **question:**.
