import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { id } = params;
    await prisma.matchup.deleteMany({ where: { OR: [{ redTeamId: id }, { blueTeamId: id }] } });
    await prisma.teamMember.deleteMany({ where: { teamId: id } });
    await prisma.attackLog.deleteMany({ where: { OR: [{ attackerId: id }, { targetTeamId: id }] } });
    await prisma.defenseLog.deleteMany({ where: { teamId: id } });
    await prisma.scoreHistory.deleteMany({ where: { teamId: id } });
    await prisma.team.delete({ where: { id } });
    return NextResponse.json({ message: "Team deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
