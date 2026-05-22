"use client";

import type { ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { cx } from "@/lib/cx";
import { I } from "@/components/icons";
import type { AlertType, ContactTarget, Severity } from "@/types";

type AlertStep = { t: string; d: string };

type AlertCase = {
  severity: Severity;
  icon: ReactNode;
  title: string;
  lead: string;
  steps: AlertStep[];
  contact: ContactTarget;
};

const CASES: Record<AlertType, AlertCase> = {
  no_change: {
    severity: "warn",
    icon: <I.Droplet size={28} />,
    title: "눈금/풍선 변화 없음",
    lead: "2-3시간째 눈금이 줄어들지 않을 때",
    steps: [
      { t: "잠금장치 2곳 확인", d: "2개 잠금장치가 모두 열려있는지 다시 한 번 확인해주세요" },
      { t: "2-3시간 후 재점검", d: "그래도 변화가 없다면 다음 단계로 진행" },
      { t: "병동으로 전화", d: "담당 병동에 직접 전화하여 상황을 알려주세요" },
    ],
    contact: "ward",
  },
  leak: {
    severity: "danger",
    icon: <I.Droplet size={28} />,
    title: "홈펌프 빠짐 / 약물 누출",
    lead: "약물이 새거나 펌프가 빠진 경우",
    steps: [
      { t: "장갑 착용", d: "맨손으로 약물을 만지지 마세요. 일회용 장갑을 끼세요" },
      { t: "잠금장치 모두 잠금", d: "2곳의 잠금장치를 모두 닫아 약물 누출을 막아주세요" },
      { t: "누출 부위 밀봉", d: "깨끗한 천이나 비닐로 누출 부위를 감싸주세요" },
      { t: "즉시 병원 방문", d: "홈펌프를 가지고 병동으로 방문해주세요" },
    ],
    contact: "ward",
  },
  locked: {
    severity: "warn",
    icon: <I.Lock size={28} />,
    title: "잠금장치가 닫혀있음",
    lead: "주입이 멈춘 상태일 수 있어요",
    steps: [
      { t: "잠금장치 위치 확인", d: "케모포트 부위, 홈펌프 부위 — 2곳 모두를 확인하세요" },
      { t: "천천히 열기", d: "두 잠금장치를 부드럽게 열림 방향으로 돌려주세요" },
      { t: "30분 후 재점검", d: "30분 후 다시 눈금이 줄어드는지 확인" },
      { t: "변화 없으면 전화", d: "그래도 변화가 없다면 병동으로 연락주세요" },
    ],
    contact: "ward",
  },
  fever: {
    severity: "danger",
    icon: <I.Flame size={28} />,
    title: "38도 이상의 고열",
    lead: "항암 치료 중 발열은 응급 상황입니다",
    steps: [
      { t: "체온 측정 및 기록", d: "체온을 정확히 측정해주세요" },
      { t: "즉시 응급실 방문", d: "기다리지 말고 가까운 응급실로 가세요" },
      { t: "홈펌프 그대로 유지", d: "잠금장치를 닫지 말고 그대로 가져가세요" },
    ],
    contact: "er",
  },
  pain: {
    severity: "danger",
    icon: <I.Flame size={28} />,
    title: "케모포트 부위 발적 / 통증",
    lead: "주입 부위가 붓거나 아픈 경우",
    steps: [
      { t: "부위 사진 촬영", d: "발적·부종 상태를 사진으로 기록해두세요" },
      { t: "즉시 응급실 방문", d: "감염·약물 누출 가능성이 있어요" },
      { t: "홈펌프 가져가기", d: "주입을 멈추지 말고 그대로 가져가주세요" },
    ],
    contact: "er",
  },
};

const SWITCHER: Array<[AlertType, string]> = [
  ["no_change", "눈금 변화 없음"],
  ["leak", "약물 누출"],
  ["locked", "잠금장치 닫힘"],
  ["fever", "38도 이상 고열"],
  ["pain", "발적/통증"],
];

export const AlertScreen = (): ReactNode => {
  const app = useApp();
  const t: AlertType = app.alertType ?? "no_change";
  const c = CASES[t];
  const isDanger = c.severity === "danger";

  return (
    <div className="h-full flex flex-col bg-ink-50">
      <div className={cx("pt-12 pb-4 px-5", isDanger ? "bg-danger-600 text-white" : "bg-warn-500 text-white")}>
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => app.goTo("home")}
            className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center hover:bg-white/10"
          >
            <I.ChevL size={20} />
          </button>
          <div className="text-[12px] font-bold uppercase tracking-wider opacity-90">
            {isDanger ? "응급 상황" : "주의 필요"}
          </div>
          <div className="w-9" />
        </div>
        <div className="flex items-center gap-3 mt-2">
          <div
            className={cx(
              "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
              isDanger ? "bg-white/15" : "bg-white/20",
            )}
          >
            {c.icon}
          </div>
          <div>
            <div className="text-[20px] font-bold tracking-tight leading-tight">{c.title}</div>
            <div className="text-[12px] opacity-90 mt-0.5">{c.lead}</div>
          </div>
        </div>
      </div>

      <div className="px-4 pt-3 bg-white border-b border-ink-100 pb-3 overflow-x-auto phone-scroll">
        <div className="flex gap-1.5 min-w-max">
          {SWITCHER.map(([k, l]) => (
            <button
              key={k}
              onClick={() => app.setAlertType(k)}
              className={cx(
                "px-3 h-8 rounded-full text-[12px] font-semibold whitespace-nowrap",
                t === k ? "bg-ink-900 text-white" : "bg-ink-100 text-ink-600",
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto phone-scroll p-5">
        <div className="space-y-2.5">
          {c.steps.map((s, i) => (
            <div key={s.t} className="bg-white rounded-2xl border border-ink-100 p-4 flex gap-3">
              <div
                className={cx(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-[14px]",
                  isDanger ? "bg-danger-100 text-danger-700" : "bg-warn-50 text-warn-600",
                )}
              >
                {i + 1}
              </div>
              <div>
                <div className="text-[14px] font-bold tracking-tight">{s.t}</div>
                <div className="text-[12px] text-ink-600 mt-0.5 leading-relaxed">{s.d}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2">
          {c.contact === "er" && (
            <a href="tel:119" className="block">
              <div className="rounded-2xl bg-danger-600 hover:bg-danger-700 text-white p-4 flex items-center gap-3 shadow-soft active:scale-[.99] transition">
                <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                  <I.Phone size={24} />
                </div>
                <div className="flex-1">
                  <div className="text-[11px] font-bold uppercase tracking-wider opacity-90">즉시 전화</div>
                  <div className="text-[18px] font-bold tracking-tight">119 응급실</div>
                </div>
                <I.ChevR size={20} />
              </div>
            </a>
          )}

          <a href={`tel:${app.patient.wardPhone}`} className="block">
            <div
              className={cx(
                "rounded-2xl p-4 flex items-center gap-3 shadow-soft active:scale-[.99] transition",
                c.contact === "er"
                  ? "bg-white border border-ink-200 text-ink-900"
                  : "bg-brand-600 hover:bg-brand-700 text-white",
              )}
            >
              <div
                className={cx(
                  "w-12 h-12 rounded-2xl flex items-center justify-center",
                  c.contact === "er" ? "bg-brand-50 text-brand-600" : "bg-white/15",
                )}
              >
                <I.Phone size={22} />
              </div>
              <div className="flex-1">
                <div
                  className={cx(
                    "text-[11px] font-bold uppercase tracking-wider",
                    c.contact === "er" ? "text-ink-500" : "opacity-90",
                  )}
                >
                  병동 직통
                </div>
                <div className="text-[16px] font-bold tracking-tight tnum">{app.patient.wardPhone}</div>
                <div className={cx("text-[11px] mt-0.5", c.contact === "er" ? "text-ink-500" : "opacity-80")}>
                  24시간 연락 가능 · 간호사실
                </div>
              </div>
              <I.ChevR size={20} className={c.contact === "er" ? "text-ink-400" : ""} />
            </div>
          </a>
        </div>

        <button
          onClick={() => app.goTo("home")}
          className="mt-4 w-full h-12 rounded-2xl bg-ink-100 text-ink-700 font-semibold text-[14px]"
        >
          홈으로 돌아가기
        </button>

        <div className="mt-4 text-[11px] text-ink-500 leading-relaxed text-center">
          이 안내는 일반적인 지침입니다. 의료진의 지시가 우선해요.
        </div>
      </div>
    </div>
  );
};
