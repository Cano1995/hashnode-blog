import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import { PostCard, PostCardFeatured } from "@/components/blog/PostCard";
import { TagBadge } from "@/components/blog/TagBadge";
import { Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) {
  const { page: pageStr, tag, search } = await searchParams;
  const page = parseInt(pageStr ?? "1");
  const limit = 9;
  const skip = (page - 1) * limit;
  const isSearching = !!search?.trim();
  const isFiltering = isSearching || !!tag;

  const baseWhere = {
    published: true,
    ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
    ...(isSearching ? {
      OR: [
        { title: { contains: search } },
        { excerpt: { contains: search } },
        { content: { contains: search } },
      ],
    } : {}),
  };

  const [settings, featuredPosts, posts, total, allTags] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: "settings" }, update: {}, create: { id: "settings" } }),
    page === 1 && !isFiltering
      ? prisma.post.findMany({
          where: { published: true, featured: true },
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { tags: { include: { tag: true } } },
        })
      : Promise.resolve([]),
    prisma.post.findMany({
      where: { ...baseWhere, ...(page === 1 && !isFiltering ? { featured: false } : {}) },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.post.count({ where: baseWhere }),
    prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { posts: { _count: "desc" } },
      take: 12,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);
  const paginationHref = (p: number) => {
    const q = new URLSearchParams();
    q.set("page", String(p));
    if (tag) q.set("tag", tag);
    if (search) q.set("search", search);
    return `/?${q}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar siteName={settings.title} />

      <main className="flex-1 max-w-[1280px] mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex gap-8 items-start">

          {/* ── Main content ─────────────────────────────── */}
          <div className="flex-1 min-w-0 space-y-6">

            {/* Featured */}
            {page === 1 && !isFiltering && featuredPosts.length > 0 && (
              <PostCardFeatured post={featuredPosts[0]} />
            )}

            {/* Search header */}
            {isSearching && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Search className="w-4 h-4" style={{ color: "var(--c-primary)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--c-text)" }}>
                    {total} resultado{total !== 1 ? "s" : ""} para{" "}
                    <span style={{ color: "var(--c-primary)" }}>"{search}"</span>
                  </span>
                </div>
                <Link href="/" className="text-xs" style={{ color: "var(--c-muted)" }}>
                  Limpiar ×
                </Link>
              </div>
            )}

            {/* Tag filter header */}
            {tag && !isSearching && (
              <div className="flex items-center justify-between">
                <h1 className="text-base font-semibold" style={{ color: "var(--c-text)" }}>
                  {total} artículo{total !== 1 ? "s" : ""} en{" "}
                  <span style={{ color: "var(--c-primary)" }}>#{tag}</span>
                </h1>
                <Link href="/" className="text-xs" style={{ color: "var(--c-muted)" }}>
                  Ver todos
                </Link>
              </div>
            )}

            {/* Grid */}
            {posts.length === 0 ? (
              <div
                className="py-16 text-center rounded-md text-sm"
                style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)", color: "var(--c-muted)" }}
              >
                {isSearching ? `Sin resultados para "${search}"` : "No hay artículos publicados aún."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                {page > 1 && (
                  <Link
                    href={paginationHref(page - 1)}
                    className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
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
                    href={paginationHref(page + 1)}
                    className="px-3 py-1.5 rounded text-sm font-medium transition-colors"
                    style={{ border: "1px solid var(--c-border)", color: "var(--c-muted)", background: "var(--c-surface)" }}
                  >
                    Siguiente →
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ───────────────────────────────────── */}
          <aside className="hidden lg:block w-64 xl:w-72 shrink-0">
            <div className="sticky top-20 space-y-4">

              {/* Author card */}
              <div
                className="rounded-md p-4"
                style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}
              >
                <p className="text-sm font-semibold mb-1" style={{ color: "var(--c-text)" }}>
                  {settings.authorName}
                </p>
                {settings.authorBio && (
                  <p className="text-xs leading-relaxed" style={{ color: "var(--c-muted)" }}>
                    {settings.authorBio}
                  </p>
                )}
              </div>

              {/* Popular tags */}
              <div
                className="rounded-md p-4"
                style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}
              >
                <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--c-muted)" }}>
                  Etiquetas populares
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((t) => (
                    <TagBadge key={t.id} name={t.name} slug={t.slug} color={t.color} />
                  ))}
                  {allTags.length === 0 && (
                    <span className="text-xs" style={{ color: "var(--c-subtle)" }}>Sin etiquetas aún</span>
                  )}
                </div>
              </div>
            </div>
          </aside>
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
