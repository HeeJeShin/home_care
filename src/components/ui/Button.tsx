import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant =
  | "primary"
  | "safe"
  | "danger"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger_outline";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
  full?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-700 shadow-sm",
  safe: "bg-safe-600 text-white hover:bg-safe-700 shadow-sm",
  danger: "bg-danger-600 text-white hover:bg-danger-700 shadow-sm",
  secondary: "bg-ink-100 text-ink-800 hover:bg-ink-200",
  outline: "bg-white text-ink-800 border border-ink-200 hover:bg-ink-50",
  ghost: "text-ink-700 hover:bg-ink-100",
  danger_outline: "bg-white text-danger-700 border border-danger-200 hover:bg-danger-50",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-[13px] rounded-lg",
  md: "h-11 px-4 text-[14px] rounded-xl",
  lg: "px-5 text-[15px] rounded-2xl",
};

export const Button = ({
  children,
  variant = "primary",
  size = "lg",
  icon,
  iconRight,
  full,
  className,
  ...rest
}: ButtonProps): ReactNode => (
  <button
    className={cx(
      "inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition active:scale-[.98] disabled:opacity-40 disabled:pointer-events-none",
      VARIANTS[variant],
      SIZES[size],
      full && "w-full",
      className,
    )}
    style={size === "lg" ? { height: 52 } : undefined}
    {...rest}
  >
    {icon}
    {children}
    {iconRight}
  </button>
);
