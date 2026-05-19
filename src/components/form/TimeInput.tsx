import type { ChangeEvent, ReactNode } from "react";
import { Field } from "./Field";

export type TimeInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  hint?: string;
  /** "field" = full bordered Field; "chip" = compact inline pill. */
  variant?: "field" | "chip";
};

/** `<input type="time">` — Field wrapper or a compact chip (used by alarms). */
export const TimeInput = ({
  value,
  onChange,
  label,
  hint,
  variant = "field",
}: TimeInputProps): ReactNode => {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value);

  if (variant === "chip") {
    return (
      <input
        type="time"
        value={value}
        onChange={handle}
        aria-label={label}
        className="text-[18px] font-semibold tnum bg-ink-50 px-3 py-1.5 rounded-lg outline-none focus:ring-2 ring-brand-200"
      />
    );
  }

  return (
    <Field label={label} hint={hint}>
      <input
        type="time"
        value={value}
        onChange={handle}
        className="w-full bg-transparent text-[16px] font-medium outline-none tnum"
      />
    </Field>
  );
};
