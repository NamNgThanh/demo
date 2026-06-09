"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreateProjectInput, createProjectSchema } from "../schema";
import { createProject, getProjectFormOptions } from "../action";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddProjectDialog({ open, onOpenChange, onSuccess }: AddProjectDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [loaiDuAnOptions, setLoaiDuAnOptions] = useState<any[]>([]);
  const [phuLucOptions, setPhuLucOptions] = useState<any[]>([]);
  const [nhomDuAnOptions, setNhomDuAnOptions] = useState<any[]>([]);

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      NGAY_DU_AN: new Date(),
      ID_LOAI_DU_AN: "",
      ID_PLHD: "",
      nhomDuAnIds: [],
      NGAY_DK_BAT_DAU: new Date(),
      NGAY_DK_HOAN_THANH: new Date(),
      THUC_TE: "",
    },
  });

  const selectedPLHD = form.watch("ID_PLHD");

  useEffect(() => {
    if (!open) return;

    const loadOptions = async () => {
      try {
        const res = await getProjectFormOptions();
        if (res.success && res.data) {
          setLoaiDuAnOptions(res.data.loaiDuAn);
          setNhomDuAnOptions(res.data.nhomDuAn);
          setPhuLucOptions(res.data.plhd);
        }
      } catch (error) {
        toast.error("Không thể tải dữ liệu danh mục");
      }
    };
    loadOptions();
  }, [open]);

  const onSubmit = async (data: CreateProjectInput) => {
    startTransition(async () => {
      const result = await createProject(data);
      if (!result.success) {
        toast.error(typeof result.error === 'string' ? result.error : "Có lỗi xảy ra khi tạo dự án");
        return;
      }
      toast.success("Tạo dự án thành công!");
      form.reset();
      onOpenChange(false);
      router.refresh();
      if (onSuccess) onSuccess();
    });
  };

  // Tìm Đối Tác tương ứng với PLHĐ được chọn
  const computedDoiTac = phuLucOptions.find(p => p.ID_PLHD === selectedPLHD)?.TEN_DOI_TAC_VIET_TAT || "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl p-0 flex flex-col bg-slate-50 overflow-hidden">
        <DialogHeader className="px-6 py-5 bg-white border-b shrink-0 shadow-sm z-10">
          <DialogTitle className="text-xl">Thêm Dự Án Mới</DialogTitle>
          <DialogDescription>
            Điền thông tin cấu trúc và tiến độ. Mã dự án sẽ tự động được hệ thống cấp.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <div className="flex-1 overflow-y-auto px-6 py-6 h-[70vh]">
              <div className="grid grid-cols-2 gap-8">
                
                {/* CỘT TRÁI: CẤU TRÚC THÔNG TIN */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">Cấu trúc dự án</h3>
                  
                  <FormField
                    control={form.control}
                    name="NGAY_DU_AN"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Ngày tạo dự án <span className="text-destructive">*</span></FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className={cn("pl-3 text-left font-normal bg-white", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar mode="single" selected={new Date(field.value)} onSelect={field.onChange} />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="ID_LOAI_DU_AN"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại dự án <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Chọn loại" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {loaiDuAnOptions.map(opt => (
                                <SelectItem key={opt.ID_LOAI_DU_AN} value={opt.ID_LOAI_DU_AN}>{opt.LOAI_DU_AN}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="ID_PLHD"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phụ lục hợp đồng <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Chọn PLHĐ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {phuLucOptions.map(opt => (
                                <SelectItem key={opt.ID_PLHD} value={opt.ID_PLHD}>{opt.ID_PLHD}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* AUTO-FILL ĐỐI TÁC */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium leading-none text-slate-500 peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Đối tác (Tự động điền)</label>
                    <Input 
                      disabled 
                      readOnly 
                      value={computedDoiTac} 
                      className="bg-slate-100 font-semibold text-slate-700 disabled:opacity-100" 
                      placeholder="Tên đối tác sẽ hiện ở đây..."
                    />
                    <p className="text-[11px] text-slate-400 mt-1">Được lấy từ Phụ lục hợp đồng đã chọn</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="nhomDuAnIds"
                    render={() => (
                      <FormItem>
                        <FormLabel>Nhóm dự án <span className="text-destructive">*</span></FormLabel>
                        <div className="h-40 overflow-y-auto bg-white border rounded-md p-3 space-y-3">
                          {nhomDuAnOptions.map((nhom) => (
                            <FormField
                              key={nhom.ID_NHOM_DU_AN}
                              control={form.control}
                              name="nhomDuAnIds"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={nhom.ID_NHOM_DU_AN}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(nhom.ID_NHOM_DU_AN)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, nhom.ID_NHOM_DU_AN])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== nhom.ID_NHOM_DU_AN
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-sm cursor-pointer">
                                      {nhom.NHOM_DU_AN}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                </div>

                {/* CỘT PHẢI: TIẾN ĐỘ THỰC TẾ */}
                <div className="space-y-6">
                  <h3 className="font-semibold text-slate-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">Tiến độ & Ghi chú</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="NGAY_DK_BAT_DAU"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Dự kiến bắt đầu <span className="text-destructive">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn("pl-3 text-left font-normal bg-white", !field.value && "text-muted-foreground")}
                                >
                                  {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={new Date(field.value)} onSelect={field.onChange} />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="NGAY_DK_HOAN_THANH"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Dự kiến hoàn thành <span className="text-destructive">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn("pl-3 text-left font-normal bg-white", !field.value && "text-muted-foreground")}
                                >
                                  {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={new Date(field.value)} onSelect={field.onChange} />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="THUC_TE"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thực tế (Không bắt buộc)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Ghi chú thêm về thực tế, số lượng..." 
                            className="bg-white h-32" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                    <p className="text-sm text-blue-800">
                      <strong>Lưu ý:</strong> Cột trạng thái tổng quan của Dự án (Tình trạng) sẽ được hệ thống tính toán tự động dựa trên các mốc thời gian này.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            <div className="p-5 border-t bg-white shrink-0 flex justify-end gap-3 items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                Hủy bỏ
              </Button>
              <Button type="submit" disabled={isPending} className="bg-blue-600 hover:bg-blue-700 min-w-32">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Đang xử lý..." : "Lưu Dự Án"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
