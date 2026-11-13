---
id: standards/data
version: 2.0.0
load_when: Designing or changing database tables, collections, fields, queries, indexes, transactions, migrations, file-storage paths, or backups.
---

# Data

Stack-neutral: applies to relational, document, and key-value stores alike.
Database-specific rules (limits, index files, policy syntax) are in the stack
profile.

## Rules

### Modeling

- **DB-01 Model first, then code.** New tables, collections, and fields are
  added to `docs/project/data-model.md` (name, fields, types, class per
  SEC-DATA-01, owner, retention, who reads and writes) in the same PR that
  introduces them.
- **DB-02 Model for your queries.** Start from the screens and the queries they
  need. Normalize by default in relational stores; denormalize deliberately in
  document stores, and record for each copied field which record is the source
  of truth and what keeps the copy in sync.
- **DB-03 Ownership is explicit.** Every tenant-owned or user-owned record
  carries its tenant or owner key (or lives under it in the path), so queries
  and access policies can scope to it (SEC-AZ-07).
- **DB-04 IDs.** Use non-guessable identifiers (database-generated random IDs,
  UUIDv4/v7, ULIDs). Never put personal data in IDs, and never expose
  sequential IDs in URLs or APIs.
- **DB-05 Standard fields.** Names follow FMT-01 (or the database's convention
  for column names); `createdAt` and `updatedAt` are set by the server;
  `createdBy` holds a user ID; schemaless stores add a `schemaVersion` integer
  to records whose shape will evolve.
- **DB-06 Typed boundaries.** Repositories validate records against the schema
  when reading them, so a malformed record fails loudly at the boundary rather
  than deep in the UI.
- **DB-07 Respect platform limits.** Record size, write throughput per record,
  hot-spotting, and index limits are listed in the profile; designs stay well
  inside them.

### Changes and queries

- **DB-08 Schema, indexes, and access policies are code.** They live in the
  repository (migrations, index definitions, policy files) and deploy through
  CI (CI-03), never by hand in a console.
- **DB-09 Migrations: expand → migrate → contract.** Add new fields or tables
  first (readers accept both shapes), backfill with an idempotent migration
  that supports a dry run, run it on staging, then production, and only then
  remove the old shape.
- **DB-10 Read-modify-write uses transactions;** multi-record changes that
  must succeed together are atomic (SEC-IO-18).
- **DB-11 Bounded reads.** Every query has a limit; lists paginate with cursors
  (API-07); realtime subscriptions are scoped to what is on screen and closed
  when no longer needed.
- **DB-12 Deletes are complete.** Cascades are defined explicitly (foreign keys
  or code). Account deletion follows SEC-DATA-08.

### File storage

- **DB-13 Storage paths mirror ownership:** `users/{userId}/…`,
  `tenants/{tenantId}/…`, with file names generated from IDs (SEC-IO-24) and
  original names kept as metadata.
- **DB-14 Derived files** (thumbnails, transcodes, exports) are written by
  server code to a separate prefix and are never client-writable.

### Operations

- **DB-15 Backups and recovery.** Production has automated backups and
  point-in-time (or frequent snapshot) recovery, with retention that matches
  SEC-DATA-07, and deletion protection on the database. Restores are rehearsed
  on staging at least once per quarter.
- **DB-16 Cost and performance awareness.** Check query plans or index usage
  for new queries; prefer aggregation queries to reading whole sets; cache
  stable data on the server; watch usage dashboards after launches.

## data-model.md entry format

```markdown
### projects  (table or collection; path if nested, e.g. tenants/{tenantId}/projects)

Owner: projects feature · Retention: until tenant deleted + 30 days

| Field | Type | Class | Written by | Notes |
| --- | --- | --- | --- | --- |
| id | ID | Internal | server | DB-04 |
| tenantId | ID | Internal | server | Ownership key (DB-03) |
| name | string (1–100) | Confidential | member | |
| createdBy | user ID | Internal | server, from the session | Immutable |
| createdAt | timestamp | Internal | server | Immutable |

Reads: tenant members. Writes: members (name only); server for the rest.
Indexes: (tenantId, createdAt desc).
```
