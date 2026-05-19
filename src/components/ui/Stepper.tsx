import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type StepperProps = {
  step: number;
  total: number;
};

/** Progress segments for a multi-step flow. */
export const Stepper = ({ step, total }: StepperProps): ReactNode => (
  <div className="flex gap-1.5">
    {Array.from({ length: total }).map((_, i) => (
      <div
        key={i}
        className={cx(
          "h-1.5 flex-1 rounded-full transition-all",
          i <= step ? "bg-brand-600" : "bg-ink-200",
        )}
      />
    ))}
  </div>
);
