import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const settings = await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: body,
    create: { id: "settings", ...body },
  });
  return NextResponse.json(settings);
}
