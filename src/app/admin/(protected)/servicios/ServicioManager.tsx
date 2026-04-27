"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

type Service = {
  id: string; name: string; description: string; details: string | null;
  priceLabel: string | null; icon: string | null; contactUrl: string | null;
  active: boolean; featured: boolean; order: number;
};

const EMPTY: Omit<Service, "id"> = {
  name: "", description: "", details: "", priceLabel: "", icon: "",
  contactUrl: "", active: true, featured: false, order: 0,
};

export function ServicioManager({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function openNew() {
    setEditing(null); setForm(EMPTY); setIsNew(true); setError("");
  }

  function openEdit(s: Service) {
    setEditing(s);
    setForm({ ...s, details: s.details ?? "", priceLabel: s.priceLabel ?? "", icon: s.icon ?? "", contactUrl: s.contactUrl ?? "" });
    setIsNew(false); setError("");
  }

  function closeForm() { setEditing(null); setIsNew(false); setError(""); }

  function field(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));
  }

  async function handleSave() {
    if (!form.name.trim() || !form.description.trim()) {
      setError("Nombre y descripción son obligatorios.");
      return;
    }
    setSaving(true); setError("");
    try {
      const url = editing ? `/api/servicios/${editing.id}` : "/api/servicios";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
      });
      if (!res.ok) { const d = await res.json(); setError(d.error ?? "Error al guardar."); return; }
      const saved: Service = await res.json();
      setServices((prev) =>
        editing ? prev.map((s) => (s.id === saved.id ? saved : s)) : [saved, ...prev]
      );
      closeForm();
    } catch { setError("Error de conexión."); }
    finally { setSaving(false); }
  }

  async function handleDelete(s: Service) {
    if (!confirm(`¿Eliminar "${s.name}"?`)) return;
    const res = await fetch(`/api/servicios/${s.id}`, { method: "DELETE" });
    if (res.ok) setServices((prev) => prev.filter((x) => x.id !== s.id));
  }

  const showForm = isNew || editing !== null;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servicios de consultoría</h1>
          <p className="text-gray-500 text-sm mt-1">
            {services.length} servicio{services.length !== 1 ? "s" : ""} configurado{services.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Nuevo servicio
        </button>
      </div>

      {/* Aviso sobre defaults */}
      {services.length === 0 && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-700 text-sm">
          La página <strong>/servicios</strong> muestra servicios de ejemplo hasta que agregues los tuyos aquí.
        </div>
      )}

      {/* Form panel */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">
            {editing ? "Editar servicio" : "Nuevo servicio"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Nombre del servicio *">
              <input value={form.name} onChange={field("name")} placeholder="Migración Oracle Forms → APEX" className={inp()} />
            </Field>
            <Field label="Ícono (emoji)">
              <input value={form.icon ?? ""} onChange={field("icon")} placeholder="🔄" className={inp()} />
            </Field>
            <Field label="Precio / rango">
              <input value={form.priceLabel ?? ""} onChange={field("priceLabel")} placeholder="Desde USD 500 · A consultar" className={inp()} />
            </Field>
            <Field label="URL de contacto (LinkedIn, WhatsApp, email…)">
              <input value={form.contactUrl ?? ""} onChange={field("contactUrl")} placeholder="https://wa.me/..." className={inp()} />
            </Field>
            <Field label="Descripción corta * (se muestra en la tarjeta)" className="md:col-span-2">
              <textarea value={form.description} onChange={field("description")} rows={2}
                placeholder="Transformo tus aplicaciones Oracle Forms a Oracle APEX moderno…" className={inp()} />
            </Field>
            <Field label="Detalles adicionales (opcional — se muestra bajo la descripción)" className="md:col-span-2">
              <textarea value={form.details ?? ""} onChange={field("details")} rows={2}
                placeholder="Análisis, diseño de arquitectura, migración de triggers PL/SQL…" className={inp()} />
            </Field>
            <Field label="Orden de aparición">
              <input type="number" value={form.order} onChange={field("order")} className={inp()} />
            </Field>
            <div className="flex items-center gap-6 pt-6">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={field("featured")} className="rounded" />
                Servicio popular / destacado
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
              {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear servicio"}
            </button>
            <button onClick={closeForm} className="px-5 py-2 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Lista */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {services.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-gray-400 mb-4">No hay servicios configurados.</p>
            <button onClick={openNew} className="text-indigo-600 hover:underline text-sm">Agregar el primero →</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Servicio</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Precio</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Estado</th>
                  <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {services.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {s.icon && <span className="text-lg">{s.icon}</span>}
                        {s.featured && <Star className="w-3.5 h-3.5 text-indigo-500 shrink-0" />}
                        <div>
                          <p className="font-medium text-sm text-gray-900">{s.name}</p>
                          <p className="text-xs text-gray-400 line-clamp-1">{s.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{s.priceLabel || "—"}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${s.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {s.active ? "Activo" : "Oculto"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 text-gray-400 hover:text-indigo-600 transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(s)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors" title="Eliminar">
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

function inp() {
  return "w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500";
}
