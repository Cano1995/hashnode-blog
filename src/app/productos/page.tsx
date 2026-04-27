import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import { SITE_URL } from "@/lib/siteUrl";
import { ExternalLink, Star, Tag } from "lucide-react";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Cursos de Oracle APEX recomendados",
  description:
    "Cursos de Oracle APEX, Oracle Forms, SQL y PL/SQL recomendados por Cristhian Cano Bogado. Recursos seleccionados para desarrolladores empresariales.",
  alternates: { canonical: `${SITE_URL}/productos` },
  openGraph: {
    title: "Cursos de Oracle APEX recomendados | Paraguayan Dev",
    description:
      "Recursos de aprendizaje seleccionados para dominar Oracle APEX, migración de Oracle Forms y bases de datos empresariales.",
    url: `${SITE_URL}/productos`,
    type: "website",
  },
};

export default async function ProductosPage() {
  const [products, settings] = await Promise.all([
    prisma.product.findMany({
      where: { active: true },
      orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    }),
    prisma.siteSettings.upsert({ where: { id: "settings" }, update: {}, create: { id: "settings" } }),
  ]);

  const featured = products.filter((p) => p.featured);
  const rest = products.filter((p) => !p.featured);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Cursos recomendados de Oracle APEX y desarrollo empresarial",
    description: "Selección de cursos de Oracle APEX, Oracle Forms y SQL recomendados por Paraguayan Dev.",
    url: `${SITE_URL}/productos`,
    itemListElement: products.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: p.name,
        description: p.description,
        url: `${SITE_URL}/productos`,
        provider: { "@type": "Organization", name: p.platform },
        ...(p.imageUrl ? { image: p.imageUrl } : {}),
      },
    })),
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--c-bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <Navbar siteName={settings.title} />

      <main id="main-content" className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--c-text)" }}>
            Cursos recomendados de Oracle APEX
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: "var(--c-muted)" }}>
            Recursos de aprendizaje que uso y recomiendo para dominar Oracle APEX,
            migración de Oracle Forms, PL/SQL y desarrollo empresarial.
          </p>

          {/* Disclosure de afiliados — obligatorio FTC/Google */}
          <div
            className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs"
            style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", color: "var(--c-subtle)" }}
          >
            <Tag className="w-3 h-3 shrink-0" />
            Algunos enlaces son de afiliado. Si comprás a través de ellos, recibo una pequeña comisión sin costo adicional para vos.
          </div>
        </div>

        {products.length === 0 ? (
          <div
            className="py-20 text-center rounded-md text-sm"
            style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", color: "var(--c-muted)" }}
          >
            Próximamente — estamos cargando los cursos recomendados.
          </div>
        ) : (
          <>
            {/* Destacados */}
            {featured.length > 0 && (
              <section className="mb-10" aria-label="Cursos destacados">
                <h2
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: "var(--c-muted)" }}
                >
                  Destacados
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featured.map((p) => (
                    <ProductCard key={p.id} product={p} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Todos los cursos */}
            {rest.length > 0 && (
              <section aria-label="Todos los cursos">
                {featured.length > 0 && (
                  <h2
                    className="text-xs font-semibold uppercase tracking-wider mb-4"
                    style={{ color: "var(--c-muted)" }}
                  >
                    Más cursos
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {rest.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {/* CTA servicios */}
        <div
          className="mt-12 p-6 rounded-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}
        >
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: "var(--c-text)" }}>
              ¿Preferís una solución personalizada?
            </p>
            <p className="text-xs" style={{ color: "var(--c-muted)" }}>
              Ofrezco servicios de consultoría en Oracle APEX y migración de Oracle Forms.
            </p>
          </div>
          <Link
            href="/servicios"
            className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--c-primary)", color: "#fff" }}
          >
            Ver servicios →
          </Link>
        </div>
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

// ── Componente de tarjeta de producto ──────────────────────────────
type Product = {
  id: string; name: string; description: string; imageUrl: string | null;
  affiliateUrl: string; price: string | null; platform: string; category: string | null; featured: boolean;
};

function ProductCard({ product: p, featured = false }: { product: Product; featured?: boolean }) {
  return (
    <article
      className="flex flex-col rounded-md overflow-hidden"
      style={{ background: "var(--c-surface)", border: `1px solid ${featured ? "var(--c-primary)" : "var(--c-border)"}` }}
    >
      {p.imageUrl && (
        <div className="relative h-44 overflow-hidden">
          <Image
            src={p.imageUrl}
            alt={p.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {featured && (
            <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold"
              style={{ background: "var(--c-primary)", color: "#fff" }}>
              <Star className="w-3 h-3" /> Recomendado
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Platform + category */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="px-2 py-0.5 rounded text-xs font-medium"
            style={{ background: "var(--c-surface2)", color: "var(--c-muted)", border: "1px solid var(--c-border)" }}
          >
            {p.platform}
          </span>
          {p.category && (
            <span className="text-xs" style={{ color: "var(--c-subtle)" }}>#{p.category}</span>
          )}
        </div>

        <h3 className="font-semibold text-sm leading-snug" style={{ color: "var(--c-text)" }}>
          {p.name}
        </h3>

        <p className="text-xs leading-relaxed flex-1" style={{ color: "var(--c-muted)" }}>
          {p.description}
        </p>

        <div className="flex items-center justify-between pt-3 mt-auto" style={{ borderTop: "1px solid var(--c-border)" }}>
          {p.price ? (
            <span className="text-sm font-semibold" style={{ color: "var(--c-primary)" }}>
              {p.price}
            </span>
          ) : (
            <span />
          )}
          {/* rel="sponsored" obligatorio por Google para links de afiliados */}
          <a
            href={p.affiliateUrl}
            target="_blank"
            rel="sponsored noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-opacity hover:opacity-80"
            style={{ background: "var(--c-primary)", color: "#fff" }}
          >
            Ver curso <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </article>
  );
}
