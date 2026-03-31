"use client";

import { useEffect } from "react";

/**
 * グローバルエラートラッキング。
 * window.onerror と unhandledrejection をキャッチし、
 * Google Analytics にイベントとして送信する。
 * 
 * 将来的に Sentry 等に切り替える場合はこのコンポーネントを置き換える。
 */
export default function ErrorTracker() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      reportError("js_error", {
        message: event.message,
        source: event.filename,
        line: event.lineno,
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      reportError("unhandled_rejection", {
        message: String(event.reason),
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}

function reportError(
  type: string,
  details: Record<string, string | number | undefined>
) {
  // Send to Google Analytics if available
  if (typeof window !== "undefined" && "gtag" in window) {
    const gtag = (window as Record<string, unknown>).gtag as
      | ((...args: unknown[]) => void)
      | undefined;
    gtag?.("event", "exception", {
      description: `${type}: ${details.message}`,
      fatal: false,
    });
  }

  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.error(`[ErrorTracker] ${type}:`, details);
  }
}
