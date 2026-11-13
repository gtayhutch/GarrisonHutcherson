---
id: standards/code-style/swift
version: 2.0.0
load_when: Editing .swift files (iOS, watchOS, macOS).
---

# Swift

Source: [Google Swift Style Guide](https://google.github.io/swift/). Rules
marked *(house)* are ours.

## Rules

### Files and formatting

- **SW-01 Format and lint** with `swift-format`. CI fails on violations.
- **SW-02 Layout.** 2-space indentation, 100-column limit, UTF-8.
- **SW-03 File names.** A file holding one type is named after it
  (`MyType.swift`). A file that extends a type with a protocol conformance is
  `MyType+Protocol.swift`.
- **SW-04 Imports.** Import whole modules, one per line, sorted.

### Naming

- **SW-05 Casing.** `UpperCamelCase` for types and protocols;
  `lowerCamelCase` for everything else, **including constants** (no `k`
  prefix, no `SCREAMING_CASE`).
- **SW-06 API naming** follows the Swift API Design Guidelines: clarity at the
  point of use, argument labels that read as phrases, no redundant type names.

### Language

- **SW-07 Immutability.** `let` over `var`; value types (`struct`, `enum`)
  over classes unless identity or reference semantics are needed.
- **SW-08 No force operations.** No `!` force unwrap, `try!`, or `as!` outside
  tests, unless an invariant guarantees success; comment the invariant.
- **SW-09 Early exits** with `guard`.
- **SW-10 Access control.** Default to the narrowest level (`private`,
  `fileprivate`); mark only intended API as `public`.
- **SW-11 Exhaustive enums.** Model states as enums with associated values;
  avoid `default:` in `switch` over your own enums so the compiler catches new
  cases. *(house)*
- **SW-12 Concurrency.** Use Swift concurrency (`async`/`await`, actors);
  mark UI-bound code `@MainActor`. *(house)*

### Docs

- **SW-13 Doc comments** use `///` with a one-line summary, then
  `- Parameter`, `- Returns`, `- Throws` when they add information (DOC-01).

## Example

```swift
/// The longest time a cached profile is considered fresh.
let profileCacheLifetime: Duration = .seconds(300)

/// Returns `true` when the cached profile is still fresh at `now`.
///
/// - Parameters:
///   - fetchedAt: When the profile was fetched.
///   - now: The current time; injected for testability.
func isFresh(fetchedAt: ContinuousClock.Instant, now: ContinuousClock.Instant) -> Bool {
  now - fetchedAt < profileCacheLifetime
}
```
