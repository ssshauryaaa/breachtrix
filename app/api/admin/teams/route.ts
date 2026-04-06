import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const teams = await prisma.team.findMany({
      include: {
        members: { include: { user: { select: { id: true, username: true, role: true } } } },
      },
      orderBy: { score: "desc" },
    });
    return NextResponse.json(teams);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { name, role } = await req.json();
    if (!["RED", "BLUE"].includes(role)) {
      return NextResponse.json({ error: "Role must be RED or BLUE" }, { status: 400 });
    }
    const team = await prisma.team.create({ data: { name, role } });
    return NextResponse.json({ message: "Team created", team }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
