"use client";

import { useEffect, useState } from "react";
import { Project } from "../types";
import { getFormRequestsByProjectId, getFormsData } from "../form_action";
import { Loader2, LayoutList, FolderTree } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function FormRequestTable({ project }: { project: Project }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [formsMap, setFormsMap] = useState<Record<string, string>>({});
  const [groupsMap, setGroupsMap] = useState<Record<string, string>>({});
  const [itemToGroupMap, setItemToGroupMap] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [groupBy, setGroupBy] = useState<"request" | "nhom">("request");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [reqRes, formsRes] = await Promise.all([
        getFormRequestsByProjectId(project.ID_DU_AN),
        getFormsData()
      ]);

      if (formsRes.success && formsRes.data) {
        const fMap: Record<string, string> = {};
        const gMap: Record<string, string> = {};
        const i2gMap: Record<string, string> = {};
        
        formsRes.data.forEach((g: any) => {
          gMap[g.ID_NHOM] = g.TEN_NHOM;
          g.DS_BM.forEach((b: any) => {
            fMap[b.id] = b.TEN_BM;
            i2gMap[b.id] = g.ID_NHOM;
          });
        });
        setFormsMap(fMap);
        setGroupsMap(gMap);
        setItemToGroupMap(i2gMap);
      }

      if (reqRes.success && reqRes.data) {
        setRequests(reqRes.data);
      }
      setIsLoading(false);
    }
    loadData();
  }, [project.ID_DU_AN]);

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div>;
  }

  if (requests.length === 0) {
    return <div className="p-8 text-center text-slate-500 italic bg-white rounded-lg border">Chưa có yêu cầu chuẩn bị biểu mẫu nào.</div>;
  }

  const renderGroupedByRequest = () => (
    <div className="space-y-4">
      {requests.map((req) => (
        <div key={req.ID_YC_BM} className="bg-white p-4 rounded-lg border shadow-sm transition-all hover:shadow-md">
          <div className="flex justify-between items-start border-b border-slate-100 pb-3 mb-3">
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-medium">Mã YC: {req.ID_YC_BM.slice(-6).toUpperCase()} • Tạo lúc: {new Date(req.createdAt).toLocaleString("vi-VN")}</div>
              {req.GHI_CHU && <div className="text-sm">Ghi chú: <span className="text-slate-700 italic">{req.GHI_CHU}</span></div>}
              {req.LINK && <div className="text-sm mt-1">Link: <a href={req.LINK} target="_blank" className="text-blue-600 hover:underline">{req.LINK}</a></div>}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-xs text-slate-500 uppercase tracking-wider mb-2">Danh sách biểu mẫu cần chuẩn bị ({req.BIEU_MAU_CAN.length})</h4>
            <div className="flex flex-wrap gap-2">
              {req.BIEU_MAU_CAN.map((bmId: string) => (
                <Badge key={bmId} variant="secondary" className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border-indigo-200 shadow-sm font-medium px-2.5 py-0.5">
                  {formsMap[bmId] || bmId}
                </Badge>
              ))}
            </div>
            {req.BIEU_MAU_CAN.length === 0 && <span className="text-sm text-slate-500 italic">Không có biểu mẫu cụ thể.</span>}
          </div>
        </div>
      ))}
    </div>
  );

  const renderGroupedByNhom = () => {
    // Aggregate all BIEU_MAU_CAN across all requests for this project
    const aggregatedForms = new Set<string>();
    requests.forEach(req => {
      req.BIEU_MAU_CAN.forEach((bmId: string) => aggregatedForms.add(bmId));
    });

    const groups: Record<string, string[]> = {};
    aggregatedForms.forEach(bmId => {
      const nhomId = itemToGroupMap[bmId] || "other";
      if (!groups[nhomId]) groups[nhomId] = [];
      groups[nhomId].push(bmId);
    });

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(groups).map(([nhomId, bmIds]) => (
          <div key={nhomId} className="bg-white p-4 rounded-lg border shadow-sm">
            <h3 className="font-bold text-slate-800 border-b pb-2 mb-3 text-sm">
              {groupsMap[nhomId] || "Nhóm khác"}
              <span className="ml-2 text-xs font-normal bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full">{bmIds.length}</span>
            </h3>
            <ul className="space-y-2">
              {bmIds.map(bmId => (
                <li key={bmId} className="text-sm text-slate-700 flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mr-2 shrink-0" />
                  {formsMap[bmId] || bmId}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">Danh sách Yêu cầu Biểu mẫu</h3>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setGroupBy("request")}
            className={`h-8 text-xs font-medium px-3 rounded-md transition-all ${groupBy === "request" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <LayoutList className="w-3.5 h-3.5 mr-1.5" />
            Theo lần yêu cầu
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setGroupBy("nhom")}
            className={`h-8 text-xs font-medium px-3 rounded-md transition-all ${groupBy === "nhom" ? "bg-white shadow-sm text-blue-600" : "text-slate-500 hover:text-slate-700"}`}
          >
            <FolderTree className="w-3.5 h-3.5 mr-1.5" />
            Gộp theo Nhóm BM
          </Button>
        </div>
      </div>
      
      {groupBy === "request" ? renderGroupedByRequest() : renderGroupedByNhom()}
    </div>
  );
}
