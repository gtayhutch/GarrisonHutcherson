---
paths:
  - "src/**/actions.ts"
  - "src/app/**/route.ts"
  - "src/lib/server/**"
  - "src/proxy.ts"
  - "proxy.ts"
  - "functions/src/**"
---
# Server entry points

Read `docs/standards/api-design.md`, `docs/standards/security/web-and-api.md`, and `docs/stacks/nextjs-firebase/security.md`.

- Pipeline in order: parse → authenticate → authorize → execute → map result (ARCH-04, NXF-04).
- Validate with a `.strict()` zod schema; never trust client input (SEC-02, SEC-IO-14).
- Authorize the specific object; the Admin SDK bypasses rules (SEC-AZ-01, NXF-31).
- Server-only modules start with `import 'server-only';` (NXF-03).
- Return `ActionResult<T>`; generic messages to users, details to logs (OBS-02, OBS-04).
- `proxy.ts` is never the only authorization check (NXF-10).
- Triggers and scheduled functions are idempotent (ARCH-09).
