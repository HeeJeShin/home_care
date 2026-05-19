import type { ChangeEvent, ReactNode } from "react";
import { Field } from "./Field";

export type DateInputProps = {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
};

/** `<input type="date">` wrapped in {@link Field}. */
export const DateInput = ({ label, hint, value, onChange }: DateInputProps): ReactNode => (
  <Field label={label} hint={hint}>
    <input
      type="date"
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className="w-full bg-transparent text-[16px] font-medium outline-none tnum"
    />
  </Field>
);
