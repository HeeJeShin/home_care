# HomeCare 부분 수정 가이드

기획서 변경 시 전체 재구현 없이 부분만 수정하는 방법.

---

## 1. 현재 아키텍처 요약

```
src/
├── types/index.ts          ← 데이터 모델 정의
├── state/AppContext.tsx    ← 전역 상태 관리
├── components/
│   ├── screens/            ← 화면별 컴포넌트
│   │   ├── SetupScreen.tsx     (5단계 의료진 설정)
│   │   ├── IntroScreen.tsx     (환자 인수)
│   │   ├── HomeScreen.tsx      (홈/대시보드)
│   │   ├── CheckScreen.tsx     (4단계 점검)
│   │   ├── AlertScreen.tsx     (이상 상황 5종)
│   │   ├── RecordsScreen.tsx   (기록 조회)
│   │   ├── ExportScreen.tsx    (PDF 내보내기)
│   │   ├── DoneScreen.tsx      (완료)
│   │   └── ScreenRouter.tsx    (라우팅)
│   ├── ui/                 ← 재사용 UI 컴포넌트
│   ├── form/               ← 폼 입력 컴포넌트
│   └── illustrations/      ← 일러스트
├── lib/
│   ├── phones.ts           ← 프로토타입 폰 설정
│   └── constants.ts        ← 상수값
└── app/
    ├── page.tsx            ← 메인 앱
    ├── print/page.tsx      ← 인쇄용
    └── prototype/page.tsx  ← 프로토타입 캔버스
```

---

## 2. 변경 유형별 수정 방법

### A. UI/디자인만 변경 (색상, 간격, 폰트 등)

**수정 파일**: `src/app/globals.css`

```css
@theme {
  --color-brand-600: #2563EB;  /* ← 여기서 색상 변경 */
  --shadow-card: ...;           /* ← 그림자 변경 */
}
```

### B. 특정 화면 레이아웃 변경

**수정 파일**: 해당 `screens/*.tsx` 파일만

예: 홈 화면 카드 순서 변경 → `HomeScreen.tsx`만 수정

### C. 데이터 모델 변경 (필드 추가/삭제)

**수정 순서**:
1. `src/types/index.ts` - 타입 정의 수정
2. `src/state/AppContext.tsx` - 상태 초기값 수정
3. 해당 필드 사용하는 화면들 수정

예: Patient에 `bloodType` 필드 추가
```typescript
// 1. types/index.ts
export type Patient = {
  ...
  bloodType: string;  // 추가
};

// 2. AppContext.tsx
const [patient, setPatient] = useState<Patient>({
  ...
  bloodType: "A+",  // 초기값 추가
});

// 3. SetupScreen.tsx - 입력 필드 추가
// 4. ExportScreen.tsx - PDF에 표시 추가
```

### D. 라우트/화면 추가

**수정 순서**:
1. `src/types/index.ts` - Route 타입에 추가
2. `src/components/screens/` - 새 화면 파일 생성
3. `src/components/AppShell.tsx` - import 및 case 추가
4. `src/components/screens/ScreenRouter.tsx` - import 및 렌더링 추가
5. `src/lib/phones.ts` - 프로토타입에 추가 (선택)

예: "settings" 라우트 추가
```typescript
// 1. types/index.ts
export type Route = "setup" | "intro" | ... | "settings";

// 2. screens/SettingsScreen.tsx 생성

// 3. AppShell.tsx
import { SettingsScreen } from "@/components/screens/SettingsScreen";
// switch문에 case "settings": return <SettingsScreen />; 추가

// 4. ScreenRouter.tsx도 동일하게
```

### E. 라우트/화면 삭제

**수정 순서**:
1. `src/types/index.ts` - Route 타입에서 제거
2. `src/components/AppShell.tsx` - import 및 case 제거
3. `src/components/screens/ScreenRouter.tsx` - import 및 렌더링 제거
4. 해당 화면 파일 삭제
5. `src/lib/phones.ts` - 프로토타입에서 제거

### F. 점검 단계 변경 (CheckScreen)

**수정 파일**:
- `src/types/index.ts` - CheckStep 타입
- `src/components/screens/CheckScreen.tsx` - 단계별 컴포넌트

예: 4단계 → 5단계로 변경
```typescript
// types/index.ts
export type CheckStep = 0 | 1 | 2 | 3 | 4;  // 4 추가

// CheckScreen.tsx
{step === 4 && <CheckNewStep />}  // 새 단계 추가
```

### G. 이상 상황 유형 변경 (AlertScreen)

**수정 파일**: `src/components/screens/AlertScreen.tsx`

```typescript
// AlertType 추가/수정
const CASES: Record<AlertType, AlertCase> = {
  // 새 케이스 추가
  new_type: {
    severity: "warn",
    icon: <I.SomeIcon size={28} />,
    title: "새 이상 상황",
    ...
  },
};

// 스위처에도 추가
const SWITCHER: Array<[AlertType, string]> = [
  ...
  ["new_type", "새 유형"],
];
```

### H. 설정 단계 변경 (SetupScreen)

**수정 파일**: `src/components/screens/SetupScreen.tsx`

```typescript
// 상단의 SETUP_STEPS, STEP_LABELS 수정
const SETUP_STEPS: SetupStep[] = ["patient", "schedule", ...];
const STEP_LABELS: Record<SetupStep, string> = { ... };

// 해당 Step 컴포넌트 추가/수정
const StepNewStep = (): ReactNode => { ... };
```

---

## 3. 빠른 수정 체크리스트

변경사항 확인 시 아래 순서로 체크:

| 변경 내용 | 수정 파일 |
|----------|----------|
| 색상/스타일 | `globals.css` |
| 텍스트/카피 | 해당 화면 `.tsx` |
| 필드 추가 | `types` → `AppContext` → 화면들 |
| 화면 추가 | `types` → 새 파일 → `AppShell` → `ScreenRouter` |
| 화면 삭제 | 역순으로 제거 |
| 알람 시간 | `AppContext.tsx` (alarmTimes) |
| 총 주입 시간 | `lib/constants.ts` (TOTAL_HOURS) |

---

## 4. 빌드 확인

수정 후 반드시 빌드 확인:

```bash
npm run build
```

타입 에러 발생 시:
1. 에러 메시지에서 파일 위치 확인
2. 해당 파일에서 old 타입/필드명 → new로 수정
3. 다시 빌드

---

## 5. 자주 쓰는 필드명 매핑

| 용도 | 타입/필드 | 위치 |
|-----|----------|------|
| 라우트 | `Route` | `types/index.ts` |
| 설정 단계 | `SetupStep` | `types/index.ts` |
| 점검 단계 | `CheckStep` | `types/index.ts` |
| 이상 유형 | `AlertType` | `types/index.ts` |
| 환자 정보 | `Patient` | `types/index.ts` |
| 점검 기록 | `Check` | `types/index.ts` |
| 눈금값 | `scaleMl` | `Check.scaleMl` |
| 잠금장치 | `locks` | `Check.locks` |
| 온도센서 | `tempOk` | `Check.tempOk` |
| 알람 시간 | `alarmTimes` | `AppContext` |
| 현재 라우트 | `route` | `useApp().route` |
| 화면 이동 | `goTo()` | `useApp().goTo("home")` |
