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
4. **Write the pipeline's run config** for this project in the pipeline repo (the
   checklist's "Pipeline-side wiring" step) — that file belongs to the pipeline repo,
   not this project.
5. **Finish with the sanity pass** from the checklist, then summarize: what was
   created or changed in this project, what was added in the pipeline repo, and what
   the user does next (plan tasks with the pipeline's `PLANNING.md`).

## Rules

- Never assume the integration branch is `main` — ask git, and record the real one.
- Never leave a "Working inside yolo_docker" section in an onboarded project's
  `CLAUDE.md` — its push-to-main advice is the opposite of how the pipeline works.
- Pipeline projects don't keep format hooks (they fight the container's closed
  network). Confirm with the user, then remove them as the checklist says.
- Explain each change in plain English before making it — the user should always
  know why a file is appearing or changing.
