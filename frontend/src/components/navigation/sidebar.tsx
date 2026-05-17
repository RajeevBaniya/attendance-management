import { SignOutButton } from "@clerk/clerk-react";

import { SidebarSection } from "./sidebarSection";
import { Button } from "../ui/button";
import type { NavigationSection } from "../../config/navigation";

type SidebarProps = {
  sections: NavigationSection[];
  roleLabel: string;
};

const Sidebar = ({ sections, roleLabel }: SidebarProps) => {
  return (
    <aside className="hidden h-[calc(100vh-1rem)] w-72 shrink-0 flex-col rounded-2xl border border-slate-800/90 bg-slate-950/85 p-4 shadow-[0_20px_50px_rgba(2,6,23,0.45)] backdrop-blur lg:flex">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-800 pb-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-indigo-500/40 bg-indigo-500/15 text-sm font-semibold text-indigo-200">
          A
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">Attendly</p>
          <p className="text-xs text-slate-400">Navigation</p>
        </div>
      </div>

      <div className="mb-4">
        <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
          {roleLabel}
        </span>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto pr-1">
        {sections.map((section) => (
          <SidebarSection key={section.id} section={section} />
        ))}
      </div>

      <div className="mt-4 border-t border-slate-800 pt-4">
        <SignOutButton>
          <Button variant="secondary" size="sm" className="w-full">
            Sign out
          </Button>
        </SignOutButton>
      </div>
    </aside>
  );
};

export { Sidebar };
export type { SidebarProps };
