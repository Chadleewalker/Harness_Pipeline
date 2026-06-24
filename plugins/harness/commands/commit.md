---
description: Update project state, stage all changes, commit with a generated message, and optionally push to GitHub.
---
Update project state, stage all changes, generate a commit message, and push to the remote repository.

## Steps

1. Run `git status` to see what files changed
2. Run `git diff` to understand what actually changed in those files
3. Stage all appropriate files — skip any that look like secrets (.env, credentials, keys)
4. Write a clear one-line commit message that describes what changed and why
5. **Update project state** (see "Updating Project State" below) — figure out what to write to
   memory, whether any architecture docs shifted, and whether this work resolves a known issue
6. **Show the user** one combined summary before doing anything: what will be committed, the
   proposed message, AND what you'll write to memory / change in the docs — wait for a yes/no
7. If confirmed: apply the memory and doc updates, then create the commit (so those changes are
   included in it)
8. Check whether the project is connected to GitHub (`git remote -v`):
   - **Connected:** push, then report the result
   - **Not connected (common for brand-new projects):** the commit is still saved on this
     computer. Tell the user that, and ask if they want a GitHub backup — if yes, create a
     private repository with `gh repo create` and push; if no, stop here, all done
9. Report success or explain any errors in plain language

## Updating Project State
This skill is meant to be run at the end of a work session, so every run is a real checkpoint
worth recording. Do all of this for the project you're CURRENTLY working in — never assume a
fixed path.

**Find the current project's memory folder.** Take the current working directory's full path,
drop the drive colon, and turn every `\` (and `:`) into `-`. The memory folder is:
`C:\Users\chadw\.claude\projects\<ENCODED_PATH>\memory\`
Examples:
- `C:\Code\AudioViz`  →  `C--Code-AudioViz`
- `C:\Code\New Project Start\Harness`  →  `C--Code-New-Project-Start-Harness`

The folder already exists (every project is built with `/scaffold`, which creates it). Write
project facts there, never in another project's folder.

**1. Memory** — record where things stand: what this session changed, the current status, and the
next step if there is one. Follow the existing memory format (one fact per file with frontmatter)
and update the `MEMORY.md` index. Update an existing file rather than duplicating when one already
covers the topic.

**2. Architecture docs** — update them only when the design actually shifted (new component, changed
data flow, new dependency between pieces). When it's ambiguous whether the design moved, do NOT
auto-edit — just flag it to the user in the summary ("heads up, this touches X; the architecture
doc may be stale").

**3. Known issues** — if this work fixed something logged in the project's `known-issues.md`, mark
that entry resolved.

## Rules
- Never skip the confirmation step before pushing
- Never use `--no-verify` or force flags
- If there's nothing to commit, say so clearly
- If the push fails, explain why in plain English and suggest what to do next
- Always write project memory to the CURRENT project's memory folder, computed from the working
  directory — only touch the Harness memory when the harness itself is the project being worked on
- Don't invent architecture changes to have something to write — flag, don't fabricate
