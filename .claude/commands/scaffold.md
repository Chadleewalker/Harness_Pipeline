Create a new project from scratch. Claude picks the right language and tools based on what the user wants to build.

## Steps

1. Ask: "What do you want to build? Describe it in plain terms — what should it do?"
2. Based on the answer, decide the best language and framework. Tell the user your choice in one sentence (e.g., "I'll use Python for this since it's great for scripts and you won't need to install much").
3. Ask: "What should the project be called, and where should I create it?" (suggest `C:\Code\ProjectName` as a default)
4. Create the project folder and initialize it (git init, create package.json / requirements.txt / etc. as appropriate)
5. Create a local `CLAUDE.md` in the new project that inherits from the master harness — include the project name and a one-line description
6. Set up the basic file structure for that project type
7. Set up the auto-format hook appropriate for the language (see Format Hooks below): create `.claude\hooks\format.ps1` and a `.claude\settings.json` that calls it
8. Show the user a summary of what was created in plain language

## Local CLAUDE.md Template
The new project's CLAUDE.md should start with:
```
# [Project Name]

[One-line description of what this project does]

This project was created with the Universal AI Harness.
Master rules and skills: C:\Code\Harness\CLAUDE.md

## Project-Specific Notes
[Add anything specific to this project here]
```

## Format Hooks
Claude Code does NOT substitute a `${file}` placeholder in command hooks — it sends the
edited file's path as JSON on standard input. So the hook must read that input and pull out
the path itself. Set this up in two parts.

**Part A — create `.claude\hooks\format.ps1`** in the new project. This reads the hook
payload from stdin, extracts the edited file, and formats it. Use the formatter line that
matches the project's language:

```powershell
# Reads the hook payload from stdin, extracts the edited file, formats it.
$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
$file = $payload.tool_input.file_path
if (-not $file) { exit 0 }

# --- formatter line (pick ONE, based on language) ---
# JavaScript / TypeScript:
npx prettier --write $file 2>$null
# Python (use this line instead of the one above):
# python -m ruff format $file 2>$null

exit 0
```

**Part B — create `.claude\settings.json`** that calls the script above. This is the same
for every language; `${CLAUDE_PROJECT_DIR}` IS substituted by Claude Code, so it's safe to
use here:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "powershell -NoProfile -ExecutionPolicy Bypass -File \"${CLAUDE_PROJECT_DIR}\\.claude\\hooks\\format.ps1\""
          }
        ]
      }
    ]
  }
}
```

**Other / unknown:** Skip the format hook (don't create `format.ps1`) and note in the
project CLAUDE.md that formatting is not yet configured.

## Rules
- Never ask the user to choose a language or framework — decide for them
- Prefer the simplest stack that gets the job done
- If the user's description is unclear, ask one clarifying question before proceeding
