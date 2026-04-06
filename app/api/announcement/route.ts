import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_TYPES = ["INFO", "WARNING", "ALERT", "SUCCESS"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? undefined;

    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: `type must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
    }

    const announcements = await prisma.announcement.findMany({
      where: type ? { type: type as any } : undefined,
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, message: true, type: true, createdAt: true },
    });

    return NextResponse.json(announcements);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
