type MetricBadgeTone = "neutral" | "positive" | "warning";

type MetricBadgeProps = {
  label: string;
  tone?: MetricBadgeTone;
};

const toneClasses: Record<MetricBadgeTone, string> = {
  neutral: "border-slate-700 bg-slate-900/80 text-slate-300",
  positive: "border-emerald-500/40 bg-emerald-500/15 text-emerald-200",
  warning: "border-amber-500/40 bg-amber-500/15 text-amber-200",
};

const MetricBadge = ({ label, tone = "neutral" }: MetricBadgeProps) => {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${toneClasses[tone]}`}>
      {label}
    </span>
  );
};

export { MetricBadge };
export type { MetricBadgeProps, MetricBadgeTone };
