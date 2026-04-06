import { EventEmitter } from 'events'
import { appendFileSync, mkdirSync, existsSync } from 'fs'

export const logEmitter = new EventEmitter()

const LOG_DIR = 'logs'
const LOG_FILE = `${LOG_DIR}/agent-run.log`

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true })
  }
}

export function log(level, agent, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    agent,
    message,
    meta
  }

  ensureLogDir()
  appendFileSync(LOG_FILE, JSON.stringify(entry) + '\n', 'utf-8')

  logEmitter.emit('log', entry)

  if (level === 'error') {
    console.error(JSON.stringify(entry))
  }
}
