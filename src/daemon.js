// Daemon entry point — spawned as a detached child process by `claude-cron start`
import { startScheduler } from './scheduler.js'

startScheduler()
