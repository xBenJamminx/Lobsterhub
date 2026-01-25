# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LobsterHub is a community marketplace for Lobster workflows - automation pipelines for Clawdbot. It consists of a TanStack Start web application and a CLI package.

## Commands

```bash
npm run dev        # Start dev server (vinxi)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm run typecheck  # TypeScript type checking
```

### CLI Package (packages/lobsterhub)

```bash
cd packages/lobsterhub
npm run build      # Compile TypeScript
npm run dev        # Watch mode compilation
```

## Architecture

### Web Application (TanStack Start + Supabase)

- **Framework**: TanStack Start v1.115 with file-based routing via vinxi
- **Database**: Supabase (PostgreSQL) with typed client
- **Styling**: Tailwind CSS v4

**Key patterns:**
- Routes use `createFileRoute` from TanStack Router with route-level data fetching via `useEffect`
- Supabase client is initialized with Vite env vars (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- TypeScript path alias: `~/` maps to `./src/`

**Route files:**
- `src/routes/__root.tsx` - Root layout with Header/Footer
- `src/routes/index.tsx` - Homepage with search and category filtering
- `src/routes/workflow.$slug.tsx` - Workflow detail page
- `src/routes/submit.tsx` - Workflow submission form
- `src/routes/category.$category.tsx` - Category filtered view

**Data layer:**
- `src/lib/supabase.ts` - Typed Supabase client
- `src/lib/api.ts` - API functions (getWorkflows, searchWorkflows, createWorkflow)
- `src/lib/database.types.ts` - Generated Supabase types

### CLI Package

Located in `packages/lobsterhub/`, provides `npx lobsterhub <command>` for installing workflows to `~/.clawdbot/lobster/workflows/`.

Commands: `install`, `list`, `search`

## Database

Schema is in `supabase/schema.sql`. Single `workflows` table with:
- Full-text search via `fts` generated column
- Categories: `productivity`, `communication`, `automation`, `devtools`, `other`
- RLS enabled (public read, open insert)

## Environment Setup

Copy `.env.local.example` to `.env.local` and configure:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
