import { exec } from 'child_process'

export function runCommand(command, cwd = process.cwd()) {
  return new Promise(resolve => {
    exec(command, { cwd, timeout: 60000 }, (error, stdout, stderr) => {
      if (error) {
        resolve({
          success: false,
          stdout: stdout || '',
          stderr: stderr || error.message,
          exitCode: error.code || 1,
          error: error.message
        })
      } else {
        resolve({
          success: true,
          stdout: stdout || '',
          stderr: stderr || '',
          exitCode: 0
        })
      }
    })
  })
}

export const schemas = [
  {
    name: 'run_command',
    description: 'Runs a shell command in a given working directory with a 60s timeout',
    input_schema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Shell command to execute' },
        cwd: { type: 'string', description: 'Working directory (defaults to process.cwd())' }
      },
      required: ['command']
    }
  }
]
