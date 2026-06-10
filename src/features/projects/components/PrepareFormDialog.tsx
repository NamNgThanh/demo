"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { getFormsData, saveFormRequest } from "../form_action";
import { Project } from "../types";
import { Loader2 } from "lucide-react";

interface FormItem {
  id: string;
  ID_BM: string;
  TEN_BM: string;
}

interface FormGroup {
  ID_NHOM: string;
  TEN_NHOM: string;
  DS_BM: FormItem[];
}

export function PrepareFormDialog({ project, children }: { project: Project, children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [groups, setGroups] = useState<FormGroup[]>([]);
  
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  
  const [ghiChu, setGhiChu] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      getFormsData().then(res => {
        if (res.success && res.data) {
          setGroups(res.data);
          // Default select all
          const allGroups = new Set(res.data.map((g: any) => g.ID_NHOM));
          const allItems = new Set(res.data.flatMap((g: any) => g.DS_BM.map((b: any) => b.id)));
          setSelectedGroups(allGroups);
          setSelectedItems(allItems);
        } else {
          toast.error("Không thể tải danh sách biểu mẫu");
        }
        setIsLoading(false);
      });
    }
  }, [open]);

  const handleToggleGroup = (groupId: string, items: FormItem[]) => {
    const newGroups = new Set(selectedGroups);
    const newItems = new Set(selectedItems);
    
    if (newGroups.has(groupId)) {
      newGroups.delete(groupId);
      items.forEach(item => newItems.delete(item.id));
    } else {
      newGroups.add(groupId);
      items.forEach(item => newItems.add(item.id));
    }
    
    setSelectedGroups(newGroups);
    setSelectedItems(newItems);
  };

  const handleToggleItem = (groupId: string, itemId: string, totalItemsInGroup: number) => {
    const newItems = new Set(selectedItems);
    const newGroups = new Set(selectedGroups);
    
    if (newItems.has(itemId)) {
      newItems.delete(itemId);
      newGroups.delete(groupId); // If one is unselected, group is no longer "fully" selected
    } else {
      newItems.add(itemId);
      // Check if all items in this group are now selected
      const groupItems = groups.find(g => g.ID_NHOM === groupId)?.DS_BM || [];
      const allSelected = groupItems.every(i => newItems.has(i.id));
      if (allSelected) {
        newGroups.add(groupId);
      }
    }
    
    setSelectedItems(newItems);
    setSelectedGroups(newGroups);
  };

  const handleSave = async () => {
    setIsSaving(true);
    const res = await saveFormRequest({
      ID_DU_AN: project.ID_DU_AN,
      NHOM_BIEU_MAU: Array.from(selectedGroups),
      BIEU_MAU_CAN: Array.from(selectedItems),
      GHI_CHU: ghiChu,
      LINK: link
    });
    
    if (res.success) {
      toast.success("Lưu thành công!");
      setOpen(false);
    } else {
      toast.error(res.error || "Có lỗi xảy ra");
    }
    setIsSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Chuẩn bị biểu mẫu cho dự án: {project.ID_DU_AN}</DialogTitle>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto pr-2 space-y-6 mt-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Khách hàng (Trích xuất)</Label>
                  <Input value={project.DOI_TAC || ""} disabled className="bg-slate-50 text-slate-500 font-medium" />
                </div>
                <div className="space-y-2">
                  <Label>Link đính kèm</Label>
                  <Input placeholder="https://..." value={link} onChange={e => setLink(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Ghi chú</Label>
                <Textarea placeholder="Nhập ghi chú thêm nếu có..." value={ghiChu} onChange={e => setGhiChu(e.target.value)} />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-base">Chọn biểu mẫu cần thiết</Label>
              <div className="border rounded-md divide-y overflow-hidden">
                {groups.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">Chưa có dữ liệu biểu mẫu trong hệ thống.</div>
                ) : (
                  groups.map((group) => (
                    <div key={group.ID_NHOM} className="bg-white">
                      <div className="flex items-center space-x-2 p-3 bg-slate-50 hover:bg-slate-100 transition-colors">
                        <Checkbox 
                          id={`group-${group.ID_NHOM}`}
                          checked={selectedGroups.has(group.ID_NHOM) || (group.DS_BM.length > 0 && group.DS_BM.every(i => selectedItems.has(i.id)))}
                          onCheckedChange={() => handleToggleGroup(group.ID_NHOM, group.DS_BM)}
                        />
                        <Label htmlFor={`group-${group.ID_NHOM}`} className="font-semibold cursor-pointer select-none">
                          {group.TEN_NHOM}
                        </Label>
                      </div>
                      <div className="p-3 pl-10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {group.DS_BM.map((item) => (
                          <div key={item.id} className="flex items-start space-x-2">
                            <Checkbox 
                              id={`item-${item.id}`}
                              checked={selectedItems.has(item.id)}
                              onCheckedChange={() => handleToggleItem(group.ID_NHOM, item.id, group.DS_BM.length)}
                            />
                            <Label htmlFor={`item-${item.id}`} className="text-sm cursor-pointer select-none leading-tight font-normal">
                              {item.TEN_BM}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Lưu yêu cầu
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
