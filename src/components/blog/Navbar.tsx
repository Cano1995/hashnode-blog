"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, PenSquare } from "lucide-react";

export function Navbar({ siteName = "Mi Blog" }: { siteName?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <PenSquare className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">{siteName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Inicio
            </Link>
            <Link href="/tags" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Etiquetas
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              Admin
            </Link>
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            <Link href="/" className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">Inicio</Link>
            <Link href="/tags" className="block px-2 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">Etiquetas</Link>
            <Link href="/admin" className="block px-2 py-2 text-sm font-medium text-indigo-600">Admin</Link>
          </div>
        )}
      </div>
    </header>
  );
}
