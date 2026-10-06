---
description: Log or show recurring setup problems.
---
Track recurring setup problems so Claude can avoid them in future sessions.

Issues are stored in `known-issues.md` in the Harness folder — this machine's path for it is
the **Harness folder** entry in `machine.local.md`.

**Scope: this harness and Claude Code wiring.** Gotchas belonging to
the autonomous pipeline go in `docs/STATUS.md` in the `Multi-AgentPipelines` repo instead, which
is their only home — see the note at the top of `known-issues.md`. If the user reports a pipeline
gotcha here, say where it belongs rather than logging a second copy of it.

## Usage
- `/harness-pipeline:issues` — Show all open issues
- `/harness-pipeline:issues add <description>` — Log a new problem
- `/harness-pipeline:issues resolve <number>` — Mark a problem as fixed

## How to handle this command

The issues file uses this format:
```
# Known Issues

- [ ] 1. [2026-01-15] Description of the problem and any workaround found
- [x] 2. [2026-01-10] A resolved issue
```

**Show issues (`/harness-pipeline:issues`):**
Read the file and list all open items (those with `[ ]`) in a numbered, plain-English list. If there are none, say so. If the file doesn't exist, say there are no known issues yet.

**Add an issue (`/harness-pipeline:issues add ...`):**
If the file doesn't exist, create it with the header `# Known Issues`. Append a new line with today's date, an auto-incremented number, and the description. Confirm what was added.

**Resolve an issue (`/harness-pipeline:issues resolve <number>`):**
Find the matching numbered entry and change `[ ]` to `[x]`. Confirm what was resolved.

After any write action, briefly confirm what changed in plain language.
