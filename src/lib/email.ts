import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT ?? "465"),
  secure: (process.env.SMTP_PORT ?? "465") === "465",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const FROM = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? "blog@example.com";

export async function sendConfirmationEmail(email: string, token: string) {
  const confirmUrl = `${SITE_URL}/api/confirm/${token}`;
  await transporter.sendMail({
    from: `"Blog" <${FROM}>`,
    to: email,
    subject: "Confirma tu suscripción",
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
        <h2 style="font-size:20px;font-weight:700;color:#111;margin-bottom:12px;">Confirma tu suscripción</h2>
        <p style="color:#555;line-height:1.6;margin-bottom:24px;">
          Gracias por suscribirte. Haz clic en el botón para confirmar tu dirección de correo
          y empezar a recibir los nuevos artículos.
        </p>
        <a href="${confirmUrl}"
           style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
          Confirmar suscripción
        </a>
        <p style="margin-top:24px;font-size:12px;color:#999;">
          Si no te suscribiste, puedes ignorar este correo.
        </p>
      </div>
    `,
  });
}

export async function sendNewPostEmail(
  subscribers: { email: string; unsubToken: string }[],
  post: { title: string; slug: string; excerpt: string | null }
) {
  const postUrl = `${SITE_URL}/${post.slug}`;
  await Promise.all(
    subscribers.map((sub) => {
      const unsubUrl = `${SITE_URL}/api/unsubscribe/${sub.unsubToken}`;
      return transporter.sendMail({
        from: `"Blog" <${FROM}>`,
        to: sub.email,
        subject: `Nuevo artículo: ${post.title}`,
        html: `
          <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:32px 24px;background:#fff;">
            <h2 style="font-size:20px;font-weight:700;color:#111;margin-bottom:8px;">${post.title}</h2>
            ${post.excerpt ? `<p style="color:#555;line-height:1.6;margin-bottom:24px;">${post.excerpt.replace(/<[^>]*>/g, "")}</p>` : ""}
            <a href="${postUrl}"
               style="display:inline-block;padding:12px 24px;background:#6366f1;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
              Leer artículo
            </a>
            <p style="margin-top:32px;font-size:12px;color:#999;">
              Recibiste este correo porque estás suscrito al blog.<br/>
              <a href="${unsubUrl}" style="color:#999;">Cancelar suscripción</a>
            </p>
          </div>
        `,
      });
    })
  );
}
