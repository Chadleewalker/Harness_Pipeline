---
description: Make the current project a valid target for the pipeline.
---

Set up the current project so the autonomous pipeline (the Multi-AgentPipelines repo)
can run tasks against it. Works for freshly scaffolded projects and existing ones.

**The checklist itself lives in the pipeline's repo — `ONBOARDING.md` at its root —
and that file is the source of truth.** This skill is a thin wrapper: find that file,
follow it top to bottom, and report in plain English. If this skill and that file ever
disagree, the file wins (it changes together with the pipeline's design doc).

## Steps

1. **Find the pipeline repo.** Read `machine.local.md` in the Harness folder for a
   "pipeline repo" path. If it isn't recorded there, ask the user where the
   Multi-AgentPipelines repo lives on this machine, and offer to save the answer to
   `machine.local.md` so next time nobody has to ask.
   - If this machine doesn't have the pipeline repo at all, stop and say so — this
     skill needs it. (The pipeline currently targets the personal PC; the work-PC
     port is a later phase.)
2. **Read `ONBOARDING.md`** in that repo and work through its checklist against the
   current project, in order. Announce each step in one plain sentence as you go.
3. **Respect the harness safety rules while doing it.** The checklist involves a few
   actions that always need the user's OK first: creating a GitHub repo, pushing,
   building a Docker image, and deleting the project's hook files. Ask before each.
4. **Do the pipeline-side wiring too.** Some of the checklist's steps write to the
   *pipeline* repo, not this project, and some are per-machine rather than per-project —
   the run config, the publication denylist, the git hook installer. Work through that
   section as written; don't assume "onboarding" means only the project's own files.
5. **Finish with the sanity pass** from the checklist, then summarize: what was
   created or changed in this project, what was added in the pipeline repo, and what
   the user does next (plan tasks with the pipeline's `PLANNING.md`).

## Rules

- **Don't paraphrase the checklist — follow it.** The handful of rules below are the ones
  worth stating twice because getting them wrong is expensive. Everything else comes from
  `ONBOARDING.md` at read time, which is exactly why this skill has stayed correct through
  changes to the pipeline that would have invalidated a copy.
- Never assume the integration branch is `main` — ask git, and record the real one.
- Never leave a "Working inside yolo_docker" section in an onboarded project's
  `CLAUDE.md` — its push-to-main advice is the opposite of how the pipeline works. yolo_docker
  is retired and the templates no longer carry the section (2026-10-06), but a project
  scaffolded before then may; remove it on sight.
- Pipeline projects don't keep format hooks (they fight the container's closed
  network). Confirm with the user, then remove them as the checklist says.
- **The GitHub remote must exist before `bd init` runs.** Beads takes its sync remote from
  the git remote at init time, and with no origin it initializes without one — silently and
  permanently, leaving the task queue unable to sync between machines. The checklist's order
  already handles this (remote first, `bd init` later); the risk is running `bd init` early
  to "get it out of the way". Don't.
- Explain each change in plain English before making it — the user should always
  know why a file is appearing or changing.
