# Project Templates

These are starter skeletons used by the `/harness-pipeline:scaffold` skill. Each folder is a ready-to-copy
project of a given type. When `/harness-pipeline:scaffold` runs, it copies the matching template into the new
project location and fills in the placeholders.

## Available templates

| Template | Use it for |
|---|---|
| `python-script` | Automation, file/data tasks, small command-line tools. Simplest to run. |
| `web-page` | A plain website (HTML/CSS/JavaScript) that opens in a browser. No server. |
| `node-web-app` | A website with a backend server — can save data, handle logins, call other services. |

## Placeholders

Template files contain these markers, which `/harness-pipeline:scaffold` replaces when stamping out a project:

- `{{PROJECT_NAME}}` — the project's name
- `{{PROJECT_DESCRIPTION}}` — a one-line description of what it does

## What every template includes

- A local `CLAUDE.md` that inherits from the master harness at `C:\Code\New Project Start\Harness_Pipeline\CLAUDE.md`
- A `README.md` with plain-English run instructions
- A `.claude\` folder with the auto-format hook already wired up (`settings.json` + `hooks\format.js`)
- Starter source files appropriate to the type

`/harness-pipeline:scaffold` runs `git init` and installs dependencies after copying — those steps are not baked
into the templates.

## Licensing of scaffolded projects

**A project you scaffold is yours.** The Apache-2.0 license at the root of this repository
covers the harness — its skills, its rules, its documentation. It does not extend to the
projects stamped out from these templates, and it makes no claim on the code you write in
them.

That is why no file in `templates/` carries a copyright header. These files are copied
verbatim into your new project, so a header here would follow the copy and assert
authorship over work that isn't the harness's. The starter content is deliberately
unlicensed boilerplate — use it, change it, or delete it, and license the result however
you want.

If you want a new project to carry a license, add one after scaffolding. `/harness-pipeline:scaffold`
does not add one for you, because the right choice depends on what the project is for.
