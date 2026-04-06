import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { teamId: string; userId: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    await prisma.teamMember.delete({ where: { userId: params.userId } });
    return NextResponse.json({ message: "User removed from team" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
