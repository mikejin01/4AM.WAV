# CLAUDE.md

## Purpose

This file is the operational coding standard for this repository.
Follow it for every implementation, refactor, and new file.

**Stack:** Next.js App Router · TypeScript (strict) · Tailwind CSS

**Goals:** Simple, readable, maintainable code. No redundancy. Feature-first organization. No unnecessary abstractions.

---

## Non-Negotiable Rules

- Use Next.js App Router only
- Use Server Components by default
- Add `"use client"` only when required (hooks, event handlers, browser APIs, realtime connections)
- TypeScript strict mode — no `any`, ever
- Use `unknown` instead of `any` when the type is truly unclear
- Tailwind CSS only — no CSS Modules, styled-components, or other styling systems
- Do not create generic helpers, wrappers, or reusable abstractions until the same pattern exists in at least 3 places
- Organize by feature first, not by file type
- Keep page files thin — routing and composition only
- Shared root-level code must be used by 2+ features to justify its placement

---

## Project Structure

```text
src/
├── app/                          # Routing, layouts, route handlers only
│   ├── (auth)/
│   ├── api/
│   ├── layout.tsx
│   └── page.tsx
├── features/                     # Feature-specific code (components, hooks, actions, schemas, types)
│   ├── auth/
│   ├── billing/
│   ├── interview/
│   └── <feature>/
├── components/
│   ├── ui/                       # Shared primitives (Button, Input, Modal, Card, Dropdown)
│   └── layout/                   # Shared layout (Header, Sidebar, Shell, Navigation)
├── lib/
│   ├── integrations/
│   │   ├── supabase/             # Browser + server clients, auth helpers
│   │   ├── stripe/               # Checkout, billing, webhook utilities (server-only)
│   │   └── deepgram/             # Realtime connection, token helpers
│   ├── api-client.ts             # Shared fetch wrapper, headers, error handling
│   ├── env.ts                    # Env variable validation (Zod)
│   └── utils.ts                  # Shared utilities (used by 2+ features)
├── types/                        # Shared types (used by 2+ features)
├── styles/
│   └── globals.css               # Tailwind layers, CSS variables, tokens
```

### Placement rules

- **`src/app`** — route segments, layouts, `loading.tsx`, `error.tsx`, route handlers. No business logic.
- **`src/features/<feature>`** — everything that serves a single feature: components, hooks, actions, schemas, types, utils. If it only serves one feature, it lives here.
- **`src/components/ui`** — shared UI primitives used across 2+ features. Do not move feature-specific components here.
- **`src/components/layout`** — shared layout shells used across 2+ routes.
- **`src/lib/integrations/<service>`** — isolated third-party SDK code. Expose small, typed helpers. Do not spread one service across random folders.
- **`src/types`** — only types shared across 2+ features. Feature-specific types stay in their feature folder.

### Barrel files

- Allowed only at the feature root: `src/features/auth/index.ts`
- Banned everywhere else — they obscure dependency graphs and slow builds

---

## Naming Conventions

- **Components:** `PascalCase.tsx` — `UserProfile.tsx`, `BillingCard.tsx`
- **Hooks:** `use` prefix, camelCase — `useAuth.ts`, `useTranscript.ts`
- **Server Actions:** `actions.ts` inside the feature folder
- **Schemas:** `schemas.ts` inside the feature folder (Zod)
- **Utilities:** `camelCase.ts` — `formatDate.ts`, or grouped in `utils.ts`
- **Types:** `types.ts` inside the feature folder, or `src/types/<domain>.ts` for shared
- **Integration files:** `client.ts`, `server.ts`, `helpers.ts` inside the integration folder
- **Route handlers:** follow Next.js convention — `route.ts`
- **Directories:** `kebab-case` for multi-word folders — `src/features/user-settings/`

---

## Import Order

Keep imports grouped in this order, separated by a blank line:

```ts
// 1. React / Next.js
import { useState } from "react";
import { redirect } from "next/navigation";

// 2. Third-party libraries
import { z } from "zod";

// 3. Aliases: lib, components, types
import { supabase } from "@/lib/integrations/supabase/client";
import { Button } from "@/components/ui/Button";

// 4. Feature-level imports
import { useAuth } from "@/features/auth";

// 5. Relative imports (same feature / same folder)
import { InterviewTimer } from "./InterviewTimer";
```

Do not use wildcard (`*`) imports. Do not import from barrel files outside the feature root.

---

## Component Rules

- Server Components by default — add `"use client"` only when necessary
- Keep components small, but do not split into tiny files without benefit
- Prefer composition over deep prop drilling
- If a component is hard to scan in a few seconds, split it
- Only extract to `components/ui` when repetition exists across 2+ features
- Route file → feature entry → smaller pieces → shared primitives

---

## Data Fetching & State

### Fetching
- Fetch on the server whenever possible
- Use Server Actions for mutations — prefer over route handlers unless you need a REST endpoint
- Use route handlers (`src/app/api/`) only for webhooks, external API consumption, or when Server Actions don't fit
- Use `src/lib/api-client.ts` only for client-side fetching when truly needed (realtime, polling, optimistic UI)
- Do not duplicate fetching logic — centralize shared patterns

### State
- Local React state first (`useState`, `useReducer`)
- URL search params for shareable / filterable state
- No global state libraries (Zustand, Redux) unless prop passing becomes genuinely unmanageable across 3+ levels

---

## Error Handling

- Every `src/app/**/` route group should have an `error.tsx` boundary
- Use `loading.tsx` for Suspense fallbacks at the route level
- Server Actions: wrap in try/catch, return typed `{ success, error }` objects — do not throw raw errors to the client
- Route handlers: return consistent JSON error shapes with appropriate status codes
- Client components: handle errors close to where they occur — do not let errors silently disappear
- Use `notFound()` from `next/navigation` for missing resources — do not render empty states for genuinely missing data
- Log server-side errors with enough context to debug, but never leak stack traces or secrets to the client

---

## Environment Variables

- Validate all env vars at build/startup using Zod in `src/lib/env.ts`
- Access env vars only through this validated module — never use raw `process.env` elsewhere
- Prefix client-safe vars with `NEXT_PUBLIC_`
- Never expose `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, or any privileged key to client code

Example `src/lib/env.ts`:
```ts
import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

---

## Integration Rules

- Each third-party service lives in `src/lib/integrations/<service>/`
- Separate browser-safe code (`client.ts`) from server-only code (`server.ts`)
- Never expose privileged keys in client code
- Stripe secret logic and webhooks must stay server-side
- Deepgram realtime logic stays in the integration layer or a feature hook — do not mix transport with presentation
- When adding a new service: create the folder, isolate SDK access, expose typed helpers

---

## TypeScript Rules

- Strict mode always
- No `any` — use `unknown` when the type is genuinely unclear
- Validate all external data (API responses, form inputs, env vars) with Zod
- Prefer precise types over broad ones
- Keep types readable — avoid overly clever generics
- Colocate feature types in `src/features/<feature>/types.ts`
- Only promote to `src/types/` when shared across 2+ features

---

## Tailwind Rules

- Tailwind utility classes for all styling
- No mixed styling systems
- Use `cn()` (clsx + twMerge) for conditional classes in shared components
- Global CSS only for: Tailwind layers, CSS variables, tokens, truly global rules
- Extract shared UI only when repetition is proven across 2+ features

---

## Testing

- Colocate tests inside the feature folder: `src/features/auth/__tests__/`
- Name test files: `<subject>.test.ts` or `<subject>.test.tsx`
- Integration / E2E tests live in a top-level `tests/` folder
- Test behavior and outcomes, not implementation details
- Do not require 100% coverage — focus on critical paths: auth flows, billing, data mutations

---

## Code Style

- Clear code over clever code
- Fewer moving parts over elaborate architecture
- Direct implementation over indirection
- Descriptive names — no abbreviations unless universally understood
- Comments only for non-obvious decisions (the "why", not the "what")
- Remove dead code immediately — do not comment it out
- No premature memoization (`useMemo`, `useCallback`) — add only when profiling shows a need
- No one-off utility files for trivial logic — inline it

---

## Before Finishing Any Task

Verify:
- Code follows the required folder structure
- Placed in the correct feature or integration folder
- Server vs Client boundaries are correct
- No secrets exposed to the client
- No `any` introduced
- No unnecessary abstraction added
- Simpler than the most abstract alternative
- Tailwind-only styling
- Shared code is actually shared (used by 2+ features)
- Page files remain thin
- Error boundaries and loading states exist for new routes
- Env vars accessed through `src/lib/env.ts`, not raw `process.env`

If you create or refactor code, prefer the simplest implementation that matches this file.
