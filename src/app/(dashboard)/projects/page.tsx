import { Briefcase } from "lucide-react";
import { PageSectionHeader } from "@/components/layouts/PageSectionHeader";
import { ProjectBoard } from "@/features/projects/components/ProjectBoard";
import { getProjects } from "@/features/projects/action";

export default async function ProjectsPage() {
  const result = await getProjects();
  const projects = result.success ? result.data : [];

  return (
    <div className="space-y-3 p-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <PageSectionHeader
          icon={Briefcase}
          title="Thống kê Quản lý dự án"
          description="Theo dõi chi tiết tiến độ các dự án và hạng mục liên quan"
          iconClassName="w-10 h-10 text-blue-700"
          titleGradientClassName="from-blue-900 to-blue-700"
        />
      </div>

      <ProjectBoard initialData={projects || []} />
    </div>
  );
}
