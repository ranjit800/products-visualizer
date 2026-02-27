# 🧪 Manual Test Guide — Visualizer

Run `npm run dev` then open **http://localhost:3000**

---

## 1 — Home Redirect
| # | Steps | Expected |
|---|---|---|
| 1.1 | Open `http://localhost:3000` | Redirected to `/products` |

---

## 2 — Catalog (SSR + Filters)
| # | Steps | Expected |
|---|---|---|
| 2.1 | Visit `/products` | Grid of product cards with images, titles, prices, tags |
| 2.2 | Select **Category → Chair**, click **Apply** | Only chair products show; URL has `?category=Chair` |
| 2.3 | Select **Tag → ergonomic** (or any), click **Apply** | Filtered results update |
| 2.4 | Enter **Min price: 100**, **Max price: 500**, click **Apply** | Only matching price range shows |
| 2.5 | Click **Reset** | All products shown again |
| 2.6 | If > 6 products — click **Next** | Pagination works, URL has `?page=2` |
| 2.7 | Right-click → View Source or check `<title>` | Contains "Products \| Visualizer" |

---

## 3 — Product Detail
| # | Steps | Expected |
|---|---|---|
| 3.1 | Click any product card | Opens `/products/[slug]` |
| 3.2 | Check header | Breadcrumb: `Products / Product Name` |
| 3.3 | Check page | Hero image, category label, title (H1), price, description, tags (badges) |
| 3.4 | Scroll down | Configurator section visible with "Open 3D Configurator" button |
| 3.5 | Click **← Back to catalog** | Returns to `/products` |
| 3.6 | View page source / DevTools → `<title>` | Per-product title e.g. "Aurora Chair \| Visualizer" |
| 3.7 | Check `og:title` meta tag | Per-product OG title present |

---

## 4 — 3D Configurator
| # | Steps | Expected |
|---|---|---|
| 4.1 | On product detail, click **Open 3D Configurator** | Panel expands with viewer + controls sidebar |
| 4.2 | Click any **color swatch** (e.g. Orange) | Color box in viewer updates to that color |
| 4.3 | Toggle **Cushion** switch ON | Toggle state changes (visible) |
| 4.4 | Toggle **Armrest** switch OFF | Toggle state changes |
| 4.5 | Click **Daylight** lighting preset | Lighting button highlights Daylight |
| 4.6 | Move **Rotation** slider | Value updates in real time |
| 4.7 | Move **Elevation** and **Zoom** sliders | Values update |
| 4.8 | Click a swatch, then click **↩ Undo** | Color reverts to previous |
| 4.9 | Click **↪ Redo** | Color reapplied |
| 4.10 | Click **↺ Reset to defaults** | All controls reset |
| 4.11 | Click **✕** (close button) | Configurator collapses back to "Open" button |

---

## 5 — Save & Share
| # | Steps | Expected |
|---|---|---|
| 5.1 | Open configurator, pick a color, click **Save Configuration** | Button shows "Saving…" briefly |
| 5.2 | After save | Green toast appears: "Saved! Link copied: /share/…" |
| 5.3 | Open a new tab, paste the share URL | `/share/[id]` page loads with saved config details |
| 5.4 | Share page shows | Product thumbnail, color swatch (correct hex), lighting preset, accessories, camera values |
| 5.5 | Click **Open & Edit** | Returns to product detail configurator |
| 5.6 | Visit `/share/invalid-id` | 404 / "Not Found" page |

---

## 6 — Admin Preview Panel
| # | Steps | Expected |
|---|---|---|
| 6.1 | Visit `/admin/preview` | Page loads with "Admin Only" badge |
| 6.2 | Click **Dark** theme card | Page switches to dark mode immediately |
| 6.3 | Click **High Contrast** | Dark + high-contrast mode applied |
| 6.4 | Click **Light** | Returns to light mode |
| 6.5 | After each theme change | Toast notification appears bottom-right then fades |
| 6.6 | Toggle **AR Preview** OFF | Badge changes to "OFF" |
| 6.7 | Toggle **Live Presence Indicator** ON | Badge changes to "ON" |
| 6.8 | Refresh the page | Sliders/toggles still at last saved state (localStorage persists) |
| 6.9 | Check **Current State** JSON block | Shows exact theme + flags object |

---

## 7 — AR Preview
| # | Steps | Expected |
|---|---|---|
| 7.1 | Enable **AR Preview** flag in `/admin/preview` | |
| 7.2 | Open configurator on a product | AR section visible below viewer |
| 7.3 | On **desktop** | "AR not supported" fallback section shown with 2D product image |
| 7.4 | On **iOS Safari** (or DevTools mobile UA) | `<a rel="ar">` link appears: "View in AR (Quick Look)" |
| 7.5 | On **Android Chrome** | "AR available — tap the AR button" badge shows |
| 7.6 | Disable **AR Preview** flag in admin | AR section gone from configurator |

---

## 8 — i18n (English / Hindi)
| # | Steps | Expected |
|---|---|---|
| 8.1 | Find the language switcher in the Header | Shows EN / HI options |
| 8.2 | Click **HI** | Header/footer labels switch to Hindi |
| 8.3 | Check product cards | Product titles display in Hindi |
| 8.4 | Refresh the page | Hindi persists (stored in cookie + localStorage) |
| 8.5 | Switch back to **EN** | Returns to English |

---

## 9 — Design System Components
| # | Steps | Expected |
|---|---|---|
| 9.1 | Visit `/design-system` | Demo page with all UI components |
| 9.2 | Test **Input** — type text | Input receives focus, shows value |
| 9.3 | Test **Select** — choose option | Option selected |
| 9.4 | Test **Toggle** — click | Switches state with animation |
| 9.5 | Test **Slider** — drag | Live value updates |
| 9.6 | Test **Modal** — open/close via button | Opens over backdrop; Esc key closes it |
| 9.7 | Test **Badges** | 5 color variants visible |
| 9.8 | Tab through all components | All interactive elements have visible focus ring |

---

## 10 — PWA
| # | Steps | Expected |
|---|---|---|
| 10.1 | Open DevTools → **Application → Manifest** | Manifest loaded: name "Visualizer", icons listed |
| 10.2 | DevTools → **Application → Service Workers** | SW registered, status: activated |
| 10.3 | DevTools → **Application → Cache Storage** | `visualizer-v1` cache with precached URLs |
| 10.4 | DevTools → Network → check **Offline** → refresh | `/products` loads from cache (or `/offline` page) |
| 10.5 | On mobile Chrome → menu → **Add to Home Screen** | App installs with Visualizer icon |
| 10.6 | Check `<html lang>` | Matches selected locale (en or hi) |

---

## 11 — Accessibility (quick check)
| # | Steps | Expected |
|---|---|---|
| 11.1 | Tab through catalog page | All cards, buttons, filter inputs focusable in order |
| 11.2 | Tab through configurator | Color swatches, toggles, sliders, buttons all focusable |
| 11.3 | Open Modal → press **Esc** | Modal closes |
| 11.4 | Check color swatch buttons | `role="option"`, `aria-selected`, `aria-label` present |
| 11.5 | Check filter `<select>` | Has `<label>` associated via `htmlFor` |
| 11.6 | Toast notifications | `aria-live="polite"` present (screen reader friendly) |

---

## 12 — Dark Mode (system level)
| # | Steps | Expected |
|---|---|---|
| 12.1 | Set OS to dark mode OR go to `/admin/preview` → Dark | Entire site goes dark |
| 12.2 | Check product cards, configurator, admin page | All dark backgrounds with light text |
| 12.3 | Toggle back to Light | White background restored |

---

## Known Limitations
- **3D model**: No `.glb` files provided → configurator shows a colored preview box instead. Color changes still fully functional.
- **Save/Share store**: In-memory only — configs reset on server restart. Documented limitation.
- **AR**: Only functional on physical mobile devices with WebXR/QuickLook support.
