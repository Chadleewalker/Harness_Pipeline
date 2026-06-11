Stage all changes, generate a commit message, and push to the remote repository.

## Steps

1. Run `git status` to see what files changed
2. Run `git diff` to understand what actually changed in those files
3. Stage all appropriate files — skip any that look like secrets (.env, credentials, keys)
4. Write a clear one-line commit message that describes what changed and why
5. **Show the user** what will be committed and the proposed message — wait for a yes/no before proceeding
6. If confirmed: create the commit
7. Check whether the project is connected to GitHub (`git remote -v`):
   - **Connected:** push, then report the result
   - **Not connected (common for brand-new projects):** the commit is still saved on this
     computer. Tell the user that, and ask if they want a GitHub backup — if yes, create a
     private repository with `gh repo create` and push; if no, stop here, all done
8. Report success or explain any errors in plain language

## Rules
- Never skip the confirmation step before pushing
- Never use `--no-verify` or force flags
- If there's nothing to commit, say so clearly
- If the push fails, explain why in plain English and suggest what to do next
