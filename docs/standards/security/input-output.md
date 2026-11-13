---
id: standards/security/input-output
version: 2.0.0
load_when: Handling user input, forms, query parameters, webhooks, rendering user content, building URLs, outbound requests to user-supplied URLs, uploads, downloads, exports.
---

# Input, output, business logic, files

ASVS 5.0 chapters V1 (Encoding and Sanitization), V2 (Validation and Business
Logic), V5 (File Handling). Requirement text is paraphrased; see the ASVS for
exact wording.

## Rules

### Output encoding and injection (V1)

- **SEC-IO-01 Let the framework escape.** Render untrusted data through the UI
  framework's escaping (JSX, auto-escaping templates, native text views). Raw
  HTML injection (`dangerouslySetInnerHTML`, `v-html`, `{@html}`, `|safe`) is
  allowed only with output from a vetted sanitizer (for example DOMPurify) and
  a comment naming it. In plain DOM code use `textContent`, never `innerHTML`.
  `[ASVS 1.2.1, 1.3.1, 3.2.2 · L1]`
- **SEC-IO-02 Build URLs with `URL` and `URLSearchParams`.** User-supplied
  links must use an allowlisted scheme (`https:`, optionally `mailto:`); reject
  `javascript:` and `data:`. `[ASVS 1.2.2 · L1]`
- **SEC-IO-03 Never interpolate untrusted data into `<script>`** or inline
  JavaScript. Pass data as props or as JSON that is serialized safely.
  `[ASVS 1.2.3 · L1]`
- **SEC-IO-04 No query injection.** Database access uses parameterized
  queries, an ORM, or a query builder; never string-built queries. Identifiers
  derived from input (table, collection, or field names; sort fields) MUST come
  from an allowlist. `[ASVS 1.2.4 · L1]`
- **SEC-IO-05 No shell commands built from input.** If a process must be
  spawned, use an argument array (`execFile`) with allowlisted values.
  `[ASVS 1.2.5 · L1]`
- **SEC-IO-06 No dynamic code.** No `eval`, `new Function`, or templates
  compiled from user input. `[ASVS 1.3.2 · L1, 1.3.7 · L2]`
- **SEC-IO-07 SSRF protection.** Server-side fetches of user-influenced URLs
  go through one helper that allowlists scheme, host, and port, blocks private
  and link-local ranges (including the metadata server `169.254.169.254` /
  `metadata.google.internal`), and does not follow redirects.
  `[ASVS 1.3.6, 15.3.2 · L2]`
- **SEC-IO-08 Sanitize rich content.** User Markdown is rendered without raw
  HTML; user SVG is rejected or sanitized; user CSS is never accepted.
  `[ASVS 1.3.4, 1.3.5 · L2]`
- **SEC-IO-09 Regular expressions.** Escape user input placed in a regex;
  cap input length before matching; avoid nested quantifiers.
  `[ASVS 1.2.9 · L2, 1.3.12 · L3]`
- **SEC-IO-10 Email.** Send through the provider's API with structured fields;
  strip CR/LF from anything placed in headers. `[ASVS 1.3.11 · L2]`
- **SEC-IO-11 Parsers.** Parse JSON then validate with a schema; never
  deserialize into class instances from untrusted input. If XML is ever parsed,
  disable DTDs and external entities. `[ASVS 1.5.1 · L1, 1.5.2 · L2]`
- **SEC-IO-12 CSV and spreadsheet exports** escape cells beginning with `=`,
  `+`, `-`, `@`, tab, or null. `[ASVS 1.2.10 · L3]`

### Validation and business logic (V2)

- **SEC-IO-13 Schemas are the validation documentation.** Every entry point's
  input contract is a schema in the feature's schema module, written with the
  stack's validation library (for example zod, pydantic, Bean Validation).
  Cross-field rules are schema-level validators. `[ASVS 2.1.1 · L1, 2.1.2, 2.2.3 · L2]`
- **SEC-IO-14 Positive validation.** Types, lengths, ranges, formats, and
  enums are explicit. Object schemas reject unknown keys (for example zod
  `.strict()`, pydantic `extra='forbid'`), which also blocks mass assignment. `[ASVS 2.2.1 · L1, 15.3.3 · L2]`
- **SEC-IO-15 Enforce on the server.** The same schema runs on the client for
  UX and on the server for security. `[ASVS 2.2.2 · L1]`
- **SEC-IO-16 Flows run in order.** Multi-step flows (checkout, onboarding,
  approvals) are state machines enforced on the server; a step cannot be
  skipped by calling a later endpoint directly. `[ASVS 2.3.1 · L1]`
- **SEC-IO-17 Business limits** (per user and global) are recorded in
  `security-decisions.md` and enforced in code. `[ASVS 2.1.3, 2.3.2 · L2]`
- **SEC-IO-18 Atomic operations.** Multi-record changes use database
  transactions (or the store's atomic batch writes). Limited resources (seats, slots, credits)
  are reserved inside a transaction that re-reads availability.
  `[ASVS 2.3.3, 2.3.4 · L2]`
- **SEC-IO-19 Anti-automation.** Expensive, costly, or abusable functions
  (sign-up, invites, AI calls, exports, email sends) have rate limits and,
  where available, client attestation. `[ASVS 2.4.1 · L2]`
- **SEC-IO-20 High-value actions** (large refunds, role grants to admin, bulk
  deletes) require a second approver at L3. `[ASVS 2.3.5 · L3]`

### Files (V5)

- **SEC-IO-21 Upload policy per feature** in `security-decisions.md`: allowed
  types and extensions, maximum size (and unpacked size), storage location,
  who can read, and how files are served. `[ASVS 5.1.1 · L2]`
- **SEC-IO-22 Enforce size and type.** The upload path (storage access
  policy, signed-upload constraints, or upload handler) enforces maximum size
  and declared content type; because the declared type comes from the client,
  server-side processing also checks the file's actual bytes (magic numbers)
  against the extension. `[ASVS 5.2.1, 5.2.2 · L1]`
- **SEC-IO-23 Archives** are checked for total uncompressed size and file
  count before extraction, ignore embedded paths, and reject symlinks.
  `[ASVS 5.2.3 · L2, 5.2.5, 5.3.3 · L3]`
- **SEC-IO-24 Storage paths are generated** from IDs
  (`users/{userId}/uploads/{uploadId}`), never from user-supplied filenames. Keep
  the original filename only as sanitized metadata. `[ASVS 5.3.2 · L1]`
- **SEC-IO-25 Serve user files safely.** Serve from the storage provider's
  domain or a separate hostname, never the app origin. Set `Content-Disposition` with a
  sanitized filename and `X-Content-Type-Options: nosniff`.
  `[ASVS 3.2.1 · L1, 5.4.1, 5.4.2 · L2]`
- **SEC-IO-26 Scan shared files.** Files one user can share with another are
  malware-scanned before they become visible. `[ASVS 5.4.3 · L2]`
- **SEC-IO-27 Quotas and image limits.** Per-user file count and storage
  quotas; reject images above a maximum pixel count. `[ASVS 5.2.4, 5.2.6 · L3]`

## Example: one schema, two uses (TypeScript + zod)

```ts
/** Input contract for creating a comment. Shared by the form and the action. */
export const createCommentSchema = z
  .object({
    postId: z.string().regex(/^[A-Za-z0-9]{20}$/),
    body: z.string().trim().min(1).max(5000),
  })
  .strict();
```

The client uses it for inline errors; the server-side handler calls
`createCommentSchema.safeParse(input)` as step 1 of the ARCH-04 pipeline. Other
stacks do the same with their validation library.
