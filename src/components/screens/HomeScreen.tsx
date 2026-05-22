"use client";

import type { ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { cx } from "@/lib/cx";
import { fmtKShort, fmtHM } from "@/lib/format";
import { I } from "@/components/icons";
import { Ring, Pill, Button } from "@/components/ui";
import type { Check } from "@/types";

export const HomeScreen = (): ReactNode => {
  const app = useApp();
  const lastCheck = app.checks.at(-1);
  const remainingScale = lastCheck?.scaleMl ?? 120;
  const minutesToNext = Math.max(
    0,
    Math.round((app.nextAlarm.getTime() - app.now.getTime()) / 60000),
  );
  const nextH = Math.floor(minutesToNext / 60);
  const nextM = minutesToNext % 60;

  return (
    <div className="h-full flex flex-col bg-ink-50">
      <div className="pt-12 px-5 pb-3 bg-white border-b border-ink-100">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-ink-400 uppercase tracking-wider">안녕하세요</div>
            <div className="text-[18px] font-bold tracking-tight">{app.patient.name}님</div>
          </div>
          <div className="flex items-center gap-1">
            <button className="w-9 h-9 rounded-full bg-ink-100 flex items-center justify-center relative">
              <I.Bell size={18} className="text-ink-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto phone-scroll pb-24">
        <div className="px-4 pt-4">
          <div className="rounded-3xl bg-gradient-to-br from-brand-900 to-brand-700 text-white p-5 shadow-soft relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-brand-200 font-semibold uppercase tracking-wider">
                    주입 진행 중
                  </div>
                  <div className="mt-1 text-[12px] text-brand-100">{app.patient.regimen} · 44시간</div>
                </div>
                <Pill tone="safe" className="!bg-safe-500/20 !text-safe-100">
                  <span className="w-1.5 h-1.5 bg-safe-300 rounded-full animate-pulse-soft" />
                  정상
                </Pill>
              </div>

              <div className="mt-4 flex items-center gap-4">
                <Ring value={app.progress} size={140} stroke={11} trackClass="text-white/15" progressClass="text-safe-400">
                  <div className="text-center">
                    <div className="text-[11px] text-brand-200 font-medium">남은 시간</div>
                    <div className="text-[28px] font-bold leading-none tnum mt-1">
                      {app.remH}
                      <span className="text-[14px] font-medium text-brand-200 ml-0.5">시간</span>
                    </div>
                    <div className="text-[12px] text-brand-200 tnum mt-0.5">{app.remM}분</div>
                  </div>
                </Ring>
                <div className="flex-1 space-y-2.5">
                  <Stat label="진행" value={`${app.elH}시간`} sub={`${Math.round(app.progress * 100)}%`} />
                  <Stat label="현재 눈금" value={`${remainingScale}`} sub="ml" />
                  <Stat label="예상 종료" value={fmtKShort(app.endAt)} sub="" mono />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 pt-4">
          <div className="rounded-2xl bg-white border border-ink-100 p-4 shadow-card">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">다음 점검</div>
                <div className="mt-1 text-[16px] font-bold tracking-tight">점심 · {fmtHM(app.nextAlarm)}</div>
                <div className="mt-0.5 text-[12px] text-ink-500 tnum">
                  {nextH > 0 ? `${nextH}시간 ` : ""}
                  {nextM}분 후
                </div>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-warn-50 text-warn-600 flex items-center justify-center">
                <I.Coffee size={22} />
              </div>
            </div>
            <Button variant="primary" full className="mt-4" onClick={app.startCheck} iconRight={<I.ChevR size={16} />}>
              지금 점검 시작
            </Button>
          </div>
        </div>

        <div className="px-4 pt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-white border border-ink-100 p-3.5 shadow-card">
            <div className="flex items-center gap-1.5 text-safe-600">
              <I.CheckCircle size={16} />
              <span className="text-[11px] font-semibold uppercase tracking-wider">이상 없음</span>
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-[26px] font-bold tnum">{app.streak}</span>
              <span className="text-[12px] text-ink-500 font-medium">회 연속</span>
            </div>
            <div className="mt-2 flex gap-0.5">
              {app.checks.slice(-7).map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full bg-safe-500" />
              ))}
              {Array.from({ length: Math.max(0, 7 - app.checks.length) }).map((_, i) => (
                <div key={`p${i}`} className="flex-1 h-1.5 rounded-full bg-ink-200" />
              ))}
            </div>
          </div>
          <button
            onClick={() => {
              app.setAlertType("no_change");
              app.goTo("alert");
            }}
            className="rounded-2xl bg-white border border-ink-100 p-3.5 shadow-card text-left hover:bg-ink-50 active:scale-[.99] transition"
          >
            <div className="flex items-center gap-1.5 text-danger-600">
              <I.Warn size={16} />
              <span className="text-[11px] font-semibold uppercase tracking-wider">이상 보고</span>
            </div>
            <div className="mt-2 text-[14px] font-bold tracking-tight leading-tight">문제가 있나요?</div>
            <div className="mt-1 text-[11px] text-ink-500">대처 방법 안내</div>
          </button>
        </div>

        <div className="px-4 pt-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[13px] font-semibold text-ink-700">최근 점검</h3>
            <button onClick={() => app.goTo("records")} className="text-[12px] text-brand-600 font-semibold">
              전체보기
            </button>
          </div>
          <div className="space-y-2">
            {app.checks
              .slice(-3)
              .reverse()
              .map((c, i) => (
                <RecentRow key={i} c={c} />
              ))}
          </div>
        </div>

        {remainingScale < 30 && (
          <div className="px-4 pt-5">
            <button
              onClick={() => app.goTo("done")}
              className="w-full rounded-2xl bg-safe-50 border border-safe-200 p-4 text-left flex items-center gap-3 hover:bg-safe-100/60 transition"
            >
              <div className="w-10 h-10 rounded-xl bg-safe-500 text-white flex items-center justify-center">
                <I.Check size={20} />
              </div>
              <div className="flex-1">
                <div className="text-[14px] font-bold tracking-tight">곧 주입이 끝나요</div>
                <div className="text-[12px] text-ink-600">눈금이 0이 되면 안내를 따라주세요</div>
              </div>
              <I.ChevR size={18} className="text-ink-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

type StatProps = { label: string; value: string; sub: string; mono?: boolean };

const Stat = ({ label, value, sub, mono }: StatProps): ReactNode => (
  <div>
    <div className="text-[10px] text-brand-200 font-semibold uppercase tracking-wider">{label}</div>
    <div className={cx("text-[16px] font-bold tracking-tight leading-tight tnum", mono && "font-mono text-[15px]")}>
      {value} {sub && <span className="text-[11px] font-medium text-brand-200 ml-0.5">{sub}</span>}
    </div>
  </div>
);

type RecentRowProps = { c: Check };

const RecentRow = ({ c }: RecentRowProps): ReactNode => (
  <div className="bg-white rounded-2xl border border-ink-100 p-3 flex items-center gap-3">
    <div
      className={cx(
        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
        c.ok ? "bg-safe-50 text-safe-600" : "bg-danger-50 text-danger-600",
      )}
    >
      {c.ok ? <I.Check size={20} /> : <I.Warn size={18} />}
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-[13px] font-semibold tracking-tight">{fmtKShort(new Date(c.at))} 점검</div>
      <div className="text-[11px] text-ink-500 truncate">
        눈금 {c.scaleMl}ml · 잠금 ✓✓ · 온도센서 ✓{c.note ? ` · ${c.note}` : ""}
      </div>
    </div>
    <Pill tone={c.ok ? "safe" : "danger"}>{c.ok ? "정상" : "이상"}</Pill>
  </div>
);
