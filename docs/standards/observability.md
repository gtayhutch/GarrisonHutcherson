---
id: standards/observability
version: 2.0.0
load_when: Handling errors, adding logs, defining security events, setting up monitoring or alerts, writing error boundaries, responding to incidents.
---

# Errors, logging, monitoring

Covers ASVS 5.0 chapter V16 (Security Logging and Error Handling).
Requirement text is paraphrased.

## Rules

### Errors

- **OBS-01 Two kinds of errors.** *Expected* errors (invalid input,
  unauthenticated, forbidden, not found, conflict, rate limited) are part of
  the contract and returned as typed results. *Unexpected* errors (bugs,
  outages) are thrown and handled at the entry-point boundary.
- **OBS-02 Entry points return a result type.** UI mutation handlers and RPC
  methods return a result type like `ActionResult<T>` (below); HTTP routes map
  it to status codes (API-05). Domain and service code throw (or return) typed
  application errors defined in the shared errors module.
- **OBS-03 Never swallow.** A `catch` either handles the error completely,
  adds context and rethrows (`new AppError('…', {cause})`), or converts it to
  a result at the boundary. Empty `catch` blocks fail review.
- **OBS-04 Users see generic messages.** Unexpected errors show a generic
  message with an error code and a request ID. No stack traces, SQL,
  file paths, internal IDs, or provider error text reach the client.
  `[ASVS 16.5.1 · L2]`
- **OBS-05 Fail closed, degrade gracefully.** If an authorization check,
  validation, or payment step errors, the operation stops. Calls to external
  services have timeouts, bounded retries with backoff and jitter (idempotent
  operations only), and a fallback or clear error when the service is down.
  `[ASVS 16.5.2, 16.5.3 · L2]`

### Logging

- **OBS-06 Structured JSON logs through one logger** per runtime (the shared
  logger module), written in the format the platform's log pipeline parses
  (named in the profile). Every entry has: `severity`, `message`, `event` (a stable dotted
  name like `auth.signin.failed`), UTC timestamp, `requestId` or trace,
  `env`, `release`, and `userId` when known. Values are passed as fields, never
  concatenated into the message (prevents log injection).
  `[ASVS 16.2.1, 16.2.2, 16.2.4, 16.4.1 · L2]`
- **OBS-07 Log security events.** At minimum: sign-in success and failure
  (with method), sign-up, password and MFA changes, session revocation,
  authorization denials, validation failures on security controls, rate-limit
  hits, client-attestation failures, role and permission changes, admin actions, data
  exports, and backend TLS or secret-access failures.
  `[ASVS 16.3.1, 16.3.2, 16.3.3, 16.3.4 · L2]`
- **OBS-08 Never log sensitive data:** passwords, tokens, session cookies,
  API keys, secrets, full request or response bodies, or Confidential and
  Restricted values (SEC-DATA-11). Log IDs instead. `[ASVS 16.2.5 · L2]`
- **OBS-09 Logs are inventoried and protected.** `security-decisions.md` lists
  what each layer logs, where it goes, retention, and who can read it. Logs go
  only to those destinations. Log access is restricted by the platform's
  access controls; at L2+ security logs are also routed to a separate,
  tamper-resistant store (another project or account, or a locked bucket). The
  platform's audit logs for data access are considered for production.
  `[ASVS 16.1.1, 16.2.3, 16.4.2, 16.4.3 · L2]`
- **OBS-10 Severity means something.**

  | Severity | Use for | Action |
  | --- | --- | --- |
  | `DEBUG` | Local diagnostics | Off in hosted environments |
  | `INFO` | Normal significant events (deploys, jobs finished) | None |
  | `WARNING` | Unexpected but handled (retry succeeded, fallback used) | Review weekly |
  | `ERROR` | A request or job failed | Alert on rate |
  | `CRITICAL` | Data loss risk, security incident, outage | Page immediately |

### Monitoring and incidents

- **OBS-11 Error tracking** (the platform's error reporting or a dedicated
  tracker, with PII collection off) captures unexpected server and client errors with release
  and environment tags.
- **OBS-12 Alerts in production** on: error rate, p95 latency, job and
  function failures, auth failure spikes, access-policy denial spikes, budget
  thresholds, and an uptime check on the home page and a health route.
- **OBS-13 Incidents get a short note** in `docs/project/decisions/`
  (what happened, impact, timeline, fix, prevention). Blameless.
- **OBS-14 Client errors.** Every screen or route section has an error
  boundary, and the app has a top-level fallback, each showing a generic
  message and a retry (the profile names the mechanism). Client error reports
  carry no PII.

## Result type (TypeScript example)

```ts
/** Closed set of error codes shared by every entry point. */
export type ErrorCode =
  | 'INVALID_INPUT' | 'UNAUTHENTICATED' | 'FORBIDDEN' | 'NOT_FOUND'
  | 'CONFLICT' | 'RATE_LIMITED' | 'REAUTH_REQUIRED' | 'INTERNAL';

/** Result returned by UI mutation handlers and RPC methods. */
export type ActionResult<T> =
  | {ok: true; data: T}
  | {ok: false; error: {code: ErrorCode; message: string; requestId: string;
      fieldErrors?: Record<string, string[]>}};
```

## Logging example

```ts
logger.warn({
  event: 'authz.denied',
  message: 'Project edit denied',
  userId: user.id,
  projectId: project.id,
  requestId,
});
```
