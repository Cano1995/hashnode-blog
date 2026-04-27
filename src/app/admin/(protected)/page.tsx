import { prisma } from "@/lib/prisma";
import { FileText, Eye, Tag, TrendingUp } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalPosts, publishedPosts, totalViews, totalTags, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.tag.count(),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { tags: { include: { tag: true } } },
    }),
  ]);

  const stats = [
    { label: "Total artículos", value: totalPosts, icon: FileText, color: "bg-blue-500", href: "/admin/posts" },
    { label: "Publicados", value: publishedPosts, icon: TrendingUp, color: "bg-green-500", href: "/admin/posts?published=true" },
    { label: "Total visitas", value: totalViews._sum.views ?? 0, icon: Eye, color: "bg-purple-500", href: "/admin/posts" },
    { label: "Etiquetas", value: totalTags, icon: Tag, color: "bg-orange-500", href: "/admin/tags" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Resumen de tu blog</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div className={`${stat.color} w-10 h-10 rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">Artículos recientes</h2>
            <Link href="/admin/posts/new" className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              + Nuevo
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentPosts.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p>No hay artículos aún.</p>
                <Link href="/admin/posts/new" className="text-indigo-600 hover:underline mt-2 inline-block text-sm">
                  Crear el primero →
                </Link>
              </div>
            ) : (
              recentPosts.map((post) => (
                <div key={post.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/posts/${post.id}`} className="font-medium text-gray-900 hover:text-indigo-600 text-sm line-clamp-1">
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(post.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${post.published ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {post.published ? "Publicado" : "Borrador"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Eye className="w-3 h-3" /> {post.views}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Acciones rápidas</h2>
          <div className="space-y-3">
            <Link href="/admin/posts/new" className="flex items-center gap-3 p-3 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors text-sm font-medium">
              <FileText className="w-4 h-4" /> Nuevo artículo
            </Link>
            <Link href="/admin/tags" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
              <Tag className="w-4 h-4" /> Gestionar etiquetas
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
              <TrendingUp className="w-4 h-4" /> Configuración
            </Link>
            <Link href="/" target="_blank" className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
              <Eye className="w-4 h-4" /> Ver blog público
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
