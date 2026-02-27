import { execFile } from 'child_process'
import { promisify } from 'util'
import { existsSync } from 'fs'
import { logExecution } from './logger.js'
import { updateTaskAfterRun } from './tasks.js'

const execFileAsync = promisify(execFile)

// Resolve claude CLI path — prefer full path to avoid PATH issues in daemon
function findClaude() {
  const candidates = [
    '/usr/local/bin/claude',
    '/opt/homebrew/bin/claude',
    `${process.env.HOME}/.npm/bin/claude`,
    `${process.env.HOME}/.local/bin/claude`,
  ]
  for (const c of candidates) {
    if (existsSync(c)) return c
  }
  return 'claude' // fall back to PATH
}

export async function runTask(task, { verbose = false } = {}) {
  const startTime = Date.now()
  const claude = findClaude()

  if (verbose) {
    process.stdout.write(`[${new Date().toISOString()}] Running task ${task.id}: ${task.prompt.slice(0, 60)}...\n`)
  }

  try {
    const { stdout, stderr } = await execFileAsync(
      claude,
      ['--dangerously-skip-permissions', '-p', task.prompt],
      {
        cwd: task.cwd || process.cwd(),
        timeout: 30 * 60 * 1000, // 30 min max per task
        maxBuffer: 10 * 1024 * 1024, // 10MB
        env: {
          ...process.env,
          // Ensure claude has a real terminal type
          TERM: process.env.TERM || 'xterm-256color',
        },
      }
    )

    const duration = Date.now() - startTime
    const entry = {
      success: true,
      duration,
      stdout: stdout.slice(0, 5000),
      stderr: stderr ? stderr.slice(0, 1000) : '',
      exitCode: 0,
    }

    logExecution(task.id, entry)
    updateTaskAfterRun(task.id, true)

    if (verbose) {
      process.stdout.write(`[${new Date().toISOString()}] Task ${task.id} completed in ${duration}ms\n`)
    }

    return { ...entry, taskId: task.id }
  } catch (err) {
    const duration = Date.now() - startTime
    const entry = {
      success: false,
      duration,
      stdout: err.stdout ? err.stdout.slice(0, 5000) : '',
      stderr: err.stderr ? err.stderr.slice(0, 2000) : err.message,
      exitCode: err.code || 1,
      error: err.message,
    }

    logExecution(task.id, entry)
    updateTaskAfterRun(task.id, false)

    if (verbose) {
      process.stderr.write(`[${new Date().toISOString()}] Task ${task.id} FAILED: ${err.message}\n`)
    }

    return { ...entry, taskId: task.id }
  }
}
