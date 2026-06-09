"use client";

import { Project, ProjectDetail } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useState } from "react";
import { ProjectItemDetailDialog } from "./ProjectItemDetailDialog";

interface ProjectDetailsSubTableProps {
  project: Project;
}

export function ProjectDetailsSubTable({ project }: ProjectDetailsSubTableProps) {
  const details = project.DS_DU_AN_CT;
  const [selectedDetail, setSelectedDetail] = useState<ProjectDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  if (!details || details.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 italic">
        Không có chi tiết dự án.
      </div>
    );
  }

  return (
    <div className="p-4 bg-slate-50/80 border-t border-b border-slate-100 shadow-inner w-full">
      <div className="rounded-lg border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-100/50">
            <TableRow>
              <TableHead className="w-[120px] font-semibold text-slate-700">Mã Chi Tiết</TableHead>
              <TableHead className="font-semibold text-slate-700">Tên Dự Án CT</TableHead>
              <TableHead className="font-semibold text-slate-700">Hạng Mục</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Tỷ Trọng</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Phân Bổ</TableHead>
              <TableHead className="font-semibold text-slate-700">Deadline</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Treo Thưởng</TableHead>
              <TableHead className="text-right font-semibold text-slate-700">Tiến Độ</TableHead>
              <TableHead className="font-semibold text-slate-700">Tình Trạng</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {details.map((detail) => (
              <TableRow key={detail.ID_DU_AN_CT} className="hover:bg-slate-50/50">
                <TableCell className="font-medium text-slate-600">{detail.ID_DU_AN_CT}</TableCell>
                <TableCell className="font-medium text-slate-900">{detail.TEN_DU_AN_CT}</TableCell>
                <TableCell className="text-slate-500 text-sm max-w-[200px] truncate" title={detail.DS_HANG_MUC}>
                  {detail.DS_HANG_MUC}
                </TableCell>
                <TableCell className="text-right">{detail.TY_TRONG}%</TableCell>
                <TableCell className="text-right">{detail.PHAN_BO}</TableCell>
                <TableCell>{detail.DEADLINE}</TableCell>
                <TableCell className="text-right font-medium text-green-600">
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(detail.TREO_THUONG)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs font-medium">{detail.THUC_TE}%</span>
                    <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-orange-400 rounded-full" 
                        style={{ width: `${detail.THUC_TE}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-slate-50">
                    {detail.TINH_TRANG}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                    onClick={() => {
                      setSelectedDetail(detail);
                      setIsDetailOpen(true);
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProjectItemDetailDialog 
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        item={selectedDetail}
      />
    </div>
  );
}
