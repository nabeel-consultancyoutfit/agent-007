import { delegateTask } from '../orchestrator/delegator.js'
import { log } from '../observability/logger.js'
import { runFixAndRetest } from './fix-and-retest.js'

export async function runBuildWorkflow(goal) {
  log('info', 'workflow', `Starting build-fullstack-app workflow`, { goal })

  const steps = [
    {
      id: 'wf_001',
      agent: 'backend-agent',
      description: `Scaffold NestJS project in backend/ folder. Run: npx @nestjs/cli new backend --package-manager npm. Then install: @nestjs/mongoose mongoose @nestjs/passport passport passport-jwt passport-local @nestjs/jwt @nestjs/config @nestjs/swagger class-validator class-transformer cookie-parser bcrypt. Create folder structure: src/common/filters src/common/guards src/common/interceptors src/common/decorators src/config`,
      dependsOn: []
    },
    {
      id: 'wf_002',
      agent: 'backend-agent',
      description: `Build auth module in backend/src/modules/auth/. Create: user.schema.ts with email+password+refreshToken fields, register.dto.ts, login.dto.ts, auth.controller.ts with /auth/register /auth/login /auth/refresh /auth/logout routes, auth.service.ts with bcrypt hashing and JWT signing, auth.module.ts. Update main.ts with Swagger setup + ValidationPipe + cors + cookie-parser.`,
      dependsOn: ['wf_001']
    },
    {
      id: 'wf_003',
      agent: 'frontend-agent',
      description: `Scaffold Next.js 14 project in frontend/ folder. Run: npx create-next-app@latest frontend --typescript --app --no-tailwind --no-eslint --src-dir. Then install: @mui/material @mui/icons-material @emotion/react @emotion/styled @mui/material-nextjs @reduxjs/toolkit react-redux @tanstack/react-table react-hook-form zod @hookform/resolvers. Create folder structure: src/components/common/DataTable src/components/layout src/features/auth src/lib/store src/lib/api/endpoints src/lib/theme src/types`,
      dependsOn: ['wf_002']
    },
    {
      id: 'wf_004',
      agent: 'frontend-agent',
      description: `Set up frontend foundation: Create lib/theme/theme.ts with MUI theme. Create lib/store/store.ts with Redux store + RTK Query. Create lib/store/hooks.ts with typed useAppDispatch and useAppSelector. Create lib/store/StoreProvider.tsx as 'use client' component. Create lib/api/baseApi.ts with RTK Query base and Bearer auth header. Create src/app/layout.tsx wrapping with AppRouterCacheProvider + ThemeProvider + StoreProvider + CssBaseline. Create types/api.types.ts with PaginatedResponse and ApiError types.`,
      dependsOn: ['wf_003']
    },
    {
      id: 'wf_005',
      agent: 'frontend-agent',
      description: `Build auth feature: Create lib/api/endpoints/auth.api.ts with RTK Query login/register/refresh/logout mutations. Create features/auth/types/auth.types.ts. Create features/auth/components/LoginForm.tsx using react-hook-form + zod + MUI. Create features/auth/components/RegisterForm.tsx. Create app/(auth)/login/page.tsx. Create app/(auth)/register/page.tsx. Create middleware.ts for protected route redirect.`,
      dependsOn: ['wf_004']
    },
    {
      id: 'wf_006',
      agent: 'frontend-agent',
      description: `Build dashboard layout: Create components/layout/Header.tsx with MUI AppBar + user menu. Create components/layout/Sidebar.tsx with MUI Drawer + navigation links. Create app/dashboard/layout.tsx combining Header + Sidebar. Create app/dashboard/page.tsx as dashboard home. Create components/common/DataTable/DataTable.tsx as reusable TanStack + MUI table component with sorting, pagination, search.`,
      dependsOn: ['wf_005']
    },
    {
      id: 'wf_007',
      agent: 'backend-agent',
      description: `Build main CRUD feature module based on goal: ${goal}. Create all files in backend/src/modules/[feature]/: schema, create DTO, update DTO, service with paginated findAll + findOne + create + update + remove, controller with Swagger decorators + JwtAuthGuard, module. Register module in app.module.ts.`,
      dependsOn: ['wf_006']
    },
    {
      id: 'wf_008',
      agent: 'frontend-agent',
      description: `Build main feature page based on goal: ${goal}. Create features/[feature]/types/[feature].types.ts. Create lib/api/endpoints/[feature].api.ts with RTK Query CRUD endpoints and tag invalidation. Create features/[feature]/components/[Feature]Table.tsx using DataTable component. Create features/[feature]/components/[Feature]Form.tsx using react-hook-form + zod + MUI Dialog. Create app/dashboard/[feature]/page.tsx connecting table + form + RTK Query.`,
      dependsOn: ['wf_007']
    },
    {
      id: 'wf_009',
      agent: 'qa-agent',
      description: `Write and run tests. Create e2e/auth.e2e.ts with Playwright: test login happy path, wrong password error, protected route redirect. Create e2e/[feature].e2e.ts with Playwright: test list view loads, create form submits, edit works, delete works. Create backend/src/modules/[feature]/[feature].service.spec.ts with Jest unit tests. Run: npx playwright test. Return { passed, failed, errors[] }.`,
      dependsOn: ['wf_008']
    }
  ]

  const results = []

  for (const step of steps) {
    log('step', 'workflow', `Executing step ${step.id}: ${step.agent}`, {
      stepId: step.id,
      description: step.description
    })

    try {
      const result = await delegateTask(step)
      results.push({ stepId: step.id, success: true, result })
      log('info', 'workflow', `Step ${step.id} completed`)

      if (step.id === 'wf_009' && result.result && result.result.failed > 0) {
        log('warn', 'workflow', 'Tests failed, running fix-and-retest', {
          failed: result.result.failed,
          errors: result.result.errors
        })
        const fixResult = await runFixAndRetest(result.result, 1)
        results.push({ stepId: 'wf_fix', success: fixResult.fixed, result: fixResult })
      }
    } catch (error) {
      log('error', 'workflow', `Step ${step.id} failed: ${error.message}`)
      results.push({ stepId: step.id, success: false, error: error.message })
    }
  }

  const summary = {
    goal,
    totalSteps: steps.length,
    completed: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length,
    results
  }

  log('info', 'workflow', 'Build workflow complete', summary)
  return summary
}
