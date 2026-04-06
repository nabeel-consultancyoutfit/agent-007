import { getSystemPrompt } from './prompt.js'
import { backendTools } from './tools.js'
import { readFile, writeFile, listDir } from '../../tools/file-system.js'
import { runCommand } from '../../tools/run-command.js'
import { httpRequest } from '../../tools/http-client.js'
import { dbQuery } from '../../tools/database.js'
import { log } from '../../observability/logger.js'
import { addTask, markDone, markFailed } from '../../memory/task-state.js'

const toolFunctions = {
  read_file: ({ path }) => readFile(path),
  write_file: ({ path, content }) => writeFile(path, content),
  list_directory: ({ path }) => listDir(path),
  run_command: ({ command, cwd }) => runCommand(command, cwd),
  http_request: ({ method, url, body, headers }) => httpRequest(method, url, body, headers),
  db_query: ({ operation, collection, filter, data }) => dbQuery(operation, collection, filter, data)
}

export async function runBackendAgent(task) {
  const systemPrompt = getSystemPrompt()
  const tools = backendTools
  const filesCreated = []

  log('info', 'backend-agent', `Starting task: ${task.id}`, {
    description: task.description
  })

  addTask(task.id, task.description, 'backend-agent')

  try {
    const toolCalls = parseTaskToToolCalls(task.description)

    for (const call of toolCalls) {
      const fn = toolFunctions[call.tool]
      if (!fn) {
        log('warn', 'backend-agent', `Unknown tool: ${call.tool}`)
        continue
      }

      const start = Date.now()
      const result = await fn(call.input)
      const duration = Date.now() - start

      log('info', 'backend-agent', `Tool call: ${call.tool}`, {
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
    log('info', 'backend-agent', `Task ${task.id} completed`, { filesCreated })

    return { success: true, result: 'Backend task completed', filesCreated }
  } catch (error) {
    markFailed(task.id, error.message)
    log('error', 'backend-agent', `Task ${task.id} failed: ${error.message}`)
    return { success: false, result: error.message, filesCreated }
  }
}

function parseTaskToToolCalls(description) {
  const calls = []
  const lower = description.toLowerCase()

  if (lower.includes('scaffold') || lower.includes('nestjs')) {
    calls.push({
      tool: 'run_command',
      input: {
        command: 'npx @nestjs/cli new backend --package-manager npm',
        cwd: '.'
      }
    })
  }

  if (lower.includes('install')) {
    calls.push({
      tool: 'run_command',
      input: {
        command: 'npm install @nestjs/mongoose mongoose @nestjs/passport passport passport-jwt passport-local @nestjs/jwt @nestjs/config @nestjs/swagger class-validator class-transformer cookie-parser bcrypt',
        cwd: 'backend'
      }
    })
  }

  if (lower.includes('build') || lower.includes('create') || lower.includes('module')) {
    calls.push({
      tool: 'list_directory',
      input: { path: 'backend/src' }
    })
  }

  return calls
}
