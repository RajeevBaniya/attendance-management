import type { ReactNode } from "react";

import { DataRow } from "./dataRow";
import { EmptyState } from "./emptyState";

type DataTableColumn<TItem> = {
  id: string;
  label: string;
  renderCell: (item: TItem) => ReactNode;
};

type DataTableProps<TItem> = {
  data: TItem[];
  columns: DataTableColumn<TItem>[];
  getKey: (item: TItem) => string;
  getMobileTitle: (item: TItem) => string;
  getMobileSubtitle?: (item: TItem) => string;
  getMobileMeta?: (item: TItem) => ReactNode;
  emptyTitle: string;
  emptyDescription?: string;
};

const DataTable = <TItem,>({
  data,
  columns,
  getKey,
  getMobileTitle,
  getMobileSubtitle,
  getMobileMeta,
  emptyTitle,
  emptyDescription,
}: DataTableProps<TItem>) => {
  if (data.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="space-y-2 md:space-y-0 md:overflow-hidden md:rounded-xl md:border md:border-slate-800 md:bg-slate-900/40">
      <DataRow isHeader cells={columns.map((column) => column.label)} />
      {data.map((item) => (
        <DataRow
          key={getKey(item)}
          cells={columns.map((column) => column.renderCell(item))}
          mobileTitle={getMobileTitle(item)}
          mobileSubtitle={getMobileSubtitle ? getMobileSubtitle(item) : undefined}
          mobileMeta={getMobileMeta ? getMobileMeta(item) : undefined}
        />
      ))}
    </div>
  );
};

export { DataTable };
export type { DataTableColumn, DataTableProps };
