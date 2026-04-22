import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TagsPage() {
  const [settings, tags] = await Promise.all([
    prisma.siteSettings.upsert({ where: { id: "settings" }, update: {}, create: { id: "settings" } }),
    prisma.tag.findMany({
      include: { _count: { select: { posts: { where: { post: { published: true } } } } } },
      orderBy: { posts: { _count: "desc" } },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar siteName={settings.title} />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Todas las etiquetas</h1>
        <p className="text-gray-500 mb-8">{tags.length} etiquetas disponibles</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="flex flex-col items-center justify-center p-5 rounded-xl border border-gray-200 bg-white hover:shadow-md transition-shadow text-center"
            >
              <div
                className="w-10 h-10 rounded-lg mb-3 flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: tag.color }}
              >
                #
              </div>
              <span className="font-semibold text-gray-900 text-sm">{tag.name}</span>
              <span className="text-xs text-gray-400 mt-1">{tag._count.posts} artículos</span>
            </Link>
          ))}
        </div>
      </main>
      <Footer siteName={settings.title} />
    </div>
  );
}
