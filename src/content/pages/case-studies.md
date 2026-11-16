---
title: Case Studies
description: How Garrison Hutcherson uses log analysis and clear communication to investigate support issues.
---

## Payment failures and an acknowledgement endpoint

**Problem:** A client contacted support because payments were failing.

**Investigation:** I reviewed the logs and identified the source of the errors
as the client's payment acknowledgement endpoint. I shared the finding with the
client and pointed them toward the endpoint configuration.

**Outcome:** The client identified a misconfiguration at the endpoint and was
able to resume payments quickly.

## Notifications missing for two users

**Problem:** Two users were not receiving email notifications configured in the
support system.

**Investigation:** I reviewed the logs and shared a copy with the client. The
logs showed that our system sent the emails and received a normal response code.

**Next step:** Those findings prompted the client to review their email server
configuration to resolve the issue.
