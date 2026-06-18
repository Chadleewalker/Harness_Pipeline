# Project Templates

These are starter skeletons used by the `/scaffold` skill. Each folder is a ready-to-copy
project of a given type. When `/scaffold` runs, it copies the matching template into the new
project location and fills in the placeholders.

## Available templates

| Template | Use it for |
|---|---|
| `python-script` | Automation, file/data tasks, small command-line tools. Simplest to run. |
| `web-page` | A plain website (HTML/CSS/JavaScript) that opens in a browser. No server. |
| `node-web-app` | A website with a backend server — can save data, handle logins, call other services. |

## Placeholders

Template files contain these markers, which `/scaffold` replaces when stamping out a project:

- `{{PROJECT_NAME}}` — the project's name
- `{{PROJECT_DESCRIPTION}}` — a one-line description of what it does

## What every template includes

- A local `CLAUDE.md` that inherits from the master harness at `C:\Code\New Project Start\Harness\CLAUDE.md`
- A `README.md` with plain-English run instructions
- A `.claude\` folder with the auto-format hook already wired up (`settings.json` + `hooks\format.ps1`)
- Starter source files appropriate to the type

`/scaffold` runs `git init` and installs dependencies after copying — those steps are not baked
into the templates.
