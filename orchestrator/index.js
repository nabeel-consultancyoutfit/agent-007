import { planTasks } from './planner.js'
import { delegateTask } from './delegator.js'
import { supervise } from './supervisor.js'
import { log } from '../observability/logger.js'
import { getAll } from '../memory/task-state.js'

export async function runOrchestrator(prompt) {
  const startTime = Date.now()
  log('info', 'orchestrator', 'Starting orchestration', { prompt })

  const tasks = planTasks(prompt)
  log('info', 'orchestrator', `Planned ${tasks.length} tasks`)

  const results = { completed: 0, failed: 0, details: [] }

  for (const task of tasks) {
    log('step', 'orchestrator', `Processing task ${task.id}: ${task.description}`)

    if (task.dependsOn.length > 0) {
      const allTasks = getAll()
      const unmetDeps = task.dependsOn.filter(depId => {
        const dep = allTasks.find(t => t.id === depId)
        return !dep || dep.status !== 'done'
      })
      if (unmetDeps.length > 0) {
        log('warn', 'orchestrator', `Skipping task ${task.id} — unmet dependencies`, {
          unmetDeps
        })
        results.failed++
        results.details.push({
          taskId: task.id,
          status: 'skipped',
          reason: `Unmet dependencies: ${unmetDeps.join(', ')}`
        })
        continue
      }
    }

    try {
      const result = await supervise(task, () => delegateTask(task))
      results.completed++
      results.details.push({ taskId: task.id, status: 'done', result })
      log('info', 'orchestrator', `Task ${task.id} done`)
    } catch (error) {
      results.failed++
      results.details.push({
        taskId: task.id,
        status: 'failed',
        error: error.message
      })
      log('error', 'orchestrator', `Task ${task.id} failed: ${error.message}`)
    }
  }

  const duration = Date.now() - startTime
  const summary = {
    completed: results.completed,
    failed: results.failed,
    duration: `${(duration / 1000).toFixed(1)}s`,
    details: results.details
  }

  log('info', 'orchestrator', 'Orchestration complete', summary)
  return summary
}
