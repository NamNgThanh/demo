import { DashboardExplorer } from "@/features/dashboard/components/DashboardExplorer";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-orange-50/30 to-amber-50/30 pb-20 p-4 sm:p-6 lg:p-8 relative">
      
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.02)_1px,transparent_0)] bg-size-[32px_32px]"></div>
      </div>

      <DashboardExplorer />
      
    </div>
  );
}