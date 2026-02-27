/**
 * Shared in-memory configuration store.
 * Uses a Node.js module-level Map so all API routes in the same process share the same instance.
 * Resets on server restart — documented as known limitation.
 */

export type SavedConfiguration = {
    id: string;
    productSlug: string;
    materials: Record<string, string>;
    components: Record<string, boolean>;
    lightingPreset: string;
    camera: { azimuth: number; elevation: number; distance: number };
    createdAt: string;
    name?: string;
};

export const configStore = new Map<string, SavedConfiguration>();

export function generateId(): string {
    return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}
