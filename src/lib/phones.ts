import type { AlertType, Route, Tab } from "@/types";

export type PhoneSpec = {
  label: string;
  route: Route;
  tab: Tab;
  time: string;
  alert?: AlertType;
};

/** The 8 key screens shown on the canvas and the print sheet. */
export const PHONES: PhoneSpec[] = [
  { label: "01 · 초기 설정", route: "setup", tab: "home", time: "09:14" },
  { label: "02 · 홈 (주입 진행중)", route: "tabs", tab: "home", time: "09:24" },
  { label: "03 · 3단계 체크 플로우", route: "check", tab: "home", time: "13:02" },
  { label: "04 · 이상 상황 (발열)", route: "alert", tab: "home", time: "15:48", alert: "fever" },
  { label: "05 · 기록 (타임라인)", route: "tabs", tab: "records", time: "14:10" },
  { label: "06 · 안내 자료", route: "tabs", tab: "edu", time: "20:31" },
  { label: "07 · PDF 내보내기", route: "export", tab: "home", time: "17:22" },
  { label: "08 · 주입 완료 (눈금 0)", route: "end", tab: "home", time: "11:08" },
];
