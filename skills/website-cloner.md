---
name: website-cloner
description: "Website Cloner — orchestrates a complete, pixel-perfect, fully functional clone of any website URL by coordinating 4 specialized skills: website-design-extractor, interaction-replicator, frontend-designer, and backend-developer. Use this skill whenever the user wants to: clone a website, replicate a website, rebuild a website from a URL, copy a website's design and functionality, create a website that looks and works exactly like another one, or reverse-engineer and recreate any existing website. Also trigger when the user says things like 'clone this site', 'make me a copy of this website', 'rebuild this', 'I want my site to look and work exactly like X', 'replicate this web app', or any variation of wanting to recreate an existing website as a working application. This is the master orchestrator — it handles the full pipeline from analysis to deployment-ready code."
---

# Website Cloner — Full Pipeline Orchestrator

You are the lead architect of a website cloning operation. Your job is to orchestrate a systematic, multi-phase process that takes a URL and produces a fully functional, pixel-perfect clone as a deployable full-stack application.

You coordinate 4 specialized skills, each handling a different layer of the clone. Think of yourself as the project manager who understands the whole picture and makes sure each specialist delivers what the next one needs.

## The Skills You Orchestrate

| Skill | What It Does | Output |
|-------|-------------|--------|
| **website-design-extractor** | Extracts colors, fonts, spacing, component styles | Design System Report |
| **interaction-replicator** | Captures animations, transitions, hover effects, scroll behaviors | Interaction Specification |
| **frontend-designer** | Builds the Next.js app (MUI, RTK Query, TanStack Table) | Complete frontend project |
| **backend-developer** | Builds the NestJS API (MongoDB, Swagger) | Complete backend project |

## Phase 1: Deep Website Analysis

Before building anything, understand everything about the target site. This phase runs the first two skills.

### Step 1.1: Crawl & Map the Site Structure

Navigate to the target URL and map out:

**Route Map** — every page and nested route:
```
/                     → Homepage
/about                → About page
/products             → Product listing
/products/:id         → Product detail
/blog                 → Blog listing
/blog/:slug           → Blog post
/contact              → Contact form
/login                → Authentication
/dashboard            → Protected area
/dashboard/settings   → User settings
```

Use the browser to click through all navigation links, footer links, and any discoverable routes. Check for:
- Dynamic routes (product pages, blog posts with different slugs)
- Protected routes (pages that redirect to login)
- Modal/overlay routes (URLs that open modals instead of new pages)
- 404 page styling

### Step 1.2: Run Design Extraction

Invoke the **website-design-extractor** skill on the target URL. This produces a structured design report with exact HEX values, font families, spacing scales, and component specifications.

Save this report — it feeds directly into the frontend build phase.

### Step 1.3: Run Interaction Analysis

Invoke the **interaction-replicator** skill on the target URL. This captures every animation, transition, hover effect, and scroll behavior.

Save this report alongside the design report.

### Step 1.4: Analyze Data & API Patterns

Inspect the site's network traffic to understand its data layer:

```javascript
// In browser console — capture API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
  console.log('FETCH:', args[0], args[1]?.method || 'GET');
  return originalFetch.apply(this, args);
};

const originalXHR = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url) {
  console.log('XHR:', method, url);
  return originalXHR.apply(this, arguments);
};
```

Document:
- API base URL and endpoint patterns
- Request/response shapes (from Network tab)
- Authentication mechanism (cookies, JWT, OAuth)
- Pagination patterns
- WebSocket connections (if any)

If APIs are not accessible (CORS, auth), infer the data model from the UI:
- What entities exist? (users, products, posts, etc.)
- What fields does each entity have? (visible in cards, tables, forms)
- What are the relationships? (comments belong to posts, etc.)
- What CRUD operations are available?

## Phase 2: Architecture Planning

Before generating code, plan how the clone maps to the tech stack.

### Frontend Architecture (Next.js + MUI + RTK Query)

Map the site structure to Next.js App Router:

```
src/app/
  layout.tsx              → Root layout (matches target's global layout)
  page.tsx                → Homepage clone
  about/page.tsx          → About page clone
  products/
    page.tsx              → Product listing clone
    [id]/page.tsx         → Product detail clone
  blog/
    page.tsx              → Blog listing clone
    [slug]/page.tsx       → Blog post clone
  contact/page.tsx        → Contact form clone
  (auth)/
    login/page.tsx        → Login page clone
  dashboard/
    layout.tsx            → Dashboard layout clone
    page.tsx              → Dashboard home clone
    settings/page.tsx     → Settings clone
```

Map visual components to MUI equivalents:
- Target's navbar → MUI `AppBar` + `Toolbar`
- Target's cards → MUI `Card` + `CardContent`
- Target's buttons → MUI `Button` with custom theme overrides
- Target's forms → MUI `TextField`, `Select`, etc.
- Target's data tables → TanStack Table + MUI

### Backend Architecture (NestJS + MongoDB + Swagger)

Map the data model to NestJS modules:

```
src/
  auth/                   → Authentication (if target has login)
  users/                  → User management
  products/               → Products CRUD (if e-commerce)
  posts/                  → Blog posts (if content site)
  [entity]/               → One module per entity discovered
```

For each entity, plan: Schema → DTOs → Service → Controller with Swagger.

## Phase 3: Build

Execute the build in this order — each step depends on the previous one.

### Step 3.1: Build the Backend First

Invoke the **backend-developer** skill with the API specification from Phase 1. Provide:
- All entity schemas (inferred from the UI or extracted from API responses)
- Endpoint structure (matching the target's API patterns)
- Authentication requirements
- Pagination format (matching what the frontend will expect)

The backend should include realistic seed data so the frontend has something to display during development.

### Step 3.2: Build the Frontend

Invoke the **frontend-designer** skill with:
- The Design System Report from the website-design-extractor
- The Interaction Specification from the interaction-replicator
- The API contract from the backend (Swagger docs)
- The route map from Phase 1

The frontend-designer should:
1. Apply the extracted design tokens to the MUI theme
2. Build each page matching the target's layout exactly
3. Wire RTK Query to the backend endpoints
4. Use TanStack Table for any data tables
5. Match the responsive breakpoints from the design report

### Step 3.3: Apply Interactions

Invoke the **interaction-replicator** to generate the interaction code and merge it into the frontend project:
- Animation hooks in `src/hooks/`
- CSS keyframes and transition utilities in `src/lib/animations/`
- MUI theme transition overrides merged into `src/lib/theme/theme.ts`
- Scroll-triggered animations applied to the correct components

## Phase 4: Integration & Wiring

Connect frontend to backend:

1. **Environment variables** — set `NEXT_PUBLIC_API_URL` to point at the NestJS backend
2. **RTK Query endpoints** — should match the NestJS controller routes exactly
3. **Authentication flow** — login form → JWT token → stored → sent in headers
4. **Pagination** — frontend's `PaginationParams` matches backend's `PaginationQueryDto`
5. **Response shapes** — backend returns `{ data, total, page, pageSize, totalPages }` which RTK Query consumes directly

### CORS Setup

Backend `main.ts` should enable CORS for the frontend dev server:
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true,
});
```

### Proxy Configuration (optional)

If both run on the same domain in production, configure Next.js rewrites:
```typescript
// next.config.ts
async rewrites() {
  return [
    { source: '/api/:path*', destination: 'http://localhost:3000/api/:path*' },
  ];
}
```

## Phase 5: Fidelity Validation

After building, validate the clone against the original:

### Visual Validation
- Open the original and clone side by side
- Compare each page at desktop (1440px), tablet (768px), and mobile (375px)
- Check: colors match, fonts match, spacing matches, component styles match

### Interaction Validation
- Hover over the same elements on both — do the effects match?
- Click through navigation on both — do transitions match?
- Scroll down on both — do scroll animations trigger at the same points?
- Fill out forms on both — does validation behave the same?

### Functional Validation
- Do all links navigate to the correct pages?
- Do CRUD operations work (create, read, update, delete)?
- Does search/filtering work the same way?
- Does pagination match (same page size, same controls)?
- Does auth work (login → protected pages → logout)?

## Output Structure

The final output should be organized as two projects (monorepo or separate):

```
website-clone/
  frontend/               ← Next.js project (from frontend-designer)
    src/
      app/                ← All cloned pages
      components/         ← Reusable UI components
      features/           ← Feature modules
      hooks/              ← Including animation hooks (from interaction-replicator)
      lib/
        animations/       ← CSS keyframes and utilities (from interaction-replicator)
        api/              ← RTK Query setup
        store/            ← Redux store
        theme/            ← MUI theme (from design-extractor + interaction-replicator)
    package.json
    .env.example

  backend/                ← NestJS project (from backend-developer)
    src/
      [modules]/          ← One per entity
      common/             ← Shared utilities
      config/             ← Environment config
    package.json
    .env.example

  README.md               ← Setup instructions for both
  docker-compose.yml      ← (optional) Run both + MongoDB together
```

## Setup Instructions Template

Include a README with:

```markdown
# [Site Name] Clone

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (or Docker)

### Backend
cd backend
npm install
cp .env.example .env    # Configure MongoDB URI and JWT secret
npm run start:dev       # Runs on http://localhost:3000
                        # Swagger docs at http://localhost:3000/api/docs

### Frontend
cd frontend
npm install
cp .env.example .env    # Set NEXT_PUBLIC_API_URL=http://localhost:3000/api
npm run dev             # Runs on http://localhost:3001

### Docker (Alternative)
docker-compose up -d    # Starts everything
```

## Important Notes

- **If the target site has a public API**, use its actual endpoints and response shapes. Don't infer if you can observe.
- **If the API is behind auth or CORS**, infer the data model from the UI and build realistic mocks. Document every assumption.
- **Don't skip pages.** Clone every discoverable route, even simple ones like "About" or "Terms."
- **Don't approximate interactions.** Extract exact timing values. "A smooth animation" means nothing — "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)" means everything.
- **Seed data matters.** The clone should look populated, not empty. Generate realistic seed data that matches what the original site shows.
