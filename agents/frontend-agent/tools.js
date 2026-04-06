export const frontendTools = [
  {
    name: 'read_file',
    description: 'Reads the contents of a file at the given path and returns it as a string',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Absolute or relative file path to read' }
      },
      required: ['path']
    }
  },
  {
    name: 'write_file',
    description: 'Writes content to a file at the given path, creating parent directories if they do not exist',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'File path to write to' },
        content: { type: 'string', description: 'Content to write to the file' }
      },
      required: ['path', 'content']
    }
  },
  {
    name: 'list_directory',
    description: 'Lists all files and folders in a directory, returning names and types',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Directory path to list' }
      },
      required: ['path']
    }
  },
  {
    name: 'run_command',
    description: 'Runs a shell command in the given working directory and returns stdout/stderr',
    input_schema: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'Shell command to execute' },
        cwd: { type: 'string', description: 'Working directory for the command' }
      },
      required: ['command']
    }
  },
  {
    name: 'http_request',
    description: 'Makes an HTTP request (GET/POST/PATCH/DELETE) and returns status code and response body',
    input_schema: {
      type: 'object',
      properties: {
        method: { type: 'string', enum: ['GET', 'POST', 'PATCH', 'DELETE'], description: 'HTTP method' },
        url: { type: 'string', description: 'Full URL to request' },
        body: { type: 'object', description: 'Request body for POST/PATCH/DELETE' },
        headers: { type: 'object', description: 'Additional request headers' }
      },
      required: ['method', 'url']
    }
  }
]
