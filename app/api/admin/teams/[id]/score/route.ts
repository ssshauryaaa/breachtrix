import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { delta } = await req.json();
    if (typeof delta !== "number") return NextResponse.json({ error: "delta must be a number" }, { status: 400 });
    const team = await prisma.team.update({ where: { id: params.id }, data: { score: { increment: delta } } });
    return NextResponse.json({ message: "Score updated", team });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
