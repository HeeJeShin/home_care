"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { I } from "@/components/icons";

export type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: ReactNode;
  description?: string;
  disabled?: boolean;
  tone?: "brand" | "safe" | "warn" | "danger";
  className?: string;
};

const TONES = {
  brand: {
    bg: "bg-brand-600",
    border: "border-brand-600",
    text: "text-brand-700",
  },
  safe: {
    bg: "bg-safe-500",
    border: "border-safe-500",
    text: "text-safe-700",
  },
  warn: {
    bg: "bg-warn-500",
    border: "border-warn-500",
    text: "text-warn-700",
  },
  danger: {
    bg: "bg-danger-600",
    border: "border-danger-600",
    text: "text-danger-700",
  },
};

export const Checkbox = ({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  tone = "brand",
  className,
}: CheckboxProps): ReactNode => {
  const colors = TONES[tone];

  return (
    <label
      className={cx(
        "flex items-start gap-3 cursor-pointer select-none",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={cx(
          "w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all mt-0.5",
          checked
            ? `${colors.bg} ${colors.border} text-white`
            : "border-ink-300 bg-white"
        )}
      >
        {checked && <I.Check size={14} stroke={3} />}
      </button>
      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <div
              className={cx(
                "text-[14px] font-semibold",
                checked ? colors.text : "text-ink-800"
              )}
            >
              {label}
            </div>
          )}
          {description && (
            <div className="text-[12px] text-ink-500 mt-0.5">{description}</div>
          )}
        </div>
      )}
    </label>
  );
};
