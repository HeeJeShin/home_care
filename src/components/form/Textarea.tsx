import type { ChangeEvent, ReactNode } from "react";

export type TextareaProps = {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
};

/** Multi-line note input with the shared focus-ring treatment. */
export const Textarea = ({
  label,
  value,
  onChange,
  placeholder,
  rows = 2,
}: TextareaProps): ReactNode => (
  <label className="block">
    {label && (
      <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider mb-1.5">
        {label}
      </div>
    )}
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      className="w-full bg-white border border-ink-200 rounded-xl p-3 text-[14px] outline-none focus:border-brand-500 focus:ring-2 ring-brand-100 resize-none"
    />
  </label>
);
