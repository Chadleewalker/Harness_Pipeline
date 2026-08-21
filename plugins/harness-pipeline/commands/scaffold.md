---
description: Create a new project from scratch; the language and main technologies are chosen together in a short discussion.
---

Create a new project from scratch. The language and the main technologies are chosen
together — Claude lays out the sensible options in plain English and the user makes the
call. The genuinely small decisions stay Claude's.

## Steps

1. Ask: "What do you want to build? Describe it in plain terms — what should it do?"
2. **Draft the spec and get it approved** (see The SPEC.md File below). From the answer, write:
   - a short "What it should do" list, and
   - a plain-English "Done means…" checklist — the concrete things that must work for the
     project to count as finished.
   Show both to the user and ask: "Does this match what you want?" Adjust until they say yes.
   This is the user's check on WHAT gets built — don't skip it, and don't start building
   before it's approved.
3. **Discuss the language and main technologies.** From what the user wants to build,
   lay out the sensible options — usually two or three per choice — in plain English:
   one line each on what it's good at and its tradeoff, plus which one you'd recommend
   and why. The user makes the call; "you pick" or no preference means your
   recommendation. This covers every choice that shapes what the project IS or is hard
   to change later: the language, and where the project needs them, the framework, how
   data is stored, and how it will be hosted or run. Don't turn it into a quiz — bundle
   the choices into one short discussion, and skip any the project plainly doesn't have
   (a small script needs only the language question). Then pick the template that
   matches what was agreed (see Choosing a Template below) and say so in one sentence.
4. **Ask the two environment questions now, not at the end** (see Two Questions That Change
   What Gets Written below): "Will the autonomous pipeline work on this project?" and "Will
   this project also run in a yolo_docker container?" Both change which files step 6 writes,
   so asking late means writing things only to delete them. "Not sure" counts as no for the
   pipeline — a project can be onboarded any time later.
5. Ask: "What should the project be called, and where should I create it?" Default the location
   to this machine's **project base folder** from `machine.local.md` — read that file rather
   than assuming; the folder differs per machine.
6. Copy the chosen template folder to the new project location.
7. Fill in the placeholders in every copied file (see Filling Placeholders below). This includes
   writing the approved spec into `SPEC.md`, and the harness path into the `@`-import line.
8. Apply the step-4 answers (see Two Questions That Change What Gets Written): strip the
   yolo_docker section if it isn't a sandbox project; strip the format hook and the yolo_docker
   section, and keep the `.gitattributes`, if it is a pipeline project.
9. Create a `.env.Project` file in the new project's root (see The .env.Project File below).
10. Initialize git (`git init`) and install dependencies (`pip install -r requirements.txt`,
    `npm install`, etc. — skip for the web-page template, which has none). **If this is a
    pipeline project, create the GitHub remote now** (confirm with the user first) rather than
    later: Beads takes its sync remote from the git remote when `bd init` runs during
    onboarding, and with no origin present it initializes without one — silently and
    permanently, leaving the task queue unable to sync between machines.
11. Build what `SPEC.md` says, beyond what the starter files already cover.
12. If the answer at step 4 was yes to yolo_docker, do the yolo_docker setup (see Setting Up
    for yolo_docker below).
13. If the answer at step 4 was yes to the pipeline, run `/harness-pipeline:pipeline-onboard` —
    it follows the checklist in the pipeline repo's `ONBOARDING.md` (config file, frozen-test
    folder, Docker image, `CLAUDE.md` changes).
14. Show the user a summary of what was created and how to run it, in plain language.
15. If you record any memories about the new project, write them in the NEW project's own memory
    folder — NEVER in the Harness memory. See "Where Project Memories Go" below.

## Two Questions That Change What Gets Written

The templates carry two things that are right for an ordinary project and **wrong** for a
pipeline project. Both used to be installed and then removed again during onboarding, which
is churn and, worse, leaves a window where a project's own instructions contradict the
pipeline's. Ask at step 4 and write the right files the first time.

| The template ships | Ordinary project | yolo_docker project | Pipeline project |
|---|---|---|---|
| "Working inside yolo_docker" section in `CLAUDE.md` | remove | **keep** | **remove** |
| `.claude/settings.json` hooks + `.claude/hooks/format.js` | keep | keep | **remove both** |
| `.gitattributes` (`*.sh text eol=lf`) | keep | keep | **keep — required** |

**Why the yolo_docker section must go from a pipeline project.** It tells agents to push
straight to `main`. The pipeline's entire git model is the opposite: a container holds no
credentials and cannot push at all, the host pushes a task branch after the container exits,
and nothing ever touches the integration branch directly. Leaving that section in gives the
coding agent instructions that contradict the run it is inside.

**Why the format hook must go.** It calls `npx --yes prettier`, which reaches the npm registry
on every single edit. A pipeline container's network reaches Anthropic endpoints and nothing
else, so the hook fails on every edit the agent makes. Formatting in a pipeline project is a
verifier or regression-suite concern, or it is nothing.

**Why `.gitattributes` matters most there.** `*.sh text eol=lf` keeps shell scripts from being
checked out with Windows line endings. Inside a Linux container those scripts break — and the
pipeline's verifier compares frozen files byte for byte, so a line-ending difference reads as
*tampering* and fails the task for a reason that has nothing to do with the code.

If the user says "not sure" about the pipeline, treat it as no and keep the ordinary files.
`/harness-pipeline:pipeline-onboard` removes them correctly later; that is what its checklist
is for. The point of asking early is to avoid the churn, not to make the answer binding.

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
PROJECT_PATH=<the project's actual full path from step 5>
```

Use the project's actual full path (the location chosen in step 5). This file applies to every
template and to projects built from scratch. It is git-ignored — it names a location on one
computer, so it never travels.

## Setting Up for yolo_docker
> **Applies only on a machine whose `machine.local.md` says it uses yolo_docker.** Skip the whole
> section on a machine that uses the `launch-project.bat` bind-mount launcher instead. Every
> concrete value below is an angle-bracket slot; fill each from `machine.local.md`, and never
> write a real share path or username back into this file — it is tracked and published.

yolo_docker (Joshua's project, https://github.com/JEdward7777/yolo_docker.git) is the numbered-container
Linux sandbox described in the master `CLAUDE.md` ("The yolo_docker Sandbox"). Projects get into it
through git only — a bare repo on the network share — never a bind mount. If the user said at
step 4 that the project will run there:

1. Create a bare repo on the network share at `<git-share-drive>\<project_name>.git`
   (`git init --bare`). Confirm with the user before writing to the share.
2. Add it as the project's remote and push (confirm before pushing, per the safety rules):
   the same repo is reachable from inside a container at
   `<git-share-unc>\<project_name>.git`.
3. Then tell the user the container-side steps in plain language (these happen later, not now):
   - From WSL on the Windows host: `<yolo-docker-folder>/agent.sh copy <good-agent> N` to clone a
     known-good agent's volume onto agent N (`machine.local.md` records which agent is the current
     good source), then `./agent.sh up N`. Code-server for agent N is at port `844N`.
   - Inside the container: edit `~/network_share/mount_remote_repo.sh` to point at the new
     project's `.git` path, run it (it must be run once each container start), clear out
     `~/workspace`, and re-clone from `~/network_share/remote_repo.git`.
   - Start Claude Code with `/config/launch-claude-code.sh` — never bare `claude`.

The templates' `CLAUDE.md` carries the in-container working rules ("Working inside yolo_docker") —
keep that section for a yolo_docker project. Remove it for every other kind, and **especially**
for a pipeline project, whose git model is the opposite of what it describes (see Two Questions
That Change What Gets Written).

## Where Project Memories Go

Every project — this harness included — has its own memory folder, and which one you write to is
decided by which project you are working in, never by habit.

A project's memory folder lives at `<your-home>\.claude\projects\<ENCODED_PATH>\memory\`, where
`<your-home>` is the current user's home folder and `<ENCODED_PATH>` is the project's **full
path** with every `\`, `:` and space turned into `-`. So a project at `<drive>:\<a>\<b>\<Name>`
encodes to `<drive>--<a>-<b>-<Name>`. Derive it from the actual working directory — never copy an
encoded string out of a document, because the small errors are invisible: dropping one trailing
segment silently writes into a different project's memory, which is how harness notes ended up in
the retired Harness's folder.

**The Harness memory** — the folder derived that way from the Harness folder itself — is ONLY for
how the harness behaves: the user profile, the harness plan, and feedback on how Claude should
work. Anything about a specific project you scaffold (its status, stack, gotchas, decisions) goes
in that project's own folder, so the Harness memory stays clean.

Create the folder if it doesn't exist, add a `MEMORY.md` index there, and put the memory files
alongside it — the same structure the Harness memory uses.

## Choosing a Template

Templates live in `templates\` inside the Harness folder (its path: `machine.local.md`). Pick the
closest match:

| If the user wants…                                                                | Use template    |
| --------------------------------------------------------------------------------- | --------------- |
| A script, automation, file/data task, or small command-line tool                  | `python-script` |
| A plain website that just runs in the browser (no saving data, no logins)         | `web-page`      |
| A website with a backend — saving data, logins, talking to other services, an API | `node-web-app`  |

If nothing fits (e.g. a mobile app, a game engine project, something unusual), don't force a
template — build the project from scratch instead, and still create a local `CLAUDE.md`, a
`SPEC.md` (copy the structure from any template's `SPEC.md` and fill it from the approved spec),
a `.gitattributes` (copy from any template), a `.claude\settings.json` + `.claude\hooks\format.js`
format hook (see Format Hook Fallback — skip both for a pipeline project), and a README.

The local `CLAUDE.md` must open with an `@`-import of the master rules on its own line — the
Harness folder's absolute path from `machine.local.md`, followed by `\CLAUDE.md`. That is what
loads these rules automatically in the new project. It must ALSO contain the self-contained
"Where This Project Runs" section, copied verbatim from any template's `CLAUDE.md`, because that
import line does not resolve inside a container and the project still needs to understand where
it runs when opened alone. Include the "Working inside yolo_docker" subsection only for a
yolo_docker project — see Two Questions That Change What Gets Written.

## Filling Placeholders

After copying a template, replace these markers in EVERY file (including `CLAUDE.md`,
`README.md`, source files, and `package.json`):

- `{{PROJECT_NAME}}` → the project's name
- `{{PROJECT_DESCRIPTION}}` → the one-line description from the user
- `{{HARNESS_PATH}}` → this machine's **Harness folder** absolute path, read from
  `machine.local.md`. It appears in each template's `CLAUDE.md` `@`-import line. The templates
  carry a placeholder rather than a real path on purpose: a real path is correct on exactly one
  computer, and the harness is published, so a hardcoded one would both be wrong elsewhere and
  leak this machine's layout. If `machine.local.md` has no Harness folder entry, ask the user
  and offer to add it.
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

**Pipeline projects get no format hook at all** — this one calls `npx --yes prettier`, which
reaches the npm registry on every edit, and a pipeline container's network reaches Anthropic
endpoints and nothing else. Note in the project's `CLAUDE.md` that formatting is a verifier
concern there.

## Rules

- The language and the main technologies are a conversation, not a unilateral pick:
  offer options with a recommendation, in plain English, and let the user decide (no
  preference = your recommendation). The test for what gets discussed: does it shape
  what the project is, or would it be hard to change later? Language, framework, data
  storage, hosting — discussed. Genuinely small things — formatter, file layout, minor
  libraries — you still decide yourself; don't burden the user with those
- Prefer the simplest template that gets the job done
- If the user's description is unclear, ask one clarifying question before proceeding
- Never start building before the user has approved the "Done means…" checklist (step 2) —
  the spec is approved first, then built
- Every scaffolded project must end up with a filled-in `SPEC.md` — no `{{...}}` markers left,
  whether from a template or built from scratch
- Never add project-specific memories to the Harness memory — they go in the new project's own
  memory folder (see "Where Project Memories Go")
- Every scaffolded `CLAUDE.md` must keep its self-contained "Where This Project Runs" section —
  that is what lets a project understand its environment when the master-rules import can't load,
  which is always the case inside a container. The "Working inside yolo_docker" subsection is
  conditional, not automatic: keep it for a yolo_docker project, remove it otherwise, and
  never leave it in a pipeline project (Two Questions That Change What Gets Written)
- Never write a real absolute path, username, or network-share address into this file or any
  other tracked harness file — those belong in `machine.local.md`, which is git-ignored. This
  repo is published; `node scripts/check-sanitize.js` in the Harness folder is what catches a slip
- **A scaffolded project inherits no licence from the harness.** The harness is Apache-2.0; the
  templates are starting material and the finished project is the user's to licence as they
  please. So don't copy the harness `LICENSE` or `NOTICE` into a new project, and don't add
  copyright or SPDX headers to files stamped from a template. If the user wants a licence, ask
  which one and add it as their choice — never as a default inherited from here
