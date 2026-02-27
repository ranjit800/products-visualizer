/**
 * configuratorStore — manages the 3D product configurator state.
 * - selected product
 * - materials/colors per part
 * - toggled component accessories
 * - lighting preset
 * - camera state
 * - undo/redo history (bonus)
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

/* ── Types ── */

export type LightingPreset = "studio" | "daylight" | "warm";

export type CameraState = {
    azimuth: number;   // horizontal orbit angle in degrees
    elevation: number; // vertical angle in degrees
    distance: number;  // zoom distance (metres)
};

export type ConfiguratorState = {
    /** Slug of the currently open product (null = no product selected) */
    productSlug: string | null;

    /** Map of partId → color hex or material id */
    materials: Record<string, string>;

    /** Map of componentId → visible/hidden */
    components: Record<string, boolean>;

    /** Active lighting preset */
    lighting: LightingPreset;

    /** Camera orbit/zoom state */
    camera: CameraState;

    /** Undo/redo history stack */
    _past: Array<ConfiguratorSnapshot>;
    _future: Array<ConfiguratorSnapshot>;
};

/** Snapshot of configurable fields only (for undo/redo) */
type ConfiguratorSnapshot = {
    materials: Record<string, string>;
    components: Record<string, boolean>;
    lighting: LightingPreset;
    camera: CameraState;
};

export type ConfiguratorActions = {
    /** Open a product in the configurator */
    openProduct: (slug: string) => void;

    /** Set a material/color for a specific part */
    setMaterial: (partId: string, value: string) => void;

    /** Toggle a component accessory on/off */
    toggleComponent: (componentId: string, visible: boolean) => void;

    /** Change the lighting preset */
    setLighting: (preset: LightingPreset) => void;

    /** Update camera state */
    setCamera: (camera: Partial<CameraState>) => void;

    /** Reset to default configuration */
    reset: () => void;

    /** Undo last change */
    undo: () => void;

    /** Redo last undone change */
    redo: () => void;
};

/* ── Defaults ── */

const DEFAULT_CAMERA: CameraState = {
    azimuth: 0,
    elevation: 15,
    distance: 3,
};

const DEFAULT_STATE: ConfiguratorState = {
    productSlug: null,
    materials: {},
    components: {},
    lighting: "studio",
    camera: DEFAULT_CAMERA,
    _past: [],
    _future: [],
};

/* ── Helpers ── */

function snapshot(state: ConfiguratorState): ConfiguratorSnapshot {
    return {
        materials: { ...state.materials },
        components: { ...state.components },
        lighting: state.lighting,
        camera: { ...state.camera },
    };
}

/* ── Store ── */

export const useConfiguratorStore = create<ConfiguratorState & ConfiguratorActions>()(
    devtools(
        (set, get) => ({
            ...DEFAULT_STATE,

            openProduct(slug) {
                set({ ...DEFAULT_STATE, productSlug: slug }, false, "openProduct");
            },

            setMaterial(partId, value) {
                const past = [...get()._past, snapshot(get())];
                set(
                    (s) => ({
                        materials: { ...s.materials, [partId]: value },
                        _past: past,
                        _future: [],
                    }),
                    false,
                    "setMaterial",
                );
            },

            toggleComponent(componentId, visible) {
                const past = [...get()._past, snapshot(get())];
                set(
                    (s) => ({
                        components: { ...s.components, [componentId]: visible },
                        _past: past,
                        _future: [],
                    }),
                    false,
                    "toggleComponent",
                );
            },

            setLighting(preset) {
                const past = [...get()._past, snapshot(get())];
                set({ lighting: preset, _past: past, _future: [] }, false, "setLighting");
            },

            setCamera(camera) {
                set((s) => ({ camera: { ...s.camera, ...camera } }), false, "setCamera");
            },

            reset() {
                set(
                    {
                        materials: {},
                        components: {},
                        lighting: "studio",
                        camera: DEFAULT_CAMERA,
                        _past: [],
                        _future: [],
                    },
                    false,
                    "reset",
                );
            },

            undo() {
                const { _past, _future } = get();
                if (_past.length === 0) return;
                const prev = _past[_past.length - 1];
                const newPast = _past.slice(0, -1);
                set(
                    (s) => ({
                        ...prev,
                        _past: newPast,
                        _future: [snapshot(s), ..._future],
                    }),
                    false,
                    "undo",
                );
            },

            redo() {
                const { _past, _future } = get();
                if (_future.length === 0) return;
                const next = _future[0];
                const newFuture = _future.slice(1);
                set(
                    (s) => ({
                        ...next,
                        _past: [..._past, snapshot(s)],
                        _future: newFuture,
                    }),
                    false,
                    "redo",
                );
            },
        }),
        { name: "configuratorStore" },
    ),
);
