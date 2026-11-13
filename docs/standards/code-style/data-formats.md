---
id: standards/code-style/data-formats
version: 2.0.0
load_when: Editing JSON, YAML, or Markdown files; designing API payload shapes or database field names.
---

# Data formats: JSON, YAML, Markdown

Sources: [Google JSON Style Guide](https://github.com/google/styleguide/blob/gh-pages/jsoncguide.md),
[Google Markdown Style Guide](https://github.com/google/styleguide/blob/gh-pages/docguide/style.md).

## Rules

### JSON (API payloads, config, stored documents)

- **FMT-01 Property names are `camelCase`,** ASCII, starting with a letter.
  The same rule applies to field names in document databases and to
  column names exposed through APIs.
- **FMT-02 Plural names for arrays** (`items`, `members`); singular for
  everything else.
- **FMT-03 Dates and times** are RFC 3339 strings in UTC
  (`2026-11-09T10:15:00Z`) in JSON; databases store their native timestamp
  type. Durations carry their unit in the name (`timeoutMs`).
- **FMT-04 Enum values** are strings, not numbers.
- **FMT-05 Absent vs. empty.** Omit properties that have no value rather than
  sending `null`, unless `null` has a defined meaning in the contract.
- **FMT-06 No comments in `.json`.** Use JSONC only where the consuming tool
  supports it (for example `tsconfig.json`).
- **FMT-07 Response envelope.** API responses follow the shape in
  `docs/standards/api-design.md` (API-05).

### YAML (deployment config, CI workflows)

- **FMT-08** 2-space indentation, no tabs. Quote strings that YAML could
  misread (`"on"`, `"yes"`, `"0123"`, version numbers).
- **FMT-09** Comments explain *why* a value is set, especially for resource
  limits, secrets references, and environment overrides.
- **FMT-10** Secrets are referenced (`secret: NAME`), never inlined.

### Markdown (all docs)

- **FMT-11 One H1** per file, as the title. ATX headings (`##`), unique and
  descriptive, with a blank line before and after.
- **FMT-12 Fenced code blocks** with a language tag. Inline code for paths,
  commands, identifiers.
- **FMT-13 Descriptive link text;** never "click here".
- **FMT-14 Lists:** use `1.` for every item in long numbered lists; indent
  nested lists consistently.
- **FMT-15 Tables** for tabular data only; keep cells short.
- **FMT-16 Short and current beats long and stale.** Delete outdated content;
  don't add "deprecated" sections.
- **FMT-17 Line length.** Wrap prose at ~80 characters when practical; never
  break links, tables, or code.
