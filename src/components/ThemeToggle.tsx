"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  }

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      className="w-8 h-8 flex items-center justify-center rounded-md transition-colors"
      style={{
        color: "var(--c-muted)",
        border: "1px solid var(--c-border)",
        background: "var(--c-surface)",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.color = "var(--c-text)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--c-muted)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.color = "var(--c-muted)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--c-border)";
      }}
    >
      {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
    </button>
  );
}
