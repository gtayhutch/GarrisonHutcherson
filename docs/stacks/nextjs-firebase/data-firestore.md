---
id: stacks/nextjs-firebase/data-firestore
version: 2.0.0
load_when: Designing or changing Firestore collections, queries, indexes, transactions, migrations, or Cloud Storage paths in a Next.js + Firebase project.
---

# Firestore and Cloud Storage

Implements `docs/standards/data.md` for Firestore. The universal DB rules
still apply; these add Firestore specifics.

## Rules

- **FS-01 Tenancy in the path (DB-03).** Tenant-owned data lives under the
  tenant (`workspaces/{workspaceId}/…`) and user-private data under
  `users/{uid}/…`, so rules and queries scope naturally.
- **FS-02 Auto IDs (DB-04).** Use Firestore auto-generated document IDs.
- **FS-03 Server timestamps (DB-05).** `createdAt`/`updatedAt` come from server
  timestamps; rules enforce `== request.time` on client writes.
- **FS-04 Converters + schema (DB-06).** Repositories use `withConverter` and
  parse each document with the zod schema on read.
- **FS-05 Limits (DB-07).** Documents stay well under 1 MiB; lists that grow
  without bound become subcollections; avoid sustained writes above about one
  per second to a single document (use distributed counters or aggregation
  queries); avoid monotonically increasing indexed fields at high write rates.
- **FS-06 Indexes are code (DB-08).** Composite indexes live in
  `firestore.indexes.json` and deploy with the rules. Exempt large text or
  array fields you never query from indexing.
- **FS-07 Migrations (DB-09)** are scripts in
  `scripts/migrations/NNNN-description.ts` that are idempotent and support
  `--dry-run`.
- **FS-08 Atomic writes (DB-10).** Read-modify-write uses transactions;
  multi-document writes that must succeed together use transactions or
  batched writes.
- **FS-09 Bounded reads (DB-11).** Every query has a `limit`; paginate with
  `startAfter` cursors; `onSnapshot` listeners are unsubscribed on unmount.
- **FS-10 Recursive deletes (DB-12).** Deleting a document doesn't delete its
  subcollections; server code uses recursive delete where needed.
- **FS-11 Storage paths (DB-13, DB-14)** mirror Firestore (`users/{uid}/…`,
  `workspaces/{workspaceId}/…`); derived files are written by functions to a
  separate prefix that rules make read-only.
- **FS-12 Cost (DB-16).** Reads are billed per document: prefer `count()` and
  `sum()` aggregation queries to reading collections, and watch the usage
  dashboard after launches.

## data-model.md entry, Firestore style

```markdown
### workspaces/{workspaceId}/projects/{projectId}

Owner: projects feature · Retention: until workspace deleted + 30 days

| Field | Type | Class | Written by | Notes |
| --- | --- | --- | --- | --- |
| name | string (1–100) | Confidential | member (client) | |
| createdBy | uid | Internal | client, must equal auth uid | immutable |
| createdAt | timestamp | Internal | client, must equal request.time | immutable |
| archivedAt | timestamp? | Internal | server only | |

Reads: workspace members. Writes: members (name only); server for the rest.
Indexes: (archivedAt asc, createdAt desc).
```
