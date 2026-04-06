import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function getTeamId(userId: string) {
  const member = await prisma.teamMember.findUnique({ where: { userId } });
  if (!member) throw new Error("User not in a team");
  return member.teamId;
}

export async function GET(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;

  try {
    const teamId = await getTeamId(user!.id);
    const teams = await prisma.team.findMany({
      where: { id: { not: teamId }, role: "BLUE" },
      select: { id: true, name: true, score: true },
    });
    return NextResponse.json(teams);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
