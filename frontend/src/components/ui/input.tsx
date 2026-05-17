import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = ({ className = "", ...rest }: InputProps) => {
  return (
    <input
      className={`focus-ring min-h-[42px] w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-400 ${className}`}
      {...rest}
    />
  );
};

export { Input };
export type { InputProps };
