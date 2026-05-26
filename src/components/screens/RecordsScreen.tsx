"use client";

import { useState, type ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { cx } from "@/lib/cx";
import { fmtKShort, fmtHM } from "@/lib/format";
import { I } from "@/components/icons";
import { TopBar, IconBtn, Pill } from "@/components/ui";
import type { Check } from "@/types";

type RecordsView = "timeline" | "chart";

export const RecordsScreen = (): ReactNode => {
  const app = useApp();
  const [view, setView] = useState<RecordsView>("timeline");

  return (
    <div className="h-full flex flex-col bg-ink-50">
      <TopBar
        title="기록"
        right={
          <IconBtn onClick={() => app.goTo("export")} label="내보내기">
            <I.Download size={18} />
          </IconBtn>
        }
      />

      <div className="px-4 pt-3 pb-2 bg-white border-b border-ink-100">
        <div className="bg-ink-100 rounded-xl p-0.5 flex gap-0.5">
          {(["timeline", "chart"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cx(
                "flex-1 h-9 text-[13px] font-semibold rounded-lg transition",
                view === v ? "bg-white shadow-sm text-ink-900" : "text-ink-500",
              )}
            >
              {v === "timeline" ? "타임라인" : "눈금 추이"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto phone-scroll pb-24">
        {view === "timeline" ? <Timeline /> : <ChartView />}

        <div className="px-4 pt-4">
          <button
            onClick={() => app.goTo("export")}
            className="w-full bg-white border border-brand-200 hover:bg-brand-50 rounded-2xl p-4 flex items-center gap-3 shadow-card transition"
          >
            <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <I.Download size={22} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[14px] font-bold tracking-tight">PDF로 저장하기</div>
              <div className="text-[12px] text-ink-500">외래 진료 시 의료진에게 보여주세요</div>
            </div>
            <I.ChevR size={18} className="text-ink-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Timeline = (): ReactNode => {
  const app = useApp();
  const byDay: Record<string, Check[]> = {};
  app.checks
    .slice()
    .reverse()
    .forEach((c) => {
      const d = new Date(c.at);
      const k = `${d.getMonth() + 1}/${d.getDate()}`;
      (byDay[k] = byDay[k] || []).push(c);
    });
  return (
    <div className="px-4 pt-3">
      {Object.entries(byDay).map(([day, items]) => (
        <div key={day} className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <div className="text-[12px] font-bold text-ink-700">{day}</div>
            <div className="text-[11px] text-ink-500">{items.length}회 점검</div>
            <div className="flex-1 h-px bg-ink-200" />
          </div>
          <div className="relative pl-5 space-y-2.5">
            <div className="absolute left-1.5 top-2 bottom-2 w-px bg-ink-200" />
            {items.map((c, i) => (
              <div key={i} className="relative">
                <div
                  className={cx(
                    "absolute -left-[18px] top-3 w-3 h-3 rounded-full border-2 border-white",
                    c.ok ? "bg-safe-500" : "bg-danger-500",
                  )}
                />
                <TimelineCard c={c} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

type TimelineCardProps = { c: Check };

const TimelineCard = ({ c }: TimelineCardProps): ReactNode => (
  <div className="bg-white rounded-2xl border border-ink-100 shadow-card p-3.5">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-[14px] font-bold tnum tracking-tight">{fmtHM(new Date(c.at))}</span>
        <Pill tone={c.ok ? "safe" : "danger"}>{c.ok ? "이상 없음" : "이상"}</Pill>
      </div>
      <span className="text-[11px] text-ink-400">{c.note}</span>
    </div>
    <div className="mt-2 grid grid-cols-3 gap-2 text-center">
      <Mini icon={<I.Droplet size={14} />} ok>
        눈금 <b className="tnum">{c.scaleMl}</b>
        <span className="text-[10px] text-ink-500 ml-0.5">ml</span>
      </Mini>
      <Mini icon={<I.LockOpen size={14} />} ok={c.locks[0] === true && c.locks[1] === true}>
        잠금 ✓✓
      </Mini>
      <Mini icon={<I.Thermometer size={14} />} ok={c.tempOk === true}>
        온도센서 ✓
      </Mini>
    </div>
  </div>
);

type MiniProps = { icon: ReactNode; ok?: boolean; children: ReactNode };

const Mini = ({ icon, ok = true, children }: MiniProps): ReactNode => (
  <div
    className={cx(
      "rounded-lg py-1.5 px-1.5 text-[11px] font-medium flex items-center justify-center gap-1",
      ok ? "bg-safe-50 text-safe-700" : "bg-danger-50 text-danger-700",
    )}
  >
    {icon}
    <span>{children}</span>
  </div>
);

const ChartView = (): ReactNode => {
  const app = useApp();
  const W = 320;
  const H = 200;
  const P = 20;
  const pts = app.checks.map((c) => ({
    hr: (new Date(c.at).getTime() - app.startAt.getTime()) / 3600000,
    scale: c.scaleMl,
  }));
  if (pts.length === 0) return <div className="p-5 text-center text-ink-500">아직 기록이 없어요</div>;

  const xFor = (hr: number): number => P + (hr / 44) * (W - P * 2);
  const yFor = (sc: number): number => H - P - (sc / 130) * (H - P * 2);
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p.hr)} ${yFor(p.scale)}`).join(" ");
  const expPath = `M ${xFor(0)} ${yFor(120)} L ${xFor(44)} ${yFor(0)}`;
  const nowHr = (app.now.getTime() - app.startAt.getTime()) / 3600000;
  const first = pts[0];
  const lastPt = pts.at(-1)!;
  const avg = ((first.scale - lastPt.scale) / Math.max(1, lastPt.hr - first.hr)).toFixed(1);

  return (
    <div className="px-4 pt-4">
      <div className="bg-white rounded-2xl border border-ink-100 shadow-card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold text-ink-500 uppercase tracking-wider">눈금 변화</div>
            <div className="text-[15px] font-bold tracking-tight">시간 대비 풍선 잔량</div>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-600" />실제
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 border-t border-dashed border-ink-400" />예상
            </span>
          </div>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full mt-3">
          {[0, 30, 60, 90, 120].map((y) => (
            <g key={y}>
              <line x1={P} x2={W - P} y1={yFor(y)} y2={yFor(y)} stroke="#E2E8F0" strokeWidth="1" strokeDasharray="2 4" />
              <text x={P - 4} y={yFor(y) + 3} fontSize="9" fill="#94A3B8" textAnchor="end" className="tnum">
                {y}
              </text>
            </g>
          ))}
          {[0, 12, 24, 36, 44].map((x) => (
            <text key={x} x={xFor(x)} y={H - 6} fontSize="9" fill="#94A3B8" textAnchor="middle" className="tnum">
              {x}h
            </text>
          ))}
          <path d={expPath} stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
          {nowHr <= 44 && (
            <g>
              <line x1={xFor(nowHr)} x2={xFor(nowHr)} y1={P} y2={H - P} stroke="#F59E0B" strokeWidth="1.2" strokeDasharray="3 3" />
              <text x={xFor(nowHr)} y={P - 4} fontSize="9" fill="#D97706" textAnchor="middle" fontWeight="700">
                현재
              </text>
            </g>
          )}
          <path d={path} stroke="#2563EB" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          {pts.map((p, i) => (
            <circle key={i} cx={xFor(p.hr)} cy={yFor(p.scale)} r="3.5" fill="#2563EB" stroke="white" strokeWidth="1.5" />
          ))}
        </svg>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <Stat2 label="시작 눈금" v={`${first.scale}`} u="ml" />
          <Stat2 label="현재 눈금" v={`${lastPt.scale}`} u="ml" />
          <Stat2 label="시간당 평균" v={avg} u="ml/h" />
        </div>
      </div>

      <div className="mt-4 bg-safe-50 border border-safe-500/20 rounded-2xl p-3.5 flex gap-2.5">
        <I.CheckCircle size={18} className="text-safe-600 shrink-0 mt-0.5" />
        <div className="text-[12px] text-ink-700 leading-relaxed">
          <span className="font-bold text-safe-700">예상 속도대로 잘 진행되고 있어요.</span> 현재까지 이상 신호는
          없습니다.
        </div>
      </div>
    </div>
  );
};

type Stat2Props = { label: string; v: string; u: string };

const Stat2 = ({ label, v, u }: Stat2Props): ReactNode => (
  <div className="bg-ink-50 rounded-xl py-2">
    <div className="text-[10px] text-ink-500 font-semibold uppercase tracking-wider">{label}</div>
    <div className="mt-0.5 text-[15px] font-bold tnum">
      {v}
      <span className="text-[10px] font-medium text-ink-500 ml-0.5">{u}</span>
    </div>
  </div>
);

type RowProps = { k: string; v: string };

const Row = ({ k, v }: RowProps): ReactNode => (
  <div className="flex gap-2">
    <span className="text-ink-500 font-medium">{k}</span>
    <span className="font-semibold tracking-tight tnum">{v}</span>
  </div>
);

type MiniChartProps = { checks: Check[]; start: Date };

const MiniChart = ({ checks, start }: MiniChartProps): ReactNode => {
  const W = 280;
  const H = 60;
  const P = 4;
  const xFor = (hr: number): number => P + (hr / 44) * (W - P * 2);
  const yFor = (sc: number): number => H - P - (sc / 130) * (H - P * 2);
  const pts = checks.map((c) => ({ hr: (new Date(c.at).getTime() - start.getTime()) / 3600000, scale: c.scaleMl }));
  const path = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${xFor(p.hr)} ${yFor(p.scale)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
      <path
        d={`M ${xFor(0)} ${yFor(120)} L ${xFor(44)} ${yFor(0)}`}
        stroke="#CBD5E1"
        strokeWidth="1"
        strokeDasharray="3 3"
        fill="none"
      />
      <path d={path} stroke="#2563EB" strokeWidth="1.5" fill="none" />
      {pts.map((p, i) => (
        <circle key={i} cx={xFor(p.hr)} cy={yFor(p.scale)} r="2" fill="#2563EB" />
      ))}
    </svg>
  );
};
