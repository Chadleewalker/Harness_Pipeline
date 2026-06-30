---
description: Create a new project from scratch; Claude picks the language and tools.
---
Create a new project from scratch. Claude picks the right language and tools based on what the user wants to build.

## Steps

1. Ask: "What do you want to build? Describe it in plain terms — what should it do?"
2. Based on the answer, pick the best template (see Choosing a Template below). Tell the user your choice in one sentence (e.g., "I'll start from the Python template since this is a small automation task").
3. Ask: "What should the project be called, and where should I create it?" (suggest `C:\Code\ProjectName` as a default)
4. Copy the chosen template folder to the new project location.
5. Fill in the placeholders in every copied file (see Filling Placeholders below).
6. Create a `.env.Project` file in the new project's root (see The .env.Project File below).
7. Initialize git (`git init`) and install dependencies (`pip install -r requirements.txt`, `npm install`, etc. — skip for the web-page template, which has none).
8. Add anything specific the user described that the starter files don't already cover.
9. Show the user a summary of what was created and how to run it, in plain language.
10. If you record any memories about the new project, write them in the NEW project's own memory
   folder — NEVER in the Harness memory. See "Where Project Memories Go" below.

## The .env.Project File
Every scaffolded project gets a `.env.Project` file in its root folder. It records the project's
own full path so tools and scripts can find the project root without guessing. Write a single line:

```
PROJECT_PATH=C:\Code\ProjectName
```

Use the project's actual full path (the location chosen in step 3). This file applies to every
template and to projects built from scratch.

## Where Project Memories Go
The Harness memory (`C:\Users\chadw\.claude\projects\C--Code-New-Project-Start-Harness\memory\`) is ONLY for how the
harness itself behaves — the user profile, the harness plan, and feedback on how Claude should work.
Anything about a specific project you scaffold (its status, stack, gotchas, decisions) goes in that
project's own memory folder, so the Harness memory stays clean.

A project's memory folder lives at:
`C:\Users\chadw\.claude\projects\<ENCODED_PATH>\memory\`
where `<ENCODED_PATH>` is the project's full path with the drive colon dropped and every `\` (and
`:`) turned into `-`. Examples:
- `C:\Code\AudioViz`  →  `C--Code-AudioViz`
- `C:\Code\BlenderPlayground`  →  `C--Code-BlenderPlayground`

Create that folder if it doesn't exist, add a `MEMORY.md` index there, and put the project's
memory files alongside it — exactly the structure the Harness memory uses.

## Choosing a Template
Templates live in `C:\Code\New Project Start\Harness\templates\`. Pick the closest match:

| If the user wants… | Use template |
|---|---|
| A script, automation, file/data task, or small command-line tool | `python-script` |
| A plain website that just runs in the browser (no saving data, no logins) | `web-page` |
| A website with a backend — saving data, logins, talking to other services, an API | `node-web-app` |

If nothing fits (e.g. a mobile app, a game engine project, something unusual), don't force a
template — build the project from scratch instead, and still create a local `CLAUDE.md`, a
`.claude\settings.json` + `.claude\hooks\format.js` format hook (see Format Hook Fallback), and
a README. The local `CLAUDE.md` must contain the line `@C:\Code\New Project Start\Harness\CLAUDE.md` on its own
line — that's what loads the master rules automatically in the new project.

## Filling Placeholders
After copying a template, replace these markers in EVERY file (including `CLAUDE.md`,
`README.md`, source files, and `package.json`):

- `{{PROJECT_NAME}}` → the project's name
- `{{PROJECT_DESCRIPTION}}` → the one-line description from the user

**Exception for `package.json`:** npm requires the `"name"` field to be all lowercase with no
spaces. There, replace `{{PROJECT_NAME}}` with a lowercase, hyphenated version instead
(e.g. "My Recipe App" → `my-recipe-app`). Everywhere else, use the name as the user wrote it.

Don't leave any `{{...}}` markers behind.

## Format Hook Fallback (only when building from scratch)
The templates already include a working format hook. You only need this when no template fits.
Claude Code does NOT substitute a `${file}` placeholder in command hooks — it sends the edited
file's path as JSON on standard input, so the hook must read stdin and pull out the path itself.

**Part A — `.claude\hooks\format.js`** (run with `node`, which works on both Windows and the Linux sandbox):
```js
// Reads the hook payload from stdin, extracts the edited file, and formats it.
// Fail-safe: if the formatter isn't installed, it skips silently.
const { spawnSync } = require("child_process");
const fs = require("fs");

let file;
try {
  file = JSON.parse(fs.readFileSync(0, "utf8")).tool_input.file_path;
} catch {
  process.exit(0);
}
if (!file) process.exit(0);

// --- formatter (pick ONE, based on language) ---
// JavaScript / TypeScript / web (`--yes` lets npx fetch prettier without stopping to ask):
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
spawnSync(npx, ["--yes", "prettier", "--write", file], { stdio: "ignore" });
// Python (use this instead, and run `pip install ruff` during setup):
// for (const py of ["python3", "python"]) {
//   if (!spawnSync(py, ["-m", "ruff", "format", file], { stdio: "ignore" }).error) break;
// }

process.exit(0);
```

**Part B — `.claude\settings.json`** (`${CLAUDE_PROJECT_DIR}` IS substituted by Claude Code):
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/format.js\""
          }
        ]
      }
    ]
  }
}
```

**Other / unknown language:** Skip the format hook and note in the project CLAUDE.md that
formatting is not yet configured.

## Rules
- Never ask the user to choose a language or framework — decide for them
- Prefer the simplest template that gets the job done
- If the user's description is unclear, ask one clarifying question before proceeding
- Never add project-specific memories to the Harness memory — they go in the new project's own
  memory folder (see "Where Project Memories Go")
