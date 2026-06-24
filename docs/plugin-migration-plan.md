# Plan: turn the harness into a Claude Code plugin

> Status: **Phase 1 in progress** (additive scaffolding added; old setup still live and unchanged).

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

- **Phase 1 — build alongside the old setup (additive; nothing removed).** Add `marketplace.json`,
  `plugin.json`, copy commands into `plugins/harness/commands/`.
- **Phase 2 — test on Windows.** `/plugin marketplace add ./`, install, confirm `/harness:harness-check`
  and the others run.
- **Phase 3 — test in the Linux container.** Same commands; confirm the Bash side.
- **Phase 4 — adopt.** Retire `~/.claude/commands\` copies and delete `global-config\`. Update
  `CLAUDE.md` to describe the plugin.
- **Phase 5 — `/scaffold` inheritance rethink** (point 3), on its own.

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
