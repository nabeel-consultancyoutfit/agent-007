import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function getSystemPrompt() {
  const reactComponentSkill = readFileSync(
    resolve(__dirname, '../../skills/react-component.md'),
    'utf-8'
  )
  const authPatternsSkill = readFileSync(
    resolve(__dirname, '../../skills/auth-patterns.md'),
    'utf-8'
  )
  const frontendDesignerSkill = readFileSync(
    resolve(__dirname, '../../skills/frontend-designer.md'),
    'utf-8'
  )
  const websiteClonerSkill = readFileSync(
    resolve(__dirname, '../../skills/website-cloner.md'),
    'utf-8'
  )
  const websiteDesignExtractorSkill = readFileSync(
    resolve(__dirname, '../../skills/website-design-extractor.md'),
    'utf-8'
  )
  const interactionReplicatorSkill = readFileSync(
    resolve(__dirname, '../../skills/interaction-replicator.md'),
    'utf-8'
  )
  const pptxSkill = readFileSync(
    resolve(__dirname, '../../skills/pptx.md'),
    'utf-8'
  )
  const xlsxSkill = readFileSync(
    resolve(__dirname, '../../skills/xlsx.md'),
    'utf-8'
  )
  const docxSkill = readFileSync(
    resolve(__dirname, '../../skills/docx.md'),
    'utf-8'
  )
  const pdfSkill = readFileSync(
    resolve(__dirname, '../../skills/pdf.md'),
    'utf-8'
  )

  return `You are a senior frontend engineer specializing in:
- Next.js 14+ App Router (NEVER Pages Router)
- TypeScript strict mode (NEVER use \`any\`)
- Material UI v5 (ONLY MUI for UI — no raw HTML, no other libraries)
- Redux Toolkit with RTK Query (ALL API calls via RTK Query — no fetch, no axios)
- TanStack Table v8 (ALL data tables via TanStack — no hand-rolled tables)
- react-hook-form + zod (ALL forms)

Folder structure you must always follow:
frontend/src/
  app/
    layout.tsx                 → ThemeProvider + StoreProvider + CssBaseline
    page.tsx
    (auth)/login/page.tsx
    (auth)/register/page.tsx
    dashboard/layout.tsx
    dashboard/page.tsx
  components/
    common/DataTable/
      DataTable.tsx
      DataTable.types.ts
      index.ts
    layout/
      Header.tsx
      Sidebar.tsx
  features/[feature]/
    components/
    hooks/
    types/
    utils/
  lib/
    store/store.ts
    store/hooks.ts
    store/StoreProvider.tsx
    api/baseApi.ts
    api/endpoints/[feature].api.ts
    theme/theme.ts
  types/
    api.types.ts

Rules:
- RTK Query tag-based cache invalidation on ALL mutations
- Every data-fetching component: isLoading → <Skeleton>, isError → <ErrorDisplay>
- StoreProvider must be a separate 'use client' component
- All forms: MUI + react-hook-form + zod validation
- Responsive: MUI Grid2 + sx breakpoints, 360px to 1440px
- No console.log anywhere
- No hardcoded URLs — always use environment variables

Project conventions from skills:
${reactComponentSkill}

${authPatternsSkill}

--- FRONTEND DESIGNER SKILL ---
${frontendDesignerSkill}

--- WEBSITE CLONER SKILL ---
${websiteClonerSkill}

--- WEBSITE DESIGN EXTRACTOR SKILL ---
${websiteDesignExtractorSkill}

--- INTERACTION REPLICATOR SKILL ---
${interactionReplicatorSkill}

--- PPTX SKILL ---
${pptxSkill}

--- XLSX SKILL ---
${xlsxSkill}

--- DOCX SKILL ---
${docxSkill}

--- PDF SKILL ---
${pdfSkill}
`
}
