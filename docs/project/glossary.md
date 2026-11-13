---
id: project/glossary
version: 1.0.0
load_when: A domain term in a task, ticket, or the code is unclear; naming new types, collections, or functions.
---

# Glossary

Domain terms, as used in the product, the code, and the docs. Code identifiers
use these exact words (DOC-07). If two terms mean the same thing, pick one and
list the other as "not".

| Term | Meaning | In code | Not to be confused with |
| --- | --- | --- | --- |
| Visitor | Anyone viewing the public site | — | "User": the site has no accounts |
| Owner | Garrison Hutcherson, who edits content and runs the hosting | — | — |
| Section | One part of the site (for example experience or skills), built as a component folder | `src/components/<section>/` | "Page": a route in `src/pages/` that may contain several sections |
| Collection | A typed set of content entries with one schema | `defineCollection` in `src/content.config.ts` | "Table": there is no database |
| Entry | One Markdown or YAML file in a collection | `CollectionEntry<'…'>` | "Post": not every entry is an article |
