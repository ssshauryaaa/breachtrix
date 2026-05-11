// app/api/brackets/reset/route.ts
// POST /api/brackets/reset — resets all bracket state
// Only callable from /brackets/reset (protected by secret token)

import { NextRequest, NextResponse } from "next/server";

const RESET_SECRET = process.env.BRACKET_RESET_SECRET ?? "breachtrix-reset-2026";

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));

    if (body.secret !== RESET_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real app: await db.bracketState.reset() or similar
    // Here we return the fresh state the client should hydrate with
    const freshState = {
        teams: [
            { id: 1, seed: 1, name: "Amity International Sector 46", role: null },
            { id: 2, seed: 8, name: "DPS Sector 45", role: null },
            { id: 3, seed: 5, name: "Indraprastha", role: null },
            { id: 4, seed: 4, name: "Bal Bharti Public School GRH", role: null },
            { id: 5, seed: 3, name: "TIS EOK", role: null },
            { id: 6, seed: 6, name: "Mayoor School", role: null },
            { id: 7, seed: 7, name: "DPS SSL", role: null },
            { id: 8, seed: 2, name: "St George School", role: null },
        ],
        matches: [
            { id: "m1", round: 1, pos: 0, t1: 1, t2: 2, w: null },
            { id: "m2", round: 1, pos: 1, t1: 3, t2: 4, w: null },
            { id: "m3", round: 1, pos: 2, t1: 5, t2: 6, w: null },
            { id: "m4", round: 1, pos: 3, t1: 7, t2: 8, w: null },
            { id: "m5", round: 2, pos: 0, t1: null, t2: null, w: null },
            { id: "m6", round: 2, pos: 1, t1: null, t2: null, w: null },
            { id: "m7", round: 3, pos: 0, t1: null, t2: null, w: null },
        ],
        resetAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, state: freshState });
}