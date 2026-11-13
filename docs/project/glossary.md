---
id: project/glossary
version: 0.2.0
load_when: A domain term in a task, ticket, or the code is unclear; naming new types, collections, or functions.
---

# Glossary

Domain terms, as used in the product, the code, and the docs. Code identifiers
use these exact words (DOC-07). If two terms mean the same thing, pick one and
list the other as "not".

| Term | Meaning | In code | Not to be confused with |
| --- | --- | --- | --- |
| {{Workspace}} | {{A team's shared space; the tenant boundary}} | {{`Workspace`, `workspaces/{workspaceId}`}} | {{"Organization", "Team" — not used}} |
| {{Member}} | {{A user who belongs to a workspace}} | {{`Member`, `members` table}} | {{User (the account itself)}} |
