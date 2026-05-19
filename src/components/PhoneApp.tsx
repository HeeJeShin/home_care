"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AppProvider, useApp } from "@/state/AppContext";
import { PhoneFrame } from "@/components/ui";
import { ScreenRouter } from "@/components/screens/ScreenRouter";
import type { AlertType, Route, Tab } from "@/types";

export type PhoneAppProps = {
  initialRoute?: Route;
  initialTab?: Tab;
  initialAlert?: AlertType | null;
  label?: string;
  time?: string;
};

type PhoneInnerProps = Required<Pick<PhoneAppProps, "initialRoute" | "initialTab">> &
  Pick<PhoneAppProps, "initialAlert" | "label" | "time">;

const PhoneInner = ({
  initialRoute,
  initialTab,
  initialAlert,
  label,
  time,
}: PhoneInnerProps): ReactNode => {
  const app = useApp();
  const initRef = useRef(false);
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    app.setRoute(initialRoute);
    app.setTab(initialTab);
    if (initialAlert) app.setAlertType(initialAlert);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PhoneFrame label={label} time={time}>
      <ScreenRouter />
    </PhoneFrame>
  );
};

/** A self-contained phone mockup with its own independent app state. */
export const PhoneApp = ({
  initialRoute = "tabs",
  initialTab = "home",
  initialAlert = null,
  label,
  time,
}: PhoneAppProps): ReactNode => (
  <AppProvider>
    <PhoneInner
      initialRoute={initialRoute}
      initialTab={initialTab}
      initialAlert={initialAlert}
      label={label}
      time={time}
    />
  </AppProvider>
);
