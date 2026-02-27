import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { CRON_DIR } from './tasks.js'

const LOGS_DIR = join(CRON_DIR, 'logs')
const MAX_LOG_ENTRIES = 100

function ensureLogsDir() {
  if (!existsSync(LOGS_DIR)) {
    mkdirSync(LOGS_DIR, { recursive: true })
  }
}

function taskLogFile(taskId) {
  return join(LOGS_DIR, `${taskId}.json`)
}

function readTaskLogs(taskId) {
  ensureLogsDir()
  const file = taskLogFile(taskId)
  if (!existsSync(file)) return []
  try {
    return JSON.parse(readFileSync(file, 'utf-8'))
  } catch {
    return []
  }
}

function writeTaskLogs(taskId, logs) {
  ensureLogsDir()
  writeFileSync(taskLogFile(taskId), JSON.stringify(logs, null, 2), 'utf-8')
}

export function logExecution(taskId, entry) {
  const logs = readTaskLogs(taskId)
  const record = {
    ...entry,
    timestamp: new Date().toISOString(),
  }
  logs.unshift(record)
  // Keep only the last MAX_LOG_ENTRIES
  if (logs.length > MAX_LOG_ENTRIES) {
    logs.splice(MAX_LOG_ENTRIES)
  }
  writeTaskLogs(taskId, logs)
  return record
}

export function getTaskLogs(taskId, limit = 20) {
  return readTaskLogs(taskId).slice(0, limit)
}

export function getAllLogs(limit = 50) {
  ensureLogsDir()
  const files = readdirSync(LOGS_DIR).filter(f => f.endsWith('.json'))
  const all = []
  for (const file of files) {
    const taskId = file.replace('.json', '')
    const logs = readTaskLogs(taskId)
    for (const log of logs) {
      all.push({ ...log, taskId })
    }
  }
  all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  return all.slice(0, limit)
}
