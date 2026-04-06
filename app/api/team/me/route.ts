import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { user, error } = requireAuth(req);
  if (error) return error;

  try {
    const membership = await prisma.teamMember.findMany({
      where: { userId: user!.id },
      include: { team: true },
    });
    if (membership.length === 0) return NextResponse.json(null);
    return NextResponse.json(membership[0].team);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
