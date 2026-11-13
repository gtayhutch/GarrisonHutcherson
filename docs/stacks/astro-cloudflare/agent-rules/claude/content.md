---
paths:
  - "src/content/**"
  - "src/content.config.ts"
  - "src/lib/content.ts"
---
# Content

Read the framework rules in `docs/stacks/astro-cloudflare/README.md` and `docs/project/data-model.md`.

- Every content file belongs to a collection with a schema in `src/content.config.ts` (ACF-03).
- Components read content only through `src/lib/content.ts` (ARCH-06).
- Content is public: never commit private contact details or anything not meant for the site.
- Schema changes update `docs/project/data-model.md` in the same change (DOC-06).
