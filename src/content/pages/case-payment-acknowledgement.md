---
title: Payment failures and an acknowledgement endpoint
description: Log analysis isolated payment errors to a client acknowledgement endpoint.
---

**Problem:** A client contacted support because payments were failing.

**Investigation:** I reviewed the logs and identified the source of the errors
as the client's payment acknowledgement endpoint. I shared the finding with the
client and pointed them toward the endpoint configuration.

**Outcome:** The client identified a misconfiguration at the endpoint and was
able to resume payments quickly.
