"use client";

import { useState, type ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { cx } from "@/lib/cx";
import { I } from "@/components/icons";
import { Button, Card, QRCode } from "@/components/ui";
import { Field, TextInput, DateInput, TimeInput } from "@/components/form";
import type { SetupStep, RegimenType, Gender } from "@/types";

/** 의료진 설정 스텝 순서 */
const SETUP_STEPS: SetupStep[] = ["patient", "schedule", "contact", "review", "handoff"];
const STEP_LABELS: Record<SetupStep, string> = {
  patient: "환자 정보",
  schedule: "처방 / 일정",
  contact: "연락처 · 알람",
  review: "확인",
  handoff: "전달",
};

/**
 * 의료진 입력 화면 - 기술 스펙 §1
 * 퇴원 전 의료진이 환자 정보, 처방, 연락처 입력
 */
export const SetupScreen = (): ReactNode => {
  const { setupStep, setSetupStep, setStaffLocked, goTo } = useApp();

  const currentIndex = SETUP_STEPS.indexOf(setupStep);

  const handleNext = (): void => {
    if (currentIndex < SETUP_STEPS.length - 1) {
      setSetupStep(SETUP_STEPS[currentIndex + 1]);
    }
  };

  const handlePrev = (): void => {
    if (currentIndex > 0) {
      setSetupStep(SETUP_STEPS[currentIndex - 1]);
    }
  };

  const handleComplete = (): void => {
    setStaffLocked(true);
    goTo("intro");
  };

  return (
    <div className="h-full flex flex-col bg-ink-50">
      {/* 의료진 전용 헤더 */}
      <StaffHeader step={currentIndex} totalSteps={SETUP_STEPS.length} />

      {/* 진행 바 */}
      <div className="px-5 pt-3 pb-2 bg-white border-b border-ink-100">
        <div className="flex gap-1">
          {SETUP_STEPS.map((_, i) => (
            <div
              key={i}
              className={cx(
                "h-1 flex-1 rounded-full transition-colors",
                i <= currentIndex ? "bg-brand-600" : "bg-ink-200"
              )}
            />
          ))}
        </div>
        <div className="mt-2 text-[12px] font-semibold text-ink-700">
          {STEP_LABELS[setupStep]}
        </div>
      </div>

      {/* 스텝별 콘텐츠 */}
      <div className="flex-1 overflow-auto phone-scroll px-5 py-4">
        {setupStep === "patient" && <StepPatient />}
        {setupStep === "schedule" && <StepSchedule />}
        {setupStep === "contact" && <StepContact />}
        {setupStep === "review" && <StepReview />}
        {setupStep === "handoff" && <StepHandoff onComplete={handleComplete} />}
      </div>

      {/* 하단 버튼 */}
      {setupStep !== "handoff" && (
        <div className="px-5 pt-3 pb-6 bg-white border-t border-ink-100 flex gap-2">
          {currentIndex > 0 && (
            <Button variant="outline" onClick={handlePrev}>
              이전
            </Button>
          )}
          <Button
            variant="primary"
            full
            onClick={handleNext}
            iconRight={<I.ChevR size={16} />}
          >
            {setupStep === "review" ? "환자에게 전달" : "다음"}
          </Button>
        </div>
      )}
    </div>
  );
};

/** 의료진 전용 헤더 */
type StaffHeaderProps = {
  step: number;
  totalSteps: number;
};

const StaffHeader = ({ step, totalSteps }: StaffHeaderProps): ReactNode => (
  <div className="bg-ink-900 text-white pt-12 pb-3 px-5">
    <div className="flex items-center gap-2">
      <div className="w-7 h-7 rounded-md bg-warn-500 text-ink-900 flex items-center justify-center font-bold text-[12px]">
        RN
      </div>
      <div className="flex-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-warn-500">
          Medical Staff Only
        </div>
        <div className="text-[13px] font-semibold tracking-tight">
          의료진 입력 — 퇴원 전 작성
        </div>
      </div>
      <div className="text-[11px] text-ink-400 font-mono tnum">
        {step + 1}/{totalSteps}
      </div>
    </div>
  </div>
);

/** 요법 옵션 */
const REGIMEN_OPTIONS: { value: RegimenType; label: string }[] = [
  { value: "FOLFOX", label: "FOLFOX" },
  { value: "FOLFIRI", label: "FOLFIRI" },
  { value: "FOLFOXIRI", label: "FOLFOXIRI" },
];

/** 성별 옵션 */
const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: "M", label: "남" },
  { value: "F", label: "여" },
];

/** STEP 1: 환자 정보 */
const StepPatient = (): ReactNode => {
  const { patient, setPatient } = useApp();

  const update = <K extends keyof typeof patient>(key: K, value: typeof patient[K]): void => {
    setPatient({ ...patient, [key]: value });
  };

  return (
    <div className="animate-fade-up">
      <h2 className="text-[20px] font-bold tracking-tight">환자 정보</h2>

      <div className="mt-3 space-y-2.5">
        <Field label="이름">
          <TextInput value={patient.name} onChange={(v) => update("name", v)} placeholder="홍길동" />
        </Field>

        <div className="grid grid-cols-3 gap-2.5">
          <Field label="나이">
            <TextInput
              value={patient.age !== null ? String(patient.age) : ""}
              onChange={(v) => update("age", v ? Number(v) : null)}
              placeholder="52"
              tnum
            />
          </Field>
          <Field label="성별">
            <div className="flex gap-1.5">
              {GENDER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => update("gender", opt.value)}
                  className={cx(
                    "flex-1 h-11 rounded-xl text-[13px] font-semibold border transition-all",
                    patient.gender === opt.value
                      ? "bg-brand-600 text-white border-brand-600"
                      : "bg-white text-ink-700 border-ink-200 hover:border-brand-300"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>
          <Field label="등록번호">
            <TextInput value={patient.mrn} onChange={(v) => update("mrn", v)} placeholder="12345678" tnum />
          </Field>
        </div>

        <Field label="생년월일">
          <DateInput value={patient.birth} onChange={(v) => update("birth", v)} />
        </Field>

        <Field label="요법">
          <div className="flex gap-1.5">
            {REGIMEN_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("regimen", opt.value)}
                className={cx(
                  "flex-1 h-11 rounded-xl text-[13px] font-semibold border transition-all",
                  patient.regimen === opt.value
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-ink-700 border-ink-200 hover:border-brand-300"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </Field>

        <Field label="차수">
          <TextInput value={patient.round} onChange={(v) => update("round", v)} placeholder="4 / 12" />
        </Field>

        <Field label="연계병원 (선택)">
          <TextInput value={patient.linkedHospital} onChange={(v) => update("linkedHospital", v)} placeholder="OO의원" />
        </Field>
      </div>

      <div className="mt-4 rounded-xl bg-ink-100/60 p-3 text-[11.5px] text-ink-600 leading-relaxed flex gap-2">
        <I.Lock size={14} className="mt-0.5 shrink-0" />
        <span>입력된 환자 정보는 이 기기에만 저장되며, 환자가 PDF로 내보낼 때만 외부로 나갑니다.</span>
      </div>

      {/* 문서 링크 섹션 */}
      <div className="mt-4 pt-4 border-t border-ink-100">
        <div className="text-[10px] font-bold text-ink-400 uppercase tracking-widest mb-2">
          프로젝트 문서
        </div>
        <div className="flex flex-wrap gap-2">
          <a
            href="/docs/HomeCare-spec.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-[11px] font-semibold hover:bg-brand-100 transition-colors"
          >
            <I.Book size={12} />
            기술 문서
          </a>
          <a
            href="https://github.com/HeeJeShin/home_care/blob/main/FEEDBACK.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-safe-50 text-safe-700 text-[11px] font-semibold hover:bg-safe-100 transition-colors"
          >
            <I.Check size={12} />
            피드백 문서
          </a>
          <a
            href="/docs/HomeCare-print.html"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-ink-100 text-ink-700 text-[11px] font-semibold hover:bg-ink-200 transition-colors"
          >
            <I.Camera size={12} />
            디자인 레퍼런스
          </a>
        </div>
      </div>
    </div>
  );
};

/** STEP 2: 처방 / 일정 */
const StepSchedule = (): ReactNode => {
  const { startAt, setStartAt, endAt, alarmTimes, setAlarmTimes, fmtKDateTime } = useApp();

  const formatDate = (d: Date): string => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const formatTime = (d: Date): string => {
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

  const handleDateChange = (dateStr: string): void => {
    const [y, m, da] = dateStr.split("-").map(Number);
    const newDate = new Date(startAt);
    newDate.setFullYear(y, m - 1, da);
    setStartAt(newDate);
  };

  const handleTimeChange = (timeStr: string): void => {
    const [h, m] = timeStr.split(":").map(Number);
    const newDate = new Date(startAt);
    newDate.setHours(h, m, 0, 0);
    setStartAt(newDate);
  };

  const alarmFields = [
    { key: "morning" as const, icon: <I.Sun size={16} />, label: "아침" },
    { key: "noon" as const, icon: <I.Coffee size={16} />, label: "점심" },
    { key: "evening" as const, icon: <I.Moon size={16} />, label: "저녁" },
  ];

  return (
    <div className="animate-fade-up">
      <h2 className="text-[20px] font-bold tracking-tight">주입 일정</h2>
      <p className="mt-1 text-[12.5px] text-ink-500">병동에서 홈펌프를 연결한 정확한 시각</p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Field label="시작 날짜">
          <DateInput value={formatDate(startAt)} onChange={handleDateChange} />
        </Field>
        <Field label="시작 시각">
          <TimeInput value={formatTime(startAt)} onChange={handleTimeChange} />
        </Field>
      </div>

      <div className="mt-3 rounded-2xl bg-brand-50 border border-brand-200 p-4">
        <div className="flex items-center gap-2 text-brand-700">
          <I.Clock size={16} />
          <div className="text-[11px] font-bold uppercase tracking-wider">예상 종료 (44시간 후)</div>
        </div>
        <div className="mt-1.5 text-[17px] font-bold tracking-tight text-brand-900">{fmtKDateTime(endAt)}</div>
        <div className="mt-0.5 text-[11px] text-brand-700/80">종료 시간은 ±7시간 차이가 있을 수 있습니다</div>
      </div>

      <h3 className="mt-5 text-[13px] font-bold tracking-tight">점검 알람 시간</h3>
      <p className="mt-0.5 text-[12px] text-ink-500">하루 3번, 식사 후 권장</p>

      <div className="mt-2.5 space-y-2">
        {alarmFields.map((it) => (
          <div key={it.key} className="bg-white border border-ink-200 rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">{it.icon}</div>
            <div className="flex-1 text-[13px] font-semibold">{it.label}</div>
            <TimeInput value={alarmTimes[it.key]} onChange={(v) => setAlarmTimes({ ...alarmTimes, [it.key]: v })} variant="chip" />
          </div>
        ))}
      </div>
    </div>
  );
};

/** STEP 3: 연락처 */
const StepContact = (): ReactNode => {
  const { patient, setPatient } = useApp();

  const update = <K extends keyof typeof patient>(key: K, value: typeof patient[K]): void => {
    setPatient({ ...patient, [key]: value });
  };

  return (
    <div className="animate-fade-up">
      <h2 className="text-[20px] font-bold tracking-tight">담당 의료진 · 연락처</h2>
      <p className="mt-1 text-[12.5px] text-ink-500">이상 상황 시 환자가 이 번호로 전화하게 됩니다</p>

      <div className="mt-4 space-y-2.5">
        <Field label="담당의">
          <TextInput value={patient.doctor} onChange={(v) => update("doctor", v)} placeholder="홍길동" />
        </Field>
        <Field label="담당 간호사">
          <TextInput value={patient.nurse} onChange={(v) => update("nurse", v)} placeholder="김간호" />
        </Field>
        <Field label="담당병동연락처 (선택)">
          <TextInput value={patient.wardPhone} onChange={(v) => update("wardPhone", v)} placeholder="02-2072-2000" tnum />
        </Field>
      </div>

      <div className="mt-4 rounded-xl bg-ink-100/60 p-3 flex gap-2 text-[12px] text-ink-700 leading-relaxed">
        <I.Info size={14} className="mt-0.5 shrink-0 text-ink-500" />
        <span>연락처는 선택사항입니다. 입력 시 이상 상황에서 환자가 이 번호로 연락하게 됩니다.</span>
      </div>
    </div>
  );
};

/** STEP 4: 확인 */
const StepReview = (): ReactNode => {
  const { patient, startAt, endAt, alarmTimes, fmtKDateTime } = useApp();

  // 값이 있는 항목만 표시
  const rows: [string, string][] = [
    ["환자", [patient.name, patient.age ? `${patient.age}세` : "", patient.gender === "M" ? "남" : patient.gender === "F" ? "여" : ""].filter(Boolean).join(" · ")],
    patient.mrn ? ["등록번호", patient.mrn] : null,
    patient.regimen ? ["요법 / 차수", `${patient.regimen}${patient.round ? ` · ${patient.round}` : ""}`] : null,
    patient.linkedHospital ? ["연계병원", patient.linkedHospital] : null,
    ["주입 시작", fmtKDateTime(startAt)],
    ["예상 종료", fmtKDateTime(endAt)],
    ["알람", `${alarmTimes.morning} · ${alarmTimes.noon} · ${alarmTimes.evening}`],
    patient.doctor || patient.nurse ? ["담당", [patient.doctor ? `${patient.doctor} 선생님` : "", patient.nurse ? `${patient.nurse} 간호사` : ""].filter(Boolean).join(" · ")] : null,
    patient.wardPhone ? ["담당병동연락처", patient.wardPhone] : null,
  ].filter((row): row is [string, string] => row !== null && row[1] !== "");

  return (
    <div className="animate-fade-up">
      <h2 className="text-[20px] font-bold tracking-tight">입력 내용 확인</h2>
      <p className="mt-1 text-[12.5px] text-ink-500">환자에게 전달 전 한 번 더 검토</p>

      <div className="mt-4 bg-white border border-ink-200 rounded-2xl divide-y divide-ink-100 overflow-hidden">
        {rows.map(([k, v], i) => (
          <div key={i} className="px-4 py-2.5 flex justify-between items-baseline gap-3">
            <div className="text-[11.5px] text-ink-500 font-medium">{k}</div>
            <div className="text-[13px] font-semibold text-right tracking-tight tnum">{v}</div>
          </div>
        ))}
      </div>

      <label className="mt-4 flex items-start gap-2.5 bg-white border border-ink-200 rounded-2xl p-3.5 cursor-pointer">
        <input type="checkbox" defaultChecked className="mt-0.5 w-4 h-4 accent-brand-600 shrink-0" />
        <span className="text-[12.5px] text-ink-700 leading-relaxed">
          환자분께 <b>3가지 점검 항목</b>과 <b>이상 상황 시 연락 절차</b>를 구두로 설명드렸음을 확인합니다.
        </span>
      </label>
    </div>
  );
};

/** STEP 5: 전달 */
type StepHandoffProps = { onComplete: () => void };

const StepHandoff = ({ onComplete }: StepHandoffProps): ReactNode => {
  const { generateQRData, patient } = useApp();
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerateQR = (): void => {
    const encoded = generateQRData();
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    setQrUrl(`${baseUrl}?d=${encoded}`);
    setShowQR(true);
  };

  const handleCopyUrl = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(qrUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback: 선택 후 복사
      const input = document.createElement("input");
      input.value = qrUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isLocalhost = typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

  if (showQR) {
    return (
      <div className="animate-fade-up text-center mt-2">
        <h2 className="text-[20px] font-bold tracking-tight leading-tight">환자 기기로 QR 스캔</h2>
        <p className="mt-1.5 text-[13px] text-ink-600">
          환자의 스마트폰 카메라로 아래 QR 코드를 스캔하세요
        </p>

        <div className="mt-5 flex justify-center">
          <QRCode value={qrUrl} size={180} />
        </div>

        {isLocalhost && (
          <div className="mt-3 bg-warn-50 border border-warn-200 rounded-xl p-3 text-left">
            <div className="flex items-start gap-2">
              <I.Warn size={14} className="text-warn-600 mt-0.5 shrink-0" />
              <div className="text-[11.5px] text-warn-700 leading-relaxed">
                <b>로컬 테스트:</b> 같은 WiFi에서 컴퓨터 IP로 접속해야 합니다.
                <br />터미널에서 IP 확인: <code className="bg-warn-100 px-1 rounded text-[10px]">ipconfig getifaddr en0</code>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleCopyUrl}
          className={cx(
            "mt-3 w-full h-10 rounded-xl text-[12px] font-semibold transition-all flex items-center justify-center gap-2",
            copied
              ? "bg-safe-500 text-white"
              : "bg-ink-100 text-ink-700 hover:bg-ink-200"
          )}
        >
          {copied ? (
            <>
              <I.Check size={14} />
              복사됨
            </>
          ) : (
            <>
              <I.Copy size={14} />
              URL 복사하기
            </>
          )}
        </button>

        <div className="mt-3 bg-brand-50 border border-brand-200 rounded-2xl p-3 text-left">
          <div className="text-[11px] font-bold text-brand-700 uppercase tracking-widest mb-1.5">
            {patient.name || "환자"}님 정보
          </div>
          <div className="text-[12px] text-brand-800">
            QR 스캔 시 환자 기기에 자동으로 정보가 입력됩니다.
          </div>
        </div>

        <div className="mt-3 bg-white border border-ink-200 rounded-2xl p-4 text-left">
          <div className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-2">환자에게 안내</div>
          <ul className="space-y-2 text-[12.5px] text-ink-700 leading-relaxed">
            <li className="flex gap-2">
              <span className="text-brand-600 font-bold mt-0.5">①</span>
              <span>스마트폰 카메라로 QR 코드 스캔</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-600 font-bold mt-0.5">②</span>
              <span>링크를 눌러 앱 열기</span>
            </li>
            <li className="flex gap-2">
              <span className="text-brand-600 font-bold mt-0.5">③</span>
              <span><b>홈 화면에 추가</b>하여 앱처럼 사용</span>
            </li>
          </ul>
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" onClick={() => setShowQR(false)} className="flex-1">
            이전
          </Button>
          <Button variant="primary" onClick={onComplete} className="flex-1" icon={<I.Check size={16} />}>
            전달 완료
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-up text-center mt-2">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-safe-500/15">
        <div className="w-14 h-14 rounded-full bg-safe-500 text-white flex items-center justify-center">
          <I.Check size={28} />
        </div>
      </div>

      <h2 className="mt-4 text-[22px] font-bold tracking-tight leading-tight">환자에게 QR로 전달</h2>
      <p className="mt-1.5 text-[13px] text-ink-600">환자 기기에서 QR 스캔으로 정보를 전달합니다</p>

      {/* 필수 확인사항 — 브라우저 알림 */}
      <NotifyCheck />

      <div className="mt-3 bg-white border border-ink-200 rounded-2xl p-4 text-left">
        <div className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-2">전달 시 안내</div>
        <ul className="space-y-2 text-[12.5px] text-ink-700 leading-relaxed">
          <li className="flex gap-2">
            <span className="text-brand-600 font-bold mt-0.5">①</span>
            <span>알람이 울리면 앱을 열어 <b>3가지 점검</b>을 진행한다고 설명</span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand-600 font-bold mt-0.5">②</span>
            <span>이상 발견 시 앱 안의 <b>「이상 보고」</b> 버튼으로 안내받기</span>
          </li>
          <li className="flex gap-2">
            <span className="text-brand-600 font-bold mt-0.5">③</span>
            <span>다음 외래 방문 시 <b>PDF 기록</b>을 의료진에게 보여주기</span>
          </li>
        </ul>
      </div>

      <div className="mt-3 rounded-xl bg-brand-50 border border-brand-200 p-3 flex items-start gap-2 text-[11.5px] text-brand-700 leading-relaxed text-left">
        <I.Info size={14} className="mt-0.5 shrink-0" />
        <span>QR 코드에 환자 정보가 포함됩니다. 환자가 QR을 스캔하면 자동으로 정보가 입력됩니다.</span>
      </div>

      <Button variant="primary" full className="mt-5" onClick={handleGenerateQR} icon={<I.QR size={16} />}>
        QR 코드 생성
      </Button>
    </div>
  );
};

/** 브라우저 감지 */
type BrowserInfo = { name: string; icon: string };

const detectBrowser = (): BrowserInfo => {
  if (typeof window === "undefined") return { name: "브라우저", icon: "🌐" };
  const ua = navigator.userAgent;
  if (/SamsungBrowser/i.test(ua)) return { name: "Samsung Internet", icon: "🌐" };
  if (/Edg\//i.test(ua)) return { name: "Microsoft Edge", icon: "🌐" };
  if (/Chrome\//i.test(ua) && !/OPR|Edg/i.test(ua)) return { name: "Chrome", icon: "🌐" };
  if (/Firefox\//i.test(ua)) return { name: "Firefox", icon: "🦊" };
  if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) return { name: "Safari", icon: "🧭" };
  return { name: "브라우저", icon: "🌐" };
};

/** PWA / standalone 감지 */
const isStandalone = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as { standalone?: boolean }).standalone === true
  );
};

/** 알림 권한 확인 및 테스트 컴포넌트 */
type NotifyPermission = "granted" | "default" | "denied" | "unsupported";
type TestState = "idle" | "sending" | "sent" | "fail";

const NotifyCheck = (): ReactNode => {
  const supported = typeof window !== "undefined" && "Notification" in window;
  const [perm, setPerm] = useState<NotifyPermission>(
    supported ? (Notification.permission as NotifyPermission) : "unsupported"
  );
  const [testState, setTestState] = useState<TestState>("idle");
  const [showHelp, setShowHelp] = useState(false);
  const browser = detectBrowser();
  const standalone = isStandalone();
  const iOS = typeof navigator !== "undefined" && /iPhone|iPad|iPod/.test(navigator.userAgent);

  const requestPermission = async (): Promise<void> => {
    if (!supported) return;
    try {
      const result = await Notification.requestPermission();
      setPerm(result as NotifyPermission);
    } catch {
      setPerm("denied");
    }
  };

  const sendTest = async (): Promise<void> => {
    if (!supported) return;
    if (perm !== "granted") {
      await requestPermission();
      if (Notification.permission !== "granted") {
        setTestState("fail");
        return;
      }
    }
    setTestState("sending");
    try {
      const n = new Notification("HomeCare 알람 테스트", {
        body: "이렇게 알람이 도착해요 · 13:00 점심 점검 시간입니다",
        tag: "homecare-test",
      });
      n.onclick = (): void => {
        window.focus();
        n.close();
      };
      setTimeout(() => setTestState("sent"), 400);
    } catch {
      setTestState("fail");
    }
  };

  const tones: Record<NotifyPermission, { bg: string; border: string; chipBg: string; chipText: string; label: string; icon: ReactNode }> = {
    granted: { bg: "bg-safe-50", border: "border-safe-200", chipBg: "bg-safe-500", chipText: "text-white", label: "허용됨", icon: <I.CheckCircle size={14} /> },
    default: { bg: "bg-warn-50", border: "border-warn-500/30", chipBg: "bg-warn-500", chipText: "text-white", label: "권한 미요청", icon: <I.Bell size={14} /> },
    denied: { bg: "bg-danger-50", border: "border-danger-200", chipBg: "bg-danger-600", chipText: "text-white", label: "차단됨", icon: <I.X size={14} /> },
    unsupported: { bg: "bg-ink-100", border: "border-ink-200", chipBg: "bg-ink-500", chipText: "text-white", label: "미지원", icon: <I.Warn size={14} /> },
  };
  const t = tones[perm];

  return (
    <div className={cx("mt-5 rounded-2xl border p-4 text-left", t.bg, t.border)}>
      <div className="flex items-center gap-2 mb-2">
        <I.Bell size={16} className="text-ink-800" />
        <span className="text-[11px] font-bold text-ink-800 uppercase tracking-widest">필수 확인 — 웹 알림</span>
      </div>
      <div className="text-[12.5px] text-ink-700 leading-relaxed">
        환자가 알람을 받으려면 이 브라우저의 <b>알림 권한</b>이 허용되어 있어야 해요.
      </div>

      {/* Status grid */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <StatusCell label="브라우저" value={`${browser.icon} ${browser.name}`} ok />
        <StatusCell
          label="알림 권한"
          chip={
            <span className={cx("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold", t.chipBg, t.chipText)}>
              {t.icon}
              {t.label}
            </span>
          }
          ok={perm === "granted"}
        />
      </div>

      {/* iOS + non-standalone warning */}
      {iOS && !standalone && (
        <div className="mt-2 rounded-lg bg-warn-100 border border-warn-500/30 p-2.5 flex items-start gap-2 text-[11.5px] text-warn-600 leading-relaxed">
          <I.Warn size={14} className="mt-0.5 shrink-0" />
          <span><b>iOS</b>는 Safari &quot;홈 화면에 추가&quot; 후 PWA로 실행해야 알림이 작동해요.</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex gap-2">
        {perm !== "granted" && perm !== "unsupported" && (
          <Button variant="outline" size="md" onClick={requestPermission} icon={<I.Bell size={14} />} className="flex-1 !text-[12.5px]">
            권한 요청
          </Button>
        )}
        <Button
          variant={perm === "granted" ? "primary" : "secondary"}
          size="md"
          onClick={sendTest}
          disabled={perm === "unsupported" || perm === "denied"}
          icon={testState === "sent" ? <I.Check size={14} /> : <I.Spark size={14} />}
          className="flex-1 !text-[12.5px]"
        >
          {testState === "sent" ? "알림 발송됨" : testState === "sending" ? "발송 중..." : "테스트 알림 보내기"}
        </Button>
      </div>

      {/* Test result feedback */}
      {testState === "sent" && (
        <div className="mt-2.5 rounded-lg bg-safe-100 border border-safe-200 p-2.5 flex items-start gap-2 text-[11.5px] text-safe-700 leading-relaxed">
          <I.CheckCircle size={14} className="mt-0.5 shrink-0" />
          <span>
            <b>화면에 알림이 표시되었나요?</b> 환자분께 같은 방식으로 매일 3회 알람이 도착한다고 안내해주세요.
          </span>
        </div>
      )}
      {testState === "fail" && (
        <div className="mt-2.5 rounded-lg bg-danger-50 border border-danger-200 p-2.5 flex items-start gap-2 text-[11.5px] text-danger-700 leading-relaxed">
          <I.Warn size={14} className="mt-0.5 shrink-0" />
          <span>알림을 보낼 수 없어요. 권한이 차단되었는지 확인해주세요.</span>
        </div>
      )}

      {/* Help toggle */}
      <button
        onClick={() => setShowHelp((s) => !s)}
        className="mt-2.5 w-full text-[11.5px] font-semibold text-brand-700 flex items-center justify-center gap-1 py-1"
      >
        {browser.name}에서 알림 켜는 법
        <I.ChevDown size={14} className={cx("transition", showHelp && "rotate-180")} />
      </button>
      {showHelp && <HelpInstructions browser={browser.name} iOS={iOS} standalone={standalone} />}
    </div>
  );
};

/** 상태 표시 셀 */
type StatusCellProps = { label: string; value?: string; chip?: ReactNode; ok?: boolean };

const StatusCell = ({ label, value, chip, ok }: StatusCellProps): ReactNode => (
  <div className={cx("rounded-xl bg-white border p-2.5", ok ? "border-safe-200" : "border-ink-200")}>
    <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">{label}</div>
    <div className="mt-1 text-[12.5px] font-semibold text-ink-800 truncate">
      {chip || value}
    </div>
  </div>
);

/** 브라우저별 알림 설정 안내 */
type HelpInstructionsProps = { browser: string; iOS: boolean; standalone: boolean };

const HelpInstructions = ({ browser, iOS, standalone }: HelpInstructionsProps): ReactNode => {
  const guides: Record<string, string[]> = {
    Safari: [
      "Safari 메뉴 → 설정 → 웹사이트 → 알림",
      "이 사이트를 찾아 \"허용\"으로 변경",
      iOS && !standalone ? "iOS는 공유 → \"홈 화면에 추가\" 후 다시 시도" : "",
    ].filter(Boolean),
    Chrome: [
      "주소창 왼쪽 자물쇠 🔒 아이콘 → 사이트 설정",
      "\"알림\" 항목을 \"허용\"으로 변경",
      "페이지 새로고침",
    ],
    "Microsoft Edge": [
      "주소창 왼쪽 자물쇠 🔒 → 사이트 권한",
      "\"알림\"을 \"허용\"으로 설정",
    ],
    Firefox: [
      "주소창 왼쪽 자물쇠 🔒 → 알림 권한 편집",
      "\"허용\"으로 변경 후 새로고침",
    ],
    "Samsung Internet": [
      "메뉴 → 설정 → 사이트 및 다운로드 → 사이트 권한",
      "이 사이트의 알림 권한을 \"허용\"으로 변경",
    ],
  };
  const steps = guides[browser] || guides.Chrome;

  return (
    <div className="mt-2 rounded-lg bg-white/70 border border-ink-200 p-3 animate-fade-up">
      <ol className="space-y-1.5 text-[12px] text-ink-700 leading-relaxed">
        {steps.map((s, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-brand-600 font-bold shrink-0">{i + 1}.</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};
