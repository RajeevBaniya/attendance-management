import type { ReactNode } from "react";

type DataRowProps = {
  cells: ReactNode[];
  mobileTitle?: string;
  mobileSubtitle?: string;
  mobileMeta?: ReactNode;
  isHeader?: boolean;
};

const DataRow = ({ cells, mobileTitle, mobileSubtitle, mobileMeta, isHeader = false }: DataRowProps) => {
  const desktopGridStyle = {
    gridTemplateColumns: `repeat(${cells.length}, minmax(0, 1fr))`,
  };

  if (isHeader) {
    return (
      <div
        className="hidden gap-3 border-b border-slate-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid"
        style={desktopGridStyle}
      >
        {cells.map((cell, index) => (
          <div key={`header-${index}`}>
            {cell}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3 transition hover:border-slate-700 hover:bg-slate-900 md:hidden">
        <p className="text-sm font-medium text-slate-100">{mobileTitle ?? "Record"}</p>
        {mobileSubtitle ? <p className="mt-1 text-xs text-slate-400">{mobileSubtitle}</p> : null}
        {mobileMeta ? <div className="mt-2 flex flex-wrap gap-2">{mobileMeta}</div> : null}
      </div>

      <div
        className="hidden gap-3 border-b border-slate-800/80 px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900/60 md:grid"
        style={desktopGridStyle}
      >
        {cells.map((cell, index) => (
          <div key={`cell-${index}`}>
            {cell}
          </div>
        ))}
      </div>
    </>
  );
};

export { DataRow };
export type { DataRowProps };
