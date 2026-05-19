"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { cx } from "@/lib/cx";
import { fmtKDateTime } from "@/lib/format";
import { I } from "@/components/icons";
import { Button } from "@/components/ui";
import { TextInput, DateInput, TimeInput } from "@/components/form";
import { PumpIllustration } from "@/components/illustrations/PumpIllustration";

const STEPS = ["소개", "환자 정보", "주입 시작", "알람 시간", "확인"] as const;

export const SetupScreen = (): ReactNode => {
  const app = useApp();
  const [step, setStep] = useState(0);

  return (
    <div className="h-full flex flex-col bg-ink-50">
      <div className="pt-12 px-5 pb-2">
        <div className="flex items-center justify-between text-[11px] text-ink-500 font-semibold tracking-wide uppercase">
          <span>
            STEP {step + 1} / {STEPS.length}
          </span>
          <span>{STEPS[step]}</span>
        </div>
        <div className="mt-2 flex gap-1">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cx("h-1 flex-1 rounded-full", i <= step ? "bg-brand-600" : "bg-ink-200")}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-auto phone-scroll px-5 py-4">
        {step === 0 && <SetupIntro />}
        {step === 1 && <SetupPatient />}
        {step === 2 && <SetupDateTime />}
        {step === 3 && <SetupAlarms />}
        {step === 4 && <SetupReview />}
      </div>

      <div className="px-5 pt-3 pb-6 bg-white border-t border-ink-100 flex gap-2">
        {step > 0 && (
          <Button variant="outline" onClick={() => setStep((s) => s - 1)}>
            이전
          </Button>
        )}
        <Button
          variant="primary"
          full
          onClick={() => {
            if (step < 4) setStep((s) => s + 1);
            else app.goTo("tabs");
          }}
        >
          {step === 4 ? "시작하기" : step === 0 ? "시작" : "다음"}
        </Button>
      </div>
    </div>
  );
};

type IntroItem = { icon: ReactNode; t: string; s: string };

const INTRO_ITEMS: IntroItem[] = [
  { icon: <I.Bell size={18} />, t: "알람으로 알려드려요", s: "아침·점심·저녁 자동 알림" },
  { icon: <I.Check size={18} />, t: "3가지만 체크하면 끝", s: "눈금·잠금장치·온도센서" },
  { icon: <I.Share size={18} />, t: "기록은 PDF로 저장", s: "다음 외래에서 의료진과 공유" },
];

const SetupIntro = (): ReactNode => (
  <div className="animate-fade-up">
    <div className="flex flex-col items-center mt-2">
      <PumpIllustration remaining={1} size={120} />
    </div>
    <h2 className="mt-4 text-[24px] font-bold tracking-tight text-ink-900 text-center leading-tight">
      퇴원 후 44시간,
      <br />
      안심하고 함께할게요
    </h2>
    <p className="mt-3 text-center text-[13px] text-ink-500 leading-relaxed">
      홈펌프 항암제 치료 동안
      <br />3 가지 점검을 하루 3번 안내해드립니다
    </p>

    <div className="mt-7 space-y-3">
      {INTRO_ITEMS.map((x) => (
        <div key={x.t} className="bg-white rounded-2xl p-3 flex items-center gap-3 border border-ink-100">
          <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
            {x.icon}
          </div>
          <div>
            <div className="text-[14px] font-semibold text-ink-900">{x.t}</div>
            <div className="text-[12px] text-ink-500">{x.s}</div>
          </div>
        </div>
      ))}
    </div>

    <div className="mt-5 rounded-xl bg-warn-50 border border-warn-500/20 p-3 flex gap-2.5">
      <I.Info size={16} className="text-warn-600 shrink-0 mt-0.5" />
      <p className="text-[12px] text-ink-700 leading-relaxed">
        이 앱은 보조 도구이며, 의료 판단을 대신하지 않습니다. 이상 증상 시 즉시 의료진에게 문의하세요.
      </p>
    </div>
  </div>
);

const SetupPatient = (): ReactNode => {
  const app = useApp();
  const { patient } = app;
  return (
    <div className="animate-fade-up">
      <h2 className="text-[22px] font-bold tracking-tight">환자 정보를 알려주세요</h2>
      <p className="mt-1 text-[13px] text-ink-500">기록을 의료진과 공유할 때 사용돼요</p>

      <div className="mt-5 space-y-3">
        <TextInput
          label="이름"
          placeholder="홍길동"
          value={patient.name}
          onChange={(name) => app.setPatient({ ...patient, name })}
        />
        <TextInput
          label="등록번호"
          placeholder="0000000"
          tnum
          value={patient.mrn}
          onChange={(mrn) => app.setPatient({ ...patient, mrn })}
        />
        <TextInput
          label="처방 요법"
          placeholder="FOLFOX, FOLFIRI 등"
          value={patient.regimen}
          onChange={(regimen) => app.setPatient({ ...patient, regimen })}
        />
      </div>

      <div className="mt-4 rounded-xl bg-ink-100/60 p-3 text-[12px] text-ink-600 leading-relaxed">
        🔒 입력하신 정보는 이 기기에만 저장되며, PDF로 내보내실 때만 사용됩니다.
      </div>
    </div>
  );
};

const SetupDateTime = (): ReactNode => {
  const app = useApp();
  const d = app.startAt;
  const [date, setDate] = useState(
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`,
  );
  const [time, setTime] = useState(
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`,
  );
  useEffect(() => {
    const [y, m, da] = date.split("-").map(Number);
    const [h, mi] = time.split(":").map(Number);
    app.setStartAt(new Date(y, m - 1, da, h, mi));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, time]);

  return (
    <div className="animate-fade-up">
      <h2 className="text-[22px] font-bold tracking-tight">언제 주입을 시작했나요?</h2>
      <p className="mt-1 text-[13px] text-ink-500">병동에서 연결한 시각을 알려주세요</p>

      <div className="mt-5 space-y-3">
        <DateInput label="주입 시작 날짜" value={date} onChange={setDate} />
        <TimeInput label="주입 시작 시각" value={time} onChange={setTime} />
      </div>

      <div className="mt-5 rounded-2xl bg-brand-50 border border-brand-200 p-4">
        <div className="text-[11px] font-semibold text-brand-700 uppercase tracking-wider">예상 종료</div>
        <div className="mt-1 text-[18px] font-bold tracking-tight text-brand-900">
          {fmtKDateTime(app.endAt)}
        </div>
        <div className="mt-1 text-[12px] text-brand-700/80">
          총 44시간 · 종료 시간은 ±7시간 차이가 있을 수 있습니다
        </div>
      </div>
    </div>
  );
};

type AlarmItem = { k: "morning" | "noon" | "evening"; icon: ReactNode; label: string; hint: string };

const ALARM_ITEMS: AlarmItem[] = [
  { k: "morning", icon: <I.Sun size={18} />, label: "아침", hint: "식사 후" },
  { k: "noon", icon: <I.Coffee size={18} />, label: "점심", hint: "식사 후" },
  { k: "evening", icon: <I.Moon size={18} />, label: "저녁", hint: "식사 후" },
];

const SetupAlarms = (): ReactNode => {
  const app = useApp();
  return (
    <div className="animate-fade-up">
      <h2 className="text-[22px] font-bold tracking-tight">알람 시간을 설정해요</h2>
      <p className="mt-1 text-[13px] text-ink-500">하루 3번, 식사 후로 권장됩니다</p>

      <div className="mt-5 space-y-2.5">
        {ALARM_ITEMS.map((it) => (
          <div key={it.k} className="bg-white border border-ink-200 rounded-2xl p-3.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              {it.icon}
            </div>
            <div className="flex-1">
              <div className="text-[14px] font-semibold">{it.label}</div>
              <div className="text-[11px] text-ink-500">{it.hint}</div>
            </div>
            <TimeInput
              variant="chip"
              label={`${it.label} 알람 시간`}
              value={app.alarmTimes[it.k]}
              onChange={(v) => app.setAlarmTimes({ ...app.alarmTimes, [it.k]: v })}
            />
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-xl bg-ink-100/60 p-3 flex items-start gap-2 text-[12px] text-ink-600">
        <I.Bell size={14} className="mt-0.5 shrink-0" />
        <span>알람 시간에 푸시 알림을 보내드려요. 놓치면 30분 후 다시 알려드립니다.</span>
      </div>
    </div>
  );
};

const SetupReview = (): ReactNode => {
  const app = useApp();
  const rows: Array<[string, string]> = [
    ["환자", app.patient.name],
    ["등록번호", app.patient.mrn],
    ["요법", app.patient.regimen],
    ["주입 시작", fmtKDateTime(app.startAt)],
    ["예상 종료", fmtKDateTime(app.endAt)],
    ["알람", `${app.alarmTimes.morning} · ${app.alarmTimes.noon} · ${app.alarmTimes.evening}`],
  ];
  return (
    <div className="animate-fade-up">
      <h2 className="text-[22px] font-bold tracking-tight">맞게 설정되었나요?</h2>
      <p className="mt-1 text-[13px] text-ink-500">시작 후에도 설정에서 바꿀 수 있어요</p>

      <div className="mt-5 bg-white border border-ink-200 rounded-2xl divide-y divide-ink-100">
        {rows.map(([k, v]) => (
          <div key={k} className="px-4 py-3 flex justify-between items-baseline gap-3">
            <div className="text-[12px] text-ink-500 font-medium">{k}</div>
            <div className="text-[14px] font-semibold text-right tracking-tight">{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-safe-50 border border-safe-500/20 p-4 flex gap-3">
        <I.Shield size={20} className="text-safe-600 shrink-0 mt-0.5" />
        <div className="text-[12.5px] text-ink-700 leading-relaxed">
          <div className="font-semibold text-safe-700 mb-0.5">준비 완료!</div>
          이제 하루 3번 알람을 받고, 3가지 항목을 체크하면 돼요. 이상이 있으면 즉시 안내해드립니다.
        </div>
      </div>
    </div>
  );
};
