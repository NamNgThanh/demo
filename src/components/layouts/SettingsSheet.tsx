"use client";

import { useEffect, useState, useTransition } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Settings, Plus, Trash2, Loader2, Info, Users, Building2, FolderKanban, Layers, FileText, ListTodo } from "lucide-react";
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
  getDanhMucLoaiDuAn,
  addDanhMucLoaiDuAn,
  toggleDanhMucLoaiDuAn,
  deleteDanhMucLoaiDuAn,
  getDanhMucNhomDuAn,
  addDanhMucNhomDuAn,
  toggleDanhMucNhomDuAn,
  deleteDanhMucNhomDuAn,
  getDanhMucPhuLucHopDong,
  addDanhMucPhuLucHopDong,
  toggleDanhMucPhuLucHopDong,
  deleteDanhMucPhuLucHopDong,
  getDanhMucHangMuc,
  addDanhMucHangMuc,
  toggleDanhMucHangMuc,
  deleteDanhMucHangMuc
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SettingsSheet() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chuc-vu");

  const menuItems = [
    { id: "chuc-vu", label: "Chức vụ", icon: Users },
    { id: "phong-ban", label: "Phòng ban", icon: Building2 },
    { id: "loai-du-an", label: "Loại dự án", icon: FolderKanban },
    { id: "nhom-du-an", label: "Nhóm dự án", icon: Layers },
    { id: "phu-luc-hop-dong", label: "Phụ lục hợp đồng", icon: FileText },
    { id: "hang-muc", label: "Hạng mục (DS CT)", icon: ListTodo },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-900 rounded-full h-9 w-9" title="Cài đặt danh mục">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl p-0 h-[80vh] flex flex-col overflow-hidden bg-slate-50 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Cài đặt danh mục</DialogTitle>
          <DialogDescription>Quản lý các danh mục động trên hệ thống</DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0">
            <div className="p-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Cài đặt</h2>
              <p className="text-sm text-slate-500">Quản lý danh mục động</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                    ? "bg-blue-50 text-blue-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                >
                  <item.icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-slate-800">
                  {menuItems.find(m => m.id === activeTab)?.label}
                </h3>
              </div>

              {activeTab === "chuc-vu" && <ChucVuManager />}
              {activeTab === "phong-ban" && <PhongBanManager />}
              {activeTab === "loai-du-an" && <LoaiDuAnManager />}
              {activeTab === "nhom-du-an" && <NhomDuAnManager />}
              {activeTab === "phu-luc-hop-dong" && <PhuLucHopDongManager />}
              {activeTab === "hang-muc" && <HangMucManager />}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ChucVuManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [newId, setNewId] = useState("");
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
    if (!newId.trim() || !newValue.trim()) {
      toast.error("Vui lòng nhập cả Mã và Tên chức vụ");
      return;
    }
    startTransition(async () => {
      const res = await addDanhMucChucVu(newId, newValue);
      if (res.success) {
        toast.success("Thêm thành công");
        setNewId("");
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
          placeholder="ID"
          value={newId}
          onChange={e => setNewId(e.target.value.toUpperCase().replace(/\s/g, ''))}
          className="w-28 border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-medium"
        />
        <div className="w-px bg-slate-200 shrink-0 my-1"></div>
        <Input
          placeholder="Tên chức vụ mới..."
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />
        <Button onClick={handleAdd} disabled={isPending || !newId.trim() || !newValue.trim()} size="sm" className="shrink-0 rounded-md">
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
                  <span className="text-slate-400 mr-2">[{item.ID_CV}]</span>
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
  const [newId, setNewId] = useState("");
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
    if (!newId.trim() || !newValue.trim()) {
      toast.error("Vui lòng nhập cả Mã và Tên phòng ban");
      return;
    }
    startTransition(async () => {
      const res = await addDanhMucPhongBan(newId, newValue);
      if (res.success) {
        toast.success("Thêm thành công");
        setNewId("");
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
          placeholder="ID"
          value={newId}
          onChange={e => setNewId(e.target.value.toUpperCase().replace(/\s/g, ''))}
          className="w-28 border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-medium"
        />
        <div className="w-px bg-slate-200 shrink-0 my-1"></div>
        <Input
          placeholder="Tên phòng ban mới..."
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />
        <Button onClick={handleAdd} disabled={isPending || !newId.trim() || !newValue.trim()} size="sm" className="shrink-0 rounded-md">
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
                  <span className="text-slate-400 mr-2">[{item.ID_PB}]</span>
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

function LoaiDuAnManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [newId, setNewId] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getDanhMucLoaiDuAn();
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
    if (!newId.trim() || !newValue.trim()) {
      toast.error("Vui lòng nhập cả Mã và Tên Loại dự án");
      return;
    }
    startTransition(async () => {
      const res = await addDanhMucLoaiDuAn(newId, newValue);
      if (res.success) {
        toast.success("Thêm thành công");
        setNewId("");
        setNewValue("");
        fetchItems();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggle = async (id: string, checked: boolean) => {
    startTransition(async () => {
      const res = await toggleDanhMucLoaiDuAn(id, checked);
      if (res.success) {
        setItems(prev => prev.map(item => item.ID_LOAI_DU_AN === id ? { ...item, HIEU_LUC: checked } : item));
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteDanhMucLoaiDuAn(id);
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
          placeholder="ID"
          value={newId}
          onChange={e => setNewId(e.target.value.toUpperCase().replace(/\s/g, ''))}
          className="w-28 border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-medium"
        />
        <div className="w-px bg-slate-200 shrink-0 my-1"></div>
        <Input
          placeholder="Tên Loại dự án mới..."
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
        />
        <Button onClick={handleAdd} disabled={isPending || !newId.trim() || !newValue.trim()} size="sm" className="shrink-0 rounded-md">
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
              <li key={item.ID_LOAI_DU_AN} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <span className={`font-medium ${!item.HIEU_LUC ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  <span className="text-slate-400 mr-2">[{item.ID_LOAI_DU_AN}]</span>
                  {item.LOAI_DU_AN}
                </span>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={item.HIEU_LUC}
                    onCheckedChange={(checked) => handleToggle(item.ID_LOAI_DU_AN, checked)}
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
                          Bạn có chắc muốn xoá <b>{item.LOAI_DU_AN}</b> không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.ID_LOAI_DU_AN)} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function NhomDuAnManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [loaiDuAnList, setLoaiDuAnList] = useState<any[]>([]);
  
  const [newId, setNewId] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newLoaiId, setNewLoaiId] = useState("");
  
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    const [resNhom, resLoai] = await Promise.all([
      getDanhMucNhomDuAn(),
      getDanhMucLoaiDuAn()
    ]);
    
    if (resNhom.success) setItems(resNhom.data as any[]);
    if (resLoai.success) setLoaiDuAnList(resLoai.data as any[]);
    
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAdd = async () => {
    if (!newId.trim() || !newValue.trim() || !newLoaiId) {
      toast.error("Vui lòng điền đủ Mã, Tên và chọn Loại dự án");
      return;
    }
    startTransition(async () => {
      const res = await addDanhMucNhomDuAn(newId, newValue, newLoaiId);
      if (res.success) {
        toast.success("Thêm thành công");
        setNewId("");
        setNewValue("");
        fetchData();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggle = async (id: string, checked: boolean) => {
    startTransition(async () => {
      const res = await toggleDanhMucNhomDuAn(id, checked);
      if (res.success) {
        setItems(prev => prev.map(item => item.ID_NHOM_DU_AN === id ? { ...item, HIEU_LUC: checked } : item));
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteDanhMucNhomDuAn(id);
      if (res.success) {
        toast.success("Xoá thành công");
        fetchData();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border shadow-sm">
        <div className="flex gap-2">
          <Input
            placeholder="ID Nhóm"
            value={newId}
            onChange={e => setNewId(e.target.value.toUpperCase().replace(/\s/g, ''))}
            className="w-1/4 border-slate-200"
          />
          <Input
            placeholder="Tên Nhóm dự án mới..."
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            className="flex-1 border-slate-200"
          />
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Select onValueChange={setNewLoaiId} value={newLoaiId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn Loại dự án thuộc về..." />
              </SelectTrigger>
              <SelectContent>
                {loaiDuAnList.map(loai => (
                  <SelectItem key={loai.ID_LOAI_DU_AN} value={loai.ID_LOAI_DU_AN}>
                    [{loai.ID_LOAI_DU_AN}] {loai.LOAI_DU_AN}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={handleAdd} disabled={isPending || !newId.trim() || !newValue.trim() || !newLoaiId} size="sm" className="shrink-0 w-32">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
            Thêm
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Chưa có dữ liệu</div>
        ) : (
          <ul className="divide-y">
            {items.map(item => (
              <li key={item.ID_NHOM_DU_AN} className="flex flex-col p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className={`font-medium ${!item.HIEU_LUC ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                      <span className="text-slate-400 mr-2">[{item.ID_NHOM_DU_AN}]</span>
                      {item.NHOM_DU_AN}
                    </span>
                    <span className="text-xs text-slate-500 mt-1">Loại: {item.LOAI_DU_AN_REL?.LOAI_DU_AN || item.ID_LOAI_DU_AN}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={item.HIEU_LUC}
                      onCheckedChange={(checked) => handleToggle(item.ID_NHOM_DU_AN, checked)}
                      disabled={isPending}
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
                            Bạn có chắc muốn xoá <b>{item.NHOM_DU_AN}</b> không?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Huỷ</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.ID_NHOM_DU_AN)} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function PhuLucHopDongManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [newId, setNewId] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getDanhMucPhuLucHopDong();
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
    if (!newId.trim() || !newValue.trim()) {
      toast.error("Vui lòng nhập cả Mã PLHĐ và Tên viết tắt đối tác");
      return;
    }
    startTransition(async () => {
      const res = await addDanhMucPhuLucHopDong(newId, newValue);
      if (res.success) {
        toast.success("Thêm thành công");
        setNewId("");
        setNewValue("");
        fetchItems();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggle = async (id: string, checked: boolean) => {
    startTransition(async () => {
      const res = await toggleDanhMucPhuLucHopDong(id, checked);
      if (res.success) {
        setItems(prev => prev.map(item => item.ID_PLHD === id ? { ...item, HIEU_LUC: checked } : item));
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteDanhMucPhuLucHopDong(id);
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
          placeholder="Mã PLHĐ (VD: PL01)"
          value={newId}
          onChange={e => setNewId(e.target.value.toUpperCase().replace(/\s/g, ''))}
          className="w-40 border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-medium"
        />
        <div className="w-px bg-slate-200 shrink-0 my-1"></div>
        <Input
          placeholder="Tên đối tác viết tắt (VD: VNG)"
          value={newValue}
          onChange={e => setNewValue(e.target.value.toUpperCase())}
          onKeyDown={e => e.key === "Enter" && handleAdd()}
          className="border-none focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none font-medium text-blue-600"
        />
        <Button onClick={handleAdd} disabled={isPending || !newId.trim() || !newValue.trim()} size="sm" className="shrink-0 rounded-md">
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
              <li key={item.ID_PLHD} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <span className={`font-medium ${!item.HIEU_LUC ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  <span className="text-slate-400 mr-2">[{item.ID_PLHD}]</span>
                  <span className="text-blue-600">{item.TEN_DOI_TAC_VIET_TAT}</span>
                </span>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={item.HIEU_LUC}
                    onCheckedChange={(checked) => handleToggle(item.ID_PLHD, checked)}
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
                          Bạn có chắc muốn xoá <b>{item.ID_PLHD}</b> không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.ID_PLHD)} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function HangMucManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getDanhMucHangMuc();
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
    if (!newValue.trim()) {
      toast.error("Vui lòng nhập tên Hạng mục");
      return;
    }
    startTransition(async () => {
      const res = await addDanhMucHangMuc(newValue);
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
      const res = await toggleDanhMucHangMuc(id, checked);
      if (res.success) {
        setItems(prev => prev.map(item => item.ID_HANG_MUC === id ? { ...item, HIEU_LUC: checked } : item));
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteDanhMucHangMuc(id);
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
          placeholder="Tên Hạng mục mới..."
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
              <li key={item.ID_HANG_MUC} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <span className={`font-medium ${!item.HIEU_LUC ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {item.TEN_HANG_MUC}
                </span>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={item.HIEU_LUC}
                    onCheckedChange={(checked) => handleToggle(item.ID_HANG_MUC, checked)}
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
                          Bạn có chắc muốn xoá <b>{item.TEN_HANG_MUC}</b> không? Hành động này không thể hoàn tác.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.ID_HANG_MUC)} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
