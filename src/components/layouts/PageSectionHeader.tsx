import { LucideIcon } from "lucide-react";

interface PageSectionHeaderProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  iconClassName?: string;
  titleGradientClassName?: string;
}

export const PageSectionHeader = ({
  icon: Icon,
  title,
  description,
  iconClassName = "w-10 h-10 text-yellow-700",
  titleGradientClassName = "from-yellow-900 to-yellow-700",
}: PageSectionHeaderProps) => {
  return (
    <div className="flex items-center gap-4">
      <Icon className={iconClassName} />
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          <span
            className={`bg-clip-text text-transparent bg-linear-to-r ${titleGradientClassName}`}
          >
            {title}
          </span>
        </h2>
        {description && <p className="text-sm text-slate-500">{description}</p>}
      </div>
    </div>
  );
};
