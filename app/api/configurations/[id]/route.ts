import { NextRequest, NextResponse } from "next/server";

const RENDER_API = process.env.RENDER_API_URL ?? "http://localhost:4000";

/* ── GET /api/configurations/[id] — proxy to Render backend ── */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    try {
        const res = await fetch(`${RENDER_API}/api/configurations/${id}`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: "Failed to reach API server" }, { status: 502 });
    }
}

/* ── DELETE /api/configurations/[id] — proxy to Render backend ── */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;
    try {
        const res = await fetch(`${RENDER_API}/api/configurations/${id}`, { method: "DELETE" });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: "Failed to reach API server" }, { status: 502 });
    }
}
