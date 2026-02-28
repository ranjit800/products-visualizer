/**
 * File-based configuration store.
 * Persists to data/configurations.json so configs survive server restarts.
 */

import * as fs from "fs";
import * as path from "path";

export type SavedConfiguration = {
    id: string;
    productSlug: string;
    materials: Record<string, string>;
    components: Record<string, boolean>;
    lightingPreset: string;
    exposure?: number;
    camera: { azimuth: number; elevation: number; distance: number };
    createdAt: string;
    name?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "configurations.json");

function readStore(): Map<string, SavedConfiguration> {
    try {
        if (!fs.existsSync(DATA_FILE)) return new Map();
        const raw = fs.readFileSync(DATA_FILE, "utf-8");
        const obj = JSON.parse(raw) as Record<string, SavedConfiguration>;
        return new Map(Object.entries(obj));
    } catch {
        return new Map();
    }
}

function writeStore(store: Map<string, SavedConfiguration>): void {
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        const obj = Object.fromEntries(store);
        fs.writeFileSync(DATA_FILE, JSON.stringify(obj, null, 2), "utf-8");
    } catch {
        // non-fatal; log silently
    }
}

export const configStore = {
    get(id: string): SavedConfiguration | undefined {
        return readStore().get(id);
    },
    set(id: string, config: SavedConfiguration): void {
        const store = readStore();
        store.set(id, config);
        writeStore(store);
    },
    values(): IterableIterator<SavedConfiguration> {
        return readStore().values();
    },
};

export function generateId(): string {
    return Math.random().toString(36).slice(2, 9) + Date.now().toString(36);
}
