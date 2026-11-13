---
id: project/data-model
version: 1.1.0
load_when: Reading or changing content collections, their schemas, or anything that classifies data.
---

# Data model

Every content collection is listed here before it is used (DB-01).
Classes follow `docs/standards/security/data-protection.md`.

There is no database and no file storage (ADR 0002). The data model is the set
of Astro content collections in `src/content/`. Their schemas in
`src/content.config.ts` validate every entry at build time (ACF-03), and
components read them only through `src/lib/content.ts`. Git is the source of
truth and the backup.

## Overview

All content is **Public**: it is published on the site. Never commit the
owner's phone number, street address, or personal email; the only published
address is the Email Routing one in `src/lib/config.ts` (ADR 0003).

| Collection | Loader and path | Contains | Highest class | Retention |
| --- | --- | --- | --- | --- |
| `experience` | `glob` `src/content/experience/*.yaml` (one file per employer) | Employers, roles, highlights | Public | Until removed from the repo |
| `skills` | `file` `src/content/skills.yaml` | Skill groups with tags | Public | Until removed |
| `strengths` | `file` `src/content/strengths.yaml` | Home-page strength cards | Public | Until removed |
| `projects` | `glob` `src/content/projects/*.md` | Projects (frontmatter + body) | Public | Until removed |
| `pages` | `glob` `src/content/pages/*.md` | Page copy: `home` (hero), `about` (body) | Public | Until removed |

## Details

Text fields are trimmed; short text is 1–120 characters, sentences 1–400.
`order` is a positive integer sort key (1 first). `icon` is one of
`ICON_NAMES` in `src/content.config.ts`.

### experience

| Field | Type | Notes |
| --- | --- | --- |
| company, location | short text | |
| period | text (4–40) | Display string, for example `Sep 2022 – Aug 2025` |
| order | integer | 1 = most recent employer |
| icon | icon name | Timeline tile |
| summary | sentence | Home-page preview line |
| roles[] | 1+ objects | Newest first: `title`, optional `team`, optional `period`, `highlights[]` (0–8 sentences) |

### skills

`title`, `order`, `icon`, `summary`, `tags[]` (1–12 short texts). `id` is the
entry key in the YAML file.

### strengths

`title`, `order`, `icon`, `body` (sentence). `id` is the entry key.

### projects

Frontmatter: `title`, `order`, `summary`, optional `url` and `repo` (URLs),
`tags[]` (0–10). The Markdown body is rendered on the Projects page.

### pages

Frontmatter: `title`, `description`, and for the home hero optional
`eyebrow[]` (0–4), `headline`, `headlineAccent`, `intro`. The body is
rendered where the page uses it (About).

## File storage prefixes

None. Fonts come from `@fontsource-variable/outfit`; icons are inline SVG.
