"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

export default function SmoothScrollWrapper({ children }: { children: React.ReactNode }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const spacerRef  = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();

  const smoothY = useSpring(scrollY, {
    stiffness: 200,
    damping:   40,
    restDelta: 0.001,
    mass:      0.5,
  });

  const y = useTransform(smoothY, v => -v);

  // ✅ Dispatch a plain custom event every time the RAW scrollY changes.
  // This completely bypasses the spring so the Navbar always gets the
  // true scroll position — not the lagged spring value.
  useEffect(() => {
    const unsub = scrollY.on("change", (val) => {
      window.dispatchEvent(
        new CustomEvent("navscroll", { detail: { scrollY: val } })
      );
    });
    return unsub;
  }, [scrollY]);

  // Detect touchpad and snap spring to avoid lag
  useEffect(() => {
    let isTouchpad = false;
    let timeout: ReturnType<typeof setTimeout>;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 50 && !Number.isInteger(e.deltaY)) {
        isTouchpad = true;
      } else {
        isTouchpad = false;
      }
      if (isTouchpad) smoothY.jump(scrollY.get());
      clearTimeout(timeout);
      timeout = setTimeout(() => { isTouchpad = false; }, 200);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      clearTimeout(timeout);
    };
  }, [smoothY, scrollY]);

  // Keep spacer height in sync with content height
  useEffect(() => {
    if (!contentRef.current || !spacerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (contentRef.current && spacerRef.current) {
        spacerRef.current.style.height = `${contentRef.current.scrollHeight}px`;
      }
    });
    ro.observe(contentRef.current);
    return () => ro.disconnect();
  }, []);

  // Core scrollToSection
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
      <div ref={spacerRef} style={{ width: "100%" }} aria-hidden />
      <motion.div
        ref={contentRef}
        style={{
          y,
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          willChange: "transform",
        }}
      >
        {children}
      </motion.div>
    </>
  );
}