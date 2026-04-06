import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/scores/history
export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId") ?? undefined;

    const history = await prisma.scoreHistory.findMany({
      where: teamId ? { teamId } : undefined,
      include: { team: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: "desc" },
    });

    const grouped = history.reduce((acc: any, entry) => {
      if (!acc[entry.teamId]) acc[entry.teamId] = [];
      acc[entry.teamId].push(entry);
      return acc;
    }, {});

    return NextResponse.json({ history, grouped });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
