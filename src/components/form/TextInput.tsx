import type { ChangeEvent, HTMLInputTypeAttribute, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { Field } from "./Field";

export type TextInputProps = {
  label?: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Tabular numerals — for IDs, dates, times. */
  tnum?: boolean;
  type?: HTMLInputTypeAttribute;
};

/**
 * Single-line text input wrapped in {@link Field}.
 * Shared by every plain text / number-as-text field in the app.
 */
export const TextInput = ({
  label,
  hint,
  value,
  onChange,
  placeholder,
  tnum,
  type = "text",
}: TextInputProps): ReactNode => (
  <Field label={label} hint={hint}>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      className={cx(
        "w-full bg-transparent text-[16px] font-medium outline-none",
        tnum && "tnum",
      )}
    />
  </Field>
);
