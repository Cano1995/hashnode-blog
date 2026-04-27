"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, ExternalLink, Star, Eye, EyeOff } from "lucide-react";

type Product = {
  id: string; name: string; description: string; imageUrl: string | null;
  affiliateUrl: string; price: string | null; platform: string;
  category: string | null; active: boolean; featured: boolean; order: number;
};

const EMPTY: Omit<Product, "id"> = {
  name: "", description: "", imageUrl: "", affiliateUrl: "", price: "",
  platform: "Udemy", category: "", active: true, featured: false, order: 0,
};

export function ProductoManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openNew() {
    setEditing(null);
    setForm(EMPTY);
    setIsNew(true);
    setError("");
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({ ...p, imageUrl: p.imageUrl ?? "", price: p.price ?? "", category: p.category ?? "" });
    setIsNew(false);
    setError("");
  }

  function closeForm() { setEditing(null); setIsNew(false); setError(""); }

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.description.trim() || !form.affiliateUrl.trim()) {
      setError("Nombre, descripción y URL de afiliado son obligatorios.");
      return;
    }
    setSaving(true); setError("");
    try {
      const url = editing ? `/api/productos/${editing.id}` : "/api/productos";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error al guardar."); return; }
      const saved: Product = await res.json();
      setProducts((prev) =>
        editing ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev]
      );
      closeForm();
    } catch { setError("Error de conexión."); }
    finally { setSaving(false); }
  }

  async function handleDelete(p: Product) {
    if (!confirm(`¿Eliminar "${p.name}"?`)) return;
    const res = await fetch(`/api/productos/${p.id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((x) => x.id !== p.id));
  }

  const showForm = isNew || editing !== null;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos / Cursos</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} productos cargados</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo producto
        </button>
      </div>

      {/* Form panel */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            {editing ? "Editar producto" : "Nuevo producto"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nombre del curso *">
              <input value={form.name} onChange={field("name")} placeholder="Oracle APEX desde cero" className={input()} />
            </Field>
            <Field label="Plataforma">
              <select value={form.platform} onChange={field("platform")} className={input()}>
                {["Udemy", "Coursera", "YouTube", "Propio", "Otra"].map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </Field>
            <Field label="URL de afiliado *">
              <input value={form.affiliateUrl} onChange={field("affiliateUrl")} placeholder="https://udemy.com/...?ref=..." className={input()} />
            </Field>
            <Field label="Precio (ej: USD 12.99 o Gratis)">
              <input value={form.price ?? ""} onChange={field("price")} placeholder="USD 12.99" className={input()} />
            </Field>
            <Field label="URL de imagen de portada">
              <input value={form.imageUrl ?? ""} onChange={field("imageUrl")} placeholder="https://..." className={input()} />
            </Field>
            <Field label="Categoría (ej: apex, sql, plsql)">
              <input value={form.category ?? ""} onChange={field("category")} placeholder="apex" className={input()} />
            </Field>
            <Field label="Descripción *" className="md:col-span-2">
              <textarea value={form.description} onChange={field("description")} rows={3}
                placeholder="Descripción breve del curso que verá el visitante..." className={input()} />
            </Field>
            <Field label="Orden de aparición">
              <input type="number" value={form.order} onChange={field("order")} className={input()} />
            </Field>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={field("featured")} className="rounded" />
                Destacado
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={field("active")} className="rounded" />
                Activo / visible
              </label>
            </div>
          </div>

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

          <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
            <button onClick={handleSave} disabled={saving}
              className="px-5 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors">
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear producto"}
            </button>
            <button onClick={closeForm} className="px-5 py-2 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {products.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No hay productos aún.</p>
            <button onClick={openNew} className="text-indigo-600 hover:underline text-sm">Agregar el primero →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Producto</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Plataforma</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {p.featured && <Star className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                        <div>
                          <p className="font-medium text-sm text-gray-900 line-clamp-1">{p.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{p.platform}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{p.price || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {p.active ? "Activo" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <a href={p.affiliateUrl} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="Ver enlace">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button onClick={() => openEdit(p)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(p)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-gray-400">
        Los links de afiliados se publican con <code>rel=&quot;sponsored&quot;</code> según las directrices de Google.
      </p>
    </div>
  );
}

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

function input() {
  return "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";
}
