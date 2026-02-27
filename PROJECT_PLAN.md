## Visualizer – Product Configurator & Showcase

This document is the **authoritative project spec + implementation plan** for the Visualizer app.  
It is written so that any AI coding assistant / IDE can pick it up and continue work safely.

---

## 1. Goal & Scope

- **Goal**: Build a **production-ready, high-performance product configurator & showcase** web app that lets users:
  - Browse a **server-rendered catalog** with filters.
  - Open a **product detail + 3D configurator**.
  - **Preview in AR** on supported mobile devices with graceful fallback.
  - **Save & share configurations** via a simple JSON API/mock server.
  - Optionally show **live presence / collaboration hint**.
  - Provide an **admin preview panel** to toggle global theme/feature flags.
- **Primary focus**: Frontend architecture, UX, performance, accessibility, and deployment.

---

## 2. Tech Stack & Quality Requirements

- **Framework**: Next.js (13+ with App Router) + React + TypeScript.
- **Styling**: Tailwind CSS (utility-first, modular, design tokens for theme).
- **Design system (atomic components)**:
  - `Button`, `Input`, `Select`, `Checkbox`, `Toggle`, `Slider`
  - `Card`, `Modal`, `Tag`, `Badge`, `IconButton`
  - Layout primitives: `Container`, `Grid`, `Stack`, `Flex`.
- **State management**:
  - **Zustand** for app-level states:
    - Configurator state (current product, parts, materials, history).
    - Global UI state (theme, feature flags, locale, toasts).
  - **React Context** for:
    - I18n (current locale + translation dictionary).
    - Optional collaboration presence.
- **Tooling**:
  - ESLint (Next.js + TypeScript + React hooks rules).
  - Prettier (consistent formatting).
  - TypeScript strict mode (or near-strict) + `tsc` in CI.
  - Jest + React Testing Library.
  - Playwright for E2E.
  - Storybook for components/configurator controls.

---

## 3. Functional Requirements (Features)

### 3.1 Catalog & SEO

- **Catalog Page** (e.g., `/` or `/products`):
  - SSR/SSG using Next.js server components.
  - Pagination (page param: `?page=`).
  - Filters:
    - **Category** (e.g., Chair, Lamp, Desk).
    - **Price range** or **tag** filter.
  - Uses a mock products dataset (JSON) or API route.
  - Uses `next/image` with lazy loading for product thumbnails.
  - Proper semantic HTML for SEO (headings, lists, landmarks).

- **Product Detail Page** (e.g., `/products/[slug]`):
  - SSR/SSG with dynamic metadata:
    - `title`, `description`, `og:image`, `og:title`, `og:description`.
  - Renders:
    - Product info (name, description, price, tags).
    - Static gallery / hero image (SEO-friendly).
    - Button to **Open Configurator** (dynamic 3D).

### 3.2 3D Configurator

- Implemented on product detail (client-side, dynamically imported).
- **Tech**:
  - Preferred: `@google/model-viewer` (easier AR integration).
  - Alternative: `Three.js` + `react-three-fiber` (if needed).
- **Features**:
  - **Material / color swapping**:
    - Preset swatches (e.g., `["#111827", "#e5e7eb", "#f97316"]`).
    - Applies to at least one configurable material on the 3D model.
  - **Toggle components**:
    - Example: `Show cushion`, `Add lamp shade`, `Attach stand`.
  - **Lighting presets**:
    - E.g., `Studio`, `Daylight`, `Warm`.
    - Adjust environment / exposure or `light-intensity` in `model-viewer`.
  - **Camera controls**:
    - Orbit + zoom constraints (min/max distance, vertical angle).
  - **Dynamic import**:
    - Only load 3D + AR code **after** user opens configurator section (e.g., `lazy()` or `dynamic()` with `ssr: false`).

### 3.3 AR Preview

- On mobile + supported browsers:
  - `model-viewer` AR (`ar`, `ar-modes="webxr scene-viewer quick-look"`).
- On unsupported devices:
  - Show:
    - Static hero/configuration render or snapshot.
    - Message: “AR is not supported on this device. Here’s a 3D preview instead.”
- AR-related scripts/components must be **dynamically imported** and **deferred** so they don’t impact initial page load.

### 3.4 Save / Share Configuration

- **Configuration data model** (example):
  - `productId: string`
  - `materials: { [partId: string]: string /* color/material id */ }`
  - `components: { [componentId: string]: boolean }`
  - `lightingPreset: string`
  - `camera: { azimuth: number; elevation: number; distance: number }`
  - Optional: `createdAt`, `name`, `notes`.
- **API**:
  - Simple JSON API stub at `/api/configurations`:
    - `POST /api/configurations` – save configuration, returns `id`.
    - `GET /api/configurations/[id]` – load configuration by ID.
  - Backed by:
    - In-memory store or small filesystem JSON in a `/mock-server` or `/backend` dir.
  - **Share**:
    - UI shows a shareable link (e.g., `/share/[id]`).
    - Nice-to-have: also encode config state into URL query (bonus).

### 3.5 Collaboration Hint (Presence)

- Optional **WebSocket stub** (or mock):
  - Show simple **presence indicator**:
    - “2 other people viewing this product” / colored dots / avatar initials.
  - Implementation options:
    - A mocked WebSocket client that randomly updates presence.
    - Or a local `setInterval` simulation with a well-defined interface to swap with a real socket later.

### 3.6 Admin Preview (Theme & Feature Flags)

- `/admin/preview` route (client-side only).
- Features:
  - Change **global theme**: `light`, `dark`, `high-contrast` (stored in Zustand + localStorage).
  - Toggle **feature flags**:
    - `enableAR`, `enablePresenceIndicator`, `enableAdvancedLighting`, etc.
  - Whenever toggles change:
    - State propagates via context/store to app shell.

---

## 4. Performance, Accessibility, i18n, Offline

### 4.1 Performance & Bundles

- **Budget**: Initial JS bundle ≤ **250 KB gzipped**.
- Strategies:
  - Use **Next.js App Router** with server components for catalog where possible.
  - **Dynamic import** heavy libs:
    - 3D (`model-viewer` or `three`), AR, presence simulation, Storybook-only deps.
  - Avoid large UI libraries; use **small design system** with Tailwind.
  - Use `next/image` with:
    - Responsive sizes, lazy loading, appropriate `priority` on hero.
  - Enable **route-based code splitting** (Next default).
  - Avoid unnecessary polyfills; lean on modern browsers.

### 4.2 Accessibility

- WCAG basics:
  - All interactive elements:
    - Keyboard-focusable, visible focus styles.
  - Configurator controls:
    - Accessible labels, `aria-pressed`, `aria-label`, etc.
    - Keyboard shortcuts (arrow keys to change color, tab order).
  - Color contrast:
    - Tailwind theme tokens to ensure contrast (`bg-slate-900`, `text-slate-50` for dark, etc.).
  - Use appropriate ARIA roles for:
    - Modals (`role="dialog"` + `aria-modal`).
    - Alerts / notifications.

### 4.3 Internationalization (i18n)

- Locales:
  - `en` (English), `hi` (Hindi).
- Approach:
  - Simple **translation JSON** files:
    - `locales/en/common.json`
    - `locales/hi/common.json`
  - Context or Next.js `useTranslations`-style hook that:
    - Reads current locale from:
      - Route segment (`/en/products`, `/hi/products`) **or**
      - Query param / localStorage (choose one approach and implement consistently).
  - At minimum translate:
    - Header navigation.
    - Footer.
    - Product titles (human-readable).
    - Key buttons/labels (Configure, Save, Share, AR Preview).

### 4.4 Offline & Resilience (PWA)

- Use **PWA** setup:
  - `manifest.json` with icons, name, start URL, theme color.
  - `service worker` via `next-pwa` or custom Workbox integration.
  - Cache:
    - Catalog shell (page, CSS, JS).
    - Last viewed product detail data and images (where reasonable).
  - When offline:
    - Show cached catalog + last-viewed product.
    - Display friendly offline banners / info.
- Error states:
  - Global error boundary + page-level error components.
  - For network/API failure:
    - Show fallback UI with retry button.

---

## 5. Testing, Storybook, CI/CD, Deployment

### 5.1 Tests

- **Unit tests (Jest + RTL)**:
  - Catalog filters (behavior).
  - Configurator controls (e.g., clicking color swatch updates state).
  - Save configuration logic (store layer).
- **E2E (Playwright)**:
  - Scenario:
    1. Open catalog.
    2. Apply filter and paginate (if needed).
    3. Open a product page.
    4. Open configurator.
    5. Change color/material.
    6. Save configuration.
    7. Assert success UI / presence of share link.

### 5.2 Storybook

- Storybook stories for:
  - Design system components: `Button`, `Input`, `Card`, `Modal`.
  - Configurator controls:
    - Color swatches.
    - Component toggles.
    - Lighting preset selector.

### 5.3 CI/CD

- **GitHub Actions** workflow:
  - On `push` + `pull_request`:
    - Install deps (cache node_modules).
    - `npm run lint`
    - `npm run typecheck`
    - `npm test`
    - `npm run build`
- **Deployment**:
  - Deploy to **Vercel** (preferred) or **Netlify**.
  - Expose **public URL** in README.

### 5.4 Reports & Artifacts

- **Lighthouse report** (one page) with explanation of optimizations + tradeoffs.
- **Accessibility audit** (axe or Lighthouse) – at least basic notes in README.
- **Postman collection or OpenAPI spec** for configuration API.
- **Demo video (5–7 min)**:
  - Record flow: catalog → product → configurator → AR → save/share → admin preview.

---

## 6. File/Folder Structure (Proposed)

High-level suggestion (Next.js 13+ App Router):

- `app/`
  - `layout.tsx` – shell, theme, i18n providers.
  - `page.tsx` – catalog.
  - `products/`
    - `[slug]/page.tsx` – product detail + configurator entry.
  - `share/[id]/page.tsx` – load config and show product.
  - `admin/preview/page.tsx` – admin theme/flags panel.
  - `(i18n)/[locale]/...` – optional locale segment.
- `components/`
  - `ui/` – design system (buttons, inputs, card, modal…).
  - `catalog/` – product card, filters, pagination.
  - `configurator/` – 3D viewer, controls, AR button.
  - `layout/` – header, footer, shell components.
- `lib/`
  - `products.ts` – mock data fetchers.
  - `configurations.ts` – config API helper.
  - `i18n.ts` – translation helpers.
  - `pwa.ts` – PWA helpers (if needed).
- `store/`
  - `configuratorStore.ts` – Zustand store.
  - `uiStore.ts` – theme, feature flags.
- `public/`
  - `models/` – glTF/GLB models.
  - `images/` – product images.
  - `manifest.json`
- `pages/api/` or `app/api/`
  - `configurations/route.ts` – save/load endpoints.
- `.github/workflows/`
  - `ci.yml` – CI pipeline.
- `tests/`
  - `unit/`
  - `e2e/` (Playwright).
- `.storybook/` – Storybook config.

---

## 7. Step-by-Step Implementation Plan

This section is written as **clear steps** that an AI IDE can execute sequentially.

### Phase 0 – Bootstrap & Tooling

1. **Initialize Next.js project** with TypeScript and Tailwind:
   - Use `create-next-app` with App Router.
   - Configure Tailwind, PostCSS, Prettier.
2. **Set up ESLint & Prettier**:
   - Add Next + TypeScript + React hooks rules.
   - Ensure `npm run lint` and `npm run format` commands.
3. **Enable TypeScript strictness**:
   - Tweak `tsconfig.json` (`strict` true where feasible).
4. **Install core deps**:
   - `zustand`, `@google/model-viewer` (or `three` stack), `next-pwa` (or workbox), testing libs (`jest`, `@testing-library/react`, `playwright`), `storybook`.

### Phase 1 – Design System & Layout

5. **Create layout shell**:
   - `app/layout.tsx` with `<html>`, `<body>`, theme classes, and providers.
   - Header + footer components with basic navigation.
6. **Implement design system components**:
   - `Button`, `Input`, `Select`, `Card`, `Modal`, `Toggle`, etc.
   - Use Tailwind and ensure proper focus states + ARIA.
7. **Set up i18n context and loading**:
   - Add `locales/en/common.json` and `locales/hi/common.json`.
   - Implement simple translation hook and apply to header/footer.

### Phase 2 – Catalog & Product Detail (SSR + SEO)

8. **Create mock product dataset**:
   - JSON in `lib/products.ts` or `data/products.json`.
9. **Implement SSR catalog page**:
   - `app/page.tsx` (or `app/products/page.tsx`) with server-side data fetch.
   - Pagination + filters (category + price/tag) in URL query.
10. **Implement product detail page**:
    - `app/products/[slug]/page.tsx`:
      - Server-side fetch of a product by slug.
      - Metadata (`generateMetadata`) for SEO + OG tags.
      - Hero image + details + “Open Configurator” section (client entry point).

### Phase 3 – State Management & Configurator Basics

11. **Create Zustand stores**:
    - `configuratorStore` for:
      - selected materials/colors, toggled components, lighting, camera.
      - optional undo/redo stack (bonus).
    - `uiStore` for theme + feature flags.
12. **Build configurator UI (without 3D yet)**:
    - Controls panel with:
      - Color swatches.
      - Component toggles.
      - Lighting presets.
      - Save / Reset buttons.
    - Ensure full keyboard support + ARIA.

### Phase 4 – 3D Viewer & AR Integration

13. **Integrate `model-viewer` (3D)**:
    - Add dynamic client-side only component:
      - e.g., `ConfiguratorViewer` using `next/dynamic({ ssr: false })`.
    - Load model from `public/models/...`.
    - Bind configurator state to model attributes (color/material, visibility, lighting).
14. **Add camera and interaction constraints**:
    - Configure `camera-controls`, `min-camera-orbit`, `max-camera-orbit`, `min/max-field-of-view`.
15. **Implement AR preview button**:
    - Within `model-viewer`, enable AR modes.
    - For unsupported devices:
      - Detect capability and show fallback UI with 2D preview + message.
    - Keep AR-specific imports deferred/dynamic.

### Phase 5 – Save/Share API & Offline Support

16. **Create configuration API routes**:
    - `POST /api/configurations`: receive config JSON, return `id`.
    - `GET /api/configurations/[id]`: return stored config.
    - Use in-memory or simple JSON store for persistence (document limitation).
17. **Wire frontend save/share flow**:
    - “Save configuration” button:
      - Sends current config to API.
      - Shows success toast + share link (`/share/[id]`).
18. **Implement `/share/[id]` page**:
    - Loads configuration via API.
    - Reconstructs configurator state and displays read-only or editable view.
19. **Add PWA manifest & service worker**:
    - `public/manifest.json` + icons.
    - Configure `next-pwa` or Workbox to:
      - Cache catalog shell + last-viewed product.
      - Provide offline fallback route/page.

### Phase 6 – Admin Preview & Collaboration Hint

20. **Admin preview page**:
    - `/admin/preview`:
      - Controls to toggle theme and feature flags (mapped to `uiStore`).
      - Persist to localStorage.
21. **Presence indicator (optional)**:
    - Create `PresenceContext` or Zustand slice.
    - Implement a mock WebSocket client (interval-based simulator).
    - Show indicator in product/configurator header when enabled.

### Phase 7 – Testing, Storybook, CI, & Perf

22. **Set up Storybook**:
    - Configure in `.storybook`.
    - Add stories for design system + configurator controls.
23. **Add unit tests (Jest + RTL)**:
    - Catalog filters.
    - Configurator controls.
    - Save configuration logic.
24. **Set up Playwright E2E**:
    - Implement scenario: catalog → product → configurator → change color → save.
25. **Configure GitHub Actions CI**:
    - Workflow to run lint, typecheck, test, build.
26. **Deploy to Vercel**:
    - Hook GitHub repo.
    - Ensure env variables (if any) are set.
27. **Run Lighthouse & Accessibility audits**:
    - Capture report and summarize findings/tradeoffs in README.

### Phase 8 – Documentation & Final Deliverables

28. **Write README**:
    - Setup & run instructions.
    - Architecture overview (reference this plan).
    - Performance optimizations.
    - Known limitations & next steps.
29. **Prepare API spec**:
    - Postman collection or simple OpenAPI/markdown spec for configuration API.
30. **Record demo video (5–7 minutes)**:
    - Show full flow end-to-end and link it in README.
31. **Export and store**:
    - Storybook link/snapshot.
    - Playwright test results summary.
    - Lighthouse report.

---

## 8. Nice-to-Have / Bonus Features (Optional)

If time permits, implement:

- **Undo / redo**:
  - Add history stack to `configuratorStore` with `undo()` and `redo()` actions.
- **URL-encoded configuration**:
  - Serialize configuration to a URL-safe string and decode on load.
- **Advanced animations (Framer Motion)**:
  - Smooth transitions for modals, configurator panel, hover states.
- **Visual regression tests**:
  - Playwright snapshot testing or Percy integration.
- **Detailed accessibility audit**:
  - Run axe, document issues + fixes in a short report.
- **Multi-tenant theming**:
  - Per-user theme presets, saved to localStorage or config.

---

## 9. Notes for AI IDEs / Agents

- **Do not** significantly change high-level architecture without updating this file.
- Prefer:
  - Small, focused PRs/commits.
  - Keeping 3D + AR code behind dynamic imports.
  - Maintaining type safety and accessibility.
- Update this `PROJECT_PLAN.md` whenever major decisions or deviations are made.

