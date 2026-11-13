---
id: standards/code-style/go
version: 2.0.0
load_when: Editing .go files (services, functions, CLI tools).
---

# Go

Source: [Google Go Style](https://google.github.io/styleguide/go/) — the Guide,
Decisions, and Best Practices documents.

## Rules

### Tooling

- **GO-01** `gofmt` (or `goimports`) formatting is mandatory. `go vet` and
  `staticcheck` run in CI.

### Naming

- **GO-02 MixedCaps.** `MixedCaps` or `mixedCaps`, never underscores (except
  in test function names and generated code).
- **GO-03 Initialisms keep one case:** `URL`, `ID`, `HTTP` → `userID`,
  `ServeHTTP`, `parseURL`. (This differs from TypeScript, STY-04.)
- **GO-04 Packages** are short, lowercase, single words; no `util`, `common`,
  or `helpers`. Don't repeat the package name in identifiers (`user.New`, not
  `user.NewUser`).
- **GO-05 Getters** have no `Get` prefix (`Owner()`, `SetOwner()`).
- **GO-06 Receivers** are short (one or two letters) and consistent across a
  type's methods.

### Errors

- **GO-07** Return `error` as the last result. Handle every error; never
  discard with `_` without a comment.
- **GO-08** Wrap with context using `fmt.Errorf("…: %w", err)`; check with
  `errors.Is` / `errors.As`.
- **GO-09** Error strings are lowercase with no trailing punctuation.
- **GO-10** Don't `panic` for ordinary errors; panic only on programmer errors
  or impossible states.

### Design

- **GO-11** `context.Context` is the first parameter of functions that do I/O
  or may block. Never store a context in a struct.
- **GO-12** Accept interfaces, return concrete types. Define interfaces in the
  package that uses them, kept small.
- **GO-13** Avoid naked returns except in very short functions.
- **GO-14** Prefer synchronous APIs; let callers add concurrency.

### Docs and tests

- **GO-15 Doc comments** on every exported name, as full sentences starting
  with the name (`// Owner returns …`).
- **GO-16 Tests** are table-driven where cases repeat, and failure messages
  read `got X, want Y`.

## Example

```go
// MaxUploadBytes is the largest upload accepted by Upload.
const MaxUploadBytes = 10 << 20

// Upload stores r under name and returns the object's public ID.
// It returns ErrTooLarge if r exceeds MaxUploadBytes.
func (s *Store) Upload(ctx context.Context, name string, r io.Reader) (string, error) {
	data, err := io.ReadAll(io.LimitReader(r, MaxUploadBytes+1))
	if err != nil {
		return "", fmt.Errorf("read upload %q: %w", name, err)
	}
	if len(data) > MaxUploadBytes {
		return "", ErrTooLarge
	}
	return s.put(ctx, name, data)
}
```
