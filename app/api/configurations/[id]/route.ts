import { NextRequest, NextResponse } from "next/server";
import { configStore } from "@/lib/configStore";

/* ── GET /api/configurations/[id] — load a configuration ── */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    const config = configStore.get(id);

    if (!config) {
        return NextResponse.json({ error: "Configuration not found" }, { status: 404 });
    }

    return NextResponse.json(config);
}
