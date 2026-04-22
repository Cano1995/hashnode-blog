import React from "react";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import Link from "next/link";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: "Etiquetas",
  description: "Explorá todos los temas del blog: Oracle APEX, SQL, desarrollo web y más.",
  alternates: { canonical: `${SITE_URL}/tags` },
  openGraph: {
    title: "Etiquetas | Paraguayan Dev",
    description: "Explorá todos los temas del blog: Oracle APEX, SQL, desarrollo web y más.",
    url: `${SITE_URL}/tags`,
  },
};

export default async function TagsPage() {
  const [settings, tags] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: "settings" }, update: {}, create: { id: "settings" } }),
    prisma.tag.findMany({
      include: { _count: { select: { posts: { where: { post: { published: true } } } } } },
      orderBy: { posts: { _count: "desc" } },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--c-bg)" }}>
      <Navbar siteName={settings.title} />
      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-10">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1" style={{ color: "var(--c-text)" }}>Etiquetas</h1>
          <p className="text-sm" style={{ color: "var(--c-muted)" }}>{tags.length} etiquetas disponibles</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="tag-card flex flex-col gap-2 p-4 rounded-md"
              style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", "--tag-color": tag.color ?? "var(--c-primary)" } as React.CSSProperties}
            >
              <span
                className="text-xs font-bold px-1.5 py-0.5 rounded w-fit"
                style={{ background: `${tag.color}22`, color: tag.color ?? "var(--c-primary)", border: `1px solid ${tag.color}44` }}
              >
                #{tag.name}
              </span>
              <span className="text-[11px]" style={{ color: "var(--c-muted)" }}>
                {tag._count.posts} artículo{tag._count.posts !== 1 ? "s" : ""}
              </span>
            </Link>
          ))}
        </div>
        {tags.length === 0 && (
          <div
            className="py-16 text-center rounded-md text-sm"
            style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", color: "var(--c-muted)" }}
          >
            Sin etiquetas aún.
          </div>
        )}
      </main>
      <Footer siteName={settings.title} />
    </div>
  );
}
