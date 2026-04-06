import { delegateTask } from '../orchestrator/delegator.js'
import { log } from '../observability/logger.js'

export async function runAddFeature(featureDescription) {
  log('info', 'add-feature', `Adding feature: ${featureDescription}`)

  const steps = [
    {
      id: 'af_001',
      agent: 'backend-agent',
      description: `Add NestJS module for: ${featureDescription}`,
      dependsOn: []
    },
    {
      id: 'af_002',
      agent: 'frontend-agent',
      description: `Add frontend feature page for: ${featureDescription}`,
      dependsOn: ['af_001']
    },
    {
      id: 'af_003',
      agent: 'qa-agent',
      description: `Test the new feature: ${featureDescription}`,
      dependsOn: ['af_002']
    }
  ]

  const results = []

  for (const step of steps) {
    log('step', 'add-feature', `Executing step ${step.id}: ${step.agent}`)

    try {
      const result = await delegateTask(step)
      results.push({ stepId: step.id, success: true, result })
      log('info', 'add-feature', `Step ${step.id} completed`)
    } catch (error) {
      log('error', 'add-feature', `Step ${step.id} failed: ${error.message}`)
      results.push({ stepId: step.id, success: false, error: error.message })
    }
  }

  const summary = {
    feature: featureDescription,
    totalSteps: steps.length,
    completed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  }

  log('info', 'add-feature', 'Add-feature workflow complete', summary)
  return summary
}
