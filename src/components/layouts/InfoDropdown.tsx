import { ChevronDown, LogOut } from "lucide-react"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "../ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "../ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"

export const InfoDropdown = ({ user }: { user: any }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 cursor-pointer pl-1 pr-2 hover:bg-slate-100 rounded-full sm:rounded-xl h-10">
          <div className="relative">
            <Avatar className="h-8 w-8 border border-slate-200 shadow-sm">
              <AvatarFallback className="bg-linear-to-br from-yellow-700 to-yellow-600 text-white font-bold text-xs">
                {user?.username?.substring(0, 1).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>

          <div className="hidden md:flex flex-col items-start text-sm ml-1">
            <span className="font-bold text-slate-700 text-[13px] leading-tight uppercase tracking-tight">
              {user?.name || user?.username || "Admin"}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-slate-400 hidden sm:block ml-1" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64 p-0 overflow-hidden border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl mt-1">

        <div className="p-2 bg-white">
          <DropdownMenuLabel className="...">Tài khoản</DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-slate-100 my-1" />

          <DropdownMenuItem
            className="cursor-pointer rounded-xl focus:bg-red-50 focus:text-red-600 text-red-600 font-medium transition-colors group py-2.5"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <div className="w-8 h-8 rounded-full bg-red-100/50 flex items-center justify-center mr-3 text-red-500">
              <LogOut className="w-4 h-4 ml-0.5" />
            </div>
            Đăng xuất
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}