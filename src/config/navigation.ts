import { LucideIcon, Users } from "lucide-react";

type MenuItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  items?: MenuItem[];
}

export type MenuGroup = {
  group: string;
  icon: LucideIcon;
  items: MenuItem[];
}

export const menuGroups: MenuGroup[] = [
  {
    group: "Nhân sự",
    icon: Users,
    items: [
      { title: "Quản lý nhân viên", url: "/employees", icon: Users },
    ]
  }
]