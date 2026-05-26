import type { ReactNode } from "react";
import Link from "next/link";
import { PhoneApp } from "@/components/PhoneApp";
import { PHONES } from "@/lib/phones";

type MetaProps = { k: string; v: string };

const Meta = ({ k, v }: MetaProps): ReactNode => (
  <div className="bg-white/70 backdrop-blur rounded-lg px-3 py-2 border border-white">
    <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">{k}</div>
    <div className="text-[12px] font-semibold text-ink-800 mt-0.5">{v}</div>
  </div>
);

const PrototypePage = (): ReactNode => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#E0E7FF_0%,transparent_60%),radial-gradient(circle_at_80%_30%,#D1FAE5_0%,transparent_60%)] bg-ink-50">
    <header className="px-10 pt-10 pb-10 max-w-[1600px] mx-auto">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold tracking-tight">
          HC
        </div>
        <div>
          <div className="text-[11px] font-bold text-brand-700 uppercase tracking-widest">
            HomeCare · Prototype
          </div>
          <h1 className="text-[24px] font-bold tracking-tight">홈펌프 항암제 자가관리 웹앱</h1>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-2 text-[12px] text-ink-600 max-w-4xl">
        <Meta k="대상" v="퇴원 후 환자 (2박 3일)" />
        <Meta k="플랫폼" v="Next.js 16 + React 19 + PWA" />
        <Meta k="핵심" v="하루 3번 · 3가지 점검" />
        <Meta k="데이터 전달" v="QR코드 스캔" />
        <Meta k="내보내기" v="PDF 다운로드" />
      </div>
      <p className="mt-4 text-[13px] text-ink-600 max-w-2xl leading-relaxed">
        아래는 주요 화면 8종입니다. 의료진이 설정 후 QR코드를 생성하면, 환자는 자신의 기기에서 스캔하여 데이터를 받습니다.
        PWA로 홈화면에 설치 가능하며, 알림 권한 허용 시 점검 시간에 자동 알림이 발송됩니다.
      </p>
      <div className="flex gap-3 mt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-safe-500 text-white text-[13px] font-semibold hover:bg-safe-600 transition"
        >
          ← 실제 앱 보기
        </Link>
        <Link
          href="/print"
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-brand-600 text-white text-[13px] font-semibold hover:bg-brand-700 transition"
        >
          인쇄용 PDF 레이아웃 보기 →
        </Link>
      </div>
    </header>

    <div className="px-10 pb-20">
      <div className="flex flex-wrap gap-x-12 gap-y-16 max-w-[1600px] mx-auto justify-center">
        {PHONES.map((p, i) => (
          <PhoneApp
            key={i}
            label={p.label}
            time={p.time}
            initialRoute={p.route}
            initialAlert={p.alert ?? null}
          />
        ))}
      </div>
    </div>

    <footer className="px-10 pb-10 max-w-[1600px] mx-auto text-[11px] text-ink-400 leading-relaxed">
      <div className="font-semibold mb-1">디자인 원칙</div>
      의료앱 컨벤션 우선 · 큰 터치 영역 (44px+) · 명확한 위계 · 색을 통한 상태 전달 (Blue: 정보 · Green: 안전 · Amber: 주의 · Red: 응급) · 한국어 우선
      <div className="mt-2 font-semibold mb-1">주요 기능</div>
      <div>• 의료진 모드: 환자 정보 입력 → QR코드 생성 → 환자 인계</div>
      <div>• 환자 모드: QR스캔 → 알림 권한 허용 → 하루 3번 점검 → PDF 내보내기</div>
      <div className="mt-2 text-ink-300">Tailwind v4 · TypeScript · PWA · Web Notification API</div>
    </footer>
  </div>
);

export default PrototypePage;
