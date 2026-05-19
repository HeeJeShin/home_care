import type { ReactNode } from "react";

/** Inline single-stroke SVG icon set — 1.6 weight, 24px viewbox. */
export type IconProps = {
  size?: number;
  stroke?: number;
  fill?: string;
  className?: string;
  children?: ReactNode;
};

export type IconComponent = (props: IconProps) => ReactNode;

const Icon = ({
  size = 20,
  stroke = 1.6,
  fill = "none",
  className = "",
  children,
}: IconProps): ReactNode => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={fill}
    stroke="currentColor"
    strokeWidth={stroke}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    {children}
  </svg>
);

export const I: Record<string, IconComponent> = {
  Home: (p) => (
    <Icon {...p}>
      <path d="M3 11.5 12 4l9 7.5" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </Icon>
  ),
  List: (p) => (
    <Icon {...p}>
      <path d="M4 6h16M4 12h16M4 18h10" />
    </Icon>
  ),
  Book: (p) => (
    <Icon {...p}>
      <path d="M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3V4Z" />
      <path d="M5 17a3 3 0 0 1 3-3h11" />
    </Icon>
  ),
  Settings: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 13a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 3.8 8a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H8.3a1.7 1.7 0 0 0 1-1.5V2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1Z" />
    </Icon>
  ),
  Check: (p) => (
    <Icon {...p}>
      <path d="M4 12.5 9 17 20 6" />
    </Icon>
  ),
  CheckCircle: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5 11 15.5 16 9.5" />
    </Icon>
  ),
  X: (p) => (
    <Icon {...p}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  ),
  ChevR: (p) => (
    <Icon {...p}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  ),
  ChevL: (p) => (
    <Icon {...p}>
      <path d="M15 6 9 12l6 6" />
    </Icon>
  ),
  ChevDown: (p) => (
    <Icon {...p}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  ),
  Bell: (p) => (
    <Icon {...p}>
      <path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2H4.5L6 16Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </Icon>
  ),
  Clock: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Icon>
  ),
  Phone: (p) => (
    <Icon {...p}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </Icon>
  ),
  Warn: (p) => (
    <Icon {...p}>
      <path d="M12 3 2 20h20L12 3Z" />
      <path d="M12 10v5M12 18v.5" />
    </Icon>
  ),
  Hospital: (p) => (
    <Icon {...p}>
      <path d="M4 20V8l8-4 8 4v12" />
      <path d="M10 20v-5h4v5" />
      <path d="M12 9v4M10 11h4" />
    </Icon>
  ),
  Share: (p) => (
    <Icon {...p}>
      <path d="M12 16V4M8 8l4-4 4 4" />
      <path d="M5 14v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5" />
    </Icon>
  ),
  Download: (p) => (
    <Icon {...p}>
      <path d="M12 4v12M7 11l5 5 5-5" />
      <path d="M5 20h14" />
    </Icon>
  ),
  Plus: (p) => (
    <Icon {...p}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  ),
  Flame: (p) => (
    <Icon {...p}>
      <path d="M12 3c1 4-3 4-3 8a3 3 0 0 0 3 3 3 3 0 0 0 3-3c0-2-1-3-1-5 3 1 4 4 4 7a6 6 0 0 1-12 0c0-5 5-6 6-10Z" />
    </Icon>
  ),
  Droplet: (p) => (
    <Icon {...p}>
      <path d="M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11Z" />
    </Icon>
  ),
  Lock: (p) => (
    <Icon {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </Icon>
  ),
  LockOpen: (p) => (
    <Icon {...p}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0" />
    </Icon>
  ),
  Thermometer: (p) => (
    <Icon {...p}>
      <path d="M10 4a2 2 0 0 1 4 0v10a4 4 0 1 1-4 0V4Z" />
      <path d="M12 8v6" />
    </Icon>
  ),
  User: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </Icon>
  ),
  Cal: (p) => (
    <Icon {...p}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 9h18M8 3v4M16 3v4" />
    </Icon>
  ),
  Refresh: (p) => (
    <Icon {...p}>
      <path d="M3 12a9 9 0 0 1 15.5-6.3L21 8" />
      <path d="M21 4v4h-4" />
      <path d="M21 12a9 9 0 0 1-15.5 6.3L3 16" />
      <path d="M3 20v-4h4" />
    </Icon>
  ),
  Camera: (p) => (
    <Icon {...p}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <circle cx="12" cy="13.5" r="3.5" />
      <path d="M8 7l2-3h4l2 3" />
    </Icon>
  ),
  Sun: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Icon>
  ),
  Moon: (p) => (
    <Icon {...p}>
      <path d="M20 14A8 8 0 1 1 10 4a7 7 0 0 0 10 10Z" />
    </Icon>
  ),
  Coffee: (p) => (
    <Icon {...p}>
      <path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" />
      <path d="M17 9h2a3 3 0 0 1 0 6h-2" />
      <path d="M8 2v3M12 2v3" />
    </Icon>
  ),
  Spark: (p) => (
    <Icon {...p}>
      <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    </Icon>
  ),
  Shield: (p) => (
    <Icon {...p}>
      <path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z" />
    </Icon>
  ),
  Heart: (p) => (
    <Icon {...p}>
      <path d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z" />
    </Icon>
  ),
  Info: (p) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8v.5" />
    </Icon>
  ),
  Dot: (p) => (
    <Icon {...p} fill="currentColor">
      <circle cx="12" cy="12" r="2" />
    </Icon>
  ),
};
