import { LucideIcon, Users, Briefcase } from "lucide-react";

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
    group: "Dự án",
    icon: Briefcase,
    items: [
      { title: "Quản lý dự án", url: "/projects", icon: Briefcase },
    ]
  },
  {
    group: "Nhân sự",
    icon: Users,
    items: [
      { title: "Quản lý nhân viên", url: "/employees", icon: Users },
    ]
  }
]