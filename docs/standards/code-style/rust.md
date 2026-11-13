---
id: standards/code-style/rust
version: 2.0.0
load_when: Editing .rs files or Cargo manifests.
---

# Rust

Source: [Google Rust Style Guide](https://github.com/google/styleguide/blob/gh-pages/rustguide.md),
which builds on the official Rust Style Guide and Rust API Guidelines. Rules
that Google scopes to specific codebases (Chromium, Android, Fuchsia) are left
out.

## Rules

### Tooling

- **RS-01** `rustfmt` formatting; `cargo clippy` with warnings denied in CI.
  Skip formatting only for generated code or deliberate alignment, never for
  taste.
- **RS-02** Stable Rust only; no unstable features.

### Organization and naming

- **RS-03** Follow standard-library naming. Constructors are `new()` /
  `try_new()`. Getters/setters use `foo`, `foo_mut`, `set_foo`, `take_foo`,
  `with_foo`. Extension traits end in `Ext`. No abbreviations.
- **RS-04 Imports.** No glob imports (except preludes and `use super::*` in
  tests). Call free functions through their module (`fs::read`); import types
  directly.

### Ownership and APIs

- **RS-05** Prefer unique ownership and borrowing over `Rc`/`Arc`. Don't use
  `.clone()` to dodge the borrow checker.
- **RS-06** Accept `&str`, `&[T]`, `&T`, `Option<&T>` rather than `&String`,
  `&Vec<T>`, `&Box<T>`, `&Option<T>`.
- **RS-07** Use `#[must_use]` where ignoring a result is a bug, and
  `#[non_exhaustive]` on public types shared across team boundaries.
- **RS-08** Prefer `#[derive]` and standard traits over custom equivalents.
  Prefer generics over `dyn Trait` in library code.
- **RS-09 Macros last.** Functions, types, and traits first; then
  `macro_rules!`; procedural macros only when nothing else works.

### Errors and safety

- **RS-10** `Option` for simple absence, `Result` for recoverable failures
  with context, `panic!` only for bugs and broken invariants. Prefer
  `expect("why this can't fail")` over `unwrap()`. Don't use `catch_unwind`.
- **RS-11 `unsafe`** only when safe code cannot do the job. Wrap it in a safe
  abstraction and precede each block with a `// SAFETY:` comment justifying it.
- **RS-12** Prefer `match` / `if let` over check-then-`unwrap`.

### Docs

- **RS-13** Document public items with `///` (and modules with `//!`) in
  Markdown. Document panics, errors, and safety invariants. Don't restate the
  name.

## Example

```rust
/// Maximum frames buffered before the encoder applies backpressure.
pub const MAX_BUFFERED_FRAMES: usize = 120;

/// Returns the frame index to drop when the buffer is full, if any.
///
/// Drops the oldest non-key frame so playback stays decodable.
#[must_use]
pub fn frame_to_drop(frames: &[Frame]) -> Option<usize> {
    if frames.len() < MAX_BUFFERED_FRAMES {
        return None;
    }
    frames.iter().position(|frame| !frame.is_key)
}
```
