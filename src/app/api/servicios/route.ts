import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(services);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, description, details, priceLabel, icon, contactUrl, featured, order } = body;

  if (!name?.trim() || !description?.trim()) {
    return NextResponse.json({ error: "Nombre y descripción son obligatorios" }, { status: 400 });
  }

  const service = await prisma.service.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      details: details?.trim() || null,
      priceLabel: priceLabel?.trim() || null,
      icon: icon?.trim() || null,
      contactUrl: contactUrl?.trim() || null,
      featured: Boolean(featured),
      order: Number(order) || 0,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
