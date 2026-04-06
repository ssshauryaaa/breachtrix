import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const VALID_TYPES = ["INFO", "WARNING", "ALERT", "SUCCESS"];

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") ?? undefined;

    if (type && !VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: `type must be one of: ${VALID_TYPES.join(", ")}` }, { status: 400 });
    }

    const announcements = await prisma.announcement.findMany({
      where: type ? { type: type as any } : undefined,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(announcements);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { title, message, type = "INFO" } = await req.json();

    if (!title?.trim()) return NextResponse.json({ error: "title is required" }, { status: 400 });
    if (!message?.trim()) return NextResponse.json({ error: "message is required" }, { status: 400 });
    if (!VALID_TYPES.includes(type))
      return NextResponse.json({ error: "type must be INFO, WARNING, ALERT, or SUCCESS" }, { status: 400 });

    const announcement = await prisma.announcement.create({
      data: { title: title.trim(), message: message.trim(), type },
    });

    return NextResponse.json({ message: "Announcement created", announcement }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { count } = await prisma.announcement.deleteMany();
    return NextResponse.json({ message: `Cleared ${count} announcement(s)` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
