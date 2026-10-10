# SHAIDS – Student Hub for AI & Data Science

> Official web platform for the **Department of Artificial Intelligence & Data Science** at **A. C. Patil College of Engineering (ACPCE)**, Navi Mumbai.

---

## 🌟 Overview

**SHAIDS** is a high-performance, real-time web portal that powers the digital presence of the Department of Artificial Intelligence & Data Science at ACPCE. It brings together student research, departmental fests, interactive faculty directories, achievement showcases, study resources, and an administrative control panel with zero-latency live synchronization.

### Key Highlights
- **Flagship Fests Showcase**: Dedicated hubs for **VECTORS** (Technical), **KURUKSHETRA** (Sports), and **RHYTHMS** (Cultural) featuring ambient spotlights and auto-scrolling photo marquees.
- **Dynamic Community Hub**: Interactive team committee and faculty directory with smooth spring hover lifts and profile views.
- **Academic Excellence**: Comprehensive tracking for departmental toppers, NPTEL certifications, Capstone projects, and milestones.
- **Real-Time Data Engine**: 3-tier synchronization leveraging Supabase Realtime (WebSocket), BroadcastChannel API for multi-tab sync, and background fallback polling.
- **Secure Admin Panel**: Full CRUD operations for 12 content categories with integrated image cropping, drag-and-drop reordering, and instant live preview.

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16.4.0 (App Router, Turbopack) |
| **Language** | TypeScript 5.x |
| **UI Library** | React 19.3.0 |
| **Styling** | Tailwind CSS 4.3.3 |
| **Animations** | Framer Motion 14.0.0 |
| **Database & Auth** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage (`shaids-assets` bucket) |
| **Realtime Sync** | Supabase Realtime + BroadcastChannel API |
| **Icons & UI** | Lucide React, Radix UI Primitives, Sonner Toasts |
| **Smooth Scroll** | Lenis 1.3.26 |

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v20 or higher recommended
- **npm**: v10 or higher

### 2. Clone and Install
```bash
git clone https://github.com/vedant-9905/shaids-website-v1.0.git
cd shaids-website-v1.0
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the repository root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_ADMIN_PASSWORD=your-admin-password
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts local Next.js development server on port 3000 with Turbopack |
| `npm run build` | Compiles an optimized production build via Next.js Turbopack |
| `npm run start` | Serves the generated production build locally |
| `npm run lint` | Runs ESLint 9 checks across the codebase |

---

## 📖 In-Depth Documentation

For architectural diagrams, database schema definitions, component specifications, and the complete synchronization lifecycle, read:

👉 [**PROJECT_DOCUMENTATION.md**](./PROJECT_DOCUMENTATION.md)

---

## 📄 License

© 2026 SHAIDS-ACPCE. Built with ❤️ by the SHAIDS Tech Team — Department of AI & Data Science, A. C. Patil College of Engineering, Navi Mumbai.

