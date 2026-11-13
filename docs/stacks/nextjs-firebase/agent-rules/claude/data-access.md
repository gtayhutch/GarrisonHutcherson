---
paths:
  - "src/**/repository.ts"
  - "firestore.indexes.json"
  - "scripts/migrations/**"
---
# Data access

Read `docs/standards/data.md` and `docs/stacks/nextjs-firebase/data-firestore.md`; update `docs/project/data-model.md`.

- New fields and collections are classified and documented first (DB-01, SEC-DATA-01).
- Parse documents with the schema on read (FS-04); every query has a `limit` (FS-09).
- Read-modify-write uses transactions (FS-08).
- Migrations: expand → migrate → contract, idempotent, with `--dry-run` (DB-09, FS-07).
- Indexes live in `firestore.indexes.json` (FS-06).
