import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminSidebar } from "@/components/admin/Sidebar";
import { SessionProvider } from "next-auth/react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session) redirect("/admin/login");

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
