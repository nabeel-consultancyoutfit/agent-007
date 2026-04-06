import { readFileSync, writeFileSync, existsSync } from 'fs'

const TASKS_FILE = '.agent-tasks.json'
const tasks = new Map()

function loadFromDisk() {
  if (existsSync(TASKS_FILE)) {
    try {
      const data = JSON.parse(readFileSync(TASKS_FILE, 'utf-8'))
      for (const task of data) {
        tasks.set(task.id, task)
      }
    } catch {
      // Start fresh if file is corrupted
    }
  }
}

function saveToDisk() {
  const data = Array.from(tasks.values())
  writeFileSync(TASKS_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

loadFromDisk()

export function addTask(id, description, agent) {
  const task = {
    id,
    description,
    agent,
    status: 'pending',
    startedAt: Date.now()
  }
  tasks.set(id, task)
  saveToDisk()
  return task
}

export function markDone(id) {
  const task = tasks.get(id)
  if (task) {
    task.status = 'done'
    task.completedAt = Date.now()
    saveToDisk()
  }
  return task
}

export function markFailed(id, reason) {
  const task = tasks.get(id)
  if (task) {
    task.status = 'failed'
    task.reason = reason
    task.failedAt = Date.now()
    saveToDisk()
  }
  return task
}

export function getPending() {
  return Array.from(tasks.values()).filter(t => t.status === 'pending')
}

export function getFailed() {
  return Array.from(tasks.values()).filter(t => t.status === 'failed')
}

export function getAll() {
  return Array.from(tasks.values())
}
