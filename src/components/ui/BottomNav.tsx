import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { I, type IconComponent } from "@/components/icons";
import { useApp } from "@/state/AppContext";
import type { Route } from "@/types";

type NavItem = {
  id: Route;
  icon: IconComponent;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { id: "home", icon: I.Home, label: "홈" },
  { id: "records", icon: I.List, label: "기록" },
  { id: "export", icon: I.Share, label: "내보내기" },
];

/**
 * 하단 네비게이션 - 홈, 기록, 내보내기
 */
export const BottomNav = (): ReactNode => {
  const { route, goTo } = useApp();

  return (
    <div className="bg-white/95 backdrop-blur border-t border-ink-100 pb-6 pt-2 px-2 flex">
      {NAV_ITEMS.map((item) => {
        const active = route === item.id;
        const Ic = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => goTo(item.id)}
            className={cx(
              "flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition",
              active ? "text-brand-600" : "text-ink-400"
            )}
          >
            <Ic size={22} />
            <span className="text-[10px] font-semibold tracking-tight">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
