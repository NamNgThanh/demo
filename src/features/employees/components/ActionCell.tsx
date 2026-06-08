"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { EmployeePublic } from "../action";
import { Pencil, Trash2, UserMinus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { deleteEmployee, terminateEmployee } from "../action";

export const ActionsCell = ({
  employee,
  onOpenDetail,
}: {
  employee: EmployeePublic,
  onOpenDetail: (employee: EmployeePublic) => void,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteEmployee(employee.MA_NV);

      if (result.success) {
        toast.success("Xóa nhân viên thành công");
      } else {
        toast.error("Có lỗi xảy ra khi xóa nhân viên");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleTerminate = async () => {
    setIsTerminating(true);
    try {
      const result = await terminateEmployee(employee.MA_NV);

      if (result.success) {
        toast.success("Đã chuyển trạng thái nhân viên thành Nghỉ việc");
      } else {
        toast.error("Có lỗi xảy ra khi cho thôi việc");
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsTerminating(false);
      setShowTerminateDialog(false);
    }
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="flex items-center justify-center gap-1">
        {employee.TRANG_THAI !== "NGHI_VIEC" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-slate-600 hover:text-slate-600 hover:bg-slate-100"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenDetail(employee);
                }}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thay đổi thông tin</p>
            </TooltipContent>
          </Tooltip>
        )}

        {employee.TRANG_THAI !== "NGHI_VIEC" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-orange-500 hover:text-orange-500 hover:bg-orange-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTerminateDialog(true);
                }}
              >
                <UserMinus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Cho thôi việc</p>
            </TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full text-red-500 hover:text-red-500 hover:bg-red-50"
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteDialog(true);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xóa nhân viên</p>
          </TooltipContent>
        </Tooltip>

      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhân viên</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa nhân viên <strong>{employee.HO_VA_TEN}</strong> (Mã: {employee.MA_NV})?
              <br />
              <span className="text-destructive font-medium">Hành động này không thể hoàn tác.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showTerminateDialog} onOpenChange={setShowTerminateDialog}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cho thôi việc</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn cho nhân viên <strong>{employee.HO_VA_TEN}</strong> (Mã: {employee.MA_NV}) nghỉ việc?
              <br />
              Trạng thái của nhân viên sẽ được chuyển sang <span className="text-orange-500 font-medium">Đã nghỉ việc</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTerminating}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleTerminate}
              disabled={isTerminating}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {isTerminating ? "Đang xử lý..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}