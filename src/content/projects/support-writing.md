---
title: Support documentation and escalation writing
order: 3
summary: A customer knowledge-base article and internal triage runbook for a synthetic missing-notification scenario.
tags: [Knowledge Base, Runbook, Technical Writing]
---

**Knowledge-base article.** If a configured notification is missing, start with these checks.

1. Check the affected user's notification preferences and recipient address.
1. Check spam, quarantine, and any forwarding rules with your mail administrator.
1. If the email is still missing, send support the event time and time zone,
   the type of notification, and whether other users received it. Share personal
   details only through your normal support channel.

**Triage runbook.** Trace the notification from the triggering event to the receiving server.

1. Confirm the expected event, recipient configuration, and time window.
1. Find the event and outbound mail attempt using its correlation ID. If the
   event exists without an attempt, escalate with that evidence and the settings
   needed to reproduce it.
1. If the receiver accepted the message, share a sanitized timestamp and message
   identifier so the mail administrator can trace quarantine and routing. An
   acceptance response does not establish that the message reached the inbox.
1. If the receiver rejected the message, capture the response and distinguish
   a temporary deferral from a permanent rejection before retrying.
1. Confirm the next action with the customer. If a documentation step was
   misleading, record the correction in the knowledge base.

For a reproducible engineering handoff, see the
[webhook troubleshooting sample](/projects/#webhook-troubleshooting).
