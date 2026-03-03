// ── Shared utilities, types & constants for the configurator ─────────────────

// ── Load model-viewer script once ──────────────────────────────────────────
let scriptLoaded = false;
let scriptPromise: Promise<void> | null = null;

export function loadModelViewer(): Promise<void> {
    if (scriptLoaded) return Promise.resolve();
    if (scriptPromise) return scriptPromise;
    scriptPromise = new Promise((resolve, reject) => {
        if (typeof customElements !== "undefined" && customElements.get("model-viewer")) {
            scriptLoaded = true;
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
        script.crossOrigin = "anonymous";
        script.onload = () => { scriptLoaded = true; resolve(); };
        script.onerror = reject;
        document.head.appendChild(script);
    });
    return scriptPromise;
}

// ── Bottom sheet states ─────────────────────────────────────────────────────
export const SHEET_HEIGHTS = { collapsed: 15, half: 45, full: 85 } as const;
export type SheetState = keyof typeof SHEET_HEIGHTS;

import type { Locale } from "@/lib/i18n";

// ── Shared color palette ────────────────────────────────────────────────────
export const COLORS = [
    { label: { en: "Slate", hi: "स्लेट" }, hex: "#1e293b" },
    { label: { en: "Stone", hi: "स्टोन" }, hex: "#78716c" },
    { label: { en: "White", hi: "सफेद" }, hex: "#f1f5f9" },
    { label: { en: "Orange", hi: "नारंगी" }, hex: "#f97316" },
    { label: { en: "Emerald", hi: "एमराल्ड" }, hex: "#10b981" },
    { label: { en: "Blue", hi: "नीला" }, hex: "#3b82f6" },
    { label: { en: "Rose", hi: "गुलाबी" }, hex: "#f43f5e" },
    { label: { en: "Violet", hi: "बैंगनी" }, hex: "#8b5cf6" },
    { label: { en: "Amber", hi: "एम्बर" }, hex: "#f59e0b" },
    { label: { en: "Cyan", hi: "सियान" }, hex: "#06b6d4" },
];

// ── Shared accessories definition ───────────────────────────────────────────
export const ACCESSORIES_DEF = [
    { id: "cushion", label: { en: "Cushion", hi: "कुशन" }, icon: "🪑" },
    { id: "armrest", label: { en: "Armrest", hi: "आर्मरेस्ट" }, icon: "🦾" },
    { id: "lampshade", label: { en: "Lamp Shade", hi: "लैम्प शेड" }, icon: "💡" },
    { id: "base", label: { en: "Base Plate", hi: "बेस प्लेट" }, icon: "⬛" },
];

// ── Shared lighting presets ─────────────────────────────────────────────────
export const BASE_LIGHTING = [
    { value: "neutral", label: { en: "Studio", hi: "स्टूडियो" }, icon: "💡", exposure: 1.0 },
    { value: "legacy", label: { en: "Day", hi: "दिन" }, icon: "☀️", exposure: 1.4 },
    { value: "neutral", label: { en: "Warm", hi: "गर्म" }, icon: "🕯️", exposure: 0.85 },
];
export const EXTRA_LIGHTING = [
    { value: "neutral", label: { en: "Sunset", hi: "सूर्यास्त" }, icon: "🌅", exposure: 0.7 },
    { value: "neutral", label: { en: "Cool", hi: "कूल" }, icon: "❄️", exposure: 1.6 },
];
