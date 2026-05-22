import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ProgressBarProps = {
  /** 진행률 (0-1) */
  value: number;
  /** 색상 톤 */
  tone?: "brand" | "safe" | "warn" | "danger";
  /** 크기 */
  size?: "sm" | "md" | "lg";
  /** 레이블 표시 여부 */
  showLabel?: boolean;
  /** 애니메이션 효과 */
  animated?: boolean;
  className?: string;
};

const TONES = {
  brand: "bg-brand-600",
  safe: "bg-safe-500",
  warn: "bg-warn-500",
  danger: "bg-danger-600",
};

const SIZES = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

export const ProgressBar = ({
  value,
  tone = "brand",
  size = "md",
  showLabel = false,
  animated = false,
  className,
}: ProgressBarProps): ReactNode => {
  const percent = Math.max(0, Math.min(100, value * 100));

  return (
    <div className={cx("w-full", className)}>
      <div
        className={cx(
          "w-full bg-ink-200 rounded-full overflow-hidden",
          SIZES[size]
        )}
      >
        <div
          className={cx(
            "h-full rounded-full transition-all duration-300",
            TONES[tone],
            animated && "animate-pulse-soft"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-[11px] text-ink-500 text-right tnum">
          {Math.round(percent)}%
        </div>
      )}
    </div>
  );
};
