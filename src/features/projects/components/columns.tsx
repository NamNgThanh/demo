"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Project } from "../types";
import { ChevronDown, ChevronRight, FolderKanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const columns: ColumnDef<Project>[] = [
  {
    id: "expander",
    header: () => null,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              row.toggleExpanded();
            }}
          >
            {row.getIsExpanded() ? (
              <ChevronDown className="h-5 w-5 text-blue-600" />
            ) : (
              <ChevronRight className="h-5 w-5 text-slate-400" />
            )}
          </Button>
        </div>
      );
    },
  },
  {
    accessorKey: "ID_DU_AN",
    header: "Mã Dự Án",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FolderKanban className="h-4 w-4 text-slate-400" />
        <span className="font-semibold text-slate-700">{row.original.ID_DU_AN}</span>
      </div>
    ),
  },
  {
    accessorKey: "NHOM_DU_AN",
    header: "Nhóm Dự Án",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.NHOM_DU_AN.map((n: any, i: number) => (
          <Badge key={i} variant="outline" className="text-xs bg-slate-50">{n.NHOM_DU_AN}</Badge>
        ))}
      </div>
    )
  },
  {
    accessorKey: "LOAI_DU_AN",
    header: "Loại Dự Án",
    cell: ({ row }) => row.original.LOAI_DU_AN?.LOAI_DU_AN || ""
  },
  {
    accessorKey: "DOI_TAC",
    header: "Đối Tác",
  },
  {
    accessorKey: "NGAY_DK_BAT_DAU",
    header: "Bắt đầu",
    cell: ({ row }) => new Date(row.original.NGAY_DK_BAT_DAU).toLocaleDateString("vi-VN")
  },
  {
    accessorKey: "NGAY_DK_HOAN_THANH",
    header: "Hoàn thành",
    cell: ({ row }) => new Date(row.original.NGAY_DK_HOAN_THANH).toLocaleDateString("vi-VN")
  },
  {
    accessorKey: "THUC_TE",
    header: "Thực tế",
    cell: ({ row }) => <span className="text-sm truncate max-w-[100px] block" title={row.original.THUC_TE || ""}>{row.original.THUC_TE || "-"}</span>
  },
  {
    id: "TINH_TRANG",
    header: "Tình trạng",
    cell: ({ row }) => {
      // Tạm tính dựa trên ngày hoặc số lượng hạng mục hoàn thành (ví dụ logic UI giả lập)
      const isOverdue = new Date() > new Date(row.original.NGAY_DK_HOAN_THANH);
      const status = isOverdue ? "Quá hạn" : "Đang triển khai";
      return (
        <Badge variant={status === "Quá hạn" ? "destructive" : "secondary"}>
          {status}
        </Badge>
      );
    }
  },
];
