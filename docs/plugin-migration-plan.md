# Plan: turn the harness into a Claude Code plugin

> Status: **Phases 1–4 complete** (2026-07-02). Plugin is the single source of truth; the old
> `~/.claude/commands` copies, the harness-local `.claude/commands/scaffold.md`, and the entire
> `global-config/` backup folder have been deleted. Commands are now typed with the `harness:`
> prefix. **Remaining:** Phase 3 still needs a real test *inside the Linux container*, and Phase 5
> (scaffold-inheritance rethink) is deliberately held as a separate task.

## The end goal (what changes day-to-day)

Setting up or updating the harness on **any** machine becomes:

```
/plugin marketplace add Chadleewalker/Harness     (once per machine)
/plugin install harness@harness                    (once per machine)
/plugin update  harness@harness                    (to pull later changes)
```

No more hand-copying files into `C:\Users\...\.claude\`, no more "live vs backup" drift, and
Windows + the Linux container get the identical setup from the same GitHub repo.

## Repo layout

The existing `Chadleewalker/Harness` repo becomes **both** the marketplace and the plugin:

```
Harness/
├── .claude-plugin/
│   └── marketplace.json             ← the "store" listing (one entry: harness)
├── plugins/
│   └── harness/
│       ├── .claude-plugin/
│       │   └── plugin.json          ← the plugin's ID card
│       ├── commands/                ← skills: commit, run, review, deploy,
│       │                              issues, harness-check, scaffold
│       └── hooks/
│           └── hooks.json           ← safety hook (added only when wanted)
├── templates/                       ← STAYS as plain files (see caveats)
├── CLAUDE.md                        ← stays (master rules)
└── known-issues.md                  ← stays
```

The `global-config\` backup folder is retired at Phase 4 — the plugin replaces the
"backup + copy by hand" process.

## What moves in, what stays out

| Piece | Where | Why |
|---|---|---|
| `/run /review /deploy /issues /commit /harness-check` | plugin | what plugins are for |
| `/scaffold` | plugin | it's just a skill |
| Safety hook | plugin `hooks/hooks.json` | travels with the plugin; on when enabled |
| **Permission allow-list** (PowerShell/Bash rules) | **stays in `settings.json`** | plugins are **not allowed** to ship permission rules |
| `templates\` | **stays as plain files** | plugins don't generate projects; `/scaffold` reads them |

## Three consequences of how plugins work

1. **Command names get a prefix.** `/commit` -> `/harness:commit`, etc. Unavoidable by design.
2. **Permission rules can't live in the plugin.** They stay in a small per-machine `settings.json`.
3. **`/scaffold` inheritance needs a rethink.** New projects today point at an absolute path
   (`C:\Code\New Project Start\Harness\CLAUDE.md`) that won't exist on another machine. In
   plugin-world, new projects should install the harness plugin too, or `/scaffold` copies the
   rules straight in. This also fixes the hard-coded-path problem (review item #5).

## Phases (each safe and reversible)

- **Phase 1 — build alongside the old setup (additive; nothing removed).** ✅ Added `marketplace.json`,
  `plugin.json`, copied commands into `plugins/harness/commands/`.
- **Phase 2 — test on Windows.** ✅ Installed and enabled (`harness@harness`); commands run.
- **Phase 3 — test in the Linux container.** ⬜ Still to do: install the plugin *inside* the
  container and confirm the Bash side. Needs `launch-project.bat` → container → `/plugin` commands.
- **Phase 4 — adopt.** ✅ Deleted the `~/.claude/commands\` copies, the harness-local
  `.claude/commands/scaffold.md`, and `global-config\`. Updated `CLAUDE.md` and `harness-check` to
  describe the plugin. (Safety hook was PowerShell-only + off; left in git history — see note below.)
- **Phase 5 — `/scaffold` inheritance rethink** (point 3), on its own. ⬜ Not started.

### Follow-up parked during Phase 4
The old `global-config/hooks/safety-check.ps1` (blocks `git push --force`, `rm -rf /`, etc.) was
PowerShell-only — it could never run in the Linux container — and was switched off. It was deleted
with `global-config/` but remains in git history. To revive it properly: port it to a cross-platform
`node` hook at `plugins/harness/hooks/safety-check.js`, wire it via `plugins/harness/hooks/hooks.json`
(`PreToolUse`, referenced with `${CLAUDE_PLUGIN_ROOT}`), so it travels with the plugin and works in
both environments.

## Safety / rollback

Phases 1-3 add files only and change nothing live. `/plugin disable harness` instantly reverts to
current behavior; old files remain until Phase 4.

## Effort

~A focused afternoon for Phases 1-4; Phase 5 separate. Main trade-off: the `harness:` command prefix.

## Reference (confirmed against current Claude Code docs)

- Plugin manifest: `plugins/<name>/.claude-plugin/plugin.json` (required field: `name`).
- Marketplace manifest: `.claude-plugin/marketplace.json` (required: `name`, `owner.name`, `plugins[]`;
  each plugin needs `name` + `source`). One repo can be both.
- Commands live in the plugin's `commands/` (flat `.md`) or `skills/<name>/SKILL.md`.
- Hooks live in `hooks/hooks.json`; reference bundled files via `${CLAUDE_PLUGIN_ROOT}`.
- Install/update: `/plugin marketplace add owner/repo`, `/plugin install name@marketplace`,
  `/plugin update name@marketplace`, `/plugin enable|disable name@marketplace`.
- Private repos work with existing git credentials; background auto-update needs `GITHUB_TOKEN`.
- Plugins **cannot** declare permissions; namespacing (`name:command`) is required.
- Avoid absolute machine-specific paths inside the plugin; use `${CLAUDE_PLUGIN_ROOT}` /
  `${CLAUDE_PROJECT_DIR}`.

Docs: plugins-reference, plugin-marketplaces, discover-plugins, permissions (code.claude.com/docs).
