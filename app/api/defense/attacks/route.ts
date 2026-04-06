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
    const attacks = await prisma.attackLog.findMany({
      where: { targetTeamId: teamId },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(attacks);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
