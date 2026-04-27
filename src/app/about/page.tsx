import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import Image from "next/image";
import Link from "next/link";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

const AUTHOR_LINKEDIN =
  "https://www.linkedin.com/in/cristhian-cano-bogado-orclapex-86473713b/";

export const metadata: Metadata = {
  title: "Sobre el autor — Cristhian Cano Bogado",
  description:
    "Cristhian Cano Bogado, desarrollador Oracle APEX especializado en migración de Oracle Forms, PL/SQL y aplicaciones empresariales. Conocé su perfil, experiencia y publicaciones.",
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: "Sobre Cristhian Cano Bogado | Paraguayan Dev",
    description:
      "Desarrollador Oracle APEX especializado en migración de Oracle Forms y desarrollo de aplicaciones empresariales.",
    url: `${SITE_URL}/about`,
    type: "profile",
  },
};

const SKILLS = [
  "Oracle APEX",
  "Oracle Forms",
  "PL/SQL",
  "SQL",
  "Oracle Database",
  "Migración de sistemas legacy",
  "Desarrollo empresarial",
  "Low-code / No-code",
];

export default async function AboutPage() {
  const settings = await prisma.siteSettings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.authorName || "Cristhian Cano Bogado",
    url: SITE_URL,
    sameAs: [
      AUTHOR_LINKEDIN,
      settings.githubUrl,
      settings.twitterUrl,
    ].filter(Boolean),
    jobTitle: "Oracle APEX Developer",
    knowsAbout: SKILLS,
    worksFor: {
      "@type": "Organization",
      name: settings.title || "Paraguayan Dev",
      url: SITE_URL,
    },
  };

  const socials = [
    { label: "LinkedIn", href: AUTHOR_LINKEDIN },
    settings.githubUrl ? { label: "GitHub", href: settings.githubUrl } : null,
    settings.twitterUrl ? { label: "Twitter / X", href: settings.twitterUrl } : null,
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--c-bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      <Navbar siteName={settings.title} />

      <main id="main-content" className="flex-1 max-w-[720px] mx-auto w-full px-4 sm:px-6 py-12">
        <article>
          {/* Header del autor */}
          <header className="mb-10">
            {settings.authorImage ? (
              <Image
                src={settings.authorImage}
                alt={settings.authorName || "Cristhian Cano Bogado"}
                width={80}
                height={80}
                className="rounded-full mb-4 border"
                style={{ borderColor: "var(--c-border)" }}
              />
            ) : (
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-4 text-2xl font-bold"
                style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", color: "var(--c-primary)" }}
              >
                {(settings.authorName || "C").charAt(0)}
              </div>
            )}

            <h1 className="text-2xl font-bold mb-1" style={{ color: "var(--c-text)" }}>
              {settings.authorName || "Cristhian Cano Bogado"}
            </h1>
            <p className="text-sm font-medium" style={{ color: "var(--c-primary)" }}>
              Oracle APEX Developer · Paraguayan Dev
            </p>
          </header>

          {/* Bio */}
          <section className="space-y-4 mb-10">
            {settings.authorBio ? (
              <p className="text-sm leading-relaxed" style={{ color: "var(--c-text)" }}>
                {settings.authorBio}
              </p>
            ) : (
              <>
                <p className="text-sm leading-relaxed" style={{ color: "var(--c-text)" }}>
                  Soy Cristhian Cano Bogado, desarrollador especializado en{" "}
                  <strong>Oracle APEX</strong> y en la migración de{" "}
                  <strong>Oracle Forms</strong> hacia plataformas modernas de bajo código.
                  Con experiencia en entornos empresariales, ayudo a organizaciones a
                  modernizar sistemas legacy sin sacrificar la lógica de negocio que los
                  sostiene.
                </p>
                <p className="text-sm leading-relaxed" style={{ color: "var(--c-text)" }}>
                  En este blog comparto guías técnicas, patrones de migración, tips de
                  PL/SQL y todo lo que aprendo trabajando con Oracle Database y el ecosistema
                  APEX día a día.
                </p>
              </>
            )}
          </section>

          {/* Especialidades */}
          <section
            className="mb-10 pt-6"
            style={{ borderTop: "1px solid var(--c-border)" }}
          >
            <h2
              className="text-xs font-semibold uppercase tracking-wider mb-4"
              style={{ color: "var(--c-muted)" }}
            >
              Especialidades
            </h2>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 text-xs rounded-md"
                  style={{
                    background: "var(--c-surface)",
                    border: "1px solid var(--c-border)",
                    color: "var(--c-muted)",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </section>

          {/* Links sociales */}
          <section
            className="pt-6 flex flex-wrap gap-4"
            style={{ borderTop: "1px solid var(--c-border)" }}
          >
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium hover:underline transition-opacity hover:opacity-80"
                style={{ color: "var(--c-primary)" }}
              >
                {s.label} →
              </a>
            ))}
          </section>

          {/* CTA al blog */}
          <div
            className="mt-10 p-5 rounded-md"
            style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}
          >
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--c-text)" }}>
              ¿Querés aprender Oracle APEX?
            </p>
            <p className="text-xs mb-3" style={{ color: "var(--c-muted)" }}>
              Explorá los artículos del blog — desde migraciones hasta buenas prácticas con PL/SQL.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-md transition-opacity hover:opacity-80"
              style={{ background: "var(--c-primary)", color: "#fff" }}
            >
              Ver artículos →
            </Link>
          </div>
        </article>
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
