---
description: Health-check the harness wiring and report any problems in plain English.
---
Check that the harness is wired up correctly and report any problems in plain English.

This is a read-only health check. It changes nothing — it only looks and reports. Run it
anytime you suspect the harness isn't behaving, or after setting up a new machine/container.
(Named `harness-check` on purpose — Claude Code already has a built-in `/doctor` for the app
itself; this one checks YOUR harness.)

## How to run it

Work out the environment first, because paths differ:
- Find the current user's home folder (`$env:USERPROFILE` on Windows, `$HOME` on Linux/Docker).
  The live global config lives at `<home>/.claude/`.
- Find the harness repo. Prefer the path in the current project's `CLAUDE.md` import line
  (`@.../Harness/CLAUDE.md`); otherwise look for a folder named `Harness` containing
  `.claude-plugin/marketplace.json`. If you can't find it, say so and skip the checks that need it.

Then run these checks and report each as ✅ (good), ⚠️ (worth fixing), or ❌ (broken), each with
a one-line plain-English explanation and, if not ✅, the suggested fix.

1. **Username/path sanity.** Scan the harness repo's config files for any `C:\Users\<name>` that
   is NOT the current user's name. A mismatch means paths point at a folder that doesn't exist.
2. **Master rules reachable.** Confirm the harness `CLAUDE.md` exists at the path the templates'
   `@import` line points to. If it's missing, scaffolded projects won't inherit the rules.
3. **Plugin installed & enabled.** Confirm the harness plugin is live: `<home>/.claude/plugins/installed_plugins.json`
   lists `harness@harness`, and `<home>/.claude/settings.json` has it under `enabledPlugins`. Then
   confirm the seven command files exist in the repo's `plugins/harness/commands/` (commit, deploy,
   issues, review, run, harness-check, scaffold). Remember: these are typed with the `harness:` prefix
   (e.g. `/harness:run`). List anything missing.
4. **Permissions present.** Plugins can't ship permission rules, so they live in a per-machine
   `settings.json`. Confirm the harness `.claude/settings.json` (and/or `<home>/.claude/settings.json`)
   still has a permission allow-list. If it's empty, routine commands will prompt every time.
5. **Safety hook status.** Report whether a PreToolUse safety hook is configured (in the live
   `<home>/.claude/settings.json` or the plugin's `hooks/hooks.json`) and whether the hook file it
   names actually exists. If absent, note it's currently not active (don't treat as an error unless
   the user wants it on).
6. **Current project wiring.** If the working folder has a `.claude/settings.json`, check that any
   permission rules use a matcher for a shell that exists here (PowerShell on Windows, Bash in the
   Linux container) — flag rules that can never match (e.g. `Bash(New-Item ...)`).

## Rules
- Never change anything during the check — looking only.
- Plain English, no jargon. End with a one-line overall verdict: All good / A few things to tidy /
  Needs attention.
- If a check can't run (e.g. harness repo not found), say why and move on — don't guess.
