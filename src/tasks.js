import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import { randomUUID } from 'crypto'

const CRON_DIR = join(homedir(), '.claude-cron')
const TASKS_FILE = join(CRON_DIR, 'tasks.json')

function ensureDir() {
  if (!existsSync(CRON_DIR)) {
    mkdirSync(CRON_DIR, { recursive: true })
  }
}

function readTasks() {
  ensureDir()
  if (!existsSync(TASKS_FILE)) {
    return []
  }
  try {
    return JSON.parse(readFileSync(TASKS_FILE, 'utf-8'))
  } catch {
    return []
  }
}

function writeTasks(tasks) {
  ensureDir()
  writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf-8')
}

export function addTask(schedule, prompt, options = {}) {
  const tasks = readTasks()
  const task = {
    id: randomUUID().slice(0, 8),
    schedule,
    prompt,
    name: options.name || null,
    cwd: options.cwd || process.cwd(),
    enabled: true,
    createdAt: new Date().toISOString(),
    lastRun: null,
    runCount: 0,
  }
  tasks.push(task)
  writeTasks(tasks)
  return task
}

export function listTasks() {
  return readTasks()
}

export function getTask(id) {
  const tasks = readTasks()
  return tasks.find(t => t.id === id || t.id.startsWith(id)) || null
}

export function removeTask(id) {
  const tasks = readTasks()
  const idx = tasks.findIndex(t => t.id === id || t.id.startsWith(id))
  if (idx === -1) return null
  const [removed] = tasks.splice(idx, 1)
  writeTasks(tasks)
  return removed
}

export function updateTaskAfterRun(id, success) {
  const tasks = readTasks()
  const task = tasks.find(t => t.id === id)
  if (!task) return
  task.lastRun = new Date().toISOString()
  task.runCount = (task.runCount || 0) + 1
  task.lastRunSuccess = success
  writeTasks(tasks)
}

export function toggleTask(id, enabled) {
  const tasks = readTasks()
  const task = tasks.find(t => t.id === id || t.id.startsWith(id))
  if (!task) return null
  task.enabled = enabled
  writeTasks(tasks)
  return task
}

export { CRON_DIR }
