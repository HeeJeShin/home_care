import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { I, type IconComponent } from "@/components/icons";
import type { Tab } from "@/types";

export type TabBarProps = {
  tab: Tab;
  onTab: (t: Tab) => void;
};

type TabItem = { id: Tab; icon: IconComponent; label: string };

const TABS: TabItem[] = [
  { id: "home", icon: I.Home, label: "홈" },
  { id: "records", icon: I.List, label: "기록" },
  { id: "edu", icon: I.Book, label: "자료" },
  { id: "settings", icon: I.Settings, label: "설정" },
];

/** Fixed bottom tab navigation. */
export const TabBar = ({ tab, onTab }: TabBarProps): ReactNode => (
  <div className="absolute bottom-0 inset-x-0 z-30">
    <div className="bg-white/95 backdrop-blur border-t border-ink-100 pb-6 pt-2 px-2 flex">
      {TABS.map((t) => {
        const active = tab === t.id;
        const Ic = t.icon;
        return (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            className={cx(
              "flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl",
              active ? "text-brand-600" : "text-ink-400",
            )}
          >
            <Ic size={22} />
            <span className="text-[10px] font-semibold tracking-tight">{t.label}</span>
          </button>
        );
      })}
    </div>
  </div>
);
