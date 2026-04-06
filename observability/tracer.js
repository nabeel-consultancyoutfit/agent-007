import { writeFileSync, mkdirSync, existsSync } from 'fs'

const traces = new Map()
const TRACES_DIR = 'logs/traces'

function ensureTracesDir() {
  if (!existsSync(TRACES_DIR)) {
    mkdirSync(TRACES_DIR, { recursive: true })
  }
}

export function startTrace(runId) {
  const trace = {
    runId,
    startedAt: new Date().toISOString(),
    steps: []
  }
  traces.set(runId, trace)
  return trace
}

export function addStep(runId, agent, tool, input, output, durationMs) {
  const trace = traces.get(runId)
  if (!trace) return null

  const step = {
    agent,
    tool,
    input,
    output,
    durationMs,
    timestamp: new Date().toISOString()
  }
  trace.steps.push(step)
  return step
}

export function endTrace(runId) {
  const trace = traces.get(runId)
  if (!trace) return null

  trace.endedAt = new Date().toISOString()
  trace.totalDuration = new Date(trace.endedAt) - new Date(trace.startedAt)

  ensureTracesDir()
  writeFileSync(
    `${TRACES_DIR}/${runId}.json`,
    JSON.stringify(trace, null, 2),
    'utf-8'
  )

  return trace
}
