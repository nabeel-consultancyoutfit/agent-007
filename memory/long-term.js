import { readFileSync, writeFileSync, existsSync } from 'fs'

const MEMORY_FILE = '.dex-memory.json'

function readMemory() {
  if (!existsSync(MEMORY_FILE)) {
    return {}
  }
  try {
    return JSON.parse(readFileSync(MEMORY_FILE, 'utf-8'))
  } catch {
    return {}
  }
}

function writeMemory(data) {
  writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export function store(key, text) {
  const memory = readMemory()
  memory[key] = { key, text, timestamp: new Date().toISOString() }
  writeMemory(memory)
  return memory[key]
}

export function search(query) {
  const memory = readMemory()
  const words = query.toLowerCase().split(/\s+/)
  const entries = Object.values(memory)

  return entries.filter(entry => {
    const lower = entry.text.toLowerCase()
    return words.some(word => lower.includes(word))
  })
}
