"use client";

import type { ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { fmtKShort } from "@/lib/format";
import { I } from "@/components/icons";
import { TopBar, IconBtn, Button } from "@/components/ui";
import type { Check } from "@/types";

/**
 * PDF 내보내기 화면 (/export)
 * 기록을 PDF로 저장하거나 공유하는 화면
 */
export const ExportScreen = (): ReactNode => {
  const app = useApp();
  return (
    <div className="h-full flex flex-col bg-ink-100">
      <TopBar
        title="기록 내보내기"
        left={
          <IconBtn onClick={() => app.goTo("home")} label="닫기">
            <I.X size={18} />
          </IconBtn>
        }
      />

      <div className="flex-1 overflow-auto phone-scroll p-4">
        <div className="bg-white rounded-lg shadow-pop mx-auto" style={{ width: 320 }}>
          <div className="p-4">
            <div className="flex items-center justify-between border-b border-ink-200 pb-2">
              <div>
                <div className="text-[9px] uppercase font-bold text-brand-700 tracking-widest">
                  HomeCare Report
                </div>
                <div className="text-[15px] font-bold tracking-tight mt-0.5">홈펌프 자가관리 기록</div>
              </div>
              <div className="w-9 h-9 rounded bg-brand-600 text-white flex items-center justify-center font-bold text-[13px]">
                HC
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
              <Row k="환자" v={app.patient.name} />
              <Row k="등록번호" v={app.patient.mrn} />
              <Row k="요법" v={app.patient.regimen} />
              <Row k="작성일" v={fmtKShort(app.now)} />
              <Row k="주입 시작" v={fmtKShort(app.startAt)} />
              <Row k="예상 종료" v={fmtKShort(app.endAt)} />
            </div>

            <div className="mt-3 rounded bg-safe-50 border border-safe-500/20 p-2 text-[10px] text-safe-700 font-semibold flex items-center gap-1">
              <I.CheckCircle size={12} /> 전체 점검 정상 · {app.streak}회 연속 이상 없음
            </div>

            <div className="mt-3 text-[9px] font-bold text-ink-500 uppercase tracking-widest">눈금 추이</div>
            <div className="mt-1 bg-ink-50 rounded p-2">
              <MiniChart checks={app.checks} start={app.startAt} />
            </div>

            <div className="mt-3 text-[9px] font-bold text-ink-500 uppercase tracking-widest">점검 기록</div>
            <div className="mt-1 border border-ink-200 rounded overflow-hidden">
              <div className="grid grid-cols-[1.4fr_.7fr_.7fr_.7fr_.7fr] text-[9px] bg-ink-50 font-bold text-ink-700">
                {["시간", "눈금", "잠금", "센서", "상태"].map((h) => (
                  <div key={h} className="px-1.5 py-1 border-r border-ink-200 last:border-0">
                    {h}
                  </div>
                ))}
              </div>
              {app.checks.map((c, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1.4fr_.7fr_.7fr_.7fr_.7fr] text-[9px] border-t border-ink-200 tnum"
                >
                  <div className="px-1.5 py-1 font-medium">{fmtKShort(new Date(c.at))}</div>
                  <div className="px-1.5 py-1">{c.scaleMl}ml</div>
                  <div className="px-1.5 py-1 text-safe-600">✓✓</div>
                  <div className="px-1.5 py-1 text-safe-600">✓</div>
                  <div className="px-1.5 py-1 font-semibold text-safe-700">정상</div>
                </div>
              ))}
            </div>

            <div className="mt-3 text-[8px] text-ink-400 leading-relaxed">
              본 기록은 환자 본인이 앱을 통해 자가 측정·기록한 데이터입니다. 임상 판단은 의료진의 평가가
              우선합니다.
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-2">
          <Button variant="primary" full icon={<I.Download size={18} />}>
            PDF로 저장
          </Button>
          <Button variant="outline" full icon={<I.Share size={18} />}>
            공유하기
          </Button>
        </div>
        <div className="mt-3 text-[11px] text-ink-500 text-center">
          저장한 PDF를 외래 진료 시 의료진에게 보여주세요
        </div>
      </div>
    </div>
  );
};

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
