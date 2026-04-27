import { prisma } from "@/lib/prisma";
import { ProductoManager } from "./ProductoManager";

export const dynamic = "force-dynamic";

export default async function AdminProductosPage() {
  const products = await prisma.product.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return <ProductoManager initialProducts={products} />;
}
