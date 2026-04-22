"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import type { SiteSettings } from "@/generated/prisma/client";

export function SettingsForm({ initialSettings }: { initialSettings: SiteSettings }) {
  const [form, setForm] = useState(initialSettings);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function handleChange(key: keyof SiteSettings, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      setError("Error al guardar");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Configuración del blog</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">General</h2>
          <Field label="Nombre del blog" value={form.title} onChange={(v) => handleChange("title", v)} />
          <Field label="Descripción" value={form.description} onChange={(v) => handleChange("description", v)} textarea />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Autor</h2>
          <Field label="Nombre del autor" value={form.authorName} onChange={(v) => handleChange("authorName", v)} />
          <Field label="Bio" value={form.authorBio} onChange={(v) => handleChange("authorBio", v)} textarea />
          <Field label="URL de foto" value={form.authorImage} onChange={(v) => handleChange("authorImage", v)} placeholder="https://..." />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="font-semibold text-gray-900">Redes sociales</h2>
          <Field label="Twitter/X" value={form.twitterUrl} onChange={(v) => handleChange("twitterUrl", v)} placeholder="https://twitter.com/..." />
          <Field label="GitHub" value={form.githubUrl} onChange={(v) => handleChange("githubUrl", v)} placeholder="https://github.com/..." />
          <Field label="LinkedIn" value={form.linkedinUrl} onChange={(v) => handleChange("linkedinUrl", v)} placeholder="https://linkedin.com/in/..." />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar cambios
          </button>
          {saved && <p className="text-sm text-green-600">✓ Guardado correctamente</p>}
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const cls = "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}
