import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/blog/Navbar";
import { Footer } from "@/components/blog/Footer";
import { TagBadge } from "@/components/blog/TagBadge";
import { formatDate } from "@/lib/utils";
import { Clock, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

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

  await prisma.post.update({ where: { id: post.id }, data: { views: { increment: 1 } } });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar siteName={settings.title} />
      <main className="flex-1">
        {post.coverImage && (
          <div className="relative h-72 md:h-96 w-full">
            <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Link>

          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map(({ tag }) => (
                <TagBadge key={tag.id} name={tag.name} slug={tag.slug} color={tag.color} size="md" />
              ))}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4">
              {post.title}
            </h1>
            <div className="flex items-center gap-5 text-sm text-gray-500">
              <span>{formatDate(post.createdAt)}</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readingTime} min de lectura
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" />
                {post.views} vistas
              </span>
            </div>
          </header>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
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
