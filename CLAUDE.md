# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run start     # Start production server

# Run all Playwright tests (requires dev server running on port 3001)
npx playwright test

# Run a single test file
npx playwright test tests/playwright.test.ts

# Run HTTP-only tests (no browser required)
node tests/http-tests.mjs

# Add shadcn/ui components
npx shadcn@latest add <component>
```

**Known test flakiness:** 13/72 Playwright tests fail intermittently due to animation timing — these are pre-existing failures on the original codebase, not regressions.

Playwright runs against `http://localhost:3001` (note: port 3001, not 3000). The dev server must be running separately before running tests.

## Architecture

**Stack:** Next.js 16 App Router, TypeScript, Tailwind CSS v4, recharts, lucide-react, shadcn/ui components.

**No backend.** All data is static mock data in `lib/mock-data.ts` — the single source of truth for all TypeScript interfaces and data. Pages import directly from this file. There is no API, database, or environment variables.

**Styling:** Tailwind CSS v4 with theme defined in `app/globals.css` (not a `tailwind.config.ts` file — that's a v4 change). Custom utilities `.glass` and `.glass-hover` are defined there. The `@/*` path alias resolves to the repo root.

**shadcn/ui** components live in `components/ui/`. The `components.json` uses the "new-york" style with `oklch` color format.

## Key Conventions

**Page layout pattern:**
```tsx
<div className="space-y-6 max-w-7xl">
  {/* page content */}
</div>
```

**Glass card pattern:** `className="glass rounded-2xl p-5"`

**Design tokens** (use these, don't hardcode colors):
- Accent green: `#ADFF47` (also `rgba(173,255,71,...)`)
- Warning: `#fbbf24`, Error: `#f87171`, Info: `#60a5fa`
- Dark bg: `#0A0A0A`

**All pages are client components** (`"use client"`) — no server components are used in practice.

**Drawers** follow the pattern: `fixed inset-0 z-50 flex justify-end` with a max-w-md dark glass panel sliding from the right.

## Project Context

This is a demo SaaS dashboard called **Relo OS** for RSG (Relo Solutions Group). "Emma" is the AI agent persona that handles automated outreach. The product manages moving/relocation job workflows, vendor dispatch, compliance, estimates, QA, and billing.

The `app/proposal/page.tsx` is a sales proposal page (not in the main nav) used for client demos.
