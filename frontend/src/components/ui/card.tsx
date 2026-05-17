import type { HTMLAttributes, ReactNode } from "react";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

const Card = ({ className = "", children, ...rest }: CardProps) => {
  return (
    <section
      className={`rounded-2xl border border-slate-800/90 bg-slate-900/50 p-4 shadow-[0_0_0_1px_rgba(15,23,42,0.2),0_8px_30px_rgba(2,6,23,0.35)] backdrop-blur sm:p-5 lg:p-6 ${className}`}
      {...rest}
    >
      {children}
    </section>
  );
};

export { Card };
export type { CardProps };
