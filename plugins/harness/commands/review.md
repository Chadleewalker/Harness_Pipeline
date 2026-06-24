---
description: Review the current code changes and explain findings in plain English.
---
Review the current code changes and explain findings in plain, everyday language.

## Steps

1. Run `git diff` to see what changed, or if no git diff is available, read the relevant files
2. Review for:
   - **Bugs** — things that will break or behave unexpectedly
   - **Security problems** — passwords in code, unsafe inputs, exposed data
   - **Simplifications** — places where the code is more complicated than it needs to be
3. Present findings as a plain-English list — no jargon, no code unless necessary
4. Rate the overall state: Good / A few things to fix / Needs attention
5. Ask if the user wants you to fix anything

## Rules
- Explain every finding as if the user has never programmed before
- Don't flag style preferences as bugs — only report things that actually matter
- If everything looks good, say so clearly — don't invent problems
