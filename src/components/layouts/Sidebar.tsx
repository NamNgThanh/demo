"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { menuGroups } from "@/config/navigation";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "../ui/sidebar";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChevronRight, LayoutDashboard, Package } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { SettingsSheet } from "./SettingsSheet";

interface AppSidebarProps {
  isAdmin: boolean;
}

export const AppSidebar = ({ isAdmin }: AppSidebarProps) => {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<string[]>([]);

  const isActive = (url: string) => {
    if (url === "/employees" && pathname.startsWith("/employees/map")) return false;
    return pathname === url || pathname.startsWith(url + '/');
  };

  const isGroupActive = useCallback((items: any[]): boolean => {
    return items.some(item => {
      if (item.items) return isGroupActive(item.items);
      return isActive(item.url);
    });
  }, [pathname]);

  useEffect(() => {
    const activeGroups: string[] = [];
    menuGroups.forEach(group => {
      if (!isAdmin && group.group !== "Công, Phép" && group.group !== "Hỗ trợ") return;
      if (isGroupActive(group.items)) activeGroups.push(group.group);
    });
    setOpenGroups(activeGroups);
  }, [pathname, isAdmin, isGroupActive]);

  const filteredMenuGroups = useMemo(() => {
    if (isAdmin) return menuGroups;
    console.log(isAdmin)

    return menuGroups.filter(group => {
      return group.group === "Công, Phép" || group.group === "Hỗ trợ";
    }).map(group => {
      if (group.group === "Công, Phép") {
        return {
          ...group,
          items: group.items.filter(item => item.url === "/attendance/check-in")
        };
      }
      return group;
    });
  }, [isAdmin]);

  const toggleGroup = (groupName: string) => {
    setOpenGroups(prev =>
      prev.includes(groupName) ? prev.filter(g => g !== groupName) : [...prev, groupName]
    );
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-stone-200/60 bg-stone-50/80 backdrop-blur-xl supports-backdrop-filter:bg-stone-50/50 shadow-sm">
      <SidebarHeader className="flex flex-row items-center justify-between h-14 border-b border-stone-300/50 p-0 pr-2 bg-transparent overflow-hidden transition-all">
        <Link
          href="/"
          className="flex h-full flex-1 items-center gap-2 px-4 transition-[padding] duration-200 group-data-[collapsible=icon]:px-2!"
        >
          <div className="flex aspect-square size-10 shrink-0 items-center justify-center rounded-lg text-sidebar-primary-foreground">
            <Avatar className="h-full w-full rounded-lg cursor-pointer transition-transform hover:scale-105">
              <AvatarImage src="/logo.png" alt="Logo" className="object-cover border-none" />
              <AvatarFallback className="rounded-lg bg-linear-to-br from-amber-600 to-yellow-700 text-white font-bold text-sm">
                W
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-1 flex-col overflow-hidden transition-all duration-300 group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:ml-0 text-left">
            <span className="truncate font-bold text-lg text-slate-800 leading-tight">
              WOWS HCNS
            </span>
          </div>
        </Link>
        {isAdmin && (
          <div className="group-data-[collapsible=icon]:hidden shrink-0">
            <SettingsSheet />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="p-3 gap-0">
        <SidebarMenu className="mb-3">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="default"
              tooltip="Dashboard"
              asChild
              className={
                isActive("/") || pathname === "/"
                  ? "bg-linear-to-r from-orange-50 to-amber-50/50 text-orange-900 rounded-xl font-bold shadow-sm ring-1 ring-orange-200/50 transition-all duration-300"
                  : "text-stone-500 hover:bg-stone-100/80 hover:text-stone-900 rounded-xl font-medium transition-all duration-200"
              }
            >
              <Link href="/" className="flex items-center gap-3 w-full h-10 px-3">
                <LayoutDashboard className="size-4 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden text-[13px]">Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {filteredMenuGroups.map((group, index) => {
          const isOpen = openGroups.includes(group.group);

          return (
            <Collapsible
              key={index}
              open={isOpen}
              onOpenChange={() => toggleGroup(group.group)}
              className="group/collapsible mb-2"
            >
              <SidebarGroup className="p-0">
                <CollapsibleTrigger asChild>
                  <SidebarGroupLabel
                    asChild
                    className="w-full justify-between cursor-pointer h-9 font-semibold text-slate-500 hover:text-slate-700 transition-colors duration-200 group-data-[collapsible=icon]:hidden"
                  >
                    <div className="flex items-center w-full select-none px-2" suppressHydrationWarning>
                      <div className="flex items-center gap-2 flex-1">
                        <group.icon className="size-4" />
                        <span className="text-[11px] uppercase tracking-wider">{group.group}</span>
                      </div>
                      <ChevronRight
                        className={`size-3.5 text-stone-400 transition-transform duration-300 ease-out ${isOpen ? 'rotate-90' : ''}`}
                      />
                    </div>
                  </SidebarGroupLabel>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <SidebarGroupContent className="py-1" suppressHydrationWarning>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const itemActive = isActive(item.url);

                        return (
                          <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton
                              asChild
                              size="sm"
                              tooltip={item.title}
                              className={`
                                h-10 text-[13px] transition-all duration-200 rounded-lg cursor-pointer
                                ${itemActive
                                  ? "text-orange-800 font-bold bg-linear-to-r from-orange-50/80 to-transparent border-l-[3px] border-orange-500/80 pl-2.5"
                                  : "text-stone-500 font-medium hover:text-stone-900 hover:bg-stone-100/50 pl-3 border-l-[3px] border-transparent"
                                }
                              `}
                            >
                              <Link href={item.url} className="flex items-center gap-3 w-full px-3 py-2.5 relative">
                                {item.icon ? (
                                  <item.icon className={`size-4 shrink-0 transition-transform duration-300 ${itemActive ? "text-orange-600 scale-110" : "text-stone-400 group-hover:text-stone-600"}`} />
                                ) : (
                                  <Package className="size-4 shrink-0" />
                                )}

                                <span className="truncate group-data-[collapsible=icon]:hidden">
                                  {item.title}
                                </span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  )
}