# SHAIDS – Student Hub for AI & Data Science

> Official web platform for the **Department of Artificial Intelligence & Data Science** at **A. C. Patil College of Engineering (ACPCE)**, Navi Mumbai.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Repository Structure](#repository-structure)
4. [Architecture](#architecture)
5. [Pages & Routes](#pages--routes)
6. [Database Schema](#database-schema)
7. [Real-Time Sync Engine](#real-time-sync-engine)
8. [Admin Dashboard](#admin-dashboard)
9. [Component Library](#component-library)
10. [Performance Optimizations](#performance-optimizations)
11. [Design System](#design-system)
12. [SEO & Accessibility](#seo--accessibility)
13. [Environment Variables](#environment-variables)
14. [Local Development](#local-development)
15. [Build & Deployment](#build--deployment)
16. [Version History](#version-history)

---

## Overview

SHAIDS is a full-stack, real-time web platform that serves as the digital hub for the AI & DS department. It showcases:

- **Events & Workshops** – Upcoming and completed departmental activities
- **Student Committee** – Current and historical team member profiles with drag-to-reorder
- **Faculty Directory** – Staff profiles with expertise, qualifications, and contact
- **Academic Achievements** – Toppers, NPTEL certifications, domain awards, project showcases, and department highlights
- **Resources** – Curated study materials, notes, roadmaps, and tools
- **Flagship Fests** – VECTORS (Technical), KURUKSHETRA (Sports), RHYTHMS (Cultural) with sub-events and photo galleries
- **Admin Panel** – Full CRUD dashboard with image cropping, drag reordering, and live preview

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16.1.6 (App Router, Turbopack) |
| **Language** | TypeScript 5.x |
| **UI Library** | React 19.2.3 |
| **Styling** | Tailwind CSS 4.x, tailwindcss-animate |
| **Animations** | Framer Motion 12.x |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage (shaids-assets bucket) |
| **Real-Time** | Supabase Realtime + BroadcastChannel API |
| **State** | React Context + useCallback memoization |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod validation |
| **Toasts** | Sonner |
| **Theme** | next-themes (dark/light/system) |
| **Markdown** | react-markdown + remark-gfm |
| **Smooth Scroll** | Lenis |

---

## Repository Structure

```
shaids-website/
└── v1.0/
    ├── public/
    │   └── images/              # Static logos (shaids-logo.png, acpce-logo-v2.png)
    ├── src/
    │   ├── app/
    │   │   ├── (public)/        # All public-facing pages
    │   │   │   ├── page.tsx              # Homepage (Hero + About + Feature Showcase)
    │   │   │   ├── about/                # About section (overview, messages, achievements)
    │   │   │   │   ├── overview/
    │   │   │   │   ├── messages/
    │   │   │   │   └── achievements/
    │   │   │   │       ├── highlights/
    │   │   │   │       ├── nptel/
    │   │   │   │       └── projects/
    │   │   │   ├── events/               # Events listing + fest sub-pages
    │   │   │   │   ├── [id]/             # Dynamic event detail
    │   │   │   │   └── fests/
    │   │   │   │       ├── vectors/
    │   │   │   │       ├── kurukshetra/
    │   │   │   │       └── rhythms/
    │   │   │   ├── resources/            # Resources listing + detail
    │   │   │   ├── team/                 # Team listing + profiles
    │   │   │   │   ├── [id]/
    │   │   │   │   └── individual/[id]/
    │   │   │   └── staff/                # Staff listing + profiles
    │   │   │       └── [id]/
    │   │   ├── admin/                    # Admin dashboard (login + CRUD panel)
    │   │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   ├── globals.css               # Design system (SHAIDS Deep Space Theme)
    │   │   ├── layout.tsx                # Root layout (providers, navbar, footer)
    │   │   ├── robots.ts                 # SEO robots.txt generation
    │   │   └── sitemap.ts                # SEO sitemap.xml generation
    │   ├── components/
    │   │   ├── client-views/             # Client-side page wrappers (8 files)
    │   │   ├── events/                   # EventCard, SaveButton
    │   │   ├── home/                     # Hero, About, FeatureShowcase
    │   │   ├── resources/                # ResourceCard
    │   │   ├── team/                     # TeamCard, StaffCard
    │   │   ├── providers/                # QueryProvider (TanStack)
    │   │   └── ui/                       # Navbar, Footer, Button, Card, Badge, Tabs,
    │   │                                 # ImageLightbox, ImageCropper, FestGalleryMarquee,
    │   │                                 # ShareModal, Tooltip, Calendar, etc.
    │   ├── context/
    │   │   └── content-context.tsx        # Central state provider (1444 lines)
    │   │                                 # - All CRUD operations
    │   │                                 # - Supabase Realtime subscriptions
    │   │                                 # - BroadcastChannel cross-tab sync
    │   │                                 # - 2s background polling
    │   │                                 # - Drag-to-reorder via created_at mapping
    │   └── lib/
    │       ├── supabase.ts               # Supabase client, UUID utils, media upload/delete
    │       ├── supabase-schema.sql        # Complete database DDL (268 lines)
    │       ├── content-moderation.ts      # Input sanitization
    │       └── utils.ts                  # cn() utility (clsx + tailwind-merge)
    ├── next.config.ts                    # Image domains, remote patterns
    ├── package.json
    └── tsconfig.json
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                         Browser Tab                          │
│                                                              │
│  ┌────────────┐     ┌───────────────┐     ┌──────────────┐  │
│  │ Public Pages│     │ Admin Panel   │     │ Other Tabs   │  │
│  │ (SSR + CSR)│     │ (CSR Only)    │     │ (via BC API) │  │
│  └─────┬──────┘     └──────┬────────┘     └──────┬───────┘  │
│        │                   │                     │           │
│  ┌─────▼───────────────────▼─────────────────────▼───────┐  │
│  │              ContentProvider (React Context)            │  │
│  │  ┌─────────┐ ┌──────────────┐ ┌────────────────────┐  │  │
│  │  │ State   │ │ CRUD Methods │ │ Sync Engine        │  │  │
│  │  │ (12     │ │ (save/delete │ │ • Realtime Sub     │  │  │
│  │  │ tables) │ │  per entity) │ │ • BroadcastChannel │  │  │
│  │  └─────────┘ └──────────────┘ │ • 2s Polling       │  │  │
│  │                               └────────────────────┘  │  │
│  └───────────────────────┬───────────────────────────────┘  │
│                          │                                   │
└──────────────────────────┼───────────────────────────────────┘
                           │ HTTPS / WSS
              ┌────────────▼────────────┐
              │     Supabase Cloud      │
              │  ┌────────────────────┐ │
              │  │ PostgreSQL (12 tbl)│ │
              │  ├────────────────────┤ │
              │  │ Realtime (WS)      │ │
              │  ├────────────────────┤ │
              │  │ Storage Bucket     │ │
              │  │ (shaids-assets)    │ │
              │  └────────────────────┘ │
              └─────────────────────────┘
```

---

## Pages & Routes

| Route | Type | Description |
|---|---|---|
| `/` | Static (○) | Homepage with Hero, About, Feature Showcase |
| `/about` | Static (○) | Redirect to /about/overview |
| `/about/overview` | Static (○) | Department vision, mission, statistics |
| `/about/messages` | Static (○) | HOD & Principal messages |
| `/about/achievements` | Static (○) | Achievements hub |
| `/about/achievements/highlights` | Static (○) | Department milestones & awards |
| `/about/achievements/nptel` | Static (○) | NPTEL certification tracker |
| `/about/achievements/projects` | Static (○) | Student project showcase |
| `/events` | Static (○) | Events listing with category filters |
| `/events/[id]` | Dynamic (ƒ) | Event detail with gallery lightbox |
| `/events/fests/vectors` | Static (○) | VECTORS technical fest page |
| `/events/fests/kurukshetra` | Static (○) | KURUKSHETRA sports fest page |
| `/events/fests/rhythms` | Static (○) | RHYTHMS cultural fest page |
| `/resources` | Static (○) | Curated learning resources |
| `/resources/[id]` | Dynamic (ƒ) | Resource detail |
| `/team` | Static (○) | Student committee listing |
| `/team/[id]` | Dynamic (ƒ) | Team member profile |
| `/team/individual/[id]` | Dynamic (ƒ) | Individual member detail |
| `/staff` | Static (○) | Faculty directory |
| `/staff/[id]` | Dynamic (ƒ) | Staff member profile |
| `/admin` | Static (○) | Admin dashboard (protected) |
| `/admin/login` | Static (○) | Admin authentication |
| `/robots.txt` | Static (○) | SEO robots file |
| `/sitemap.xml` | Static (○) | SEO sitemap |

**22 static pages + 5 dynamic routes = 27 total routes**

---

## Database Schema

12 Supabase tables with RLS enabled and public read/write policies:

| Table | Purpose | Key Columns |
|---|---|---|
| `events` | Workshops, hackathons, visits | title, date, end_date, location, type, category, gallery_images[] |
| `team` | Student committee members | name, role, category, academic_year, skills[], display_order |
| `staff` | Faculty directory | name, designation, qualification, expertise[], email |
| `resources` | Study materials & links | title, category, link, tags[], author |
| `projects` | Student project showcase | title, abstract, team[], tech_stack[], advisor |
| `nptel` | NPTEL certifications | name, course, cert, score, is_faculty |
| `highlights` | Department achievements | title, category, team, achievement, gallery[] |
| `fest_sub_events` | Fest competition results | fest_id, winner, runner_up, event_gallery[] |
| `fest_galleries` | Fest photo collections | id (vectors/kurukshetra/rhythms), gallery[] |
| `toppers` | Academic rank holders | sem_type, year_batch, rank, name, sgpa |
| `domain_awards` | Domain excellence awards | title, recipient, domain |
| `home_config` | Homepage configuration | hero_headline, stat_members, image_events, etc. |

Full DDL available at: `src/lib/supabase-schema.sql`

---

## Real-Time Sync Engine

The `ContentProvider` implements a **3-tier synchronization architecture**:

1. **Supabase Realtime** (WebSocket) – Subscribes to all 12 tables via `postgres_changes` channel. Triggers instant `refreshContent()` on any INSERT/UPDATE/DELETE.

2. **BroadcastChannel API** – Zero-latency cross-tab sync. When an admin saves data in one tab, all other tabs instantly update without network calls.

3. **Background Polling** (2-second interval) – Failsafe polling loop that calls `refreshContent()` every 2 seconds to catch any events missed by the WebSocket connection.

### Ordering System
Team/staff ordering is persisted by mapping drag-and-drop sequences to `created_at` timestamps. When items are reordered, new `created_at` values are computed in sequence and batch-updated in Supabase.

---

## Admin Dashboard

Accessible at `/admin` with credential-based authentication.

### Features:
- **CRUD** for all 12 content types (events, team, staff, resources, projects, NPTEL, highlights, fest sub-events, fest galleries, toppers, domain awards, home config)
- **Image Upload** to Supabase Storage with automatic old-file cleanup
- **Image Cropper** – Built-in crop/resize modal for profile photos and event banners
- **Drag-to-Reorder** – Reorder team and staff members with drag handles
- **Academic Year Toggle** – Switch between `2026-27` and `2025-26` data views
- **Live Preview** – Changes reflect instantly on the public site via the sync engine

---

## Component Library

### Core Components
| Component | File | Purpose |
|---|---|---|
| `Navbar` | `ui/navbar.tsx` | Floating glassmorphic navigation with mobile drawer |
| `Footer` | `ui/footer.tsx` | Minimal footer with branding and social links |
| `Hero` | `home/hero.tsx` | Full-screen hero with animated logo morph |
| `About` | `home/about.tsx` | Three-column feature cards with scroll animations |
| `FeatureShowcase` | `home/feature-showcase.tsx` | Alternating image+text sections with hover shimmer |
| `EventCard` | `events/event-card.tsx` | Event preview card with registration CTA |
| `TeamCard` | `team/team-card.tsx` | Team member card with avatar and social links |
| `StaffCard` | `team/staff-card.tsx` | Faculty card with designation and expertise |
| `ResourceCard` | `resources/resource-card.tsx` | Resource card with icon mapping and download link |
| `ImageLightbox` | `ui/image-lightbox.tsx` | Full-screen gallery viewer with keyboard navigation |
| `ImageCropper` | `ui/image-cropper-modal.tsx` | In-admin image crop/resize tool |
| `FestGalleryMarquee` | `ui/fest-gallery-marquee.tsx` | Auto-scrolling photo carousel (pause on hover) |
| `AcademicYearToggle` | `academic-year-toggle.tsx` | Pill-style year switcher |
| `ModeToggle` | `mode-toggle.tsx` | Dark/light/system theme toggle |

### Design Patterns
- All cards share a consistent visual language: `rounded-[2.5rem]`, `backdrop-blur-3xl`, `glass` styling
- Hover effects: `y: -5px` lift, border glow, scale-up avatars, shimmer overlays
- Motion: `whileInView` scroll triggers, `layoutId` navbar indicator spring animation
- Typography: Geist Sans + Geist Mono via `next/font/google`

---

## Performance Optimizations

| Optimization | Implementation |
|---|---|
| **Image Lazy Loading** | `loading="lazy"` + `sizes` attributes on all non-hero images |
| **Image Quality** | `quality={75-80}` to reduce payload without visible degradation |
| **DNS Prefetch** | `<link rel="dns-prefetch">` for unsplash.com, googleapis.com |
| **Preconnect** | `<link rel="preconnect">` for unsplash.com CDN |
| **Content Visibility** | CSS `content-visibility: auto` on `<section>` elements for off-screen paint optimization |
| **GPU Acceleration** | `will-change: transform` on marquee, `will-change: backdrop-filter` on glass elements |
| **CSS Containment** | `contain: layout style` on `<body>` to isolate layout recalculations |
| **Font Optimization** | `next/font/google` for zero-layout-shift font loading |
| **Smooth Rendering** | `text-rendering: optimizeLegibility`, `-webkit-font-smoothing: antialiased` |
| **Turbopack** | Next.js 16 Turbopack for 10x faster HMR and build |
| **Static Pre-rendering** | 22 pages statically generated at build time |

---

## Design System

### Theme: "SHAIDS Deep Space"

**Dark Mode** (default):
- Background: `oklch(0.08 0.015 280)` – Deep violet-tinted space black
- Primary: `oklch(0.65 0.3 290)` – Electric neon purple
- Secondary: `oklch(0.70 0.20 240)` – Cyber blue
- Accent: `oklch(0.65 0.25 320)` – Neon fuchsia
- Cards: `oklch(0.10 0.015 280)` with `backdrop-blur-3xl`
- Borders: Purple-tinted at 30% opacity

**Light Mode**:
- Clean white background with subtle purple/blue radial gradients
- Vivid purple primary, vivid blue secondary
- Cards: White with light glass effect

### Utility Classes
- `.glass` – Frosted glassmorphic panel (24px blur, saturate 180%)
- `.glass-card` – Lighter glass variant (16px blur)
- `.neon-border` – Glowing neon box-shadow + border
- `.text-gradient` – Primary → Blue → Secondary gradient text
- `.no-scrollbar` – Hidden scrollbar for overflow containers

---

## SEO & Accessibility

- **Structured Data** (JSON-LD) for `EducationalOrganization` schema
- **OpenGraph** + **Twitter Card** meta tags
- **Dynamic robots.txt** and **sitemap.xml** generation
- **Semantic HTML** – Proper heading hierarchy, `<section>`, `<nav>`, `<main>`, `<footer>`
- **Focus Visible** – Custom `:focus-visible` ring for keyboard navigation
- **Selection Color** – Branded purple text selection
- **Alt Text** – All images include descriptive alt attributes
- **Responsive** – Mobile-first layout with breakpoints at `sm`, `md`, `lg`, `xl`

---

## Environment Variables

Create a `.env.local` file in the `v1.0/` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password
```

---

## Local Development

```bash
cd v1.0
npm install
npm run dev        # Starts on http://localhost:3000
```

---

## Build & Deployment

```bash
npm run build      # Production build (Turbopack)
npm run start      # Serve production build locally
```

Static export is supported by Vercel, Netlify, or any Node.js hosting platform.

---

## Version History

| Version | Branch | Date | Highlights |
|---|---|---|---|
| **v1.0** | `v1.0` | Jul 2026 | Static frontend version, hardcoded data |
| **v1.1** | `v1.1` | Jul 2026 | Multi-day events, image cropper, staff expertise, inactivity timeout |
| **v1.2** | `v1.2` | Jul 2026 | About section, fest sub-events, marquees, toppers, NPTEL hub, domain awards, lightbox, admin restoration |
| **v1.3** | `v1.3` | Aug 2026 | Academic year segmentation, UI refinements, failproof Supabase sync |
| **v1.4** | `v1.4` | Aug 2026 | Performance optimization, UI/UX polish, dead code removal, full documentation, production-ready cleanup |

---

**Built with ❤️ by the SHAIDS Tech Team — Department of AI & Data Science, ACPCE Navi Mumbai**
