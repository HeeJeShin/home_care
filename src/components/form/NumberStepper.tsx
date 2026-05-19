import type { ChangeEvent, ReactNode } from "react";

export type NumberStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

/** Big −/＋ numeric stepper with a clamped centre input (pump scale entry). */
export const NumberStepper = ({
  value,
  onChange,
  min = 0,
  max = 150,
  step = 1,
}: NumberStepperProps): ReactNode => {
  const clamp = (n: number): number => Math.max(min, Math.min(max, n));

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="감소"
        onClick={() => onChange(clamp(value - step))}
        className="w-11 h-11 rounded-xl bg-ink-100 hover:bg-ink-200 flex items-center justify-center"
      >
        <span className="text-[20px] font-bold">−</span>
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(clamp(Number(e.target.value) || 0))}
        className="flex-1 h-11 text-center text-[28px] font-bold tnum bg-ink-50 rounded-xl outline-none focus:ring-2 ring-brand-200"
      />
      <button
        type="button"
        aria-label="증가"
        onClick={() => onChange(clamp(value + step))}
        className="w-11 h-11 rounded-xl bg-ink-100 hover:bg-ink-200 flex items-center justify-center"
      >
        <span className="text-[20px] font-bold">＋</span>
      </button>
    </div>
  );
};
