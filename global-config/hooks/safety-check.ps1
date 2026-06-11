# Reads the tool call from stdin and blocks known-dangerous commands.
# Exit 2 = block the command (the message must go to the error stream).
# Exit 0 = allow.

$raw = [Console]::In.ReadToEnd()
try { $payload = $raw | ConvertFrom-Json } catch { exit 0 }

$command = $payload.tool_input.command
if (-not $command) { exit 0 }

$blocked = @(
    @{ pattern = 'git push --force'; reason = "Force-pushing can overwrite other people's work and is very hard to undo." },
    @{ pattern = 'git push -f ';     reason = "Force-pushing can overwrite other people's work and is very hard to undo." },
    @{ pattern = 'git reset --hard'; reason = 'This permanently discards uncommitted changes.' },
    @{ pattern = 'git clean -f';     reason = 'This permanently deletes untracked files.' },
    @{ pattern = 'rm -rf /';         reason = 'This would delete everything on the system.' },
    @{ pattern = 'rm -rf ~';         reason = 'This would delete your entire home folder.' },
    @{ pattern = 'Format-Volume';    reason = 'This formats a disk drive.' },
    @{ pattern = 'diskpart';         reason = 'This is a disk partitioning tool that can cause data loss.' }
)

foreach ($entry in $blocked) {
    if ($command -like "*$($entry.pattern)*") {
        [Console]::Error.WriteLine("BLOCKED: $($entry.reason) Ask the user to explicitly confirm before running this.")
        exit 2
    }
}

exit 0
