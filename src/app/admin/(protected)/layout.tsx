import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { SessionProvider } from "next-auth/react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const hasSession =
    cookieStore.has("__Secure-authjs.session-token") ||
    cookieStore.has("authjs.session-token");

  if (!hasSession) redirect("/admin/login");

  return (
    <SessionProvider>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <div className="flex-1 bg-gray-50 overflow-auto">
          {children}
        </div>
      </div>
    </SessionProvider>
  );
}
