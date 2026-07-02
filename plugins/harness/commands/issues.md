---
description: Log or show recurring setup problems.
---
Track recurring setup problems so Claude can avoid them in future sessions.

Issues are stored in `C:\Code\New Project Start\Harness\known-issues.md`.

## Usage
- `/harness:issues` — Show all open issues
- `/harness:issues add <description>` — Log a new problem
- `/harness:issues resolve <number>` — Mark a problem as fixed

## How to handle this command

The issues file uses this format:
```
# Known Issues

- [ ] 1. [2026-01-15] Description of the problem and any workaround found
- [x] 2. [2026-01-10] A resolved issue
```

**Show issues (`/harness:issues`):**
Read the file and list all open items (those with `[ ]`) in a numbered, plain-English list. If there are none, say so. If the file doesn't exist, say there are no known issues yet.

**Add an issue (`/harness:issues add ...`):**
If the file doesn't exist, create it with the header `# Known Issues`. Append a new line with today's date, an auto-incremented number, and the description. Confirm what was added.

**Resolve an issue (`/harness:issues resolve <number>`):**
Find the matching numbered entry and change `[ ]` to `[x]`. Confirm what was resolved.

After any write action, briefly confirm what changed in plain language.
