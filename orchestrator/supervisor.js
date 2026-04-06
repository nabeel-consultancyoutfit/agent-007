import { markDone, markFailed } from '../memory/task-state.js'
import { log } from '../observability/logger.js'
import { alert } from '../observability/alerts.js'

export async function supervise(task, agentFn) {
  const maxRetries = 3
  const backoffMs = [1000, 2000, 4000]
  const toolCallTracker = new Map()

  log('info', 'supervisor', `Supervising task ${task.id}`, { taskId: task.id })

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      log('info', 'supervisor', `Attempt ${attempt + 1} for task ${task.id}`, {
        taskId: task.id,
        attempt: attempt + 1
      })

      const result = await agentFn(task)

      if (result && result.toolCalls) {
        for (const call of result.toolCalls) {
          const key = `${call.tool}:${JSON.stringify(call.args)}`
          const count = (toolCallTracker.get(key) || 0) + 1
          toolCallTracker.set(key, count)

          if (count >= 3) {
            const loopError = new Error(
              `Loop detected: tool "${call.tool}" called with same args ${count} times`
            )
            log('error', 'supervisor', loopError.message, {
              taskId: task.id,
              tool: call.tool,
              args: call.args
            })
            await alert('loop_detected', loopError.message, {
              taskId: task.id,
              tool: call.tool
            })
            markFailed(task.id, loopError.message)
            throw loopError
          }
        }
      }

      markDone(task.id)
      log('info', 'supervisor', `Task ${task.id} completed successfully`, {
        taskId: task.id
      })
      return result
    } catch (error) {
      log('warn', 'supervisor', `Task ${task.id} failed on attempt ${attempt + 1}`, {
        taskId: task.id,
        attempt: attempt + 1,
        error: error.message
      })

      if (attempt < maxRetries - 1) {
        const delay = backoffMs[attempt]
        log('info', 'supervisor', `Retrying task ${task.id} in ${delay}ms`, {
          taskId: task.id,
          delay
        })
        await new Promise(resolve => setTimeout(resolve, delay))
      } else {
        markFailed(task.id, error.message)
        await alert('task_failed', `Task ${task.id} failed after ${maxRetries} retries`, {
          taskId: task.id,
          error: error.message
        })
        throw error
      }
    }
  }
}
