---
id: standards/code-style/python
version: 2.0.0
load_when: Editing .py files (services, functions, scripts, data tooling).
---

# Python

Source: [Google Python Style Guide](https://google.github.io/styleguide/pyguide.html).

## Rules

### Tooling and layout

- **PY-01 Format and lint.** Format with Pyink or Black (80-column limit). Lint
  with Pylint using Google's `pylintrc`. Type-check public APIs.
- **PY-02 Layout.** 4-space indentation, never tabs. No backslash line
  continuation; use implicit continuation inside brackets. Trailing comma when
  the closing bracket is on its own line.
- **PY-03 Suppressions** are line-scoped (`# pylint: disable=…`) and explained
  when the reason is not obvious from the message name.

### Imports

- **PY-04 Import modules, not names.** `from package import module`, then
  `module.thing()`. Exceptions: `typing`, `collections.abc`.
- **PY-05 No relative imports.** Use the full package path.
- **PY-06 Order.** One import per line, grouped: `__future__`, standard
  library, third-party, local. Sorted within each group.

### Naming

- **PY-07 Casing.**

  | Style | Use for |
  | --- | --- |
  | `lower_with_under` | modules, functions, methods, variables, parameters |
  | `CapWords` | classes, exceptions (exceptions end in `Error`) |
  | `CAPS_WITH_UNDER` | module-level constants |
  | `_leading_underscore` | internal (module- or class-private) names |

- **PY-08 File names** are `lower_with_under.py`. Never dashes.
- **PY-09 No single-letter names** except loop counters, `e` in `except`, `f`
  for files. Never put the type in the name.

### Language

- **PY-10 Exceptions.** Use built-in exceptions where they fit. No bare
  `except:`; catch `Exception` only to re-raise or at a failure boundary. Keep
  `try` blocks small. Never use `assert` for validation.
- **PY-11 No mutable defaults.** Use `None` and create the object inside the
  function.
- **PY-12 No mutable global state.** If unavoidable, prefix with `_` and
  explain why in a comment.
- **PY-13 Truthiness.** `if not items:` for empty containers; `if x is None:`
  for `None`. Don't compare booleans with `==`.
- **PY-14 Comprehensions** have at most one `for` clause and simple filters.
- **PY-15 Resources** are closed with `with` statements.
- **PY-16 Strings.** f-strings or `%`/`format` for formatting; `''.join()` to
  build strings in loops. For logging, pass a format string and arguments, not
  an f-string.
- **PY-17 Power features are avoided:** metaclasses, bytecode access,
  `__del__`, dynamic attribute tricks.
- **PY-18 Entry points.** Executable logic goes in `main()` behind
  `if __name__ == '__main__':`.

### Docs and types

- **PY-19 Docstrings.** `"""` docstrings on modules, public functions, and
  classes. One-line summary (≤ 80 chars, ends with a period), then `Args:`,
  `Returns:` (or `Yields:`), `Raises:` sections. Class docstrings list public
  attributes under `Attributes:`.
- **PY-20 Type annotations** on all public APIs.
- **PY-21 TODOs** follow DOC-05: `# TODO(#123): explanation.`

## Example

```python
"""Billing helpers shared by background jobs."""

import datetime

TRIAL_LENGTH = datetime.timedelta(days=14)


def trial_ends_at(started_at: datetime.datetime) -> datetime.datetime:
    """Returns when a trial that started at `started_at` ends.

    Args:
        started_at: Timezone-aware start time of the trial.

    Raises:
        ValueError: If `started_at` is naive.
    """
    if started_at.tzinfo is None:
        raise ValueError('started_at must be timezone-aware')
    return started_at + TRIAL_LENGTH
```
