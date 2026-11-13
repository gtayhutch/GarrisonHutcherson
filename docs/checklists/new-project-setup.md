---
id: checklists/new-project-setup
version: 2.0.0
load_when: Starting a new project from this template, or bringing an existing project onto these standards.
---

# New project setup

Work top to bottom. Steps marked 👤 need a human (a decision, or a browser
console); an agent can do the rest when asked.

## 0. Choose the stack 👤 (the gate)

- [ ] Run the stack interview in `docs/standards/stack-selection.md` with the
      user: product and constraints first, then technology choices, then a
      confirmed summary (SEL-03..07).
- [ ] Record it: `docs/project/stack.md` (Status `decided`), ADR
      `0002-stack-selection.md`, ASVS level, and the stack placeholders in
      `AGENTS.md` and `README.md` (SEL-08).
- [ ] Pick the profile from `docs/stacks/`, or create one from
      `docs/stacks/_profile-template/` (SEL-09). Add a style file under
      `docs/standards/code-style/` for any language that lacks one (STY-02).

No scaffolding or application code until this section is complete (SEL-01).

## 1. Repository

- [ ] Create the repo from the template and clone it.
- [ ] Replace every placeholder: `grep -rn "{{" --include="*.md" .`
      (`{{APP_NAME}}`, `{{ONE_LINE_PURPOSE}}`, `{{STACK_SUMMARY}}`,
      `{{VERIFY_CMD}}`, and the rest).
- [ ] Delete profiles the project doesn't use from `docs/stacks/` (keep
      `README.md` and `_profile-template/`).
- [ ] Create branches `test`, `staging`, `production`; make `test` the default
      branch.
- [ ] Add `.gitignore` entries from GIT-09 (plus the profile's) and an
      `.editorconfig` (STY-10).

## 2. Stack-specific setup

- [ ] Follow the profile's setup steps (for example
      `docs/stacks/nextjs-firebase/setup.md`): scaffold, local `test`
      environment, hosted `staging` and `production` environments, hosting,
      secrets, and platform hardening.
- [ ] Confirm the environments meet ENV-01..11: the local environment can't
      reach hosted data, the default target is local, and staging and
      production are fully isolated.

## 3. Universal scaffolding

- [ ] Feature-slice layout and import-boundary lint rules (ARCH-01..08).
- [ ] Config module that validates configuration at startup (ARCH-07).
- [ ] Shared errors and result type, structured logger (OBS-02, OBS-06).
- [ ] Server-side session verification and authorization helpers
      (SEC-SES-02, SEC-AZ-01); deny-all database policies if the stack has
      them, with tests (TEST-04).
- [ ] Security header baseline with a test that asserts it (SEC-WEB-01..06).
- [ ] The CI-01 tasks, with commands recorded in `stack.md`; runtimes pinned
      (DEP-04).

## 4. Git host and CI 👤

- [ ] Branch protection per `docs/standards/git-workflow.md`.
- [ ] Secret scanning with push protection, automated dependency updates,
      code scanning.
- [ ] Deployment environments `staging` and `production` (production with a
      required reviewer) and keyless deploy credentials (CI-05).
- [ ] CI and deploy workflows from the profile, with actions pinned to SHAs
      (CI-07).

## 5. Documentation

- [ ] Fill in `docs/project/overview.md`, `codemap.md`, `data-model.md`,
      `security-decisions.md`, `glossary.md`, `status.md`.
- [ ] ADR 0001: "Adopt engineering standards v2.0.0" (records the template
      version).

## 6. Agent tooling

- [ ] `CLAUDE.md` contains only `@AGENTS.md` plus Claude-specific notes.
- [ ] Universal rules present in `.claude/rules/` and `.agents/rules/`; the
      profile's `agent-rules/claude/` and `agent-rules/antigravity/` copied in.
- [ ] `.claude/settings.json` deny rules for deploy commands and pushes to
      `staging`/`production`; `CLAUDE.local.md` gitignored.

## 7. First release

- [ ] `verify` passes on the scaffold.
- [ ] PR into `test`; promote to `staging`; check headers, sign-in, and abuse
      protection in staging; promote to `production` using `release.md`.
