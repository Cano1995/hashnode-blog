import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { calculateReadingTime } from "@/lib/utils";
import slugify from "slugify";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "10");
  const tag = searchParams.get("tag");
  const published = searchParams.get("published");
  const skip = (page - 1) * limit;

  const where = {
    ...(published !== null ? { published: published === "true" } : {}),
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
  };

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.post.count({ where }),
  ]);

  return NextResponse.json({ posts, total, page, limit });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, content, excerpt, coverImage, published, featured, tagIds } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const readingTime = calculateReadingTime(content);

  const post = await prisma.post.create({
    data: {
      title,
      slug,
      content,
      excerpt: excerpt ?? content.replace(/<[^>]*>/g, "").substring(0, 200),
      coverImage,
      published: published ?? false,
      featured: featured ?? false,
      readingTime,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId: string) => ({ tagId })) }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });

  return NextResponse.json(post, { status: 201 });
}
