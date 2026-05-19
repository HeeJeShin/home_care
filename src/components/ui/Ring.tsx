import type { ReactNode } from "react";

export type RingProps = {
  /** 0..1 progress. */
  value: number;
  size?: number;
  stroke?: number;
  trackClass?: string;
  progressClass?: string;
  children?: ReactNode;
};

/** Circular progress ring with centred content. */
export const Ring = ({
  value,
  size = 180,
  stroke = 14,
  trackClass = "text-ink-100",
  progressClass = "text-brand-600",
  children,
}: RingProps): ReactNode => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = c * Math.max(0, Math.min(1, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" className={trackClass} strokeWidth={stroke} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          className={progressClass}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          style={{ transition: "stroke-dasharray .6s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
};
