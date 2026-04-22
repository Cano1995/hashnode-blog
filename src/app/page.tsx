import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import { PostCard, PostCardFeatured } from "@/components/blog/PostCard";
import { TagBadge } from "@/components/blog/TagBadge";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; tag?: string }>;
}) {
  const { page: pageStr, tag } = await searchParams;
  const page = parseInt(pageStr ?? "1");
  const limit = 9;
  const skip = (page - 1) * limit;

  const [settings, featuredPosts, posts, total, allTags] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: "settings" }, update: {}, create: { id: "settings" } }),
    page === 1 && !tag
      ? prisma.post.findMany({
          where: { published: true, featured: true },
          take: 1,
          orderBy: { createdAt: "desc" },
          include: { tags: { include: { tag: true } } },
        })
      : Promise.resolve([]),
    prisma.post.findMany({
      where: {
        published: true,
        ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
        ...(page === 1 && !tag ? { featured: false } : {}),
      },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.post.count({
      where: {
        published: true,
        ...(tag ? { tags: { some: { tag: { slug: tag } } } } : {}),
      },
    }),
    prisma.tag.findMany({
      include: { _count: { select: { posts: true } } },
      orderBy: { posts: { _count: "desc" } },
      take: 10,
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar siteName={settings.title} />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <div className="flex-1 min-w-0">
            {page === 1 && !tag && featuredPosts.length > 0 && (
              <div className="mb-8">
                <PostCardFeatured post={featuredPosts[0]} />
              </div>
            )}

            {tag && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Artículos sobre <span className="text-indigo-600">#{tag}</span>
                </h1>
                <p className="text-gray-500 text-sm mt-1">{total} artículos encontrados</p>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No hay artículos publicados aún.</p>
                <Link href="/admin/posts/new" className="mt-4 inline-block text-indigo-600 hover:underline">
                  Crea el primero →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {page > 1 && (
                  <Link
                    href={`/?page=${page - 1}${tag ? `&tag=${tag}` : ""}`}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    ← Anterior
                  </Link>
                )}
                <span className="px-4 py-2 text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/?page=${page + 1}${tag ? `&tag=${tag}` : ""}`}
                    className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Siguiente →
                  </Link>
                )}
              </div>
            )}
          </div>

          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-24 space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">Etiquetas populares</h3>
                <div className="flex flex-wrap gap-2">
                  {allTags.map((t) => (
                    <TagBadge key={t.id} name={t.name} slug={t.slug} color={t.color} />
                  ))}
                  {allTags.length === 0 && (
                    <p className="text-sm text-gray-400">Sin etiquetas aún</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-5">
                <h3 className="font-semibold text-gray-900 mb-2">{settings.authorName}</h3>
                {settings.authorBio && (
                  <p className="text-sm text-gray-600">{settings.authorBio}</p>
                )}
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
