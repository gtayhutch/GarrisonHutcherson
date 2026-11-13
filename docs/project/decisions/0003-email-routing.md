# 0003. Public contact email through Cloudflare Email Routing

- **Status:** Accepted
- **Date:** 2026-11-13
- **Deciders:** Garrison Hutcherson
- **Rules affected:** SEL-10, SEC-DATA (personal data on a public site)

## Context

The site needs a way to be contacted. The owner's résumé lists a personal
email address, a phone number, and a street address. Publishing any of those
on a public site (and in a public repository) invites scraping, spam, and
unwanted contact. The domain is already on Cloudflare DNS.

## Options considered

1. **Cloudflare Email Routing address** (`garrison@garrisonhutcherson.com`):
   free, on the domain already managed in Cloudflare, and forwards to the
   owner's inbox. Pros: the personal address stays private and can change
   without touching the site. Cons: one more Cloudflare service to configure
   (MX and SPF records); replies come from the personal address unless the
   owner sets up "send as".
2. **Publish the personal Outlook address**: nothing to set up. Cons:
   permanently scraped and spammed; ties the site to one inbox.
3. **No email, LinkedIn only**: no spam. Cons: an extra hop for recruiters,
   and no LinkedIn URL has been provided yet.

## Decision

Publish only `garrison@garrisonhutcherson.com`, forwarded by Cloudflare
Email Routing to the owner's inbox. The address lives in `CONTACT` in
`src/lib/config.ts`. Phone numbers and street addresses are never published,
and an e2e test fails if any page has a `tel:` link or a `mailto:` other
than this address.

## Consequences

- 👤 The owner enables Email Routing for the zone, verifies the destination
  inbox, and creates the `garrison@` rule (Cloudflare adds the MX and SPF
  records). Until then, mail to the address bounces.
- Email Routing is added to the stack's third-party services and to
  `security-decisions.md` (§9, §14).
- No contact form: the site still accepts no visitor input.
