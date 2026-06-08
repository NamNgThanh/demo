import { AppSidebar } from "@/components/layouts/Sidebar";
import { AppTaskbar } from "@/components/layouts/Taskbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAdmin = session?.user.role === "ADMIN";

  return (
    <TooltipProvider>
      <SessionProvider session={session}>
        <SidebarProvider>
          <div className="flex min-h-screen w-full">
            <AppSidebar isAdmin={isAdmin} />
            <SidebarInset className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen bg-[#F8FAFC]">
              <AppTaskbar />
              <main className="flex-1 p-4">
                {children}
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </SessionProvider>
    </TooltipProvider>
  );
}