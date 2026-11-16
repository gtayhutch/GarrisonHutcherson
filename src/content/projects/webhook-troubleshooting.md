---
title: Debugging rejected payment webhooks
order: 1
summary: A synthetic API investigation that separates authentication failure from rate limiting and turns the evidence into an engineering handoff.
tags: [API Troubleshooting, Webhooks, Engineering Escalations]
---

This is a fictional exercise with sample responses. It uses no live endpoints,
credentials, or customer records.

**Reproduce and isolate.** A simulated payment event reaches the receiver after a signing key rotation. The
receiver returns `401` with `signature_invalid`. A fresh event signed with the
active key receives `204`; the same body signed with the retired key receives
`401`. Keep the body bytes and timestamp fixed when comparing the signatures.
Record the correlation ID and response code, and keep signing keys out of logs.

```text
POST /webhooks/payment
X-Request-ID: sample-retry-001
{"event_id":"evt_demo_07","type":"payment.settled"}

HTTP/1.1 401 Unauthorized
{"error":"signature_invalid"}
```

If a separate attempt returns `429`, check `Retry-After` and back off before
retrying. A `401` after a key rotation calls for checking key selection and
signature validation first. Repeated delivery attempts will not fix a wrong key.

**Engineering handoff.** A queued retry created before the rotation still uses the retired
key after the receiver stops accepting it. Fresh events succeed. In this sample,
the affected payment status stays stale because the notification was rejected.

**Reproduction:** Queue a retry with key A. Rotate to key B and retire key A.
Release the retry, then send a fresh event. Compare the response codes and the
sender's key identifiers for the two attempts.

**Expected:** Retry signing follows the documented rotation policy. Test a
successful retry with the active key, a rejected retired-key signature, and a
duplicate delivery. A verified duplicate should acknowledge the existing event
without applying the payment update twice.
