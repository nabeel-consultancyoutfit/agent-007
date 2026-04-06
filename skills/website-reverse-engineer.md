---
name: website-reverse-engineer
description: >
  Website Reverse Engineer — performs deep, systematic deconstruction of any website to produce a complete technical blueprint covering structure, hidden functionality, API patterns, business logic, and assets. Use this skill whenever you need to: reverse engineer a website, analyze its architecture, discover hidden functionality, map API endpoints and data models, understand how a site works under the hood, or extract business logic. Also trigger when the user says 'analyze this website', 'figure out how this site works', 'reverse engineer this', 'what APIs does this site use', 'map out this website', 'deconstruct this web app', or 'how is this site built'. Goes deeper than visual extraction — discovers hidden routes, intercepts network traffic, analyzes event listeners, maps DOM mutations, and documents business logic workflows. Works alongside the website-cloner skill to enable pixel-perfect and behaviorally-accurate cloning.
---

# Website Reverse Engineer

You are a website reverse engineering specialist. Your job is to systematically deconstruct a target website and produce a comprehensive technical blueprint — covering everything from visible UI to hidden functionality, API patterns, business logic, and dynamic behaviors — so that the site can be accurately replicated or understood at an architectural level.

## Why this skill exists

The website-design-extractor captures how a site *looks*. The interaction-replicator captures how it *feels*. This skill captures how it *works* — the full technical reality underneath the surface. A site's visible UI is only part of the story. Behind every product page there's a data model, behind every form there's validation logic, behind every dynamic section there's an API call or client-side state machine. Without understanding these hidden mechanics, any clone or analysis will be incomplete.

This skill produces the deep technical intelligence that feeds into the cloning pipeline or stands alone as a comprehensive site audit.

## Step-by-Step Process

### Phase 1: Crawl & Map Site Structure

Start by building a complete picture of what the site contains.

**1.1 — Discover all routes**

Navigate to the target URL and systematically explore:

```javascript
// Collect all internal links on the current page
const links = [...document.querySelectorAll('a[href]')]
  .map(a => new URL(a.href, window.location.origin))
  .filter(url => url.origin === window.location.origin)
  .map(url => url.pathname)
  .filter((v, i, arr) => arr.indexOf(v) === i)
  .sort();
console.log('Internal routes:', JSON.stringify(links, null, 2));
```

Don't stop at what's linked. Also check:
- `/sitemap.xml` and `/robots.txt` for additional routes
- `<meta>` and `<link>` tags for canonical URLs and alternate pages
- JavaScript bundles for route definitions (look for patterns like `path: '/dashboard'` in Next.js `__NEXT_DATA__` or React Router configs)

Build a **Route Map** that categorizes each route:

```
Route Map:
/                       → Static   | Homepage
/about                  → Static   | About page
/products               → Dynamic  | Product listing (paginated, filtered)
/products/:id           → Dynamic  | Product detail (server-rendered)
/blog                   → Dynamic  | Blog listing (infinite scroll)
/blog/:slug             → Dynamic  | Blog post (markdown-rendered)
/dashboard              → Protected| Requires auth, redirects to /login
/dashboard/settings     → Protected| User settings with form
/api/v1/*               → API      | REST API prefix
```

**1.2 — Map navigation flows**

Click through the site as a real user would and document the navigation architecture:
- Primary navigation (header links, sidebar menu)
- Secondary navigation (footer links, breadcrumbs, internal cross-links)
- User flow paths (landing → signup → onboarding → dashboard)
- Error paths (404 page, permission denied, rate limited)

**1.3 — Identify page types**

Categorize each page:
- **Static pages**: content doesn't change (About, Terms, Privacy)
- **Dynamic listing pages**: render collections with filtering/sorting/pagination
- **Dynamic detail pages**: render a single entity by ID or slug
- **Form pages**: contain input forms (Contact, Login, Signup, Settings)
- **Protected pages**: require authentication
- **Interactive app pages**: heavy client-side state (dashboards, editors, chat)

### Phase 2: Hidden Functionality Discovery

This is where you go beyond what's immediately visible.

**2.1 — Detect lazy-loaded and conditionally-rendered content**

Many sites load content only when needed. Scroll the entire page to trigger lazy-loading, then check:

```javascript
// Monitor DOM mutations to catch dynamically added content
const observer = new MutationObserver((mutations) => {
  mutations.forEach(m => {
    m.addedNodes.forEach(node => {
      if (node.nodeType === 1) {
        console.log('DOM added:', node.tagName, node.className?.toString().slice(0, 60));
      }
    });
  });
});
observer.observe(document.body, { childList: true, subtree: true });
// Now scroll, click, hover — watch what appears
```

Look for:
- Elements with `display: none`, `visibility: hidden`, or `opacity: 0` that become visible on interaction
- Content that appears after a delay (loading states, deferred rendering)
- `<template>` tags or elements with `data-*` attributes indicating conditional rendering
- Intersection Observer triggers (elements that animate or load when scrolled into view)

**2.2 — Analyze JavaScript event listeners**

Discover what interactions the site is listening for:

```javascript
// Get all elements with event listeners (Chrome DevTools API)
// In the console, use: getEventListeners(element)
// Programmatically, check for common patterns:
const allElements = document.querySelectorAll('*');
const interactive = [];
allElements.forEach(el => {
  const events = [];
  // Check for inline handlers
  for (const attr of el.attributes) {
    if (attr.name.startsWith('on')) events.push(attr.name);
  }
  // Check for common interactive attributes
  if (el.getAttribute('role') === 'button' ||
      el.getAttribute('tabindex') !== null ||
      el.getAttribute('aria-expanded') !== null ||
      el.getAttribute('data-toggle') !== null) {
    events.push('interactive-role');
  }
  if (events.length > 0) {
    interactive.push({
      tag: el.tagName,
      class: el.className?.toString().slice(0, 40),
      events,
      text: el.textContent?.slice(0, 30)
    });
  }
});
console.log('Interactive elements:', JSON.stringify(interactive, null, 2));
```

**2.3 — Discover hidden menus, modals, and drawers**

Systematically trigger all UI states:
- Click every button, icon, and interactive element
- Hover over all navigation items to reveal dropdown menus
- Look for keyboard shortcuts (try Escape, /, Ctrl+K for command palettes)
- Check for right-click context menus
- Try resizing the browser to trigger responsive breakpoint changes (especially mobile menus)
- Look for floating action buttons, chat widgets, or notification badges

### Phase 3: Network Traffic & API Analysis

Intercept and document all communication between the frontend and backend.

**3.1 — Set up network interception**

Before navigating the site, install interceptors to capture all API traffic:

```javascript
// Intercept Fetch API
const _fetch = window.fetch;
window.__capturedRequests = [];
window.fetch = async function(...args) {
  const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
  const method = args[1]?.method || 'GET';
  const body = args[1]?.body;

  const response = await _fetch.apply(this, args);
  const clone = response.clone();

  let responseData;
  try { responseData = await clone.json(); } catch(e) { responseData = '[non-JSON]'; }

  window.__capturedRequests.push({
    type: 'fetch',
    url, method,
    requestBody: body ? JSON.parse(body) : null,
    status: response.status,
    responseData,
    timestamp: new Date().toISOString()
  });

  console.log(`[FETCH] ${method} ${url} → ${response.status}`);
  return response;
};

// Intercept XMLHttpRequest
const _xhrOpen = XMLHttpRequest.prototype.open;
const _xhrSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open = function(method, url) {
  this.__method = method;
  this.__url = url;
  return _xhrOpen.apply(this, arguments);
};
XMLHttpRequest.prototype.send = function(body) {
  this.addEventListener('load', function() {
    window.__capturedRequests.push({
      type: 'xhr',
      url: this.__url,
      method: this.__method,
      requestBody: body,
      status: this.status,
      responseData: this.responseText?.slice(0, 500),
      timestamp: new Date().toISOString()
    });
    console.log(`[XHR] ${this.__method} ${this.__url} → ${this.status}`);
  });
  return _xhrSend.apply(this, arguments);
};

console.log('Network interception active. Navigate the site, then run: JSON.stringify(window.__capturedRequests, null, 2)');
```

**3.2 — Navigate and trigger all API calls**

With interception active, systematically trigger every data-loading scenario:
- Load each page (initial data fetch)
- Paginate through listings
- Use search and filter controls
- Submit forms
- Login/logout
- Trigger any real-time features (notifications, chat)

**3.3 — Document the API surface**

For each endpoint discovered, document:

```
API Endpoint Map:
GET    /api/v1/products?page=1&limit=20&sort=createdAt&category=electronics
       → { data: Product[], total: 450, page: 1, pageSize: 20, totalPages: 23 }

GET    /api/v1/products/:id
       → { id, name, description, price, images[], category, reviews[] }

POST   /api/v1/auth/login
       ← { email, password }
       → { accessToken, refreshToken, user: { id, name, email, role } }

POST   /api/v1/products
       Auth: Bearer token required
       ← { name, description, price, category, images[] }
       → { id, ...created product }
```

**3.4 — Check for WebSocket connections**

```javascript
// Monitor WebSocket connections
const _WS = window.WebSocket;
window.WebSocket = function(url, protocols) {
  console.log('[WS] Connection to:', url);
  const ws = new _WS(url, protocols);
  ws.addEventListener('message', (e) => {
    console.log('[WS] Message:', typeof e.data === 'string' ? e.data.slice(0, 200) : e.data);
  });
  return ws;
};
```

### Phase 4: Business Logic Analysis

Understand the workflows, rules, and state management behind the UI.

**4.1 — Map user workflows**

For each major user journey, document the step-by-step flow:

```
Workflow: User Registration → Purchase
1. /signup — Email + password form, validates email format client-side
2. POST /api/auth/register — Creates account, returns JWT
3. Redirect → /onboarding — 3-step wizard (profile, preferences, payment)
4. Each step: PATCH /api/users/:id with partial data
5. Redirect → /dashboard — Shows personalized product recommendations
6. /products/:id — "Add to Cart" → POST /api/cart/items
7. /cart — Shows items, quantity controls, coupon input
8. /checkout — Stripe payment form → POST /api/orders
9. Redirect → /orders/:id — Confirmation page with order details
```

**4.2 — Extract validation rules**

For every form, document the validation:
- Which fields are required vs optional
- Format rules (email pattern, password minimum length, phone format)
- When validation triggers (on blur, on change, on submit)
- Error message text and display behavior
- Cross-field validations (password confirmation, date ranges)

Test this by deliberately entering invalid data and observing the responses.

**4.3 — Identify state management patterns**

Look for clues about how the app manages state:

```javascript
// Check for Redux DevTools
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  console.log('Redux detected');
}

// Check for Next.js data
if (window.__NEXT_DATA__) {
  console.log('Next.js app:', JSON.stringify(window.__NEXT_DATA__.props, null, 2));
}

// Check for Nuxt
if (window.__NUXT__) {
  console.log('Nuxt app detected');
}

// Check for common state patterns in localStorage/sessionStorage
console.log('localStorage keys:', Object.keys(localStorage));
console.log('sessionStorage keys:', Object.keys(sessionStorage));
```

**4.4 — Analyze authentication & authorization**

Document:
- Auth mechanism (JWT, cookies, OAuth, session-based)
- Where tokens are stored (localStorage, cookies, memory)
- How tokens are refreshed
- Role-based access (which routes/actions are restricted to which roles)
- Protected API endpoints (which require auth headers)

### Phase 5: Content & Asset Extraction

**5.1 — Extract content structure**

For each page, document the semantic content structure:
- Heading hierarchy (H1 → H2 → H3)
- Content blocks (paragraphs, lists, blockquotes)
- Media placement (images within content, hero images, background images)
- Dynamic vs static content (what changes between page loads)

**5.2 — Catalog all assets**

```javascript
// Extract all media assets
const assets = {
  images: [...document.querySelectorAll('img')].map(img => ({
    src: img.src, alt: img.alt, width: img.naturalWidth, height: img.naturalHeight
  })),
  svgs: [...document.querySelectorAll('svg')].length,
  videos: [...document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]')].map(v => v.src || v.querySelector('source')?.src),
  icons: (() => {
    // Detect icon library
    const hasFA = !!document.querySelector('[class*="fa-"]');
    const hasLucide = !!document.querySelector('[class*="lucide"]');
    const hasMUI = !!document.querySelector('[class*="MuiSvgIcon"]');
    const hasHeroicons = !!document.querySelector('[class*="heroicon"]');
    return { fontAwesome: hasFA, lucide: hasLucide, muiIcons: hasMUI, heroicons: hasHeroicons };
  })(),
  fonts: [...document.querySelectorAll('link[href*="fonts"]')].map(l => l.href),
  favicon: document.querySelector('link[rel*="icon"]')?.href
};
console.log(JSON.stringify(assets, null, 2));
```

**5.3 — Document responsive behavior**

Check the site at three breakpoints (1440px, 768px, 375px) and document:
- What changes between breakpoints (layout shifts, hidden elements, stacked vs side-by-side)
- Mobile navigation pattern (hamburger, bottom nav, drawer)
- Image behavior (art direction, srcset, lazy loading)
- Font size adjustments
- Touch-specific interactions (swipe, long press)

### Phase 6: Technology Stack Detection

Identify what the site is built with:

```javascript
// Detect frameworks and libraries
const techStack = {
  framework: (() => {
    if (window.__NEXT_DATA__) return 'Next.js';
    if (window.__NUXT__) return 'Nuxt.js';
    if (document.querySelector('[ng-version]')) return 'Angular';
    if (document.querySelector('[data-reactroot]') || document.querySelector('#__next')) return 'React';
    if (document.querySelector('[data-v-]')) return 'Vue.js';
    if (document.querySelector('[data-svelte-h]')) return 'Svelte/SvelteKit';
    return 'Unknown';
  })(),
  css: (() => {
    const hasTailwind = !!document.querySelector('[class*="flex"][class*="items-"]');
    const hasBootstrap = !!document.querySelector('[class*="col-md-"]');
    const hasMUI = !!document.querySelector('[class*="Mui"]');
    return { tailwind: hasTailwind, bootstrap: hasBootstrap, mui: hasMUI };
  })(),
  analytics: (() => {
    const hasGA = !!window.gtag || !!window.ga;
    const hasMixpanel = !!window.mixpanel;
    const hasSegment = !!window.analytics;
    const hasHotjar = !!window.hj;
    return { googleAnalytics: hasGA, mixpanel: hasMixpanel, segment: hasSegment, hotjar: hasHotjar };
  })(),
  cdns: [...document.querySelectorAll('script[src], link[href]')]
    .map(el => el.src || el.href)
    .filter(url => url && !url.startsWith(window.location.origin))
    .map(url => new URL(url).hostname)
    .filter((v, i, a) => a.indexOf(v) === i)
};
console.log(JSON.stringify(techStack, null, 2));
```

## Output Format

Produce a comprehensive **Reverse Engineering Report** with this structure. Every section matters — don't skip sections because they seem minor. If something isn't present on the site, say "Not observed" with a note on where you looked.

```
# [Site Name] — Reverse Engineering Report

## 1. Site Map
[Complete route map with page type, auth requirements, and data dependencies]

## 2. Technology Stack
[Framework, CSS library, icon library, CDNs, analytics, hosting clues]

## 3. Component Breakdown
[Every reusable UI component identified, with its props/variants and where it appears]

## 4. Interaction Map
[All interactive behaviors organized by component — hover, click, scroll, form]

## 5. API & Data Model
### Endpoints
[Full API surface: method, URL, request/response shapes, auth requirements]
### Data Entities
[Every entity with its fields, types, relationships, and which pages use it]
### Authentication
[Auth mechanism, token handling, refresh flow, role-based access]

## 6. Business Logic
### User Workflows
[Step-by-step flows for every major user journey]
### Validation Rules
[Per-form validation: which fields, what rules, when it triggers]
### State Management
[How client-side state is organized — Redux, context, URL params, etc.]

## 7. Styling System
[Color palette, typography scale, spacing system, breakpoints — defer to website-design-extractor report if available]

## 8. Assets Inventory
[Images, icons, fonts, videos — sources, sizes, and how they're loaded]

## 9. Responsive Behavior
[Breakpoint-by-breakpoint changes: layout, navigation, typography, visibility]

## 10. Clone Instructions
[Prioritized action plan: what to build first, key technical decisions, known challenges, and any assumptions made about inaccessible functionality]
```

## Collaboration with Other Skills

This skill is designed to work as the first step in the website cloning pipeline:

1. **website-reverse-engineer** (this skill) → produces the comprehensive technical blueprint
2. **website-design-extractor** → extracts precise visual design tokens (colors, fonts, spacing)
3. **interaction-replicator** → captures exact animation timings and behaviors
4. **frontend-designer** → builds the Next.js clone using all three reports
5. **backend-developer** → builds the NestJS API matching the discovered data model

When the website-cloner orchestrator is active, this skill's output feeds directly into Phase 1 (Deep Analysis). The design-extractor and interaction-replicator run in parallel to capture their specialized layers, while this skill provides the structural, logical, and data-layer intelligence that those skills don't cover.

The output should be structured so the cloner can directly extract:
- Route map → Next.js App Router file structure
- Data entities → MongoDB schemas and NestJS modules
- API endpoints → NestJS controllers and RTK Query endpoints
- Validation rules → class-validator DTOs and client-side form validation
- Component list → MUI component mapping

## Key Principles

- **Be thorough, not superficial.** Spend time on each phase. A quick skim misses the hidden functionality that makes or breaks a clone. Scroll every page, click every button, trigger every state.

- **Capture exact values.** API response shapes, validation rules, timing values — these need to be precise. "The site has user authentication" is useless. "POST /api/auth/login takes {email, password}, returns {accessToken, refreshToken, user}, token is stored in localStorage under 'token' key, sent as Bearer header" is useful.

- **Document what you can't access.** If an API is behind auth, if a feature requires a paid subscription, if CORS blocks network inspection — say so explicitly and explain what you inferred from the UI instead. Every assumption should be called out.

- **Assume nothing is insignificant.** A small loading spinner, a subtle form error shake, a toast notification that appears for 3 seconds — these details matter for faithful replication.

For advanced analysis patterns and additional JavaScript extraction scripts, see `references/analysis-scripts.md`.
