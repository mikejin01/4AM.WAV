# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Product Context

4AM.WAV is a nightlife events platform for New York City. Users discover events, RSVP, and buy tickets.

**What this app does:**

- Hosts the marketing site (home page + alternate landing at `/posh`)
- Event discovery and browsing with detail pages
- Ticket purchase via Stripe checkout (VIP membership subscriptions)
- Auth flows (Google OAuth via Supabase)
- User profiles with membership tier management
- A secret live support page with Deepgram realtime speech-to-text
- Global chat widget (entry point for live support access)

**What this app does NOT do:**

- No backend API — everything goes through Supabase, Stripe, and Deepgram directly
- No LLM orchestration or AI processing
- No CMS — events are managed via Supabase directly
- No email notifications or push notifications
- No server-side audio/video processing

---

## Tech Stack

| Layer | Technology | Notes |
|---|---|---|
| Framework | Next.js 16 App Router | TypeScript strict, `src/` directory |
| Language | TypeScript (strict) | No `any`, ever |
| Styling | Tailwind CSS v4 | `@theme inline` in globals.css, not tailwind.config.js |
| Linter | ESLint | Flat config (`eslint.config.mjs`) |
| Auth | Supabase Auth | Google OAuth (PKCE), JWT-based |
| Database | Supabase Postgres | Direct reads via Supabase client, RLS enabled |
| Billing | Stripe | Checkout + webhooks (server-only) |
| Speech-to-Text | Deepgram | WebSocket from browser, API key as token |
| Animations | GSAP + ScrollTrigger | Home + landing scroll reveals |
| Import alias | `@/*` | Maps to `src/*` |

---

## Development Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build (strict TS errors will block)
npm run start    # Serve production build
npm run lint     # ESLint (flat config)
```

No test runner is configured yet. Uses npm.

---

## Non-Negotiable Rules

- Use Next.js App Router only
- Use Server Components by default
- Add `"use client"` only when required (hooks, event handlers, browser APIs, realtime connections)
- TypeScript strict mode — no `any`, ever. Use `unknown` when type is genuinely unclear
- Tailwind CSS only — no CSS Modules, styled-components, or other styling systems
- Do not create generic helpers, wrappers, or reusable abstractions until the same pattern exists in at least 3 places
- Organize by feature first, not by file type
- Keep page files thin — routing and composition only, no business logic
- Shared root-level code must be used by 2+ features to justify its placement

---

## Project Structure

```text
src/
├── app/
│   ├── layout.tsx                    # Root layout (fonts, ChatWidget)
│   ├── page.tsx                      # Home page (/) — has own Navbar + LoadingScreen
│   ├── posh/page.tsx                 # Landing page (/posh) — own LandingNavbar
│   │
│   ├── (auth)/                       # Public auth pages (no Navbar)
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   │
│   ├── auth/callback/route.ts        # Supabase OAuth callback
│   │
│   ├── (main)/                       # Pages with shared Navbar layout
│   │   ├── layout.tsx                # Renders <Navbar /> for all children
│   │   ├── error.tsx                 # Error boundary for all (main) pages
│   │   ├── loading.tsx               # Suspense fallback for all (main) pages
│   │   ├── events/
│   │   │   ├── page.tsx              # Event listing
│   │   │   └── [id]/page.tsx         # Event detail
│   │   ├── profile/page.tsx          # User profile (protected)
│   │   ├── tickets/page.tsx          # My tickets (protected)
│   │   └── welcome/page.tsx          # Post-signup welcome (protected)
│   │
│   ├── live-support/page.tsx         # Secret STT page (middleware-gated)
│   │
│   └── api/
│       ├── checkout/route.ts         # Stripe checkout session
│       ├── deepgram-token/route.ts   # Deepgram API key for browser
│       ├── live-support/activate/route.ts
│       └── webhooks/stripe/route.ts  # Stripe webhook handler
│
├── features/
│   ├── auth/
│   │   ├── GoogleAuthButton.tsx
│   │   ├── actions.ts                # Server actions: signOut
│   │   └── dal.ts                    # Data Access Layer: verifySession()
│   ├── chat/
│   │   ├── ChatWidget.tsx            # Global chat widget (mounted in root layout)
│   │   └── useVoiceInput.ts
│   ├── events/
│   │   ├── EventCard.tsx
│   │   ├── EventDetail.tsx
│   │   ├── TicketModal.tsx
│   │   └── types.ts
│   ├── home/
│   │   ├── HomePage.tsx
│   │   ├── components/               # HeroSection, LoadingScreen, etc.
│   │   └── hooks/useScrollReveal.ts
│   ├── landing/
│   │   ├── LandingPage.tsx
│   │   ├── components/               # HeroSection, HowItWorksSection, etc.
│   │   └── hooks/useScrollAnimations.ts
│   ├── live-support/
│   │   ├── LiveSupportPage.tsx
│   │   └── token.ts                  # HMAC token create/validate
│   ├── profile/
│   │   ├── ProfileContent.tsx
│   │   ├── actions.ts
│   │   └── types.ts
│   ├── tickets/
│   │   ├── OrderCard.tsx
│   │   └── types.ts
│   └── welcome/
│       └── WelcomeContent.tsx
│
├── components/
│   └── layout/
│       └── Navbar.tsx                # Shared navbar (used via (main) layout)
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser client (anon key)
│   │   ├── server.ts                 # Server client (cookies)
│   │   └── middleware.ts             # Session refresh for middleware
│   ├── stripe/
│   │   └── server.ts                 # Stripe SDK instance (secret key)
│   ├── deepgram/
│   │   └── server.ts                 # Deepgram SDK instance
│   ├── env.ts                        # Public env validation (NEXT_PUBLIC_*)
│   └── env.server.ts                 # Server-only env validation (import "server-only")
│
├── styles/
│   └── globals.css                   # Tailwind @theme, CSS vars, keyframe animations
│
└── middleware.ts                     # Session refresh + live-support token gate
```

### Placement Rules

| Location | What goes here | Rule |
|---|---|---|
| `src/app/` | Route segments, layouts, `loading.tsx`, `error.tsx`, route handlers | No business logic. Pages import from `features/` and compose. |
| `src/features/<feature>/` | Components, hooks, actions, types for one feature | If it serves only one feature, it lives here. |
| `src/components/layout/` | Shared layout shells | Used across 2+ route groups. |
| `src/lib/<service>/` | Third-party SDK wrappers — one folder per service | Separate `client.ts` (browser) from `server.ts` (Node). |

### Barrel Files

- **Allowed** only at the feature root: `src/features/auth/index.ts`
- **Banned** everywhere else — they obscure dependency graphs and slow builds

---

## Authentication Architecture

3-layer defense-in-depth, following Next.js best practices.

### Layer 1: Middleware (Optimistic — fast redirects only)

`src/middleware.ts` runs on every request. It refreshes Supabase JWT tokens via `updateSession()` and gates `/live-support` with an HMAC token check. It does NOT enforce auth for protected pages — that's the DAL's job.

### Layer 2: Data Access Layer (Primary security boundary)

`src/features/auth/dal.ts` provides `verifySession()` — a cached function that verifies the user's session and redirects to `/login` if invalid. All protected Server Components call this.

```typescript
// src/features/auth/dal.ts
import "server-only";
import { cache } from "react";

export const verifySession = cache(async () => {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/login");
  return user;
});
```

**Rules:**
- All protected pages (`profile`, `tickets`, `welcome`) call `verifySession()` — never inline auth checks
- Route handlers (like `/api/checkout`) that need JSON 401 responses handle auth inline instead — the DAL's `redirect()` is wrong for API endpoints
- Always use `supabase.auth.getUser()` in server code — never trust `getSession()` which reads JWTs without revalidation

### Layer 3: Supabase RLS (Database backstop)

RLS policies on all tables ensure that even if application code has a bug, unauthorized data access is blocked at the database level.

---

## Architecture Boundaries

### What talks to what

```text
Browser (Client Components)
  ├── WebSocket → Deepgram (audio STT)
  ├── HTTPS → Supabase (auth, DB reads/writes via anon key + RLS)
  └── HTTPS → Stripe.js (checkout redirect)

Server (Server Components, Actions, Route Handlers)
  ├── HTTPS → Supabase (auth verification via getUser(), DB queries)
  ├── HTTPS → Stripe SDK (checkout sessions, webhook verification)
  └── Deepgram SDK (API key retrieval only)

Middleware
  └── HTTPS → Supabase (token refresh via getUser())
```

### Live support (hidden page)

`/live-support` is gated by a password-based HMAC token flow:
1. User types "live support" in the ChatWidget → prompted for password
2. `POST /api/live-support/activate` validates password → sets HMAC-signed cookie
3. Middleware checks cookie signature before allowing access
4. Page uses `getDisplayMedia` for screen capture + Deepgram WebSocket for realtime STT

Token logic: `src/features/live-support/token.ts`

### Route group design

- **`(auth)`** — login, signup. No Navbar, centered layout.
- **`(main)`** — events, profile, tickets, welcome. Shared Navbar via layout.
- **Root-level pages** — `/` (home, has LoadingScreen animation), `/posh` (landing, own LandingNavbar), `/live-support` (own header, middleware-gated). These stay outside route groups because each has unique layout needs.

---

## Environment Variables

Two validated env modules enforce the server/client boundary:
- `src/lib/env.ts` → `env` — public vars only (`NEXT_PUBLIC_*`), importable anywhere
- `src/lib/env.server.ts` → `serverEnv` — secret vars, guarded by `import "server-only"`

Never use raw `process.env` outside these two files. Add new public vars to `env.ts`, new secret vars to `env.server.ts`.

---

## Naming Conventions

| Type | Convention | Example |
|---|---|---|
| Components | `PascalCase.tsx` | `EventCard.tsx`, `ProfileContent.tsx` |
| Hooks | `use` prefix, camelCase | `useScrollReveal.ts`, `useVoiceInput.ts` |
| Server Actions | `actions.ts` in feature folder | `features/auth/actions.ts` |
| DAL functions | `dal.ts` in feature folder | `features/auth/dal.ts` |
| Types | `types.ts` in feature folder | `features/events/types.ts` |
| Integration files | `client.ts`, `server.ts` | `lib/supabase/server.ts` |
| Route handlers | `route.ts` (Next.js convention) | `app/api/webhooks/stripe/route.ts` |
| Directories | `kebab-case` for multi-word | `features/live-support/` |

---

## Import Order

```typescript
// 1. React / Next.js
import { useState } from "react";
import { redirect } from "next/navigation";

// 2. Third-party libraries
import { z } from "zod";

// 3. Aliases: lib, components, types
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/layout/Navbar";

// 4. Feature-level imports
import { verifySession } from "@/features/auth/dal";

// 5. Relative imports (same feature / same folder)
import { InterviewTimer } from "./InterviewTimer";
```

No wildcard (`*`) imports. No imports from barrel files outside the feature root.

---

## Component Rules

- Server Components by default — add `"use client"` only when necessary
- Keep components small, but do not split into tiny files without benefit
- Prefer composition over deep prop drilling
- If a component is hard to scan in a few seconds, split it
- Only extract to `components/` when repetition exists across 2+ features
- Page file → feature entry → smaller pieces → shared primitives

---

## Data Fetching & State

### Fetching
- Fetch on the server whenever possible (Server Components, Server Actions)
- Use Server Actions for mutations — prefer over route handlers
- Use route handlers (`src/app/api/`) only for webhooks, OAuth callbacks, or when Server Actions don't fit
- Do not duplicate fetching logic — centralize shared patterns

### State
- Local React state first (`useState`, `useReducer`)
- URL search params for shareable / filterable state
- No global state libraries unless prop passing becomes genuinely unmanageable across 3+ levels

---

## Error Handling

- `(main)` route group has `error.tsx` and `loading.tsx` — all pages under it get error recovery and loading states automatically
- Server Actions: wrap in try/catch, return typed `{ success, error }` objects — do not throw raw errors to the client
- Route handlers: return consistent JSON error shapes with appropriate status codes
- Use `notFound()` for missing resources (see `events/[id]/page.tsx`)
- Log server-side errors with enough context to debug, never leak stack traces or secrets to the client

---

## Integration Rules

- Each third-party service lives in `src/lib/<service>/`
- Separate browser-safe code (`client.ts`) from server-only code (`server.ts`)
- Never expose privileged keys in client code
- Stripe secret logic and webhooks must stay server-side
- Deepgram realtime logic stays in the integration layer or a feature hook

---

## TypeScript Rules

- Strict mode always
- No `any` — use `unknown` when the type is genuinely unclear
- Validate all external data (API responses, form inputs, env vars) with Zod
- Colocate feature types in `src/features/<feature>/types.ts`

---

## Tailwind Rules

- Tailwind utility classes for all styling
- No mixed styling systems
- Use `cn()` (clsx + twMerge) for conditional classes in shared components
- Design tokens defined via `@theme inline` in `globals.css`: `gold`, `gold-light`, `gold-dim`, `surface`, `surface-light`
- Fonts: `--font-sans` (Geist), `--font-mono` (Geist Mono), `--font-heading` (Bricolage Grotesque)
- Custom animations (loading screen, marquee, live-pulse, etc.) are CSS `@keyframes` in `globals.css`

---

## Testing

- Colocate tests inside the feature folder: `src/features/auth/__tests__/`
- Name test files: `<subject>.test.ts` or `<subject>.test.tsx`
- Integration / E2E tests live in a top-level `tests/` folder
- Focus on critical paths: auth flows, billing, data mutations

---

## Code Style

- Clear code over clever code
- Fewer moving parts over elaborate architecture
- Direct implementation over indirection
- Descriptive names — no abbreviations unless universally understood
- Comments only for non-obvious decisions (the "why", not the "what")
- Remove dead code immediately — do not comment it out
- No premature memoization — add only when profiling shows a need
- No one-off utility files for trivial logic — inline it

---

## Before Finishing Any Task

Verify:

- Code follows the feature-colocated folder structure
- Placed in the correct `features/<feature>/` or `lib/<service>/` folder
- Server vs Client boundaries are correct
- No secrets exposed to the client
- No `any` introduced
- No unnecessary abstraction added
- Tailwind-only styling
- Shared code is actually shared (used by 2+ features)
- Page files remain thin — import from features, compose
- Protected pages use `verifySession()` from DAL, not inline auth checks
- Env vars accessed through `env.ts` / `env.server.ts`, not raw `process.env`
