"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import type { Tag } from "@/generated/prisma/client";

type TagWithCount = Tag & { _count: { posts: number } };

const TAG_COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#0ea5e9", "#64748b",
];

export function TagManager({ initialTags }: { initialTags: TagWithCount[] }) {
  const router = useRouter();
  const [tags, setTags] = useState(initialTags);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(TAG_COLORS[0]);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setError("");
    setCreating(true);

    const res = await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim(), color: newColor }),
    });

    setCreating(false);
    if (!res.ok) {
      const data = await res.json();
      return setError(data.error ?? "Error al crear etiqueta");
    }

    setNewName("");
    router.refresh();
    const fresh = await fetch("/api/tags").then((r) => r.json());
    setTags(fresh);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Eliminar etiqueta "${name}"?`)) return;
    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    router.refresh();
    setTags((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Etiquetas</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Nueva etiqueta</h2>
        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
        <form onSubmit={handleCreate} className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">Nombre</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Ej: JavaScript"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
            <div className="flex gap-1.5">
              {TAG_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewColor(color)}
                  className="w-6 h-6 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: newColor === color ? "#1e1b4b" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={creating || !newName.trim()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            Crear
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {tags.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Sin etiquetas aún</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {tags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: tag.color }}>
                    #
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{tag.name}</p>
                    <p className="text-xs text-gray-400">{tag._count.posts} artículos · /{tag.slug}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(tag.id, tag.name)}
                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
