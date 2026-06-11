# Reads the hook payload from stdin, extracts the edited file, and formats it.
$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
$file = $payload.tool_input.file_path
if (-not $file) { exit 0 }

# Only format web files.
if ($file -notmatch '\.(html|css|js|json|md)$') { exit 0 }

# --yes lets npx download prettier without stopping to ask (this template has no package.json to install it from)
npx --yes prettier --write $file 2>$null

exit 0
