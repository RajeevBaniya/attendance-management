import type { SelectHTMLAttributes } from "react";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

const Select = ({ className = "", children, ...rest }: SelectProps) => {
  return (
    <select
      className={`focus-ring min-h-[42px] w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition focus:border-indigo-400 ${className}`}
      {...rest}
    >
      {children}
    </select>
  );
};

export { Select };
export type { SelectProps };
