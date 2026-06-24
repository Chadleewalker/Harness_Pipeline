# Global Config Backup

This folder is a **backup copy** of the global Claude Code configuration that lives in
`C:\Users\chadw\.claude\`. The live files there are what Claude Code actually uses — this
copy exists so the harness repository contains everything needed to rebuild the setup on a
new or reinstalled computer.

## What's backed up

| File here | Live location | What it does |
|---|---|---|
| `settings.json` | `C:\Users\chadw\.claude\settings.json` | Permissions, the safety hook, and the session-start known-issues check |
| `hooks\safety-check.ps1` | `C:\Users\chadw\.claude\hooks\safety-check.ps1` | Blocks dangerous commands before they run |
| `commands\*.md` | `C:\Users\chadw\.claude\commands\` | The global skills: /run, /review, /deploy, /issues, /commit, /harness-check |

## To restore on a new machine

Copy each file back to its live location (create the folders if needed). That's it.

## Keep it in sync

Whenever a file in `C:\Users\chadw\.claude\` changes, update the copy here and commit.
Claude should do this automatically when it edits any of those files.
