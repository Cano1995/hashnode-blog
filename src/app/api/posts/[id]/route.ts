import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { calculateReadingTime } from "@/lib/utils";
import { sendNewPostEmail } from "@/lib/email";
import slugify from "slugify";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    include: { tags: { include: { tag: true } } },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { title, content, excerpt, coverImage, published, featured, tagIds } = body;

  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let slug = existing.slug;
  if (title && title !== existing.title) {
    const baseSlug = slugify(title, { lower: true, strict: true });
    slug = baseSlug;
    let counter = 1;
    while (await prisma.post.findFirst({ where: { slug, NOT: { id } } })) {
      slug = `${baseSlug}-${counter++}`;
    }
  }

  const readingTime = content ? calculateReadingTime(content) : existing.readingTime;

  await prisma.postTag.deleteMany({ where: { postId: id } });

  const willPublish = published === true && !existing.published;

  const post = await prisma.post.update({
    where: { id },
    data: {
      title: title ?? existing.title,
      slug,
      content: content ?? existing.content,
      excerpt: excerpt ?? existing.excerpt,
      coverImage: coverImage !== undefined ? coverImage : existing.coverImage,
      published: published !== undefined ? published : existing.published,
      featured: featured !== undefined ? featured : existing.featured,
      readingTime,
      tags: tagIds?.length
        ? { create: tagIds.map((tagId: string) => ({ tagId })) }
        : undefined,
    },
    include: { tags: { include: { tag: true } } },
  });

  if (willPublish) {
    const subscribers = await prisma.subscriber.findMany({
      where: { confirmed: true },
      select: { email: true, unsubToken: true },
    });
    if (subscribers.length > 0) {
      sendNewPostEmail(subscribers, {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
      }).catch((err) => console.error("Error enviando notificaciones:", err));
    }
  }

  return NextResponse.json(post);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
