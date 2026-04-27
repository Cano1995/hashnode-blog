"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "./Editor";
import { Loader2, Save, Eye, RotateCcw } from "lucide-react";
import type { Post, Tag } from "@/generated/prisma/client";

interface PostFormProps {
  post?: Post & { tags: { tag: Tag }[] };
  allTags: Tag[];
}

interface DraftData {
  title: string;
  content: string;
  excerpt: string;
  coverImage: string;
  savedAt: number;
}

export function PostForm({ post, allTags }: PostFormProps) {
  const router = useRouter();
  const draftKey = `draft-${post?.id ?? "new"}`;

  const [title, setTitle] = useState(post?.title ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(post?.coverImage ?? "");
  const [published, setPublished] = useState(post?.published ?? false);
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags.map((t) => t.tag.id) ?? []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [draftBanner, setDraftBanner] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft: DraftData = JSON.parse(raw);
      const hasChanges =
        draft.title !== (post?.title ?? "") ||
        draft.content !== (post?.content ?? "");
      if (hasChanges) setDraftBanner(true);
    } catch {}
  }, []);

  // Auto-save to localStorage with 3s debounce
  useEffect(() => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => {
      try {
        const draft: DraftData = {
          title,
          content,
          excerpt,
          coverImage,
          savedAt: Date.now(),
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
        setLastSaved(new Date().toLocaleTimeString());
      } catch {}
    }, 3000);
    return () => {
      if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    };
  }, [title, content, excerpt, coverImage]);

  function restoreDraft() {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft: DraftData = JSON.parse(raw);
      setTitle(draft.title);
      setContent(draft.content);
      setExcerpt(draft.excerpt);
      setCoverImage(draft.coverImage);
    } catch {}
    setDraftBanner(false);
  }

  function dismissDraft() {
    localStorage.removeItem(draftKey);
    setDraftBanner(false);
  }

  function toggleTag(tagId: string) {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  }

  async function handleSave(publishNow?: boolean) {
    if (!title.trim()) return setError("El título es requerido");
    if (!content.trim()) return setError("El contenido es requerido");
    setError("");
    setSaving(true);

    const body = {
      title,
      content,
      excerpt,
      coverImage: coverImage || null,
      published: publishNow !== undefined ? publishNow : published,
      featured,
      tagIds: selectedTags,
    };

    const url = post ? `/api/posts/${post.id}` : "/api/posts";
    const method = post ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      return setError(data.error ?? "Error al guardar");
    }

    localStorage.removeItem(draftKey);
    router.push("/admin/posts");
    router.refresh();
  }

  return (
    <div className="flex flex-col h-full">
      {draftBanner && (
        <div className="flex items-center justify-between px-6 py-2 bg-amber-50 border-b border-amber-200 text-sm text-amber-800">
          <span>Hay un borrador guardado localmente. ¿Deseas restaurarlo?</span>
          <div className="flex gap-3">
            <button onClick={restoreDraft} className="flex items-center gap-1 font-medium hover:underline">
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar
            </button>
            <button onClick={dismissDraft} className="text-amber-600 hover:underline">Descartar</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
        <div>
          <h1 className="text-xl font-bold text-gray-900">{post ? "Editar artículo" : "Nuevo artículo"}</h1>
          {lastSaved && (
            <p className="text-xs text-gray-400 mt-0.5">Borrador local guardado a las {lastSaved}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar borrador
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
            {published ? "Guardar y publicar" : "Publicar"}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Título del artículo..."
                className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none outline-none placeholder-gray-300 resize-none"
              />
            </div>

            {coverImage && (
              <div className="relative h-48 rounded-xl overflow-hidden bg-gray-100">
                <img src={coverImage} alt="Cover" className="w-full h-full object-cover" />
              </div>
            )}

            <Editor key={content !== post?.content ? "restored" : "original"} content={content} onChange={setContent} />
          </div>
        </div>

        <div className="w-72 border-l border-gray-200 bg-white overflow-y-auto p-5 space-y-6 shrink-0">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Estado</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm text-gray-700">Publicado</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded"
                />
                <span className="text-sm text-gray-700">Destacado</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Imagen de portada</label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Extracto</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Descripción corta del artículo..."
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Etiquetas</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className="px-2.5 py-1 text-xs rounded-full font-medium transition-all border"
                  style={
                    selectedTags.includes(tag.id)
                      ? { backgroundColor: tag.color, color: "white", borderColor: tag.color }
                      : { backgroundColor: `${tag.color}1a`, color: tag.color, borderColor: `${tag.color}40` }
                  }
                >
                  #{tag.name}
                </button>
              ))}
              {allTags.length === 0 && (
                <p className="text-xs text-gray-400">
                  <a href="/admin/tags" className="text-indigo-600 hover:underline">Crear etiquetas →</a>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
