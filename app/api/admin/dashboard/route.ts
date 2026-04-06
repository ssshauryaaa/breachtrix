import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { user, error } = requireAdmin(req);
  if (error) return error;

  try {
    const [userCount, teamCount, attackCount, defenseCount, teams] = await Promise.all([
      prisma.user.count(),
      prisma.team.count(),
      prisma.attackLog.count(),
      prisma.defenseLog.count(),
      prisma.team.findMany({
        select: { id: true, name: true, role: true, score: true, _count: { select: { members: true } } },
        orderBy: { score: "desc" },
      }),
    ]);

    return NextResponse.json({ stats: { userCount, teamCount, attackCount, defenseCount }, leaderboard: teams });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
