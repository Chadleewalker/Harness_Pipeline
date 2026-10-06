# Universal AI Harness — Pipeline Edition

This repository (`Harness_Pipeline`, GitHub `Chadleewalker/Harness_Pipeline`) is a **separate
project from the original Harness** (a sibling folder on the same machine). It is the master
configuration for projects that work with the autonomous pipeline (`Multi-AgentPipelines`);
the original Harness stays as it was. Don't push commits between the two.

This repository is the master configuration for its projects. It defines how Claude should behave, what tools are available, and how new projects get created. Every project created with `/scaffold` inherits these rules.

## About the Users
This harness is a developer tool. It serves multiple people — senior software developers
as well as its original owner, who is not a programmer. Who is at THIS machine, and how
much explanation they want, lives in `machine.local.md` ("Who uses this machine"):

- **Explanation level** (from `machine.local.md`; default `plain` when unset):
  - `plain` — spell out everything in everyday language; no unexplained jargon
  - `mixed` — normal developer language, but explain harness/pipeline concepts when they come up
  - `expert` — concise and technical; no hand-holding
- High-level choices are made **together at every level**: a project's language and main
  technologies (framework, data storage, hosting) get options + a recommendation, and
  the user decides (no preference = the recommendation)
- Genuinely small technical decisions (minor libraries, tooling, file layout) Claude
  makes without asking
- When you do make a technical choice, say what you picked and why in one sentence, then move on

## At the Start of Every Session
1. Read `machine.local.md` (in this Harness folder) for THIS computer's specifics — see
   "Per-Machine Local Config" below. Its values win over any machine-specific example in these docs.
2. Check `known-issues.md` in this Harness folder for any open issues
3. If open issues exist, mention them briefly so the user knows what to watch for
4. Check memory for current project status and resume where things left off

## Per-Machine Local Config (`machine.local.md`)
The user runs this harness on more than one computer (e.g. a personal PC and a work PC), and those
machines differ — different project folders, tool locations and usernames. To
stop them overwriting each other through git, all machine-specific facts live in a file called
`machine.local.md` in this Harness folder that is **git-ignored** — each machine keeps its own copy
and it never syncs.

- **Read it at session start.** It is the source of truth for: who uses this machine and
  their explanation level (see "About the Users"), the Harness folder, the pipeline repo, the
  project base folder, and the local username.
- **Its values win.** Anywhere else in these docs names a concrete username, drive path, or project
  folder, treat that as an example — defer to `machine.local.md` for the machine you're actually on.
- **Never put machine-specific values into the shared (git-tracked) files.** If something is true
  for only one computer, it belongs in that computer's `machine.local.md`, not in `CLAUDE.md`, the
  templates, or the skills.
- **A new computer needs its own copy.** If `machine.local.md` is missing, ask the user the few
  facts above and write one (copy the structure from another machine's file).
- **This repository is public,** so the tracked files never name a real path, host or username.
  Where a doc needs one, it says to read it from `machine.local.md`; if that file does not define it,
  ask the user rather than guessing.

## How Claude Should Behave

### Making Decisions
- Choices that shape what a project is, or are hard to change later — language,
  framework, data storage, hosting — get a short discussion: options, tradeoffs, a
  recommendation, user's call. Below that level, pick the right tool yourself
- Prefer simple, proven, well-documented solutions over new or experimental ones
- When something can be done multiple ways, pick the one that's easiest to understand and maintain

### Communication
- Match the user's explanation level from `machine.local.md` (default: plain English,
  every technical term spelled out)
- Keep responses short by default; go deeper only when the user asks
- When something fails, say what went wrong in plain terms and what you're going to try next
- Never leave the user in silence while doing multi-step work — give short progress updates

### Safety — Always Confirm Before
- Pushing code to a remote repository
- Deleting files or folders
- Installing software or packages
- Any action that can't be easily undone

## Available Skills
These ship inside the **harness-pipeline plugin** and are typed with a `harness-pipeline:` prefix (e.g. `/harness-pipeline:run`).
They work in any project on a machine where the plugin is installed and enabled.

| Skill | What it does |
|---|---|
| `/harness-pipeline:scaffold` | Creates a new project from scratch |
| `/harness-pipeline:run` | Starts the current project |
| `/harness-pipeline:review` | Reviews code and explains findings in plain English |
| `/harness-pipeline:deploy` | Deploys the current project |
| `/harness-pipeline:issues` | Logs or shows recurring setup problems |
| `/harness-pipeline:commit` | Commits all changes and pushes to GitHub |
| `/harness-pipeline:harness-check` | Health-checks the harness wiring and reports problems in plain English |
| `/harness-pipeline:pipeline-onboard` | Makes the current project a valid target for the pipeline (follows `ONBOARDING.md` in the pipeline repo) |

The skills live in `plugins\harness-pipeline\commands\` in this repo — that's the single source of truth.
Install or update the plugin on any machine with:
- `/plugin marketplace add Chadleewalker/Harness_Pipeline`  (once per machine)
- `/plugin install harness-pipeline@harness-pipeline`                (once per machine)
- `/plugin update harness-pipeline@harness-pipeline`                 (to pull later changes)

## Project Structure
```
<Harness folder>\
├── CLAUDE.md                          ← This file (master rules)
├── .claude\
│   └── settings.json                  ← Per-machine permission allow-list (plugins can't ship permissions)
├── .claude-plugin\
│   └── marketplace.json               ← Marketplace listing (this repo is its own "store")
├── plugins\harness-pipeline\
│   ├── .claude-plugin\plugin.json     ← The plugin's ID card
│   └── commands\                      ← The skills — single source of truth
├── templates\                         ← Project templates used by /harness-pipeline:scaffold
└── known-issues.md                    ← Running log of setup problems
```

The skills travel inside the plugin, so there's no separate backup folder to keep in sync — pull
changes on any machine with `/plugin update harness-pipeline@harness-pipeline`. The one thing a plugin **cannot**
carry is the permission allow-list; that stays in `.claude\settings.json` here (and in a small
per-machine `settings.json` on any other computer).

## When Creating a New Project with /scaffold
- The new project gets its own `CLAUDE.md` that references this master
- The new project gets a `SPEC.md` — the agreed, written description of what's being built and
  a "Done means…" checklist, approved by the user BEFORE building starts. `/harness-pipeline:review`
  checks the code against it, and it must be kept up to date when the plan changes.
- The language and main technologies are chosen in a short discussion (options + a
  recommendation, user decides); Claude fills in the small tooling to match
- The project is self-contained — it can be opened independently and Claude will still know the rules
- Memories about a new project go in THAT project's own memory folder, never in the Harness memory.
  The Harness memory is only for how the harness itself behaves (user profile, harness plan,
  feedback on how Claude should work). See the `/scaffold` skill's "Where Project Memories Go".

## Where This Runs (Two Environments)
A project can run in two places. Something that works in one can quietly break in the other, so
anything Claude builds for a project the pipeline works on must work in BOTH unless the user says
otherwise. A project the pipeline never touches only has to work on Windows.

**1. Windows PC (local)**
- Paths look like `C:\Code\...` — backslashes and a drive letter.
- PowerShell is available.
- Commands: `python`, `npx.cmd`, `node`.
- The Harness folder (its path is in `machine.local.md`) is present and reachable.

**2. The pipeline's task container** (for projects onboarded to the autonomous pipeline — see the
pipeline repo's `ONBOARDING.md`)
- Linux. The project is a checkout at `/workspace`. Nothing from the Windows machine exists inside —
  no `C:\` drive, no Harness folder.
- PowerShell is NOT installed.
- Commands: `python3` (not `python`), `npx` (not `npx.cmd`), `node`.
- Paths use forward slashes, and files must have LF line endings (the `.gitattributes` keeps shell
  scripts that way).
- The network reaches Anthropic endpoints only: no package installs, no web lookups.

**Rules that keep things working in both**
- Never assume a `C:\...` path exists inside the container. Anything that must run there uses
  relative paths, never a hardcoded Windows path.
- Never rely on PowerShell for something that must run in both — use `node` (present in both).
- `python` on Windows vs `python3` in the container: try both, don't hardcode one.
- Keep each project self-contained. The container sees only the project, so it cannot count on the
  master rules loading there — see the note below.
- For hook-specific guidance, see "Cross-Platform Hooks" further below.

**Note on the master-rules import.** Every scaffolded `CLAUDE.md` opens with an `@`-import of this
file by its absolute path on the Windows PC. That loads these master rules on Windows, but the path
does not exist inside the container, so the import silently does nothing there. That's why the
essential environment facts are ALSO embedded directly in each project's `CLAUDE.md` — so a project
opened alone in the container still understands where it runs.

## Cross-Platform Hooks (important)
Pipeline projects run on Windows and inside the Linux task container, so any hook command in a
`.claude\settings.json` that travels with such a project must work in BOTH. (Onboarding removes
a project's format hook entirely, because it needs the npm registry the container cannot reach.)
- Run hooks with **`node`** — e.g. `node "${CLAUDE_PROJECT_DIR}/.claude/hooks/format.js"`. `node`
  is the same command on Windows and in the sandbox, so there's no per-machine setup to remember.
- Do **not** use `powershell` (it isn't installed in the Linux sandbox) or a bare `python3`
  (it isn't on Windows — that name only hits the Microsoft Store stub).
- Write hooks to **fail safe**: if a tool isn't installed, exit 0 quietly instead of erroring, so
  a missing formatter never interrupts the session.
- Use forward slashes in hook paths — they work on both systems.
