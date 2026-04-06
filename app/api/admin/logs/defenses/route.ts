import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const teamId = searchParams.get("teamId") ?? undefined;

    const logs = await prisma.defenseLog.findMany({
      where: teamId ? { teamId } : undefined,
      include: { team: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(logs);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
