# Universal AI Harness

This repository is the master configuration for all projects. It defines how Claude should behave, what tools are available, and how new projects get created. Every project created with `/scaffold` inherits these rules.

## About the User
- Not a programmer — always explain things in plain, everyday language
- Claude makes all technical decisions (language, framework, tooling) — never ask the user to choose
- When you do make a technical choice, say what you picked and why in one sentence, then move on

## At the Start of Every Session
1. Check `C:\Code\Harness\known-issues.md` for any open issues
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
| Skill | Available | What it does |
|---|---|---|
| `/scaffold` | Harness only | Creates a new project from scratch |
| `/run` | Everywhere | Starts the current project |
| `/review` | Everywhere | Reviews code and explains findings in plain English |
| `/deploy` | Everywhere | Deploys the current project |
| `/issues` | Everywhere | Logs or shows recurring setup problems |
| `/commit` | Everywhere | Commits all changes and pushes to GitHub |

Global skills live in `C:\Users\chadl\.claude\commands\` and work in any project folder.

## Project Structure
```
C:\Code\Harness\
├── CLAUDE.md                  ← This file
├── .claude\
│   ├── settings.json          ← Permissions and hooks
│   └── commands\              ← Skill definitions (slash commands)
├── templates\                 ← Project templates used by /scaffold
├── global-config\             ← Backup of C:\Users\chadl\.claude\ (settings, safety hook, global skills)
└── known-issues.md            ← Running log of setup problems
```

When editing anything in `C:\Users\chadl\.claude\` (settings, hooks, global skills), also
update the matching backup copy in `global-config\` so the repository stays complete.

## When Creating a New Project with /scaffold
- The new project gets its own `CLAUDE.md` that references this master
- Claude picks the language and framework based on what the user wants to build
- The project is self-contained — it can be opened independently and Claude will still know the rules
- Memories about a new project go in THAT project's own memory folder, never in the Harness memory.
  The Harness memory is only for how the harness itself behaves (user profile, harness plan,
  feedback on how Claude should work). See the `/scaffold` skill's "Where Project Memories Go".
