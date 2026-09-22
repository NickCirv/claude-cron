# claude-cron — documentation research

Reviewed 21 September 2026. Public GitHub source only.

## Revision and scope

- Commit: [`827c3d37a5857668bcf6e6e023dc70d5d8bc09b2`](https://github.com/NickCirv/claude-cron/commit/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2).
- Tree: `9dcdc9c30bb39b98ab2562a424e338e2a886fe08`; truncated: `false`.
- Capture: 12 of 12 eligible text files; all eligible text files.
- Method: package and entrypoint inspection, implementation-interface review, targeted behavior/limitation inspection, and test-source review. This is not an exhaustive correctness or security audit.
- Commands run against repository code: **none**. External services, deployment and npm publication were not verified.

## Claim and evidence map

| Documentation claim | Pinned evidence | Assessment |
| --- | --- | --- |
| Runtime, executable and development commands | [package.json](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/package.json) | Source declaration inspected; runtime unverified |
| Schedules recurring prompts for an installed Claude CLI and keeps local execution logs. | [bin/cron.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/bin/cron.js) · [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) | Implementation interfaces inspected; behavior not executed |
| Cron-expression validation; named tasks; manual runs; background/foreground scheduler; per-task execution history. | [bin/cron.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/bin/cron.js), [src/daemon.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/daemon.js), [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js), [src/logger.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/logger.js), [src/runner.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/runner.js), [src/scheduler.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/scheduler.js), [src/tasks.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/tasks.js) | Source-backed scope, not a test result |
| Running a task invokes Claude in its configured working directory and can change that project. The daemon must remain running for scheduled execution. Authentication and current CLI compatibility are unverified. | [bin/cron.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/bin/cron.js), [src/daemon.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/daemon.js), [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js), [src/logger.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/logger.js), [src/runner.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/runner.js), [src/scheduler.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/scheduler.js), [src/tasks.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/tasks.js) | Material limits documented; service compatibility remains open |
| Existing checks | [test/smoke.test.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/test/smoke.test.js) | Test source read; no passing-run claim |

## Documentation inventory and disposition

| Existing document | Decision |
| --- | --- |
| [README.md](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/README.md) | Rewritten with source-specific purpose, direct checkout setup, limitations and verification status. Old section fragments retained where practical. |

Added `docs/REFERENCE.md` for the observed implementation and command surface, and this research record. Protected license and attribution files remain in their original locations without edits. No source or product UI was changed.

## Quality dimensions

| Dimension | Status | Evidence / next step |
| --- | --- | --- |
| Pinned provenance | Verified | Captured commit, tree and per-file hashes recorded below |
| Interface documentation | Partially verified | Source inspection only; run clean-checkout quickstart |
| Runtime behavior | Unverified | No repository execution in this review |
| Test results | Unverified | Existing tests were not run |
| Deployment / package availability | Unverified | No remote publish or live-service check |
| Visual / link checks | Unverified | Portfolio renderer and independent QA are separate from this authoring step |

## Unresolved issues

Running a task invokes Claude in its configured working directory and can change that project. The daemon must remain running for scheduled execution. Authentication and current CLI compatibility are unverified.

## Captured source inventory

This lists captured provenance, not a claim that every line received a full audit. Binary/generated/excluded files are outside the eligible text capture.

| File | SHA-256 | Bytes |
| --- | --- | --- |
| [LICENSE](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/LICENSE) | `8edf13ba2a2e443fa49e42493414f6952a4a14b6c407983a7c95162ab37f6265` | 1065 |
| [README.md](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/README.md) | `fb42bf807498b55378c99aed9275c175d1490b95243ebdcb0f53bc622f9b0e1f` | 1898 |
| [package.json](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/package.json) | `e64f1a67ade344749669d92463b9d49e1aa6d317cca491477df6849afd38db63` | 957 |
| [.github/workflows/ci.yml](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/.github/workflows/ci.yml) | `433fbf65635a767ef5cd787147104c248d0cea6bbd6523c6c862f915e0e3206a` | 384 |
| [bin/cron.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/bin/cron.js) | `66d5693e86a09ebee0f95b8325576dae68fa7561feb34681cf1e09f2aa415f82` | 121 |
| [src/daemon.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/daemon.js) | `a393325e62d5d5dad85910b33b67731f13f9637403dc51cfb7862af65d901498` | 151 |
| [src/index.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/index.js) | `4cd7127217f05dabdb22869c61d8940ebeaf3e9dad451836180a38746782152f` | 9495 |
| [src/logger.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/logger.js) | `356cf3fb63caf5483e371be33940aba121bb81a64ab446314e9d90a38cad070c` | 1637 |
| [src/runner.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/runner.js) | `2caf61b02a6de726275527d8c3dceb54433d89931888da1d6f15358217a16139` | 2368 |
| [src/scheduler.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/scheduler.js) | `f64c93817f883ab5bdf628e124b3defe8311d6f3503d04120238beedb64be36b` | 3132 |
| [src/tasks.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/src/tasks.js) | `5b9505eeb6f5ec722808033a19cee160dd24015f6de184e435fc92c68b382dd9` | 2014 |
| [test/smoke.test.js](https://github.com/NickCirv/claude-cron/blob/827c3d37a5857668bcf6e6e023dc70d5d8bc09b2/test/smoke.test.js) | `05fc363c34b86966078635dbe5c3a7613a935db384de936417b8379cb5bae185` | 340 |
