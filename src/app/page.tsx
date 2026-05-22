"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { AppProvider } from "@/state/AppContext";
import { AppShell } from "@/components/AppShell";

const HomePage = (): ReactNode => (
  <AppProvider>
    <div className="min-h-screen bg-ink-50 flex flex-col">
      {/* 모바일 앱 영역 */}
      <AppShell />

      {/* 데스크톱에서만 보이는 프로토타입 링크 */}
      <div className="hidden md:block fixed bottom-4 right-4">
        <Link
          href="/prototype"
          className="inline-flex items-center gap-2 px-4 h-10 rounded-xl bg-ink-800 text-white text-[13px] font-semibold hover:bg-ink-900 transition shadow-pop"
        >
          프로토타입 캔버스 보기 →
        </Link>
      </div>
    </div>
  </AppProvider>
);

export default HomePage;
