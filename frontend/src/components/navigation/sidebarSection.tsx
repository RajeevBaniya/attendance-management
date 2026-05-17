import { NavItem } from "./navItem";
import type { NavigationSection } from "../../config/navigation";

type SidebarSectionProps = {
  section: NavigationSection;
  onNavigate?: () => void;
};

const SidebarSection = ({ section, onNavigate }: SidebarSectionProps) => {
  return (
    <section>
      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{section.label}</p>
      <div className="space-y-1.5">
        {section.items.map((item) => (
          <NavItem key={item.id} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </section>
  );
};

export { SidebarSection };
export type { SidebarSectionProps };
