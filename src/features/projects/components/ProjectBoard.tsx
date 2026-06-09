"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { ProjectDetailsSubTable } from "./ProjectDetailsSubTable";
import { Project } from "../types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddProjectDialog } from "./AddProjectDialog";

interface ProjectBoardProps {
  initialData: Project[];
}

export const ProjectBoard = ({ initialData }: ProjectBoardProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Danh sách dự án</h2>
        <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
          <Plus className="w-4 h-4 mr-2" /> Thêm Dự Án
        </Button>
      </div>

      <DataTable
        columns={columns as any}
        data={initialData}
        renderSubComponent={({ row }) => <ProjectDetailsSubTable project={row.original} />}
        emptyState="Không có dự án nào."
      />

      <AddProjectDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
};
