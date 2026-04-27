import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, confirmed: true, createdAt: true },
  });

  return NextResponse.json(subscribers);
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.subscriber.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
