---
description: Deploy the current project to its hosting environment.
---
Deploy the current project to its hosting environment.

## Steps

1. Check what kind of project this is and how it has been deployed before:
   - Look for deployment config files (Vercel, Netlify, Railway, Heroku, fly.toml, etc.)
   - Check `package.json` for deploy scripts
   - Check git remotes for clues
2. If a deployment method is already set up: run it and report the result
3. If no deployment is configured yet:
   - Ask: "Where would you like to host this? I can help set up a free option if you're not sure."
   - Recommend the simplest free option for the project type (e.g., Vercel for web apps, Railway for backends)
   - Walk the user through setup step by step in plain language
4. After deploying, confirm the live URL and check that it loads correctly
5. Report success or explain any errors in plain language

## Rules
- Always confirm with the user before deploying to production
- Explain what "deploying" means in context if this is the user's first time
- Never expose secrets or API keys during the deploy process
