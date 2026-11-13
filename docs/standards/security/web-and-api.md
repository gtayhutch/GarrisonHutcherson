---
id: standards/security/web-and-api
version: 2.0.0
load_when: Setting HTTP headers or cookies, CSP, CORS, redirects, third-party scripts; writing UI mutation handlers, HTTP routes, RPC methods, webhooks, or HTTP functions.
---

# Web frontend and API security

ASVS 5.0 chapters V3 (Web Frontend Security), V4 (API and Web Service), and the
request-handling parts of V15. Requirement text is paraphrased.

## Rules

### Security headers

Set in one place (framework config for static values; request middleware for
a per-request CSP nonce; the profile names the files) and covered by an
automated test.

- **SEC-WEB-01 HSTS** on every response:
  `Strict-Transport-Security: max-age=31536000; includeSubDomains`. Add
  `preload` and submit the domain to the preload list at L3.
  `[ASVS 3.4.1 · L1, 3.7.4 · L3]`
- **SEC-WEB-02 Content Security Policy** with a per-request nonce:
  `script-src 'nonce-…' 'strict-dynamic'; object-src 'none'; base-uri 'none';
  frame-ancestors 'none'`. Every allowed third-party origin is listed in
  `security-decisions.md`. Report violations at L3.
  `[ASVS 3.4.3, 3.4.6 · L2, 3.4.7 · L3]`
- **SEC-WEB-03** `X-Content-Type-Options: nosniff` on every response, and a
  `Content-Type` with charset that matches the body.
  `[ASVS 3.4.4 · L2, 4.1.1 · L1]`
- **SEC-WEB-04** `Referrer-Policy: strict-origin-when-cross-origin` or
  stricter. `[ASVS 3.4.5 · L2]`
- **SEC-WEB-05 Cross-Origin-Opener-Policy** `same-origin` on documents at L3.
  Popup-based OAuth sign-in may need `same-origin-allow-popups` (or use the
  redirect flow). `[ASVS 3.4.8 · L3]`
- **SEC-WEB-06** `Permissions-Policy` disables features the app does not use
  (camera, microphone, geolocation, …). *(house)*

### Cookies

- **SEC-WEB-07 Session cookies** are `Secure; HttpOnly; SameSite=Lax` (or
  `Strict`), `Path=/`, with no `Domain`, and named with the `__Host-` prefix
  (`__Host-session`). If the hosting platform forces a different cookie name,
  record it in `overrides.md` (the profile says when this applies). Keep
  cookies under 4 KB.
  `[ASVS 3.3.1 · L1, 3.3.2, 3.3.3, 3.3.4 · L2, 3.3.5 · L3]`

### Cross-origin and CSRF

- **SEC-WEB-08 Unsafe methods for state changes.** Anything that changes state
  uses POST, PUT, PATCH, or DELETE — never GET. `[ASVS 3.5.3 · L1]`
- **SEC-WEB-09 CSRF.** Keep the framework's built-in CSRF protection on (for
  example origin checks on server mutations, or CSRF tokens) and its allowed
  origins minimal. Any other cookie-authenticated endpoint MUST verify `Origin`
  (or a CSRF token) for unsafe methods. `[ASVS 3.5.1, 3.5.2 · L1]`
- **SEC-WEB-10 CORS.** `Access-Control-Allow-Origin` is a fixed value or
  checked against an allowlist; never `*` with credentials. Serverless HTTP
  functions set explicit allowed origins. `[ASVS 3.4.2 · L1]`
- **SEC-WEB-11 Separate origins.** User-uploaded content and any admin app are
  served from hostnames separate from the main app where feasible.
  `[ASVS 3.5.4 · L2]`
- **SEC-WEB-12 `postMessage`** handlers check `event.origin` against an
  allowlist and validate the message with a schema. `[ASVS 3.5.5 · L2]`
- **SEC-WEB-13 No JSONP; no secrets in script responses.**
  `[ASVS 3.5.6, 3.5.7 · L3]`

### Navigation and third parties

- **SEC-WEB-14 Redirects** go only to relative paths or allowlisted hosts.
  Validate `returnTo`/`next` parameters. `[ASVS 3.7.2 · L2]`
- **SEC-WEB-15 Third-party scripts** are minimized, listed in
  `security-decisions.md`, and loaded through the framework's script loader
  under the CSP.
  Versioned static assets from a CDN use Subresource Integrity at L3.
  `[ASVS 3.6.1 · L3, 14.2.3 · L2]`
- **SEC-WEB-16 Supported browser features only.** No deprecated plugin
  technologies. `[ASVS 3.7.1 · L2]`

### APIs: mutation handlers, routes, RPC methods, functions

- **SEC-API-01 Same pipeline everywhere.** Every entry point follows ARCH-04:
  parse → authenticate → authorize → execute → map result.
- **SEC-API-02 Return only what the caller may see.** Map domain objects to
  response DTOs; never return a whole database record by default.
  `[ASVS 15.3.1 · L1]`
- **SEC-API-03 Don't trust client-settable headers** for security decisions.
  Use the client IP only from the platform's trusted header.
  `[ASVS 4.1.3, 15.3.4 · L2]`
- **SEC-API-04 One source per parameter.** Read each parameter from one
  explicit place (body, path, or query), not "whichever is present".
  `[ASVS 15.3.7 · L2]`
- **SEC-API-05 Strict types.** Validate types before comparison; no loose
  equality; guard against prototype pollution by validating object keys and
  using `Map` for user-keyed data. `[ASVS 15.3.5, 15.3.6 · L2]`
- **SEC-API-06 Webhooks** verify the provider's signature over the raw body
  and reject stale timestamps before parsing. *(house)*
- **SEC-API-07 Outbound calls** do not follow redirects unless intended, and
  headers/URLs built for them are validated. `[ASVS 15.3.2 · L2, 4.2.5 · L3]`
- **SEC-API-08 Only the methods you implement** are accepted (routers register
  only implemented methods; others return 405). `[ASVS 4.1.4 · L3]`
- **SEC-API-09 Realtime and GraphQL.** Custom WebSockets use `wss://` and check
  `Origin`. If GraphQL is ever added, enforce depth/cost limits and disable
  introspection in production. `[ASVS 4.4.1 · L1, 4.4.2, 4.3.1, 4.3.2 · L2]`

## Header baseline

| Header | Value | Rule |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | SEC-WEB-01 |
| `Content-Security-Policy` | Nonce-based; `object-src 'none'; base-uri 'none'; frame-ancestors 'none'` | SEC-WEB-02 |
| `X-Content-Type-Options` | `nosniff` | SEC-WEB-03 |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | SEC-WEB-04 |
| `Cross-Origin-Opener-Policy` | `same-origin` (L3) | SEC-WEB-05 |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` (adjust) | SEC-WEB-06 |

Request middleware is a convenience layer, never an authorization boundary. A
2025 Next.js vulnerability (CVE-2025-29927) let attackers skip middleware
entirely; any framework can have a similar flaw. Authorization lives in the
data access layer and in every entry point (SEC-AZ-01).
