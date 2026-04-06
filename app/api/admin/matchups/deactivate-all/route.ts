import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { count } = await prisma.matchup.updateMany({ data: { isActive: false } });
    return NextResponse.json({ message: `${count} matchup(s) deactivated` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
