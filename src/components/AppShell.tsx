"use client";

import type { ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { SetupScreen } from "@/components/screens/SetupScreen";
import { IntroScreen } from "@/components/screens/IntroScreen";
import { HomeScreen } from "@/components/screens/HomeScreen";
import { CheckScreen } from "@/components/screens/CheckScreen";
import { AlertScreen } from "@/components/screens/AlertScreen";
import { RecordsScreen } from "@/components/screens/RecordsScreen";
import { ExportScreen } from "@/components/screens/ExportScreen";
import { DoneScreen } from "@/components/screens/DoneScreen";
import { BottomNav } from "@/components/ui";

/**
 * 앱 메인 쉘 - 기술 스펙 기준 라우팅
 * 모바일 뷰포트 최적화
 */
export const AppShell = (): ReactNode => {
  const { route } = useApp();

  // 하단 네비게이션이 보이는 라우트
  const showNav = route === "home" || route === "records";

  return (
    <div className="flex flex-col h-screen max-w-[430px] mx-auto bg-white shadow-xl">
      {/* 메인 콘텐츠 */}
      <div className="flex-1 overflow-hidden">
        <ScreenRouter />
      </div>

      {/* 하단 네비게이션 */}
      {showNav && <BottomNav />}
    </div>
  );
};

/**
 * 라우트별 화면 렌더링
 */
const ScreenRouter = (): ReactNode => {
  const { route } = useApp();

  switch (route) {
    case "setup":
      return <SetupScreen />;
    case "intro":
      return <IntroScreen />;
    case "home":
      return <HomeScreen />;
    case "check":
      return <CheckScreen />;
    case "alert":
      return <AlertScreen />;
    case "records":
      return <RecordsScreen />;
    case "export":
      return <ExportScreen />;
    case "done":
      return <DoneScreen />;
    default:
      return <SetupScreen />;
  }
};
