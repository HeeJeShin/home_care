"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { TOTAL_HOURS } from "@/lib/constants";
import { fmtKDateTime, fmtKShort, fmtHM } from "@/lib/format";
import type {
  AlarmTimes,
  AlertEvent,
  AlertType,
  Check,
  CheckDraft,
  CheckStep,
  Patient,
  Route,
  SetupStep,
  AlarmSlot,
} from "@/types";

/** 데모용: 27시간 전에 주입 시작 (중간 상태) */
const demoStart = (): Date => {
  const d = new Date();
  d.setHours(d.getHours() - 27);
  d.setMinutes(0, 0, 0);
  return d;
};

/** 슬롯 판별 */
const resolveSlot = (now: Date, alarms: AlarmTimes): AlarmSlot => {
  const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
  if (hhmm < alarms.noon) return "morning";
  if (hhmm < alarms.evening) return "noon";
  return "evening";
};

/** 데모 점검 데이터 */
const buildDemoChecks = (startAt: Date, alarms: AlarmTimes): Check[] => {
  const at = (h: number, m = 0): string => {
    const d = new Date(startAt);
    d.setHours(startAt.getHours() + h, m);
    return d.toISOString();
  };
  return [
    { id: "1", at: at(2, 30), slot: "adhoc", scaleMl: 118, locks: [true, true], tempOk: true, ok: true, note: "시작 직후" },
    { id: "2", at: at(7, 15), slot: "morning", scaleMl: 105, locks: [true, true], tempOk: true, ok: true },
    { id: "3", at: at(13, 5), slot: "noon", scaleMl: 85, locks: [true, true], tempOk: true, ok: true, note: "아침 식사 후" },
    { id: "4", at: at(19, 0), slot: "evening", scaleMl: 65, locks: [true, true], tempOk: true, ok: true },
    { id: "5", at: at(24, 40), slot: "morning", scaleMl: 50, locks: [true, true], tempOk: true, ok: true },
  ];
};

export type AppState = {
  // 라우팅
  route: Route;
  setRoute: (r: Route) => void;
  goTo: (r: Route) => void;

  // 의료진 설정 스텝
  setupStep: SetupStep;
  setSetupStep: (s: SetupStep) => void;

  // 점검 플로우 스텝
  checkStep: CheckStep;
  setCheckStep: (s: CheckStep) => void;

  // 이상 상황 타입
  alertType: AlertType | null;
  setAlertType: (a: AlertType | null) => void;

  // 환자 정보
  patient: Patient;
  setPatient: (p: Patient) => void;

  // 일정
  startAt: Date;
  setStartAt: (d: Date) => void;
  endAt: Date;
  alarmTimes: AlarmTimes;
  setAlarmTimes: (a: AlarmTimes) => void;

  // 설정
  staffLocked: boolean;
  setStaffLocked: (l: boolean) => void;

  // 점검 기록
  checks: Check[];
  setChecks: (updater: Check[] | ((c: Check[]) => Check[])) => void;
  addCheck: (check: Check) => void;

  // 이상 이벤트
  alerts: AlertEvent[];
  addAlert: (alert: AlertEvent) => void;

  // 점검 임시 데이터
  draft: CheckDraft;
  setDraft: (d: CheckDraft) => void;

  // 계산된 값
  now: Date;
  progress: number;
  remH: number;
  remM: number;
  elH: number;
  totalHours: number;
  nextAlarm: Date;
  streak: number;
  currentScale: number;

  // 액션
  startCheck: () => void;
  submitCheck: (ok?: boolean) => void;

  // 포맷터
  fmtKDateTime: (d: Date) => string;
  fmtKShort: (d: Date) => string;
  fmtHM: (d: Date) => string;
};

const AppCtx = createContext<AppState | null>(null);

export const useApp = (): AppState => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used within <AppProvider>");
  return ctx;
};

type AppProviderProps = {
  children: ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps): ReactNode => {
  // 라우팅
  const [route, setRoute] = useState<Route>("setup");
  const [setupStep, setSetupStep] = useState<SetupStep>("patient");
  const [checkStep, setCheckStep] = useState<CheckStep>(0);
  const [alertType, setAlertType] = useState<AlertType | null>(null);

  // 환자 정보 (의료진이 퇴원 전 입력)
  const [patient, setPatient] = useState<Patient>({
    name: "김민서",
    mrn: "20389471",
    birth: "1972-08-14",
    regimen: "FOLFOX",
    cycle: "4 / 12",
    ward: "12층 동병동",
    doctor: "박지원",
    nurse: "이서연",
    wardPhone: "02-2072-2000",
    erPhone: "02-2072-2473",
  });

  // 일정
  const [startAt, setStartAt] = useState<Date>(demoStart);
  const [alarmTimes, setAlarmTimes] = useState<AlarmTimes>({
    morning: "08:00",
    noon: "13:00",
    evening: "19:00",
  });

  // 설정
  const [staffLocked, setStaffLocked] = useState(false);

  // 점검 기록
  const [checks, setChecks] = useState<Check[]>(() =>
    buildDemoChecks(demoStart(), { morning: "08:00", noon: "13:00", evening: "19:00" })
  );

  // 이상 이벤트
  const [alerts, setAlerts] = useState<AlertEvent[]>([]);

  // 점검 임시 데이터
  const [draft, setDraft] = useState<CheckDraft>({
    scaleMl: 38,
    locks: [null, null],
    tempOk: null,
    note: "",
    photo: false,
  });

  // 계산된 값
  const endAt = useMemo(() => {
    const d = new Date(startAt);
    d.setHours(d.getHours() + TOTAL_HOURS);
    return d;
  }, [startAt]);

  const [now] = useState(() => new Date());
  const totalMs = TOTAL_HOURS * 3600 * 1000;
  const elapsedMs = now.getTime() - startAt.getTime();
  const progress = Math.max(0, Math.min(1, elapsedMs / totalMs));
  const remainingMs = Math.max(0, totalMs - elapsedMs);
  const remH = Math.floor(remainingMs / 3600000);
  const remM = Math.floor((remainingMs % 3600000) / 60000);
  const elH = Math.floor(elapsedMs / 3600000);

  const nextAlarm = useMemo(() => {
    const times = Object.values(alarmTimes).sort();
    const d = new Date(now);
    for (const t of times) {
      const [hh, mm] = t.split(":").map(Number);
      const nd = new Date(d);
      nd.setHours(hh, mm, 0, 0);
      if (nd > d) return nd;
    }
    const [hh, mm] = times[0].split(":").map(Number);
    const nd = new Date(d);
    nd.setDate(d.getDate() + 1);
    nd.setHours(hh, mm, 0, 0);
    return nd;
  }, [alarmTimes, now]);

  const streak = checks.filter((c) => c.ok).length;
  const currentScale = checks.at(-1)?.scaleMl ?? 120;

  // 액션
  const goTo = useCallback((r: Route): void => setRoute(r), []);

  const addCheck = useCallback((check: Check): void => {
    setChecks((arr) => [...arr, check]);
  }, []);

  const addAlert = useCallback((alert: AlertEvent): void => {
    setAlerts((arr) => [...arr, alert]);
  }, []);

  const startCheck = useCallback((): void => {
    setCheckStep(0);
    const last = checks.at(-1);
    setDraft({
      scaleMl: Math.max(0, last ? last.scaleMl - 5 : 38),
      locks: [null, null],
      tempOk: null,
      note: "",
      photo: false,
    });
    setRoute("check");
  }, [checks]);

  const submitCheck = useCallback((ok = true): void => {
    const check: Check = {
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      slot: resolveSlot(new Date(), alarmTimes),
      scaleMl: draft.scaleMl,
      locks: draft.locks as [boolean, boolean],
      tempOk: draft.tempOk ?? false,
      ok,
      note: draft.note || undefined,
    };
    addCheck(check);
  }, [draft, alarmTimes, addCheck]);

  const value: AppState = {
    route,
    setRoute,
    goTo,
    setupStep,
    setSetupStep,
    checkStep,
    setCheckStep,
    alertType,
    setAlertType,
    patient,
    setPatient,
    startAt,
    setStartAt,
    endAt,
    alarmTimes,
    setAlarmTimes,
    staffLocked,
    setStaffLocked,
    checks,
    setChecks,
    addCheck,
    alerts,
    addAlert,
    draft,
    setDraft,
    now,
    progress,
    remH,
    remM,
    elH,
    totalHours: TOTAL_HOURS,
    nextAlarm,
    streak,
    currentScale,
    startCheck,
    submitCheck,
    fmtKDateTime,
    fmtKShort,
    fmtHM,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
};
