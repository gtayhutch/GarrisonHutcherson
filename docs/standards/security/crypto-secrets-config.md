---
id: standards/security/crypto-secrets-config
version: 2.0.0
load_when: Adding or using secrets, API keys, environment variables, service identities, encryption, hashing, random tokens, TLS settings, outbound integrations, or production configuration.
---

# Cryptography, communication, configuration, secrets

ASVS 5.0 chapters V11 (Cryptography), V12 (Secure Communication), V13
(Configuration). Requirement text is paraphrased.

## Rules

### Cryptography (V11)

- **SEC-CRY-01 Never implement cryptography.** Use the platform's vetted
  libraries and services (for example Web Crypto, the language's standard
  crypto library, a cloud KMS, or Google Tink). `[ASVS 11.2.1 · L2]`
- **SEC-CRY-02 Approved algorithms only.** Symmetric: AES-GCM (256-bit keys)
  or ChaCha20-Poly1305. No ECB, no unauthenticated modes, no PKCS#1 v1.5
  padding. Hashing: SHA-256 or stronger; never MD5 or SHA-1 for security.
  At least 128 bits of security overall.
  `[ASVS 11.3.1, 11.3.2, 11.4.1 · L1, 11.2.3, 11.3.3 · L2]`
- **SEC-CRY-03 Prefer not to store passwords.** When a managed identity
  provider is used, it stores them. If the app ever stores a password or
  password-equivalent itself, use Argon2id or scrypt with documented
  parameters. `[ASVS 11.4.2 · L2]`
- **SEC-CRY-04 Unguessable values come from a CSPRNG** (for example
  `crypto.randomUUID()`, Python `secrets`, `SecureRandom`, `crypto/rand`), with
  at least 128 bits of entropy. General-purpose random functions
  (`Math.random()`, `random`) are never used for IDs, tokens, or codes.
  `[ASVS 11.5.1 · L2]`
- **SEC-CRY-05 Keys live in a KMS or the secrets manager.** The crypto
  inventory in `security-decisions.md` lists every key, algorithm, purpose,
  owner, and rotation period. `[ASVS 11.1.1, 11.1.2 · L2]`
- **SEC-CRY-06 Crypto agility.** Encrypted payloads carry a version or key ID
  so algorithms and keys can rotate without a data migration.
  `[ASVS 11.2.2 · L2]`

### Communication (V12)

- **SEC-TLS-01 HTTPS only.** Use the hosting platform's managed, publicly
  trusted certificates with TLS 1.2+ (1.3 preferred). Verify custom domains are
  provisioned before launch. No plain-HTTP fallbacks.
  `[ASVS 12.1.1, 12.2.1, 12.2.2 · L1]`
- **SEC-TLS-02 Outbound calls use `https://` and validate certificates.**
  Disabling verification (for example `NODE_TLS_REJECT_UNAUTHORIZED=0`,
  `rejectUnauthorized: false`, `verify=False`) is forbidden in every
  environment, including `test`. `[ASVS 12.3.1, 12.3.2 · L2]`
- **SEC-TLS-03 Internal service calls** (between services, functions, and
  third-party backends) are encrypted and authenticated. `[ASVS 12.3.3, 12.3.4 · L2]`

### Configuration and secrets (V13)

- **SEC-CFG-01 Inventory communications.** `security-decisions.md` lists every
  external service, webhook, and outbound host, and server-side outbound
  requests are restricted to that allowlist. `[ASVS 13.1.1, 13.2.4, 13.2.5 · L2]`
- **SEC-CFG-02 Secrets in a secrets manager.**
  - Hosted secrets live in a managed secrets store (for example Google Secret
    Manager, AWS Secrets Manager, Azure Key Vault) and are referenced by name
    from deployment config, never copied into it.
  - Each workload (app server, function, worker) can read only the secrets it
    needs.
  - Local test-mode credentials for third parties (for example a payment
    provider's test key) live in an untracked local file. Staging and
    production secrets never live on a developer machine.
  - Variables compiled into client code (prefixes such as `NEXT_PUBLIC_`,
    `VITE_`, `EXPO_PUBLIC_`, or values in an app binary) are public and never
    secrets. `[ASVS 13.3.1, 13.3.2 · L2]`
- **SEC-CFG-03 Least-privilege service identities.** Each backend and
  sensitive function runs as a dedicated service identity with only the
  permissions it needs; no owner or admin roles for workloads. No downloaded
  long-lived keys: CI uses OIDC federation (CI-05); local development uses the
  local environment. No default credentials anywhere.
  `[ASVS 13.2.1, 13.2.2, 13.2.3 · L2]`
- **SEC-CFG-04 Nothing extra in production.** No debug modes, verbose errors,
  public source maps, test routes, sample data, or exposed internal docs or
  monitoring endpoints. No source-control metadata is deployed.
  `[ASVS 13.4.1 · L1, 13.4.2, 13.4.3, 13.4.4, 13.4.5, 15.2.3 · L2]`
- **SEC-CFG-05 Restrict public client keys.** Keys that must ship in client
  code (for example a Firebase web `apiKey` or a maps key) are not secrets, but
  are restricted to the app's domains or app IDs and to the APIs it actually
  calls. *(house)*
- **SEC-CFG-06 Config is code.** Platform config, access policies, indexes,
  deployment config, and IAM changes go through pull requests; console edits
  in `staging`/`production` are reverted or captured in the repo the same day.
  *(house)*

## Environment variable conventions

| Kind | Where it lives | Example |
| --- | --- | --- |
| Public client config | Base or environment config, marked as build-time/public | `PUBLIC_API_BASE_URL` |
| Server-only setting | Base or environment config, runtime only | `LOG_LEVEL` |
| Secret | Secrets manager, referenced by name | `PAYMENTS_SECRET_KEY` |
| Local non-secret override | Committed local overlay | `USE_LOCAL_EMULATORS=true` |
| Local test credential | Untracked local file (gitignored) | `PAYMENTS_SECRET_KEY` = a test-mode key |

All of them are read through the config module (ARCH-07), which validates them
at startup and fails fast when one is missing. The profile names the actual
files.
