#!/usr/bin/env node
import 'dotenv/config'
import { runOrchestrator } from './orchestrator/index.js'

const prompt = process.argv[2]
if (!prompt) {
  console.error('Usage: node index.js "your goal here"')
  process.exit(1)
}

runOrchestrator(prompt).then(summary => {
  console.log('Done:', summary)
}).catch(err => {
  console.error('Failed:', err.message)
  process.exit(1)
})
