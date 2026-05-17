import { Card } from "../ui/card";

type AccountInfoCardProps = {
  title: string;
  items: Array<{ label: string; value: string }>;
};

const AccountInfoCard = ({ title, items }: AccountInfoCardProps) => {
  return (
    <Card>
      <h3 className="text-base font-semibold tracking-tight text-slate-100">{title}</h3>
      <dl className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2.5">
            <dt className="text-xs uppercase tracking-wide text-slate-400">{item.label}</dt>
            <dd className="mt-1 text-sm text-slate-100">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Card>
  );
};

export { AccountInfoCard };
export type { AccountInfoCardProps };
