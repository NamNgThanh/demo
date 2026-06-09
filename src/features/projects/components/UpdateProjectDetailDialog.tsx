"use client";

import { useEffect, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { updateProjectDetailSchema, UpdateProjectDetailInput } from "../schema";
import { updateProjectDetailInfo, getProjectDetailFormOptions } from "../action";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Users, Gift, FileText, UserCog, Save, CalendarIcon } from "lucide-react";
import { ProjectDetail } from "../types";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface UpdateProjectDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ProjectDetail | null;
}

export function UpdateProjectDetailDialog({ open, onOpenChange, item }: UpdateProjectDetailDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [nhanVienList, setNhanVienList] = useState<any[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);
  const [activeTab, setActiveTab] = useState("phan-bo");

  const menuItems = [
    { id: "phan-bo", label: "Phân bổ", icon: Users },
    { id: "treo-thuong", label: "Treo thưởng", icon: Gift },
    { id: "bang-chung", label: "Bằng chứng", icon: FileText },
    { id: "duy-tri", label: "Nhân sự duy trì", icon: UserCog },
  ];

  const form = useForm<UpdateProjectDetailInput>({
    resolver: zodResolver(updateProjectDetailSchema),
    defaultValues: {
      ID_DU_AN_CT: "",
      EMAIL_SO_HUU: "",
      NV_PHU_TRACH_ID: null,
      nvHoTroIds: [],
      LEADER_ID: null,
      DEADLINE: "",
      TREO_THUONG_SO_TIEN: null,
      TREO_THUONG_THOI_HAN: "",
      BANG_CHUNG: [],
      nhanSuDuyTriIds: [],
      DUY_TRI_HIEU_LUC: true,
    },
  });

  const { fields: bangChungFields, append: appendBangChung, remove: removeBangChung } = useFieldArray({
    control: form.control,
    name: "BANG_CHUNG",
  });

  useEffect(() => {
    if (open && item) {
      // Load options
      const fetchOptions = async () => {
        setIsLoadingOptions(true);
        const res = await getProjectDetailFormOptions();
        if (res.success && res.data) {
          setNhanVienList(res.data.nhanVien || []);
        } else {
          toast.error("Không thể lấy dữ liệu form");
        }
        setIsLoadingOptions(false);
      };
      fetchOptions();

      // Reset form
      form.reset({
        ID_DU_AN_CT: item.ID_DU_AN_CT,
        EMAIL_SO_HUU: item.EMAIL_SO_HUU || "",
        NV_PHU_TRACH_ID: item.NV_PHU_TRACH_ID || "unassigned", // Use "unassigned" to bypass Select empty issue
        nvHoTroIds: item.nvHoTroIds || [],
        LEADER_ID: item.LEADER_ID || "unassigned",
        TINH_TRANG: item.TINH_TRANG || "Chưa phân bổ",
        DEADLINE: item.DEADLINE ? new Date(item.DEADLINE).toISOString().split('T')[0] : "",
        TREO_THUONG_SO_TIEN: item.TREO_THUONG_SO_TIEN || 0,
        TREO_THUONG_THOI_HAN: item.TREO_THUONG_THOI_HAN ? new Date(item.TREO_THUONG_THOI_HAN).toISOString().split('T')[0] : "",
        BANG_CHUNG: item.BANG_CHUNG || [],
        nhanSuDuyTriIds: item.nhanSuDuyTriIds || [],
        DUY_TRI_HIEU_LUC: item.DUY_TRI_HIEU_LUC !== undefined ? item.DUY_TRI_HIEU_LUC : true,
      });
    }
  }, [open, item, form]);

  const onSubmit = (data: UpdateProjectDetailInput) => {
    // Convert "unassigned" back to null
    const submitData = {
      ...data,
      NV_PHU_TRACH_ID: data.NV_PHU_TRACH_ID === "unassigned" ? null : data.NV_PHU_TRACH_ID,
      LEADER_ID: data.LEADER_ID === "unassigned" ? null : data.LEADER_ID,
    };

    startTransition(async () => {
      const result = await updateProjectDetailInfo(submitData);
      if (result.success) {
        toast.success("Cập nhật thông tin thành công!");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Có lỗi xảy ra");
      }
    });
  };

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl p-0 h-[80vh] flex flex-col overflow-hidden bg-slate-50 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Tổng Hợp Thông Tin: {item.ID_DU_AN_CT}</DialogTitle>
          <DialogDescription>{item.TEN_DU_AN_CT}</DialogDescription>
        </DialogHeader>

        {isLoadingOptions ? (
          <div className="flex-1 flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 flex overflow-hidden">
                {/* Sidebar Menu */}
                <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
                  <div className="p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-lg font-bold text-slate-800 line-clamp-2" title={item.TEN_DU_AN_CT}>
                      {item.TEN_DU_AN_CT}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">ID: {item.ID_DU_AN_CT}</p>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {menuItems.map(menu => (
                      <button
                        type="button"
                        key={menu.id}
                        onClick={() => setActiveTab(menu.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                          activeTab === menu.id 
                            ? "bg-blue-50 text-blue-700" 
                            : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <menu.icon className="h-4 w-4 shrink-0" />
                        {menu.label}
                        {menu.id === "bang-chung" && <span className="ml-auto bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">{bangChungFields.length}</span>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
                  <div className="max-w-3xl mx-auto">
                    <div className="mb-6 flex items-center justify-between">
                      <h3 className="text-2xl font-semibold text-slate-800">
                        {menuItems.find(m => m.id === activeTab)?.label}
                      </h3>
                    </div>

                    {/* TAB PHÂN BỔ */}
                    <div className={`${activeTab === "phan-bo" ? "block" : "hidden"} space-y-4`}>
                      <div className="bg-white p-4 rounded-lg border shadow-sm">
                        <FormField
                          control={form.control}
                          name="TINH_TRANG"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-600 font-semibold">Tình trạng hạng mục</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value || "Chưa phân bổ"}>
                                <FormControl>
                                  <SelectTrigger className="bg-slate-50 border-slate-200">
                                    <SelectValue placeholder="Chọn tình trạng..." />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Chưa phân bổ">Chưa phân bổ</SelectItem>
                                  <SelectItem value="Chưa triển khai">Chưa triển khai</SelectItem>
                                  <SelectItem value="Đang triển khai">Đang triển khai</SelectItem>
                                  <SelectItem value="Chờ nghiệm thu">Chờ nghiệm thu</SelectItem>
                                  <SelectItem value="Nghiệm thu">Nghiệm thu</SelectItem>
                                  <SelectItem value="Hoãn">Hoãn</SelectItem>
                                  <SelectItem value="Huỷ">Huỷ</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
                        <div className="grid grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="EMAIL_SO_HUU"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-600">Email sở hữu</FormLabel>
                                <FormControl>
                                  <Input className="bg-slate-50" placeholder="example@gmail.com" type="email" {...field} value={field.value || ""} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="DEADLINE"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel className="text-slate-600">Deadline</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn("pl-3 text-left font-normal bg-slate-50", !field.value && "text-muted-foreground")}
                                      >
                                        {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")} />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="NV_PHU_TRACH_ID"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-600">Nhân sự phụ trách chính</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || "unassigned"}>
                                  <FormControl>
                                    <SelectTrigger className="bg-slate-50">
                                      <SelectValue placeholder="Chọn người phụ trách" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="unassigned">-- Chưa chọn --</SelectItem>
                                    {nhanVienList.map((nv) => (
                                      <SelectItem key={nv.ID_NHAN_VIEN} value={nv.ID_NHAN_VIEN}>
                                        {nv.HO_VA_TEN}
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
                            name="LEADER_ID"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-600">Leader / Quản lý</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value || "unassigned"}>
                                  <FormControl>
                                    <SelectTrigger className="bg-slate-50">
                                      <SelectValue placeholder="Chọn Leader" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="unassigned">-- Chưa chọn --</SelectItem>
                                    {nhanVienList.map((nv) => (
                                      <SelectItem key={nv.ID_NHAN_VIEN} value={nv.ID_NHAN_VIEN}>
                                        {nv.HO_VA_TEN}
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
                            name="nvHoTroIds"
                            render={({ field }) => (
                              <FormItem className="col-span-2">
                                <FormLabel className="text-slate-600">Nhân sự hỗ trợ (Chọn nhiều)</FormLabel>
                                <FormControl>
                                  <ScrollArea className="h-[200px] border rounded-xl p-4 bg-slate-50/50 shadow-inner">
                                    <div className="grid grid-cols-2 gap-3">
                                      {nhanVienList.map((nv) => (
                                        <div key={nv.ID_NHAN_VIEN} className="flex items-center space-x-2 bg-white p-3 border rounded-lg shadow-sm hover:border-blue-200 transition-colors">
                                          <Checkbox
                                            id={`hotro-${nv.ID_NHAN_VIEN}`}
                                            checked={field.value?.includes(nv.ID_NHAN_VIEN)}
                                            onCheckedChange={(checked) => {
                                              const current = field.value || [];
                                              const updated = checked
                                                ? [...current, nv.ID_NHAN_VIEN]
                                                : current.filter((id) => id !== nv.ID_NHAN_VIEN);
                                              field.onChange(updated);
                                            }}
                                          />
                                          <label htmlFor={`hotro-${nv.ID_NHAN_VIEN}`} className="text-sm font-medium cursor-pointer flex-1">
                                            {nv.HO_VA_TEN}
                                          </label>
                                        </div>
                                      ))}
                                    </div>
                                  </ScrollArea>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>

                    {/* TAB TREO THƯỞNG */}
                    <div className={`${activeTab === "treo-thuong" ? "block" : "hidden"} space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm`}>
                      <div className="grid grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="TREO_THUONG_SO_TIEN"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-600">Số tiền thưởng (VNĐ)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type="text" 
                                    className="pr-12 bg-slate-50 text-lg font-semibold text-green-700" 
                                    {...field} 
                                    value={field.value ? new Intl.NumberFormat("vi-VN").format(field.value) : ""} 
                                    onChange={e => {
                                      const rawValue = e.target.value.replace(/\D/g, '');
                                      field.onChange(rawValue ? Number(rawValue) : null);
                                    }}
                                  />
                                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">VNĐ</span>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="TREO_THUONG_THOI_HAN"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-slate-600">Thời hạn treo thưởng</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn("pl-3 text-left font-normal bg-slate-50", !field.value && "text-muted-foreground")}
                                    >
                                      {field.value ? format(new Date(field.value), "dd/MM/yyyy") : <span>Chọn ngày</span>}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined} onSelect={(d) => field.onChange(d ? format(d, "yyyy-MM-dd") : "")} />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* TAB BẰNG CHỨNG */}
                    <div className={`${activeTab === "bang-chung" ? "block" : "hidden"} space-y-4`}>
                      <div className="flex items-center justify-end">
                        <Button 
                          type="button" 
                          size="sm" 
                          variant="outline" 
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-white shadow-sm"
                          onClick={() => appendBangChung({ TEN_DANH_MUC: "Link App", LINK: "", GHI_CHU: "" })}
                        >
                          <Plus className="w-4 h-4 mr-1" /> Thêm mới
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {bangChungFields.length === 0 ? (
                          <div className="text-center p-8 bg-white border border-dashed border-slate-300 rounded-xl text-slate-400">
                            Chưa có bằng chứng nào được đính kèm
                          </div>
                        ) : (
                          bangChungFields.map((field, index) => (
                            <div key={field.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex gap-4 items-start relative group hover:border-blue-200 transition-colors">
                              <div className="flex-1 grid grid-cols-2 gap-4">
                                <FormField
                                  control={form.control}
                                  name={`BANG_CHUNG.${index}.TEN_DANH_MUC`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-slate-600">Tên danh mục</FormLabel>
                                      <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <FormControl>
                                          <SelectTrigger className="bg-slate-50">
                                            <SelectValue placeholder="Chọn danh mục" />
                                          </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                          <SelectItem value="Link App">Link App</SelectItem>
                                          <SelectItem value="Folder Hệ Thống">Folder Hệ Thống</SelectItem>
                                          <SelectItem value="Link Data">Link Data</SelectItem>
                                          <SelectItem value="Link HDSD">Link HDSD</SelectItem>
                                          <SelectItem value="Khác">Khác...</SelectItem>
                                        </SelectContent>
                                      </Select>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`BANG_CHUNG.${index}.LINK`}
                                  render={({ field }) => (
                                    <FormItem>
                                      <FormLabel className="text-slate-600">Đường dẫn (URL)</FormLabel>
                                      <FormControl>
                                        <Input className="bg-slate-50" placeholder="https://..." {...field} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />

                                <FormField
                                  control={form.control}
                                  name={`BANG_CHUNG.${index}.GHI_CHU`}
                                  render={({ field }) => (
                                    <FormItem className="col-span-2">
                                      <FormLabel className="text-slate-600">Ghi chú thêm</FormLabel>
                                      <FormControl>
                                        <Textarea className="bg-slate-50 resize-none h-20" placeholder="Nhập ghi chú..." {...field} value={field.value || ""} />
                                      </FormControl>
                                      <FormMessage />
                                    </FormItem>
                                  )}
                                />
                              </div>

                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all rounded-full absolute top-2 right-2"
                                onClick={() => removeBangChung(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* TAB DUY TRÌ */}
                    <div className={`${activeTab === "duy-tri" ? "block" : "hidden"} space-y-6 bg-white p-6 rounded-xl border border-slate-200 shadow-sm`}>
                      <FormField
                        control={form.control}
                        name="DUY_TRI_HIEU_LUC"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-xl border p-5 bg-slate-50">
                            <div className="space-y-1">
                              <FormLabel className="text-base font-semibold text-slate-800">Hiệu lực duy trì</FormLabel>
                              <DialogDescription>
                                Trạng thái hoạt động của nhân sự duy trì cho hạng mục này
                              </DialogDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="nhanSuDuyTriIds"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-slate-600">Nhân sự duy trì sau dự án (Chọn nhiều)</FormLabel>
                            <FormControl>
                              <ScrollArea className="h-[250px] border rounded-xl p-4 bg-slate-50/50 shadow-inner">
                                <div className="grid grid-cols-2 gap-3">
                                  {nhanVienList.map((nv) => (
                                    <div key={nv.ID_NHAN_VIEN} className="flex items-center space-x-2 bg-white p-3 border rounded-lg shadow-sm hover:border-blue-200 transition-colors">
                                      <Checkbox
                                        id={`duytri-${nv.ID_NHAN_VIEN}`}
                                        checked={field.value?.includes(nv.ID_NHAN_VIEN)}
                                        onCheckedChange={(checked) => {
                                          const current = field.value || [];
                                          const updated = checked
                                            ? [...current, nv.ID_NHAN_VIEN]
                                            : current.filter((id) => id !== nv.ID_NHAN_VIEN);
                                          field.onChange(updated);
                                        }}
                                      />
                                      <label htmlFor={`duytri-${nv.ID_NHAN_VIEN}`} className="text-sm font-medium cursor-pointer flex-1">
                                        {nv.HO_VA_TEN}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-white flex justify-end shrink-0 gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={isPending || form.formState.isSubmitting} className="bg-blue-600 hover:bg-blue-700 px-6">
                  {isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Lưu Thông Tin
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
