"use client";

import type { ReactNode } from "react";
import { cx } from "@/lib/cx";
import { I } from "@/components/icons";
import { TopBar } from "@/components/ui";
import { PumpIllustration } from "@/components/illustrations/PumpIllustration";

type EduTone = "brand" | "safe" | "danger";

type EduSection = {
  title: string;
  icon: ReactNode;
  tone?: EduTone;
  body?: string;
  bullets?: string[];
  illust?: ReactNode;
  stages?: boolean;
};

const SECTIONS: EduSection[] = [
  {
    title: "홈펌프란?",
    icon: <I.Droplet size={18} />,
    body: "홈펌프는 항암제를 일정한 속도로 천천히 주입해주는 장치예요. 케모포트 니들에 연결해 잠금장치를 열어두면 약물이 천천히 들어갑니다.",
    illust: <PumpIllustration remaining={0.7} size={80} />,
  },
  {
    title: "주입 과정 (44시간)",
    icon: <I.Clock size={18} />,
    body: '시간이 지나면 내부 풍선이 점점 줄어들고 눈금이 변화해요. 보통 44시간 ±7시간에 걸쳐 주입됩니다. 주입이 끝나면 풍선이 완전히 수축하고 눈금이 "0"이 됩니다.',
    stages: true,
  },
  {
    title: "이렇게 하세요",
    icon: <I.CheckCircle size={18} />,
    tone: "safe",
    bullets: [
      "주입 기간 동안 (수면 시 포함) 가방을 착용하고 생활하세요",
      "주입 라인이 당겨지거나 꺾이지 않도록 해주세요",
      "최소 하루 3회 (식사 시 마다) 홈펌프 주입 여부를 점검하세요",
    ],
  },
  {
    title: "절대 안 돼요",
    icon: <I.X size={18} />,
    tone: "danger",
    bullets: [
      "에어컨 바람을 직접 맞지 마세요",
      "전기담요나 핫팩을 사용하지 마세요",
      "홈펌프 속도를 일정하게 유지하려면 너무 덥거나 추운 환경을 피해주세요",
    ],
  },
];

export const EduScreen = (): ReactNode => (
  <div className="h-full flex flex-col bg-ink-50">
    <TopBar title="안내 자료" />
    <div className="flex-1 overflow-auto phone-scroll pb-24">
      <div className="px-4 pt-4 space-y-3">
        {SECTIONS.map((s) => (
          <EduCard key={s.title} {...s} />
        ))}

        <div className="rounded-2xl bg-white border border-ink-100 p-4">
          <div className="flex items-center gap-2 text-brand-600">
            <I.Heart size={16} />
            <span className="text-[11px] font-bold uppercase tracking-wider">잠깐의 안내</span>
          </div>
          <p className="mt-2 text-[12.5px] text-ink-700 leading-relaxed">
            이 자료는 의료진 교육 안내문을 디지털로 정리한 것입니다. 더 자세한 내용은 퇴원 시 받으신 안내문이나
            담당 의료진에게 문의하세요.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const TONES: Record<EduTone, string> = {
  brand: "bg-brand-50 text-brand-700",
  safe: "bg-safe-50 text-safe-700",
  danger: "bg-danger-50 text-danger-700",
};

const BULLET_TONES: Record<EduTone, string> = {
  brand: "bg-brand-500",
  safe: "bg-safe-500",
  danger: "bg-danger-500",
};

const EduCard = ({ title, icon, body, bullets, illust, stages, tone = "brand" }: EduSection): ReactNode => (
  <div className="bg-white rounded-2xl border border-ink-100 shadow-card overflow-hidden">
    <div className="p-4">
      <div className="flex items-center gap-2">
        <div className={cx("w-8 h-8 rounded-lg flex items-center justify-center", TONES[tone])}>{icon}</div>
        <h3 className="text-[15px] font-bold tracking-tight">{title}</h3>
      </div>

      {body && <p className="mt-2 text-[13px] text-ink-600 leading-relaxed">{body}</p>}

      {bullets && (
        <ul className="mt-3 space-y-1.5">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-[12.5px] text-ink-700 leading-relaxed">
              <span className={cx("mt-2 w-1.5 h-1.5 rounded-full shrink-0", BULLET_TONES[tone])} />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}

      {illust && <div className="mt-3 flex items-center justify-center bg-ink-50 rounded-xl py-2">{illust}</div>}

      {stages && <StageStrip />}
    </div>
  </div>
);

type Stage = { h: string; r: number; t: string };

const STAGES: Stage[] = [
  { h: "시작", r: 1.0, t: "눈금 ~120" },
  { h: "12시간", r: 0.72, t: "~85" },
  { h: "24시간", r: 0.45, t: "~55" },
  { h: "주입 종료", r: 0.0, t: "0" },
];

const StageStrip = (): ReactNode => (
  <div className="mt-3 grid grid-cols-4 gap-1.5">
    {STAGES.map((s) => (
      <div key={s.h} className="bg-ink-50 rounded-xl p-2 text-center">
        <PumpIllustration remaining={s.r} size={44} />
        <div className="text-[10px] font-bold text-ink-700 tracking-tight mt-1">{s.h}</div>
        <div className="text-[9px] text-ink-500 font-mono">{s.t}</div>
      </div>
    ))}
  </div>
);
