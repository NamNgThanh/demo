"use client";

import { useMemo, useState } from "react";
import { Search, LayoutGrid, Layers, Filter, X, Package } from "lucide-react";
import { cn, removeAccents } from "@/lib/utils";
import { DashboardGroup } from "./DashboardGroup";
import { groupThemes } from "../constants";
import Link from "next/link";
import { MenuGroup, menuGroups } from "@/config/navigation";

export function DashboardExplorer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grouped" | "flat">("grouped");

  const initialMenuGroups = menuGroups;

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return initialMenuGroups;
    const lowerQuery = removeAccents(searchQuery.toLowerCase());
    return initialMenuGroups.map(group => ({
      ...group,
      items: group.items.filter((item: any) =>
        removeAccents((item.title || item.label || "").toLowerCase()).includes(lowerQuery)
      )
    })).filter(group => group.items.length > 0);
  }, [searchQuery, initialMenuGroups]);

  const flatItems = useMemo(() => {
    return filteredGroups.flatMap((group, groupIndex) =>
      group.items.map(item => ({
        ...item,
        theme: groupThemes[groupIndex % groupThemes.length]
      }))
    );
  }, [filteredGroups]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative z-10">
      <div className="sticky top-4 z-40 backdrop-blur-xl bg-white/80 border border-white/50 shadow-lg shadow-slate-200/40 rounded-2xl p-2 flex items-center justify-between">
        <div className="flex-1 flex items-center gap-3 px-4">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Tìm kiếm chức năng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-none focus:outline-none text-sm font-medium text-slate-700 placeholder:text-slate-400"
          />
          {searchQuery && (
            <X className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-pointer shrink-0" onClick={() => setSearchQuery("")} />
          )}
        </div>

        <div className="flex items-center gap-2 pr-2 shrink-0">
          <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
            <button
              onClick={() => setViewMode("grouped")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "grouped" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <Layers className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("flat")}
              className={cn("p-2 rounded-lg transition-all", viewMode === "flat" ? "bg-white text-amber-600 shadow-sm" : "text-slate-500 hover:text-slate-700")}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
          <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:shadow-sm hover:text-slate-700 transition-all">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pt-2">
        {viewMode === "grouped" ? (
          filteredGroups.map((group, index) => (
            <DashboardGroup
              key={group.group}
              group={group}
              index={index}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <div className="bg-white/60 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/80 shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

            <div className="flex items-center justify-between mb-8 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500 text-white shadow-lg">
                  <LayoutGrid size={22} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Tất cả chức năng</h2>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-full shadow-sm">
                <span className="text-emerald-600 font-bold text-sm">↗</span>
                <span className="text-slate-700 font-bold text-sm">{flatItems.length}</span>
                <span className="text-slate-400 text-sm hidden sm:inline">chức năng</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-5 relative z-10">
              {flatItems.map((item: any, idx: number) => (
                <Link href={item.url || "#"} key={idx} className="group flex flex-col items-center justify-center gap-3 p-4 sm:p-5 bg-white rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-amber-200 h-full">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner transition-transform duration-300 group-hover:scale-110 bg-linear-to-br shrink-0",
                    item.theme.icon
                  )}>
                    {item.icon ? <item.icon size={22} strokeWidth={2} /> : <Package size={22} strokeWidth={2} />}
                  </div>
                  <span className="text-[12px] font-bold text-slate-700 text-center line-clamp-2 group-hover:text-amber-700 transition-colors px-1 w-full leading-snug">
                    {item.title || item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}