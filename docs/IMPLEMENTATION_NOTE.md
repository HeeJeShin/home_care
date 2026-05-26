# HomeCare 구현 노트

> 홈펌프 항암제 자가관리 PWA 웹앱의 핵심 기술 구현 사항

## 프로젝트 개요

- **목적**: 퇴원 후 44시간 동안 환자가 홈펌프를 안전하게 자가 점검할 수 있도록 지원
- **스택**: Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4
- **특징**: 서버리스, 오프라인 우선, QR 기반 데이터 전송

---

## 1. QR 기반 환자 데이터 전송 시스템

### 문제 정의
- 의료 환경에서 서버/DB 없이 환자 데이터를 안전하게 전달해야 함
- 환자는 기술에 익숙하지 않으므로 최소한의 조작으로 데이터 수신 필요

### 해결 방안: URL 인코딩 QR 코드

```typescript
// 데이터 직렬화 파이프라인
const qrData: QRData = { patient, startedAt, alarmTimes };
const json = JSON.stringify(qrData);
const encoded = encodeURIComponent(json);  // URL-safe 인코딩
const base64 = btoa(encoded);               // Base64 압축
const url = `${baseUrl}?d=${base64}`;       // QR에 담을 최종 URL
```

### 기술적 고려사항
- **QR 용량 제한**: JSON 최소화 + Base64 인코딩으로 2KB 이내 유지
- **한글 처리**: `encodeURIComponent` → `btoa` 순서로 UTF-8 안전 처리
- **로컬 테스트**: localhost 환경에서는 QR 스캔 불가 → URL 복사 버튼 제공

---

## 2. Safari ITP 대응 이중 저장소 전략

### 문제 정의
- Safari의 ITP(Intelligent Tracking Prevention)가 7일 후 localStorage 삭제
- 환자 데이터가 치료 기간(2박 3일) 동안 반드시 유지되어야 함
- PWA 홈 화면 추가 시 query string이 제거됨

### 해결 방안: localStorage + Cookie 이중 저장

```typescript
const COOKIE_EXPIRY_DAYS = 7;
const STORAGE_KEY = "homecare_patient";

// 쿠키 설정 (Safari ITP 우회)
const setCookie = (name: string, value: string, days: number): void => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  const secure = window.location.protocol === "https:" ? ";Secure" : "";
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/${secure};SameSite=Lax`;
};

// 이중 저장
const saveToStorage = (data: QRData): void => {
  const json = JSON.stringify(data);
  localStorage.setItem(STORAGE_KEY, json);      // 1차: localStorage
  setCookie(STORAGE_KEY, json, COOKIE_EXPIRY_DAYS);  // 2차: Cookie
};

// 복원 (localStorage 우선, 실패 시 Cookie fallback)
const loadFromStorage = (): QRData | null => {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) return JSON.parse(local);

  const cookie = getCookie(STORAGE_KEY);
  if (cookie) {
    const data = JSON.parse(cookie);
    localStorage.setItem(STORAGE_KEY, cookie);  // Cookie → localStorage 복원
    return data;
  }
  return null;
};
```

### PWA 설치 시 데이터 보존

```typescript
// URL 파라미터 감지 즉시 저장 후 clean URL로 리다이렉트
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get("d");

  if (encoded) {
    const json = decodeURIComponent(atob(encoded));
    const data = JSON.parse(json);
    saveToStorage(data);  // 저장 먼저!

    // Clean URL로 교체 (PWA 설치 시 query string 제거 대응)
    window.history.replaceState({}, "", window.location.pathname);
  }
}, []);
```

---

## 3. iOS Safari 뷰포트 및 Safe Area 대응

### 문제 정의
- iPhone 노치/Dynamic Island 영역에 콘텐츠가 가려짐
- Safari에서 좌우 여백이 비정상적으로 표시됨

### 해결 방안: viewport-fit + CSS env()

```typescript
// layout.tsx - Next.js Viewport 설정
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",  // Safe Area 전체 활용
};
```

```css
/* globals.css - Safe Area 패딩 */
body {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* iOS Safari 전체 화면 대응 */
@supports (padding: max(0px)) {
  body {
    padding-left: max(0px, env(safe-area-inset-left));
    padding-right: max(0px, env(safe-area-inset-right));
  }
}
```

---

## 4. 관리자 QR 발송 이력 관리

### 문제 정의
- 관리자가 당일 발송한 환자 정보를 재확인/재발송해야 할 경우 대응 필요
- 서버 없이 클라이언트에서 이력 관리

### 해결 방안: localStorage 기반 발송 이력

```typescript
// 타입 정의
type SentPatient = {
  mrn: string;      // 환자 등록번호
  name: string;     // 환자명
  url: string;      // 생성된 QR URL
  sentAt: string;   // 발송 시각 (ISO string)
};

// 발송 이력 저장
const saveSentPatient = (patient: SentPatient): void => {
  const existing = loadSentPatients();
  const idx = existing.findIndex((p) => p.mrn === patient.mrn);

  if (idx >= 0) {
    existing[idx] = patient;  // 동일 MRN 업데이트
  } else {
    existing.push(patient);
  }

  localStorage.setItem(SENT_PATIENTS_KEY, JSON.stringify(existing));
};

// 당일 발송 목록만 필터링
const getTodaySentPatients = (): SentPatient[] => {
  const today = new Date().toDateString();
  return loadSentPatients().filter(
    (p) => new Date(p.sentAt).toDateString() === today
  );
};
```

### UI 구현
- QR 생성 시 자동으로 이력 저장
- 핸드오프 화면에서 당일 발송 목록 표시
- URL 복사 버튼으로 간편 재발송

---

## 5. 인트로 화면 중복 방지 플래그

### 문제 정의
- 앱 새로고침 시 매번 인트로 화면이 표시되는 UX 문제
- 환자가 "시작하기"를 눌렀으면 다음부터는 홈으로 직행해야 함

### 해결 방안: 인트로 완료 플래그

```typescript
const INTRO_SEEN_KEY = "homecare_intro_seen";

const setIntroSeen = (): void => {
  localStorage.setItem(INTRO_SEEN_KEY, "1");
  setCookie(INTRO_SEEN_KEY, "1", COOKIE_EXPIRY_DAYS);
};

const hasSeenIntro = (): boolean => {
  return (
    localStorage.getItem(INTRO_SEEN_KEY) === "1" ||
    getCookie(INTRO_SEEN_KEY) === "1"
  );
};

// 라우팅 로직
const initialRoute = (): Route => {
  if (!hasPatientData()) return "setup";
  if (!hasSeenIntro()) return "intro";
  return "home";
};
```

---

## 6. PWA 매니페스트 및 아이콘 설정

### Next.js App Router 동적 아이콘

```typescript
// /app/icon-192/route.tsx
import { ImageResponse } from "next/og";

export const GET = (): ImageResponse => {
  return new ImageResponse(
    (
      <div style={{
        width: 192, height: 192,
        background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <span style={{ fontSize: 96, color: "white" }}>💊</span>
      </div>
    ),
    { width: 192, height: 192 }
  );
};
```

### 매니페스트 설정

```typescript
// /app/manifest.ts
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HomeCare — 홈펌프 자가관리",
    short_name: "HomeCare",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
```

---

## 7. Tailwind CSS v4 디자인 토큰

### @theme 기반 CSS 변수

```css
/* globals.css */
@theme {
  --font-sans: "Pretendard Variable", Pretendard, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  /* 시맨틱 컬러 스케일 */
  --color-brand-500: #3b82f6;   /* 정보/기본 */
  --color-safe-500: #10b981;    /* 안전/성공 */
  --color-warn-500: #f59e0b;    /* 주의 */
  --color-danger-500: #ef4444;  /* 위험/응급 */

  /* 커스텀 애니메이션 */
  --animate-fade-up: fade-up 0.4s ease both;
  --animate-check-pop: check-pop 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
```

---

## 아키텍처 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                      HomeCare PWA                          │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   Setup     │───▶│    QR       │───▶│   Intro     │     │
│  │  (의료진)   │    │  Generation │    │   (환자)    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│         │                 │                   │             │
│         ▼                 ▼                   ▼             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              AppContext (상태 관리)                  │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │   │
│  │  │ localStorage │  │   Cookie    │  │  Sent List  │  │   │
│  │  │  (Primary)   │  │ (Fallback)  │  │  (History)  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │    Home     │◀──▶│    Check    │◀──▶│   History   │     │
│  │  (대시보드)  │    │   (점검)    │    │   (기록)    │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## 성과 및 학습

### 기술적 성과
- **오프라인 퍼스트**: 서버 없이 완전한 기능 구현
- **크로스 브라우저**: Safari ITP, iOS Safe Area 등 엣지 케이스 대응
- **PWA 최적화**: 홈 화면 설치 시 데이터 유지 보장

### 학습 포인트
- Safari의 ITP 정책과 스토리지 제한 이해
- QR 코드 용량 제한과 데이터 인코딩 전략
- CSS `env()` 함수와 viewport-fit 활용
- Next.js App Router의 동적 이미지 생성

---

## 기술 스택 상세

| 영역 | 기술 | 버전 |
|------|------|------|
| Framework | Next.js (App Router) | 16.x |
| UI Library | React | 19.x |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| QR Generation | qrcode.react | - |
| PDF Export | html2canvas + jsPDF | - |
| State | React Context + Hooks | - |
| Storage | localStorage + Cookie | - |

---

*Last Updated: 2025-05-26*
