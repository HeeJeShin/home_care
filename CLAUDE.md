# HomeCare — 홈펌프 항암제 자가관리 웹앱

퇴원 후 2박 3일(44시간) 동안 환자가 안심하고 홈펌프를 자가 점검할 수 있도록
돕는 **모바일 웹앱**. 디자인은 Claude Design 핸드오프 번들을 재현한 것.

- 출처 디자인: `HomeCare-print.html` (인쇄/PDF 레퍼런스, 8개 화면 + 표지)
- 데이터는 **기기 로컬에만** 저장(서버/어드민 없음). PDF 내보내기로 의료진과 공유.

## 스택

- **Next.js 16 (App Router) · React 19 · TypeScript · Tailwind v4**
- Tailwind v4는 JS config 없음 — 디자인 토큰은 `src/app/globals.css`의 `@theme`에 정의.
- 폰트: Pretendard(본문), JetBrains Mono(숫자/모노).

## 코딩 컨벤션 (필수)

이 프로젝트는 아래 규칙을 **예외 없이** 따른다. 새 코드/수정 모두 적용.

1. **화살표 함수만 사용.** `function` 선언/표현식 금지. 컴포넌트·핸들러·헬퍼 전부
   `const Foo = (props: FooProps): ReactNode => { ... }` 형태.
2. **타입을 명시한다.**
   - 모든 컴포넌트 props는 별도 `type`으로 선언(`XxxProps`).
   - `any` 금지. 도메인 타입은 `src/types`에 모음.
   - 컴포넌트 반환 타입은 `ReactNode`로 명시.
   - 이벤트 핸들러 인자에 타입 명시(`React.ChangeEvent<HTMLInputElement>` 등).
3. **Tailwind로만 스타일링.** 인라인 `style`은 동적 계산값(SVG 좌표, ring 둘레 등)
   에만 허용. 색/간격/타이포는 토큰 유틸리티 사용. 클래스 조합은 `cx()` 헬퍼.
4. **컴포넌트 분리 / 공통화.** 화면(screen)에 마크업을 인라인하지 말 것.
   - **폼 입력은 반드시 공통 컴포넌트 사용** — `src/components/form/`의
     `Field`, `TextInput`, `DateInput`, `TimeInput`, `Textarea`, `NumberStepper`.
     화면에서 raw `<input>`/`<textarea>`를 직접 쓰지 않는다.
   - 재사용 UI 프리미티브는 `src/components/ui/`, 아이콘 `src/components/icons.tsx`,
     일러스트 `src/components/illustrations/`.
5. **클라이언트 컴포넌트**는 파일 상단에 `'use client'`. 상태는 `useApp()` 컨텍스트.
6. 한국어 UI 카피 유지. 색 의미: Blue=정보, Green=안전, Amber=주의, Red=응급.

## 디렉터리 구조

```
src/
  app/
    layout.tsx          # 폰트, 메타데이터, 전역 CSS
    globals.css         # Tailwind v4 @theme 토큰 · 애니메이션 · 인쇄 CSS
    page.tsx            # 인터랙티브 디자인 캔버스(여러 폰)
    print/page.tsx      # A4 가로 인쇄/PDF 레이아웃(표지 + 8폰)
  components/
    icons.tsx           # 타입 지정된 SVG 아이콘 세트
    ui/                 # 재사용 프리미티브(Button, Card, Pill, Ring ...)
    form/               # 공통 폼 입력 (필수 사용)
    illustrations/      # PumpIllustration, SensorIllustration
    screens/            # 8개 화면 + ScreenRouter
    PhoneApp.tsx        # 폰 프레임 + 화면 라우터(폰별 독립 상태)
  state/AppContext.tsx  # 타입 지정 컨텍스트(Provider/useApp)
  lib/                  # format(날짜), constants(알림/자료 데이터)
  types/                # 도메인 타입(Patient, Check, Route ...)
```

## 명령어

- `npm run dev` — 개발 서버 (`/` 캔버스, `/print` 인쇄용)
- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint

## 커밋 메시지 규칙

- **Conventional Commits** 형식: `<type>: <요약>` (예: `feat: 홈펌프 점검 플로우 구현`).
  - `type`: `feat` `fix` `refactor` `style` `docs` `chore` `test` `build`.
  - 요약은 한국어, 명령형, 50자 이내. 본문은 필요 시 빈 줄 뒤 "왜"를 설명.
- 한 커밋은 한 가지 논리적 변경만 담는다.
- 커밋 메시지 마지막 줄에 아래 트레일러를 붙인다:

  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```

- 기본 브랜치는 `main`, 원격은 `origin`
  (`https://github.com/HeeJeShin/home_care.git`).

## 디자인 토큰 (globals.css `@theme`)

`brand`(블루) `safe`(그린) `warn`(앰버) `danger`(레드) `ink`(슬레이트) 스케일,
`shadow-card/soft/pop`, `animate-fade-up/pulse-soft/check-pop`. 원본 HTML의
`tailwind.config`와 1:1 매핑.
