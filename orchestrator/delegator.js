import { log } from '../observability/logger.js'

export async function delegateTask(task) {
  log('info', 'delegator', `Delegating task ${task.id} to ${task.agent}`, {
    taskId: task.id,
    agent: task.agent,
    description: task.description
  })

  let result

  switch (task.agent) {
    case 'frontend-agent': {
      const { runFrontendAgent } = await import('../agents/frontend-agent/index.js')
      result = await runFrontendAgent(task)
      break
    }
    case 'backend-agent': {
      const { runBackendAgent } = await import('../agents/backend-agent/index.js')
      result = await runBackendAgent(task)
      break
    }
    case 'qa-agent': {
      const { runQaAgent } = await import('../agents/qa-agent/index.js')
      result = await runQaAgent(task)
      break
    }
    default:
      throw new Error(`Unknown agent: ${task.agent}`)
  }

  log('info', 'delegator', `Task ${task.id} completed by ${task.agent}`, {
    taskId: task.id,
    success: result.success
  })

  return result
}
