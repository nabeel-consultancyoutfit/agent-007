import { getSystemPrompt } from './prompt.js'
import { frontendTools } from './tools.js'
import { readFile, writeFile, listDir } from '../../tools/file-system.js'
import { runCommand } from '../../tools/run-command.js'
import { httpRequest } from '../../tools/http-client.js'
import { log } from '../../observability/logger.js'
import { addTask, markDone, markFailed } from '../../memory/task-state.js'

const toolFunctions = {
  read_file: ({ path }) => readFile(path),
  write_file: ({ path, content }) => writeFile(path, content),
  list_directory: ({ path }) => listDir(path),
  run_command: ({ command, cwd }) => runCommand(command, cwd),
  http_request: ({ method, url, body, headers }) => httpRequest(method, url, body, headers)
}

export async function runFrontendAgent(task) {
  const systemPrompt = getSystemPrompt()
  const tools = frontendTools
  const filesCreated = []

  log('info', 'frontend-agent', `Starting task: ${task.id}`, {
    description: task.description
  })

  addTask(task.id, task.description, 'frontend-agent')

  try {
    const toolCalls = parseTaskToToolCalls(task.description)

    for (const call of toolCalls) {
      const fn = toolFunctions[call.tool]
      if (!fn) {
        log('warn', 'frontend-agent', `Unknown tool: ${call.tool}`)
        continue
      }

      const start = Date.now()
      const result = await fn(call.input)
      const duration = Date.now() - start

      log('info', 'frontend-agent', `Tool call: ${call.tool}`, {
        tool: call.tool,
        input: call.input,
        result,
        durationMs: duration
      })

      if (call.tool === 'write_file' && result.success) {
        filesCreated.push(call.input.path)
      }
    }

    markDone(task.id)
    log('info', 'frontend-agent', `Task ${task.id} completed`, { filesCreated })

    return { success: true, result: 'Frontend task completed', filesCreated }
  } catch (error) {
    markFailed(task.id, error.message)
    log('error', 'frontend-agent', `Task ${task.id} failed: ${error.message}`)
    return { success: false, result: error.message, filesCreated }
  }
}

function parseTaskToToolCalls(description) {
  const calls = []
  const lower = description.toLowerCase()

  if (lower.includes('scaffold') || lower.includes('create') || lower.includes('set up')) {
    if (lower.includes('next.js') || lower.includes('frontend')) {
      calls.push({
        tool: 'run_command',
        input: {
          command: 'npx create-next-app@latest frontend --typescript --app --no-tailwind --no-eslint --src-dir',
          cwd: '.'
        }
      })
    }
  }

  if (lower.includes('install')) {
    calls.push({
      tool: 'run_command',
      input: {
        command: 'npm install @mui/material @mui/icons-material @emotion/react @emotion/styled @reduxjs/toolkit react-redux @tanstack/react-table react-hook-form zod @hookform/resolvers',
        cwd: 'frontend'
      }
    })
  }

  if (lower.includes('build') || lower.includes('create')) {
    calls.push({
      tool: 'list_directory',
      input: { path: 'frontend/src' }
    })
  }

  return calls
}
