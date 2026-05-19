"use client";

import { useState, type ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { cx } from "@/lib/cx";
import { fmtKShort } from "@/lib/format";
import { I } from "@/components/icons";
import { TopBar, IconBtn, Button } from "@/components/ui";

export const EndScreen = (): ReactNode => {
  const app = useApp();
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-safe-50 to-white">
      <TopBar
        title="주입 완료"
        transparent
        left={
          <IconBtn onClick={() => app.goTo("tabs")} label="닫기">
            <I.X size={18} />
          </IconBtn>
        }
      />

      <div className="flex-1 overflow-auto phone-scroll px-5">
        <div className="text-center mt-4 animate-fade-up">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-safe-500/15 animate-check-pop">
            <div className="w-16 h-16 rounded-full bg-safe-500 text-white flex items-center justify-center">
              <I.Check size={36} />
            </div>
          </div>
          <div className="mt-4 text-[12px] font-bold text-safe-700 uppercase tracking-widest">
            눈금이 0이 되었어요
          </div>
          <h2 className="mt-2 text-[26px] font-bold tracking-tight leading-tight">
            44시간, 잘 견뎌내셨어요
          </h2>
          <p className="mt-2 text-[13px] text-ink-600">이제 병원에 방문해서 홈펌프를 제거해주세요</p>
        </div>

        <div className="mt-6">
          <div className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-2">
            병원 방문 전 체크리스트
          </div>
          <div className="space-y-2">
            <Todo title="회송서 지참" desc="병동에서 받은 회송서를 가져가세요" />
            <Todo title="헤파린 약 (해당 시)" desc="처방받은 헤파린이 있다면 함께 지참" />
            <Todo title="잠금장치는 닫지 마세요!" desc="케모포트가 막힐 수 있어요" warn />
          </div>
        </div>

        <div className="mt-5 rounded-2xl bg-warn-50 border border-warn-500/30 p-4 flex gap-3">
          <I.Info size={20} className="text-warn-600 shrink-0 mt-0.5" />
          <div className="text-[12px] text-ink-700 leading-relaxed">
            <div className="font-bold text-warn-600 mb-0.5">종료일에 제거하지 못한 경우</div>
            다음 날 오전까지는 제거가 가능합니다. 잠금장치는 닫지 말고 그대로 두세요.
          </div>
        </div>

        <div className="mt-5">
          <a href="tel:02-0000-0000" className="block">
            <div className="rounded-2xl bg-brand-600 text-white p-4 flex items-center gap-3 shadow-soft active:scale-[.99] transition">
              <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center">
                <I.Phone size={22} />
              </div>
              <div className="flex-1">
                <div className="text-[11px] opacity-90 uppercase tracking-wider font-bold">병동 직통</div>
                <div className="text-[16px] font-bold tnum">02-0000-0000</div>
                <div className="text-[11px] opacity-80">방문 전 연락드리면 빠르게 안내받으실 수 있어요</div>
              </div>
            </div>
          </a>
        </div>

        <div className="mt-3 mb-8">
          <Button
            variant="outline"
            full
            onClick={() => {
              app.setTab("records");
              app.goTo("tabs");
            }}
            icon={<I.Download size={18} />}
          >
            최종 기록 PDF 보기
          </Button>
        </div>
      </div>
    </div>
  );
};

type TodoProps = { title: string; desc: string; warn?: boolean };

const Todo = ({ title, desc, warn }: TodoProps): ReactNode => {
  const [done, setDone] = useState(false);
  return (
    <button
      onClick={() => setDone((d) => !d)}
      className={cx(
        "w-full rounded-2xl border p-3.5 flex items-start gap-3 text-left transition",
        done ? "bg-safe-50 border-safe-200" : warn ? "bg-white border-warn-500/30" : "bg-white border-ink-200",
      )}
    >
      <div
        className={cx(
          "w-6 h-6 rounded-md flex items-center justify-center shrink-0 border transition mt-0.5",
          done ? "bg-safe-500 border-safe-500 text-white" : "border-ink-300",
        )}
      >
        {done && <I.Check size={14} />}
      </div>
      <div className="flex-1">
        <div
          className={cx(
            "text-[14px] font-bold tracking-tight",
            done && "line-through text-ink-400",
            warn && !done && "text-warn-600",
          )}
        >
          {warn && "⚠️ "}
          {title}
        </div>
        <div className="text-[11px] text-ink-500 mt-0.5">{desc}</div>
      </div>
    </button>
  );
};

type SettingsGroup = { title: string; items: Array<{ k: string; v: string }> };

export const SettingsScreen = (): ReactNode => {
  const app = useApp();
  const groups: SettingsGroup[] = [
    {
      title: "치료 정보",
      items: [
        { k: "환자", v: app.patient.name },
        { k: "요법", v: app.patient.regimen },
        { k: "주입 시작", v: fmtKShort(app.startAt) },
        { k: "예상 종료", v: fmtKShort(app.endAt) },
      ],
    },
    {
      title: "알람",
      items: [
        { k: "아침", v: app.alarmTimes.morning },
        { k: "점심", v: app.alarmTimes.noon },
        { k: "저녁", v: app.alarmTimes.evening },
      ],
    },
    {
      title: "비상 연락",
      items: [
        { k: "병동 직통", v: "02-0000-0000" },
        { k: "응급실", v: "119" },
      ],
    },
  ];
  return (
    <div className="h-full flex flex-col bg-ink-50">
      <TopBar title="설정" />
      <div className="flex-1 overflow-auto phone-scroll pb-24">
        <div className="px-4 pt-4">
          {groups.map((g) => (
            <div key={g.title} className="mb-5">
              <div className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-2 px-1">
                {g.title}
              </div>
              <div className="bg-white rounded-2xl border border-ink-100 divide-y divide-ink-100">
                {g.items.map((it) => (
                  <div key={it.k} className="px-4 py-3 flex justify-between items-baseline">
                    <span className="text-[13px] text-ink-700">{it.k}</span>
                    <span className="text-[13px] font-semibold tracking-tight tnum">{it.v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="mb-5">
            <div className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-2 px-1">
              데모 단축키
            </div>
            <div className="bg-white rounded-2xl border border-ink-100 divide-y divide-ink-100">
              <DevRow onClick={() => app.goTo("setup")}>처음 설정 화면 보기</DevRow>
              <DevRow
                onClick={() => {
                  app.setAlertType("fever");
                  app.goTo("alert");
                }}
              >
                이상 상황 (38도 발열)
              </DevRow>
              <DevRow
                onClick={() => {
                  app.setAlertType("leak");
                  app.goTo("alert");
                }}
              >
                이상 상황 (약물 누출)
              </DevRow>
              <DevRow onClick={() => app.goTo("end")}>주입 완료 화면 보기</DevRow>
              <DevRow onClick={() => app.goTo("export")}>PDF 미리보기</DevRow>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

type DevRowProps = { children: ReactNode; onClick: () => void };

const DevRow = ({ children, onClick }: DevRowProps): ReactNode => (
  <button
    onClick={onClick}
    className="w-full px-4 py-3 flex justify-between items-center text-left hover:bg-ink-50"
  >
    <span className="text-[13px] font-medium text-brand-700">{children}</span>
    <I.ChevR size={16} className="text-ink-400" />
  </button>
);
