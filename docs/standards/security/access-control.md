---
id: standards/security/access-control
version: 2.0.0
load_when: Writing or changing authorization logic, roles or permissions, database access policies, admin features, multi-tenant data, or anything that decides who can read or write what.
---

# Access control

ASVS 5.0 chapter V8 (Authorization). Requirement text is paraphrased. The
stack profile shows the policy syntax and helper functions for its database
and framework.

## Rules

- **SEC-AZ-01 Every gate is default-deny.** Server code authorizes every
  operation through the data access layer's authorization helpers. If clients
  can reach the database directly (for example through Firestore Security
  Rules, Supabase/PostgreSQL row-level security, or similar policies), those
  policies are a second gate and also deny anything not explicitly allowed.
  Privileged credentials (admin SDKs, service roles) bypass database policies,
  so server code never relies on them. `[ASVS 8.2.1, 8.3.1 · L1]`
- **SEC-AZ-02 Check the object, not just the login.** Every read or write of a
  specific record checks the caller's relationship to *that* record (owner,
  member, role in its tenant). "Signed in" alone authorizes nothing except the
  caller's own profile. This prevents IDOR. `[ASVS 8.2.2 · L1]`
- **SEC-AZ-03 Field-level write control.** Each write path allowlists the fields
  a caller may set (schemas with unknown keys rejected, and database policies
  where they exist). Ownership, role, billing, and audit fields are never
  client-writable. `[ASVS 8.2.3, 15.3.3 · L2]`
- **SEC-AZ-04 Field-level read control.** Responses are mapped to the fields the
  caller may see (SEC-API-02). Where database policies authorize whole records
  rather than fields, data with stricter read rules lives in a separate record
  or table. `[ASVS 8.2.3 · L2]`
- **SEC-AZ-05 Roles are assigned by the server.** Only server code (which
  itself checks authorization) grants roles or permissions, stored where
  clients can't write (identity-provider claims, a server-only table). Roles are
  never read from client-writable data. When roles travel in tokens, force a
  token refresh after a change. `[ASVS 8.2.1 · L1]`
- **SEC-AZ-06 The authorization matrix is documented.** Roles × resources ×
  actions, plus field-level rules, live in `security-decisions.md`, and the
  tests mirror it row for row. `[ASVS 8.1.1 · L1, 8.1.2 · L2]`
- **SEC-AZ-07 Tenant isolation.** Multi-tenant data carries its tenant key
  (DB-03). Every server query and every database policy checks membership in
  that tenant. No cross-tenant queries from clients. `[ASVS 8.4.1 · L2]`
- **SEC-AZ-08 Queries carry their constraints.** Every query on owned or tenant
  data includes the owner or tenant condition, even when a policy also enforces
  it. (Some policy systems, such as Firestore rules, reject a query outright if
  it could return records the caller can't read.)
- **SEC-AZ-09 Policies ship with tests.** Every authorization helper and every
  database policy has tests covering allowed and denied cases for each role,
  signed-out users, and users from another tenant (TEST-04). Policies are
  deployed from the repo only, never edited in a console (DB-08).
- **SEC-AZ-10 Admin surfaces check twice.** Admin screens check the role when
  rendering *and* in every server-side handler they call. Request middleware is
  never the only check.
- **SEC-AZ-11 File storage mirrors data access.** File access applies the same
  ownership and tenant checks as the data it belongs to, plus size and
  content-type limits (SEC-IO-22).
- **SEC-AZ-12 Log denials.** Authorization failures on the server are logged
  as security events (OBS-07). `[ASVS 16.3.2 · L2]`

## Server-side check (TypeScript example)

```ts
/**
 * Throws `ForbiddenError` unless `user` may edit `project`.
 * Mirrors the database policy for project updates, if the stack has one.
 */
export async function assertCanEdit(user: SessionUser, project: Project): Promise<void> {
  const isMember = await memberRepository.exists(project.tenantId, user.id);
  if (!isMember) {
    throw new ForbiddenError('project.edit', project.id);
  }
}
```

Keep policy logic and server checks aligned: when one changes, the other and
the tests change in the same pull request.
