import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;

  try {
    const member = await prisma.teamMember.findUnique({ where: { userId: user!.id } });
    if (!member) return NextResponse.json({ error: "You are not in a team" }, { status: 404 });

    const teamId = member.teamId;
    const matchup = await prisma.matchup.findFirst({
      where: {
        isActive: true,
        OR: [{ redTeamId: teamId }, { blueTeamId: teamId }],
      },
      include: {
        redTeam: { select: { id: true, name: true, score: true, role: true } },
        blueTeam: { select: { id: true, name: true, score: true, role: true } },
      },
    });

    if (!matchup) return NextResponse.json({ error: "No active matchup found for your team" }, { status: 404 });

    const isRed = matchup.redTeamId === teamId;
    const myTeam = isRed ? matchup.redTeam : matchup.blueTeam;
    const opponent = isRed ? matchup.blueTeam : matchup.redTeam;

    return NextResponse.json({
      matchupId: matchup.id,
      roundLabel: matchup.roundLabel ?? null,
      targetUrl: matchup.targetUrl ?? null,
      repoUrl: matchup.repoUrl ?? null,
      myRole: isRed ? "RED" : "BLUE",
      myTeam,
      opponent: opponent
        ? { id: opponent.id, name: opponent.name, score: opponent.score, role: opponent.role }
        : null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
