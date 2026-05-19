import type { ReactNode } from "react";

export type PumpIllustrationProps = {
  /** 1 = full reservoir, 0 = empty. */
  remaining?: number;
  size?: number;
};

/** Schematic of the elastomeric home pump (balloon = drug reservoir). */
export const PumpIllustration = ({
  remaining = 0,
  size = 140,
}: PumpIllustrationProps): ReactNode => {
  const h = 90;
  const balloonY = 20 + (1 - remaining) * 40;
  const balloonR = 14 + remaining * 16;
  return (
    <svg viewBox="0 0 100 130" width={size} height={size * 1.3}>
      <rect x="42" y="2" width="16" height="6" rx="2" fill="#94A3B8" />
      <rect x="22" y="8" width="56" height={h} rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <line
          key={i}
          x1="76"
          x2={i % 2 === 0 ? 70 : 73}
          y1={16 + i * 8.5}
          y2={16 + i * 8.5}
          stroke="#94A3B8"
          strokeWidth="1"
        />
      ))}
      <ellipse
        cx="50"
        cy={balloonY + balloonR * 0.7}
        rx={balloonR}
        ry={balloonR * 1.1}
        fill="#FCD34D"
        opacity="0.9"
        stroke="#D97706"
        strokeWidth="1.2"
      />
      <ellipse
        cx={50 - balloonR * 0.3}
        cy={balloonY + balloonR * 0.4}
        rx={balloonR * 0.35}
        ry={balloonR * 0.5}
        fill="#FDE68A"
        opacity="0.6"
      />
      <rect x="22" y={8 + h} width="56" height="8" rx="3" fill="#94A3B8" />
      <path
        d={`M50 ${16 + h} Q50 ${24 + h} 60 ${28 + h} T80 ${36 + h}`}
        fill="none"
        stroke="#CBD5E1"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
};
