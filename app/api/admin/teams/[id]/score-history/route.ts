import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const [team, history] = await Promise.all([
      prisma.team.findUnique({
        where: { id: params.id },
        select: { id: true, name: true, role: true, score: true },
      }),
      prisma.scoreHistory.findMany({ where: { teamId: params.id }, orderBy: { createdAt: "asc" } }),
    ]);

    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    let running = 0;
    const timeline = history.map((entry) => {
      running += entry.delta;
      return { ...entry, runningTotal: running };
    });

    return NextResponse.json({ team, timeline });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
