"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Project } from "../types";
import { ChevronDown, ChevronRight, FolderKanban, Plus, Trash2, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { AddProjectDetailDialog } from "./AddProjectDetailDialog";
import { PrepareFormDialog } from "./PrepareFormDialog";
import { deleteProject } from "../action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ProjectActionCell = ({ project }: { project: Project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      const res = await deleteProject(project.ID_DU_AN);
      if (res.success) {
        toast.success("Xoá dự án thành công!");
      } else {
        toast.error(res.error || "Có lỗi xảy ra");
      }
      setIsDeleteDialogOpen(false);
    });
  };

  return (
    <div className="flex items-center gap-1 justify-end">
      <PrepareFormDialog project={project}>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
          title="Chuẩn bị biểu mẫu"
          onClick={(e) => e.stopPropagation()}
        >
          <ClipboardList className="h-5 w-5" />
        </Button>
      </PrepareFormDialog>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        title="Thêm hạng mục chi tiết"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
      >
        <Plus className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
        title="Xoá dự án"
        onClick={(e) => {
          e.stopPropagation();
          setIsDeleteDialogOpen(true);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AddProjectDetailDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        project={project}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá dự án?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xoá dự án <span className="font-semibold text-slate-800">{project.ID_DU_AN}</span>? 
              Tất cả các hạng mục chi tiết thuộc dự án này cũng sẽ bị xoá vĩnh viễn và không thể khôi phục.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Đang xoá..." : "Xoá Dự Án"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

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
  {
    id: "ACTIONS",
    header: "",
    cell: ({ row }) => <ProjectActionCell project={row.original} />,
  }
];
