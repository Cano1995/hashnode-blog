import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye, Clock, Pencil, Plus } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { DeletePostButton } from "./DeletePostButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ published?: string; page?: string }>;
}) {
  const { published, page: pageStr } = await searchParams;
  const page = parseInt(pageStr ?? "1");
  const limit = 15;
  const skip = (page - 1) * limit;

  const where = published ? { published: published === "true" } : {};

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { tags: { include: { tag: true } } },
    }),
    prisma.post.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Artículos</h1>
          <p className="text-gray-500 text-sm mt-1">{total} artículos en total</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo artículo
        </Link>
      </div>

      <div className="flex gap-2 mb-6">
        {[
          { label: "Todos", value: undefined },
          { label: "Publicados", value: "true" },
          { label: "Borradores", value: "false" },
        ].map((filter) => (
          <Link
            key={filter.label}
            href={filter.value ? `/admin/posts?published=${filter.value}` : "/admin/posts"}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              published === filter.value
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {filter.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No hay artículos</p>
            <Link href="/admin/posts/new" className="text-indigo-600 hover:underline text-sm">
              Crear el primero →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Visitas</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm line-clamp-1">{post.title}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.tags.slice(0, 3).map(({ tag }) => (
                            <span key={tag.id} className="px-1.5 py-0.5 text-xs rounded" style={{ backgroundColor: `${tag.color}1a`, color: tag.color }}>
                              #{tag.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {post.published ? "Publicado" : "Borrador"}
                      </span>
                      {post.featured && (
                        <span className="ml-1 px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">Destacado</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Eye className="w-3.5 h-3.5" /> {post.views}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1 text-sm text-gray-500">
                        <Clock className="w-3.5 h-3.5" /> {formatDate(post.createdAt)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {post.published && (
                          <Link href={`/${post.slug}`} target="_blank" className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="Ver artículo">
                            <Eye className="w-4 h-4" />
                          </Link>
                        )}
                        <Link href={`/admin/posts/${post.id}`} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeletePostButton postId={post.id} postTitle={post.title} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          {page > 1 && (
            <Link href={`/admin/posts?page=${page - 1}${published ? `&published=${published}` : ""}`} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              ← Anterior
            </Link>
          )}
          <span className="px-4 py-2 text-sm text-gray-600">{page} / {totalPages}</span>
          {page < totalPages && (
            <Link href={`/admin/posts?page=${page + 1}${published ? `&published=${published}` : ""}`} className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Siguiente →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
