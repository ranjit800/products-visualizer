# Visualizer — TODO (small steps)

This file breaks the assignment into small, reviewable tasks.  
Rule: finish a small section → run lint/build/tests (as applicable) → commit.

---

## 0) Project structure (scaffolding only)

- [x] Add `components/ui/Button.tsx`
- [x] Add `lib/cn.ts`
- [ ] Add layout components + wire into `app/layout.tsx`
  - [x] `components/layout/Header.tsx`
  - [x] `components/layout/Footer.tsx`
  - [ ] Update `app/layout.tsx` to render Header/Footer + proper `<body>` classes
- [ ] Create placeholder folders (no features yet)
  - [ ] `components/catalog/`
  - [ ] `components/configurator/`
  - [ ] `components/layout/` (done)
  - [ ] `lib/` (started)
  - [ ] `store/`
  - [ ] `locales/en/` + `locales/hi/`
  - [ ] `tests/unit/`
  - [ ] `tests/e2e/`
  - [ ] `.github/workflows/`
  - [ ] `.storybook/`
- [ ] Create placeholder routes (simple pages, no real logic yet)
  - [ ] `app/products/page.tsx`
  - [ ] `app/products/[slug]/page.tsx`
  - [ ] `app/share/[id]/page.tsx`
  - [ ] `app/admin/preview/page.tsx`
- [ ] Commit: “chore: scaffold project structure”

---

## 1) Tooling & quality gates

- [ ] Add Prettier config + scripts (`format`, `format:check`)
- [ ] Add `typecheck` script (`tsc --noEmit`)
- [ ] Ensure ESLint + TS strict stays green
- [ ] Commit: “chore: add formatting/typecheck scripts”

---

## 2) i18n (2 locales)

- [ ] Decide locale strategy (route segment preferred: `/en/...`, `/hi/...`)
- [ ] Add translation files
  - [ ] `locales/en/common.json`
  - [ ] `locales/hi/common.json`
- [ ] Add i18n helper (`lib/i18n.ts`) + provider/hook
- [ ] Translate header/footer + core buttons/labels
- [ ] Translate product titles (at least the displayed names)
- [ ] Commit: “feat: add basic i18n (en/hi)”

---

## 3) Catalog (SSR/SSG) + SEO

- [ ] Add product dataset + types
  - [ ] `lib/products.ts` (typed mock fetchers)
  - [ ] `public/images/products/*` (later)
- [ ] Build SSR catalog page
  - [ ] Pagination (`?page=`)
  - [ ] Filters (at least 2): category + price range OR tag
  - [ ] Use `next/image` for thumbnails
  - [ ] Accessible filter controls (labels, keyboard)
- [ ] Add product card component + filter components (atomic)
- [ ] Commit: “feat: SSR catalog with filters and pagination”

---

## 4) Product detail (SSR) + metadata

- [ ] `app/products/[slug]/page.tsx` SSR product details
- [ ] `generateMetadata` with title/description/og:image
- [ ] Render meaningful HTML (hero image, headings, description, price, tags)
- [ ] Commit: “feat: product detail SSR + metadata”

---

## 5) Configurator state (Zustand)

- [ ] Add Zustand
- [ ] `store/configuratorStore.ts`
  - [ ] selected product
  - [ ] materials/colors
  - [ ] toggled components
  - [ ] lighting preset
  - [ ] camera state
  - [ ] (bonus) undo/redo history
- [ ] `store/uiStore.ts` (theme + feature flags)
- [ ] Commit: “feat: add configurator/ui stores”

---

## 6) 3D Configurator (dynamic import)

- [ ] Pick renderer (recommended: `@google/model-viewer`)
- [ ] Add `components/configurator/Configurator.tsx` (client, dynamically imported)
- [ ] Bind store → model (color/material toggles)
- [ ] Lighting presets + camera constraints
- [ ] Commit: “feat: 3D configurator (lazy-loaded)”

---

## 7) AR preview (deferred) + fallback

- [ ] AR button/flow inside configurator
- [ ] Supported: WebXR / Scene Viewer / Quick Look (model-viewer modes)
- [ ] Unsupported: show 2D fallback + message
- [ ] Commit: “feat: AR preview with fallback”

---

## 8) Save / share configuration (JSON API stub)

- [ ] API routes
  - [ ] `POST /api/configurations` → `{ id }`
  - [ ] `GET /api/configurations/[id]` → config JSON
- [ ] Save UI (button + success toast + share link)
- [ ] Share page `app/share/[id]/page.tsx` loads and applies config
- [ ] Commit: “feat: save/share configurations”

---

## 9) Offline / PWA

- [ ] Add manifest + icons
- [ ] Add service worker (next-pwa or Workbox)
- [ ] Cache catalog shell + last-viewed product
- [ ] Offline banner + graceful error states
- [ ] Commit: “feat: PWA offline support”

---

## 10) Tests + Storybook

- [ ] Jest + RTL
  - [ ] unit tests for catalog filters
  - [ ] unit tests for configurator controls
- [ ] Playwright e2e (1 scenario):
  - [ ] catalog → product → open configurator → change color → save
- [ ] Storybook
  - [ ] Button/Input/Card/Modal stories
  - [ ] configurator control stories
- [ ] Commit: “test: add unit/e2e tests and storybook”

---

## 11) CI + deployment + docs

- [ ] GitHub Actions CI: lint + typecheck + test + build
- [ ] Deploy to Vercel
- [ ] README updates: architecture + performance + tradeoffs + limitations
- [ ] API spec (Postman/OpenAPI/markdown)
- [ ] Lighthouse report
- [ ] Demo video (5–7 min)

