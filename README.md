# home_care

홈펌프 항암제 자가관리 웹앱 — 퇴원 후 2박 3일(44시간) 동안 환자가 안심하고
홈펌프를 자가 점검하도록 돕는 모바일 웹앱.

Claude Design 핸드오프 번들(`HomeCare-print.html`)을 Next.js로 재현했습니다.

## 스택

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4

## 실행

```bash
npm install
npm run dev     # http://localhost:3000
```

- `/` — 인터랙티브 디자인 캔버스(8개 화면, 폰별 독립 상태)
- `/print` — A4 가로 인쇄/PDF 레이아웃(표지 + 8폰)

```bash
npm run build   # 프로덕션 빌드
npm run lint     # ESLint
```

## 화면 (8종)

초기 설정 · 홈(주입 진행) · 3단계 점검 플로우 · 이상 상황 안내 ·
기록(타임라인/눈금 추이) · 안내 자료 · PDF 내보내기 · 주입 완료

기여 규칙·아키텍처는 [`CLAUDE.md`](./CLAUDE.md) 참고.
