# Universal AI Harness

This repository is the master configuration for all projects. It defines how Claude should behave, what tools are available, and how new projects get created. Every project created with `/scaffold` inherits these rules.

## About the User
- Not a programmer — always explain things in plain, everyday language
- Claude makes all technical decisions (language, framework, tooling) — never ask the user to choose
- When you do make a technical choice, say what you picked and why in one sentence, then move on

## At the Start of Every Session
1. Read `machine.local.md` (in this Harness folder) for THIS computer's specifics — see
   "Per-Machine Local Config" below. Its values win over any machine-specific example in these docs.
2. Check `C:\Code\New Project Start\Harness\known-issues.md` for any open issues
3. If open issues exist, mention them briefly so the user knows what to watch for
4. Check memory for current project status and resume where things left off

## Per-Machine Local Config (`machine.local.md`)
The user runs this harness on more than one computer (e.g. a personal PC and a work PC), and those
machines differ — different project folders, sandbox launchers, network drives, and usernames. To
stop them overwriting each other through git, all machine-specific facts live in a file called
`machine.local.md` in this Harness folder that is **git-ignored** — each machine keeps its own copy
and it never syncs.

- **Read it at session start.** It is the source of truth for: the project base folder, how this
  machine launches its Docker sandbox, any network-share paths, and the local username.
- **Its values win.** Anywhere else in these docs names a concrete username, drive path, or project
  folder, treat that as an example — defer to `machine.local.md` for the machine you're actually on.
- **Never put machine-specific values into the shared (git-tracked) files.** If something is true
  for only one computer, it belongs in that computer's `machine.local.md`, not in `CLAUDE.md`, the
  templates, or the skills.
- **A new computer needs its own copy.** If `machine.local.md` is missing, ask the user the few
  facts above and write one (copy the structure from another machine's file).

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
| `/harness:pipeline-onboard` | Makes the current project a valid target for the overnight pipeline (follows `ONBOARDING.md` in the pipeline repo) |

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
- The new project gets a `SPEC.md` — the agreed, written description of what's being built and
  a "Done means…" checklist, approved by the user BEFORE building starts. `/harness:review`
  checks the code against it, and it must be kept up to date when the plan changes.
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

**2. yolo_docker container** (a numbered Linux container with root access, opened as code-server
in the browser — see "The yolo_docker Sandbox" below for the full picture)
- Linux. The project is a git checkout at `~/workspace` (home is `/config`, so that's the same as
  `/config/workspace`). Nothing from the Windows machine exists inside — no `C:\` drive, no
  Harness folder.
- PowerShell is NOT installed.
- Commands: `python3` (not `python`), `npx` (not `npx.cmd`), `node`.
- Paths use forward slashes.

**Rules that keep things working in both**
- Never assume a `C:\...` path exists inside the container. Anything that must run in the sandbox
  uses relative paths or `~/workspace`, never a hardcoded Windows path.
- Never rely on PowerShell for something that must run in both — use `node` (present in both).
- `python` on Windows vs `python3` in the sandbox: try both, don't hardcode one.
- Keep each project self-contained. A project may be opened alone inside the container with no access
  to the Harness, so it cannot count on the master rules loading there — see the note below.
- For hook-specific guidance, see "Cross-Platform Hooks" further below.

**Note on the master-rules import.** Every scaffolded `CLAUDE.md` has a line like
`@C:\Code\New Project Start\Harness\CLAUDE.md`. That loads these master rules on Windows, but that
path does not exist inside the container, so the import silently does nothing there. That's why the
essential environment facts are ALSO embedded directly in each project's `CLAUDE.md` — so a project
opened alone in the sandbox still understands where it runs.

## The yolo_docker Sandbox
> **Machine-specific values below live in `machine.local.md`.** The concrete username (`chadw`),
> `J:` network-share path, and project base folder in this section describe the **work PC**. On any
> given computer, defer to that machine's `machine.local.md` for the real values — and note some
> machines don't use yolo_docker at all (the personal PC uses the `launch-project.bat` bind-mount
> launcher instead). Read this section for the general how-it-works, not as literal paths for every machine.

The Linux environment is provided by **yolo_docker** (https://github.com/JEdward7777/yolo_docker.git),
created by Joshua. On machines that use it, it replaces the old `launch-project.bat` bind-mount
sandbox. The idea: a semi-ephemeral container where the coding agent has root — it can install
whatever it wants, and the whole thing is easy to blow away and rebuild.

**How it works**
- One Docker volume is mounted and becomes an overlay over root; a chroot happens on login. So
  everything written inside the container (via code-server) persists in that one volume.
- Containers are numbered ("agents"). Agent N's code-server is at port `844N` (agent 4 → 8444).
- The control script lives on the Windows host and is run **from WSL**:
  `~/yolo_docker/agent.sh <command> [agent-number]`
  Commands: `up N`, `down N` (stop, keep state), `destroy N` (delete state — full reset),
  `copy SRC DST` (mirror SRC's volume onto DST, overwrites DST), `export N [FILE]` /
  `import FILE N` (tar.gz snapshots), `logs N`, `info N`, `status`.
- There is no official golden image; agent 3 ("The Deep End") is the current known-good source to
  `copy` from.

**How the project gets in and out (git only — no bind mount)**
- The project's bare repo lives on the network share: `<git-share-drive>\<project_name>.git` on
  Windows, which is `<git-share-unc>\<project_name>.git` from the
  container's point of view.
- Inside the container, `~/network_share/mount_remote_repo.sh` smbfs-mounts JUST that one bare repo
  at `~/network_share/remote_repo.git` (the rest of the network drive stays invisible). This script
  does NOT run automatically — run it once each time the container starts, before expecting the
  remote to be reachable.
- The repo is cloned from that mount point directly to `~/workspace` (the checkout's `.git` is at
  `~/workspace/.git`). All work happens there.
- Everyone pushes to `main`. Because several agents can work on the same project at once, always
  `git fetch` and **rebase onto the remote before pushing** — plain git commands, no wrapper script.
- Agents record what they have and haven't done in the project's harness files (`CLAUDE.md`,
  memory notes), which travel in the repo — that's how agents coordinate.

**Starting Claude Code inside the container**
Always launch it with `/config/launch-claude-code.sh` — never by typing `claude` directly. The
environment is headless (code-server is the interface), and that script sets the user's Claude Code
keys. It needs no per-project edits; it just has to be used.

**Setting up a NEW project in yolo_docker (checklist)**
1. Create the project on the Windows PC and push it to a new bare repo at
   `<git-share-drive>\<project_name>.git`.
2. From WSL: `./agent.sh copy 3 N` to clone a working agent's volume onto agent N, then
   `./agent.sh up N` and open code-server at port `844N`.
3. Inside the container: edit `~/network_share/mount_remote_repo.sh` to point at the new project's
   `.git` path, then run it.
4. Clear out `~/workspace` and re-clone from `~/network_share/remote_repo.git`.
5. Start Claude Code with `/config/launch-claude-code.sh`.

## Cross-Platform Hooks (important)
Projects run in two places: directly on Windows, and inside the Linux yolo_docker container.
Any hook command in a `.claude\settings.json` must work in BOTH.
- Run hooks with **`node`** — e.g. `node "${CLAUDE_PROJECT_DIR}/.claude/hooks/format.js"`. `node`
  is the same command on Windows and in the sandbox, so there's no per-machine setup to remember.
- Do **not** use `powershell` (it isn't installed in the Linux sandbox) or a bare `python3`
  (it isn't on Windows — that name only hits the Microsoft Store stub).
- Write hooks to **fail safe**: if a tool isn't installed, exit 0 quietly instead of erroring, so
  a missing formatter never interrupts the session.
- Use forward slashes in hook paths — they work on both systems.
