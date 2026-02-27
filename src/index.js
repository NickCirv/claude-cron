import { Command } from 'commander'
import chalk from 'chalk'
import { addTask, listTasks, getTask, removeTask } from './tasks.js'
import { runTask } from './runner.js'
import { getAllLogs, getTaskLogs } from './logger.js'
import { validateCronExpression, getDaemonPid, stopDaemon } from './scheduler.js'
import { fileURLToPath } from 'url'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fork } from 'child_process'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'))

export function createCLI() {
  const program = new Command()

  program
    .name('claude-cron')
    .description('Schedule recurring Claude Code tasks')
    .version(pkg.version)

  // ─── ADD ───────────────────────────────────────────────────────────────────
  program
    .command('add <schedule> <prompt>')
    .description('Add a new scheduled task')
    .option('-n, --name <name>', 'Human-readable name for the task')
    .option('-d, --cwd <dir>', 'Working directory for the task (default: current dir)')
    .action((schedule, prompt, opts) => {
      if (!validateCronExpression(schedule)) {
        console.error(chalk.red(`Invalid cron expression: ${schedule}`))
        console.error(chalk.dim('Examples: "0 9 * * *" (9am daily), "*/5 * * * *" (every 5 min)'))
        process.exit(1)
      }

      const task = addTask(schedule, prompt, {
        name: opts.name,
        cwd: opts.cwd,
      })

      console.log(chalk.green('Task added:'))
      printTask(task)
      console.log()
      console.log(chalk.dim('Run ' + chalk.white('claude-cron start') + ' to activate the scheduler.'))
    })

  // ─── LIST ──────────────────────────────────────────────────────────────────
  program
    .command('list')
    .description('List all scheduled tasks')
    .action(() => {
      const tasks = listTasks()
      if (tasks.length === 0) {
        console.log(chalk.dim('No tasks. Add one with: claude-cron add "<schedule>" "<prompt>"'))
        return
      }

      const pid = getDaemonPid()
      const statusLine = pid
        ? chalk.green(`Daemon running (PID ${pid})`)
        : chalk.yellow('Daemon not running — start with: claude-cron start')

      console.log(statusLine)
      console.log()

      for (const task of tasks) {
        printTask(task)
        console.log()
      }
    })

  // ─── REMOVE ────────────────────────────────────────────────────────────────
  program
    .command('remove <id>')
    .alias('rm')
    .description('Remove a scheduled task')
    .action((id) => {
      const removed = removeTask(id)
      if (!removed) {
        console.error(chalk.red(`Task not found: ${id}`))
        process.exit(1)
      }
      console.log(chalk.green(`Removed task ${removed.id}: ${removed.name || removed.prompt.slice(0, 60)}`))
    })

  // ─── RUN ───────────────────────────────────────────────────────────────────
  program
    .command('run <id>')
    .description('Manually trigger a task now')
    .action(async (id) => {
      const task = getTask(id)
      if (!task) {
        console.error(chalk.red(`Task not found: ${id}`))
        process.exit(1)
      }

      console.log(chalk.cyan(`Running task ${task.id}: ${(task.name || task.prompt).slice(0, 60)}...`))
      const result = await runTask(task, { verbose: true })

      if (result.success) {
        console.log(chalk.green(`Done in ${result.duration}ms`))
        if (result.stdout) {
          console.log(chalk.dim('─── output ───'))
          console.log(result.stdout)
        }
      } else {
        console.error(chalk.red(`Failed after ${result.duration}ms`))
        if (result.stderr) {
          console.error(chalk.dim('─── error ───'))
          console.error(result.stderr)
        }
        process.exit(1)
      }
    })

  // ─── LOGS ──────────────────────────────────────────────────────────────────
  program
    .command('logs [id]')
    .description('Show execution history (all tasks or specific task)')
    .option('-n, --limit <n>', 'Number of entries to show', '20')
    .action((id, opts) => {
      const limit = parseInt(opts.limit, 10)
      const logs = id ? getTaskLogs(id, limit) : getAllLogs(limit)

      if (logs.length === 0) {
        console.log(chalk.dim('No execution logs yet.'))
        return
      }

      console.log(chalk.bold(`Last ${logs.length} execution(s):\n`))

      for (const log of logs) {
        const ts = chalk.dim(new Date(log.timestamp).toLocaleString())
        const tid = chalk.cyan(log.taskId || id || '?')
        const status = log.success ? chalk.green('OK') : chalk.red('FAIL')
        const dur = chalk.dim(`${log.duration}ms`)
        console.log(`${ts} [${tid}] ${status} ${dur}`)
        if (!log.success && log.stderr) {
          console.log(chalk.dim('  ' + log.stderr.split('\n')[0]))
        }
      }
    })

  // ─── START ─────────────────────────────────────────────────────────────────
  program
    .command('start')
    .description('Start the background scheduler daemon')
    .option('-f, --foreground', 'Run in foreground (no daemon fork)')
    .action(async (opts) => {
      if (opts.foreground) {
        const { startScheduler } = await import('./scheduler.js')
        startScheduler()
        return
      }

      const existing = getDaemonPid()
      if (existing) {
        console.log(chalk.yellow(`Daemon already running (PID ${existing})`))
        return
      }

      const daemonScript = join(__dirname, 'daemon.js')
      const child = fork(daemonScript, [], {
        detached: true,
        stdio: 'ignore',
      })
      child.unref()

      // Give it a moment to write the PID file
      await new Promise(r => setTimeout(r, 500))

      const pid = getDaemonPid()
      if (pid) {
        console.log(chalk.green(`Daemon started (PID ${pid})`))
      } else {
        console.log(chalk.yellow('Daemon started (could not confirm PID)'))
      }
    })

  // ─── STOP ──────────────────────────────────────────────────────────────────
  program
    .command('stop')
    .description('Stop the background scheduler daemon')
    .action(() => {
      const stopped = stopDaemon()
      if (stopped) {
        console.log(chalk.green('Daemon stopped.'))
      } else {
        console.log(chalk.yellow('No daemon running.'))
      }
    })

  // ─── STATUS ────────────────────────────────────────────────────────────────
  program
    .command('status')
    .description('Show daemon status and task summary')
    .action(() => {
      const pid = getDaemonPid()
      const tasks = listTasks()
      const enabled = tasks.filter(t => t.enabled)

      console.log(chalk.bold('claude-cron status'))
      console.log()
      console.log(`Daemon:  ${pid ? chalk.green(`running (PID ${pid})`) : chalk.red('stopped')}`)
      console.log(`Tasks:   ${chalk.white(tasks.length)} total, ${chalk.green(enabled.length)} enabled`)

      if (tasks.length > 0) {
        console.log()
        for (const task of tasks) {
          const badge = task.enabled ? chalk.green('on ') : chalk.dim('off')
          const last = task.lastRun
            ? chalk.dim(`last: ${new Date(task.lastRun).toLocaleString()}`)
            : chalk.dim('never run')
          console.log(`  [${badge}] ${chalk.cyan(task.id)} ${task.name || task.prompt.slice(0, 50)} ${last}`)
        }
      }
    })

  return program
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function printTask(task) {
  const badge = task.enabled ? chalk.green('enabled') : chalk.dim('disabled')
  const runs = task.runCount ? chalk.dim(`${task.runCount} run(s)`) : chalk.dim('never run')
  const last = task.lastRun ? chalk.dim(`last: ${new Date(task.lastRun).toLocaleString()}`) : ''

  console.log(`  ${chalk.cyan(task.id)}  ${badge}  ${runs}  ${last}`)
  if (task.name) console.log(`  ${chalk.bold(task.name)}`)
  console.log(`  ${chalk.white('Schedule:')} ${task.schedule}`)
  console.log(`  ${chalk.white('Prompt:')}   ${task.prompt}`)
  console.log(`  ${chalk.white('Cwd:')}      ${task.cwd}`)
  console.log(`  ${chalk.white('Created:')}  ${new Date(task.createdAt).toLocaleString()}`)
}
