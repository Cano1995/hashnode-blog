import { prisma } from "@/lib/prisma";
import { ServicioManager } from "./ServicioManager";

export const dynamic = "force-dynamic";

export default async function AdminServiciosPage() {
  const services = await prisma.service.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return <ServicioManager initialServices={services} />;
}
