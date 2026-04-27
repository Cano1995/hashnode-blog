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
  const allowed = {
    title: body.title,
    description: body.description,
    authorName: body.authorName,
    authorBio: body.authorBio,
    authorImage: body.authorImage,
    twitterUrl: body.twitterUrl,
    githubUrl: body.githubUrl,
    linkedinUrl: body.linkedinUrl,
  };
  const settings = await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: allowed,
    create: { id: "settings", ...allowed },
  });
  return NextResponse.json(settings);
}
