import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "border border-indigo-500/50 bg-indigo-500/90 text-white hover:bg-indigo-400 active:bg-indigo-300 disabled:bg-indigo-500/50",
  secondary:
    "border border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800 active:bg-slate-700 disabled:bg-slate-900/40",
  ghost:
    "border border-slate-700/60 bg-transparent text-slate-300 hover:bg-slate-800/60 active:bg-slate-800/80 disabled:text-slate-500",
  danger:
    "border border-rose-600/40 bg-rose-600/15 text-rose-200 hover:bg-rose-600/25 active:bg-rose-600/35 disabled:opacity-60",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[38px] px-3 py-2 text-xs font-medium",
  md: "min-h-[42px] px-4 py-2.5 text-sm font-semibold",
};

const Button = ({
  type = "button",
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`focus-ring inline-flex items-center justify-center rounded-xl transition disabled:cursor-not-allowed disabled:opacity-60 ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
};

export { Button };
export type { ButtonProps, ButtonSize, ButtonVariant };
