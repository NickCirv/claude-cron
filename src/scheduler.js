import cron from 'node-cron'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { listTasks, CRON_DIR } from './tasks.js'
import { runTask } from './runner.js'

const PID_FILE = join(CRON_DIR, 'daemon.pid')
const running = new Map() // taskId → cron job

export function validateCronExpression(expr) {
  return cron.validate(expr)
}

export function startScheduler() {
  // Write PID so stop command can find us
  writeFileSync(PID_FILE, String(process.pid), 'utf-8')

  const tasks = listTasks()
  let scheduled = 0

  for (const task of tasks) {
    if (!task.enabled) continue
    if (!cron.validate(task.schedule)) {
      process.stderr.write(`[claude-cron] Invalid schedule for task ${task.id}: ${task.schedule}\n`)
      continue
    }

    const job = cron.schedule(task.schedule, async () => {
      process.stdout.write(`[claude-cron] Firing task ${task.id}: ${(task.name || task.prompt).slice(0, 60)}\n`)
      await runTask(task, { verbose: true })
    }, {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    running.set(task.id, job)
    scheduled++
  }

  process.stdout.write(`[claude-cron] Daemon started (PID ${process.pid}). ${scheduled} task(s) scheduled.\n`)

  // Re-read tasks periodically so newly added tasks are picked up without restart
  setInterval(reconcile, 60 * 1000)

  // Handle graceful shutdown
  process.on('SIGTERM', shutdown)
  process.on('SIGINT', shutdown)
}

function reconcile() {
  const tasks = listTasks()
  const taskIds = new Set(tasks.map(t => t.id))

  // Remove jobs for deleted/disabled tasks
  for (const [id, job] of running) {
    const task = tasks.find(t => t.id === id)
    if (!task || !task.enabled) {
      job.stop()
      running.delete(id)
    }
  }

  // Add jobs for new/enabled tasks
  for (const task of tasks) {
    if (!task.enabled || running.has(task.id)) continue
    if (!cron.validate(task.schedule)) continue

    const job = cron.schedule(task.schedule, async () => {
      process.stdout.write(`[claude-cron] Firing task ${task.id}: ${(task.name || task.prompt).slice(0, 60)}\n`)
      await runTask(task, { verbose: true })
    }, {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    })

    running.set(task.id, job)
    process.stdout.write(`[claude-cron] Scheduled new task ${task.id}\n`)
  }
}

function shutdown() {
  process.stdout.write('[claude-cron] Shutting down...\n')
  for (const [, job] of running) {
    job.stop()
  }
  running.clear()
  try {
    if (existsSync(PID_FILE)) {
      import('fs').then(({ unlinkSync }) => unlinkSync(PID_FILE)).catch(() => {})
    }
  } catch {}
  process.exit(0)
}

export function getDaemonPid() {
  if (!existsSync(PID_FILE)) return null
  try {
    const pid = parseInt(readFileSync(PID_FILE, 'utf-8').trim(), 10)
    // Check if process is actually running
    process.kill(pid, 0)
    return pid
  } catch {
    return null
  }
}

export function stopDaemon() {
  const pid = getDaemonPid()
  if (!pid) return false
  try {
    process.kill(pid, 'SIGTERM')
    return true
  } catch {
    return false
  }
}
