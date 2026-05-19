"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { TOTAL_HOURS } from "@/lib/constants";
import { fmtKDateTime, fmtKShort, fmtHM } from "@/lib/format";
import type {
  AlarmTimes,
  AlertType,
  Check,
  Draft,
  Patient,
  Route,
  Tab,
} from "@/types";

/** Demo: infusion started 27h before "now" so we are mid-treatment. */
const demoStart = (): Date => {
  const d = new Date();
  d.setHours(d.getHours() - 27);
  d.setMinutes(0, 0, 0);
  return d;
};

const buildDemoChecks = (): Check[] => {
  const s = demoStart();
  const at = (h: number, m = 0): Date => {
    const d = new Date(s);
    d.setHours(s.getHours() + h, m);
    return d;
  };
  return [
    { at: at(2, 30), scale: 118, locks: [true, true], temp: true, ok: true, note: "시작 직후" },
    { at: at(7, 15), scale: 105, locks: [true, true], temp: true, ok: true, note: "" },
    { at: at(13, 5), scale: 85, locks: [true, true], temp: true, ok: true, note: "아침 식사 후" },
    { at: at(19, 0), scale: 65, locks: [true, true], temp: true, ok: true, note: "" },
    { at: at(24, 40), scale: 50, locks: [true, true], temp: true, ok: true, note: "" },
  ];
};

export type AppState = {
  route: Route;
  setRoute: (r: Route) => void;
  goTo: (r: Route) => void;
  tab: Tab;
  setTab: (t: Tab) => void;
  checkStep: number;
  setCheckStep: (updater: number | ((s: number) => number)) => void;
  alertType: AlertType | null;
  setAlertType: (a: AlertType | null) => void;
  patient: Patient;
  setPatient: (p: Patient) => void;
  startAt: Date;
  setStartAt: (d: Date) => void;
  endAt: Date;
  alarmTimes: AlarmTimes;
  setAlarmTimes: (a: AlarmTimes) => void;
  checks: Check[];
  setChecks: (updater: Check[] | ((c: Check[]) => Check[])) => void;
  draft: Draft;
  setDraft: (d: Draft) => void;
  /** Render-stable "current time" for this provider instance. */
  now: Date;
  progress: number;
  remH: number;
  remM: number;
  elH: number;
  totalHours: number;
  nextAlarm: Date;
  streak: number;
  startCheck: () => void;
  submitCheck: (ok?: boolean) => void;
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
  const [route, setRoute] = useState<Route>("setup");
  const [tab, setTab] = useState<Tab>("home");
  const [checkStep, setCheckStep] = useState(0);
  const [alertType, setAlertType] = useState<AlertType | null>(null);

  const [patient, setPatient] = useState<Patient>({
    name: "김민서",
    mrn: "20389471",
    regimen: "FOLFOX",
  });
  const [startAt, setStartAt] = useState<Date>(demoStart);
  const [alarmTimes, setAlarmTimes] = useState<AlarmTimes>({
    morning: "08:00",
    noon: "13:00",
    evening: "19:00",
  });
  const [checks, setChecks] = useState<Check[]>(buildDemoChecks);
  const [draft, setDraft] = useState<Draft>({
    scale: 38,
    locks: [null, null],
    temp: null,
    note: "",
    photo: false,
  });

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

  const goTo = (r: Route): void => setRoute(r);

  const startCheck = (): void => {
    setCheckStep(0);
    const last = checks.at(-1);
    setDraft({
      scale: Math.max(0, last ? last.scale - 5 : 38),
      locks: [null, null],
      temp: null,
      note: "",
      photo: false,
    });
    setRoute("check");
  };

  const submitCheck = (ok = true): void => {
    setChecks((arr) => [
      ...arr,
      {
        at: new Date(),
        scale: draft.scale,
        locks: draft.locks,
        temp: draft.temp,
        ok,
        note: draft.note,
      },
    ]);
  };

  const value: AppState = {
    route,
    setRoute,
    goTo,
    tab,
    setTab,
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
    checks,
    setChecks,
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
    startCheck,
    submitCheck,
    fmtKDateTime,
    fmtKShort,
    fmtHM,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
};
