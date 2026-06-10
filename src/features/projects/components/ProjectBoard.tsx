"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { ProjectDetailsSubTable } from "./ProjectDetailsSubTable";
import { Project } from "../types";
import { Button } from "@/components/ui/button";
import { Plus, Calendar as CalendarIcon, X, Eye, EyeOff, Search, Briefcase, Clock, AlertCircle, ListTodo } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "IN_PROGRESS" | "OVERDUE">("ALL");

  const clearDateFilter = () => {
    setDate(undefined);
  };

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate);
  };

  const baseFilteredData = initialData.filter((p) => {
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
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = p.ID_DU_AN?.toLowerCase().includes(q);
      const matchPartner = p.DOI_TAC?.toLowerCase().includes(q);
      const matchType = p.LOAI_DU_AN?.LOAI_DU_AN?.toLowerCase().includes(q);
      const matchGroup = p.NHOM_DU_AN?.some(n => n.NHOM_DU_AN?.toLowerCase().includes(q));

      if (!matchId && !matchPartner && !matchType && !matchGroup) {
        return false;
      }
    }

    return true;
  });

  const totalProjects = baseFilteredData.length;
  const overdueProjects = baseFilteredData.filter(p => p.NGAY_DK_HOAN_THANH && new Date(p.NGAY_DK_HOAN_THANH) < new Date()).length;
  const inProgressProjects = totalProjects - overdueProjects;
  const totalDetails = baseFilteredData.reduce((acc, p) => acc + (p.DS_DU_AN_CT?.length || 0), 0);

  const filteredData = baseFilteredData.filter(p => {
    if (statusFilter === "IN_PROGRESS") {
      return !(p.NGAY_DK_HOAN_THANH && new Date(p.NGAY_DK_HOAN_THANH) < new Date());
    }
    if (statusFilter === "OVERDUE") {
      return p.NGAY_DK_HOAN_THANH && new Date(p.NGAY_DK_HOAN_THANH) < new Date();
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card 
          className={cn("cursor-pointer transition-all hover:shadow-md", statusFilter === "ALL" ? "ring-2 ring-blue-500 bg-blue-50/50" : "hover:bg-slate-50")}
          onClick={() => setStatusFilter("ALL")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số Dự Án</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Dự án trong danh sách</p>
          </CardContent>
        </Card>
        <Card 
          className={cn("cursor-pointer transition-all hover:shadow-md", statusFilter === "IN_PROGRESS" ? "ring-2 ring-amber-500 bg-amber-50/50" : "hover:bg-slate-50")}
          onClick={() => setStatusFilter("IN_PROGRESS")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang triển khai</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Dự án còn trong hạn</p>
          </CardContent>
        </Card>
        <Card 
          className={cn("cursor-pointer transition-all hover:shadow-md", statusFilter === "OVERDUE" ? "ring-2 ring-red-500 bg-red-50/50" : "hover:bg-slate-50")}
          onClick={() => setStatusFilter("OVERDUE")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueProjects}</div>
            <p className="text-xs text-muted-foreground mt-1">Dự án trễ deadline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hạng mục chi tiết</CardTitle>
            <ListTodo className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDetails}</div>
            <p className="text-xs text-muted-foreground mt-1">Tổng CT thuộc các dự án trên</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full max-w-xs hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm dự án..."
              className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-amber-500 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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
