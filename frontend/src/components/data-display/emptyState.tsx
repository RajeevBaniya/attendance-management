type EmptyStateProps = {
  title: string;
  description?: string;
};

const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div className="rounded-xl border border-dashed border-slate-700 bg-slate-900/40 p-4 text-center sm:p-5">
      <p className="text-sm font-medium text-slate-200">{title}</p>
      {description ? <p className="mt-1 text-xs text-slate-400">{description}</p> : null}
    </div>
  );
};

export { EmptyState };
export type { EmptyStateProps };
