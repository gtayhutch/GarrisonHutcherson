---
id: standards/stack-selection
version: 2.0.0
load_when: docs/project/stack.md is not `decided`; a task needs a language, framework, database, service, or tool that stack.md doesn't list; or the user wants to change part of the stack.
---

# Stack selection

These standards don't prescribe a technology stack. Each project's stack is
chosen **by the user**, through a short interview the agent runs before any
code is written. The result is recorded in `docs/project/stack.md`, and the
matching stack profile in `docs/stacks/` supplies the stack-specific details.

## Rules

- **SEL-01 Stack gate.** Until `docs/project/stack.md` says
  `Status: decided`, agents MUST NOT scaffold the app, install dependencies, or
  write application code. Documentation work is allowed.
- **SEL-02 Never assume.** Agents MUST NOT pick a language, framework,
  database, identity provider, hosting platform, or other stack component on
  their own, including "obvious" defaults or the user's usual stack. Agents
  propose; the user decides.
- **SEL-03 Requirements before technology.** The first rounds ask about the
  product and its constraints. Technology questions come only after those
  answers are in.
- **SEL-04 Options with trade-offs.** Each technology question offers 2–4
  realistic options that fit the stated requirements, each with a one-line
  trade-off. At most one option is marked *Recommended*, with the reason. A
  free-form answer is always possible. If the user has a usual stack (from an
  earlier project or something they've said before), include it as an option
  and label it as theirs, but don't pre-select it.
- **SEL-05 Small rounds.** At most 4 questions per round and one decision
  category per question. Skip categories the requirements make irrelevant and
  record them as "not needed".
- **SEL-06 Fitness check.** Before confirming, check that the proposed stack can
  meet the universal standards, and tell the user about any gap:

  | Standard | The stack must provide |
  | --- | --- |
  | ENV-02 | A local `test` environment that cannot reach hosted data (emulators, local containers, or isolated credentials) |
  | ENV-11 | Separate, isolated `staging` and `production` environments |
  | SEC-01 | Server-side authorization on every request |
  | SEC-03 | A secrets manager for hosted environments |
  | SEC-05 | HTTPS with managed certificates |
  | SEC level | An identity provider and platform able to meet the project's ASVS level (MFA, session revocation, audit logs) |
  | DB-15 | Backups and point-in-time or snapshot recovery |
  | OBS-06, OBS-09 | Structured logs to an access-controlled destination |
  | STY-02 | A Google or official style guide for every language |
  | CI-05 | Keyless (OIDC-based) deploys from CI, or a recorded alternative |

  A gap is resolved by choosing differently or by recording an override in
  `docs/project/overrides.md`.
- **SEL-07 Confirm the whole stack.** Show the full decision table and get an
  explicit "yes" before recording anything.
- **SEL-08 Record it.** Fill in `docs/project/stack.md` and set
  `Status: decided`, write ADR `0002-stack-selection.md` (with the alternatives
  considered), replace the stack placeholders in `AGENTS.md`, and set the ASVS
  level.
- **SEL-09 Use or create a profile.** If a profile in `docs/stacks/` matches,
  adopt it and copy its agent rules into `.claude/rules/` and `.agents/rules/`.
  If one partly matches, adopt it and record the differences in `stack.md`. If
  none matches, create one from `docs/stacks/_profile-template/` before writing
  application code, and flag it for adding to the template repository.
- **SEL-10 Later stack changes get the same treatment.** A task that adds or
  replaces a *stack component* (a new language, framework, database, hosted
  service, queue, search engine, client platform, or third-party provider)
  triggers a short interview under these rules, plus an ADR. A *library* used
  inside an existing component follows DEP-01 instead (justify it in the PR).
- **SEL-11 Latest stable.** Chosen components use their latest stable release
  at decision time; the version policy is recorded in `stack.md` (DEP-02).
- **SEL-12 Raise problems; don't work around them.** If a chosen component
  turns out unable to meet a requirement, stop and raise it with the user
  instead of quietly substituting something else.

## Interview script

Use the tool's multiple-choice question interface when there is one (in Claude
Code, `AskUserQuestion`: up to 4 questions per call, 2–4 options each). Ask in
plain, numbered text otherwise. Round 1 is usually free text.

### Round 1 — The product (always)

1. What are you building, and who is it for? (one or two sentences)
2. Which platforms: web, iOS, Android, desktop, wearables, API only? (multi-select)
3. What data will it hold?
   - Public content only → ASVS L1
   - Accounts and personal data → ASVS L2 *(most apps)*
   - Payments, health, children's or regulated data → ASVS L3
4. Special needs: realtime collaboration, offline use, file or media
   uploads, search, AI features, background jobs, payments? (multi-select)

### Round 2 — Constraints and preferences

5. Expected scale in the first year: prototype, under 1k users, under 100k, more?
6. Languages or frameworks you want to use, or avoid?
7. Hosting preference: managed backend platform, serverless cloud, containers,
   self-hosted, or no preference? Any provider, budget, region, or
   data-residency constraint?
8. Who will build and operate it: solo, small team, larger team?

### Round 3 — Technology choices

Ask only the categories that apply, in this order (later choices depend on
earlier ones). For each, offer options per SEL-04.

| # | Category | Options to weigh (alphabetical examples, not defaults) |
| --- | --- | --- |
| 1 | Languages | TypeScript, Python, Kotlin, Swift, Go, Rust, … |
| 2 | Web frontend | Astro, Next.js, Nuxt, React Router, SvelteKit, server-rendered templates |
| 3 | Mobile / desktop clients | Flutter, Kotlin Multiplatform, native (Swift, Kotlin), React Native |
| 4 | Backend and API style | Framework server actions or routes, separate API service, serverless functions, BaaS only |
| 5 | Database | Firestore, MongoDB, MySQL, PostgreSQL, SQLite/edge, … |
| 6 | Authentication | Auth0, Clerk, Cognito, Firebase Auth, Supabase Auth, self-hosted |
| 7 | File storage | Cloud Storage, S3-compatible, provider storage |
| 8 | Hosting for staging and production | AWS, Azure, Cloud Run, Firebase App Hosting, Fly.io, Vercel, self-hosted |
| 9 | Local `test` environment | Platform emulators, Docker Compose, local services |
| 10 | Background jobs / scheduling | Platform functions, queues, cron service |
| 11 | Styling / UI kit | Component library, CSS Modules, platform-native UI, Tailwind CSS |
| 12 | Observability | Platform logging, error tracker, APM |
| 13 | Package manager / task runner | npm, pnpm, uv, Gradle, Cargo, make/just |
| 14 | Testing tools | Per language: unit, integration, end-to-end |
| 15 | CI/CD | GitHub Actions, other |

### How to weigh options

Explain options against these criteria, in the user's terms:

| Criterion | Ask yourself |
| --- | --- |
| Fit | Does it handle the requirements from rounds 1–2 without workarounds? |
| Familiarity | Has the user built with it before, or asked for it? |
| Maturity | Stable, maintained, long-term support, good documentation? |
| Security | Can it meet the ASVS level (SEL-06) with built-in features? |
| Local testing | Can the `test` environment run fully offline from hosted data? |
| Cost | Free tier, pricing at the expected scale, cost-abuse protection? |
| Operations | How much does someone have to run, patch, and monitor? |
| Portability | How hard is it to leave? Is lock-in worth what it buys? |

### Round 4 — Confirm and record

Show the full decision table, the fitness-check results (SEL-06), and the
profile that will be used or created. After an explicit "yes", do SEL-08 and
SEL-09, then continue with `docs/checklists/new-project-setup.md`.
