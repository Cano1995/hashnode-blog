import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import slugify from "slugify";

export async function GET() {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(tags);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { name, color } = body;
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const slug = slugify(name, { lower: true, strict: true });
  const tag = await prisma.tag.create({ data: { name, slug, color: color ?? "#6366f1" } });
  return NextResponse.json(tag, { status: 201 });
}
