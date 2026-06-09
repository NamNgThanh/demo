"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createProjectDetailSchema, CreateProjectDetailInput } from "../schema";
import { createProjectDetail, getProjectDetailFormOptions } from "../action";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Project } from "../types";

interface AddProjectDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}

export function AddProjectDetailDialog({ open, onOpenChange, project }: AddProjectDetailDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [hangMucList, setHangMucList] = useState<any[]>([]);
  const [nhanVienList, setNhanVienList] = useState<any[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  // Auto-select ID_NHOM_DU_AN (Lấy từ phần tử đầu tiên của project mẹ)
  const defaultNhomDuAn = project.NHOM_DU_AN && project.NHOM_DU_AN.length > 0 
    ? project.NHOM_DU_AN[0].ID_NHOM_DU_AN 
    : "";

  const form = useForm<CreateProjectDetailInput>({
    resolver: zodResolver(createProjectDetailSchema),
    defaultValues: {
      ID_DU_AN: project.ID_DU_AN,
      ID_NHOM_DU_AN: defaultNhomDuAn,
      TEN_DU_AN_CT: "",
      ID_HANG_MUC: "",
      PHAN_BO_ID: null,
    },
  });

  useEffect(() => {
    if (open) {
      // Reset form when opened to match parent
      form.reset({
        ID_DU_AN: project.ID_DU_AN,
        ID_NHOM_DU_AN: defaultNhomDuAn,
        TEN_DU_AN_CT: "",
        ID_HANG_MUC: "",
        PHAN_BO_ID: null,
      });

      // Fetch options
      const fetchOptions = async () => {
        setIsLoadingOptions(true);
        const res = await getProjectDetailFormOptions();
        if (res.success && res.data) {
          setHangMucList(res.data.hangMuc || []);
          setNhanVienList(res.data.nhanVien || []);
        } else {
          toast.error("Không thể lấy dữ liệu form chi tiết");
        }
        setIsLoadingOptions(false);
      };
      
      fetchOptions();
    }
  }, [open, project.ID_DU_AN, defaultNhomDuAn, form]);

  const onSubmit = (data: CreateProjectDetailInput) => {
    // Convert "unassigned" to null
    const submitData = {
      ...data,
      PHAN_BO_ID: data.PHAN_BO_ID === "unassigned" ? null : data.PHAN_BO_ID
    };

    startTransition(async () => {
      const result = await createProjectDetail(submitData);
      if (result.success) {
        toast.success("Thêm chi tiết dự án thành công!");
        onOpenChange(false);
        form.reset();
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm Hạng Mục Dự Án</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết cho dự án <span className="font-semibold text-blue-600">{project.ID_DU_AN}</span>
          </DialogDescription>
        </DialogHeader>

        {isLoadingOptions ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-2">
              <FormField
                control={form.control}
                name="TEN_DU_AN_CT"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên chi tiết / Đầu việc</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên chi tiết..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="ID_HANG_MUC"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thuộc hạng mục (Từ Danh sách Hạng mục)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || ""}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hạng mục..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {hangMucList.length === 0 ? (
                          <SelectItem value="empty" disabled>Chưa có dữ liệu. Hãy thêm trong Cài đặt</SelectItem>
                        ) : (
                          hangMucList.map((hm: any) => (
                            <SelectItem key={hm.ID_HANG_MUC} value={hm.ID_HANG_MUC}>
                              {hm.TEN_HANG_MUC}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="PHAN_BO_ID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phân bổ cho Nhân sự (Không bắt buộc)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value || "unassigned"}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhân viên..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="unassigned">-- Chưa phân bổ --</SelectItem>
                        {nhanVienList.map((nv: any) => (
                          <SelectItem key={nv.ID_NHAN_VIEN} value={nv.ID_NHAN_VIEN}>
                            {nv.HO_VA_TEN} - {nv.EMAIL}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                  className="mr-2"
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending || form.formState.isSubmitting} className="bg-blue-600 hover:bg-blue-700">
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Lưu Hạng Mục
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
