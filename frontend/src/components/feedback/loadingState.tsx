type LoadingStateProps = {
  label: string;
};

const LoadingState = ({ label }: LoadingStateProps) => {
  return (
    <div role="status" aria-live="polite" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4">
      <div className="animate-pulse space-y-2">
        <div className="h-3 w-24 rounded bg-slate-700/70" />
        <div className="h-2 w-40 rounded bg-slate-800/80" />
      </div>
      <p className="mt-3 text-xs text-slate-400">{label}</p>
    </div>
  );
};

export { LoadingState };
export type { LoadingStateProps };
