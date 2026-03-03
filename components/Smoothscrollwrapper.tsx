"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

// Extend Window type for scrollToSection
declare global {
  interface Window {
    scrollToSection: (id: string) => void;
  }
}

export default function SmoothScrollWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const smoothY = useSpring(scrollY, {
    stiffness: 200,
    damping: 40,
    restDelta: 0.001,
    mass: 0.5,
  });

  const y = useTransform(smoothY, (v) => -v);

  // Dispatch raw scroll position to Navbar (bypasses spring lag)
  useMotionValueEvent(scrollY, "change", (val) => {
    window.dispatchEvent(new CustomEvent("navscroll", { detail: { scrollY: val } }));
  });

  useEffect(() => {
    let rafId: number;
    let lastDeltaY = 0;
    let touchpadFrames = 0; // consecutive touchpad-like frames

    const onWheel = (e: WheelEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const delta = Math.abs(e.deltaY);
        const isLikelyTouchpad =
          delta < 50 ||                         // small increments
          !Number.isInteger(e.deltaY) ||        // fractional pixels
          Math.abs(e.deltaY - lastDeltaY) < 5; // smooth acceleration curve

        lastDeltaY = e.deltaY;

        if (isLikelyTouchpad) {
          touchpadFrames = Math.min(touchpadFrames + 1, 10);
        } else {
          touchpadFrames = Math.max(touchpadFrames - 1, 0);
        }

        // Only snap if we've seen several consecutive touchpad-like frames
        if (touchpadFrames >= 3) {
          smoothY.jump(scrollY.get());
        }
      });
    };

    // Touch devices: always snap spring to real position
    const onTouchMove = () => {
      smoothY.jump(scrollY.get());
    };

    // After touch ends, let spring settle from current position
    const onTouchEnd = () => {
      smoothY.set(scrollY.get());
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [smoothY, scrollY]);

  // Keep spacer height in sync with content height
  useEffect(() => {
    const content = contentRef.current;
    const spacer = spacerRef.current;
    if (!content || !spacer) return;

    const ro = new ResizeObserver(() => {
      spacer.style.height = `${content.scrollHeight}px`;
    });
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  // scrollToSection utility
  useEffect(() => {
    window.scrollToSection = (id: string) => {
      const element = document.getElementById(id);
      if (!element || !contentRef.current) return;

      let top = 0;
      let el: HTMLElement | null = element;
      while (el && el !== contentRef.current) {
        top += el.offsetTop;
        el = el.offsetParent as HTMLElement | null;
      }
      window.scrollTo({ top, behavior: "smooth" });
    };

    const hash = window.location.hash?.replace("#", "");
    if (hash) {
      const timer = setTimeout(() => window.scrollToSection(hash), 300);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {/* Spacer — height is driven by JS, only width can use Tailwind */}
      <div ref={spacerRef} className="w-full" aria-hidden />

      <motion.div
        ref={contentRef}
        style={{ y }}
        className="fixed inset-x-0 top-0 w-full [will-change:transform]"
      >
        {children}
      </motion.div>
    </>
  );
}