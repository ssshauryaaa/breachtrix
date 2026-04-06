import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

// DELETE /api/admin/logs — clear all logs
export async function DELETE(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    await prisma.attackLog.deleteMany();
    await prisma.defenseLog.deleteMany();
    return NextResponse.json({ message: "All logs cleared" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
