import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

async function getTeamId(userId: string) {
  const member = await prisma.teamMember.findUnique({ where: { userId } });
  if (!member) throw new Error("User not in a team");
  return member.teamId;
}

export async function POST(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;

  try {
    const { type } = await req.json();
    const teamId = await getTeamId(user!.id);
    await prisma.defenseLog.create({ data: { teamId, type, success: true } });
    return NextResponse.json({ message: "Patch deployed successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
