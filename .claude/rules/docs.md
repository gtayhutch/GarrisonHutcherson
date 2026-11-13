---
paths:
  - "docs/**/*.md"
  - "AGENTS.md"
  - "CLAUDE.md"
---
# Documentation

Read `docs/standards/documentation.md`.

- `docs/standards/`, `docs/checklists/`, and `docs/stacks/` are shared across projects: change them in the template repo, not here. Record deviations in `docs/project/overrides.md`.
- Keep frontmatter, Rules-first shape, and size budgets (DOC-09).
- Never add `@` imports to `AGENTS.md` or `CLAUDE.md`; reference docs with code-span paths.
- Stack changes update `docs/project/stack.md` and get an ADR (SEL-10).
