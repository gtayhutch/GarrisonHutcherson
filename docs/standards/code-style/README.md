---
id: standards/code-style
version: 2.0.0
load_when: Any code change. Read this file, then only the file for the language you are editing. Also when the stack interview adds a language.
---

# Code style

We follow the [Google Style Guides](https://github.com/google/styleguide) for
every language they cover. Each language file below lists the rules with the
most impact plus our project-level decisions. For anything not listed, the full
Google guide decides.

## Rules

- **STY-01 Tools are the source of truth.** The formatter and linter for each
  language run in CI and fail the build on violations. Never hand-format; never
  argue style in review if a tool can decide it.
- **STY-02 Google first, then the language's official guide.** If Google has no
  guide for a language, use the language's official style guide. A language
  without a file below gets one (same shape: Rules, example, tooling) before
  its first line of code is written; the stack interview flags this.
- **STY-03 Consistency.** Within a file, match the existing style. When
  reformatting is needed, do it in a separate commit.
- **STY-04 Names.** Descriptive, no ambiguous abbreviations, no Hungarian
  notation. Treat acronyms as words where the language allows (`loadHttpUrl`,
  `userId`; Go is the exception and keeps initialisms upper-case).
- **STY-05 Small units.** A function does one thing. See ARCH-10 for size
  limits. Prefer early returns over nested conditionals. No boolean "mode"
  parameters; split the function or use an options object.
- **STY-06 No magic values.** Numbers and strings with meaning become named
  constants with units in the name.
- **STY-07 Immutable by default.** `const`, `readonly`, `val`, `let` (Swift),
  frozen data. Mutate only local variables you own.
- **STY-08 No dead code.** Remove unused code, imports, flags, and
  commented-out blocks.
- **STY-09 Suppressions are explained.** A lint or type suppression is scoped to
  one line and carries a comment saying why.
- **STY-10 Files.** UTF-8, LF line endings, final newline, no trailing
  whitespace. Enforced by `.editorconfig`.

## Language router

Load **one** of these, for the language you are editing. The languages in use
are listed in `docs/project/stack.md`; files for other languages are ignored.

| Language | File | Google guide |
| --- | --- | --- |
| TypeScript / JavaScript / React | `typescript.md` | [TypeScript](https://google.github.io/styleguide/tsguide.html), [JavaScript](https://google.github.io/styleguide/jsguide.html) |
| Python | `python.md` | [Python](https://google.github.io/styleguide/pyguide.html) |
| Kotlin (Android, Multiplatform) | `kotlin.md` | [Android Kotlin](https://developer.android.com/kotlin/style-guide) |
| Swift | `swift.md` | [Swift](https://google.github.io/swift/) |
| Go | `go.md` | [Go](https://google.github.io/styleguide/go/) |
| Rust | `rust.md` | [Rust](https://github.com/google/styleguide/blob/gh-pages/rustguide.md) |
| Shell (Bash) | `shell.md` | [Shell](https://google.github.io/styleguide/shellguide.html) |
| HTML / CSS (incl. utility CSS) | `html-css.md` | [HTML/CSS](https://google.github.io/styleguide/htmlcssguide.html) |
| JSON, YAML, Markdown | `data-formats.md` | [JSON](https://github.com/google/styleguide/blob/gh-pages/jsoncguide.md), [Markdown](https://github.com/google/styleguide/blob/gh-pages/docguide/style.md) |

Other Google guides (C++, C#, Java, Objective-C, Dart, R, and more) are linked
from the [repository README](https://github.com/google/styleguide). Add a
language file here before a project starts using one of them.

## Tooling

| Language | Formatter | Linter / analyzer | Notes |
| --- | --- | --- | --- |
| TypeScript | Prettier (Google settings via `gts`) | ESLint (typescript-eslint strict + the framework's plugin), `tsc --noEmit` | `gts` is Google's TS style tooling; extend its config |
| Python | Pyink or Black | Pylint with Google's `pylintrc`; a type checker (pytype or mypy) | Google allows Black or Pyink |
| Kotlin | ktlint (`android_studio` style) or ktfmt | detekt | Pick one formatter per repo |
| Swift | swift-format | swift-format lint (optional SwiftLint) | |
| Go | gofmt / goimports | go vet, staticcheck | |
| Rust | rustfmt | clippy (deny warnings in CI) | |
| Shell | shfmt (`-i 2 -ci`) | ShellCheck | Google requires ShellCheck |
| HTML/CSS | Prettier (+ a class-sorting plugin if the stack uses utility CSS) | Stylelint | |
| JSON/YAML/Markdown | Prettier | markdownlint | |

Every repo includes `.editorconfig`, the formatter config, and the linter
config for each language it uses. CI runs the format-check and lint tasks (see
`docs/standards/ci-cd.md`).
