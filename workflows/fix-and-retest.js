import { delegateTask } from '../orchestrator/delegator.js'
import { log } from '../observability/logger.js'

const MAX_ATTEMPTS = 3

export async function runFixAndRetest(bugReport, attempt = 1) {
  if (attempt > MAX_ATTEMPTS) {
    log('error', 'fix-and-retest', `Max attempts (${MAX_ATTEMPTS}) reached, giving up`, {
      bugReport
    })
    return { fixed: false, attempts: attempt - 1 }
  }

  log('info', 'fix-and-retest', `Fix attempt ${attempt}/${MAX_ATTEMPTS}`, {
    errors: bugReport.errors
  })

  const errorText = (bugReport.errors || []).join(', ').toLowerCase()

  const frontendKeywords = ['component', 'page', 'form', 'table', 'ui', 'css', 'rtk', 'redux', 'mui']
  const backendKeywords = ['controller', 'service', 'schema', 'api', 'mongodb', 'auth', 'jwt', 'nest', 'dto']

  const isFrontend = frontendKeywords.some(kw => errorText.includes(kw))
  const isBackend = backendKeywords.some(kw => errorText.includes(kw))

  const agent = isFrontend && !isBackend ? 'frontend-agent' : 'backend-agent'

  log('info', 'fix-and-retest', `Routing fix to ${agent}`, { attempt })

  try {
    const fixTask = {
      id: `fix_${attempt}`,
      agent,
      description: `Fix this bug: ${bugReport.errors.join(', ')}`,
      dependsOn: []
    }

    await delegateTask(fixTask)
    log('info', 'fix-and-retest', 'Fix applied, re-running QA')

    const qaTask = {
      id: `retest_${attempt}`,
      agent: 'qa-agent',
      description: 'Re-run all tests to verify the fix. Run: npx playwright test && npm test --prefix backend',
      dependsOn: []
    }

    const qaResult = await delegateTask(qaTask)

    if (qaResult.result && qaResult.result.failed === 0) {
      log('info', 'fix-and-retest', `Fix verified on attempt ${attempt}`)
      return { fixed: true, attempts: attempt }
    }

    log('warn', 'fix-and-retest', `Tests still failing after attempt ${attempt}`, {
      failed: qaResult.result.failed
    })

    return runFixAndRetest(qaResult.result, attempt + 1)
  } catch (error) {
    log('error', 'fix-and-retest', `Fix attempt ${attempt} threw error: ${error.message}`)
    return runFixAndRetest(bugReport, attempt + 1)
  }
}
