import { NextRequest, NextResponse } from "next/server";

const RENDER_API = process.env.RENDER_API_URL ?? "http://localhost:4000";

/* ── POST /api/configurations — proxy to Render backend ── */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const res = await fetch(`${RENDER_API}/api/configurations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: "Failed to reach API server" }, { status: 502 });
    }
}

/* ── GET /api/configurations — proxy to Render backend ── */
export async function GET() {
    try {
        const res = await fetch(`${RENDER_API}/api/configurations`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch {
        return NextResponse.json({ error: "Failed to reach API server" }, { status: 502 });
    }
}
