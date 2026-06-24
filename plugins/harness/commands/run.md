---
description: Start the current project, whatever type it is.
---
Start the current project, regardless of what type it is.

## Steps

1. Look at the project files to figure out what kind of project this is:
   - `package.json` with a `start` script → Node.js/JavaScript app
   - `package.json` with no start script → check for common entry points (index.js, server.js)
   - `requirements.txt` or `.py` files → Python app
   - `.csproj` or `.sln` → C# / .NET app
   - `index.html` → Static web page (open in browser or serve locally)
2. Run the appropriate start command
3. Tell the user what's running and how to access it (e.g., "Open http://localhost:3000 in your browser")
4. Watch for startup errors and report them in plain language if anything goes wrong

## Rules
- If you're not sure how to start the project, look for a README or ask
- Never run the project in a way that would expose it publicly without confirming with the user first
