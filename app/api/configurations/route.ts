import { NextRequest, NextResponse } from "next/server";
import { configStore, generateId, type SavedConfiguration } from "@/lib/configStore";

/* ── POST /api/configurations — save a configuration ── */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { productSlug, materials, components, lightingPreset, camera, name } = body;

        if (!productSlug || typeof productSlug !== "string") {
            return NextResponse.json({ error: "productSlug is required" }, { status: 400 });
        }

        const id = generateId();
        const config: SavedConfiguration = {
            id,
            productSlug,
            materials: materials ?? {},
            components: components ?? {},
            lightingPreset: lightingPreset ?? "studio",
            camera: camera ?? { azimuth: 0, elevation: 15, distance: 3 },
            createdAt: new Date().toISOString(),
            name: typeof name === "string" ? name : undefined,
        };

        configStore.set(id, config);
        return NextResponse.json({ id }, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }
}

/* ── GET /api/configurations — list all (debug) ── */
export async function GET() {
    return NextResponse.json(Array.from(configStore.values()));
}
