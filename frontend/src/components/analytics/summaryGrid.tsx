import { StatCard } from "./statCard";
import type { ReactNode } from "react";
import type { MetricBadgeProps } from "./metricBadge";

type SummaryGridItem = {
  title: string;
  value: string;
  helperText?: string;
  badge?: MetricBadgeProps;
};

type SummaryGridProps = {
  items: SummaryGridItem[];
  renderBadge: (badge: MetricBadgeProps) => ReactNode;
};

const SummaryGrid = ({ items, renderBadge }: SummaryGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => (
        <StatCard
          key={item.title}
          title={item.title}
          value={item.value}
          helperText={item.helperText}
          badge={item.badge ? renderBadge(item.badge) : undefined}
        />
      ))}
    </div>
  );
};

export { SummaryGrid };
export type { SummaryGridItem, SummaryGridProps };
