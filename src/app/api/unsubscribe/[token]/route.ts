import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  const subscriber = await prisma.subscriber.findUnique({
    where: { unsubToken: token },
  });

  if (!subscriber) {
    return NextResponse.redirect(`${SITE_URL}/?unsubscribed=invalid`);
  }

  await prisma.subscriber.delete({ where: { id: subscriber.id } });

  return NextResponse.redirect(`${SITE_URL}/?unsubscribed=true`);
}
