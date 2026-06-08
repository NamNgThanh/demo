import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { ActionsCell } from "./ActionCell";
// Lables that are not dynamic
import { EmployeePublic } from "../action";
import { UserCheck, UserX } from "lucide-react";

export const getColumns = (
  onOpenDetail: (employee: EmployeePublic) => void,
): ColumnDef<EmployeePublic>[] => [
    {
      id: "code",
      accessorFn: (row) => row.MA_NV,
      header: "Mã NV",
      cell: ({ row }) => (
        <div className="flex">
          <Badge variant="outline" className="font-mono">
            {row.original.MA_NV}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: "info",
      enableSorting: false,
      header: "Nhân viên",
      cell: ({ row }) => {
        const employee = row.original;
        const initials = employee.HO_VA_TEN
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);

        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={employee.HINH_ANH || undefined} alt={employee.HO_VA_TEN} />
              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium text-sm text-slate-900">{employee.HO_VA_TEN}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      enableSorting: false,
      header: "SĐT",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm text-slate-900">
            {row.original.SO_DIEN_THOAI || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "NGUOI_DUNG",
      header: "Tài khoản",
      cell: ({ row }) => {
        const username = row.original.NGUOI_DUNG?.TAI_KHOAN;
        return (
          <div className="flex">
            {username ? (
              <Badge
                variant="outline"
                className="gap-1 bg-emerald-50 text-emerald-800 border-emerald-200 font-mono text-xs"
              >
                <UserCheck className="h-3 w-3" />
                {username}
              </Badge>
            ) : (
              <Badge variant="outline" className="gap-1 text-slate-500 border-slate-200 bg-slate-50">
                <UserX className="h-3 w-3" />
                Chưa cấp
              </Badge>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      enableSorting: false,
      header: "Email",
      cell: ({ row }) => (
        <div className="flex flex-col">
          <span className="text-sm text-slate-900">
            {row.original.EMAIL || 'N/A'}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "CHUC_VU",
      enableSorting: false,
      header: "Chức vụ",
      cell: ({ row }) => {
        const chucVu = row.original.CHUC_VU;
        return (
          <div className="flex">
            <span className="text-sm text-slate-700">
              {chucVu || "—"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "PHONGBAN",
      header: "Phòng ban",
      cell: ({ row }) => {
        const phongBan = row.original.PHONGBAN;
        return (
          <div className="flex">
            <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200">
              {phongBan || "—"}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "joinDate",
      accessorFn: (row) => row.NGAY_CHINH_THUC ? new Date(row.NGAY_CHINH_THUC).getTime() : (row.NGAY_THU_VIEC ? new Date(row.NGAY_THU_VIEC).getTime() : 0),
      header: "Ngày vào làm",
      cell: ({ row }) => (
        <div className="flex">
          <span className="text-sm text-slate-700">
            {row.original.NGAY_CHINH_THUC ? formatDate(row.original.NGAY_CHINH_THUC) : row.original.NGAY_THU_VIEC ? formatDate(row.original.NGAY_THU_VIEC) : 'N/A'}
          </span>
        </div>
      ),
    },
    {
      id: "type",
      accessorFn: (row) => row.HINH_THUC,
      header: "Hình thức làm việc",
      cell: ({ row }) => {
        const type = row.original.HINH_THUC;
        const config: Record<string, { label: string; className: string }> = {
          TOAN_THOI_GIAN: {
            label: "Toàn thời gian",
            className: "bg-green-100 text-green-700 border-green-200"
          },
          BAN_THOI_GIAN: {
            label: "Bán thời gian",
            className: "bg-blue-100 text-blue-700 border-blue-200"
          },
          THU_VIEC: {
            label: "Thực tập",
            className: "bg-purple-100 text-purple-700 border-purple-200"
          },
        };

        const defaultConfig = {
          label: type,
          className: "bg-gray-100 text-gray-700 border-gray-200"
        };

        return (
          <div className="flex">
            <Badge variant="outline" className={(config[type] || defaultConfig).className}>
              {(config[type] || defaultConfig).label}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "status",
      accessorFn: (row) => row.TRANG_THAI,
      header: "Trạng thái",
      cell: ({ row }) => {
        const status = row.original.TRANG_THAI;
        const config: Record<string, { label: string; className: string }> = {
          DANG_LAM_VIEC: {
            label: "Đang làm việc",
            className: "bg-green-100 text-green-700 border-green-200"
          },
          THU_VIEC: {
            label: "Đang thử việc",
            className: "bg-yellow-100 text-yellow-700 border-yellow-200"
          },
          NGHI_VIEC: {
            label: "Đã nghỉ",
            className: "bg-gray-100 text-gray-700 border-gray-200"
          },
        };

        const defaultConfig = {
          label: status,
          className: "bg-gray-100 text-gray-700 border-gray-200"
        };

        return (
          <div className="flex">
          <Badge variant="outline" className={(config[status] || defaultConfig).className}>
            {(config[status] || defaultConfig).label}
          </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      enableSorting: false,
      cell: ({ row }) => (
        <ActionsCell employee={row.original} onOpenDetail={onOpenDetail} />
      ),
    },
  ];