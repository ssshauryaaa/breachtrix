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
    const { targetTeamId, type } = await req.json();
    if (!type) return NextResponse.json({ error: "Attack type required" }, { status: 400 });

    const attackerId = await getTeamId(user!.id);
    const attack = await prisma.attackLog.create({
      data: { attackerId, targetTeamId, type, success: true },
    });

    return NextResponse.json({ message: "Attack submitted", attack });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
