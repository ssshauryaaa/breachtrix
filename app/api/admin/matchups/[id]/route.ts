import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    const { targetUrl, repoUrl, roundLabel, isActive } = await req.json();
    const data: any = {};
    if (targetUrl !== undefined) data.targetUrl = targetUrl.trim() || null;
    if (repoUrl !== undefined) data.repoUrl = repoUrl.trim() || null;
    if (roundLabel !== undefined) data.roundLabel = roundLabel.trim() || null;
    if (isActive !== undefined) data.isActive = Boolean(isActive);

    if (Object.keys(data).length === 0)
      return NextResponse.json({ error: "No fields provided to update" }, { status: 400 });

    const matchup = await prisma.matchup.update({
      where: { id: params.id },
      data,
      include: {
        redTeam: { select: { id: true, name: true, score: true } },
        blueTeam: { select: { id: true, name: true, score: true } },
      },
    });

    return NextResponse.json({ message: "Matchup updated", matchup });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAdmin(req);
  if (error) return error;

  try {
    await prisma.matchup.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Matchup deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
