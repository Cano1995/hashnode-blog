import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { name, description, imageUrl, affiliateUrl, price, platform, category, featured, order } = body;

  if (!name?.trim() || !description?.trim() || !affiliateUrl?.trim()) {
    return NextResponse.json({ error: "Nombre, descripción y URL de afiliado son obligatorios" }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      name: name.trim(),
      description: description.trim(),
      imageUrl: imageUrl?.trim() || null,
      affiliateUrl: affiliateUrl.trim(),
      price: price?.trim() || null,
      platform: platform?.trim() || "Udemy",
      category: category?.trim() || null,
      featured: Boolean(featured),
      order: Number(order) || 0,
    },
  });

  return NextResponse.json(product, { status: 201 });
}
