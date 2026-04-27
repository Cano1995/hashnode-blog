import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import { TagBadge } from "@/components/blog/TagBadge";
import { PostContent } from "@/components/blog/PostContent";
import { ViewTracker } from "@/components/blog/ViewTracker";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/siteUrl";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { tags: { include: { tag: true } } },
  });

  if (!post) return {};

  const description = post.excerpt
    ? post.excerpt.replace(/<[^>]*>/g, "").slice(0, 160)
    : `Artículo de Paraguayan Dev sobre ${post.tags.map((t) => t.tag.name).join(", ")}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: `${SITE_URL}/${slug}` },
    openGraph: {
      title: post.title,
      description,
      url: `${SITE_URL}/${slug}`,
      type: "article",
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      tags: post.tags.map((t) => t.tag.name),
      ...(post.coverImage ? { images: [{ url: post.coverImage, width: 1200, height: 630, alt: post.title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      ...(post.coverImage ? { images: [post.coverImage] } : {}),
    },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;

  const [post, settings] = await Promise.all([
    prisma.post.findUnique({
      where: { slug, published: true },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.siteSettings.upsert({ where: { id: "settings" }, update: {}, create: { id: "settings" } }),
  ]);

  if (!post) notFound();

  const related = await prisma.post.findMany({
    where: {
      published: true,
      id: { not: post.id },
      tags: { some: { tagId: { in: post.tags.map((t) => t.tagId) } } },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
    select: { id: true, slug: true, title: true, createdAt: true, readingTime: true },
  });

  const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt?.replace(/<[^>]*>/g, "") ?? "",
    url: `${SITE_URL}/${slug}`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: settings.authorName },
    publisher: {
      "@type": "Organization",
      name: settings.title,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
    },
    ...(post.coverImage ? { image: post.coverImage } : {}),
    keywords: post.tags.map((t) => t.tag.name).join(", "),
    inLanguage: "es",
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: post.title, item: `${SITE_URL}/${slug}` },
    ],
  },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--c-bg)" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewTracker slug={slug} />
      <Navbar siteName={settings.title} />
      <main id="main-content" className="flex-1">
        {post.coverImage && (
          <div className="relative h-64 md:h-80 w-full">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--c-bg) 0%, transparent 60%)" }} />
          </div>
        )}

        <article className="max-w-[720px] mx-auto px-4 sm:px-6 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm mb-8 transition-opacity hover:opacity-70"
            style={{ color: "var(--c-muted)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al inicio
          </Link>

          <header className="mb-8">
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {post.tags.map(({ tag }) => (
                  <TagBadge key={tag.id} name={tag.name} slug={tag.slug} color={tag.color} size="md" />
                ))}
              </div>
            )}
            <h1 className="text-2xl md:text-3xl font-bold leading-snug mb-4" style={{ color: "var(--c-text)" }}>
              {post.title}
            </h1>
            <div
              className="flex flex-wrap items-center gap-4 text-xs pb-6"
              style={{ color: "var(--c-subtle)", borderBottom: "1px solid var(--c-border)" }}
            >
              <span>{formatDate(post.createdAt)}</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readingTime} min de lectura
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {post.views.toLocaleString()} vistas
              </span>
            </div>
          </header>

          <PostContent html={post.content} />

          {/* Posts relacionados */}
          {related.length > 0 && (
            <section
              className="mt-12 pt-8"
              style={{ borderTop: "1px solid var(--c-border)" }}
              aria-label="Artículos relacionados"
            >
              <h2
                className="text-xs font-semibold uppercase tracking-wider mb-5"
                style={{ color: "var(--c-muted)" }}
              >
                Artículos relacionados
              </h2>
              <div className="space-y-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/${r.slug}`}
                    className="block group"
                  >
                    <p
                      className="text-sm font-medium group-hover:underline transition-colors"
                      style={{ color: "var(--c-text)" }}
                    >
                      {r.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--c-subtle)" }}>
                      {formatDate(r.createdAt)} · {r.readingTime} min de lectura
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          )}
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
