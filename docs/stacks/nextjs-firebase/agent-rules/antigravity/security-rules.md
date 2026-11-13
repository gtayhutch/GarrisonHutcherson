---
trigger: glob
globs: "firestore.rules, storage.rules, tests/rules/**"
description: "Firestore and Storage Security Rules and their tests."
---
# Security Rules

Read `docs/standards/security/access-control.md` and `docs/stacks/nextjs-firebase/security.md`.

- Default deny; open each path explicitly (SEC-AZ-01).
- Check the caller's relationship to the specific document, not just sign-in (SEC-AZ-02).
- Restrict writable fields with `keys().hasOnly()` / `diff().affectedKeys().hasOnly()`; protected fields are never client-writable (SEC-AZ-03).
- Rules are not filters: client queries must carry the constraints the rule needs (NXF-33).
- Every change ships allowed and denied tests per actor (TEST-04, NXF-43).
- Mirror the change in `src/lib/server/authz.ts` and the matrix in `docs/project/security-decisions.md` in the same PR.
