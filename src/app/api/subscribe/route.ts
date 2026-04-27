import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendConfirmationEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const { allowed } = rateLimit(`subscribe:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json({ error: "Demasiados intentos. Intenta más tarde." }, { status: 429 });
  }

  const body = await req.json().catch(() => ({}));
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } });

  if (existing?.confirmed) {
    return NextResponse.json({ message: "Ya estás suscrito" });
  }

  const subscriber = existing
    ? existing
    : await prisma.subscriber.create({ data: { email } });

  try {
    await sendConfirmationEmail(subscriber.email, subscriber.confirmToken);
  } catch (err) {
    console.error("Error enviando email de confirmación:", err);
    return NextResponse.json({ error: "Error al enviar el email. Intenta más tarde." }, { status: 500 });
  }

  return NextResponse.json({ message: "Te enviamos un correo para confirmar tu suscripción." });
}
