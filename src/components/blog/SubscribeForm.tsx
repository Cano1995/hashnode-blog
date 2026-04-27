"use client";

import { useState } from "react";
import { Mail, Loader2, CheckCircle } from "lucide-react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "Revisa tu correo para confirmar.");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Ocurrió un error. Intenta de nuevo.");
      }
    } catch {
      setStatus("error");
      setMessage("Ocurrió un error. Intenta de nuevo.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-3 text-sm" style={{ color: "var(--c-muted)" }}>
        <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full max-w-sm">
      <div className="relative flex-1">
        <label htmlFor="subscribe-email" className="sr-only">Tu correo electrónico</label>
        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--c-subtle)" }} />
        <input
          id="subscribe-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="tu@correo.com"
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500"
          style={{
            background: "var(--c-bg)",
            borderColor: "var(--c-border)",
            color: "var(--c-text)",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors shrink-0"
      >
        {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : "Suscribirme"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-500 sm:col-span-2">{message}</p>
      )}
    </form>
  );
}
