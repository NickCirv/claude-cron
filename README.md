# claude-cron

Schedule recurring Claude Code tasks with cron expressions — crontab for AI.

<p align="center">
  <img src="https://img.shields.io/npm/v/claude-cron.svg" alt="npm version" />
  <img src="https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg" alt="node >= 18" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" />
</p>

## Why

Claude Code is powerful interactively, but some tasks should just run on a schedule: daily dependency audits, nightly test runs with a summary, weekly code quality reports, hourly monitoring checks. `claude-cron` gives you a persistent background daemon that fires `claude` with your prompts on any cron schedule, logs every execution, and hot-reloads new tasks without a restart.

## Quick Start

```bash
# Add a daily 9am task
npx claude-cron add "0 9 * * *" "Audit dependencies for security issues and summarize findings"

# Add a weekly report (Monday 8am) in a specific project directory
npx claude-cron add "0 8 * * 1" "Generate a code quality report for this week" --name "weekly-review" --cwd ~/my-project

# Start the background daemon
npx claude-cron start

# Check what's running
npx claude-cron status
```

## What It Does

- Stores tasks in `~/.claude-cron/tasks.json` — survives restarts
- Runs `claude --dangerously-skip-permissions -p <prompt>` in the task's working directory
- Daemon forks into the background (detached process) with PID tracking
- Hot-reloads: new tasks added while daemon is running are picked up within 60 seconds
- Respects system timezone via `Intl.DateTimeFormat`
- Logs every execution with success/fail status, duration, stdout, and stderr
- 30-minute timeout per task, 10MB output buffer
- Manually trigger any task with `run <id>` for testing

## Example Output

```
$ npx claude-cron status

claude-cron status

Daemon:  running (PID 48291)
Tasks:   3 total, 3 enabled

  [on ] a1b2c3d4  daily-audit   0 9 * * *    last: 2/28/2026, 9:00:01 AM
  [on ] e5f6g7h8  weekly-review 0 8 * * 1    last: 2/24/2026, 8:00:14 AM
  [on ] i9j0k1l2  hourly-ping   0 * * * *    last: 2/28/2026, 3:00:07 PM


$ npx claude-cron logs --limit 5

Last 5 execution(s):

2/28/2026, 3:00:07 PM [i9j0k1l2] OK  1,243ms
2/28/2026, 9:00:01 AM [a1b2c3d4] OK  8,712ms
2/27/2026, 3:00:06 PM [i9j0k1l2] OK  1,189ms
2/27/2026, 9:00:02 AM [a1b2c3d4] FAIL  3,201ms
  Error: claude: command not found
```

## Commands

### `add <schedule> <prompt>`

Add a new scheduled task.

| Option | Description | Default |
|--------|-------------|---------|
| `-n, --name <name>` | Human-readable label | — |
| `-d, --cwd <dir>` | Working directory for the task | current dir |

Schedule uses standard 5-field cron syntax: `minute hour day month weekday`

Common schedules:
- `"0 9 * * *"` — 9am daily
- `"0 8 * * 1"` — 8am every Monday
- `"*/30 * * * *"` — every 30 minutes
- `"0 0 * * *"` — midnight daily

### `list`

Show all tasks and daemon status.

### `remove <id>` (alias: `rm`)

Remove a task by ID (partial match supported).

### `run <id>`

Manually trigger a task immediately and show output.

### `start`

Start the background daemon.

| Option | Description |
|--------|-------------|
| `-f, --foreground` | Run in foreground instead of forking |

### `stop`

Stop the running daemon.

### `status`

Show daemon status and task summary.

### `logs [id]`

Show execution history.

| Option | Description | Default |
|--------|-------------|---------|
| `-n, --limit <n>` | Number of entries to show | `20` |

## Requirements

- Node.js 18+
- Claude Code CLI (`claude`) installed and on your PATH

## Install Globally

```bash
npm i -g claude-cron
```

## License

MIT
