// PostToolUse format hook. Run with `node`, which is the same command on
// Windows and in the Linux sandbox, so this works in both places. It reads the
// hook payload from stdin, pulls out the edited file, and formats it.
// Fail-safe: if the formatter isn't installed, it skips silently and never
// errors.
const { spawnSync } = require("child_process");
const fs = require("fs");

let file;
try {
  const payload = JSON.parse(fs.readFileSync(0, "utf8"));
  file = payload.tool_input && payload.tool_input.file_path;
} catch {
  process.exit(0);
}
if (!file) process.exit(0);

// Only format web files.
if (!/\.(html|css|js|json|md)$/.test(file)) process.exit(0);

// This template has no package.json, so `--yes` lets npx fetch prettier without
// stopping to ask. On Windows the launcher is `npx.cmd`; on Linux it's `npx`.
const npx = process.platform === "win32" ? "npx.cmd" : "npx";
spawnSync(npx, ["--yes", "prettier", "--write", file], { stdio: "ignore" });
process.exit(0);
