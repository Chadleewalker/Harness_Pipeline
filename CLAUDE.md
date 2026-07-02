# Universal AI Harness

This repository is the master configuration for all projects. It defines how Claude should behave, what tools are available, and how new projects get created. Every project created with `/scaffold` inherits these rules.

## About the User
- Not a programmer — always explain things in plain, everyday language
- Claude makes all technical decisions (language, framework, tooling) — never ask the user to choose
- When you do make a technical choice, say what you picked and why in one sentence, then move on

## At the Start of Every Session
1. Check `C:\Code\New Project Start\Harness\known-issues.md` for any open issues
2. If open issues exist, mention them briefly so the user knows what to watch for
3. Check memory for current project status and resume where things left off

## How Claude Should Behave

### Making Decisions
- Pick the right tool for the job — don't ask the user to choose a language or framework
- Prefer simple, proven, well-documented solutions over new or experimental ones
- When something can be done multiple ways, pick the one that's easiest to understand and maintain

### Communication
- Plain English only — spell out any technical terms you use
- Keep responses short by default; go deeper only when the user asks
- When something fails, say what went wrong in plain terms and what you're going to try next
- Never leave the user in silence while doing multi-step work — give short progress updates

### Safety — Always Confirm Before
- Pushing code to a remote repository
- Deleting files or folders
- Installing software or packages
- Any action that can't be easily undone

## Available Skills
These ship inside the **harness plugin** and are typed with a `harness:` prefix (e.g. `/harness:run`).
They work in any project on a machine where the plugin is installed and enabled.

| Skill | What it does |
|---|---|
| `/harness:scaffold` | Creates a new project from scratch |
| `/harness:run` | Starts the current project |
| `/harness:review` | Reviews code and explains findings in plain English |
| `/harness:deploy` | Deploys the current project |
| `/harness:issues` | Logs or shows recurring setup problems |
| `/harness:commit` | Commits all changes and pushes to GitHub |
| `/harness:harness-check` | Health-checks the harness wiring and reports problems in plain English |

The skills live in `plugins\harness\commands\` in this repo — that's the single source of truth.
Install or update the plugin on any machine with:
- `/plugin marketplace add Chadleewalker/Harness`  (once per machine)
- `/plugin install harness@harness`                (once per machine)
- `/plugin update harness@harness`                 (to pull later changes)

## Project Structure
```
C:\Code\New Project Start\Harness\
├── CLAUDE.md                          ← This file (master rules)
├── .claude\
│   └── settings.json                  ← Per-machine permission allow-list (plugins can't ship permissions)
├── .claude-plugin\
│   └── marketplace.json               ← Marketplace listing (this repo is its own "store")
├── plugins\harness\
│   ├── .claude-plugin\plugin.json     ← The plugin's ID card
│   └── commands\                      ← The skills — single source of truth
├── templates\                         ← Project templates used by /harness:scaffold
└── known-issues.md                    ← Running log of setup problems
```

The skills travel inside the plugin, so there's no separate backup folder to keep in sync — pull
changes on any machine with `/plugin update harness@harness`. The one thing a plugin **cannot**
carry is the permission allow-list; that stays in `.claude\settings.json` here (and in a small
per-machine `settings.json` on any other computer).

## When Creating a New Project with /scaffold
- The new project gets its own `CLAUDE.md` that references this master
- Claude picks the language and framework based on what the user wants to build
- The project is self-contained — it can be opened independently and Claude will still know the rules
- Memories about a new project go in THAT project's own memory folder, never in the Harness memory.
  The Harness memory is only for how the harness itself behaves (user profile, harness plan,
  feedback on how Claude should work). See the `/scaffold` skill's "Where Project Memories Go".

## Where This Runs (Two Environments)
Every project — this harness included — runs in one of two places. Something that works in one can
quietly break in the other, so anything Claude builds must work in BOTH unless the user says otherwise.

**1. Windows PC (local)**
- Paths look like `C:\Code\...` — backslashes and a drive letter.
- PowerShell is available.
- Commands: `python`, `npx.cmd`, `node`.
- The Harness folder (`C:\Code\New Project Start\Harness`) is present and reachable.

**2. Docker sandbox** (the container `launch-project.bat` starts, opened as code-server in the browser)
- Linux. The project is mounted at `/workspace` — and ONLY that one project folder. Nothing outside
  it exists inside the container, including the Harness folder itself.
- PowerShell is NOT installed.
- Commands: `python3` (not `python`), `npx` (not `npx.cmd`), `node`.
- Paths use forward slashes; there is no `C:\` drive.

**Rules that keep things working in both**
- Never assume a `C:\...` path exists inside the container. Anything that must run in the sandbox
  uses relative paths or `/workspace`, never a hardcoded Windows path.
- Never rely on PowerShell for something that must run in both — use `node` (present in both).
- `python` on Windows vs `python3` in the sandbox: try both, don't hardcode one.
- Keep each project self-contained. A project may be opened alone inside the container with no access
  to the Harness, so it cannot count on the master rules loading there — see the note below.
- For hook-specific guidance, see "Cross-Platform Hooks" just below.

**Note on the master-rules import.** Every scaffolded `CLAUDE.md` has a line like
`@C:\Code\New Project Start\Harness\CLAUDE.md`. That loads these master rules on Windows, but that
path does not exist inside the container, so the import silently does nothing there. That's why the
essential environment facts are ALSO embedded directly in each project's `CLAUDE.md` — so a project
opened alone in the sandbox still understands where it runs.

## Cross-Platform Hooks (important)
Projects run in two places: directly on Windows, and inside the Linux Docker sandbox that
`launch-project.bat` starts. Any hook command in a `.claude\settings.json` must work in BOTH.
- Run hooks with **`node`** — e.g. `node "${CLAUDE_PROJECT_DIR}/.claude/hooks/format.js"`. `node`
  is the same command on Windows and in the sandbox, so there's no per-machine setup to remember.
- Do **not** use `powershell` (it isn't installed in the Linux sandbox) or a bare `python3`
  (it isn't on Windows — that name only hits the Microsoft Store stub).
- Write hooks to **fail safe**: if a tool isn't installed, exit 0 quietly instead of erroring, so
  a missing formatter never interrupts the session.
- Use forward slashes in hook paths — they work on both systems.
