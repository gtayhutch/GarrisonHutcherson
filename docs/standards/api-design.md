---
id: standards/api-design
version: 2.0.0
load_when: Adding or changing an entry point (UI mutation handler, HTTP route, RPC method, webhook, event handler, scheduled job); designing request/response shapes, errors, pagination, or versioning.
---

# API design

Stack-neutral. The stack profile maps each entry-point kind to the framework's
mechanism.

## Rules

- **API-01 Pick the right entry point.**

  | Need | Entry-point kind |
  | --- | --- |
  | Mutation triggered from our own UI | The framework's server-side mutation handler (for example server actions, form handlers, controllers) |
  | Webhook, public API, or a client we don't ship | Versioned HTTP route (`/api/v1/…`) |
  | Our own mobile or desktop client | HTTP API or RPC (for example callable functions, gRPC), with client attestation where available |
  | Side effect after a data change | Event handler or queue consumer |
  | Scheduled work | Scheduled job |

  Reads for server-rendered screens go through the feature's service directly,
  not through an API.
- **API-02 Every entry point uses the ARCH-04 pipeline** and is documented per
  DOC-02 (including its security requirements).
- **API-03 Contracts are schemas.** The schema in the feature's schema module
  is the request contract; response types are exported. Public APIs also
  publish an OpenAPI (or equivalent) document generated from the schemas.
- **API-04 Naming.** Mutation handlers and RPC methods are verb phrases
  (`createInvoice`, `inviteMember`, cased per the language). HTTP paths are
  plural nouns in `kebab-case` (`/api/v1/billing-accounts/{id}`); JSON fields
  are `camelCase` (FMT-01).
- **API-05 One response shape.** Mutation handlers and RPC methods return a
  result type (OBS-02). HTTP APIs return `{data: …}` on success and
  `{error: {code, message, requestId, fieldErrors?}}` on failure, with these
  status codes (the profile maps them to platform-specific error codes):

  | `ErrorCode` | HTTP |
  | --- | --- |
  | `INVALID_INPUT` | 400 |
  | `UNAUTHENTICATED` | 401 |
  | `FORBIDDEN`, `REAUTH_REQUIRED` | 403 |
  | `NOT_FOUND` | 404 |
  | `CONFLICT` | 409 |
  | `RATE_LIMITED` | 429 |
  | `INTERNAL` | 500 |

- **API-06 Don't reveal existence.** When a caller may not access a resource,
  return `NOT_FOUND` rather than `FORBIDDEN` if revealing that it exists would
  leak information.
- **API-07 Cursor pagination.** List endpoints take `pageSize` (with a
  maximum, default 20) and an opaque `pageToken`; they return `nextPageToken`.
  Offset pagination only for small, bounded datasets.
- **API-08 Idempotency.** Create, payment, and email-sending endpoints accept
  an idempotency key (an `Idempotency-Key` header or an `idempotencyKey`
  field) and return the original result on retry. Event handlers are
  idempotent by event ID (ARCH-09).
- **API-09 Limits.** Request body size, array lengths, and string lengths are
  bounded by the schema. Long work goes to a queue or job, not a request.
- **API-10 Versioning for external APIs.** `/api/v1/…`. Within a version,
  changes are additive only (new optional fields, new endpoints). Removing or
  changing a field means a new version and a deprecation period.
- **API-11 Abuse controls.** Rate limits and client attestation per
  SEC-IO-19. Webhooks verify signatures (SEC-API-06).
- **API-12 Time and money.** Timestamps are RFC 3339 UTC in JSON; money is an
  integer in minor units plus an ISO 4217 currency code
  (`{amountMinor: 1999, currency: 'USD'}`). Never floats for money.

## HTTP route shape

```text
GET /api/v1/invoices?pageSize=20&pageToken=…
  1. parse query with listInvoicesQuerySchema       → 400 INVALID_INPUT on failure
  2. authenticate (session or bearer token)          → 401 UNAUTHENTICATED
  3. authorize: caller belongs to the billing account → 404 NOT_FOUND (API-06)
  4. invoiceService.list(user, query)
  5. 200 {data: {items: [...], nextPageToken}}       — only permitted fields
```
