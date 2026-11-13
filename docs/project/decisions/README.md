---
id: project/decisions
version: 0.2.0
load_when: Making a decision with real alternatives, or needing to know why something is the way it is.
---

# Architecture Decision Records

An ADR records one decision: its context, the options weighed, what was chosen,
and the consequences. Write one whenever ARCH-11 or PAT-07 applies, or when a
future reader would otherwise ask "why is it like this?".

## How to write one

1. Copy `0000-adr-template.md` to `NNNN-short-title.md` (next number, kebab-case).
2. Fill it in; keep it under a page.
3. Add it to the index below in the same PR.
4. Accepted ADRs are not edited (except typos and status). To change a
   decision, write a new ADR that supersedes the old one, and set the old one's
   status to "Superseded by NNNN".

Incident notes (OBS-13) also live here, titled `NNNN-incident-short-title.md`.

## Index

| # | Title | Status | Date |
| --- | --- | --- | --- |
| 0001 | Adopt engineering standards v2.0.0 | Accepted | 2026-11-12 |
| 0002 | Stack selection: Astro + TypeScript on Cloudflare Workers static assets | Accepted | 2026-11-12 |
