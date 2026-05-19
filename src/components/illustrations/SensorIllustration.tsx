import type { ReactNode } from "react";

export type SensorIllustrationProps = {
  /** true = sensor attached, false = peeled off. */
  ok: boolean;
};

/** Torso + temperature-sensor disc; shifts/rotates when peeled off. */
export const SensorIllustration = ({ ok }: SensorIllustrationProps): ReactNode => (
  <svg viewBox="0 0 200 130" width="220" height="143">
    <path
      d="M40 90 Q40 60 80 55 Q120 50 160 60 L170 130 L30 130 Z"
      fill="#FCE7C8"
      stroke="#D4A574"
      strokeWidth="1.2"
    />
    <path d="M85 55 Q100 35 115 55" fill="#FCE7C8" stroke="#D4A574" strokeWidth="1.2" />
    <circle cx="100" cy="75" r="3" fill="#D4A574" />
    <g transform={`translate(${ok ? 100 : 115} 75) rotate(${ok ? 0 : -18})`}>
      <circle r="18" fill={ok ? "#DBEAFE" : "#FEE2E2"} stroke={ok ? "#3B82F6" : "#EF4444"} strokeWidth="1.6" />
      <circle r="11" fill="white" />
      <text
        textAnchor="middle"
        dy="3"
        fontSize="9"
        fontWeight="700"
        fill={ok ? "#1D4ED8" : "#B91C1C"}
        fontFamily="JetBrains Mono"
      >
        36.7
      </text>
      <line x1="-18" y1="0" x2="-30" y2="-8" stroke={ok ? "#3B82F6" : "#EF4444"} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="-18" y1="0" x2="-30" y2="8" stroke={ok ? "#3B82F6" : "#EF4444"} strokeWidth="1.5" strokeLinecap="round" />
    </g>
    {!ok && (
      <line
        x1="100"
        y1="75"
        x2="115"
        y2="75"
        stroke="#EF4444"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        opacity="0.6"
      />
    )}
  </svg>
);
