"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { ProjectDetailsSubTable } from "./ProjectDetailsSubTable";
import { Project } from "../types";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, X, Eye, EyeOff } from "lucide-react";
import { AddProjectDialog } from "./AddProjectDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";

interface ProjectBoardProps {
  initialData: Project[];
}

export const ProjectBoard = ({ initialData }: ProjectBoardProps) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [showBlurred, setShowBlurred] = useState(true);

  const clearDateFilter = () => {
    setDate(undefined);
  };

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
  };

  const filteredData = initialData.filter((p) => {
    if (date?.from) {
      const pDate = new Date(p.NGAY_DK_BAT_DAU);
      pDate.setHours(0, 0, 0, 0);
      const fromDate = new Date(date.from);
      fromDate.setHours(0, 0, 0, 0);
      
      if (date.to) {
        const toDate = new Date(date.to);
        toDate.setHours(23, 59, 59, 999);
        return pDate >= fromDate && pDate <= toDate;
      }
      return pDate >= fromDate;
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800">Danh sách dự án</h2>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[260px] justify-start text-left font-normal bg-white",
                    !date && "text-slate-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4 text-orange-500" />
                  <span className="flex-1">
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                        </>
                      ) : (
                        format(date.from, "dd/MM/yyyy")
                      )
                    ) : (
                      <span>Lọc theo ngày Bắt đầu</span>
                    )}
                  </span>
                  {date?.from && (
                    <div 
                      role="button"
                      tabIndex={0}
                      className="ml-2 h-4 w-4 opacity-50 hover:opacity-100 z-10 flex items-center justify-center"
                      onClick={clearDateFilter}
                      onPointerDown={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                      }}
                    >
                      <X className="h-full w-full" />
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={handleDateChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>

          <Button 
            variant="outline" 
            size="icon"
            className="bg-white"
            onClick={() => setShowBlurred(!showBlurred)}
            title={showBlurred ? "Ẩn các hạng mục đã làm mờ" : "Hiện các hạng mục đã làm mờ"}
          >
            {showBlurred ? <Eye className="h-4 w-4 text-slate-600" /> : <EyeOff className="h-4 w-4 text-slate-400" />}
          </Button>

          <Button onClick={() => setIsAddOpen(true)} className="bg-blue-600 hover:bg-blue-700 shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Thêm Dự Án
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns as any}
        data={filteredData}
        renderSubComponent={({ row }) => <ProjectDetailsSubTable project={row.original} showBlurred={showBlurred} />}
        emptyState="Không có dự án nào."
        headerClassName="bg-amber-100/60 hover:bg-amber-100/60"
      />

      <AddProjectDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </div>
  );
};
