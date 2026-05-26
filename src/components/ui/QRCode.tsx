"use client";

import { QRCodeSVG } from "qrcode.react";
import { type ReactNode } from "react";
import { cx } from "@/lib/cx";

export type QRCodeProps = {
  value: string;
  size?: number;
  className?: string;
};

export const QRCode = ({ value, size = 200, className }: QRCodeProps): ReactNode => (
  <div className={cx("inline-block p-4 bg-white rounded-2xl shadow-card", className)}>
    <QRCodeSVG
      value={value}
      size={size}
      level="M"
      includeMargin={false}
      bgColor="#ffffff"
      fgColor="#0f172a"
    />
  </div>
);
