"use client";

import type { ReactNode } from "react";
import { useApp } from "@/state/AppContext";
import { TabBar } from "@/components/ui";
import { SetupScreen } from "./SetupScreen";
import { HomeScreen } from "./HomeScreen";
import { CheckFlow } from "./CheckFlow";
import { AlertScreen } from "./AlertScreen";
import { RecordsScreen, ExportScreen } from "./RecordsScreen";
import { EndScreen, SettingsScreen } from "./EndScreen";
import { EduScreen } from "./EduScreen";

/** Routes a single phone's state to the right screen. */
export const ScreenRouter = (): ReactNode => {
  const app = useApp();
  const showTabs = app.route === "tabs";

  return (
    <div className="relative h-full overflow-hidden">
      {app.route === "setup" && <SetupScreen />}
      {app.route === "check" && <CheckFlow />}
      {app.route === "alert" && <AlertScreen />}
      {app.route === "end" && <EndScreen />}
      {app.route === "export" && <ExportScreen />}

      {showTabs && (
        <>
          {app.tab === "home" && <HomeScreen />}
          {app.tab === "records" && <RecordsScreen />}
          {app.tab === "edu" && <EduScreen />}
          {app.tab === "settings" && <SettingsScreen />}
          <TabBar tab={app.tab} onTab={app.setTab} />
        </>
      )}
    </div>
  );
};
