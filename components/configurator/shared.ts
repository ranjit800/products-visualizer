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

// ── Shared color palette ────────────────────────────────────────────────────
export const COLORS = [
    { label: "Slate", hex: "#1e293b" }, { label: "Stone", hex: "#78716c" },
    { label: "White", hex: "#f1f5f9" }, { label: "Orange", hex: "#f97316" },
    { label: "Emerald", hex: "#10b981" }, { label: "Blue", hex: "#3b82f6" },
    { label: "Rose", hex: "#f43f5e" }, { label: "Violet", hex: "#8b5cf6" },
    { label: "Amber", hex: "#f59e0b" }, { label: "Cyan", hex: "#06b6d4" },
];

// ── Shared accessories definition ───────────────────────────────────────────
export const ACCESSORIES_DEF = [
    { id: "cushion", label: "Cushion", icon: "🪑" },
    { id: "armrest", label: "Armrest", icon: "🦾" },
    { id: "lampshade", label: "Lamp Shade", icon: "💡" },
    { id: "base", label: "Base Plate", icon: "⬛" },
];

// ── Shared lighting presets ─────────────────────────────────────────────────
export const BASE_LIGHTING = [
    { value: "neutral", label: "Studio", icon: "💡", exposure: 1.0 },
    { value: "legacy", label: "Day", icon: "☀️", exposure: 1.4 },
    { value: "neutral", label: "Warm", icon: "🕯️", exposure: 0.85 },
];
export const EXTRA_LIGHTING = [
    { value: "neutral", label: "Sunset", icon: "🌅", exposure: 0.7 },
    { value: "neutral", label: "Cool", icon: "❄️", exposure: 1.6 },
];
