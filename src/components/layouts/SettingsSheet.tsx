"use client";

import { useEffect, useState, useTransition } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Settings, Plus, Trash2, Edit2, Loader2, Info } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  getDanhMucChucVu,
  addDanhMucChucVu,
  toggleDanhMucChucVu,
  deleteDanhMucChucVu,
  getDanhMucPhongBan,
  addDanhMucPhongBan,
  toggleDanhMucPhongBan,
  deleteDanhMucPhongBan,
} from "@/app/actions/settings";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SettingsSheet() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 rounded-full h-9 w-9" title="Cài đặt danh mục">
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-md w-screen overflow-y-auto bg-slate-50 p-0" side="right">
        <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
          <SheetHeader>
            <SheetTitle className="text-xl text-slate-800">Cài đặt danh mục</SheetTitle>
            <SheetDescription>
              Quản lý các danh mục động trên hệ thống (Chức vụ, Phòng ban,...)
            </SheetDescription>
          </SheetHeader>
        </div>

        <div className="p-6">
          <Tabs defaultValue="chuc-vu" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="chuc-vu">Chức vụ</TabsTrigger>
              <TabsTrigger value="phong-ban">Phòng ban</TabsTrigger>
            </TabsList>
            <TabsContent value="chuc-vu" className="mt-0">
              <ChucVuManager />
            </TabsContent>
            <TabsContent value="phong-ban" className="mt-0">
              <PhongBanManager />
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ChucVuManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getDanhMucChucVu();
    if (res.success) {
      if (res.data) setItems(res.data as any[]);
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    startTransition(async () => {
      const res = await addDanhMucChucVu(newValue);
      if (res.success) {
        toast.success("Thêm thành công");
        setNewValue("");
        fetchItems();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggle = async (id: string, checked: boolean) => {
    startTransition(async () => {
      const res = await toggleDanhMucChucVu(id, checked);
      if (res.success) {
        setItems(prev => prev.map(item => item.ID_CV === id ? { ...item, HIEU_LUC: checked } : item));
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteDanhMucChucVu(id);
      if (res.success) {
        toast.success("Xoá thành công");
        fetchItems();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 bg-white p-2 rounded-lg border shadow-sm">
        <Input 
          placeholder="Nhập tên chức vụ mới..." 
          value={newValue} 
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />
        <Button onClick={handleAdd} disabled={isPending || !newValue.trim()} size="sm" className="shrink-0 rounded-md">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
          Thêm
        </Button>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Chưa có dữ liệu</div>
        ) : (
          <ul className="divide-y">
            {items.map(item => (
              <li key={item.ID_CV} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <span className={`font-medium ${!item.HIEU_LUC ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {item.TEN_CV}
                </span>
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={item.HIEU_LUC} 
                    onCheckedChange={(checked) => handleToggle(item.ID_CV, checked)}
                    disabled={isPending}
                    title="Ẩn/Hiện trong dropdown"
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" disabled={isPending}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc muốn xoá <b>{item.TEN_CV}</b> không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.ID_CV)} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-start gap-2 p-3 bg-blue-50/50 text-blue-800 rounded-lg text-xs border border-blue-100">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>Danh mục bị tắt hiển thị (tắt công tắc) sẽ không xuất hiện trong các tuỳ chọn để chọn thêm mới, nhưng dữ liệu cũ vẫn được giữ nguyên.</p>
      </div>
    </div>
  );
}

function PhongBanManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getDanhMucPhongBan();
    if (res.success) {
      if (res.data) setItems(res.data as any[]);
    } else {
      toast.error(res.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleAdd = async () => {
    if (!newValue.trim()) return;
    startTransition(async () => {
      const res = await addDanhMucPhongBan(newValue);
      if (res.success) {
        toast.success("Thêm thành công");
        setNewValue("");
        fetchItems();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggle = async (id: string, checked: boolean) => {
    startTransition(async () => {
      const res = await toggleDanhMucPhongBan(id, checked);
      if (res.success) {
        setItems(prev => prev.map(item => item.ID_PB === id ? { ...item, HIEU_LUC: checked } : item));
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteDanhMucPhongBan(id);
      if (res.success) {
        toast.success("Xoá thành công");
        fetchItems();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 bg-white p-2 rounded-lg border shadow-sm">
        <Input 
          placeholder="Nhập tên phòng ban mới..." 
          value={newValue} 
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />
        <Button onClick={handleAdd} disabled={isPending || !newValue.trim()} size="sm" className="shrink-0 rounded-md">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
          Thêm
        </Button>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Chưa có dữ liệu</div>
        ) : (
          <ul className="divide-y">
            {items.map(item => (
              <li key={item.ID_PB} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <span className={`font-medium ${!item.HIEU_LUC ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {item.TEN_PB}
                </span>
                <div className="flex items-center gap-3">
                  <Switch 
                    checked={item.HIEU_LUC} 
                    onCheckedChange={(checked) => handleToggle(item.ID_PB, checked)}
                    disabled={isPending}
                    title="Ẩn/Hiện trong dropdown"
                  />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" disabled={isPending}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc muốn xoá <b>{item.TEN_PB}</b> không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.ID_PB)} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-start gap-2 p-3 bg-blue-50/50 text-blue-800 rounded-lg text-xs border border-blue-100">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        <p>Danh mục bị tắt hiển thị (tắt công tắc) sẽ không xuất hiện trong các tuỳ chọn để chọn thêm mới, nhưng dữ liệu cũ vẫn được giữ nguyên.</p>
      </div>
    </div>
  );
}


