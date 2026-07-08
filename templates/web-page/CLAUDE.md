# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

This project was created with the Universal AI Harness. The line below automatically
loads the master rules every session — don't remove it.

@C:\Code\New Project Start\Harness\CLAUDE.md

## Where This Project Runs (works in both)
This project runs in two places, and code must work in both:
- **Windows PC** — paths like `C:\Code\...`, PowerShell available, use `python` and `npx.cmd`.
- **yolo_docker container** (a numbered Linux container opened as code-server in the browser) —
  Linux with root access, no PowerShell, use `python3` and `npx`, forward-slash paths. The project
  is a git checkout at `~/workspace` (home is `/config`); nothing from the Windows machine exists
  inside, including the harness folder.

Rules: run hooks and scripts with `node` (works in both); never hardcode a `C:\...` path in anything
that must run in the container; try both `python` and `python3` rather than assuming one; keep hooks
fail-safe (exit quietly if a tool is missing). The `@C:\...\Harness\CLAUDE.md` line above loads the
master rules on Windows, but that path does not exist in the container — so the essentials are
duplicated here on purpose.

### Working inside yolo_docker (read this when running in the container)
- The project's bare repo on the network share is smbfs-mounted at `~/network_share/remote_repo.git`
  by `~/network_share/mount_remote_repo.sh`. That script does NOT run automatically — run it once
  each time the container starts, before using git against the remote.
- Work in `~/workspace` (the checkout itself — `.git` is at `~/workspace/.git`).
- Everyone pushes to `main`, and other containers may be working on this same project at the same
  time. Before pushing: `git fetch` and rebase onto the remote, then push. Plain git — no wrapper.
- Record what's done and not done in this project's harness files (this `CLAUDE.md` / memory
  notes in the repo) so other agents can pick up the thread.
- Start Claude Code with `/config/launch-claude-code.sh` — never by typing `claude` directly
  (the script sets the Claude Code keys; the environment is headless behind code-server).
- Container management (`agent.sh up/down/destroy/copy/...`) happens OUTSIDE the container, from
  WSL on the Windows host — see the harness master rules.

## Project-Specific Notes
- Type: Static website (HTML, CSS, JavaScript) — runs in a browser, no server needed
- Entry point: `index.html`
- Styles: `style.css`  |  Behavior: `script.js`
- Formatting: handled automatically on save by `prettier` (see `.claude\hooks\format.js`)
