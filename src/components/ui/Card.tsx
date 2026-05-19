import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type CardProps = {
  children: ReactNode;
  className?: string;
};

export const Card = ({ children, className }: CardProps): ReactNode => (
  <div className={cx("bg-white rounded-2xl shadow-card border border-ink-100", className)}>
    {children}
  </div>
);
