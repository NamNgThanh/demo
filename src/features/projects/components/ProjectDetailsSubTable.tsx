"use client";

import { Project, ProjectDetail } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { ProjectItemDetailDialog } from "./ProjectItemDetailDialog";
import { UpdateProjectDetailDialog } from "./UpdateProjectDetailDialog";
import { deleteProjectDetail } from "../action";
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

interface ProjectDetailsSubTableProps {
  project: Project;
}

export function ProjectDetailsSubTable({ project }: ProjectDetailsSubTableProps) {
  const details = project.DS_DU_AN_CT;
  const [selectedDetail, setSelectedDetail] = useState<ProjectDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const res = await deleteProjectDetail(deleteId);
      if (res.success) {
        toast.success("Xoá thành công!");
      } else {
        toast.error(res.error || "Có lỗi xảy ra");
      }
      setDeleteId(null);
    });
  };

  if (!details || details.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 italic">
        Không có chi tiết dự án.
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50/80 border-t border-b border-slate-100 shadow-inner w-full">
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-100/50">
            <TableRow>
              <TableHead className="w-[120px] font-semibold text-slate-700">Mã Chi Tiết</TableHead>
              <TableHead className="font-semibold text-slate-700">Tên Dự Án CT</TableHead>
              <TableHead className="font-semibold text-slate-700">Hạng Mục & Tỷ Trọng</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Phân Bổ</TableHead>
              <TableHead className="font-semibold text-slate-700">Deadline</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Treo Thưởng</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Tiến Độ</TableHead>
              <TableHead className="font-semibold text-slate-700">Tình Trạng</TableHead>
              <TableHead className="w-[120px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((detail) => (
              <TableRow key={detail.ID_DU_AN_CT} className="hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-600">{detail.ID_DU_AN_CT}</TableCell>
                <TableCell className="font-medium text-slate-900">{detail.TEN_DU_AN_CT}</TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="text-slate-700 truncate" title={detail.DS_HANG_MUC}>{detail.DS_HANG_MUC}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Tỷ trọng: {detail.TY_TRONG}%</div>
                </TableCell>
                <TableCell className="text-right">{detail.PHAN_BO}</TableCell>
                <TableCell>{detail.DEADLINE ? new Date(detail.DEADLINE).toLocaleDateString("vi-VN") : ""}</TableCell>
                <TableCell className="text-right font-medium text-green-600">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(detail.TREO_THUONG_SO_TIEN || 0)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs font-medium">{detail.THUC_TE}%</span>
                    <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-400 rounded-full" 
                        style={{ width: `${detail.THUC_TE}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50">
                    {detail.TINH_TRANG}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1 justify-end">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full"
                      title="Cập nhật tổng hợp thông tin"
                      onClick={() => {
                        setSelectedDetail(detail);
                        setIsUpdateOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
                      title="Xem chi tiết"
                      onClick={() => {
                        setSelectedDetail(detail);
                        setIsDetailOpen(true);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full ml-1"
                      title="Xoá chi tiết"
                      onClick={() => setDeleteId(detail.ID_DU_AN_CT)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProjectItemDetailDialog 
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        item={selectedDetail}
      />

      <UpdateProjectDetailDialog
        open={isUpdateOpen}
        onOpenChange={setIsUpdateOpen}
        item={selectedDetail}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xoá chi tiết hạng mục dự án này? Thao tác này không thể hoàn tác.
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
              {isPending ? "Đang xoá..." : "Xoá"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
