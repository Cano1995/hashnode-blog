"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";

export function DeletePostButton({ postId, postTitle }: { postId: string; postTitle: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`¿Eliminar "${postTitle}"?`)) return;
    setLoading(true);
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="p-1.5 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Eliminar"
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
