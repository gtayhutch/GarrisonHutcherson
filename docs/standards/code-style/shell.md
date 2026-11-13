---
id: standards/code-style/shell
version: 2.0.0
load_when: Editing .sh files, CI scripts, or shell snippets in task-runner files or workflows.
---

# Shell (Bash)

Source: [Google Shell Style Guide](https://google.github.io/styleguide/shellguide.html).
Rules marked *(house)* are ours.

## Rules

- **SH-01 Bash only,** started with `#!/bin/bash` (or `#!/usr/bin/env bash`).
  Executables have no extension or `.sh`; libraries end in `.sh` and are not
  executable.
- **SH-02 Small scripts only.** Shell is for small utilities and glue. A script
  that grows past ~100 lines or needs non-trivial data structures is rewritten
  in one of the project's main languages.
- **SH-03 Lint and format.** ShellCheck must pass; `shfmt -i 2 -ci` formats.
  2-space indentation, 80-column lines.
- **SH-04 Fail fast.** Start scripts with `set -euo pipefail`. *(house)*
- **SH-05 Quote everything.** `"${var}"`, `"$@"`. Use arrays for lists of
  arguments.
- **SH-06 Modern syntax.** `$(command)`, never backticks. `[[ … ]]` over
  `[ … ]` and `test`. `(( … ))` for arithmetic. No `eval`.
- **SH-07 Errors to stderr.** Error messages go to `>&2`. Check return values
  of commands that can fail and exit non-zero with a message.
- **SH-08 Names.** Functions and variables `lower_snake_case`; constants and
  exported environment variables `UPPER_SNAKE_CASE`, declared `readonly` /
  `export` at the top.
- **SH-09 Functions.** Variables inside functions are declared `local`. Put all
  functions near the top; scripts with more than one function end with
  `main "$@"`.
- **SH-10 Comments.** File header describing the script. Every non-trivial
  function has a header listing `Globals`, `Arguments`, `Outputs`, `Returns`.
- **SH-11 Safety.** Never pipe remote content to a shell. Never echo secrets.
  Use `mktemp` for temp files and clean them up with `trap`. *(house)*

## Example

```bash
#!/bin/bash
#
# Exports the database of the given environment to a timestamped backup.

set -euo pipefail

readonly ALLOWED_ENVIRONMENTS=("staging" "production")

#######################################
# Prints an error and exits.
# Arguments:
#   Message to print.
# Outputs:
#   Writes the message to stderr.
#######################################
die() {
  echo "error: $*" >&2
  exit 1
}

main() {
  local target_env="${1:-}"
  [[ " ${ALLOWED_ENVIRONMENTS[*]} " == *" ${target_env} "* ]] || die "unknown environment '${target_env}'"
  ./scripts/export_database.sh "${target_env}" "backup-$(date -u +%Y%m%dT%H%M%SZ)"
}

main "$@"
```
