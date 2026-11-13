---
id: standards/documentation
version: 2.0.0
load_when: Writing or reviewing doc comments, file headers, READMEs, ADRs, or any Markdown in docs/; finishing a change that altered structure or behavior.
---

# Documentation

Goal: a new human or agent can understand any function, class, or module
without reading its implementation or asking the author.

## Rules

- **DOC-01 Every exported symbol is documented.** Functions, classes,
  interfaces, types, constants, UI components, request handlers, RPC methods,
  and background jobs have a doc comment (`/** */`, `"""`, `///`, KDoc,
  `//` Go doc comments). Non-exported symbols are documented when their
  purpose is not obvious from the name.
- **DOC-02 What a doc comment contains.** In this order, omitting what is truly
  obvious from the name and signature:
  1. Summary: one sentence, third person, starting with a verb ("Returns…",
     "Creates…"). This is what tooling shows on hover.
  2. Behavior: what it does, not how; important edge cases.
  3. Parameters and return value, when not obvious.
  4. Errors: what it throws or returns on failure, and when.
  5. Side effects: writes, network calls, emitted events.
  6. Security: required authentication or authorization, or "public".
  7. Pattern, if one is applied (PAT-05).
  8. Example for non-trivial public APIs.
- **DOC-03 File overview.** Every non-trivial module starts with a
  module header in the language's form (`@fileoverview`, a module docstring,
  `//!`, a Go package comment): its responsibility and its key collaborators.
- **DOC-04 Don't repeat the type system.** In typed languages, types go in
  signatures, never in doc tags (in TypeScript, `@param {string}` is wrong).
- **DOC-05 Comments explain why.** Implementation comments explain intent,
  constraints, and non-obvious decisions. Never commented-out code.
  `TODO` comments use `TODO(#<issue>): explanation` and require an issue.
- **DOC-06 Docs change with code.** In the same commit:
  - public API changed → update its doc comment;
  - files or folders added, moved, or removed → update `docs/project/codemap.md`;
  - a stack component added, replaced, or upgraded across a major version →
    update `docs/project/stack.md` (SEL-10);
  - a decision with alternatives made → add an ADR;
  - a security value changed (timeouts, limits, roles) →
    update `docs/project/security-decisions.md`;
  - session ends with unfinished work → update `docs/project/status.md`.
- **DOC-07 Names are documentation.** Descriptive names, no ambiguous
  abbreviations, units in names (`timeoutMs`, `priceCents`), booleans read as
  questions (`isActive`, `hasAccess`).
- **DOC-08 Markdown follows the Google Markdown style.** One H1, ATX headings,
  fenced code blocks with a language, descriptive link text, tables only for
  tabular data. See `code-style/data-formats.md`.
- **DOC-09 Standards docs keep their shape.** Frontmatter (`id`, `version`,
  `load_when`), then **Rules**, then detail. ≤ 250 lines each.

## Examples

Examples in the languages these standards cover; use whichever matches your
stack.

### TypeScript (TSDoc/JSDoc)

```ts
/**
 * @fileoverview Entry points for managing invitations to a workspace.
 * Collaborators: `./repository.ts`, `../../shared/server/authz.ts`.
 */

/**
 * Sends an invitation email and records a pending invitation.
 *
 * Re-sending to an address with a pending invitation refreshes its expiry
 * instead of creating a duplicate.
 *
 * Errors: returns `{ok: false, code: 'FORBIDDEN'}` if the caller is not a
 * workspace admin; `'RATE_LIMITED'` after 20 invitations per hour.
 * Side effects: stores a pending invitation record; sends email.
 * Security: requires an authenticated workspace admin (SEC-AZ-02).
 *
 * @param input Untrusted form data; validated with `inviteSchema`.
 * @return The invitation ID, or a typed error result.
 */
export async function inviteMember(input: unknown): Promise<ActionResult<{id: string}>> {
```

### Python (Google docstring)

```python
def prorate(amount_cents: int, days_used: int, days_in_period: int) -> int:
    """Returns the prorated charge for a partial billing period.

    Rounds half up to the nearest cent.

    Args:
        amount_cents: Full-period price in cents. Must be non-negative.
        days_used: Days of service in the period.
        days_in_period: Total days in the period. Must be positive.

    Returns:
        The prorated amount in cents.

    Raises:
        ValueError: If `days_in_period` is not positive.
    """
```

### Kotlin (KDoc) and Swift

```kotlin
/**
 * Returns the next status for [task] after [event], or null if the
 * transition is not allowed. State pattern: see `TaskTransitions`.
 */
fun nextStatus(task: Task, event: TaskEvent): TaskStatus?
```

```swift
/// Returns the user's display name, falling back to the email's local part.
///
/// - Parameter user: The signed-in user.
/// - Returns: A non-empty display name.
func displayName(for user: User) -> String
```

## Project documents

| Document | Purpose | Update when |
| --- | --- | --- |
| `README.md` | Human entry point: what, quick start, links | Setup or scope changes |
| `docs/project/overview.md` | Scope, users, stack versions, non-goals | Scope changes |
| `docs/project/stack.md` | Chosen stack, commands, environment mapping | Stack changes (SEL-10) |
| `docs/project/codemap.md` | Where everything lives, one line per module | Structure changes |
| `docs/project/data-model.md` | Tables or collections, fields, classification, owners | Schema changes |
| `docs/project/security-decisions.md` | ASVS documentation requirements | Security values change |
| `docs/project/decisions/NNNN-*.md` | Architecture Decision Records | A decision is made |
| `docs/project/status.md` | Current focus and handoff notes (≤ 40 lines) | End of each session |

ADRs are immutable once accepted. To change a decision, write a new ADR that
supersedes the old one and link both ways.
