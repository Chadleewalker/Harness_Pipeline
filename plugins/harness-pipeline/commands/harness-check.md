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
  (`@.../Harness_Pipeline/CLAUDE.md`); otherwise look for a folder named `Harness_Pipeline`
  containing `.claude-plugin/marketplace.json`. If you can't find it, say so and skip the
  checks that need it.

Then run these checks and report each as ✅ (good), ⚠️ (worth fixing), or ❌ (broken), each with
a one-line plain-English explanation and, if not ✅, the suggested fix.

1. **Username/path sanity.** Scan the harness repo's config files for any `C:\Users\<name>` that
   is NOT the current user's name. A mismatch means paths point at a folder that doesn't exist.
2. **Master rules reachable.** Confirm the harness `CLAUDE.md` exists at the **Harness folder**
   path recorded in `machine.local.md` — that is what `/harness-pipeline:scaffold` stamps into a
   new project's `@`-import line. If it's wrong, scaffolded projects won't inherit the rules.
   In the *templates* that line is the literal placeholder `@{{HARNESS_PATH}}\CLAUDE.md`, which is
   correct and must not be "fixed" to a real path — a real one would be wrong on every other
   machine and would leak this one's layout into a published repo. Flag it as ❌ only if a
   template has a concrete path baked in. In an already-scaffolded *project*, the same line
   should be a real path; check that it resolves.
3. **Plugin installed & enabled.** Confirm the harness plugin is live: `<home>/.claude/plugins/installed_plugins.json`
   lists `harness-pipeline@harness-pipeline`, and `<home>/.claude/settings.json` has it under `enabledPlugins`. Then
   confirm the nine command files exist in the repo's `plugins/harness-pipeline/commands/` (commit, design,
   deploy, issues, review, run, harness-check, scaffold, pipeline-onboard). Remember: these are typed
   with the `harness-pipeline:` prefix (e.g. `/harness-pipeline:run`). List anything missing.
4. **Exactly one source per command.** Count where each command could come from, and report ⚠️ if
   any name has more than one live source. Look in all three places: `<home>/.claude/commands/`
   (loose files, which take the *unprefixed* name), every entry in `enabledPlugins` set to `true`,
   and the current project's `.claude/commands/`. This exists because it has already gone wrong:
   in July 2026 `/commit` existed three times — a June file in `<home>/.claude/commands`, the
   retired `harness@harness` plugin, and `harness-pipeline` — with nothing to warn about it, and
   the oldest copy was the unprefixed one, so it was the easiest to invoke by accident.
   `harness@harness` is retired: if it is present and `true`, that itself is the finding.
5. **Publication hygiene.** Run `node scripts/check-sanitize.js` in the harness repo and report
   what it says. It checks that no tracked file names a real absolute path, network share, email
   address or denylisted private name — the boundary that lets this repo be published while being
   used on private work. Its `NOTE` about a missing `.sanitize-denylist` is fine on a machine that
   has never held private work; on one that has, it means the name checks are silently off, which
   is worth a ⚠️ and a pointer to `.sanitize-denylist.example`. This is the one check that reads a
   script's exit code rather than judging by eye — quote its output rather than summarizing it.
6. **Permissions present.** Plugins can't ship permission rules, so they live in a per-machine
   `settings.json`. Confirm the harness `.claude/settings.json` (and/or `<home>/.claude/settings.json`)
   still has a permission allow-list. If it's empty, routine commands will prompt every time.
7. **Safety hook status.** Report whether a PreToolUse safety hook is configured (in the live
   `<home>/.claude/settings.json` or the plugin's `hooks/hooks.json`) and whether the hook file it
   names actually exists. If absent, note it's currently not active (don't treat as an error unless
   the user wants it on).
8. **Current project wiring.** If the working folder has a `.claude/settings.json`, check that any
   permission rules use a matcher for a shell that exists here (PowerShell on Windows, Bash in the
   Linux container) — flag rules that can never match (e.g. `Bash(New-Item ...)`).
9. **Machine profile complete.** Confirm `machine.local.md` exists in the harness repo and carries
   a **Harness folder** entry — `/harness-pipeline:scaffold` reads it to fill the `{{HARNESS_PATH}}`
   placeholder, and without it a scaffolded project gets no working master-rules import. On a
   machine that uses yolo_docker, also check for the `yolo_docker folder`, `share git root` and
   `share UNC root` entries: the shared docs refer to those as angle-bracket slots on purpose, so
   a missing entry means the instructions have a hole rather than a wrong value.

## Rules
- Never change anything during the check — looking only.
- Plain English, no jargon. End with a one-line overall verdict: All good / A few things to tidy /
  Needs attention.
- If a check can't run (e.g. harness repo not found), say why and move on — don't guess.
