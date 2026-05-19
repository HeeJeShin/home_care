import type { ReactNode } from "react";

export type PhoneFrameProps = {
  children: ReactNode;
  label?: string;
  time?: string;
  battery?: number;
};

/** Generic dark-bezel phone mockup (no OS branding). */
export const PhoneFrame = ({
  children,
  label,
  time = "09:24",
  battery = 82,
}: PhoneFrameProps): ReactNode => (
  <div className="relative" style={{ width: 390 }}>
    {label && (
      <div className="absolute -top-7 left-2 text-[11px] font-medium text-ink-500 tracking-wide uppercase">
        {label}
      </div>
    )}
    <div className="bg-ink-900 rounded-[44px] p-[10px] shadow-pop">
      <div className="relative bg-white rounded-[36px] overflow-hidden" style={{ width: 370, height: 800 }}>
        <div className="absolute top-0 inset-x-0 h-11 z-30 flex items-center justify-between px-7 text-[13px] font-semibold text-ink-900 tnum pointer-events-none">
          <span>{time}</span>
          <div className="flex items-center gap-1.5 text-ink-800">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
              <path d="M1 7h2v2H1V7Zm4-2h2v4H5V5Zm4-2h2v6H9V3Zm4-2h2v8h-2V1Z" />
            </svg>
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M1 5a6 6 0 0 1 12 0" />
              <path d="M3.5 6.5a3.2 3.2 0 0 1 7 0" />
              <circle cx="7" cy="8.5" r=".7" fill="currentColor" stroke="none" />
            </svg>
            <div className="flex items-center gap-0.5 ml-0.5">
              <span className="text-[10px] font-medium">{battery}</span>
              <div className="w-6 h-2.5 rounded-[3px] border border-ink-800/80 relative flex items-center px-[1px]">
                <div className="h-full bg-ink-900 rounded-[1.5px]" style={{ width: `${battery * 0.22}px` }} />
                <div className="absolute -right-[3px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-ink-900 rounded-r" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[110px] h-[30px] rounded-full bg-ink-900 z-40" />
        <div className="h-full">{children}</div>
      </div>
    </div>
  </div>
);
