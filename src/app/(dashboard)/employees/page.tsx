import { Users } from "lucide-react";
import { PageSectionHeader } from "@/components/layouts/PageSectionHeader";
import { NHAN_VIEN, TRANG_THAI_LAM_VIEC } from "@prisma/client";
import { getAllEmployees } from "@/features/employees/action";
import { EmployeeBoard } from "@/features/employees/components/EmployeeBoard";
import { AddEmployeeButton } from "@/features/employees/components/AddEmployeeButton";
import { auth } from "@/lib/auth";

interface EmployeesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EmployeesPage({ searchParams }: EmployeesPageProps) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";
  const resolvedParams = await searchParams;

  const currentStatus = (resolvedParams.status as TRANG_THAI_LAM_VIEC | "TAT_CA") || "TAT_CA";
  const currentSearch = (typeof resolvedParams.search === 'string' ? resolvedParams.search.toLowerCase() : "");
  const result = await getAllEmployees();

  if (!result.success) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg m-4 border border-red-200">
        <h2 className="font-bold text-lg">Lỗi tải dữ liệu</h2>
        <p>{result.error}</p>
      </div>
    )
  }

  const allEmployees = result.data || [];

  const counts = {
    TAT_CA: allEmployees.filter((e: NHAN_VIEN) => e.TRANG_THAI !== "NGHI_VIEC").length,
    DANG_LAM_VIEC: allEmployees.filter((e: NHAN_VIEN) => e.TRANG_THAI === "DANG_LAM_VIEC").length,
    THU_VIEC: allEmployees.filter((e: NHAN_VIEN) => e.TRANG_THAI === "THU_VIEC").length,
    NGHI_VIEC: allEmployees.filter((e: NHAN_VIEN) => e.TRANG_THAI === "NGHI_VIEC").length,
  };

  const filteredEmployees = allEmployees.filter((e: NHAN_VIEN) => {
    const matchesStatus = currentStatus === "TAT_CA" 
      ? e.TRANG_THAI !== "NGHI_VIEC"
      : e.TRANG_THAI === currentStatus;

    const matchesSearch =
      e.HO_VA_TEN.toLowerCase().includes(currentSearch) ||
      e.EMAIL.toLowerCase().includes(currentSearch) ||
      e.MA_NV.toLowerCase().includes(currentSearch);

    return matchesStatus && matchesSearch;
  })

  return (
    <div className="space-y-3 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <PageSectionHeader
          icon={Users}
          title="Danh sách nhân viên"
          description="Quản lý thông tin nhân viên trong hệ thống"
          iconClassName="w-10 h-10 text-yellow-700"
          titleGradientClassName="from-yellow-900 to-yellow-700"
        />
        {isAdmin && <AddEmployeeButton />}
      </div>

      <EmployeeBoard 
        initialData={filteredEmployees} 
        counts={counts} 
        currentStatus={currentStatus} 
        isAdmin={isAdmin}
      />
    </div>
  );
}