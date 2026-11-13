---
id: project/data-model
version: 0.2.0
load_when: Reading or changing tables or collections, fields, file-storage paths, indexes, or access policies; classifying data.
---

# Data model

Every table, collection, and file-storage prefix is listed here before it is
used (DB-01).
Classes follow `docs/standards/security/data-protection.md`.

Use the database's own terms (tables or collections) and, for nested stores,
full paths. The stack profile may show a store-specific example.

## Overview

| Table / collection | Owner feature | Contains | Highest class | Retention |
| --- | --- | --- | --- | --- |
| {{users}} | auth | Public profile | Confidential | Until account deletion |
| {{user_private}} | auth | Settings, contact details | Confidential | Until account deletion |
| {{name}} | {{feature}} | {{what}} | {{class}} | {{period}} |

## Details

Copy this block for each table or collection (format: `docs/standards/data.md`).

### {{users}}

Owner: auth · Retention: until account deletion (SEC-DATA-08)

| Field | Type | Class | Written by | Notes |
| --- | --- | --- | --- | --- |
| id | user ID | Internal | server | Identity provider subject (SEC-AUTH-08) |
| displayName | string (1–80) | Confidential | owner | |
| photoUrl | string (https URL)? | Confidential | owner | Validated scheme (SEC-IO-02) |
| createdAt | timestamp | Internal | server | Immutable |

Reads: owner; {{others?}}. Writes: owner (listed fields only).
Indexes: none.

## File storage prefixes

| Prefix | Contents | Class | Max size | Types | Readers |
| --- | --- | --- | --- | --- | --- |
| `users/{userId}/avatars/{fileId}` | Profile photos | Confidential | {{2 MB}} | {{image/png, image/jpeg, image/webp}} | {{owner / public URL}} |

## Denormalized copies

| Copy | Source of truth | Kept in sync by |
| --- | --- | --- |
| {{members.displayName}} | {{users.displayName}} | {{user-updated event handler}} |
