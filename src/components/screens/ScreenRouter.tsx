"use client";

import type { ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { BottomNav } from "@/components/ui";
import { SetupScreen } from "./SetupScreen";
import { IntroScreen } from "./IntroScreen";
import { HomeScreen } from "./HomeScreen";
import { CheckScreen } from "./CheckScreen";
import { AlertScreen } from "./AlertScreen";
import { RecordsScreen } from "./RecordsScreen";
import { ExportScreen } from "./ExportScreen";
import { DoneScreen } from "./DoneScreen";

/**
 * 라우트별 화면 렌더링 (폰 프레임 내에서 사용)
 */
export const ScreenRouter = (): ReactNode => {
  const { route } = useApp();

  // 하단 네비게이션이 보이는 라우트
  const showNav = route === "home" || route === "records" || route === "export";

  return (
    <div className="relative h-full flex flex-col">
      <div className="flex-1 overflow-hidden">
        {route === "setup" && <SetupScreen />}
        {route === "intro" && <IntroScreen />}
        {route === "home" && <HomeScreen />}
        {route === "check" && <CheckScreen />}
        {route === "alert" && <AlertScreen />}
        {route === "records" && <RecordsScreen />}
        {route === "export" && <ExportScreen />}
        {route === "done" && <DoneScreen />}
      </div>

      {showNav && <BottomNav />}
    </div>
  );
};
