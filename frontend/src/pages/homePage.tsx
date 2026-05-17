import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";

import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { RoleRedirect } from "../routes/roleRedirect";

const HomePage = () => {
  return (
    <>
      <SignedIn>
        <RoleRedirect />
      </SignedIn>
      <SignedOut>
        <main className="relative mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-4 py-10 sm:px-6">
          <Card className="w-full max-w-2xl p-6 sm:p-8 md:p-9">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Attendly
            </p>
            <h1 className="page-title mx-auto max-w-[22ch] text-center leading-tight">
              Role-based attendance that feels clear, fast and reliable.
            </h1>
            <p className="body-text mx-auto mt-4 max-w-[58ch] text-center leading-relaxed">
              Run institutions, batches, sessions, invites and attendance from
              one premium workspace with role-aware workflows.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
                Role-based workflows
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
                Live attendance tracking
              </span>
              <span className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1 text-xs text-slate-300">
                Institution operations
              </span>
            </div>

            <div className="mt-7 space-y-2 text-center">
              <p className="muted-text mb-2">
                Sign in to continue directly to your role dashboard.
              </p>
              <SignInButton mode="modal">
                <Button>Go to Login</Button>
              </SignInButton>
            </div>
          </Card>
        </main>
      </SignedOut>
    </>
  );
};

export { HomePage };
