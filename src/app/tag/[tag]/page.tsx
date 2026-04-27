import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import { PostCard } from "@/components/blog/PostCard";
import Link from "next/link";
import { SITE_URL } from "@/lib/siteUrl";

export const revalidate = 3600;

type Params = { params: Promise<{ tag: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { tag: tagSlug } = await params;
  const tag = await prisma.tag.findUnique({ where: { slug: tagSlug } });
  if (!tag) return {};
  const title = `#${tag.name}`;
  const description = `Artículos sobre ${tag.name} en Paraguayan Dev.`;
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/tag/${tagSlug}` },
    openGraph: { title: `${title} | Paraguayan Dev`, description, url: `${SITE_URL}/tag/${tagSlug}` },
  };
}

export default async function TagPage({ params, searchParams }: Params & { searchParams: Promise<{ page?: string }> }) {
  const { tag: tagSlug } = await params;
  const { page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1");
  const limit = 9;
  const skip = (page - 1) * limit;

  const [tag, settings] = await Promise.all([
    prisma.tag.findUnique({ where: { slug: tagSlug } }),
    prisma.siteSettings.upsert({ where: { id: "settings" }, update: {}, create: { id: "settings" } }),
  ]);

  if (!tag) notFound();

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true, tags: { some: { tagId: tag.id } } },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.post.count({
      where: { published: true, tags: { some: { tagId: tag.id } } },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--c-bg)" }}>
      <Navbar siteName={settings.title} />
      <main id="main-content" className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-10">
        <div
          className="flex items-center justify-between mb-6 pb-4"
          style={{ borderBottom: "1px solid var(--c-border)" }}
        >
          <div className="flex items-center gap-3">
            <h1
              className="px-2.5 py-1 rounded text-sm font-semibold"
              style={{ background: `${tag.color}22`, color: tag.color ?? "var(--c-primary)", border: `1px solid ${tag.color}44` }}
            >
              #{tag.name}
            </h1>
            <span className="text-sm" style={{ color: "var(--c-muted)" }}>
              {total} artículo{total !== 1 ? "s" : ""}
            </span>
          </div>
          <Link
            href="/tags"
            className="text-xs transition-opacity hover:opacity-70"
            style={{ color: "var(--c-muted)" }}
          >
            ← Todas las etiquetas
          </Link>
        </div>

        {posts.length === 0 ? (
          <div
            className="py-16 text-center rounded-md text-sm"
            style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", color: "var(--c-muted)" }}
          >
            Sin artículos en esta etiqueta.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-8">
            {page > 1 && (
              <Link
                href={`/tag/${tagSlug}?page=${page - 1}`}
                className="px-3 py-1.5 rounded text-sm font-medium"
                style={{ border: "1px solid var(--c-border)", color: "var(--c-muted)", background: "var(--c-surface)" }}
              >
                ← Anterior
              </Link>
            )}
            <span className="px-3 py-1.5 text-sm" style={{ color: "var(--c-muted)" }}>
              {page} / {totalPages}
            </span>
            {page < totalPages && (
              <Link
                href={`/tag/${tagSlug}?page=${page + 1}`}
                className="px-3 py-1.5 rounded text-sm font-medium"
                style={{ border: "1px solid var(--c-border)", color: "var(--c-muted)", background: "var(--c-surface)" }}
              >
                Siguiente →
              </Link>
            )}
          </div>
        )}
      </main>
      <Footer siteName={settings.title} />
    </div>
  );
}
