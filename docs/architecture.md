# 4AM.WAV — System Architecture

## High-Level Overview

```mermaid
graph TB
    subgraph Client ["Browser (React Client)"]
        Pages["Pages<br/>Home | Events | Profile | Tickets"]
        Chat["ChatWidget<br/>(floating, global)"]
        Auth["GoogleAuthButton"]
        Voice["useVoiceInput<br/>(MediaRecorder)"]
    end

    subgraph NextJS ["Next.js App Router (Server)"]
        subgraph ServerPages ["Server Components"]
            SP1["/events — fetch events"]
            SP2["/events/[id] — fetch event detail"]
            SP3["/profile — fetch user + profile"]
            SP4["/tickets — fetch orders"]
        end

        subgraph Actions ["Server Actions"]
            SA1["updatePhone()"]
            SA2["signOut()"]
        end

        subgraph API ["API Routes"]
            R1["POST /api/checkout"]
            R2["POST /api/deepgram-token"]
            R3["POST /api/webhooks/stripe"]
            R4["GET /auth/callback"]
        end

        MW["Middleware<br/>(session refresh)"]
    end

    subgraph External ["External Services"]
        Supa["Supabase<br/>Auth + PostgreSQL"]
        Stripe["Stripe<br/>Payments"]
        DG["Deepgram<br/>Speech-to-Text"]
        Google["Google OAuth"]
    end

    subgraph DB ["Database Tables"]
        T1["events"]
        T2["ticket_tiers"]
        T3["orders"]
        T4["order_items"]
        T5["profiles"]
    end

    %% Client → Server
    Pages --> ServerPages
    Auth --> R4
    Chat --> Voice
    Voice -- "fetch token" --> R2
    Pages -- "VIP upgrade" --> R1

    %% Server → External
    SP1 & SP2 & SP3 & SP4 --> Supa
    SA1 --> Supa
    R1 --> Stripe
    R2 -. "returns API key" .-> DG
    R3 -- "webhook" --> Supa
    R4 --> Supa
    MW --> Supa

    %% Direct Client → External
    Voice == "WebSocket<br/>wss://api.deepgram.com" ==> DG
    Auth --> Google --> Supa

    %% Stripe webhook
    Stripe -- "checkout.session.completed<br/>subscription.deleted" --> R3

    %% DB
    Supa --> DB
```

## Data Flow Diagrams

### Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant NextJS as Next.js Server
    participant Supabase
    participant Google

    User->>Browser: Click "Continue with Google"
    Browser->>Supabase: signInWithOAuth()
    Supabase->>Google: Redirect to Google
    Google-->>Browser: OAuth code
    Browser->>NextJS: GET /auth/callback
    NextJS->>Supabase: Exchange code for session
    Supabase-->>NextJS: User + session
    alt New user (< 60s old)
        NextJS-->>Browser: Redirect to /welcome
    else Returning user
        NextJS-->>Browser: Redirect to previous page
    end
    Note over Browser,Supabase: Middleware refreshes session on every request
```

### VIP Membership Purchase

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant NextJS as Next.js Server
    participant Stripe
    participant Supabase

    User->>Browser: Click "Upgrade to VIP"
    Browser->>NextJS: POST /api/checkout
    NextJS->>Supabase: Verify auth
    NextJS->>Stripe: Create checkout session ($100/yr)
    Stripe-->>NextJS: Session URL
    NextJS-->>Browser: Redirect to Stripe
    Browser->>Stripe: Complete payment
    Stripe-->>Browser: Redirect to /profile

    Note over Stripe,Supabase: Async webhook
    Stripe->>NextJS: POST /api/webhooks/stripe<br/>(checkout.session.completed)
    NextJS->>Supabase: UPDATE profiles SET membership_tier = 'vip'
```

### Real-Time Voice Transcription

```mermaid
sequenceDiagram
    actor User
    participant Browser
    participant NextJS as Next.js Server
    participant Deepgram

    User->>Browser: Tap mic button
    par Parallel requests
        Browser->>NextJS: POST /api/deepgram-token
        NextJS-->>Browser: API key
    and
        Browser->>Browser: getUserMedia() (mic access)
    end
    Browser->>Deepgram: Open WebSocket<br/>wss://api.deepgram.com/v1/listen
    loop Every 250ms while recording
        Browser->>Deepgram: Send audio chunk
        Deepgram-->>Browser: Interim transcript (real-time)
    end
    User->>Browser: Tap stop
    Browser->>Deepgram: CloseStream
    Deepgram-->>Browser: Final transcript
    Note over Browser: Text fills input field
```

## Database Schema

```mermaid
erDiagram
    auth_users ||--o{ events : creates
    auth_users ||--o| profiles : has
    auth_users ||--o{ orders : places
    events ||--o{ ticket_tiers : has
    events ||--o{ orders : "ordered for"
    orders ||--o{ order_items : contains
    ticket_tiers ||--o{ order_items : "references"

    profiles {
        uuid id PK
        text phone
        text membership_tier "free | vip"
        timestamptz updated_at
    }

    events {
        uuid id PK
        uuid created_by FK
        text title
        text description
        text image_url
        text venue_name
        text venue_address
        timestamptz starts_at
        timestamptz ends_at
    }

    ticket_tiers {
        uuid id PK
        uuid event_id FK
        text name
        int price_cents
        int quantity
        int sold_count
    }

    orders {
        uuid id PK
        uuid user_id FK
        uuid event_id FK
        text status "confirmed | cancelled"
        int total_cents
    }

    order_items {
        uuid id PK
        uuid order_id FK
        uuid ticket_tier_id FK
        int quantity
        int unit_price_cents
    }
```

## Project Structure

```
src/
├── app/                              # Routing & API only
│   ├── api/
│   │   ├── checkout/route.ts         # Stripe checkout session
│   │   ├── deepgram-token/route.ts   # Voice auth token
│   │   └── webhooks/stripe/route.ts  # Subscription lifecycle
│   ├── auth/callback/route.ts        # OAuth callback
│   ├── events/[id]/page.tsx          # Event detail (SSR)
│   ├── events/page.tsx               # Event listing (SSR)
│   ├── profile/page.tsx              # User profile (SSR)
│   ├── tickets/page.tsx              # User orders (SSR)
│   └── layout.tsx                    # Root layout + ChatWidget
│
├── features/                         # Feature-first organization
│   ├── auth/                         # Google OAuth
│   ├── chat/                         # Chat widget + voice input
│   ├── events/                       # Event cards, detail, ticket modal
│   ├── profile/                      # Profile editing + membership
│   ├── tickets/                      # Order display
│   └── welcome/                      # New user onboarding
│
├── components/layout/Navbar.tsx      # Shared navigation
│
├── lib/
│   ├── env.ts                        # Client env validation (Zod)
│   ├── env.server.ts                 # Server env validation (Zod)
│   └── integrations/
│       ├── supabase/                 # client.ts, server.ts, middleware.ts
│       ├── stripe/server.ts          # Stripe SDK init
│       └── deepgram/server.ts        # Deepgram SDK init
│
└── middleware.ts                      # Auth session refresh
```
