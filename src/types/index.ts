/** Domain types for the HomeCare self-care app. */

/** 라우트 - 기술 스펙 기준 */
export type Route =
  | "setup"           // 의료진 입력 모드
  | "intro"           // 환자 인수 화면
  | "home"            // 홈 (탭 없이 단일)
  | "check"           // 점검 플로우
  | "alert"           // 이상 상황
  | "records"         // 기록
  | "export"          // PDF 내보내기
  | "done";           // 주입 완료

/** 의료진 설정 서브스텝 */
export type SetupStep = "patient" | "schedule" | "contact" | "review" | "handoff";

/** 점검 플로우 스텝 (0-3) */
export type CheckStep = 0 | 1 | 2 | 3;

/** 알람 슬롯 */
export type AlarmSlot = "morning" | "noon" | "evening" | "adhoc";

/** 이상 상황 타입 */
export type AlertType = "no_change" | "leak" | "locked" | "fever" | "pain";

/** 심각도 */
export type Severity = "warn" | "danger";

/** 연락처 대상 */
export type ContactTarget = "ward" | "er";

/** 잠금장치 값: true = 열림, false = 닫힘, null = 미응답 */
export type LockValue = boolean | null;

/** 잠금장치 쌍 [포트쪽, 펌프쪽] */
export type LockPair = [LockValue, LockValue];

/** 요법 타입 (3가지 선택형) */
export type RegimenType = "FOLFOX" | "FOLFIRI" | "FOLFOXIRI";

/** 성별 */
export type Gender = "M" | "F";

/** 환자 정보 (의료진이 퇴원 전 입력) */
export type Patient = {
  name: string;
  age: number | null;    // 나이
  gender: Gender | null; // 성별
  mrn: string;           // 등록번호
  birth: string;         // YYYY-MM-DD
  regimen: RegimenType | null; // FOLFOX / FOLFIRI / FOLFOXIRI (선택형)
  round: string;         // 차수 (예: "4 / 12")
  linkedHospital: string; // 연계병원 (선택사항)
  doctor: string;        // 담당의
  nurse: string;         // 담당 간호사
  wardPhone: string;     // 담당병동연락처
};

/** 주입 일정 */
export type Schedule = {
  startAt: string;       // ISO DateTime
  totalHours: 44;
  alarms: AlarmTimes;
};

/** 알람 시간 (HH:MM) */
export type AlarmTimes = {
  morning: string;
  noon: string;
  evening: string;
};

export type AlarmKey = keyof AlarmTimes;

/** 점검 기록 */
export type Check = {
  id: string;
  at: string;            // ISO DateTime
  slot: AlarmSlot;
  scaleMl: number;       // 풍선 잔량 ml
  locks: LockPair;       // [포트쪽, 펌프쪽]
  tempOk: boolean;
  ok: boolean;
  note?: string;
  photoBlob?: Blob;
};

/** 이상 상황 이벤트 */
export type AlertEvent = {
  id: string;
  at: string;            // ISO DateTime
  type: AlertType;
  acknowledged: boolean;
  calledWard?: boolean;
};

/** 앱 모드 */
export type AppMode = "admin" | "patient";

/** 설정 */
export type Settings = {
  staffLocked: boolean;
  staffPinHash?: string;
  pushEndpoint?: string;
  locale: "ko";
};

/** QR 데이터 (URL 쿼리스트링으로 인코딩) */
export type QRData = {
  patient: Patient;
  startAt: string;       // ISO DateTime
  alarmTimes: AlarmTimes;
};

/** 점검 진행 중 임시 데이터 */
export type CheckDraft = {
  scaleMl: number;
  locks: LockPair;
  tempOk: LockValue;
  note: string;
  photo: boolean;
};
