---
paths:
  - "apphosting*.yaml"
  - "firebase.json"
  - ".firebaserc"
  - "src/lib/config.ts"
  - "next.config.*"
---
# Firebase and app configuration

Read `docs/stacks/nextjs-firebase/environments.md` and `docs/standards/security/crypto-secrets-config.md`.

- Secrets are referenced with `secret:` from Secret Manager; never inline, never `NEXT_PUBLIC_*` (SEC-03, NXF-40).
- Environments differ only by config overlays, not code branches (ENV-05, NXF-14).
- `.firebaserc` `default` stays the `demo-` project; hosted targets are always explicit (NXF-12).
- Do not deploy or change hosted environments unless a human asked in this session (ENV-04).
- `process.env` is read only in `src/lib/config.ts` (ARCH-07).
