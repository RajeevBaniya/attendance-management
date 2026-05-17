import { SignOutButton } from "@clerk/clerk-react";
import { useEffect } from "react";

import { SidebarSection } from "./sidebarSection";
import { Button } from "../ui/button";
import type { NavigationSection } from "../../config/navigation";

type MobileSidebarProps = {
  sections: NavigationSection[];
  roleLabel: string;
  isOpen: boolean;
  onClose: () => void;
};

const MobileSidebar = ({ sections, roleLabel, isOpen, onClose }: MobileSidebarProps) => {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <div className={`fixed inset-0 z-40 lg:hidden ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
      <div
        role="button"
        tabIndex={isOpen ? 0 : -1}
        aria-label="Close navigation drawer"
        onClick={onClose}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            onClose();
          }
        }}
        className={`absolute inset-0 bg-slate-950/55 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        id="mobile-navigation"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`absolute left-0 top-0 h-full w-[86vw] max-w-sm border-r border-slate-800 bg-slate-950/95 p-4 shadow-[0_20px_50px_rgba(2,6,23,0.6)] transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/40 bg-indigo-500/15 text-xs font-semibold text-indigo-200">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-100">Attendly</p>
              <p className="text-xs text-slate-400">Navigation</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="focus-ring min-h-[38px] rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-300"
            aria-label="Close menu"
          >
            Close
          </button>
        </div>

        <div className="mb-4">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
            {roleLabel}
          </span>
        </div>

        <div className="space-y-4 overflow-y-auto pb-24">
          {sections.map((section) => (
            <SidebarSection key={section.id} section={section} onNavigate={onClose} />
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4 border-t border-slate-800 pt-4">
          <SignOutButton>
            <Button variant="secondary" size="sm" className="w-full">
              Sign out
            </Button>
          </SignOutButton>
        </div>
      </aside>
    </div>
  );
};

export { MobileSidebar };
export type { MobileSidebarProps };
