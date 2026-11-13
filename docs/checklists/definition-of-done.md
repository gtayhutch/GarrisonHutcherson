---
id: checklists/definition-of-done
version: 2.0.0
load_when: Before saying a task is done, and before opening a pull request.
---

# Definition of Done

A change is done when every applicable box is checked. Say which boxes don't
apply and why in the PR description.

## Code

- [ ] Follows the architecture: right layer, right folder, feature used only
      through its public interface (ARCH-01..03).
- [ ] Every entry point uses the pipeline: parse → authenticate → authorize →
      execute → map result (ARCH-04).
- [ ] Every exported symbol has a doc comment with summary, errors, side
      effects, and security notes (DOC-01, DOC-02).
- [ ] No unexplained lint or type suppressions (and no `any` in TypeScript),
      no dead or commented-out code (STY-08, STY-09, TS-09).
- [ ] Patterns used are named in doc comments (PAT-05).
- [ ] No new language, framework, database, or service outside
      `docs/project/stack.md` without the user's decision (SEL-10).

## Verification

- [ ] The verify command from `docs/project/stack.md` passes locally.
- [ ] New behavior has tests; bug fixes have a regression test (TEST-01, TEST-09).
- [ ] Access-policy changes have allowed and denied tests per actor (TEST-04).
- [ ] UI changes checked by keyboard or screen reader and with an automated
      accessibility check (FE-09).

## Security

- [ ] Inputs validated on the server with schemas that reject unknown fields
      (SEC-02, SEC-IO-14).
- [ ] Object-level authorization on every read and write (SEC-AZ-02).
- [ ] No secrets, tokens, or personal data in code, logs, URLs, or client
      bundles (SEC-03, OBS-08).
- [ ] Security review checklist completed if auth, access policies, data model, entry
      points, headers, config, dependencies, or files changed.

## Documentation

- [ ] `docs/project/stack.md` updated, with an ADR, if a stack component changed (SEL-10).
- [ ] `docs/project/codemap.md` updated if files or folders changed (DOC-06).
- [ ] `docs/project/data-model.md` updated if fields or collections changed (DB-01).
- [ ] `docs/project/security-decisions.md` updated if a security value changed.
- [ ] ADR added for any decision with real alternatives (ARCH-11).
- [ ] `docs/project/status.md` updated with handoff notes if work continues.

## Delivery

- [ ] Commit messages follow Conventional Commits (GIT-03).
- [ ] PR uses the template and lists abuse cases for data or money features.
- [ ] No deviation from the standards without an entry in
      `docs/project/overrides.md`.
