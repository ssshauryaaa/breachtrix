import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const teams = await prisma.team.findMany({ orderBy: { score: "desc" } });
    return NextResponse.json(teams);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
