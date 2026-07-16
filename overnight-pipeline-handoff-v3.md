# Context: Overnight Autonomous Coding Pipeline (v3)

You are being brought in to help build a multi-agent coding pipeline. The architecture and design decisions below have already been made. Ask clarifying questions where details are missing.

## Goal
I queue up development tasks at the end of the day. Overnight, the pipeline works through them autonomously using headless Claude Code. In the morning, I review completed work as PRs. Everything runs in Docker with a closed network.

## Topology

- **One orchestrator total, and it lives on the host, outside every container.** It is a deterministic runner script (bash/Python), not an LLM. It enforces timeouts, budgets, and kill switches — the enforcer cannot live inside the thing it may need to kill.
- **One container per task.** The runner launches a fresh container per Beads issue (`docker run --rm`, wall-clock `timeout`, read-only mount of the pipeline scripts). Container exit code reports the outcome.
- **Inside the container, "agents" are ephemeral headless Claude Code invocations** (`claude -p`), run in a fixed sequence by the container's entrypoint script: code → verify → (retry loop) → docs → commit. Phases of a task are a fixed sequence, so they are scaffolding, not an LLM decision. There is no leader agent inside the container.
- **The verifier is scaffolding, not an agent.** It runs the frozen acceptance criteria and is invoked by the entrypoint script between coding attempts. The coding agent may run tests itself while working, but the authoritative pass/fail comes from the scaffolding's own run of the verifier after the agent exits. The verifier script is mounted read-only; the coding agent cannot edit it, same as the tests.
- **Everything durable lives outside the container** (the Beads issue, git); everything inside is disposable. "Kill the container" is therefore always a safe operation.

## Core Architecture Decisions

1. **Unit of work = a Beads issue; the pipeline = a loop over the Beads queue.** Work items are persistent and durable; agents are ephemeral and disposable. One task failing must never block the next. Sequential execution is fine; resilience matters more than parallelism.

2. **Beads is the work database.** Each task lives as a Beads issue containing: description, constraints, acceptance criteria, status, and an append-only log of attempt notes. The runner queries Beads for ready work. Agents append progress/stuck-state to the issue as they go. Because Beads is git-backed, the work queue versions and syncs with the repo itself. Failed tasks carry their full attempt history for the next attempt or morning review.

3. **Plans and tests are written interactively with me before I leave, never autonomously overnight.** The end-of-day planning session:
   - The plan agent drafts the spec AND the acceptance tests (it writes better tests than I would — expected and fine).
   - My role is to approve **intent**: I read the plain-English statement of what "done" means and confirm it matches what I want. I am the check on *what* gets built; the AI handles *how it's verified*.
   - On approval, the spec becomes a Beads issue, the test files are **committed and frozen**, and any new dependencies the task needs are declared so they can be baked into the image (see network policy).

4. **Tests are the steering signal, not after-the-fact assurance.** The overnight loop is: write code → run verifier → read failures → adjust → repeat. The frozen acceptance tests are the only feedback signal that loop has.
   - Tests are written **before the code exists**, from the spec — they encode intent, not whatever the code happens to do.
   - The coding agent **may not modify test files.** The verifier runs `git diff` on test paths as part of every check; any change is an automatic task failure.
   - "Tests" means machine-checkable evidence broadly: unit tests, build succeeds, linter passes, command produces expected output on sample input, migration applies cleanly, smoke test hits the endpoint.

5. **Verification is independent of generation.** The agent that writes code is never the judge of whether it works. "The agent says it's done" counts for nothing; "the frozen verifier passes" counts for everything. Verification failures are captured to a log and fed into the next coding attempt as feedback.

6. **Git isolation, with pushes done by the host.** Every task gets a fresh branch off main. Nothing ever touches main. The container commits locally to its workspace; the **host runner performs the push and PR creation** after the container exits successfully — so the container holds no git credentials and needs no git-host network access. PR description includes the plan, change summary, and verification evidence. Pipeline credentials must be physically incapable of pushing to main.

7. **Budgets and hard exits on every task.** Max wall-clock time (host-enforced `timeout` on the container), max coding iterations (entrypoint-enforced), max cost. Three failed verification attempts on the same error = bail (the plan is probably wrong). On budget exhaustion: append stuck-state to the Beads issue, commit WIP clearly labeled, mark the issue, move on.

8. **Rate limits are pauses, not failures.** The pipeline runs on a Claude subscription via headless Claude Code. When a usage limit is hit, the runner must detect it and **pause and resume** — park the current task, wait for the window to reset, continue. A rate limit must never be recorded as a task failure or trigger a WIP bailout. The issue's attempt log notes the pause so morning review can distinguish "stuck" from "waiting."

9. **Closed network: container egress is allowlisted to the Anthropic API only.** Rationale and consequences:
   - Fully-off is impossible: headless Claude Code is a network call to Anthropic's API — that endpoint is the agent's brain and is non-negotiable.
   - No git-host access from the container (host does the push — see #6).
   - No package registries at runtime: **dependencies are baked into the image.** New dependencies are declared during the planning session and the image is rebuilt before the overnight run; overnight installs run from cache/lockfile only. An agent that cannot pull arbitrary packages at 2 AM is a feature (no supply-chain surprises, no prompt-injection surface via web content).
   - Knowledge gaps from no web access are mitigated **in the repo**: vendor docs for critical dependencies into `docs/`, maintain `CLAUDE.md` with project conventions, and attach relevant API specifics to the Beads issue during planning. Tasks that genuinely require live internet research belong in the interactive daytime queue, not overnight.

10. **Container hygiene.** Fresh container per task; fresh checkout per task. Pipeline scripts (entrypoint, verifier) mounted read-only. Minimum-necessary secrets inside the container: Anthropic auth only.

11. **Morning report is a first-class deliverable.** Final stage produces a summary generated from Beads: per task — status (done / partial / failed / paused), branch name, what changed, verification evidence, attempt notes, items flagged for attention — ordered by how much scrutiny each needs. Recurring "didn't know the current API" failures are a signal to vendor those docs into the repo, not to open the network.

12. **Dumb orchestrator first.** Control flow, timeouts, rate-limit waits, attempt counting, and sequencing are deterministic scaffolding. Agents handle fuzzy work only (planning, coding, documenting). Orchestrator intelligence (decomposition, re-planning, cross-task learning) gets added only after the dumb loop works. Graduating to a fuller orchestrator (e.g., Gastown) is a possible later step — using Beads from day one keeps that door open.

## Reference Sketch (illustrative, not final code)

```bash
# runner.sh (host) — the entire orchestrator
for issue in $(bd list --status ready --json | jq -r '.[].id'); do
  bd update "$issue" --status in_progress
  timeout 4h docker run --rm --name "task-$issue" \
    --network pipeline-net \        # egress: api.anthropic.com only
    -v "$PWD/pipeline:/pipeline:ro" \
    -v "$(mktemp -d):/workspace" \
    -e ISSUE_ID="$issue" \
    pipeline-image /pipeline/entrypoint.sh
  case $? in
    0) push_branch_and_open_pr "$issue" ;;   # host holds the git token
    124) bd comment "$issue" "killed: wall-clock budget" ;;
    *) bd comment "$issue" "failed: see attempt log" ;;
  esac
done
generate_morning_report
```

```bash
# entrypoint.sh (in container, read-only) — per-task scaffolding
git clone /workspace/repo && git checkout -b "task/$ISSUE_ID"
SPEC=$(bd show "$ISSUE_ID")
for attempt in 1 2 3; do
  claude -p "Implement this spec: $SPEC. Feedback from last attempt: $FEEDBACK" \
    --allowedTools "..."
  /pipeline/verify.sh && exit 0        # authoritative pass/fail
  FEEDBACK=$(cat /tmp/verify-failures.log)
done
bd comment "$ISSUE_ID" "stuck after 3 attempts: $FEEDBACK"
git commit -am "WIP [failed verification]" ; exit 1
```

## Agent Design Principles 

- Workers are **stateless**: everything they need arrives via the Beads issue and the prompt; results return as structured output plus issue updates, not freeform prose. Every handoff is a typed contract.
- Hierarchy stays **flat**: one host orchestrator, one level of agent invocations. No nested orchestrators, no leader agent inside containers.
- **Observability from day one**: log every task spec, result, verifier run, and tool call with trace IDs linking each Beads issue to all downstream work.
- A worker reporting "I couldn't do this because X" is a first-class result type, not an error — it gets appended to the issue.

## V1 Build Order
1. Beads setup in the repo; issue template (description, constraints, acceptance criteria, attempt log)
2. Planning-session harness: plan agent drafts spec + tests → I approve intent → tests committed/frozen → issue created → new deps declared for image rebuild
3. Docker image with baked dependencies + the allowlist network (egress: Anthropic API only)
4. Runner script: loops ready issues, container per task, timeouts/budgets, rate-limit pause/resume, host-side push + PR on success
5. Entrypoint scaffolding: coding loop (headless Claude Code) + read-only verifier with the test-file `git diff` check + attempt-count bail
6. Morning report generator (reads Beads + git)

## Rollout Plan
Week one runs in **shadow mode**: tasks I would have done anyway get queued, and each morning the pipeline's output is graded against my own judgment. This calibrates whether the verification gates are tight enough to trust before the pipeline gets real responsibility.

## Your Job
Help me implement this, starting with the V1 build order above. Where the spec is silent (languages, frameworks, repo layout, test tooling, Beads specifics), ask me. Where it isn't, follow it.
