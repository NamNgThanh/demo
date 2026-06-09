"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectDetail } from "../types";
import { useState } from "react";
import { Link2, Plus, Trash2, Save, Users, Gift, FileText, UserCog } from "lucide-react";
import { toast } from "sonner";

interface ProjectItemDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: ProjectDetail | null;
}

export function ProjectItemDetailDialog({ open, onOpenChange, item }: ProjectItemDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("phan-bo");
  const [showAddEvidence, setShowAddEvidence] = useState(false);
  const [evidences, setEvidences] = useState([
    { id: 1, type: "Link App", link: "https://app.example.com", note: "Bản staging" }
  ]);
  
  const [newEvidence, setNewEvidence] = useState({ type: "", link: "", note: "" });

  if (!item) return null;

  const handleAddEvidence = () => {
    if (!newEvidence.type || !newEvidence.link) {
      toast.error("Vui lòng nhập Tên danh mục và Link");
      return;
    }
    setEvidences([...evidences, { id: Date.now(), ...newEvidence }]);
    setNewEvidence({ type: "", link: "", note: "" });
    setShowAddEvidence(false);
    toast.success("Đã thêm bằng chứng");
  };

  const handleDeleteEvidence = (id: number) => {
    setEvidences(evidences.filter(e => e.id !== id));
    toast.success("Đã xoá bằng chứng");
  };

  const menuItems = [
    { id: "phan-bo", label: "Phân bổ", icon: Users },
    { id: "treo-thuong", label: "Treo thưởng", icon: Gift },
    { id: "bang-chung", label: "Bằng chứng", icon: FileText },
    { id: "nhan-su", label: "Nhân sự duy trì", icon: UserCog },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl p-0 h-[80vh] flex flex-col overflow-hidden bg-slate-50 gap-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Chi tiết hạng mục dự án</DialogTitle>
          <DialogDescription>Chỉnh sửa các thông tin chi tiết của hạng mục</DialogDescription>
        </DialogHeader>

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
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-slate-800">
                  {menuItems.find(m => m.id === activeTab)?.label}
                </h3>
              </div>
              
              {/* PHÂN BỔ */}
              {activeTab === "phan-bo" && (
                <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="text-slate-600">Email sở hữu (EMAIL_SO_HUU)</Label>
                      <Input defaultValue="owner@wows.vn" placeholder="Nhập email..." className="bg-slate-50" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-slate-600">Nhân viên phụ trách</Label>
                        <Input defaultValue="Nguyễn Văn A" placeholder="Người phụ trách chính..." className="bg-slate-50" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-slate-600">Nhân viên hỗ trợ</Label>
                        <Input defaultValue="Trần Thị B" placeholder="Người hỗ trợ..." className="bg-slate-50" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label className="text-slate-600">Leader</Label>
                        <Input defaultValue="Lê Văn C" className="bg-slate-50" />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-slate-600">Deadline</Label>
                        <Input type="date" defaultValue={item.DEADLINE} className="bg-slate-50" />
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 px-6"><Save className="w-4 h-4 mr-2" /> Lưu Phân Bổ</Button>
                  </div>
                </div>
              )}

              {/* TREO THƯỞNG */}
              {activeTab === "treo-thuong" && (
                <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label className="text-slate-600">Số tiền (SO_TIEN)</Label>
                      <div className="relative">
                        <Input type="number" defaultValue={item.TREO_THUONG} className="pr-12 bg-slate-50 text-lg font-semibold text-green-700" />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">VNĐ</span>
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-slate-600">Thời hạn (THOI_HAN)</Label>
                      <Input type="date" className="bg-slate-50" />
                    </div>
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 px-6"><Save className="w-4 h-4 mr-2" /> Lưu Treo Thưởng</Button>
                  </div>
                </div>
              )}

              {/* BẰNG CHỨNG */}
              {activeTab === "bang-chung" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-end">
                    <Button onClick={() => setShowAddEvidence(!showAddEvidence)} size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-white shadow-sm">
                      <Plus className="w-4 h-4 mr-1" /> Thêm mới
                    </Button>
                  </div>

                  {showAddEvidence && (
                    <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 shadow-sm space-y-4 mb-4 animate-in fade-in slide-in-from-top-2">
                      <div className="grid gap-3">
                        <div className="grid gap-2">
                          <Label className="text-slate-700 font-semibold">Tên danh mục</Label>
                          <Select onValueChange={(val) => setNewEvidence({...newEvidence, type: val})}>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="-- Chọn danh mục --" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Link App">Link App</SelectItem>
                              <SelectItem value="Folder hệ thống">Folder hệ thống</SelectItem>
                              <SelectItem value="Link data">Link data</SelectItem>
                              <SelectItem value="Link HDSD">Link HDSD</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-slate-700 font-semibold">Link đính kèm</Label>
                          <Input 
                            placeholder="https://..." 
                            className="bg-white" 
                            value={newEvidence.link}
                            onChange={e => setNewEvidence({...newEvidence, link: e.target.value})}
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-slate-700 font-semibold">Ghi chú</Label>
                          <Input 
                            placeholder="Ghi chú thêm..." 
                            className="bg-white"
                            value={newEvidence.note}
                            onChange={e => setNewEvidence({...newEvidence, note: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="pt-2 flex justify-end gap-3">
                        <Button variant="ghost" onClick={() => setShowAddEvidence(false)}>Huỷ</Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 px-6" onClick={handleAddEvidence}>Lưu bằng chứng</Button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {evidences.length === 0 ? (
                      <div className="text-center p-8 bg-white border border-dashed border-slate-300 rounded-xl text-slate-400">
                        Chưa có bằng chứng nào được đính kèm
                      </div>
                    ) : (
                      evidences.map(ev => (
                        <div key={ev.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4 group hover:border-blue-200 transition-colors">
                          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
                            <Link2 className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-slate-800">{ev.type}</p>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-600 hover:bg-red-50 transition-all rounded-full"
                                onClick={() => handleDeleteEvidence(ev.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <a href={ev.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline truncate block mt-0.5">
                              {ev.link}
                            </a>
                            {ev.note && <p className="text-sm text-slate-500 mt-2 bg-slate-50 p-2 rounded-md border border-slate-100">{ev.note}</p>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* NHÂN SỰ DUY TRÌ */}
              {activeTab === "nhan-su" && (
                <div className="space-y-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <div className="grid gap-2">
                    <Label className="text-slate-600">Nhân sự duy trì (NHAN_SU)</Label>
                    <Input placeholder="Tên nhân sự hoặc email..." className="bg-slate-50" />
                  </div>
                  <div className="pt-4 flex justify-end">
                    <Button className="bg-blue-600 hover:bg-blue-700 px-6"><Save className="w-4 h-4 mr-2" /> Lưu Nhân Sự</Button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
