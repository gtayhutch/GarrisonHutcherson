---
id: stacks
version: 2.0.0
load_when: During the stack interview (to see which profiles exist), when adopting a profile, or when creating a new one.
---

# Stack profiles

A stack profile explains *how* to meet the universal standards with one
specific technology stack: folder layout, commands, environment setup,
security configuration, testing tools, and deploy workflows. Standards say
*what*; profiles say *how*.

A project uses only the profile(s) named in `docs/project/stack.md`. Agents
never read other profiles.

## Catalog

| Profile | Stack | Status |
| --- | --- | --- |
| `nextjs-firebase/` | Next.js (App Router) · TypeScript · Firebase (Auth, Firestore, Storage, Cloud Functions, App Hosting) | Maintained |
| `astro-cloudflare/` | Astro (static) · TypeScript · Cloudflare Workers static assets | Draft (created in GarrisonHutcherson.com; to upstream to the template repo) |

A stack that isn't listed gets a new profile, created from
`_profile-template/` during the stack interview (SEL-09). Combinations are
fine: a project with a web app and a native mobile app can use two profiles,
one per deployable, and say so in `stack.md`.

## Profile contract

Every profile has these parts. Small profiles can keep them in one README;
larger ones split them into files.

| Part | Contents |
| --- | --- |
| `README.md` | Summary, when to choose it and when not to, components and version policy, folder layout, concept map (each universal concept → file or folder), commands for the CI-01 tasks, framework rules |
| Environments | How `test`, `staging`, and `production` map to the platform (ENV-01..11), config files, local environment setup, rollback |
| Security | How each security standard is configured or coded in this stack, including policy syntax and identity-provider settings |
| Hardening checklist | Console, IAM, attestation, backup, and budget settings for the platform |
| Data | Database-specific modeling rules and limits (DB-07) |
| Testing | Tools for each TEST-02 layer, policy-test setup, examples |
| CI and deploy | Concrete workflows for CI-01..10 |
| Setup | Steps that `docs/checklists/new-project-setup.md` delegates to the profile |
| `agent-rules/` | Path-scoped rules for this stack's file layout, in `claude/` (Claude Code `paths:` frontmatter) and `antigravity/` (`trigger: glob`) folders, copied into `.claude/rules/` and `.agents/rules/` on adoption |

## Rules for profiles

- **PRF-01 Add or tighten, never weaken.** A profile may add rules or make a
  standard stricter. Anything weaker is a project override, not a profile
  rule.
- **PRF-02 Own ID prefix.** Profile rules use the profile's own prefix (for
  example `NXF-` for `nextjs-firebase`) so they never collide with universal
  IDs.
- **PRF-03 Same shape as standards.** Frontmatter, Rules first, ≤ 250 lines per
  file, references as code-span paths.
- **PRF-04 Versioned with the template.** Profile changes are made in the
  template repository and synced to projects like the standards.
- **PRF-05 Verified once before it's "Maintained".** A new profile is marked
  *Draft* in the catalog until one project has used it through a production
  release.
