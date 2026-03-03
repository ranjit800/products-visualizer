/**
 * uiStore — manages global UI state.
 * - theme (light / dark / high-contrast)
 * - feature flags (enableAR, enablePresence, enableAdvancedLighting)
 * - toast notifications
 * Persisted to localStorage so settings survive page refresh.
 */

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/* ── Types ── */

export type Theme = "light" | "dark" | "high-contrast";

export type FeatureFlags = {
    enableAR: boolean;
    enablePresence: boolean;
    enableAdvancedLighting: boolean;
};

export type Toast = {
    id: string;
    message: string;
    type: "success" | "error" | "info";
};

export type UIState = {
    theme: Theme;
    flags: FeatureFlags;
    toasts: Toast[];
    isMobileFilterOpen: boolean;
};

export type UIActions = {
    setTheme: (theme: Theme) => void;
    setFlag: (flag: keyof FeatureFlags, value: boolean) => void;
    addToast: (toast: Omit<Toast, "id">) => void;
    removeToast: (id: string) => void;
    setIsMobileFilterOpen: (open: boolean) => void;
};

/* ── Defaults ── */

const DEFAULT_FLAGS: FeatureFlags = {
    enableAR: true,
    enablePresence: false,
    enableAdvancedLighting: true,
};

/* ── Store ── */

export const useUIStore = create<UIState & UIActions>()(
    devtools(
        persist(
            (set) => ({
                /* State */
                theme: "light" as Theme,
                flags: DEFAULT_FLAGS,
                toasts: [],
                isMobileFilterOpen: false,

                /* Actions */
                setTheme(theme) {
                    set({ theme }, false, "setTheme");
                    applyTheme(theme);
                },

                setFlag(flag, value) {
                    set((s) => ({ flags: { ...s.flags, [flag]: value } }), false, "setFlag");
                },

                addToast({ message, type }) {
                    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
                    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }), false, "addToast");
                    // Auto-remove after 4 s
                    setTimeout(() => {
                        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }), false, "removeToast:auto");
                    }, 4000);
                },

                removeToast(id) {
                    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }), false, "removeToast");
                },

                setIsMobileFilterOpen(open) {
                    set({ isMobileFilterOpen: open }, false, "setIsMobileFilterOpen");
                },
            }),
            {
                name: "viz_ui",
                // Only persist theme and flags — not ephemeral toasts
                partialize: (s) => ({ theme: s.theme, flags: s.flags }),
                onRehydrateStorage: () => (state) => {
                    if (state) applyTheme(state.theme);
                },
            },
        ),
        { name: "uiStore" },
    ),
);

/* ── Apply theme to <html> element ── */

function applyTheme(theme: Theme) {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("dark", "high-contrast");
    if (theme === "dark") root.classList.add("dark");
    if (theme === "high-contrast") root.classList.add("dark", "high-contrast");
}
