# NexusAI Dashboard — Next.js

A Next.js 14 App Router conversion of the NexusAI Dashboard SPA. Identical design and functionality to the original — zero external UI libraries, pure CSS Modules.

## Quick Start

```bash
cd nexus-ai
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Stack

- **Next.js 14** — App Router, TypeScript
- **Zustand** — global state management
- **CSS Modules** — all styling, no external UI libraries

## Project Structure

```
src/
├── app/
│   ├── globals.css          # CSS custom properties (design tokens)
│   ├── layout.tsx           # root layout
│   └── page.tsx             # landing ↔ app switcher
├── components/
│   ├── landing/             # LandingPage, HeroSection, FeaturedModels, ComparisonTable, …
│   ├── app/                 # DashboardPage, ChatHub, Sidebar, ChatArea, InputArea,
│   │                        # RightPanel, Marketplace, AgentsPage, DiscoverPage, AppNav
│   └── shared/              # LoginModal, ModelModal, OnboardingOverlay, Toast
├── data/
│   ├── models.ts            # MODELS array + MODEL_VARS
│   ├── labs.ts              # AI_LABS array
│   ├── research.ts          # RESEARCH papers
│   └── capApps.ts           # capability apps / suggestions
├── store/
│   └── appStore.ts          # Zustand store — all shared state & actions
└── types/
    └── index.ts             # TypeScript interfaces
```

## Pages / Views

| View | How to reach |
|------|--------------|
| Landing page | Default on load |
| Chat Hub | Sign in → Chat Hub tab |
| Marketplace | Sign in → Marketplace tab |
| Discover (Research) | Sign in → Discover tab |
| Agents | Sign in → Agents tab |

## Build for Production

```bash
npm run build
npm start
```
