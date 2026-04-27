import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, description, details, priceLabel, icon, contactUrl, active, featured, order } = body;

  if (!name?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Nombre y descripción son obligatorios" }, { status: 400 });
  }

  const service = await prisma.service.update({
    where: { id },
    data: {
      name: name.trim(),
      description: description.trim(),
      details: details?.trim() || null,
      priceLabel: priceLabel?.trim() || null,
      icon: icon?.trim() || null,
      contactUrl: contactUrl?.trim() || null,
      active: Boolean(active),
      featured: Boolean(featured),
      order: Number(order) || 0,
    },
  });

  return NextResponse.json(service);
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
