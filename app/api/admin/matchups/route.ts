import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const active = searchParams.get("active");

    const where =
      active === "true" ? { isActive: true } : active === "false" ? { isActive: false } : undefined;

    const matchups = await prisma.matchup.findMany({
      where,
      include: {
        redTeam: { select: { id: true, name: true, score: true, role: true } },
        blueTeam: { select: { id: true, name: true, score: true, role: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(matchups);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { redTeamId, blueTeamId, targetUrl, repoUrl, roundLabel } = await req.json();

    if (!redTeamId || !blueTeamId)
      return NextResponse.json({ error: "redTeamId and blueTeamId are required" }, { status: 400 });
    if (redTeamId === blueTeamId)
      return NextResponse.json({ error: "A team cannot be matched against itself" }, { status: 400 });

    const [red, blue] = await Promise.all([
      prisma.team.findUnique({ where: { id: redTeamId } }),
      prisma.team.findUnique({ where: { id: blueTeamId } }),
    ]);

    if (!red) return NextResponse.json({ error: "Red team not found" }, { status: 404 });
    if (!blue) return NextResponse.json({ error: "Blue team not found" }, { status: 404 });
    if (red.role !== "RED") return NextResponse.json({ error: `Team "${red.name}" is not a RED team` }, { status: 400 });
    if (blue.role !== "BLUE") return NextResponse.json({ error: `Team "${blue.name}" is not a BLUE team` }, { status: 400 });

    const conflict = await prisma.matchup.findFirst({
      where: {
        isActive: true,
        OR: [{ redTeamId }, { blueTeamId }, { redTeamId: blueTeamId }, { blueTeamId: redTeamId }],
      },
    });
    if (conflict)
      return NextResponse.json(
        { error: "One or both teams are already in an active matchup. Deactivate it first.", existingMatchupId: conflict.id },
        { status: 409 }
      );

    const matchup = await prisma.matchup.create({
      data: {
        redTeamId, blueTeamId,
        targetUrl: targetUrl?.trim() ?? null,
        repoUrl: repoUrl?.trim() ?? null,
        roundLabel: roundLabel?.trim() ?? null,
        isActive: true,
      },
      include: {
        redTeam: { select: { id: true, name: true, score: true } },
        blueTeam: { select: { id: true, name: true, score: true } },
      },
    });

    return NextResponse.json({ message: "Matchup created", matchup }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
