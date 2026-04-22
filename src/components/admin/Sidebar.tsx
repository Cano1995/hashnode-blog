"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Tag,
  Settings,
  LogOut,
  PenSquare,
  Eye,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/posts", label: "Artículos", icon: FileText, exact: false },
  { href: "/admin/tags", label: "Etiquetas", icon: Tag, exact: false },
  { href: "/admin/settings", label: "Configuración", icon: Settings, exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <PenSquare className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg">Blog Admin</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-indigo-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <a
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <Eye className="w-4 h-4" />
          Ver Blog
        </a>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:bg-red-900/30 hover:text-red-400 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
