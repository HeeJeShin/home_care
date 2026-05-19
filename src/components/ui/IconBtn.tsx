import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type IconBtnProps = {
  children: ReactNode;
  onClick?: () => void;
  label: string;
  className?: string;
};

export const IconBtn = ({ children, onClick, label, className }: IconBtnProps): ReactNode => (
  <button
    onClick={onClick}
    aria-label={label}
    className={cx(
      "w-9 h-9 rounded-full flex items-center justify-center text-ink-700 hover:bg-ink-100 active:scale-95 transition",
      className,
    )}
  >
    {children}
  </button>
);
