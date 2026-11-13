---
id: standards/code-style/kotlin
version: 2.0.0
load_when: Editing .kt or .kts files (Android, Kotlin Multiplatform, Gradle scripts).
---

# Kotlin

Source: [Android Kotlin Style Guide](https://developer.android.com/kotlin/style-guide)
(the guide Google's style-guide index points to for Kotlin). Rules marked
*(house)* are ours.

## Rules

### Files and formatting

- **KT-01 Format and lint.** ktlint with the `android_studio` code style (or
  ktfmt — one per repo), plus detekt. CI fails on violations.
- **KT-02 Layout.** 4-space indentation, 100-column limit, UTF-8. No wildcard
  imports.
- **KT-03 File names.** A file with one top-level class is named after it
  (`UserRepository.kt`). Otherwise use a descriptive `PascalCase` name.
  Multiplatform source sets use the platform suffix (`Clock.android.kt`,
  `Clock.ios.kt`). *(house for the suffix)*
- **KT-04 Braces.** Required for `if`, `for`, `when` branches, `do`, and
  `while` bodies, except a one-line `if`/`else` expression or `when` branch.

### Naming

- **KT-05 Casing.**

  | Style | Use for |
  | --- | --- |
  | `lowercase` (no underscores) | packages |
  | `PascalCase` | classes, objects, interfaces, type aliases, enum classes |
  | `camelCase` | functions, properties, parameters, local variables |
  | `SCREAMING_SNAKE_CASE` | `const val` and top-level/object `val`s holding deeply immutable data |
  | `_camelCase` | backing properties only |

- **KT-06 Acronyms are words:** `HttpClient`, `userId`.
- **KT-07 Test names** may use underscores or backticks for readability.

### Language *(house unless noted)*

- **KT-08 Immutability.** `val` over `var`; read-only collection types in
  public APIs; `data class` for value types.
- **KT-09 Null safety.** No `!!` outside tests unless an invariant guarantees
  non-null; comment the invariant. Prefer `?.`, `?:`, `requireNotNull` with a
  message.
- **KT-10 State.** Model state with `sealed interface`/`sealed class` and
  exhaustive `when` (State pattern, PAT-04).
- **KT-11 Coroutines.** Structured concurrency only: no `GlobalScope`.
  Inject dispatchers; never hard-code `Dispatchers.IO` in business logic.
  Expose streams as `Flow`.
- **KT-12 Shared code stays pure.** In Multiplatform projects, `commonMain`
  holds domain and data layers (ARCH-01); platform code is thin.
- **KT-13 Expression bodies** for single-expression functions.

### Docs

- **KT-14 KDoc** (`/** */`) on every public type and public or protected
  member (DOC-01). Use `[name]` references and block tags (`@param`,
  `@return`, `@throws`) only when they add information.

## Example

```kotlin
/** Maximum number of retries for a failed sync. */
const val MAX_SYNC_RETRIES = 3

/**
 * Returns the delay before retry number [attempt], using exponential backoff.
 *
 * @throws IllegalArgumentException if [attempt] is negative.
 */
fun backoffDelayMs(attempt: Int): Long {
    require(attempt >= 0) { "attempt must be non-negative, was $attempt" }
    return 500L shl attempt.coerceAtMost(MAX_SYNC_RETRIES)
}
```
