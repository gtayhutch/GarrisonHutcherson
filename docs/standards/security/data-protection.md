---
id: standards/security/data-protection
version: 2.0.0
load_when: Adding or changing stored fields, collecting personal data, analytics or third-party tracking, caching, client-side storage, data retention, exports, or account deletion.
---

# Data protection and privacy

ASVS 5.0 chapter V14 (Data Protection), plus privacy practices we apply to
every project. Requirement text is paraphrased. This is engineering guidance,
not legal advice; confirm obligations (GDPR, CCPA, COPPA, HIPAA) for each
product.

## Data classes

Every stored field is assigned one class in `docs/project/data-model.md`.
`[ASVS 14.1.1 · L2]`

| Class | Examples | Storage | Logs | Browser storage | Third parties |
| --- | --- | --- | --- | --- | --- |
| **Public** | Published content, product names | Any | Allowed | Allowed | Allowed |
| **Internal** | Internal IDs, feature flags, aggregate metrics | Primary database | Allowed | Allowed | Processors only |
| **Confidential** | Name, email, phone, address, IP, user content | Primary database, owner-scoped access | IDs only, never values | Not persisted | Only processors listed in `security-decisions.md` |
| **Restricted** | Government IDs, health, precise location, financial details, OAuth tokens | Separate record or table, application-level encryption with a KMS | Never | Never | Only with a recorded legal basis |

The protection requirements in this table are the documented requirements per
level. `[ASVS 14.1.2 · L2]`

## Rules

- **SEC-DATA-01 Classify before you store.** A new field is not merged until
  it has a class, an owner, and a retention period in `data-model.md`.
- **SEC-DATA-02 Collect the minimum.** Store only what a feature needs; prefer
  derived or truncated values (birth year instead of birth date).
- **SEC-DATA-03 No sensitive data in URLs.** Tokens, emails, and IDs that
  reveal personal data go in the body or headers, never in paths or query
  strings. `[ASVS 14.2.1 · L1]`
- **SEC-DATA-04 Don't cache what's personal.** Personalized and authenticated
  responses send `Cache-Control: private, no-store` and are never cached at the
  CDN. `[ASVS 14.2.2, 14.3.2 · L2]`
- **SEC-DATA-05 Nothing sensitive in client storage** (`localStorage`,
  `sessionStorage`, IndexedDB, readable cookies, unencrypted files on device),
  apart from the auth SDK's own session state and the platform's secure
  storage. Offline caches and client-side databases count: disable them for
  Confidential data on shared devices, or clear them on logout (together with
  `Clear-Site-Data` on the web). The profile names the stack's caches. `[ASVS 14.3.1 · L1, 14.3.3 · L2]`
- **SEC-DATA-06 Third parties get the minimum.** Analytics, error tracking,
  session replay, and AI providers receive no Confidential or Restricted data
  unless the processor and purpose are listed in `security-decisions.md`.
  Error trackers run with PII collection off and with request bodies scrubbed.
  `[ASVS 14.2.3 · L2]`
- **SEC-DATA-07 Retention is enforced.** Each table or collection has a
  retention period; scheduled jobs delete or anonymize expired data. Backups follow
  the same retention. `[ASVS 14.2.4 · L2]`
- **SEC-DATA-08 Account deletion is complete.** Deleting an account removes or
  anonymizes the user's data across the database, file storage, search
  indexes, caches, and third-party processors within the period stated in the
  privacy policy, driven by an account-deletion event or job. The flow is tested. *(house)*
- **SEC-DATA-09 Users can get their data.** A data export path exists (manual
  at first is fine) and is documented. *(house)*
- **SEC-DATA-10 Restricted data gets application-level encryption** with
  envelope encryption via a KMS (SEC-CRY-05), on top of the platform's default
  encryption at rest. *(house)*
- **SEC-DATA-11 Logs carry IDs, not values.** Log user IDs, record IDs, and
  request IDs; never emails, names, tokens, or request bodies. `[ASVS 16.2.5 · L2]`
- **SEC-DATA-12 Synthetic data outside production.** `staging` and `test` use
  seeded fake data. Copying production data down requires an ADR and
  irreversible anonymization. (SEC-12)
- **SEC-DATA-13 The privacy policy matches reality.** When data flows change
  (new processor, new field class, new retention), update the policy in the
  same release. *(house)*

## Review questions for any data change

1. What class is each new field, and who can read it?
2. Does it leave our systems (analytics, email, AI, logs)? Is that recorded?
3. How long do we keep it, and what deletes it?
4. Is it removed by account deletion and included in data export?
5. Could it end up in a URL, a cache, or browser storage?
