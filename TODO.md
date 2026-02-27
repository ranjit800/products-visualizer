# Visualizer â€” TODO (small steps)

This file breaks the assignment into small, reviewable tasks.  
Rule: finish a small section â†’ run lint/build/tests (as applicable) â†’ commit.

---

## 0) Project structure (scaffolding only)

- [x] Add `components/ui/Button.tsx`
- [x] Add `lib/cn.ts`
- [x] Add layout components + wire into `app/layout.tsx`
  - [x] `components/layout/Header.tsx`
  - [x] `components/layout/Footer.tsx`
  - [x] Update `app/layout.tsx` to render Header/Footer + proper `<body>` classes
- [x] Create placeholder folders (no features yet)
  - [x] `components/catalog/`
  - [x] `components/configurator/`
  - [x] `components/layout/` (done)
  - [x] `lib/` (started)
  - [x] `store/`
  - [x] `locales/en/` + `locales/hi/`
  - [x] `tests/unit/`
  - [x] `tests/e2e/`
  - [x] `.github/workflows/`
  - [x] `.storybook/`
- [x] Create placeholder routes (simple pages, no real logic yet)
  - [x] `app/products/page.tsx`
  - [x] `app/products/[slug]/page.tsx`
  - [x] `app/share/[id]/page.tsx`
  - [x] `app/admin/preview/page.tsx`
- [x] Commit: "chore: scaffold project structure"

---

## 1) Tooling & quality gates

- [x] Add Prettier config + scripts (`format`, `format:check`)
- [x] Add `typecheck` script (`tsc --noEmit`)
- [x] Ensure ESLint + TS strict stays green
- [x] Commit: "chore: add formatting/typecheck scripts"

---

## 1a) Design system components

- [x] `components/ui/Input.tsx`
- [x] `components/ui/Select.tsx`
- [x] `components/ui/Card.tsx`
- [x] `components/ui/Modal.tsx`
- [x] `components/ui/Toggle.tsx`
- [x] `components/ui/Badge.tsx`
- [x] `components/ui/Slider.tsx`
- [x] Export all from `components/ui/index.ts`
- [x] Ensure all have proper focus states + ARIA labels
- [x] Commit: "feat: design system UI components"

---

## 2) i18n (2 locales)

- [x] Decide locale strategy (cookie-based with `I18nProvider`)
- [x] Add translation files
  - [x] `locales/en/common.json`
  - [x] `locales/hi/common.json`
- [x] Add i18n helper (`lib/i18n.ts`) + provider/hook
- [x] Translate header/footer + core buttons/labels
- [x] Translate product titles (at least the displayed names)
- [x] Commit: "feat: add basic i18n (en/hi)"

---

## 3) Catalog (SSR/SSG) + SEO

- [x] Add product dataset + types
  - [x] `lib/products.ts` (typed mock fetchers)
  - [x] `public/images/products/*` (SVG thumbnails for all 9 products)
- [x] Build SSR catalog page
  - [x] Pagination (`?page=`)
  - [x] Filters (at least 2): category + price range + tag
  - [x] Use `next/image` for thumbnails
  - [x] Accessible filter controls (labels, keyboard)
- [x] Add product card component + filter components (atomic)
- [x] Add `generateMetadata` + OpenGraph tags to catalog page
- [x] Home page redirects to `/products`
- [x] Commit: "feat: SSR catalog with filters and pagination"

---

## 4) Product detail (SSR) + metadata

- [ ] `app/products/[slug]/page.tsx` SSR product details
- [ ] `generateMetadata` with title/description/og:image
- [ ] Render meaningful HTML (hero image, headings, description, price, tags)
- [ ] Commit: â€œfeat: product detail SSR + metadataâ€

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
- [ ] Commit: â€œfeat: add configurator/ui storesâ€

---

## 6) 3D Configurator (dynamic import)

- [ ] Pick renderer (recommended: `@google/model-viewer`)
- [ ] Add `components/configurator/Configurator.tsx` (client, dynamically imported)
- [ ] Bind store â†’ model (color/material toggles)
- [ ] Lighting presets + camera constraints
- [ ] Commit: â€œfeat: 3D configurator (lazy-loaded)â€

---

## 6a) Admin preview panel

- [ ] Implement `/admin/preview` page (client-side only)
- [ ] Theme switcher: `light` / `dark` / `high-contrast` â†’ stored in `uiStore` + `localStorage`
- [ ] Feature flag toggles: `enableAR`, `enablePresence`, `enableAdvancedLighting`
- [ ] State propagates via `uiStore` to app shell
- [ ] Commit: "feat: admin preview panel (theme + feature flags)"

---

## 7) AR preview (deferred) + fallback

- [ ] AR button/flow inside configurator
- [ ] Supported: WebXR / Scene Viewer / Quick Look (model-viewer modes)
- [ ] Unsupported: show 2D fallback + message
- [ ] Commit: â€œfeat: AR preview with fallbackâ€

---

## 8) Save / share configuration (JSON API stub)

- [ ] API routes
  - [ ] `POST /api/configurations` â†’ `{ id }`
  - [ ] `GET /api/configurations/[id]` â†’ config JSON
- [ ] Save UI (button + success toast + share link)
- [ ] Share page `app/share/[id]/page.tsx` loads and applies config
- [ ] Commit: â€œfeat: save/share configurationsâ€

---

## 9) Offline / PWA

- [ ] Add manifest + icons
- [ ] Add service worker (next-pwa or Workbox)
- [ ] Cache catalog shell + last-viewed product
- [ ] Offline banner + graceful error states
- [ ] Commit: â€œfeat: PWA offline supportâ€

---

## 10) Tests + Storybook

- [ ] Jest + RTL
  - [ ] unit tests for catalog filters
  - [ ] unit tests for configurator controls
- [ ] Playwright e2e (1 scenario):
  - [ ] catalog â†’ product â†’ open configurator â†’ change color â†’ save
- [ ] Storybook
  - [ ] Button/Input/Card/Modal stories
  - [ ] configurator control stories
- [ ] Commit: â€œtest: add unit/e2e tests and storybookâ€

---

## 11) Accessibility audit

- [ ] Verify keyboard navigation on all configurator controls
- [ ] Check all interactive elements have `aria-label` / `aria-pressed`
- [ ] Run color contrast check (Tailwind tokens: `slate-900`/`slate-50` etc.)
- [ ] Test modals with `role="dialog"` + `aria-modal`
- [ ] Fix any issues found
- [ ] Commit: "a11y: keyboard nav + ARIA audit fixes"

---

## 12) Performance & bundle audit

- [ ] Verify initial JS bundle â‰¤ 250 KB gzipped (analyze with `next build` output)
- [ ] Run Lighthouse â€” target score â‰¥ 85
- [ ] Verify lazy loading: images (`next/image`), 3D/AR (dynamic import)
- [ ] Document tradeoffs in README if score < 85
- [ ] Commit: "perf: bundle audit + lazy loading verified"

---

## 13) CI + deployment + docs

- [ ] GitHub Actions CI: lint + typecheck + test + build
- [ ] Deploy to Vercel
- [ ] README updates: architecture + performance + tradeoffs + limitations
- [ ] API spec (Postman/OpenAPI/markdown)
- [ ] Lighthouse report (saved as artifact)
- [ ] Demo video (5â€“7 min)


