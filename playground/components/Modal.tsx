"use client";

import React, { useEffect, useRef, useId, useCallback } from "react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement | null>;
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "area[href]",
  'input:not([disabled]):not([type="hidden"])',
  "select:not([disabled])",
  "textarea:not([disabled])",
  "button:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[tabindex]:not([tabindex='-1'])",
  "[contenteditable]",
].join(",");

/**
 * W3C ARIA APG Compliant Modal Dialog Component
 * - role="dialog" & aria-modal="true"
 * - aria-labelledby & aria-describedby
 * - Complete focus trap (Tab / Shift+Tab cycling)
 * - Escape key dismissal
 * - Focus restoration to trigger element upon closing
 * - Background scroll locking
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  // Focus trap implementation
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || !dialogRef.current) return;

      // 1. Escape key dismissal (W3C Dialog requirement)
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      // 2. Focus trapping on Tab
      if (e.key === "Tab") {
        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
        ).filter(
          (el) => el.offsetParent !== null && window.getComputedStyle(el).visibility !== "hidden"
        );

        if (focusableElements.length === 0) {
          e.preventDefault();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element, wrap to last
          if (document.activeElement === firstElement || document.activeElement === dialogRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (!isOpen) return;

    // Save previous active element to restore focus when closing
    previousFocusRef.current = document.activeElement as HTMLElement | null;

    // Prevent body background scrolling
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Attach global keyboard listener
    window.addEventListener("keydown", handleKeyDown);

    // Initial focus management
    const focusTimeout = setTimeout(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else if (dialogRef.current) {
        const focusable = dialogRef.current.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
        if (focusable) {
          focusable.focus();
        } else {
          dialogRef.current.focus();
        }
      }
    }, 10);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(focusTimeout);

      // Restore focus to previous element (W3C Dialog requirement)
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [isOpen, handleKeyDown, initialFocusRef]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={(e) => {
        // Close when clicking outside dialog container
        if (e.target === e.currentTarget) onClose();
      }}
      aria-hidden="false"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descriptionId : undefined}
        tabIndex={-1}
        className="relative w-full max-w-lg p-6 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl text-zinc-100 focus:outline-none"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-zinc-800">
          <div>
            <h2 id={titleId} className="text-xl font-bold text-white">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-zinc-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="text-sm text-zinc-300 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
