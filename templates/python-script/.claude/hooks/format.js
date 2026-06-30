// PostToolUse format hook. Run with `node`, which is the same command on
// Windows and in the Linux sandbox, so this works in both places. It reads the
// hook payload from stdin, pulls out the edited file, and formats it.
// Fail-safe: if the formatter (or its runtime) isn't installed, it skips
// silently and never errors.
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

// Only format Python files.
if (!/\.py$/.test(file)) process.exit(0);

// ruff is a Python tool. The interpreter is named `python` on Windows and
// `python3` on the Linux sandbox, so try the right one first and stop as soon
// as one actually runs. A missing ruff just exits non-zero, which we ignore.
const pythons = process.platform === "win32" ? ["python", "python3"] : ["python3", "python"];
for (const py of pythons) {
  const result = spawnSync(py, ["-m", "ruff", "format", file], { stdio: "ignore" });
  if (!result.error) break;
}
process.exit(0);
