# React Component Conventions

## Server vs Client Components
- Default to server components
- Add 'use client' only when using: useState, useEffect, event handlers, browser APIs
- Never add 'use client' to page.tsx files that only fetch data
- Keep client components as small as possible — push state down, not up

## MUI Patterns
- Use sx prop for all styling (never inline style={{}})
- Use useTheme() when accessing theme values in logic
- Use styled() for reusable styled components
- Always import from @mui/material not @mui/material/[Component]
- Use MUI Grid2 for responsive layouts
- Responsive breakpoints: xs (360px), sm (600px), md (900px), lg (1200px), xl (1440px)
- Always use CssBaseline at the app root

## RTK Query Patterns
- Define all endpoints in lib/api/endpoints/[feature].api.ts
- Use injectEndpoints to add to baseApi
- Always add providesTags on queries, invalidatesTags on mutations
- Use isLoading, isError, error from query hooks
- Never use raw fetch or axios
- Example tag pattern:
  ```typescript
  providesTags: (result) =>
    result
      ? [...result.data.map(({ id }) => ({ type: 'Feature', id })), { type: 'Feature', id: 'LIST' }]
      : [{ type: 'Feature', id: 'LIST' }]
  ```
- Mutations invalidate with: `invalidatesTags: [{ type: 'Feature', id: 'LIST' }]`

## TanStack Table Pattern
- Define columns as ColumnDef<YourType>[] array
- Use flexRender for header and cell rendering
- Pass to shared DataTable component — never build a table from scratch
- Server-side pagination: manualPagination true + onPaginationChange
- Always include column sorting support
- Use columnHelper.accessor for type-safe column definitions

## Form Pattern
- Use useForm<FormType>() from react-hook-form
- Use zodResolver(schema) for validation
- All fields controlled via Controller or register
- Show MUI FormHelperText for errors
- Always define zod schema separately from form component
- Use MUI Dialog for create/edit forms
- Reset form on dialog close

## TypeScript Rules
- Define Props interface for every component
- Use generic components where applicable: DataTable<T>
- Never use `any` — use `unknown` and narrow if needed
- API response types defined in types/api.types.ts
- Export types from feature's types/ folder
- Use discriminated unions for state management

## File Naming
- Components: PascalCase.tsx (e.g., DataTable.tsx)
- Hooks: camelCase with use prefix (e.g., useAuth.ts)
- Types: camelCase with .types.ts suffix
- Utils: camelCase.ts
- Each component folder has an index.ts barrel export
