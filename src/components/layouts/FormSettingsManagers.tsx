"use client";

import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import {
  getDanhMucNhomBm,
  addDanhMucNhomBm,
  toggleDanhMucNhomBm,
  deleteDanhMucNhomBm,
  getDanhMucDsBm,
  addDanhMucDsBm,
  toggleDanhMucDsBm,
  deleteDanhMucDsBm,
  importBulkFormsFromExcel
} from "@/app/actions/settings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
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

export function NhomBmManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const res = await getDanhMucNhomBm();
    if (res.success && res.data) setItems(res.data as any[]);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!newId.trim() || !newName.trim()) {
      toast.error("Vui lòng nhập Mã và Tên Nhóm BM");
      return;
    }
    startTransition(async () => {
      const res = await addDanhMucNhomBm(newId.trim(), newName.trim());
      if (res.success) {
        toast.success("Thêm thành công");
        setNewId("");
        setNewName("");
        fetchItems();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggle = async (id: string, checked: boolean) => {
    startTransition(async () => {
      const res = await toggleDanhMucNhomBm(id, checked);
      if (res.success) fetchItems();
      else toast.error(res.error);
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteDanhMucNhomBm(id);
      if (res.success) {
        toast.success("Xoá thành công");
        fetchItems();
      } else toast.error(res.error);
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2 bg-white p-2 rounded-lg border shadow-sm">
        <Input placeholder="Mã Nhóm BM..." value={newId} onChange={e => setNewId(e.target.value)} className="w-1/3 border-none shadow-none" />
        <Input placeholder="Tên Nhóm BM..." value={newName} onChange={e => setNewName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAdd()} className="flex-1 border-none shadow-none" />
        <Button onClick={handleAdd} disabled={isPending || !newId.trim() || !newName.trim()} size="sm" className="shrink-0 rounded-md">
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />} Thêm
        </Button>
      </div>

      <div className="rounded-lg border bg-white overflow-y-auto max-h-[55vh] shadow-sm">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Chưa có dữ liệu</div>
        ) : (
          <ul className="divide-y">
            {items.map(item => (
              <li key={item.ID_NHOM} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">{item.ID_NHOM}</span>
                  <span className={`font-medium ${!item.HIEU_LUC ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.TEN_NHOM}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={item.HIEU_LUC} onCheckedChange={(checked) => handleToggle(item.ID_NHOM, checked)} disabled={isPending} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" disabled={isPending}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
                        <AlertDialogDescription>Bạn có chắc muốn xoá Nhóm BM này?</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Huỷ</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(item.ID_NHOM)} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
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

export function DsBmManager() {
  const [isPending, startTransition] = useTransition();
  const [items, setItems] = useState<any[]>([]);
  const [nhomBms, setNhomBms] = useState<any[]>([]);
  const [newId, setNewId] = useState("");
  const [newName, setNewName] = useState("");
  const [selectedNhom, setSelectedNhom] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const [resItems, resNhom] = await Promise.all([getDanhMucDsBm(), getDanhMucNhomBm()]);
    if (resItems.success && resItems.data) setItems(resItems.data as any[]);
    if (resNhom.success && resNhom.data) setNhomBms(resNhom.data as any[]);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const handleAdd = async () => {
    if (!newId.trim() || !newName.trim() || !selectedNhom) {
      toast.error("Vui lòng nhập đủ Mã, Tên và Chọn Nhóm BM");
      return;
    }
    startTransition(async () => {
      const res = await addDanhMucDsBm(newId.trim(), newName.trim(), selectedNhom);
      if (res.success) {
        toast.success("Thêm thành công");
        setNewId("");
        setNewName("");
        fetchItems();
      } else {
        toast.error(res.error);
      }
    });
  };

  const handleToggle = async (id: string, checked: boolean) => {
    startTransition(async () => {
      const res = await toggleDanhMucDsBm(id, checked);
      if (res.success) fetchItems();
      else toast.error(res.error);
    });
  };

  const handleDelete = async (id: string) => {
    startTransition(async () => {
      const res = await deleteDanhMucDsBm(id);
      if (res.success) {
        toast.success("Xoá thành công");
        fetchItems();
      } else toast.error(res.error);
    });
  };

  const [importOpen, setImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  const handleImport = async () => {
    if (!importText.trim()) {
      toast.error("Vui lòng dán nội dung từ Excel");
      return;
    }
    startTransition(async () => {
      const res = await importBulkFormsFromExcel(importText);
      if (res.success) {
        const data = res.data as { addedGroups: number, addedForms: number };
        toast.success(`Đã thêm/cập nhật thành công ${data.addedGroups} Nhóm và ${data.addedForms} Biểu mẫu!`);
        setImportOpen(false);
        setImportText("");
        fetchItems();
      } else {
        toast.error(res.error);
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-slate-50/50 p-2 rounded-lg border">
        <span className="text-sm text-slate-500 font-medium px-2">Quản lý Danh sách Biểu mẫu</span>
        <Dialog open={importOpen} onOpenChange={setImportOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white border-green-500 text-green-700 hover:bg-green-50">
              Nhập nhanh từ Excel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="shrink-0">
              <DialogTitle>Nhập Nhanh từ Excel</DialogTitle>
              <DialogDescription>
                Copy cột <b>NHÓM</b> và cột <b>TÊN BIỂU MẪU</b> từ file Excel và Paste vào ô bên dưới.
                Hệ thống tự động phát hiện ô gộp (merge cells) để phân nhóm.
              </DialogDescription>
            </DialogHeader>
            <Textarea 
              placeholder="Danh mục, quy cách chung&#9;1. Danh mục hàng hóa...&#10;&#9;2. Định mức nguyên vật liệu...&#10;Phòng kinh doanh&#9;1. Form báo giá" 
              className="flex-1 min-h-[300px] max-h-[60vh] overflow-y-auto font-mono text-xs whitespace-pre resize-none"
              style={{ fieldSizing: "fixed" } as React.CSSProperties}
              value={importText}
              onChange={e => setImportText(e.target.value)}
            />
            <AlertDialogFooter className="mt-4 shrink-0">
              <Button variant="outline" onClick={() => setImportOpen(false)}>Hủy</Button>
              <Button onClick={handleImport} disabled={isPending || !importText.trim()} className="bg-green-600 hover:bg-green-700">
                {isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Tiến hành Nhập
              </Button>
            </AlertDialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-2 bg-white p-3 rounded-lg border shadow-sm">
        <div className="flex gap-2">
          <Input placeholder="Mã Biểu Mẫu..." value={newId} onChange={e => setNewId(e.target.value)} className="w-1/3 shadow-none border-slate-200" />
          <Input placeholder="Tên Biểu Mẫu..." value={newName} onChange={e => setNewName(e.target.value)} className="flex-1 shadow-none border-slate-200" />
        </div>
        <div className="flex gap-2 items-center">
          <Select value={selectedNhom} onValueChange={setSelectedNhom}>
            <SelectTrigger className="flex-1"><SelectValue placeholder="Chọn Nhóm Biểu Mẫu" /></SelectTrigger>
            <SelectContent>
              {nhomBms.map(n => <SelectItem key={n.ID_NHOM} value={n.ID_NHOM}>{n.TEN_NHOM}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button onClick={handleAdd} disabled={isPending || !newId.trim() || !newName.trim() || !selectedNhom} className="shrink-0 rounded-md">
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />} Thêm
          </Button>
        </div>
      </div>

      <div className="rounded-lg border bg-white overflow-y-auto max-h-[55vh] shadow-sm">
        {loading ? (
          <div className="p-8 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Chưa có dữ liệu</div>
        ) : (
          <ul className="divide-y">
            {items.map(item => {
              const nhom = nhomBms.find(n => n.ID_NHOM === item.ID_NHOM);
              return (
                <li key={item.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs text-blue-600 font-medium mb-0.5">{nhom?.TEN_NHOM || item.ID_NHOM}</span>
                    <span className="text-xs text-slate-500">{item.ID_BM}</span>
                    <span className={`font-medium ${!item.HIEU_LUC ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{item.TEN_BM}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={item.HIEU_LUC} onCheckedChange={(checked) => handleToggle(item.id, checked)} disabled={isPending} />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" disabled={isPending}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Xác nhận xoá?</AlertDialogTitle>
                          <AlertDialogDescription>Bạn có chắc muốn xoá Biểu mẫu này?</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Huỷ</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-red-600 hover:bg-red-700">Xoá</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
