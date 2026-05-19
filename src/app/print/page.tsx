"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PhoneApp } from "@/components/PhoneApp";
import { PHONES, type PhoneSpec } from "@/lib/phones";

type MetaProps = { k: string; v: string };

const Meta = ({ k, v }: MetaProps): ReactNode => (
  <div className="bg-ink-50 rounded-lg px-3.5 py-2.5 border border-ink-200">
    <div className="text-[10px] font-bold text-ink-500 uppercase tracking-widest">{k}</div>
    <div className="text-[13px] font-semibold text-ink-800 mt-0.5">{v}</div>
  </div>
);

type SwatchProps = { c: string; name: string; sub: string };

const Swatch = ({ c, name, sub }: SwatchProps): ReactNode => (
  <div className="flex-1">
    <div className="h-12 rounded-lg border border-ink-200" style={{ background: c }} />
    <div className="mt-1.5 text-[11px] font-bold text-ink-800">{name}</div>
    <div className="text-[10px] text-ink-500 font-mono">{sub}</div>
  </div>
);

const chunkPairs = (list: PhoneSpec[]): PhoneSpec[][] => {
  const pages: PhoneSpec[][] = [];
  for (let i = 0; i < list.length; i += 2) pages.push(list.slice(i, i + 2));
  return pages;
};

const PrintPage = (): ReactNode => {
  const pages = chunkPairs(PHONES);
  const [dateStr] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(
      now.getDate(),
    ).padStart(2, "0")}`;
  });

  useEffect(() => {
    let cancelled = false;
    const run = async (): Promise<void> => {
      try {
        if (document.fonts?.ready) await document.fonts.ready;
      } catch {
        /* fonts API unavailable — proceed anyway */
      }
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      await new Promise<void>((r) => setTimeout(r, 800));
      if (!cancelled) window.print();
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="print-root">
      <section className="print-page cover-page">
        <div className="cover-inner">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-[20px] tracking-tight">
              HC
            </div>
            <div>
              <div className="text-[12px] font-bold text-brand-700 uppercase tracking-widest">
                HomeCare · Prototype
              </div>
              <h1 className="text-[34px] font-bold tracking-tight leading-tight">
                홈펌프 항암제 자가관리 웹앱
              </h1>
            </div>
          </div>
          <p className="mt-5 text-[15px] text-ink-600 leading-relaxed max-w-2xl">
            퇴원 후 2박 3일, 44시간 동안 환자가 안심하고 자가 점검을 수행할 수 있도록 돕는 모바일 웹앱입니다.
            하루 3번 · 3가지 점검 (눈금/풍선 · 잠금장치 · 온도센서), 이상 상황 대처 안내, 의료진 공유용 PDF
            기록 기능을 포함합니다.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 max-w-2xl">
            <Meta k="대상" v="퇴원 후 환자 (2박 3일)" />
            <Meta k="플랫폼" v="Next.js + Tailwind · 모바일 웹" />
            <Meta k="핵심 기능" v="하루 3번 · 3가지 점검 + 알람" />
            <Meta k="데이터" v="기기 로컬 저장 + PDF 내보내기" />
          </div>

          <div className="mt-8 max-w-2xl">
            <div className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-2">
              디자인 시스템
            </div>
            <div className="flex gap-2.5">
              <Swatch c="#2563EB" name="Primary" sub="Blue 600" />
              <Swatch c="#10B981" name="Safe" sub="Green 500" />
              <Swatch c="#F59E0B" name="Warn" sub="Amber 500" />
              <Swatch c="#DC2626" name="Danger" sub="Red 600" />
              <Swatch c="#0F172A" name="Ink" sub="Slate 900" />
            </div>
          </div>

          <div className="mt-7 max-w-2xl">
            <div className="text-[11px] font-bold text-ink-500 uppercase tracking-widest mb-2">
              수록 화면 (총 8종)
            </div>
            <ol className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[13px] text-ink-700">
              {PHONES.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-ink-400 font-mono">{String(i + 1).padStart(2, "0")}</span>
                  <span>{p.label.replace(/^\d+\s·\s/, "")}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="cover-footer">
            <div>HomeCare · Interactive prototype reference</div>
            <div>{dateStr}</div>
          </div>
        </div>
      </section>

      {pages.map((pair, pi) => (
        <section key={pi} className="print-page phones-page">
          <div className="page-header">
            <div className="text-[11px] font-bold text-brand-700 uppercase tracking-widest">HomeCare</div>
            <div className="text-[11px] text-ink-400 tracking-wide tnum">
              {pi * 2 + 1}–{pi * 2 + pair.length} / {PHONES.length}
            </div>
          </div>
          <div className="phones-row">
            {pair.map((p, i) => (
              <PhoneApp
                key={`${pi}-${i}`}
                label={p.label}
                time={p.time}
                initialRoute={p.route}
                initialTab={p.tab}
                initialAlert={p.alert ?? null}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default PrintPage;
