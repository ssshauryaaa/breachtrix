import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    await prisma.teamMember.deleteMany({ where: { userId: params.id } });
    await prisma.user.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
