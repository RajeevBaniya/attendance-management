import type { ReactNode } from "react";

import { Card } from "../ui/card";

type StatCardProps = {
  title: string;
  value: string;
  helperText?: string;
  badge?: ReactNode;
};

const StatCard = ({ title, value, helperText, badge }: StatCardProps) => {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{title}</p>
        {badge ? <div>{badge}</div> : null}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-100">{value}</p>
      {helperText ? <p className="mt-1 text-xs text-slate-400">{helperText}</p> : null}
    </Card>
  );
};

export { StatCard };
export type { StatCardProps };
