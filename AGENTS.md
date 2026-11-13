# AGENTS.md — GarrisonHutcherson.com

> Entry point for every AI agent and human contributor. Always loaded; keep it
> under 150 lines. Everything else is loaded **on demand** via the routing table.
> Standards version: `2.0.0` (see `docs/README.md` for the changelog).

## 0. Stack gate — check this first

Open `docs/project/stack.md`. If its status is not `decided`, **stop**: run the
stack interview in `docs/standards/stack-selection.md` with the user before
writing any code. These standards never choose a technology for you. Never add
a language, framework, database, hosted service, or tool that `stack.md`
doesn't list without asking first (SEL-02, SEL-10).

## 1. Project card

Filled in when the stack is decided.

| Key | Value |
| --- | --- |
| Purpose | Professional site showcasing Garrison Hutcherson's experience and skills |
| Stack | Astro (static) + TypeScript + hand-written CSS on Cloudflare Workers static assets — details in `docs/project/stack.md` |
| Stack profile(s) | `astro-cloudflare` (under `docs/stacks/`) |
| Paradigm | Functional core, imperative shell. Classes only where a pattern needs state + identity. |
| Security target | OWASP ASVS 5.0 Level 1 |
| Environments | `test` → local · `staging` → Worker `garrisonhutcherson-staging` (behind Cloudflare Access) · `production` → Worker `garrisonhutcherson` |
| Verify command | `pnpm verify` ← must pass before you say "done" |

All other commands are in `docs/project/stack.md` (Commands).

## 2. Non-negotiables

These apply to every change, in every stack. Rule IDs point to the full text.

1. **No secrets in code, logs, URLs, or client bundles.** Hosted secrets live in
   a secrets manager. Public client variables are never secrets. (SEC-03)
2. **Never trust the client.** Every read and write is authorized on the server
   for the specific object. Database-level policies, if the stack has them, are
   default-deny too; privileged credentials bypass them, so server code must
   still authorize. (SEC-01, SEC-AZ-01, SEC-AZ-02)
3. **Validate every input at the trust boundary** with a schema. Client-side
   validation is UX only. (SEC-02)
4. **No direct commits to `staging` or `production`.** Promote by pull request
   only. Never deploy or modify hosted data unless the human asks in this
   session. (GIT-01, ENV-04)
5. **Every exported symbol has a doc comment** that a new reader can act on.
   (DOC-01)
6. **Google style for each language;** the formatter and linter are the source
   of truth. (STY-01)
7. **Behavior changes ship with tests,** and access-policy changes ship with
   allowed *and* denied tests. (TEST-01, TEST-04)
8. **New dependencies need a reason; new stack components need the user's
   decision.** (DEP-01, SEL-10)
9. **Keep docs in sync in the same change:** codemap, stack, ADRs, security
   decisions. (DOC-06)
10. **If a rule blocks the task, stop and ask.** Approved deviations go in
    `docs/project/overrides.md` with a reason and an expiry date.

## 3. How to load context (read this before opening other docs)

- Read **only** the docs the routing table names for your task. Do not read all
  of `docs/`.
- For any coding task, first read `docs/project/status.md`,
  `docs/project/stack.md`, and `docs/project/codemap.md` (all short) instead of
  crawling the repo.
- Universal standards say *what* must be true. The stack profile listed in
  `stack.md` says *how* in this stack. When a row below says "+ profile", also
  open the matching file in that profile.
- Every doc opens with a **Rules** section. Read it; go further only if needed.
- Cite rule IDs in plans, commits, and reviews (e.g. "per SEC-AZ-02").
- Paths are written in code spans on purpose: they are references, not
  imports, so no tool loads them until you open them.

## 4. Routing table

| If the task involves… | Read |
| --- | --- |
| Choosing or changing any part of the stack | `docs/standards/stack-selection.md` |
| Any code change | `docs/standards/code-style/README.md` + the file for your language |
| New feature, module, or refactor | `docs/standards/architecture.md`, `docs/standards/design-patterns.md` + profile |
| Writing doc comments, READMEs, ADRs | `docs/standards/documentation.md` |
| Sign-in, sessions, tokens, MFA | `docs/standards/security/README.md`, `docs/standards/security/auth-sessions.md` + profile |
| Who can read/write what; database access policies | `docs/standards/security/access-control.md`, `docs/standards/data.md` + profile |
| Forms, inputs, uploads, rendering user content | `docs/standards/security/input-output.md` |
| HTTP headers, cookies, CSP, CORS, endpoints | `docs/standards/security/web-and-api.md`, `docs/standards/api-design.md` + profile |
| Secrets, env vars, config, crypto, TLS | `docs/standards/security/crypto-secrets-config.md`, `docs/standards/environments.md` + profile |
| Personal data, analytics, retention, deletion | `docs/standards/security/data-protection.md` |
| Hosting platform settings, IAM, cost controls | The profile's hardening checklist |
| Database schema, queries, migrations | `docs/standards/data.md` + profile |
| Screens, components, accessibility, performance | `docs/standards/frontend.md` + profile |
| Errors, logging, monitoring, alerts | `docs/standards/observability.md` |
| Tests | `docs/standards/testing.md` + profile |
| Adding or upgrading dependencies | `docs/standards/dependencies.md` |
| Branches, commits, pull requests | `docs/standards/git-workflow.md` |
| Deploying, promoting, rolling back | `docs/standards/environments.md`, `docs/standards/ci-cd.md`, `docs/checklists/release.md` + profile |
| Starting a new project | `docs/checklists/new-project-setup.md` |
| Finishing any task | `docs/checklists/definition-of-done.md` |
| Reviewing a change | `docs/checklists/pr-review.md` (+ `docs/checklists/security-review.md` if it touches auth, data access, input, or config) |

## 5. Session protocol

1. **Orient.** Check the stack gate (§0). Read `status.md`, `stack.md`, and
   `codemap.md`. Restate the task in one or two sentences. Pick docs from the
   routing table.
2. **Plan.** For anything beyond a small fix: list files to touch, the pattern
   you will use and why, the rule IDs that apply, and the tests you will add.
   Ask when requirements are ambiguous or a new stack component would be needed.
3. **Implement** in small, reviewable steps that keep `verify` green.
4. **Verify.** Run the verify command. For security-relevant work, walk
   `docs/checklists/security-review.md`.
5. **Sync docs.** Update `codemap.md` (structure), `stack.md` (stack), an ADR
   (decision), `security-decisions.md` (security values), `status.md` (handoff).
6. **Report.** What changed, how it was verified, what is left, and any
   deviation from these standards.

## 6. Precedence

Human instruction in this session › `docs/project/overrides.md` ›
`docs/project/*` › stack profile › `docs/standards/*` › tool defaults.
A profile may add to or tighten a standard, never weaken it. If a human
instruction conflicts with a non-negotiable, say so before acting and suggest
recording an override.
