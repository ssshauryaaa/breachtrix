import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;

  try {
    const { team_id } = await req.json();

    const team = await prisma.team.findUnique({
      where: { id: team_id },
      include: { members: true },
    });
    if (!team) return NextResponse.json({ error: "Team not found" }, { status: 404 });

    const existing = await prisma.teamMember.findUnique({ where: { userId: user!.id } });
    if (existing) return NextResponse.json({ error: "User already in a team" }, { status: 400 });

    await prisma.teamMember.create({ data: { userId: user!.id, teamId: team_id } });
    return NextResponse.json({ message: "Joined team" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
