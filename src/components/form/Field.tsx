import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type FieldProps = {
  label?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Labeled input shell — uppercase label + bordered box that lifts on focus.
 * All text-like inputs compose this; screens never style a box themselves.
 */
export const Field = ({ label, hint, children, className }: FieldProps): ReactNode => (
  <label className="block">
    {label && (
      <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
        {label}
      </div>
    )}
    <div
      className={cx(
        "bg-white border border-ink-200 rounded-xl px-3.5 py-3 transition",
        "focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100",
        className,
      )}
    >
      {children}
    </div>
    {hint && <div className="text-[11px] text-ink-500 mt-1">{hint}</div>}
  </label>
);
