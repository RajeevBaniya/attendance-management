import { useEffect } from "react";

type ToastVariant = "success" | "error" | "info";

type ToastProps = {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  durationMs: number;
  onClose: (id: string) => void;
};

const variantStyles: Record<ToastVariant, string> = {
  success: "border-emerald-500/40 bg-emerald-500/12 text-emerald-100",
  error: "border-rose-500/40 bg-rose-500/12 text-rose-100",
  info: "border-cyan-500/40 bg-cyan-500/12 text-cyan-100",
};

const Toast = ({ id, title, description, variant, durationMs, onClose }: ToastProps) => {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onClose(id);
    }, durationMs);

    return () => window.clearTimeout(timeoutId);
  }, [durationMs, id, onClose]);

  return (
    <article
      role={variant === "error" ? "alert" : "status"}
      aria-live={variant === "error" ? "assertive" : "polite"}
      className={`w-full max-w-sm rounded-xl border px-4 py-3 shadow-[0_12px_28px_rgba(2,6,23,0.45)] backdrop-blur ${variantStyles[variant]}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <p className="text-sm font-semibold">{title}</p>
          {description ? <p className="mt-1 text-xs text-slate-200/90">{description}</p> : null}
        </div>
        <button
          type="button"
          onClick={() => onClose(id)}
          className="focus-ring rounded-md border border-slate-600/60 bg-slate-900/55 px-2 py-1 text-[11px] text-slate-200"
          aria-label="Dismiss notification"
        >
          Close
        </button>
      </div>
    </article>
  );
};

export { Toast };
export type { ToastProps, ToastVariant };
