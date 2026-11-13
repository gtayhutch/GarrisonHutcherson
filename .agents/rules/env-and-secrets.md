---
trigger: glob
globs: ".env*, **/.env*, **/*.env"
description: "Environment files and local secrets."
---
# Environment files and secrets

Read `docs/standards/security/crypto-secrets-config.md`.

- Hosted secrets live in the secrets manager, referenced by name; never in committed files (SEC-03, SEC-CFG-02).
- Local files hold test-mode credentials only and are gitignored (GIT-09).
- Variables compiled into client code are public, never secrets (SEC-CFG-02).
- Environment variables are read only by the config module (ARCH-07).
