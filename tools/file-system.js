import { readFile as fsReadFile, writeFile as fsWriteFile, unlink, readdir, mkdir } from 'fs/promises'
import { dirname } from 'path'

export async function readFile(path) {
  try {
    const content = await fsReadFile(path, 'utf-8')
    return { success: true, content }
  } catch (error) {
    return { success: false, content: null, error: error.message }
  }
}

export async function writeFile(path, content) {
  try {
    await mkdir(dirname(path), { recursive: true })
    await fsWriteFile(path, content, 'utf-8')
    return { success: true, path }
  } catch (error) {
    return { success: false, path, error: error.message }
  }
}

export async function deleteFile(path) {
  try {
    await unlink(path)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

export async function listDir(path) {
  try {
    const entries = await readdir(path, { withFileTypes: true })
    return {
      success: true,
      entries: entries.map(e => ({
        name: e.name,
        type: e.isDirectory() ? 'directory' : 'file'
      }))
    }
  } catch (error) {
    return { success: false, entries: [], error: error.message }
  }
}

export const schemas = [
  {
    name: 'read_file',
    description: 'Reads the contents of a file at the given path',
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
    description: 'Writes content to a file, creating parent directories if needed',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'File path to write to' },
        content: { type: 'string', description: 'Content to write' }
      },
      required: ['path', 'content']
    }
  },
  {
    name: 'delete_file',
    description: 'Deletes a file at the given path',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'File path to delete' }
      },
      required: ['path']
    }
  },
  {
    name: 'list_directory',
    description: 'Lists files and folders in a directory',
    input_schema: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Directory path to list' }
      },
      required: ['path']
    }
  }
]
