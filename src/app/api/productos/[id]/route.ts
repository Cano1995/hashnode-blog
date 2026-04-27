import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, description, imageUrl, affiliateUrl, price, platform, category, active, featured, order } = body;

  if (!name?.trim() || !description?.trim() || !affiliateUrl?.trim()) {
    return NextResponse.json({ error: "Nombre, descripción y URL de afiliado son obligatorios" }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { id },
    data: {
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl?.trim() || null,
      affiliateUrl: affiliateUrl.trim(),
      price: price?.trim() || null,
      platform: platform?.trim() || "Udemy",
      category: category?.trim() || null,
      active: Boolean(active),
      featured: Boolean(featured),
      order: Number(order) || 0,
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
