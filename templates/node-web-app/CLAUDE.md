# {{PROJECT_NAME}}

{{PROJECT_DESCRIPTION}}

This project was created with the Universal AI Harness. The line below automatically
loads the master rules every session — don't remove it.

@C:\Code\New Project Start\Harness\CLAUDE.md

## Where This Project Runs (works in both)
This project runs in two places, and code must work in both:
- **Windows PC** — paths like `C:\Code\...`, PowerShell available, use `python` and `npx.cmd`.
- **Docker sandbox** (`launch-project.bat`, opened in the browser) — Linux, the project is mounted
  at `/workspace` and nothing outside it exists (including the harness), no PowerShell, use
  `python3` and `npx`, forward-slash paths.

Rules: run hooks and scripts with `node` (works in both); never hardcode a `C:\...` path in anything
that must run in the container; try both `python` and `python3` rather than assuming one; keep hooks
fail-safe (exit quietly if a tool is missing). The `@C:\...\Harness\CLAUDE.md` line above loads the
master rules on Windows, but that path does not exist in the container — so the essentials are
duplicated here on purpose.

## Project-Specific Notes
- Type: Web app with a backend (Node.js + Express)
- Server entry point: `server.js` (serves the site and handles requests)
- Front-end files live in `public\`
- Dependencies are listed in `package.json`
- Start it with `npm start` (or ask Claude to `/run` it)
- Formatting: handled automatically on save by `prettier` (see `.claude\hooks\format.js`)
