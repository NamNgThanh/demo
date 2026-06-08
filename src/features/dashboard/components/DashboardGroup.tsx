"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Package, ChevronDown, ChevronUp, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { groupThemes } from "../constants";
import { MenuGroup } from "@/config/navigation";
import { Button } from "@/components/ui/button";

interface DashboardGroupProps {
  group: MenuGroup;
  index: number;
  searchQuery: string;
}

export function DashboardGroup({ group, index, searchQuery }: DashboardGroupProps) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const theme = groupThemes[index % groupThemes.length];

  useEffect(() => {
    if (searchQuery) setIsOpen(true);
  }, [searchQuery]);

  return (
    <div className="mb-8">
      <div
        className={cn(
          "flex items-center justify-between p-3 sm:p-4 rounded-xl bg-linear-to-r border shadow-sm cursor-pointer transition-all hover:shadow-md",
          theme.header
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <div className={cn("w-12 h-12 rounded-xl shadow-sm flex items-center justify-center bg-linear-to-br text-white shrink-0", theme.icon)}>
            {group.icon ? <group.icon size={22} strokeWidth={2.5} /> : <Package size={22} strokeWidth={2.5} />}
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2.5">
              <h3 className={cn("text-sm sm:text-lg font-bold uppercase tracking-tight", theme.text)}>
                {index + 1}. {group.group}
              </h3>
              <span className={cn("px-2 py-0.5 rounded-full text-white text-[10px] font-bold shadow-sm leading-none flex items-center justify-center", theme.badge)}>
                {group.items.length}
              </span>
            </div>
            <p className="text-[11px] font-semibold opacity-60 mt-0.5">{group.items.length} chức năng</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Button
            variant={"ghost"}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md shadow-emerald-500/20 transition-all active:scale-95"
          >
            <FileText size={14} /> Xem lưu đồ
          </Button>
          <div className="w-8 h-8 rounded-full bg-white/50 hover:bg-white/80 transition-colors flex items-center justify-center text-gray-600 shadow-sm">
            {isOpen ? <ChevronUp size={18} strokeWidth={2.5} /> : <ChevronDown size={18} strokeWidth={2.5} />}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 sm:gap-5 pt-4 pb-2">
              {group.items.map((item: any, idx: number) => (
                <Link href={item.url || "#"} key={idx} className="group flex flex-col items-center justify-center gap-3 p-4 sm:p-5 bg-white rounded-2xl shadow-sm hover:shadow-lg border border-slate-100 hover:border-amber-200 transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-inner transition-transform duration-300 group-hover:scale-110 bg-linear-to-br shrink-0",
                    theme.icon
                  )}>
                    {item.icon ? <item.icon size={22} strokeWidth={2} /> : <Package size={22} strokeWidth={2} />}
                  </div>
                  <span className="text-[12px] font-bold text-slate-700 text-center line-clamp-2 group-hover:text-amber-700 transition-colors px-1 w-full leading-snug">
                    {item.title || item.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}