# Reads the hook payload from stdin, extracts the edited file, and formats it.
$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
$file = $payload.tool_input.file_path
if (-not $file) { exit 0 }

# Only format Python files.
if ($file -notmatch '\.py$') { exit 0 }

python -m ruff format $file 2>$null

exit 0
