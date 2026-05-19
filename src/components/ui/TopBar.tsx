import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

export type TopBarProps = {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
  sub?: string;
  transparent?: boolean;
};

/** Screen header inside the phone viewport. */
export const TopBar = ({ title, left, right, sub, transparent }: TopBarProps): ReactNode => (
  <div className={cx("relative pt-12 pb-3 px-5", transparent ? "" : "bg-white border-b border-ink-100")}>
    <div className="flex items-center justify-between gap-3 h-8">
      <div className="flex-1 flex justify-start">{left}</div>
      <h1 className="text-[15px] font-semibold tracking-tight text-ink-900">{title}</h1>
      <div className="flex-1 flex justify-end">{right}</div>
    </div>
    {sub && <p className="mt-1 text-center text-[12px] text-ink-500">{sub}</p>}
  </div>
);
