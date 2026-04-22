import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { tags: { include: { tag: true } } },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.post.update({ where: { slug }, data: { views: { increment: 1 } } });

  return NextResponse.json(post);
}
