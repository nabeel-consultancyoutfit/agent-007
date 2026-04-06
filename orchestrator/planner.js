import { addTask } from '../memory/task-state.js'
import { log } from '../observability/logger.js'

export function planTasks(prompt) {
  log('info', 'planner', 'Planning tasks from prompt', { prompt })

  const lower = prompt.toLowerCase()
  const tasks = []

  let backendDesc = 'Set up backend API'
  let frontendDesc = 'Build frontend UI'
  let qaDesc = 'Run tests and QA'

  if (lower.includes('auth') || lower.includes('login')) {
    backendDesc = 'Build backend auth module with JWT login/register/refresh endpoints'
    frontendDesc = 'Build frontend auth pages with login and register forms'
    qaDesc = 'Test auth flow: login, register, protected routes, token refresh'
  }

  if (lower.includes('crud') || lower.includes('manage') || lower.includes('dashboard')) {
    backendDesc = 'Build backend CRUD module with paginated list, create, update, delete endpoints'
    frontendDesc = 'Build frontend dashboard with data table, forms, and CRUD operations'
    qaDesc = 'Test CRUD operations: list, create, edit, delete, validation errors'
  }

  if (lower.includes('ecommerce') || lower.includes('shop') || lower.includes('product')) {
    backendDesc = 'Build backend product and order modules with search, cart, and checkout APIs'
    frontendDesc = 'Build frontend product catalog, cart, and checkout pages'
    qaDesc = 'Test e-commerce flow: browse products, add to cart, checkout, order history'
  }

  if (lower.includes('blog') || lower.includes('cms') || lower.includes('content')) {
    backendDesc = 'Build backend content module with posts, categories, and media upload APIs'
    frontendDesc = 'Build frontend content management pages with rich text editor and media gallery'
    qaDesc = 'Test CMS flow: create post, edit post, upload media, publish, list with pagination'
  }

  const taskList = [
    {
      id: 'task_001',
      description: backendDesc + ' — Goal: ' + prompt,
      agent: 'backend-agent',
      dependsOn: []
    },
    {
      id: 'task_002',
      description: frontendDesc + ' — Goal: ' + prompt,
      agent: 'frontend-agent',
      dependsOn: ['task_001']
    },
    {
      id: 'task_003',
      description: qaDesc + ' — Goal: ' + prompt,
      agent: 'qa-agent',
      dependsOn: ['task_002']
    }
  ]

  for (const task of taskList) {
    addTask(task.id, task.description, task.agent)
  }

  log('info', 'planner', `Planned ${taskList.length} tasks`, {
    taskIds: taskList.map(t => t.id)
  })

  return taskList
}
