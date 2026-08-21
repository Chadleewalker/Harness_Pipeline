---
description: Write a new project's design document — the interview, the draft, and the critic pass, before any stack is chosen.
---

Run a design-doc session for a project big enough that its decisions should exist before
its code does. The output is a `DESIGN.md` in the project's own repo: what is being built,
every decision and why, what is deliberately excluded, and a change log that is appended to
for the life of the project.

**The guide itself lives in the pipeline's repo — `docs/DESIGN-GUIDE.md` at its root — and
that file is the source of truth.** This skill is a thin wrapper: find that file, follow it,
and talk to the user in plain English. If this skill and that file ever disagree, the file
wins (it changes together with the pipeline's own design doc). Everything about *what* goes
in a design document comes from there at read time, which is what keeps this skill correct
through changes that would invalidate a copy.

This is **stage 1 of four** in `ONBOARDING.md`'s path from an empty folder — before
`/scaffold`, not after. That order is deliberate and is explained below.

## When this is the wrong command

Say so and stop, rather than producing a document nobody needs:

- **A small project.** If the work will not decompose into many tasks, it lives on a
  `SPEC.md` from `/scaffold` and enters planning per task. The doc layer is overhead there.
  Ask what the project is before assuming either way.
- **An existing project with no design doc.** Do **not** reverse-engineer one from the code —
  `ONBOARDING.md` is explicit about this. A doc written by reading an implementation records
  no decisions, only observations, and it inherits every accident in the code as though it
  were intended.
- **A single feature of an existing project that already has a design doc.** That is an
  amendment to the existing doc plus a change-log row, not a new document.

## Steps

1. **Find the pipeline repo.** Read `machine.local.md` in the Harness folder for a "pipeline
   repo" path. If it is not recorded there, ask the user where the Multi-AgentPipelines repo
   lives on this machine, and offer to save the answer to `machine.local.md` so nobody has to
   be asked twice.
   - If this machine does not have the pipeline repo at all, stop and say so. The guide is
     the substance of this skill and there is no useful fallback.
2. **Read `docs/DESIGN-GUIDE.md`** in that repo, in full, before asking the user anything.
3. **Make sure the repo exists, and only the repo.** A folder and `git init` — no language,
   no template, no files. The design doc lives in the project's own repo as its own
   `DESIGN.md` from the first draft, and creating that repo is not a decision, so it does not
   wait for the design. A GitHub remote is not needed and can wait for onboarding.
4. **Show the user the whole question list before asking the first question.** This is not
   optional and it is the part most likely to be skipped. Someone who cannot see what will be
   wanted later cannot tell whether their answer to question 1 belongs in question 1. Present
   the six questions as a table with what each one fills.
5. **Ask them one at a time**, waiting for each answer, unless the user's own profile says
   they prefer them batched. Bounded means the *list* is fixed, not that they arrive at once.
6. **Draft the document** — the sections in the guide's order, in the project's `DESIGN.md`.
7. **Run the critic pass in fresh context**, one subagent per lens, none of them primed with
   the drafting conversation. Fresh context is the mechanism, not a convenience: a reviewer
   who has read the drafter's reasoning inherits the drafter's blind spots.
8. **Give every finding a disposition** — accepted, rejected with a reason, or deferred —
   written down. A finding silently dropped is indistinguishable from one considered and
   rejected.
9. **Test it against the readiness bar** in the guide, including the dry-run decomposition:
   slice the doc into task-sized specs and confirm each has a fillable "done means" list and
   a citation back to a section. A document that cannot be decomposed is not ready, however
   clean the review came back.
10. **Get the user's approval,** then say what happens next: `/scaffold` builds it with the
    stack chosen against this document, then `/pipeline-onboard` makes it a pipeline target.

## Rules

- **Do not paraphrase the guide — follow it.** The rules below are the ones worth stating
  twice because getting them wrong is expensive.
- **Never ask the user to choose an architecture, a file layout, a library or a test
  framework.** Asking makes the choice theirs to guess at. Those are derived and brought back
  as decisions with reasons. If you catch yourself about to ask one, that is a defect in the
  process — derive it instead and note that it happened.
- **A choice the user brings unprompted is input, not an intrusion.** Record it, and ask the
  one question that matters about it: **forced or preferred?** A forced constraint is designed
  around and never revisited. A preference is a decision whose recorded reason is the user,
  revisited if that reason stops holding. Writing them down as the same thing is how a
  document ends up carrying a constraint nobody can trace beside a preference nobody dares
  question.
- **Never choose the stack here, and never let `/scaffold` choose it later if this document
  decided it.** Scaffolding picks a language and main technologies, which is the interview's
  question 6 — running it first answers question 6 before questions 1 to 5 have been asked,
  and the design then gets built around a stack nobody argued for.
- **Every line of the document is a decision, a contract, or an exclusion.** Anything else is
  description, and description is the part that rots. If a section cannot be written as one of
  the three, it does not belong.
- **Name the rejected alternative** in every decision. One sentence, and it stops the decision
  being re-litigated in six months by someone who cannot see what it beat.
- **Every exclusion gets the condition that would reopen it.** An exclusion that reads as
  permanent gets quietly worked around instead of formally revisited.
- **Keep progress out of it.** Where the build actually is belongs in a status document. Mixed
  in, the design doc rots at the speed of the work and the decisions get discounted with it.
- **Change-log rows are identified by a kebab-case slug, never a version number** — parallel
  agents cannot assign version numbers uniquely, and two rows arrive claiming the same one.
- **Follow-ups after the draft are legal and bounded** — two or three, shown as a list rather
  than dripped one at a time. More than three means the six questions are wrong, and the fix
  belongs in the guide rather than in the conversation.
- Explain each thing in plain English as you go. The user should never be surprised by a file
  appearing.
