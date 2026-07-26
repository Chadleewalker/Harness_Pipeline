---
description: Review the current code changes and explain findings in plain English.
---
Review the current code changes and explain findings in plain, everyday language.

## Steps

1. Read the project's `SPEC.md` (in the project root). That file is the agreed description of
   what's being built and what "done" means — the review measures the code against it.
   - If there is no `SPEC.md` (an older project), say so, do the quality review below anyway,
     and offer to create one from what the code and the user say the project should do.
2. Run `git diff` to see what changed, or if no git diff is available, read the relevant files
3. **Check the work against the spec:**
   - Which "Done means…" items now actually work? Verify by running or trying them where
     possible — never mark an item done just because code for it exists.
   - Did anything get built that the spec doesn't mention, or that's listed under "Not doing"?
     Flag it — it may be fine, but the user should know the project drifted from the plan.
   - If items were verified working, offer to check them off in `SPEC.md`.
4. Review the code itself for:
   - **Bugs** — things that will break or behave unexpectedly
   - **Security problems** — passwords in code, unsafe inputs, exposed data
   - **Simplifications** — places where the code is more complicated than it needs to be
5. Present findings as a plain-English list — no jargon, no code unless necessary. Start with
   the spec check: "Of the N things that define done, X work, Y don't yet."
6. Rate the overall state: Good / A few things to fix / Needs attention
7. Ask if the user wants you to fix anything

## Rules
- Explain findings at the user's explanation level (from `machine.local.md`; when
  unset, as if the user has never programmed before)
- Don't flag style preferences as bugs — only report things that actually matter
- If everything looks good, say so clearly — don't invent problems
- The spec is the yardstick: "the code runs" is not the same as "the project does what was
  agreed" — always report both
