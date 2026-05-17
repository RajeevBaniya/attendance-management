type StatusBadgeVariant = "success" | "danger" | "warning" | "neutral" | "info";

type StatusBadgeProps = {
  label: string;
  variant?: StatusBadgeVariant;
};

const statusVariantClasses: Record<StatusBadgeVariant, string> = {
  success: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
  danger: "border-rose-500/40 bg-rose-500/15 text-rose-200",
  warning: "border-amber-500/40 bg-amber-500/15 text-amber-200",
  info: "border-cyan-500/40 bg-cyan-500/15 text-cyan-200",
  neutral: "border-slate-700 bg-slate-900/75 text-slate-300",
};

const statusToVariantMap: Record<string, StatusBadgeVariant> = {
  PRESENT: "success",
  APPROVED: "success",
  ABSENT: "danger",
  REJECTED: "danger",
  PENDING: "warning",
  NOT_MARKED: "neutral",
  ACTIVE: "info",
};

const StatusBadge = ({ label, variant }: StatusBadgeProps) => {
  const normalizedLabel = label.trim().toUpperCase();
  const resolvedVariant = variant ?? statusToVariantMap[normalizedLabel] ?? "neutral";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${statusVariantClasses[resolvedVariant]}`}>
      {label}
    </span>
  );
};

export { StatusBadge };
export type { StatusBadgeProps, StatusBadgeVariant };
