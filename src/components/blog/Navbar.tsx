"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

const NAV_LINKS = [
  { href: "/", label: "Artículos" },
  { href: "/tags", label: "Etiquetas" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
  return (
    <Link
      href={href}
      className="relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
      style={{
        color: active ? "var(--c-text)" : "var(--c-muted)",
        background: active ? "var(--c-surface)" : "transparent",
      }}
    >
      {label}
    </Link>
  );
}

export function Navbar({ siteName = "Blog" }: { siteName?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/?search=${encodeURIComponent(q)}`);
    setQuery("");
    inputRef.current?.blur();
  }

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--c-bg)",
        borderBottom: "1px solid var(--c-border)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="flex items-center h-14 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 mr-2">
            <Image src="/icon.png" alt={siteName} width={28} height={28} className="rounded-md dark:invert" />
            <span className="font-semibold text-[15px] hidden sm:block" style={{ color: "var(--c-text)" }}>
              {siteName}
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => <NavLink key={l.href} {...l} />)}
          </nav>

          <div className="flex-1" />

          {/* Desktop search */}
          <form onSubmit={handleSearch} className="hidden md:block">
            <div
              className="flex items-center gap-2 px-3 h-8 rounded-md text-sm transition-all w-48 focus-within:w-64"
              style={{
                background: "var(--c-surface)",
                border: `1px solid ${searchFocused ? "var(--c-primary)" : "var(--c-border)"}`,
                color: "var(--c-muted)",
              }}
            >
              <Search className="w-3.5 h-3.5 shrink-0" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Buscar..."
                className="flex-1 bg-transparent outline-none text-sm min-w-0"
                style={{ color: "var(--c-text)" }}
              />
            </div>
          </form>

          <ThemeToggle />

          {/* Mobile menu button */}
          <button
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-md"
            style={{ color: "var(--c-muted)", border: "1px solid var(--c-border)", background: "var(--c-surface)" }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 pt-2 space-y-1" style={{ borderTop: "1px solid var(--c-border)" }}>
            <form onSubmit={handleSearch} className="mb-3">
              <div
                className="flex items-center gap-2 px-3 h-9 rounded-md"
                style={{ background: "var(--c-surface)", border: "1px solid var(--c-border)" }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: "var(--c-muted)" }} />
                <input
                  type="search"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Buscar artículos..."
                  className="flex-1 bg-transparent outline-none text-sm"
                  style={{ color: "var(--c-text)" }}
                />
              </div>
            </form>
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-md text-sm font-medium"
                style={{ color: "var(--c-muted)" }}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
