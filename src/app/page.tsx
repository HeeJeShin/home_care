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

const HomePage = (): ReactNode => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_20%_0%,#E0E7FF_0%,transparent_60%),radial-gradient(circle_at_80%_30%,#D1FAE5_0%,transparent_60%)] bg-ink-50">
    <header className="px-10 pt-10 pb-6 max-w-[1600px] mx-auto">
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
      <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2 text-[12px] text-ink-600 max-w-3xl">
        <Meta k="대상" v="퇴원 후 환자 (2박 3일)" />
        <Meta k="플랫폼" v="Next.js + Tailwind · 모바일 웹" />
        <Meta k="핵심" v="하루 3번 · 3가지 점검" />
        <Meta k="저장" v="기기 로컬 · PDF 내보내기" />
      </div>
      <p className="mt-4 text-[13px] text-ink-600 max-w-2xl leading-relaxed">
        아래는 주요 화면 8종입니다. 각 폰은 독립적으로 작동하니 자유롭게 탭하고 둘러보세요. 하단 탭바로 이동,
        카드 탭으로 점검 시작, 상단 우측 종 아이콘으로 알림 확인이 가능합니다.
      </p>
      <Link
        href="/print"
        className="inline-flex items-center gap-2 mt-4 px-4 h-10 rounded-xl bg-brand-600 text-white text-[13px] font-semibold hover:bg-brand-700 transition"
      >
        인쇄용 PDF 레이아웃 보기 →
      </Link>
    </header>

    <div className="px-10 pb-20">
      <div className="flex flex-wrap gap-x-12 gap-y-16 max-w-[1600px] mx-auto justify-center">
        {PHONES.map((p, i) => (
          <PhoneApp
            key={i}
            label={p.label}
            time={p.time}
            initialRoute={p.route}
            initialTab={p.tab}
            initialAlert={p.alert ?? null}
          />
        ))}
      </div>
    </div>

    <footer className="px-10 pb-10 max-w-[1600px] mx-auto text-[11px] text-ink-400 leading-relaxed">
      디자인 원칙 — 의료앱 컨벤션 우선 · 큰 터치 영역 (44px+) · 명확한 위계 · 색을 통한 상태 전달 (Blue:
      정보 · Green: 안전 · Red: 응급) · 한국어 우선
      <div className="mt-1">디자인 시스템 토큰은 Tailwind config로 그대로 옮길 수 있도록 설계되었습니다.</div>
    </footer>
  </div>
);

export default HomePage;
