@AGENTS.md

## Claude Code specifics

Everything in AGENTS.md applies. These notes cover only what is specific to
Claude Code.

- **Stack interview.** When the stack gate applies, run the rounds in
  `docs/standards/stack-selection.md` with `AskUserQuestion` (up to 4 questions
  per call, 2–4 options each; the user can always type their own answer). Ask
  round 1 in plain text if the answers are open-ended. Never answer the
  questions yourself.
- **Keep this file as the only import.** Claude Code loads `@path` imports at
  launch, recursively. Do not add `@` imports here or inside AGENTS.md: they
  would pull every standard into context and defeat the on-demand design.
  Refer to docs with code-span paths (for example `docs/standards/testing.md`),
  which are not treated as imports.
- **Path-scoped rules.** Files in `.claude/rules/` with a `paths:` frontmatter
  load automatically only when you work on matching files. The universal ones
  ship with the template; stack-specific ones are copied from the chosen
  profile's `agent-rules/claude/` folder. Keep them in sync with
  `.agents/rules/`.
- **Plan first** for changes that touch auth, access policies, the data model,
  deployment config, or more than three files.
- **Delegate broad searches** to a subagent so search output stays out of the
  main context. Give it the relevant routing-table row.
- **Between unrelated tasks**, clear the conversation and rely on
  `docs/project/status.md` for continuity. Use `/context` if the session feels
  bloated.
- **Personal notes** (local paths, machine quirks) go in `CLAUDE.local.md`.
  Add it to `.gitignore`.
- **Guardrails.** Consider deny rules in `.claude/settings.json` for deploy
  commands and pushes to `staging`/`production`, so the non-negotiables are
  enforced by the tool and not just by instructions.
