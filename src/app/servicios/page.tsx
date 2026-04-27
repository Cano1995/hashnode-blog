import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import { SITE_URL } from "@/lib/siteUrl";
import { CheckCircle, Star } from "lucide-react";

export const dynamic = "force-dynamic";

const AUTHOR_LINKEDIN = "https://www.linkedin.com/in/cristhian-cano-bogado-orclapex-86473713b/";

export const metadata: Metadata = {
  title: "Servicios de consultoría Oracle APEX y migración Oracle Forms",
  description:
    "Consultoría especializada en Oracle APEX, migración de Oracle Forms, desarrollo de aplicaciones empresariales y bases de datos Oracle. Contactá a Cristhian Cano Bogado.",
  alternates: { canonical: `${SITE_URL}/servicios` },
  openGraph: {
    title: "Servicios de consultoría Oracle APEX | Paraguayan Dev",
    description:
      "Consultoría y migración Oracle Forms → APEX. Contactá a Cristhian Cano Bogado para tu proyecto empresarial.",
    url: `${SITE_URL}/servicios`,
    type: "website",
  },
};

const DEFAULT_SERVICES = [
  {
    icon: "🔄",
    name: "Migración Oracle Forms → APEX",
    description: "Transformo tus aplicaciones Oracle Forms legacy a Oracle APEX moderno, preservando la lógica de negocio y mejorando la experiencia de usuario.",
    details: "Análisis de formularios existentes, diseño de arquitectura APEX, migración de triggers PL/SQL, validaciones y lógica de negocio.",
    priceLabel: "A consultar",
    contactUrl: AUTHOR_LINKEDIN,
  },
  {
    icon: "⚡",
    name: "Desarrollo de aplicaciones Oracle APEX",
    description: "Desarrollo de aplicaciones empresariales low-code con Oracle APEX: desde dashboards y reportes hasta sistemas de gestión completos.",
    details: "APEX 23.x+, integración con REST APIs, componentes personalizados, seguridad y roles.",
    priceLabel: "Desde USD 500",
    contactUrl: AUTHOR_LINKEDIN,
  },
  {
    icon: "🔍",
    name: "Auditoría y optimización PL/SQL",
    description: "Revisión de código PL/SQL, optimización de consultas SQL, tuning de base de datos Oracle y refactorización de procedimientos críticos.",
    details: "Análisis de explain plan, índices, hints, particionamiento y mejores prácticas Oracle.",
    priceLabel: "Desde USD 200",
    contactUrl: AUTHOR_LINKEDIN,
  },
  {
    icon: "🎓",
    name: "Mentoría y capacitación Oracle APEX",
    description: "Sesiones personalizadas de capacitación en Oracle APEX y PL/SQL para equipos de desarrollo. Formato remoto o presencial.",
    details: "Talleres prácticos, revisión de código en vivo, materiales incluidos.",
    priceLabel: "Desde USD 100/hora",
    contactUrl: AUTHOR_LINKEDIN,
  },
];

export default async function ServiciosPage() {
  const [dbServices, settings] = await Promise.all([
    prisma.service.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.siteSettings.upsert({ where: { id: "settings" }, update: {}, create: { id: "settings" } }),
  ]);

  // Si no hay servicios en DB, usa los defaults para que la página no quede vacía
  const services = dbServices.length > 0 ? dbServices : DEFAULT_SERVICES;
  const contactEmail = settings.linkedinUrl || AUTHOR_LINKEDIN;

  const serviceSchemas = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Servicios de consultoría Oracle APEX y migración Oracle Forms",
    url: `${SITE_URL}/servicios`,
    itemListElement: services.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Service",
        name: s.name,
        description: s.description,
        url: `${SITE_URL}/servicios`,
        provider: {
          "@type": "Person",
          name: settings.authorName || "Cristhian Cano Bogado",
          url: SITE_URL,
        },
        ...(s.priceLabel ? { offers: { "@type": "Offer", description: s.priceLabel } } : {}),
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--c-bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchemas) }}
      />

      <Navbar siteName={settings.title} />

      <main id="main-content" className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-10 max-w-2xl">
          <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--c-text)" }}>
            Servicios de consultoría Oracle APEX y migración Oracle Forms
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
            Ayudo a empresas y equipos de desarrollo a modernizar sistemas legacy con Oracle APEX,
            optimizar su código PL/SQL y capacitar a sus desarrolladores. Trabajo de forma remota
            con clientes de toda Latinoamérica y España.
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          {services.map((s, i) => (
            <ServiceCard
              key={"id" in s ? s.id : i}
              service={s}
              featured={"featured" in s ? Boolean(s.featured) : false}
            />
          ))}
        </div>

        {/* Por qué elegirme */}
        <section
          className="mb-12 p-6 rounded-md"
          style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}
          aria-label="Por qué trabajar conmigo"
        >
          <h2 className="text-base font-semibold mb-4" style={{ color: "var(--c-text)" }}>
            ¿Por qué trabajar conmigo?
          </h2>
          <ul className="space-y-2.5">
            {[
              "Especializado exclusivamente en el ecosistema Oracle: APEX, Forms, PL/SQL y DB.",
              "Experiencia en entornos empresariales de alta complejidad y volumen de datos.",
              "Enfoque en transferencia de conocimiento — tu equipo aprende mientras trabajamos.",
              "Comunicación clara y documentación entregable al finalizar cada proyecto.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--c-muted)" }}>
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--c-green)" }} />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* CTA de contacto */}
        <section
          className="p-8 rounded-md text-center"
          style={{ background: "var(--c-primary)", color: "#fff" }}
          aria-label="Contacto"
        >
          <h2 className="text-xl font-bold mb-2">¿Tenés un proyecto en mente?</h2>
          <p className="text-sm mb-6 opacity-90 max-w-lg mx-auto">
            Contame tu desafío — ya sea una migración de Oracle Forms, una nueva aplicación APEX
            o una optimización de PL/SQL. Respondemos en menos de 24 horas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={contactEmail}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md font-medium text-sm transition-opacity hover:opacity-90"
              style={{ background: "#fff", color: "var(--c-primary)" }}
            >
              Contactar por LinkedIn →
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md font-medium text-sm border transition-opacity hover:opacity-80"
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "#fff" }}
            >
              Conocer más sobre mí
            </Link>
          </div>
        </section>
      </main>

      <Footer
        siteName={settings.title}
        twitterUrl={settings.twitterUrl || undefined}
        githubUrl={settings.githubUrl || undefined}
        linkedinUrl={settings.linkedinUrl || undefined}
      />
    </div>
  );
}

// ── Componente de tarjeta de servicio ──────────────────────────────
type ServiceLike = {
  name: string; description: string; details?: string | null;
  priceLabel?: string | null; icon?: string | null; contactUrl?: string | null;
};

function ServiceCard({ service: s, featured }: { service: ServiceLike; featured: boolean }) {
  const contactHref = s.contactUrl || AUTHOR_LINKEDIN;

  return (
    <article
      className="flex flex-col p-6 rounded-md"
      style={{
        background: "var(--c-surface)",
        border: `1px solid ${featured ? "var(--c-primary)" : "var(--c-border)"}`,
      }}
    >
      <div className="flex items-start gap-3 mb-4">
        {s.icon && <span className="text-2xl shrink-0" aria-hidden="true">{s.icon}</span>}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h2 className="font-semibold text-sm" style={{ color: "var(--c-text)" }}>
              {s.name}
            </h2>
            {featured && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                style={{ background: "var(--c-primary)", color: "#fff" }}
              >
                <Star className="w-2.5 h-2.5" /> Popular
              </span>
            )}
          </div>
          {s.priceLabel && (
            <span className="text-xs font-medium" style={{ color: "var(--c-primary)" }}>
              {s.priceLabel}
            </span>
          )}
        </div>
      </div>

      <p className="text-xs leading-relaxed mb-3" style={{ color: "var(--c-muted)" }}>
        {s.description}
      </p>

      {s.details && (
        <p className="text-xs leading-relaxed mb-4" style={{ color: "var(--c-subtle)" }}>
          {s.details}
        </p>
      )}

      <div className="mt-auto pt-4" style={{ borderTop: "1px solid var(--c-border)" }}>
        <a
          href={contactHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-opacity hover:opacity-80"
          style={{ background: "var(--c-primary)", color: "#fff" }}
        >
          Consultar →
        </a>
      </div>
    </article>
  );
}
