---
id: stacks/{{profile-id}}
version: 0.1.0
load_when: The project's stack.md names this profile and the task needs stack-specific details.
---

# Profile: {{Stack name}}

Status: Draft (PRF-05) · Rule prefix: `{{PFX}}-`

Copy this folder to `docs/stacks/<profile-id>/`, fill in every section, and
split sections into separate files if this one would pass 250 lines. Delete
these instructions when done.

## Summary

{{One paragraph: the components and what kind of product this stack suits.}}

**Choose it when:** {{…}}
**Avoid it when:** {{…}}

## Components and versions

| Component | Choice | Version policy |
| --- | --- | --- |
| Languages | {{…}} | Latest stable |
| Framework(s) | {{…}} | |
| Database | {{…}} | |
| Authentication | {{…}} | |
| Hosting | {{…}} | |
| Local `test` environment | {{emulators / containers}} | |

## Folder layout and concept map

| Universal concept | In this stack |
| --- | --- |
| Feature module and its public interface (ARCH-02) | {{…}} |
| Server-only boundary and how it's enforced (ARCH-03) | {{…}} |
| Entry points: UI mutations, HTTP routes, RPC, jobs (ARCH-04) | {{…}} |
| Repositories (ARCH-06) | {{…}} |
| Config module (ARCH-07) | {{…}} |
| Errors / logger modules (OBS-02, OBS-06) | {{…}} |
| Security headers (SEC-WEB-01..06) | {{…}} |
| Database access policies, if any (SEC-AZ-01) | {{…}} |
| Error boundaries (OBS-14) | {{…}} |

## Commands (CI-01)

| Task | Command |
| --- | --- |
| `format-check` / `lint` / `typecheck` | {{…}} |
| `test` / `test-policies` / `test-e2e` | {{…}} |
| `build` / `verify` | {{…}} |

## Framework rules

- **{{PFX}}-01** {{Rules specific to this framework, e.g. reserved file names
  that need TS-03 or TS-08 exceptions, rendering model, built-in CSRF.}}

## Environments

{{Mapping of test / staging / production to the platform; config files; local
environment; rollback steps. ENV-01..11.}}

## Security implementation

{{For each area — authentication and sessions, access control and policy syntax,
headers and cookies, secrets, client storage — how this stack meets the
standard. Include identity-provider settings and any platform constraint that
needs an override.}}

## Hardening checklist

{{Console, IAM, attestation, backups, budgets, audit logs.}}

## Data

{{Database-specific limits and modeling rules (DB-07), index and migration
files (DB-08).}}

## Testing

{{Tool per TEST-02 layer; how policy tests run locally; one example.}}

## CI and deploy

{{Workflow files; what deploys each artifact (CI-03); OIDC setup (CI-05);
deploy order (CI-04).}}

## Setup

{{Ordered steps that new-project-setup.md delegates to the profile.}}

## Agent rules

Create `agent-rules/claude/*.md` and `agent-rules/antigravity/*.md` with
path-scoped pointers for this stack's sensitive files: access policies, server
entry points, repositories, config and secrets, UI components.
