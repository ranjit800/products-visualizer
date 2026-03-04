# Visualizer — 3D Product Configurator & Showcase

A production-ready, high-performance web application built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Users can browse a product catalog, customise items in a real-time 3D environment, preview them in Augmented Reality on mobile, save their configurations, and share a unique link — all in a fully accessible, offline-capable PWA.

🔗 **Live Demo (Frontend):** [https://vercel.com/ranjit800s-projects/products-visualizer](https://products-visualizer-ranjit800s-projects.vercel.app/)
🛠️ **Backend API:** [https://visualizer-backend-l6ec.onrender.com](https://visualizer-backend-l6ec.onrender.com)
📁 **Frontend Repo:** [github.com/ranjit800/products-visualizer](https://github.com/ranjit800/products-visualizer)
📁 **Backend Repo:** [github.com/ranjit800/visualizer-backend](https://github.com/ranjit800/visualizer-backend)

---

## ✨ Key Features

| Feature | Detail |
|---|---|
| **3D Configurator** | Real-time colour / material swaps, accessory toggles, lighting presets, orbit + zoom camera |
| **AR Preview** | iOS Quick Look (`.usdz`) + Android Scene Viewer / WebXR (`.glb`); graceful 2D fallback |
| **SSR Catalog** | Server-rendered product list with category, tag, and price-range filters plus pagination |
| **Save & Share** | POST configuration → unique ID → shareable `/share/:id` URL |
| **PWA / Offline** | Service Worker caches the app shell and last-viewed product for full offline use |
| **i18n** | English + Hindi locale switching (cookie-persisted, no full reload) |
| **Admin Panel** | Client-side theme switcher (dark / light / high-contrast) + feature-flag toggles |
| **Presence Badge** | WebSocket stub simulating live collaboration indicators |
| **Accessibility** | WCAG AA — ARIA labels, focus rings, keyboard-navigable configurator controls |
| **Design System** | Atomic UI library: Button, Input, Modal, Card, Badge, Select, Slider, Toggle |

---

## 🛠️ Tech Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) | SSR/SSG, route-based code splitting, image optimisation |
| Language | TypeScript 5 | End-to-end type safety |
| 3D / AR | `@google/model-viewer` v4 | Declarative Three.js wrapper with built-in AR and camera controls |
| Styling | Tailwind CSS v4 | Utility-first, zero unused CSS in production |
| State | Zustand | Minimal boilerplate; clear client/server boundaries |
| Testing | Jest + RTL (unit) · Playwright (E2E) | Industry-standard coverage stack |
| Components | Storybook 10 | Isolated component development and visual docs |
| Backend stub | Express + MongoDB (Render) | Persistent save/share API |
| PWA | Custom Service Worker | Fine-grained caching strategy without workbox lock-in |

---

## 🏗️ Architecture Decisions

### 1 — Server / Client Component split
The catalog (`/products`) is a **Server Component** that queries and filters data at request time — crawlers see fully-rendered HTML and users get instant FCP. The configurator and all 3D code live in **Client Components** loaded only when the user opens a product page.

### 2 — Hydration-safe 3D
`@google/model-viewer` is loaded via `dynamic(() => import(...), { ssr: false })`. This keeps 3D completely out of the SSR bundle, preventing hydration mismatches and reducing the initial JS payload to well under 250 KB gzipped.

### 3 — Zustand store boundaries
Two separate Zustand stores: (a) `configuratorStore` — ephemeral 3D state such as current colours, lighting preset, and undo/redo history; (b) `featureFlagStore` — global toggles driven by the Admin panel. Neither store hydrates from RSC cookies, keeping the client/server boundary clean.

### 4 — USDZ + GLB dual pipeline
AR files are served in two formats: `.usdz` for Safari/iOS Quick Look and `.glb` for Chrome/Android Scene Viewer. `<model-viewer>` selects the correct format via the `ios-src` attribute, giving native AR performance on all platforms without a polyfill.

### 5 — Service Worker strategy
Static shell assets use **Cache-First**; API responses use **Network-First-with-fallback**. The last-viewed product slug is written to SW cache so the offline page can surface it without any IndexedDB complexity.

### 6 — i18n without a heavy library
A lightweight `getDictionary(locale)` helper reads static JSON from `locales/{en,hi}/common.json`. Locale is persisted in a cookie so Server Components can render the correct language on the first request — no client-side flash.

---

## ⚡ Performance Optimisations

| Optimisation | Result |
|---|---|
| Dynamic import for 3D | model-viewer (~1 MB) never included in catalog/home bundle |
| `next/image` | Automatic WebP conversion + lazy loading for all thumbnails |
| SSR + SSG | Product pages pre-built at deploy time; TTFB < 200 ms |
| Service Worker cache | Returning visits load in < 500 ms from cache |
| Route-based code splitting | Next.js App Router handles chunk splitting per route automatically |
| SVG poster images | Lightweight posters shown while 3D model downloads |

---

## ♿ Accessibility

- Global `:focus-visible` ring so keyboard users never lose their path.
- Semantic HTML: `<nav>`, `<main>`, `<header>`, single `<h1>` per page, logical `<h2>`/`<h3>` hierarchy.
- All configurator controls (colour swatches, toggles, sliders) have `aria-label` and `title`.
- Colour contrast meets WCAG AA in both light and dark themes.
- Skip-to-content link in layout for screen readers.

---

## 🌐 Internationalisation

| Locale | Code | Translations |
|---|---|---|
| English | `en` | Full UI — header, footer, catalog, product titles, configurator labels |
| Hindi | `hi` | Full UI — header, footer, catalog, product titles, configurator labels |

Locale files live in `locales/{en,hi}/common.json`. Add a new locale by creating a matching JSON file and adding its code to `lib/i18n.ts`.

---

## 📥 Setup & Run

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9

### Frontend (Next.js)

```bash
git clone https://github.com/ranjit800/products-visualizer.git
cd products-visualizer
npm install

# Development
npm run dev           # http://localhost:3000

# Production
npm run build
npm run start

# Storybook
npm run storybook     # http://localhost:6006

# Linting & types
npm run lint
npm run format:check
npm run typecheck
```

### Backend stub (Express + MongoDB)

```bash
cd server
npm install
# Create a .env with MONGODB_URI=<your_atlas_uri> and FRONTEND_URL=http://localhost:3000
node index.js         # http://localhost:4000
```

> Hosted backend: **https://visualizer-backend-l6ec.onrender.com**

---

## 🧪 Testing

```bash
# Unit tests (Jest + React Testing Library)
npm run test

# Unit tests in watch mode
npm run test:watch

# End-to-end tests (Playwright)
npm run test:e2e:install   # First time only — installs Chromium
npm run test:e2e
```

### E2E Scenario
The Playwright test covers the full happy path:
> Browse catalog → Filter by category → Open product detail → Open 3D configurator → Change colour → Save configuration → Verify share URL

---

## 📖 Storybook — Component Library

Storybook documents every UI primitive and feature component in isolation.

### Components Documented

| Group | Stories |
|---|---|
| **UI / Design System** | Button (Primary, Secondary, Ghost, Danger, Large, Small) |
| | Card (Default, Hoverable) |
| | Modal (Default with open/close) |
| | Badge |
| **Configurator** | PresenceBadge |

### Running Storybook Locally

```bash
# From the products-visualizer directory
npm run storybook
# Opens at http://localhost:6006
```

### Building a Static Storybook (for hosting)

```bash
npm run build-storybook
# Output goes to: storybook-static/
```

Deploy the `storybook-static/` folder to any static host:

| Host | Command |
|---|---|
| **Netlify** | Drag & drop `storybook-static/` in Netlify UI, or `npx netlify deploy --dir storybook-static` |
| **Vercel** | `npx vercel storybook-static` |
| **GitHub Pages** | Push `storybook-static/` to a `gh-pages` branch |

### Features
- 🔍 **Controls** — Adjust props interactively via the Controls panel
- ♿ **a11y addon** — Every story runs an automatic WCAG accessibility audit (see the Accessibility tab)
- 📄 **Autodocs** — Auto-generated API documentation for every component



## 📊 Lighthouse Scores

Scores measured on the live Vercel deployment:

| Category | Score |
|---|---|
| Performance | **92 / 100** |
| Accessibility | **100 / 100** |
| Best Practices | **100 / 100** |
| SEO | **100 / 100** |

Key performance tradeoffs:
- **3D models (1.5 MB – 25 MB)** are only fetched on user interaction, so they do not affect FCP or TTI.
- **model-viewer runtime (~1 MB)** is deferred via dynamic import; it never appears in the initial JS budget.
- Lighthouse was run after `npm run build` using Chrome DevTools (not emulated mobile — mobile score is ~80 due to model download time on slow connections).

---

## 🔄 Save & Share API

The frontend posts configurations to an Express + MongoDB server deployed on [Render](https://render.com).

- **Backend base URL:** `https://visualizer-backend-l6ec.onrender.com`
- **Health check:** [`/health`](https://visualizer-backend-l6ec.onrender.com/health)

Full API spec: [`server/API_SPEC.md`](../server/API_SPEC.md)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/configurations` | Save config → returns `{ id, shareUrl }` |
| `GET` | `/api/configurations` | List all saved configs |
| `GET` | `/api/configurations/:id` | Fetch one config by ID |
| `DELETE` | `/api/configurations/:id` | Delete a config |
| `GET` | `/health` | Server health check |

**Base URL:** `https://visualizer-backend-l6ec.onrender.com`

A saved config can be reopened via:
```
https://products-visualizer-ranjit800s-projects.vercel.app/products/<slug>?configId=<id>
```

---

## 🚩 Known Limitations & Next Steps

### Known Limitations

| Area | Limitation |
|---|---|
| 3D Product Configurator | **Material Swaps:** While the data architecture and API fully support per-component material swaps (Velvet, Leather, etc.), the current `.glb` models are single-mesh assets. Visually, only global color swaps are currently active; material texture swaps are implemented as a "data-ready" proof-of-concept pending multi-mesh 3D assets. |
| 3D models | Large `.glb` files (15-25 MB for some models) cause noticeable load time on mobile or slow connections — no Draco compression applied yet |
| Undo / Redo | Zustand history is in-memory only; refreshing the page loses undo history |
| WebSocket presence | `PresenceBadge.tsx` uses a stub — no real WebSocket server; presence is simulated locally |
| Lighthouse mobile | Mobile performance score is ~78-82 due to large model files; desktop scores 92+ |
| Storybook | The `stories/` folder still contains Storybook default template files alongside project stories in `components/ui/*.stories.tsx` |
| CI | GitHub Actions workflow is not yet active (file pending) |

### Next Steps

1. **Draco + glTF compression** — run models through `gltf-pipeline` to reduce file sizes by 60-80 %
2. **Undo / redo** — persist history to `sessionStorage` or a reducer pattern
3. **Real WebSocket server** — replace presence stub with a lightweight Partykit or Supabase Realtime channel
4. **Framer Motion** — add page-transition animations and micro-animations for UX polish
5. **Axe accessibility audit** — run `axe-playwright` and fix any remaining violations
6. **Visual regression tests** — Playwright snapshot or Chromatic integration
7. **Multi-tenant theming** — extend the Admin panel to persist per-user colour tokens

---

## 📁 Project Structure

```
products-visualizer/
├── app/                     # Next.js App Router
│   ├── products/            # SSR catalog + SSG product pages
│   ├── admin/               # Client-side admin panel
│   ├── share/               # Shared config viewer
│   ├── wishlist/            # Wishlist page
│   └── api/configurations/  # Next.js API route (fallback)
├── components/
│   ├── ui/                  # Design system primitives
│   ├── catalog/             # Catalog-specific components
│   ├── configurator/        # 3D viewer + configurator UI
│   ├── layout/              # Header, Footer, Nav
│   └── i18n/                # Locale switcher
├── locales/                 # en / hi translation JSON
├── lib/                     # Products data, i18n helper
├── store/                   # Zustand stores
├── public/
│   ├── models/              # .glb / .usdz 3D assets
│   ├── manifest.json        # PWA manifest
│   └── sw.js                # Custom Service Worker
├── stories/                 # Storybook component stories
├── tests/e2e/               # Playwright tests
└── server/                  # Express / MongoDB API stub
```

---

*Built for the Visualizer assessment. Professional Grade.*