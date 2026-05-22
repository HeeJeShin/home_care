"use client";

import { useEffect, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { I } from "@/components/icons";
import { IconBtn } from "./IconBtn";

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  /** 닫기 버튼 표시 여부 */
  showClose?: boolean;
  /** 배경 클릭으로 닫기 허용 */
  closeOnBackdrop?: boolean;
  /** 모달 크기 */
  size?: "sm" | "md" | "lg" | "full";
  className?: string;
};

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  full: "max-w-full mx-4",
};

export const Modal = ({
  open,
  onClose,
  title,
  children,
  showClose = true,
  closeOnBackdrop = true,
  size = "md",
  className,
}: ModalProps): ReactNode => {
  // ESC 키로 닫기
  useEffect(() => {
    if (!open) return;

    const handleEsc = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  // 스크롤 방지
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm animate-fade-in"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "modal-title" : undefined}
        className={cx(
          "relative w-full bg-white rounded-2xl shadow-pop animate-fade-up",
          SIZES[size],
          className
        )}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            {title && (
              <h2
                id="modal-title"
                className="text-[17px] font-bold tracking-tight"
              >
                {title}
              </h2>
            )}
            {showClose && (
              <IconBtn onClick={onClose} label="닫기" className="ml-auto">
                <I.X size={20} />
              </IconBtn>
            )}
          </div>
        )}

        {/* Content */}
        <div className={cx(!title && !showClose && "pt-5", "px-5 pb-5")}>
          {children}
        </div>
      </div>
    </div>
  );
};

/** 확인/취소 다이얼로그 */
export type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: "brand" | "danger";
};

export const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  tone = "brand",
}: ConfirmModalProps): ReactNode => (
  <Modal open={open} onClose={onClose} title={title} size="sm" showClose={false}>
    <p className="text-[14px] text-ink-600 leading-relaxed">{message}</p>
    <div className="mt-5 flex gap-2">
      <button
        onClick={onClose}
        className="flex-1 h-11 rounded-xl bg-ink-100 text-ink-700 font-semibold text-[14px] hover:bg-ink-200 transition"
      >
        {cancelText}
      </button>
      <button
        onClick={() => {
          onConfirm();
          onClose();
        }}
        className={cx(
          "flex-1 h-11 rounded-xl font-semibold text-[14px] text-white transition",
          tone === "danger"
            ? "bg-danger-600 hover:bg-danger-700"
            : "bg-brand-600 hover:bg-brand-700"
        )}
      >
        {confirmText}
      </button>
    </div>
  </Modal>
);
