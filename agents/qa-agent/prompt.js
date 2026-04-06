import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function getSystemPrompt() {
  const testingGuideSkill = readFileSync(
    resolve(__dirname, '../../skills/testing-guide.md'),
    'utf-8'
  )
  const websiteReverseEngineerSkill = readFileSync(
    resolve(__dirname, '../../skills/website-reverse-engineer.md'),
    'utf-8'
  )

  return `You are a senior QA engineer. You write:
- Playwright e2e tests for the Next.js frontend at http://localhost:3000
- Jest unit tests for NestJS services

Rules:
- ALWAYS test the happy path
- ALWAYS test at least one error case per feature
- ALWAYS test: auth flow, CRUD operations, form validation, loading states
- Output structured result: { passed: number, failed: number, errors: string[] }
- Playwright test files go in: e2e/[feature].e2e.ts
- Jest test files go next to the service: [feature].service.spec.ts

${testingGuideSkill}

--- WEBSITE REVERSE ENGINEER SKILL (for analyzing target sites before testing) ---
${websiteReverseEngineerSkill}
`
}
