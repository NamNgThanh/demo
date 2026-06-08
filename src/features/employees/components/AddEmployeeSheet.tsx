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
import { CalendarIcon, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { createNhanVienSchema, EmployeeFormData } from "../schema";
import { GIOI_TINH, HINH_THUC_LAM_VIEC, TRANG_THAI_LAM_VIEC } from "@prisma/client";
import { createEmployee, getNextEmployeeCode, getEmployeeFormOptions } from "../action";
import { GIOI_TINH_LABELS, TRANG_THAI_LAM_VIEC_LABELS, HINH_THUC_LAM_VIEC_LABELS } from "../constants";
import { EmployeeAccountFields } from "./EmployeeAccountFields";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AddEmployeeSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AddEmployeeSheet({ open, onOpenChange, onSuccess }: AddEmployeeSheetProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState("general");
  const [chucVuOptions, setChucVuOptions] = useState<{ value: string, label: string }[]>([]);
  const [phongBanOptions, setPhongBanOptions] = useState<{ value: string, label: string }[]>([]);

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(createNhanVienSchema),
    mode: "onChange",
    defaultValues: {
      TRANG_THAI: "DANG_LAM_VIEC" as const,
      HINH_THUC: "TOAN_THOI_GIAN" as const,
      CHUC_VU: "",
      PHONGBAN: "",
      NOI_CAP_CCCD: "Cục CS QLHC về TTXH",
      TAO_TAI_KHOAN: false,
      USER_NAME: "",
      PASSWORD: "",
      XAC_NHAN_MAT_KHAU: "",
    },
  });

  const { errors } = form.formState;

  // Hàm tìm tab có lỗi đầu tiên
  const findFirstErrorTab = (errors: typeof form.formState.errors) => {
    const generalFields = ["MA_NV", "HO_VA_TEN", "EMAIL", "SO_DIEN_THOAI", "NGAY_SINH", "GIOI_TINH", "SO_CCCD", "NGAY_CAP_CCCD", "NOI_CAP_CCCD", "NGAY_HET_HAN_CCCD", "DIA_CHI_THUONG_TRU", "DIA_CHI_HIEN_TAI"];
    const jobFields = ["TRANG_THAI", "HINH_THUC", "CHUC_VU", "PHONGBAN", "NGAY_NHAN_VIEC"];
    const accountFields = ["TAO_TAI_KHOAN", "USER_NAME", "PASSWORD", "XAC_NHAN_MAT_KHAU"];

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

    for (const field of accountFields) {
      if (errors[field as keyof typeof errors]) {
        return "account";
      }
    }

    return "general";
  };

  useEffect(() => {
    if (!open) return;

    const loadInitialData = async () => {
      try {
        const [code, optionsRes] = await Promise.all([
          getNextEmployeeCode(),
          getEmployeeFormOptions()
        ]);

        form.setValue("MA_NV", code, { shouldValidate: true });

        if (optionsRes.success && optionsRes.data) {
          setChucVuOptions((optionsRes.data as any).chucVuOptions);
          setPhongBanOptions((optionsRes.data as any).phongBanOptions);
        }
      } catch (error) {
        console.error("Lỗi tải dữ liệu ban đầu:", error);
        toast.error("Không thể kết nối database. Kiểm tra DATABASE_URL trong file .env.");
      }
    };

    loadInitialData();
  }, [open, form]);

  useEffect(() => {
    if (open) {
      setActiveTab("general");
    }
  }, [open]);

  const onSubmit = async (data: EmployeeFormData) => {
    startTransition(async () => {
      const result = await createEmployee(data);

      if (!result.success) {
        toast.error(typeof result.error === 'string' ? result.error : "Có lỗi xảy ra khi tạo nhân viên");
        return;
      }

      toast.success("Tạo nhân viên thành công!");
      form.reset();
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
          <DialogTitle>Thêm nhân viên mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết để tạo hồ sơ nhân viên trong hệ thống.
          </DialogDescription>
        </DialogHeader>

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
                <TabsList className="grid w-full grid-cols-3 mb-6 sticky top-0 z-10 bg-white shadow-sm border">
                  <TabsTrigger value="general">Thông tin chung</TabsTrigger>
                  <TabsTrigger value="job">Công việc</TabsTrigger>
                  <TabsTrigger value="account">Tài khoản</TabsTrigger>
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

                <TabsContent value="account" className="mt-0">
                  <EmployeeAccountFields form={form} isDisabled={isPending} />
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
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-600 hover:bg-blue-700 min-w-30"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Đang lưu..." : "Lưu hồ sơ"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
