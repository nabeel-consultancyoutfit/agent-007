import { getSystemPrompt } from './prompt.js'
import { qaTools } from './tools.js'
import { readFile, writeFile } from '../../tools/file-system.js'
import { runCommand } from '../../tools/run-command.js'
import { httpRequest } from '../../tools/http-client.js'
import { browserAction, closeBrowser } from '../../tools/browser.js'
import { log } from '../../observability/logger.js'
import { addTask, markDone, markFailed } from '../../memory/task-state.js'

const toolFunctions = {
  read_file: ({ path }) => readFile(path),
  write_file: ({ path, content }) => writeFile(path, content),
  run_command: ({ command, cwd }) => runCommand(command, cwd),
  http_request: ({ method, url, body, headers }) => httpRequest(method, url, body, headers),
  browser_action: ({ action, options }) => browserAction(action, options)
}

export async function runQaAgent(task) {
  const systemPrompt = getSystemPrompt()
  const tools = qaTools
  const filesCreated = []

  log('info', 'qa-agent', `Starting task: ${task.id}`, {
    description: task.description
  })

  addTask(task.id, task.description, 'qa-agent')

  try {
    const toolCalls = parseTaskToToolCalls(task.description)

    for (const call of toolCalls) {
      const fn = toolFunctions[call.tool]
      if (!fn) {
        log('warn', 'qa-agent', `Unknown tool: ${call.tool}`)
        continue
      }

      const start = Date.now()
      const result = await fn(call.input)
      const duration = Date.now() - start

      log('info', 'qa-agent', `Tool call: ${call.tool}`, {
        tool: call.tool,
        input: call.input,
        result,
        durationMs: duration
      })

      if (call.tool === 'write_file' && result.success) {
        filesCreated.push(call.input.path)
      }
    }

    await closeBrowser()

    markDone(task.id)
    log('info', 'qa-agent', `Task ${task.id} completed`, { filesCreated })

    return {
      success: true,
      result: { passed: 0, failed: 0, errors: [] },
      filesCreated
    }
  } catch (error) {
    await closeBrowser()

    markFailed(task.id, error.message)
    log('error', 'qa-agent', `Task ${task.id} failed: ${error.message}`)
    return {
      success: false,
      result: { passed: 0, failed: 0, errors: [error.message] },
      filesCreated
    }
  }
}

function parseTaskToToolCalls(description) {
  const calls = []
  const lower = description.toLowerCase()

  if (lower.includes('playwright') || lower.includes('e2e')) {
    calls.push({
      tool: 'run_command',
      input: { command: 'npx playwright install chromium', cwd: '.' }
    })
    calls.push({
      tool: 'run_command',
      input: { command: 'npx playwright test', cwd: '.' }
    })
  }

  if (lower.includes('jest') || lower.includes('unit')) {
    calls.push({
      tool: 'run_command',
      input: { command: 'npm test', cwd: 'backend' }
    })
  }

  return calls
}
