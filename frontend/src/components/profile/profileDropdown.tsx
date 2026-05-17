import { SignOutButton, useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { useAuthContext } from "../../hooks/useAuthContext";
import { ProfileAvatar } from "./profileAvatar";
import { Button } from "../ui/button";

const ProfileDropdown = () => {
  const { user } = useUser();
  const { backendUser, role } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }

      if (!containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", handleDocumentClick);
    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("mousedown", handleDocumentClick);
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((currentState) => !currentState)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="profile-menu"
        className="focus-ring flex min-h-[38px] items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-left hover:bg-slate-800/80"
      >
        <ProfileAvatar name={backendUser?.name ?? null} email={backendUser?.email ?? user?.primaryEmailAddress?.emailAddress ?? null} />
        <span className="hidden max-w-[160px] truncate text-xs text-slate-300 sm:inline">
          {backendUser?.name ?? user?.firstName ?? "Account"}
        </span>
      </button>

      {isOpen ? (
        <div
          id="profile-menu"
          role="menu"
          className="absolute right-0 z-40 mt-2 w-72 rounded-xl border border-slate-800 bg-slate-950/95 p-3 shadow-[0_20px_50px_rgba(2,6,23,0.6)] backdrop-blur"
        >
          <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-3">
            <p className="text-sm font-semibold text-slate-100">{backendUser?.name ?? "Account"}</p>
            <p className="mt-1 truncate text-xs text-slate-400">
              {backendUser?.email ?? user?.primaryEmailAddress?.emailAddress ?? "No email"}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-200">
                {role ?? "Unknown"}
              </span>
              <span className="rounded-full border border-slate-700 px-2 py-0.5 text-[11px] text-slate-300">
                Clerk linked
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            <Link
              to="/settings"
              role="menuitem"
              onClick={() => setIsOpen(false)}
              className="block rounded-lg border border-transparent px-3 py-2 text-sm text-slate-200 hover:border-slate-700 hover:bg-slate-900/70"
            >
              Settings
            </Link>
            <SignOutButton>
              <Button variant="secondary" size="sm" className="w-full" role="menuitem">
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export { ProfileDropdown };
