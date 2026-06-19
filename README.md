<div align="center">

# claude-cron

**Schedule recurring Claude Code tasks with cron expressions — crontab for AI**

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?labelColor=0B0A09)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg?labelColor=0B0A09)](package.json)

</div>

## Install

```bash
npx github:NickCirv/claude-cron <command>
```

Or install globally:

```bash
npm i -g github:NickCirv/claude-cron
```

## Usage

```bash
# Add a daily 9am dependency audit
claude-cron add "0 9 * * *" "Audit dependencies for security issues and summarize findings"

# Add a weekly report (Monday 8am) in a specific project directory
claude-cron add "0 8 * * 1" "Generate a code quality report" --name "weekly-review" --cwd ~/my-project

# Start the background daemon
claude-cron start

# Check what's running
claude-cron status
```

| Command | Description |
|---------|-------------|
| `add <schedule> <prompt>` | Add a new scheduled task (`-n` name, `-d` cwd) |
| `list` | Show all tasks and daemon status |
| `start` | Start the background daemon (`-f` foreground) |
| `stop` | Stop the running daemon |
| `status` | Show daemon status and task summary |
| `run <id>` | Manually trigger a task immediately |
| `remove <id>` | Remove a task by ID (alias: `rm`) |
| `logs [id]` | Show execution history (`-n` limit, default 20) |

## What it does

`claude-cron` runs a persistent background daemon that fires `claude` with your prompts on any cron schedule. Tasks are stored in `~/.claude-cron/tasks.json` and survive restarts. Each execution is logged with status, duration, stdout, and stderr — and new tasks are hot-reloaded within 60 seconds without restarting the daemon.

**Requirements:** Node.js 18+ and the Claude Code CLI (`claude`) on your PATH.

---

<sub>Node ≥18 · MIT · by <a href="https://github.com/NickCirv">NickCirv</a></sub>
