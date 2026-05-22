"use client";

import type { ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { I } from "@/components/icons";
import { Button, Card, Pill } from "@/components/ui";
import { PumpIllustration } from "@/components/illustrations/PumpIllustration";

/**
 * 환자 인수 화면 (/intro)
 * 의료진이 입력을 완료하고 환자에게 기기를 전달한 후 보이는 화면
 */
export const IntroScreen = (): ReactNode => {
  const { patient, alarmTimes, endAt, goTo, fmtKShort, totalHours } = useApp();

  const checkItems = [
    { icon: <I.Droplet size={16} />, text: "눈금/풍선이 줄어들고 있나요?" },
    { icon: <I.LockOpen size={16} />, text: "잠금장치 2곳이 모두 열려있나요?" },
    { icon: <I.Thermometer size={16} />, text: "온도센서가 잘 붙어있나요?" },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-brand-50 to-white">
      {/* 헤더 */}
      <div className="pt-12 px-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-brand-600">
          <I.Heart size={16} />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            HomeCare
          </span>
        </div>
        <Pill tone="safe">
          <I.Shield size={12} />
          설정 완료
        </Pill>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-auto phone-scroll px-5">
        {/* 인사말 */}
        <div className="mt-4 animate-fade-up">
          <div className="text-[12.5px] text-ink-500">안녕하세요,</div>
          <h2 className="mt-0.5 text-[28px] font-bold tracking-tight leading-tight">
            {patient.name}님
            <br />
            준비 다 됐어요
          </h2>
          <p className="mt-2 text-[13px] text-ink-600 leading-relaxed">
            {patient.doctor} 선생님과 {patient.nurse} 간호사님이
            <br />
            치료 정보를 입력해두셨어요.
          </p>
        </div>

        {/* 치료 정보 카드 */}
        <div className="mt-5 bg-white border border-ink-100 rounded-2xl shadow-card p-4">
          <div className="flex items-center gap-3">
            <PumpIllustration remaining={1} size={64} />
            <div className="flex-1">
              <div className="text-[10.5px] font-bold text-brand-700 uppercase tracking-widest">
                앞으로 {totalHours}시간
              </div>
              <div className="mt-0.5 text-[15px] font-bold tracking-tight">
                {patient.regimen} 주입 진행
              </div>
              <div className="mt-1 text-[11.5px] text-ink-500">
                예상 종료 · {fmtKShort(endAt)}
              </div>
            </div>
          </div>
        </div>

        {/* 점검 항목 */}
        <div className="mt-4">
          <div className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-2">
            하루 3번, 3가지만 점검해요
          </div>
          <div className="space-y-2">
            {checkItems.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-ink-100 rounded-xl p-3 flex items-center gap-2.5 shadow-card"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                  {item.icon}
                </div>
                <div className="text-[13px] font-semibold tracking-tight flex-1">
                  {item.text}
                </div>
                <I.Check size={16} className="text-safe-500" />
              </div>
            ))}
          </div>
        </div>

        {/* 알람 안내 */}
        <div className="mt-4 bg-brand-50 border border-brand-200 rounded-2xl p-3.5 flex items-start gap-2.5">
          <I.Bell size={16} className="text-brand-600 shrink-0 mt-0.5" />
          <div className="text-[12.5px] text-brand-900 leading-relaxed">
            <b>{alarmTimes.morning}</b> · <b>{alarmTimes.noon}</b> ·{" "}
            <b>{alarmTimes.evening}</b>에 알람을 보내드릴게요.
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-5 pt-3 pb-6">
        <Button
          variant="primary"
          full
          onClick={() => goTo("home")}
          iconRight={<I.ChevR size={16} />}
        >
          시작하기
        </Button>
        <p className="mt-2 text-center text-[11px] text-ink-500">
          언제든 기록 탭에서 과거 점검을 확인할 수 있어요
        </p>
      </div>
    </div>
  );
};
