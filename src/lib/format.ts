/** Korean date/time formatting helpers (ported from the design `state.jsx`). */

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

const pad2 = (n: number): string => String(n).padStart(2, "0");

/** "5월 20일 (수) 오후 3시" */
export const fmtKDateTime = (d: Date): string => {
  const w = WEEKDAYS[d.getDay()];
  const ampm = d.getHours() < 12 ? "오전" : "오후";
  const hour12 = ((d.getHours() + 11) % 12) + 1;
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${w}) ${ampm} ${hour12}시`;
};

/** "5/20 15:04" */
export const fmtKShort = (d: Date): string =>
  `${d.getMonth() + 1}/${d.getDate()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`;

/** "15:04" */
export const fmtHM = (d: Date): string => `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
