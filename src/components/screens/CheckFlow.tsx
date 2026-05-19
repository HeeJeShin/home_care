"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { cx } from "@/lib/cx";
import { fmtKShort } from "@/lib/format";
import { I } from "@/components/icons";
import { Stepper, Button } from "@/components/ui";
import { NumberStepper, Textarea } from "@/components/form";
import { PumpIllustration } from "@/components/illustrations/PumpIllustration";
import { SensorIllustration } from "@/components/illustrations/SensorIllustration";
import type { LockValue } from "@/types";

export const CheckFlow = (): ReactNode => {
  const app = useApp();
  const step = app.checkStep;

  return (
    <div className="h-full flex flex-col bg-ink-50">
      <div className="pt-12 px-5 pb-3 bg-white border-b border-ink-100">
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={() => {
              if (step === 0) app.goTo("tabs");
              else app.setCheckStep((s) => s - 1);
            }}
            className="w-9 h-9 -ml-2 rounded-full flex items-center justify-center text-ink-700 hover:bg-ink-100"
          >
            <I.ChevL size={20} />
          </button>
          <div className="text-[12px] font-semibold text-ink-500">
            {step < 3 ? `점검 ${step + 1} / 3` : "완료"}
          </div>
          <button
            onClick={() => app.goTo("tabs")}
            className="w-9 h-9 -mr-2 rounded-full flex items-center justify-center text-ink-700 hover:bg-ink-100"
          >
            <I.X size={20} />
          </button>
        </div>
        <Stepper step={step} total={3} />
      </div>

      <div className="flex-1 overflow-auto phone-scroll">
        {step === 0 && <CheckScale />}
        {step === 1 && <CheckLocks />}
        {step === 2 && <CheckTemp />}
        {step === 3 && <CheckComplete />}
      </div>
    </div>
  );
};

const CheckScale = (): ReactNode => {
  const app = useApp();
  const prev = app.checks.at(-1)?.scale ?? 120;
  const [val, setVal] = useState(app.draft.scale);
  const [decision, setDecision] = useState<"ok" | "no_change" | null>(null);
  useEffect(() => {
    app.setDraft({ ...app.draft, scale: val });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [val]);

  const diff = prev - val;
  const lastAt = app.checks.at(-1)?.at;

  return (
    <div className="p-5 animate-fade-up">
      <h2 className="text-[22px] font-bold tracking-tight leading-tight">
        눈금이 줄어들었는지
        <br />
        확인해주세요
      </h2>
      <p className="mt-1.5 text-[13px] text-ink-500">홈펌프 가방의 투명창에서 풍선 위치를 확인해요</p>

      <div className="mt-5 bg-white border border-ink-100 rounded-3xl p-4 shadow-card">
        <div className="flex items-center justify-around">
          <PumpCompare label="지난 점검" value={prev} time={lastAt ? fmtKShort(lastAt) : "—"} />
          <I.ChevR size={20} className="text-ink-300" />
          <PumpCompare label="지금" value={val} time="현재" highlight />
        </div>

        <div className="mt-5">
          <div className="flex items-baseline justify-between">
            <span className="text-[12px] font-semibold text-ink-500 uppercase tracking-wider">현재 눈금</span>
            <span className="text-[12px] text-ink-500">단위: ml</span>
          </div>
          <div className="mt-2">
            <NumberStepper value={val} onChange={setVal} min={0} max={150} />
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-ink-600">
            <span>지난 점검 대비</span>
            <span
              className={cx(
                "font-semibold tnum",
                diff > 0 ? "text-safe-600" : diff < 0 ? "text-danger-600" : "text-warn-600",
              )}
            >
              {diff > 0 ? `−${diff}ml 줄어듦` : diff < 0 ? `+${-diff}ml 증가` : "변화 없음"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <ChoiceCard
          icon={<I.CheckCircle size={20} />}
          tone="safe"
          active={decision === "ok"}
          onClick={() => setDecision("ok")}
          title="정상 줄어듦"
          desc="이전보다 눈금이 내려갔어요"
        />
        <ChoiceCard
          icon={<I.Warn size={20} />}
          tone="danger"
          active={decision === "no_change"}
          onClick={() => setDecision("no_change")}
          title="변화 없음"
          desc="2-3시간째 줄어들지 않아요"
        />
      </div>

      <div className="mt-5">
        {decision === "no_change" ? (
          <Button
            variant="danger"
            full
            onClick={() => {
              app.setAlertType("no_change");
              app.goTo("alert");
            }}
            icon={<I.Warn size={18} />}
          >
            대처 방법 보기
          </Button>
        ) : (
          <Button
            variant="primary"
            full
            disabled={!decision}
            onClick={() => app.setCheckStep(1)}
            iconRight={<I.ChevR size={16} />}
          >
            다음 — 잠금장치
          </Button>
        )}
      </div>
    </div>
  );
};

type PumpCompareProps = { label: string; value: number; time: string; highlight?: boolean };

const PumpCompare = ({ label, value, time, highlight }: PumpCompareProps): ReactNode => {
  const r = Math.max(0, Math.min(1, value / 120));
  return (
    <div className="text-center">
      <div
        className={cx(
          "text-[10px] font-semibold uppercase tracking-wider mb-1",
          highlight ? "text-brand-600" : "text-ink-400",
        )}
      >
        {label}
      </div>
      <div className={cx("rounded-2xl p-2", highlight ? "bg-brand-50 ring-1 ring-brand-200" : "bg-ink-50")}>
        <PumpIllustration remaining={r} size={70} />
      </div>
      <div className="mt-1 text-[16px] font-bold tnum">
        {value}
        <span className="text-[11px] font-medium text-ink-500 ml-0.5">ml</span>
      </div>
      <div className="text-[10px] text-ink-500 tnum">{time}</div>
    </div>
  );
};

type ChoiceTone = "safe" | "danger" | "brand";

type ChoiceCardProps = {
  icon: ReactNode;
  tone?: ChoiceTone;
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
};

const CHOICE_TONES: Record<ChoiceTone, { ring: string; bg: string; text: string; iconBg: string }> = {
  safe: { ring: "ring-safe-500", bg: "bg-safe-50", text: "text-safe-700", iconBg: "bg-safe-100 text-safe-600" },
  danger: { ring: "ring-danger-500", bg: "bg-danger-50", text: "text-danger-700", iconBg: "bg-danger-100 text-danger-600" },
  brand: { ring: "ring-brand-500", bg: "bg-brand-50", text: "text-brand-700", iconBg: "bg-brand-100 text-brand-600" },
};

const ChoiceCard = ({ icon, tone = "safe", active, onClick, title, desc }: ChoiceCardProps): ReactNode => {
  const t = CHOICE_TONES[tone];
  return (
    <button
      onClick={onClick}
      className={cx(
        "text-left rounded-2xl p-3.5 border transition active:scale-[.99]",
        active ? `${t.bg} ring-2 ${t.ring} border-transparent` : "bg-white border-ink-200 hover:bg-ink-50",
      )}
    >
      <div
        className={cx(
          "w-9 h-9 rounded-xl flex items-center justify-center mb-2",
          active ? t.iconBg : "bg-ink-100 text-ink-500",
        )}
      >
        {icon}
      </div>
      <div className={cx("text-[14px] font-bold tracking-tight", active && t.text)}>{title}</div>
      <div className="text-[11px] text-ink-500 mt-0.5 leading-snug">{desc}</div>
    </button>
  );
};

const CheckLocks = (): ReactNode => {
  const app = useApp();
  const [locks, setLocks] = useState(app.draft.locks);
  useEffect(() => {
    app.setDraft({ ...app.draft, locks });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locks]);
  const bothOk = locks[0] === true && locks[1] === true;
  const anyBad = locks[0] === false || locks[1] === false;

  return (
    <div className="p-5 animate-fade-up">
      <h2 className="text-[22px] font-bold tracking-tight leading-tight">
        잠금장치 2곳이
        <br />
        모두 열려있나요?
      </h2>
      <p className="mt-1.5 text-[13px] text-ink-500">2곳 모두 열려있어야 약물이 주입돼요</p>

      <div className="mt-5 space-y-3">
        <LockCard
          idx={1}
          title="케모포트 부위"
          desc="가슴 쪽 케모포트와 연결된 잠금장치"
          value={locks[0]}
          onChange={(v) => setLocks([v, locks[1]])}
        />
        <LockCard
          idx={2}
          title="홈펌프 부위"
          desc="가방 안 펌프 본체 쪽 잠금장치"
          value={locks[1]}
          onChange={(v) => setLocks([locks[0], v])}
        />
      </div>

      <div className="mt-5">
        {anyBad ? (
          <Button
            variant="danger"
            full
            onClick={() => {
              app.setAlertType("locked");
              app.goTo("alert");
            }}
            icon={<I.Warn size={18} />}
          >
            대처 방법 보기
          </Button>
        ) : (
          <Button
            variant="primary"
            full
            disabled={!bothOk}
            onClick={() => app.setCheckStep(2)}
            iconRight={<I.ChevR size={16} />}
          >
            다음 — 온도센서
          </Button>
        )}
      </div>
    </div>
  );
};

type LockCardProps = {
  idx: number;
  title: string;
  desc: string;
  value: LockValue;
  onChange: (v: boolean) => void;
};

const LockCard = ({ idx, title, desc, value, onChange }: LockCardProps): ReactNode => {
  const ok = value === true;
  const bad = value === false;
  return (
    <div
      className={cx(
        "rounded-2xl border p-4 transition",
        ok ? "bg-safe-50 border-safe-200" : bad ? "bg-danger-50 border-danger-200" : "bg-white border-ink-200",
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cx(
            "w-11 h-11 rounded-xl flex items-center justify-center shrink-0",
            ok ? "bg-safe-500 text-white" : bad ? "bg-danger-500 text-white" : "bg-ink-100 text-ink-500",
          )}
        >
          {ok ? <I.LockOpen size={22} /> : <I.Lock size={22} />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-ink-500">#{idx}</span>
            <span className="text-[14px] font-bold tracking-tight">{title}</span>
          </div>
          <div className="text-[12px] text-ink-500 mt-0.5">{desc}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => onChange(true)}
          className={cx(
            "h-10 rounded-xl text-[13px] font-semibold border transition",
            ok ? "bg-safe-600 text-white border-safe-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50",
          )}
        >
          ✓ 열려있음
        </button>
        <button
          onClick={() => onChange(false)}
          className={cx(
            "h-10 rounded-xl text-[13px] font-semibold border transition",
            bad ? "bg-danger-600 text-white border-danger-600" : "bg-white text-ink-700 border-ink-200 hover:bg-ink-50",
          )}
        >
          ✕ 닫혀있음
        </button>
      </div>
    </div>
  );
};

const CheckTemp = (): ReactNode => {
  const app = useApp();
  const [temp, setTemp] = useState<LockValue>(app.draft.temp);
  const [note, setNote] = useState(app.draft.note);
  useEffect(() => {
    app.setDraft({ ...app.draft, temp, note });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temp, note]);

  return (
    <div className="p-5 animate-fade-up">
      <h2 className="text-[22px] font-bold tracking-tight leading-tight">
        온도센서가 피부에
        <br />
        잘 붙어있나요?
      </h2>
      <p className="mt-1.5 text-[13px] text-ink-500">떨어진 경우 다시 부착해주세요</p>

      <div className="mt-5 bg-white border border-ink-100 rounded-3xl p-5 flex items-center justify-center shadow-card">
        <SensorIllustration ok={temp !== false} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <ChoiceCard
          icon={<I.CheckCircle size={20} />}
          tone="safe"
          active={temp === true}
          onClick={() => setTemp(true)}
          title="잘 부착됨"
          desc="피부에 단단히 붙어있어요"
        />
        <ChoiceCard
          icon={<I.Warn size={20} />}
          tone="danger"
          active={temp === false}
          onClick={() => setTemp(false)}
          title="떨어짐"
          desc="센서가 떨어졌어요"
        />
      </div>

      {temp === false && (
        <div className="mt-4 rounded-2xl bg-warn-50 border border-warn-500/20 p-4 animate-fade-up">
          <div className="flex items-center gap-2 text-warn-600">
            <I.Info size={16} />
            <span className="text-[12px] font-bold uppercase tracking-wider">재부착 방법</span>
          </div>
          <ol className="mt-2 space-y-1.5 text-[12.5px] text-ink-700 leading-relaxed">
            <li>
              <span className="font-semibold text-ink-900">①</span> 피부를 깨끗이 닦고 완전히 말려주세요
            </li>
            <li>
              <span className="font-semibold text-ink-900">②</span> 센서를 원래 위치에 부착하고 5초간 눌러주세요
            </li>
            <li>
              <span className="font-semibold text-ink-900">③</span> 모서리가 잘 붙었는지 확인해주세요
            </li>
          </ol>
        </div>
      )}

      <div className="mt-4">
        <Textarea
          label="메모 (선택)"
          value={note}
          onChange={setNote}
          placeholder="예: 식사 후 점검, 잠시 가방 벗었음"
        />
      </div>

      <div className="mt-5">
        <Button
          variant="safe"
          full
          disabled={temp === null}
          onClick={() => {
            app.submitCheck(true);
            app.setCheckStep(3);
          }}
          icon={<I.Check size={18} />}
        >
          점검 완료
        </Button>
      </div>
    </div>
  );
};

const CheckComplete = (): ReactNode => {
  const app = useApp();
  const last = app.checks.at(-1);
  const items: Array<{ icon: ReactNode; label: string; val: string }> = [
    { icon: <I.Droplet size={16} />, label: "눈금/풍선 변화", val: `${last?.scale}ml` },
    { icon: <I.LockOpen size={16} />, label: "잠금장치 2곳", val: "열림 ✓✓" },
    { icon: <I.Thermometer size={16} />, label: "온도센서", val: "부착 ✓" },
  ];
  return (
    <div className="p-5 animate-fade-up text-center">
      <div className="mt-4 inline-flex items-center justify-center w-24 h-24 rounded-full bg-safe-50 animate-check-pop">
        <div className="w-16 h-16 rounded-full bg-safe-500 text-white flex items-center justify-center">
          <I.Check size={36} />
        </div>
      </div>
      <h2 className="mt-5 text-[24px] font-bold tracking-tight">잘 진행되고 있어요</h2>
      <p className="mt-1.5 text-[13px] text-ink-500">이상 없음 · 연속 {app.streak}회째</p>

      <div className="mt-5 bg-white border border-ink-100 rounded-2xl p-4 text-left">
        {items.map((it) => (
          <div key={it.label} className="flex items-center gap-3 py-2">
            <div className="w-8 h-8 rounded-lg bg-safe-50 text-safe-600 flex items-center justify-center">
              {it.icon}
            </div>
            <div className="flex-1 text-[13px] font-medium text-ink-700">{it.label}</div>
            <div className="text-[13px] font-semibold tnum">{it.val}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl bg-brand-50 border border-brand-200 p-4 text-left">
        <div className="flex items-center gap-2 text-brand-700">
          <I.Clock size={16} />
          <span className="text-[11px] font-bold uppercase tracking-wider">다음 점검</span>
        </div>
        <div className="mt-1 text-[15px] font-bold tracking-tight">저녁 점검 · {app.alarmTimes.evening}</div>
        <div className="text-[12px] text-ink-500 mt-0.5">알람을 보내드릴게요</div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <Button variant="outline" onClick={() => app.goTo("tabs")}>
          홈으로
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            app.setTab("records");
            app.goTo("tabs");
          }}
        >
          기록 보기
        </Button>
      </div>
    </div>
  );
};
