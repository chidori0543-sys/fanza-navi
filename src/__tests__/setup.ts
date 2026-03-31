import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Mock IntersectionObserver for framer-motion's whileInView
vi.stubGlobal(
  "IntersectionObserver",
  class IntersectionObserver {
    constructor(
      private callback: IntersectionObserverCallback,
      private options?: IntersectionObserverInit
    ) {}
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
    takeRecords = vi.fn().mockReturnValue([]);
    root = null;
    rootMargin = "";
    thresholds = [0];
  }
);
