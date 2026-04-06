import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    await prisma.$transaction([
      prisma.scoreHistory.deleteMany(),
      prisma.team.updateMany({ data: { score: 0 } }),
    ]);
    return NextResponse.json({ message: "All scores and score history reset for new round" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
