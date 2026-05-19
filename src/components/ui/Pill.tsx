import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type PillTone = "ink" | "brand" | "safe" | "warn" | "danger";

export type PillProps = {
  children: ReactNode;
  tone?: PillTone;
  className?: string;
};

const TONES: Record<PillTone, string> = {
  ink: "bg-ink-100 text-ink-700",
  brand: "bg-brand-50 text-brand-700",
  safe: "bg-safe-50 text-safe-700",
  warn: "bg-warn-50 text-warn-600",
  danger: "bg-danger-50 text-danger-700",
};

export const Pill = ({ children, tone = "ink", className }: PillProps): ReactNode => (
  <span
    className={cx(
      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold",
      TONES[tone],
      className,
    )}
  >
    {children}
  </span>
);
