import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ImgPhProps = {
  label: string;
  h?: number;
  className?: string;
};

/** Hatched image placeholder. */
export const ImgPh = ({ label, h = 120, className }: ImgPhProps): ReactNode => (
  <div
    className={cx("hatch rounded-xl border border-ink-200 flex items-center justify-center", className)}
    style={{ height: h }}
  >
    <span className="font-mono text-[11px] text-ink-500 px-2 py-1 bg-white/80 rounded">{label}</span>
  </div>
);
