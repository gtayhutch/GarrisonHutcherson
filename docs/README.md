# Documentation map

This folder holds three kinds of documentation. Knowing which is which is the
key to keeping projects consistent, stack-independent, *and* cheap for AI
agents to load.

| Folder | What it is | Edited per project? |
| --- | --- | --- |
| `docs/standards/` | Universal engineering standards: *what* must be true, in any stack. | **No.** Change them in the template repo, then sync. |
| `docs/checklists/` | Universal checklists that apply the standards. | No. |
| `docs/stacks/<profile>/` | Stack profiles: *how* to meet the standards with one specific stack. A project uses only the profile(s) it chose. | No. Improve them in the template repo. |
| `docs/project/` | Facts and decisions about *this* project, including its chosen stack. | **Yes.** Fill in on day one; keep current. |

Deviations are never made by editing a standard or a profile. They are
recorded in `docs/project/overrides.md` with a reason and an expiry date.

## How a project gets its stack

The standards don't choose a technology. At the start of a project the agent
runs a short interview with the user (`docs/standards/stack-selection.md`):
product and constraints first, then 2–4 options per technology category with
trade-offs. The user decides; the agent records the result in
`docs/project/stack.md` and adopts the matching profile from `docs/stacks/`, or
creates a new profile from `docs/stacks/_profile-template/` when none fits.

## Design principles

1. **Progressive disclosure.** `AGENTS.md` is the only always-loaded file. It
   holds the stack gate, the non-negotiables, and a routing table. Agents open
   other docs only when the task needs them.
2. **References, not imports.** Paths are written in code spans. Claude Code
   eagerly loads `@path` imports, so the only import in the system is
   `@AGENTS.md` inside `CLAUDE.md`.
3. **What vs. how.** Standards state requirements in stack-neutral terms.
   Profiles implement them for one stack and may add or tighten rules, never
   weaken them.
4. **Rules first.** Every standards and profile doc starts with a numbered
   **Rules** section. Detail, examples, and rationale come after.
5. **Stable rule IDs.** Each rule has an ID (`SEC-AZ-02`, `TS-07`, `NXF-04`)
   that plans, commits, and reviews can cite. IDs are never reused; a removed
   rule stays listed as *Retired* with a pointer to its replacement.
6. **Tools enforce, docs explain.** Anything a formatter, linter, type checker,
   or test can enforce is enforced there. Docs cover what tools can't check.
7. **Size budgets.** `AGENTS.md` ≤ 150 lines. Each standards or profile doc
   ≤ 250 lines. Split a doc before it exceeds the budget.
8. **Path-scoped pointers.** `.claude/rules/` (Claude Code) and
   `.agents/rules/` (Antigravity) contain short rules that load automatically
   when matching files are touched. Universal ones ship with the template;
   stack-specific ones come from the profile.

## Conventions used in every doc

- **MUST / MUST NOT / SHOULD / MAY** follow RFC 2119 meanings.
- Each doc begins with frontmatter: `id`, `version`, and `load_when` (the
  situations in which an agent should read it).
- Product names in standards are **examples**, never defaults.
- ASVS references use the short form `[ASVS 8.2.2]`, which means
  `v5.0.0-8.2.2`. Level tags (`L1`, `L2`, `L3`) say when a requirement becomes
  mandatory.

## File index

```text
AGENTS.md                      Always loaded: stack gate, project card, non-negotiables, routing
CLAUDE.md                      Imports AGENTS.md + Claude Code specifics
docs/
  standards/                   Universal, stack-neutral
    stack-selection.md         The stack interview, fitness check, recording rules
    architecture.md            Layers, boundaries, feature slices, request pipeline
    design-patterns.md         GoF patterns: selection guide, functional forms, anti-patterns
    documentation.md           Doc comments, file headers, READMEs, ADRs, doc sync
    code-style/                Google style per language (load one file)
      README.md                Universal rules + tooling table
      typescript.md  python.md  kotlin.md  swift.md  go.md  rust.md
      shell.md  html-css.md  data-formats.md (JSON, YAML, Markdown)
    security/                  OWASP ASVS 5.0, grouped by concern
      README.md                Baseline, levels, chapter router, non-negotiables
      input-output.md          V1, V2, V5
      web-and-api.md           V3, V4
      auth-sessions.md         V6, V7, V9, V10
      access-control.md        V8
      crypto-secrets-config.md V11, V12, V13
      data-protection.md       V14 + privacy
    environments.md            test / staging / production, isolation, config layering
    git-workflow.md            Branches, commits, pull requests, promotion, hotfixes
    ci-cd.md                   Verify contract, required checks, deploys, rollback
    testing.md                 Test pyramid, policy tests, coverage
    observability.md           Errors, logging (V16), monitoring, alerts
    api-design.md              Entry points, contracts, errors, pagination, idempotency
    data.md                    Data modeling, migrations, transactions, backups
    frontend.md                UI structure, accessibility, performance
    dependencies.md            Versions, lockfiles, SBOM, update timelines (V15)
  stacks/                      Stack profiles (a project uses only its own)
    README.md                  Profile catalog and the profile contract
    _profile-template/         Skeleton for a new profile
    nextjs-firebase/           Next.js App Router + TypeScript + Firebase
  checklists/
    definition-of-done.md  pr-review.md  security-review.md
    release.md  new-project-setup.md
  project/                     Fill in per project
    stack.md  overview.md  codemap.md  data-model.md  security-decisions.md
    overrides.md  glossary.md  status.md
    decisions/README.md  decisions/0000-adr-template.md
.claude/rules/  .agents/rules/ Path-scoped pointers (universal + copied from the profile)
.github/pull_request_template.md
```

## Adopting the template in a new project

Follow `docs/checklists/new-project-setup.md`. It starts with the stack
interview, then the chosen profile's setup steps, then the universal
scaffolding (environments, branches, docs, branch protection).

## Updating the standards across projects

1. Change the standard or profile in the template repository and bump the
   version below.
2. In each project, copy `docs/standards/`, `docs/checklists/`, the profiles it
   uses from `docs/stacks/`, and the universal rules in `.claude/rules/` and
   `.agents/rules/` (plus the profile's agent rules). Never copy
   `docs/project/`.
3. Open a PR titled `chore(standards): sync to vX.Y.Z` and fix any new
   violations or record overrides.

## Sources and licenses

- OWASP Application Security Verification Standard 5.0.0 — CC BY-SA 4.0. The
  security docs paraphrase and map its requirements; consult the original for
  exact wording.
- Google Style Guides (github.com/google/styleguide) — CC BY 3.0. The
  code-style docs summarize them and link to the full guides.
- Gamma, Helm, Johnson, Vlissides, *Design Patterns: Elements of Reusable
  Object-Oriented Software* (1994). Pattern summaries are written in our own
  words.

## Changelog

| Version | Date | Change |
| --- | --- | --- |
| 2.0.0 | 2026-11-12 | Stack-agnostic. Added the stack interview (`stack-selection.md`) and `docs/project/stack.md`. Universal standards rewritten in stack-neutral terms. All Next.js/Firebase guidance moved to the `nextjs-firebase` profile (including `firebase-hardening.md` and Firestore rules from `data-firestore.md`, which became `data.md`). `test:rules` renamed to the access-policy test task. TS-25..TS-27 retired into the profile. |
| 1.0.0 | 2026-11-09 | Initial release. |
