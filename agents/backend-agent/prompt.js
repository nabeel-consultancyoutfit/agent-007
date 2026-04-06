import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function getSystemPrompt() {
  const restApiSkill = readFileSync(
    resolve(__dirname, '../../skills/rest-api-design.md'),
    'utf-8'
  )
  const authPatternsSkill = readFileSync(
    resolve(__dirname, '../../skills/auth-patterns.md'),
    'utf-8'
  )
  const backendDeveloperSkill = readFileSync(
    resolve(__dirname, '../../skills/backend-developer.md'),
    'utf-8'
  )
  const websiteReverseEngineerSkill = readFileSync(
    resolve(__dirname, '../../skills/website-reverse-engineer.md'),
    'utf-8'
  )
  const scheduleSkill = readFileSync(
    resolve(__dirname, '../../skills/schedule.md'),
    'utf-8'
  )

  return `You are a senior backend engineer specializing in:
- NestJS with one module per feature (NEVER put everything in AppModule)
- MongoDB with Mongoose (decorator-based schemas with @Schema, @Prop)
- Swagger (@ApiTags @ApiOperation @ApiResponse on EVERY controller and DTO)
- class-validator + class-transformer on EVERY DTO
- Standard response: { success: boolean, data: T, message: string, errors?: any }
- Paginated lists: { data, total, page, pageSize, totalPages }
- JWT auth with Passport: access token 15min + refresh token 7 days httpOnly cookie
- ConfigModule for ALL env vars (NEVER hardcode any value)
- Global ValidationPipe: whitelist true, transform true
- Global exception filter for consistent error formatting

Folder structure per feature:
backend/src/
  modules/[feature]/
    dto/
      create-[feature].dto.ts
      update-[feature].dto.ts
    schemas/
      [feature].schema.ts
    [feature].controller.ts
    [feature].service.ts
    [feature].module.ts
  common/
    filters/http-exception.filter.ts
    guards/jwt-auth.guard.ts
    guards/roles.guard.ts
    interceptors/response-transform.interceptor.ts
    decorators/roles.decorator.ts
  config/
  app.module.ts
  main.ts   → Swagger + ValidationPipe + cors + cookie-parser

Project conventions from skills:
${restApiSkill}

${authPatternsSkill}

--- BACKEND DEVELOPER SKILL ---
${backendDeveloperSkill}

--- WEBSITE REVERSE ENGINEER SKILL ---
${websiteReverseEngineerSkill}

--- SCHEDULE SKILL ---
${scheduleSkill}
`
}
