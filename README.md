# Universal AI Harness — Pipeline Edition

The master configuration for projects that run through the autonomous
[`Multi-AgentPipelines`](https://github.com/Chadleewalker/Multi-AgentPipelines) system.

It defines how Claude behaves across every project, ships the plain-English skills you
type to get work done, and holds the starter templates new projects are stamped out from.
Install it once per machine and every project on that machine inherits the same rules.

This is a **separate project from the original Harness**, which stays as it was. Commits
don't move between the two.

## Install

```
/plugin marketplace add Chadleewalker/Harness_Pipeline
/plugin install harness-pipeline@harness-pipeline
```

Later, to pull changes: `/plugin update harness-pipeline@harness-pipeline`

## Skills

All are typed with a `harness-pipeline:` prefix and work in any project on a machine where
the plugin is enabled.

| Skill | What it does |
|---|---|
| `/harness-pipeline:scaffold` | Creates a new project from scratch |
| `/harness-pipeline:run` | Starts the current project |
| `/harness-pipeline:review` | Reviews code and explains findings in plain English |
| `/harness-pipeline:deploy` | Deploys the current project |
| `/harness-pipeline:commit` | Commits all changes and pushes to GitHub |
| `/harness-pipeline:issues` | Logs or shows recurring setup problems |
| `/harness-pipeline:harness-check` | Health-checks the harness wiring and reports problems |
| `/harness-pipeline:pipeline-onboard` | Makes the current project a valid pipeline target |

## Templates

`/harness-pipeline:scaffold` copies one of three starter projects and fills in its
placeholders — `python-script`, `web-page`, or `node-web-app`. Each arrives with its own
`CLAUDE.md`, a plain-English `README.md`, and the auto-format hook already wired up. See
[`templates/README.md`](templates/README.md).

## Layout

| Path | What's in it |
|---|---|
| `CLAUDE.md` | the authoritative rules — how Claude behaves, decides, and communicates |
| `plugins/harness-pipeline/` | the plugin itself; `commands/` is the single source of truth for skills |
| `templates/` | starter projects that `/harness-pipeline:scaffold` copies |
| `.claude-plugin/marketplace.json` | what makes this repo installable as a marketplace |
| `known-issues.md` | open problems worth knowing about before you hit them |
| `docs/` | design and migration notes |

## Per-machine configuration

Anything true of only one computer — project folders, sandbox launchers, network paths,
usernames, and who is sitting at the machine — lives in `machine.local.md`, which is
git-ignored so machines never overwrite each other. Its values win over any example path
in the tracked docs. A new machine needs its own copy; `CLAUDE.md` explains what goes in it.

## License

Copyright 2026 Chad Walker

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) and
[NOTICE](NOTICE) for details.

The templates under `templates/` are a deliberate exception — see
[Licensing of scaffolded projects](templates/README.md#licensing-of-scaffolded-projects).
