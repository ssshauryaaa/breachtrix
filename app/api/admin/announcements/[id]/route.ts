import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const VALID_TYPES = ["INFO", "WARNING", "ALERT", "SUCCESS"];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { title, message, type, pinned } = await req.json();

    if (type && !VALID_TYPES.includes(type))
      return NextResponse.json({ error: "type must be INFO, WARNING, ALERT, or SUCCESS" }, { status: 400 });

    const data: any = {};
    if (title !== undefined) data.title = title.trim();
    if (message !== undefined) data.message = message.trim();
    if (type !== undefined) data.type = type;
    if (pinned !== undefined) data.pinned = Boolean(pinned);

    if (Object.keys(data).length === 0)
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });

    const announcement = await prisma.announcement.update({ where: { id: params.id }, data });
    return NextResponse.json({ message: "Announcement updated", announcement });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    await prisma.announcement.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Announcement deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
