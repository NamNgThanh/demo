"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Loader2, Info } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { updateNhanVienSchema, UpdateEmployeeFormData } from "../schema";
import { GIOI_TINH, HINH_THUC_LAM_VIEC, TRANG_THAI_LAM_VIEC } from "@prisma/client";
import { updateEmployee, getEmployeeFormOptions, EmployeePublic } from "../action";
import { GIOI_TINH_LABELS, TRANG_THAI_LAM_VIEC_LABELS, HINH_THUC_LAM_VIEC_LABELS } from "../constants";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface EditEmployeeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  employee: EmployeePublic | null;
  isAdmin?: boolean;
}

export function EditEmployeeSheet({ open, onOpenChange, onSuccess, employee, isAdmin = true }: EditEmployeeSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState("general");
  const [chucVuOptions, setChucVuOptions] = useState<{ value: string, label: string }[]>([]);
  const [phongBanOptions, setPhongBanOptions] = useState<{ value: string, label: string }[]>([]);

  const form = useForm<UpdateEmployeeFormData>({
    resolver: zodResolver(updateNhanVienSchema),
    mode: "onChange",
    defaultValues: {
      MA_NV: "",
      HO_VA_TEN: "",
      EMAIL: "",
      SO_DIEN_THOAI: "",
      NGAY_SINH: new Date(),
      GIOI_TINH: "NAM",
      SO_CCCD: "",
      NGAY_CAP_CCCD: new Date(),
      NOI_CAP_CCCD: "",
      NGAY_HET_HAN_CCCD: new Date(),
      DIA_CHI_THUONG_TRU: "",
      DIA_CHI_HIEN_TAI: "",
      TRANG_THAI: "DANG_LAM_VIEC",
      HINH_THUC: "TOAN_THOI_GIAN",
      CHUC_VU: "",
      PHONGBAN: "",
      NGAY_NHAN_VIEC: new Date(),
    },
  });

  const { reset } = form;

  const { errors } = form.formState;

  // Hàm tìm tab có lỗi đầu tiên
  const findFirstErrorTab = (errors: typeof form.formState.errors) => {
    const generalFields = ["MA_NV", "HO_VA_TEN", "EMAIL", "SO_DIEN_THOAI", "NGAY_SINH", "GIOI_TINH", "SO_CCCD", "NGAY_CAP_CCCD", "NOI_CAP_CCCD", "NGAY_HET_HAN_CCCD", "DIA_CHI_THUONG_TRU", "DIA_CHI_HIEN_TAI"];
    const jobFields = ["TRANG_THAI", "HINH_THUC", "CHUC_VU", "PHONGBAN", "NGAY_NHAN_VIEC"];

    for (const field of generalFields) {
      if (errors[field as keyof typeof errors]) {
        return "general";
      }
    }

    for (const field of jobFields) {
      if (errors[field as keyof typeof errors]) {
        return "job";
      }
    }

    return "general";
  };

  useEffect(() => {
    if (!open) return;

    const loadInitialData = async () => {
      try {
        const optionsRes = await getEmployeeFormOptions();
        
        if (optionsRes.success && optionsRes.data) {
          setChucVuOptions((optionsRes.data as any).chucVuOptions);
          setPhongBanOptions((optionsRes.data as any).phongBanOptions);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu ban đầu:", error);
        toast.error("Không thể kết nối database.");
      }
    };

    loadInitialData();
  }, [open]);

  useEffect(() => {
    if (open && employee) {
      setActiveTab("general");
      reset({
        MA_NV: employee.MA_NV,
        HO_VA_TEN: employee.HO_VA_TEN,
        EMAIL: employee.EMAIL || "",
        SO_DIEN_THOAI: employee.SO_DIEN_THOAI || "",
        NGAY_SINH: employee.NGAY_SINH ? new Date(employee.NGAY_SINH) : new Date(),
        GIOI_TINH: employee.GIOI_TINH as any,
        SO_CCCD: employee.SO_CCCD || "",
        NGAY_CAP_CCCD: employee.NGAY_CAP_CCCD ? new Date(employee.NGAY_CAP_CCCD) : new Date(),
        NOI_CAP_CCCD: employee.NOI_CAP_CCCD || "",
        NGAY_HET_HAN_CCCD: employee.NGAY_HET_HAN_CCCD ? new Date(employee.NGAY_HET_HAN_CCCD) : new Date(),
        DIA_CHI_THUONG_TRU: employee.DIA_CHI_THUONG_TRU || "",
        DIA_CHI_HIEN_TAI: employee.DIA_CHI_HIEN_TAI || "",
        TRANG_THAI: employee.TRANG_THAI as any,
        HINH_THUC: employee.HINH_THUC as any,
        CHUC_VU: employee.CHUC_VU || "",
        PHONGBAN: employee.PHONGBAN || "",
        NGAY_NHAN_VIEC: employee.NGAY_CHINH_THUC 
          ? new Date(employee.NGAY_CHINH_THUC) 
          : employee.NGAY_THU_VIEC 
          ? new Date(employee.NGAY_THU_VIEC) 
          : new Date(),
      });
    }
  }, [open, employee, reset]);

  const onSubmit = async (data: UpdateEmployeeFormData) => {
    if (!employee) return;
    
    startTransition(async () => {
      const result = await updateEmployee(employee.MA_NV, data);

      if (!result.success) {
        toast.error(typeof result.error === 'string' ? result.error : "Có lỗi xảy ra khi cập nhật nhân viên");
        return;
      }

      toast.success("Cập nhật thông tin thành công!");
      onOpenChange(false);
      router.refresh();

      if (onSuccess) {
        onSuccess();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] p-0 flex flex-col h-[90vh] bg-slate-50 overflow-hidden">
        <DialogHeader className="px-6 py-4 bg-white border-b shrink-0">
          <DialogTitle>{isAdmin ? "Sửa thông tin nhân viên" : "Chi tiết nhân viên"}</DialogTitle>
          <DialogDescription>
            {isAdmin 
              ? `Cập nhật thông tin chi tiết cho nhân viên ${employee?.HO_VA_TEN}.`
              : `Xem thông tin chi tiết của nhân viên ${employee?.HO_VA_TEN}.`}
          </DialogDescription>
        </DialogHeader>

        {!isAdmin && (
          <div className="bg-blue-50 border-b border-blue-100 p-3 px-6 flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-blue-700">
              Bạn đang ở chế độ xem. Chỉ có tài khoản Quản trị viên mới được phép chỉnh sửa thông tin.
            </p>
          </div>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (errors) => {
              const tab = findFirstErrorTab(errors);
              setActiveTab(tab);
              toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!", {
                description: "Có trường dữ liệu bị thiếu hoặc sai định dạng ở các tab.",
              });
            })}
            className="flex flex-col flex-1 overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto relative px-6 py-4">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 mb-6 sticky top-0 z-10 bg-white shadow-sm border">
                  <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                  <TabsTrigger value="job">Chức vụ & Phòng ban</TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6 bg-white p-4 rounded-lg border shadow-sm mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="MA_NV"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mã nhân viên <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input
                              readOnly
                              disabled
                              className="bg-slate-100 font-bold"
                              {...field}
                              value={field.value ?? ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="HO_VA_TEN"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Họ và tên <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập họ và tên nhân viên" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="EMAIL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Nhập địa chỉ email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="SO_DIEN_THOAI"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập số điện thoại" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="NGAY_SINH"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày sinh <span className="text-destructive">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày sinh</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="GIOI_TINH"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giới tính <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn giới tính" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(GIOI_TINH).map((value) => (
                                <SelectItem key={value} value={value}>{GIOI_TINH_LABELS[value]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="SO_CCCD"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số CCCD <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập số CCCD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="NGAY_CAP_CCCD"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày cấp CCCD <span className="text-destructive">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày cấp</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                                fromYear={1900}
                                toYear={new Date().getFullYear()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="NOI_CAP_CCCD"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nơi cấp CCCD <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập nơi cấp CCCD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="NGAY_HET_HAN_CCCD"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày hết hạn CCCD</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày hết hạn</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                                fromYear={new Date().getFullYear() - 10}
                                toYear={new Date().getFullYear() + 10}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="DIA_CHI_THUONG_TRU"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ thường trú <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Nhập địa chỉ thường trú" {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="DIA_CHI_HIEN_TAI"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ hiện tại <span className="text-destructive">*</span></FormLabel>
                        <FormControl>
                          <Textarea placeholder="Nhập địa chỉ hiện tại" {...field} rows={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="job" className="space-y-6 bg-white p-4 rounded-lg border shadow-sm mt-0">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="TRANG_THAI"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(TRANG_THAI_LAM_VIEC).map((value) => (
                                <SelectItem key={value} value={value}>{TRANG_THAI_LAM_VIEC_LABELS[value]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="HINH_THUC"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Loại nhân viên <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.values(HINH_THUC_LAM_VIEC).map((value) => (
                                <SelectItem key={value} value={value}>{HINH_THUC_LAM_VIEC_LABELS[value]}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="CHUC_VU"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Chức vụ <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn chức vụ" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {chucVuOptions.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="PHONGBAN"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phòng ban <span className="text-destructive">*</span></FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn phòng ban" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {phongBanOptions.map(({ value, label }) => (
                                <SelectItem key={value} value={value}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="NGAY_NHAN_VIEC"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày vào làm <span className="text-destructive">*</span></FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Chọn ngày vào làm</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                captionLayout="dropdown"
                                fromYear={2000}
                                toYear={new Date().getFullYear() + 10}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="p-4 border-t bg-white shrink-0 flex justify-end gap-3 items-center">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isPending}
              >
                {isAdmin ? "Hủy" : "Đóng"}
              </Button>
              {isAdmin && (
                <Button
                  type="submit"
                  disabled={isPending}
                  className="bg-blue-600 hover:bg-blue-700 min-w-30"
                >
                  {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isPending ? "Đang lưu..." : "Lưu hồ sơ"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
