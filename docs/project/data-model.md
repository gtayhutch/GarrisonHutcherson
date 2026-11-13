---
id: project/data-model
version: 1.0.0
load_when: Reading or changing content collections, their schemas, or anything that classifies data.
---

# Data model

Every content collection is listed here before it is used (DB-01).
Classes follow `docs/standards/security/data-protection.md`.

There is no database and no file storage (ADR 0002). The data model is the set
of Astro content collections in `src/content/`. Their schemas in
`src/content.config.ts` validate every entry at build time (ACF-03). Git is the
source of truth and the backup.

## Overview

All content is **Public**: it is published on the site. Nothing private is
ever committed (see `security-decisions.md`).

| Collection | Owner feature | Contains | Highest class | Retention |
| --- | --- | --- | --- | --- |
| — | — | Defined with the site's scope (`overview.md`) | Public | Until removed from the repo |

## Details

Copy this block for each collection when it is created.

```text
### <collection>

Owner: <section> · Path: `src/content/<collection>/` · Format: Markdown | YAML

| Field | Type | Class | Notes |
| --- | --- | --- | --- |
| title | string (1–120) | Public | |
```

## File storage prefixes

None. Images are repository files under `src/assets/`, optimized at build
time.
