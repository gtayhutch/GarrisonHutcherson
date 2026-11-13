---
paths:
  - "src/**/*.tsx"
  - "src/components/**"
---
# UI components

Read `docs/standards/frontend.md` and the framework rules in `docs/stacks/nextjs-firebase/README.md`.

- Server components by default; `'use client'` only on small interactive leaves (NXF-02).
- Never inject untrusted HTML; React escapes for you (SEC-IO-01).
- Keyboard access, visible focus, labels, contrast (FE-06..FE-08).
- Loading, empty, error, and not-found states (FE-05, NXF-05).
- Client code never imports server-only modules (ARCH-03, NXF-03).
