# Testing Guide

## Playwright E2E
- Test files: e2e/[feature].e2e.ts
- Base URL: http://localhost:3000
- Setup: npx playwright install chromium

### Common Patterns
```typescript
import { test, expect } from '@playwright/test'

test.describe('Auth Flow', () => {
  test('should login successfully', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'test@test.com')
    await page.fill('[data-testid="password"]', 'password123')
    await page.click('[data-testid="submit"]')
    await expect(page).toHaveURL('/dashboard')
  })

  test('should show error for wrong password', async ({ page }) => {
    await page.goto('/login')
    await page.fill('[data-testid="email"]', 'test@test.com')
    await page.fill('[data-testid="password"]', 'wrongpassword')
    await page.click('[data-testid="submit"]')
    await expect(page.locator('[data-testid="error"]')).toBeVisible()
  })

  test('should redirect unauthenticated users to login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })
})
```

### Always Test
- Happy path login
- Wrong password error
- Protected route redirect
- Form validation errors (empty fields, invalid email)
- Successful CRUD operations
- Loading states appear and resolve
- Error states display correctly

### Best Practices
- Use data-testid attributes for selectors (never CSS classes)
- Wait for network idle before assertions
- Use test.beforeEach for common setup (login, navigation)
- Take screenshots on failure for debugging
- Use page.waitForResponse for API-dependent assertions

## Jest Unit Tests (NestJS)
- Test files: src/modules/[feature]/[feature].service.spec.ts
- Setup testing module with Test.createTestingModule()
- Mock all dependencies with jest.fn()

### Pattern
```typescript
import { Test, TestingModule } from '@nestjs/testing'
import { getModelToken } from '@nestjs/mongoose'
import { FeatureService } from './feature.service'
import { Feature } from './schemas/feature.schema'

describe('FeatureService', () => {
  let service: FeatureService
  let mockModel: any

  beforeEach(async () => {
    mockModel = {
      find: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureService,
        { provide: getModelToken(Feature.name), useValue: mockModel }
      ]
    }).compile()

    service = module.get<FeatureService>(FeatureService)
  })

  it('should return paginated results', async () => {
    mockModel.find.mockReturnValue({
      skip: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          sort: jest.fn().mockResolvedValue([{ name: 'Test' }])
        })
      })
    })
    mockModel.countDocuments.mockResolvedValue(1)

    const result = await service.findAll({ page: 1, pageSize: 10 })
    expect(result.data).toHaveLength(1)
    expect(result.total).toBe(1)
  })

  it('should throw NotFoundException for missing resource', async () => {
    mockModel.findById.mockResolvedValue(null)
    await expect(service.findOne('invalid-id')).rejects.toThrow()
  })
})
```

## What to Test Per Feature
- **Auth**: register, login, refresh token, protected route access, invalid credentials
- **CRUD feature**: list with pagination, create (valid + invalid), update, delete, not found
- **Forms**: required field validation, email format, min/max length, submit success
- **Tables**: data renders, pagination works, sorting works, empty state shows
