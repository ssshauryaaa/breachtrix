import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const user = await prisma.user.update({
      where: { id: params.id },
      data: { role: "admin" },
      select: { id: true, username: true, role: true },
    });
    return NextResponse.json({ message: "User promoted to admin", user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
