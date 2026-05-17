import { NavLink } from "react-router-dom";

import type { NavigationItem } from "../../config/navigation";

type NavItemProps = {
  item: NavigationItem;
  onNavigate?: () => void;
};

const NavItem = ({ item, onNavigate }: NavItemProps) => {
  return (
    <NavLink
      to={item.to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `focus-ring group flex min-h-[42px] items-center justify-between rounded-xl border px-3 py-2 text-sm transition ${
          isActive
            ? "border-indigo-500/50 bg-indigo-500/15 text-indigo-100 shadow-[0_0_20px_rgba(99,102,241,0.18)]"
            : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-900/70 hover:text-slate-100"
        }`
      }
    >
      <span>{item.label}</span>
      <span className="text-[11px] text-slate-500 group-hover:text-slate-400">#</span>
    </NavLink>
  );
};

export { NavItem };
export type { NavItemProps };
