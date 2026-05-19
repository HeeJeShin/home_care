/** Domain types for the HomeCare self-care app. */

export type Route = "setup" | "tabs" | "check" | "alert" | "end" | "export";

export type Tab = "home" | "records" | "edu" | "settings";

export type AlertType = "no_change" | "leak" | "locked" | "fever" | "pain";

/** A single lock toggle: true = open, false = closed, null = not answered yet. */
export type LockValue = boolean | null;

export type LockPair = [LockValue, LockValue];

export type Patient = {
  name: string;
  mrn: string;
  regimen: string;
};

export type AlarmTimes = {
  morning: string;
  noon: string;
  evening: string;
};

export type AlarmKey = keyof AlarmTimes;

/** A completed check recorded in history. */
export type Check = {
  at: Date;
  scale: number;
  locks: LockPair;
  temp: LockValue;
  ok: boolean;
  note: string;
};

/** The in-progress check being filled out across the 3-step flow. */
export type Draft = {
  scale: number;
  locks: LockPair;
  temp: LockValue;
  note: string;
  photo: boolean;
};

export type Severity = "warn" | "danger";

export type ContactTarget = "ward" | "er";
