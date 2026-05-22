import type { AlertType, Route } from "@/types";

export type PhoneSpec = {
  label: string;
  route: Route;
  time: string;
  alert?: AlertType;
};

/** The 8 key screens shown on the canvas and the print sheet. */
export const PHONES: PhoneSpec[] = [
  { label: "01 · 초기 설정", route: "setup", time: "09:14" },
  { label: "02 · 환자 인수", route: "intro", time: "09:24" },
  { label: "03 · 홈 (주입 진행중)", route: "home", time: "13:02" },
  { label: "04 · 3단계 체크 플로우", route: "check", time: "15:48" },
  { label: "05 · 이상 상황 (발열)", route: "alert", time: "14:10", alert: "fever" },
  { label: "06 · 기록 (타임라인)", route: "records", time: "20:31" },
  { label: "07 · PDF 내보내기", route: "export", time: "17:22" },
  { label: "08 · 주입 완료 (눈금 0)", route: "done", time: "11:08" },
];
