"use client";

import { menuGroups } from "@/config/navigation";
import Link from "next/link";
import { usePathname } from "next/navigation"
import { SidebarTrigger } from "../ui/sidebar";
import { LiveClock } from "./LiveClock";
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import { InfoDropdown } from "./InfoDropdown";
import { useSession } from "next-auth/react";

export const AppTaskbar = () => {
  const pathname = usePathname();
  const session = useSession();

  const renderBreadcrumb = () => {
    if (pathname === "/" || pathname === "/") {
      return <span className="text-slate-700 font-medium">Trang chủ</span>;
    }

    let currentMenuTitle = "";
    for (const group of menuGroups) {
      const foundItem = group.items.find(item => pathname.includes(item.url));
      if (foundItem) {
        currentMenuTitle = foundItem.title;
        break;
      }
    }

    return (
      <div className="flex items-center gap-2 text-sm sm:text-base">
        <Link href="/" className="text-slate-500 hover:text-amber-600 transition-colors font-medium">
          Trang chủ
        </Link>
        <span className="text-slate-400">/</span>
        <span className="text-slate-800 font-semibold">{currentMenuTitle || "Chi tiết"}</span>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100/60 bg-white/80 shadow-2xs backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="flex h-14 items-center justify-between w-full px-4 gap-4">
        <div className="flex items-center gap-1 sm:gap-3">
          <SidebarTrigger className="-ml-2 cursor-pointer text-slate-500 hover:text-slate-700 hover:bg-slate-100" />
          <div className="h-4 w-px bg-slate-200 hidden sm:block mx-1"></div>
          <div className="flex items-center gap-1">
            <div className="hidden sm:block ml-1">
              {renderBreadcrumb()}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 shrink-0">          
          <LiveClock />

          <Button variant="ghost" size="icon" className="relative cursor-pointer hover:bg-slate-100 rounded-full">
            <Bell className="h-5 w-5 text-slate-600" />
            <span className="absolute top-2 right-2 flex h-2 w-2 items-center justify-center rounded-full bg-red-500 ring-2 ring-white"></span>
          </Button>

          <InfoDropdown user={session.data?.user}/>

        </div>
      </div>
    </header>
  );
}