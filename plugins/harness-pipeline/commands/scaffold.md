---
description: Create a new project from scratch; the language is chosen together in a short discussion.
---

Create a new project from scratch. The language is chosen together — Claude lays out the
sensible options in plain English and the user makes the call. The smaller tooling
decisions stay Claude's.

## Steps

1. Ask: "What do you want to build? Describe it in plain terms — what should it do?"
2. **Draft the spec and get it approved** (see The SPEC.md File below). From the answer, write:
   - a short "What it should do" list, and
   - a plain-English "Done means…" checklist — the concrete things that must work for the
     project to count as finished.
   Show both to the user and ask: "Does this match what you want?" Adjust until they say yes.
   This is the user's check on WHAT gets built — don't skip it, and don't start building
   before it's approved.
3. **Discuss the language.** From what the user wants to build, lay out the sensible
   options — usually two or three — in plain English: one line each on what it's good at
   and its tradeoff, plus which one you'd recommend and why. The user makes the call; if
   they say "you pick" or have no preference, go with your recommendation. Then pick the
   template that matches the agreed language (see Choosing a Template below) and say so
   in one sentence.
4. Ask: "What should the project be called, and where should I create it?" Default the location to
   this machine's **project base folder** from `machine.local.md` (e.g. `C:\Code\Projects\ProjectName`
   on the personal PC, `C:\Code\ProjectName` on the work PC) — read that file rather than assuming.
5. Copy the chosen template folder to the new project location.
6. Fill in the placeholders in every copied file (see Filling Placeholders below). This includes
   writing the approved spec into `SPEC.md`.
7. Create a `.env.Project` file in the new project's root (see The .env.Project File below).
8. Initialize git (`git init`) and install dependencies (`pip install -r requirements.txt`, `npm install`, etc. — skip for the web-page template, which has none).
9. Build what `SPEC.md` says, beyond what the starter files already cover.
10. Ask: "Will this project also run in a yolo_docker container?" If yes, do the yolo_docker
    setup (see Setting Up for yolo_docker below).
11. Ask: "Will the overnight pipeline work on this project?" If yes, run
    `/harness-pipeline:pipeline-onboard` — it follows the checklist in the pipeline repo's
    `ONBOARDING.md` (config file, frozen-test folder, Docker image, `CLAUDE.md` changes).
    A project can be onboarded later instead; the question is just cheapest to answer now.
12. Show the user a summary of what was created and how to run it, in plain language.
13. If you record any memories about the new project, write them in the NEW project's own memory
    folder — NEVER in the Harness memory. See "Where Project Memories Go" below.

## The SPEC.md File

Every project gets a `SPEC.md` in its root — the agreed, written description of what's being
built and what "done" means. It is the file `/harness-pipeline:review` checks the code against, and the
file a future session (or another agent in the sandbox) reads to know the goal. The templates
include a `SPEC.md` with placeholders; fill them from the spec the user approved in step 2:

- `{{SPEC_DETAILS}}` → the "What it should do" list (short bullet points, plain English)
- `{{DONE_CHECKLIST}}` → the "Done means…" items as an unchecked markdown checklist
  (`- [ ] ...`), each one a concrete, checkable outcome ("saving a recipe and reloading the
  page keeps it"), not a vague goal ("works well")
- `{{OUT_OF_SCOPE}}` → anything the user said they DON'T want, or `- Nothing noted yet.`

Spec rules that apply for the whole life of the project:
- Only check off a "Done means…" item after actually trying it and seeing it work.
- If the user changes what they want, update `SPEC.md` (and add a row to its "Spec changes"
  table) as part of making the change — the spec must never drift from reality.

## The .env.Project File

Every scaffolded project gets a `.env.Project` file in its root folder. It records the project's
own full path so tools and scripts can find the project root without guessing. Write a single line:

```
PROJECT_PATH=<the project's actual full path from step 3, e.g. C:\Code\Projects\ProjectName>
```

Use the project's actual full path (the location chosen in step 3). This file applies to every
template and to projects built from scratch.

## Setting Up for yolo_docker
> **This whole section applies only to machines whose `machine.local.md` uses yolo_docker.** The
> `J:` network-share path and the `chadw` username below are the **work PC's** values — read this
> machine's `machine.local.md` for the real ones, and skip this section entirely on a machine that
> uses the `launch-project.bat` bind-mount launcher instead (e.g. the personal PC).

yolo_docker (Joshua's project, https://github.com/JEdward7777/yolo_docker.git) is the numbered-container
Linux sandbox described in the master `CLAUDE.md` ("The yolo_docker Sandbox"). Projects get into it
through git only — a bare repo on the network share — never a bind mount. If the user says the new
project will run there:

1. Create a bare repo on the network share at `<git-share-drive>\<project_name>.git`
   (`git init --bare`). Confirm with the user before writing to the git share.
2. Add it as the project's remote and push (confirm before pushing, per the safety rules):
   the same repo is reachable from inside a container at
   `<git-share-unc>\<project_name>.git`.
3. Then tell the user the container-side steps in plain language (these happen later, not now):
   - From WSL on the Windows host: `~/yolo_docker/agent.sh copy 3 N` to clone a
     known-good agent's volume onto agent N (agent 3, "The Deep End", is the current good source),
     then `./agent.sh up N`. Code-server for agent N is at port `844N`.
   - Inside the container: edit `~/network_share/mount_remote_repo.sh` to point at the new
     project's `.git` path, run it (it must be run once each container start), clear out
     `~/workspace`, and re-clone from `~/network_share/remote_repo.git`.
   - Start Claude Code with `/config/launch-claude-code.sh` — never bare `claude`.

The templates' `CLAUDE.md` already carries the in-container working rules ("Working inside
yolo_docker") — don't strip that section.

## Where Project Memories Go

The Harness memory (`<your-home>\.claude\projects\C--Code-New-Project-Start-Harness-Pipeline\memory\`, where `<your-home>` is the current user's home folder) is ONLY for how the
harness itself behaves — the user profile, the harness plan, and feedback on how Claude should work.
Anything about a specific project you scaffold (its status, stack, gotchas, decisions) goes in that
project's own memory folder, so the Harness memory stays clean.

A project's memory folder lives at:
`<your-home>\.claude\projects\<ENCODED_PATH>\memory\` (where `<your-home>` is the current user's home folder)
where `<ENCODED_PATH>` is the project's full path with the drive colon dropped and every `\` (and
`:`) turned into `-`. Examples:

- `C:\Code\Projects\AudioViz` → `C--Code-Projects-AudioViz`
- `C:\Code\Projects\BlenderPlayground` → `C--Code-Projects-BlenderPlayground`

Create that folder if it doesn't exist, add a `MEMORY.md` index there, and put the project's
memory files alongside it — exactly the structure the Harness memory uses.

## Choosing a Template

Templates live in `C:\Code\New Project Start\Harness_Pipeline\templates\`. Pick the closest match:

| If the user wants…                                                                | Use template    |
| --------------------------------------------------------------------------------- | --------------- |
| A script, automation, file/data task, or small command-line tool                  | `python-script` |
| A plain website that just runs in the browser (no saving data, no logins)         | `web-page`      |
| A website with a backend — saving data, logins, talking to other services, an API | `node-web-app`  |

If nothing fits (e.g. a mobile app, a game engine project, something unusual), don't force a
template — build the project from scratch instead, and still create a local `CLAUDE.md`, a
`SPEC.md` (copy the structure from any template's `SPEC.md` and fill it from the approved
spec), a `.claude\settings.json` + `.claude\hooks\format.js` format hook (see Format Hook
Fallback), and a README. The local `CLAUDE.md` must contain the line `@C:\Code\New Project Start\Harness_Pipeline\CLAUDE.md` on its own
line — that's what loads the master rules automatically in the new project. It must ALSO contain the
self-contained "Where This Project Runs" section AND its "Working inside yolo_docker" subsection
(copy both verbatim from any template's `CLAUDE.md`), because that import line does not resolve
inside the container, and the project still needs to understand its two environments when opened
alone in the sandbox.

## Filling Placeholders

After copying a template, replace these markers in EVERY file (including `CLAUDE.md`,
`README.md`, source files, and `package.json`):

- `{{PROJECT_NAME}}` → the project's name
- `{{PROJECT_DESCRIPTION}}` → the one-line description from the user
- `{{SPEC_DETAILS}}`, `{{DONE_CHECKLIST}}`, `{{OUT_OF_SCOPE}}` → only appear in `SPEC.md`;
  fill them from the approved spec (see The SPEC.md File above)

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

- The language is a conversation, not a unilateral pick: offer options with a
  recommendation, in plain English, and let the user decide (no preference = your
  recommendation). Everything smaller — libraries, file layout, tooling — you still
  decide yourself; don't burden the user with those choices
- Prefer the simplest template that gets the job done
- If the user's description is unclear, ask one clarifying question before proceeding
- Never start building before the user has approved the "Done means…" checklist (step 2) —
  the spec is approved first, then built
- Every scaffolded project must end up with a filled-in `SPEC.md` — no `{{...}}` markers left,
  whether from a template or built from scratch
- Never add project-specific memories to the Harness memory — they go in the new project's own
  memory folder (see "Where Project Memories Go")
- Every scaffolded `CLAUDE.md` must keep its self-contained "Where This Project Runs" section and
  the "Working inside yolo_docker" subsection — the templates already include them; don't strip
  them. They're what let a project work in both Windows and the yolo_docker container even when
  the master-rules import can't load (inside the container).
