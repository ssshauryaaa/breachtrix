import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { points, reason } = await req.json();
    if (typeof points !== "number" || points <= 0)
      return NextResponse.json({ error: "points must be a positive number (it will be deducted)" }, { status: 400 });
    if (!reason?.trim())
      return NextResponse.json({ error: "reason is required for a penalty" }, { status: 400 });

    const [team, historyEntry] = await prisma.$transaction([
      prisma.team.update({
        where: { id: params.id },
        data: { score: { decrement: points } },
        select: { id: true, name: true, score: true, role: true },
      }),
      prisma.scoreHistory.create({
        data: { teamId: params.id, delta: -points, reason: reason.trim(), type: "PENALTY" },
      }),
    ]);

    return NextResponse.json({ message: `Penalty of -${points} applied to ${team.name}`, team, historyEntry });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
