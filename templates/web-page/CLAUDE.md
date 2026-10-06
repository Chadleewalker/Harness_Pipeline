# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

This project was created with the Universal AI Harness. The line below automatically
loads the master rules every session — don't remove it.

@{{HARNESS_PATH}}\CLAUDE.md

## Where This Project Runs (works in both)
This project runs on the Windows PC. If it is onboarded to the autonomous pipeline, its code also
runs inside the pipeline's Linux task container, and must work in both:
- **Windows PC** — paths like `C:\Code\...`, PowerShell available, use `python` and `npx.cmd`.
- **Pipeline task container** — Linux, no PowerShell, use `python3` and `npx`, forward-slash paths
  and LF line endings. The project is a checkout at `/workspace`; nothing from the Windows machine
  exists inside, including the harness folder, and the network reaches Anthropic endpoints only.

Rules: run hooks and scripts with `node` (works in both); never hardcode a `C:\...` path in anything
that must run in the container; try both `python` and `python3` rather than assuming one; keep hooks
fail-safe (exit quietly if a tool is missing). The `@`-import line above loads the master rules on
Windows, but that path does not exist in the container — so the essentials are duplicated here on
purpose.

## Project-Specific Notes
- **The spec lives in `SPEC.md`** — what this project should do and what "done" means. Read it
  before making changes; check items off only when verified working; update it (with the
  user's OK) whenever the plan changes.
- Type: Static website (HTML, CSS, JavaScript) — runs in a browser, no server needed
- Entry point: `index.html`
- Styles: `style.css`  |  Behavior: `script.js`
- Formatting: handled automatically on save by `prettier` (see `.claude\hooks\format.js`)
