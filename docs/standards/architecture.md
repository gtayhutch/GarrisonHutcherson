---
id: standards/architecture
version: 2.0.0
load_when: Creating a feature, module, service, or background job; moving code; deciding where something belongs; refactoring.
---

# Architecture

Stack-neutral. The stack profile maps each concept here to concrete folders
and files, and `docs/project/stack.md` records the mapping for this project.

## Rules

- **ARCH-01 Layers and direction.** Code is organized in four layers.
  Dependencies point inward only: `ui → application → domain`, and
  `infrastructure` implements interfaces the inner layers define. The domain
  layer MUST NOT import UI frameworks, web frameworks, database SDKs, or any
  I/O library.
- **ARCH-02 Vertical slices.** Each feature is a module (folder, package, or
  crate) with one public interface. Other code MUST use a feature only through
  that interface, never its internals.
- **ARCH-03 Server/client boundary.** Code that holds secrets, uses privileged
  credentials, or reads data the client may not see MUST be impossible to
  include in a client bundle or app binary. Use the stack's enforcement
  mechanism (named in the profile) so a violation fails the build.
- **ARCH-04 One pipeline for every entry point.** Every UI mutation handler,
  HTTP route, RPC method, event handler, and job runs the same steps in this
  order: **parse → authenticate → authorize → execute → map result**. No step
  may be skipped or reordered. See the pipeline section below.
- **ARCH-05 Functional core, imperative shell.** Business rules are pure
  functions in the domain layer: same input, same output, no I/O, no clock or
  random calls (pass them in). I/O happens at the edges (entry points,
  repositories).
- **ARCH-06 Repositories own data access.** Only repository modules (and
  background jobs through them) talk to the database or file storage. They
  return domain types, never raw driver objects.
- **ARCH-07 Typed, validated configuration.** Configuration is read once in a
  single config module, validated with a schema at startup, and exposed as a
  typed object. Code MUST NOT read environment variables anywhere else.
- **ARCH-08 No cycles.** Circular imports between modules are a build error
  (enforced by lint).
- **ARCH-09 Idempotent background work.** Event handlers, queue consumers, and
  scheduled jobs can run more than once for the same event. They MUST be
  idempotent (for example, keyed by event ID or guarded by a transaction).
- **ARCH-10 Size limits (SHOULD).** Functions ≤ 40 lines, files ≤ 300 lines,
  ≤ 4 positional parameters (use an options object beyond that). Exceeding a
  limit needs a reason in the code review.
- **ARCH-11 Decisions are recorded.** Any change to layers, folder layout,
  data ownership, or a cross-cutting library gets an ADR in
  `docs/project/decisions/`.

## Feature slice (conceptual)

```text
<feature>/
  public interface      # index / mod / __init__ / package API (facade)
  ui/                   # screens and components, if the stack has a UI
  entry points          # UI mutation handlers, routes, RPC methods
  service               # application logic: orchestrates domain + repository
  domain                # pure types and business rules
  schema                # input contracts, shared by client and server where possible
  repository            # data access (server-only)
  tests                 # next to the code they test
shared/
  config                # validated configuration (ARCH-07)
  errors                # error types and result type (observability.md)
  logger                # structured logger
  server/               # server-only: auth/session, authorization helpers
jobs/                   # event handlers, queue consumers, scheduled jobs
```

Names and file extensions follow the language's style guide and the stack
profile. Multi-platform clients share the `domain` and data layers and keep
each platform's UI thin.

## The request pipeline (ARCH-04)

```text
handle(rawInput, request):
  input   = Schema.parse(rawInput)                 # 1. parse → typed value or validation error
  user    = requireUser(request)                   # 2. authenticate on the server
  target  = repository.get(input.targetId)
  authorize(user, "edit", target)                  # 3. authorize this specific object
  updated = domain.applyChange(target, input)      # 4. execute: pure rule, then persist
  repository.save(updated)
  return ok(toResponse(updated))                   # 5. map result: only permitted fields
```

- *Parse* turns untrusted input into a typed value or a validation error.
- *Authenticate* verifies the session or token on the server; never trust a
  client-supplied identity.
- *Authorize* checks the specific resource, not just "is signed in".
- *Execute* calls pure domain functions, then the repository.
- *Map result* returns a typed result and never leaks internal errors.

The stack profile shows this pipeline in the stack's own syntax.

## Where does this code go?

| It… | Put it in |
| --- | --- |
| Decides a business rule | The feature's `domain` |
| Coordinates several steps or features | The feature's `service` |
| Receives a request from a client | The feature's entry points |
| Reads or writes the database or file storage | The feature's `repository` |
| Runs on an event, queue, or schedule | `jobs/` (calling the feature's service) |
| Is a reusable visual component | Shared UI components |
| Is used by every feature (logging, config) | `shared/` |

## Enforcement

Encode ARCH-01 to ARCH-03 and ARCH-08 as lint rules in each language (for
example `eslint-plugin-boundaries` or `import/no-restricted-paths` for
TypeScript, `import-linter` for Python, Konsist or ArchUnit for Kotlin and
Java). The profile names the tools and the server-only mechanism.
