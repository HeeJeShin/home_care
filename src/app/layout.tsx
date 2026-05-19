import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "HomeCare — 홈펌프 항암제 자가관리",
  description:
    "퇴원 후 44시간, 환자가 안심하고 홈펌프를 자가 점검할 수 있도록 돕는 모바일 웹앱",
};

type RootLayoutProps = {
  children: ReactNode;
};

const RootLayout = ({ children }: RootLayoutProps): ReactNode => (
  <html lang="ko" className="h-full">
    <body className="min-h-full text-ink-900 antialiased">{children}</body>
  </html>
);

export default RootLayout;
