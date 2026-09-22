# claude-cron — implementation reference

Source revision: `827c3d37a5857668bcf6e6e023dc70d5d8bc09b2`. This reference records source declarations; it is not a transcript of a successful run.

## Entrypoint and runtime

[package.json](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/package.json) declares `bin/cron.js`. Node.js `>=18.0.0` and npm.

Executable mapping: `claude-cron` → `./bin/cron.js`.

## Supported workflow

Cron-expression validation; named tasks; manual runs; background/foreground scheduler; per-task execution history.

Running a task invokes Claude in its configured working directory and can change that project. The daemon must remain running for scheduled execution. Authentication and current CLI compatibility are unverified.

## Declared command interface

Options belong to the preceding command in the linked source; they are not necessarily global.

| Kind | Declaration | Source description | Source |
| --- | --- | --- | --- |
| command | `add <schedule> <prompt>` | Add a new scheduled task | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| option | `-n, --name <name>` | Human-readable name for the task | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| option | `-d, --cwd <dir>` | Working directory for the task (default: current dir) | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| command | `list` | List all scheduled tasks | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| command | `remove <id>` | See the workflow description above for this command. | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| command | `run <id>` | Manually trigger a task now | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| command | `logs [id]` | Show execution history (all tasks or specific task) | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| option | `-n, --limit <n>` | Number of entries to show | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| command | `start` | Start the background scheduler daemon | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| option | `-f, --foreground` | Run in foreground (no daemon fork) | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| command | `stop` | Stop the background scheduler daemon | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |
| command | `status` | Show daemon status and task summary | [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) |

## Option defaults

These are literal defaults or parsers declared by the command builder; flags belong to their command as shown above.

| Option | Declared default / parser |
| --- | --- |
| `-n, --limit <n>` | `'20'` |

## Package scripts

| Script | Exact command |
| --- | --- |
| `start` | `node bin/cron.js start` |
| `test` | `node --test` |

## Implementation sources

[src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js).

## Verification boundary

No repository code, tests, network operation, hook installer or migration was executed for this review. Source inspection supports the documented interface; runtime correctness and external-service compatibility remain unverified.
