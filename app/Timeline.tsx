"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, MapPin, Check, Radio, ChevronRight, Flame } from "lucide-react";

/* ─────────────────────────────────────────
   Types
───────────────────────────────────────── */
interface TimelineItem {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  venue: string;
  description?: string;
  tag?: string;
}
interface TimelineProps { items: TimelineItem[]; }

/* ─────────────────────────────────────────
   Status helpers
───────────────────────────────────────── */
const isCompleted = (e: string, now: Date) => now >= new Date(e);
const isLive      = (s: string, e: string, now: Date) =>
  now >= new Date(s) && now < new Date(e);

/* ─────────────────────────────────────────
   Theme — purple for done, fire-orange for live, blood-red for upcoming
───────────────────────────────────────── */
const THEME = {
  done: {
    primary:      "#c084fc",
    glow:         "rgba(192,132,252,0.95)",
    soft:         "rgba(192,132,252,0.18)",
    titleColor:   "#f3e8ff",
    titleShadow:  "0 0 12px rgba(192,132,252,0.9), 0 0 30px rgba(168,85,247,0.55), 0 0 55px rgba(126,34,206,0.3)",
    metaColor:    "#e9d5ff",
    metaShadow:   "0 0 8px rgba(192,132,252,0.8), 0 0 20px rgba(168,85,247,0.4)",
    border:       "rgba(192,132,252,0.50)",
    borderHover:  "rgba(192,132,252,0.80)",
    badge:        "linear-gradient(90deg,#4c1d95,#9333ea)",
    badgeShadow:  "0 0 12px rgba(168,85,247,0.80)",
    trackDot:     "#a855f7",
    trackGlow:    "rgba(168,85,247,0.70)",
    number:       "rgba(168,85,247,0.15)",
    cardBg:       "rgba(10,2,18,0.90)",
    cardHoverBg:  "rgba(14,4,24,0.96)",
    tagColor:     "#d8b4fe",
    tagBorder:    "rgba(168,85,247,0.35)",
    metaBg:       "rgba(50,0,80,0.30)",
    metaBorder:   "rgba(168,85,247,0.28)",
    topLine:      "linear-gradient(90deg,transparent,rgba(168,85,247,0.9),rgba(192,132,252,1.0),rgba(255,255,255,0.6),rgba(192,132,252,1.0),rgba(168,85,247,0.9),transparent)",
    leftBar:      "linear-gradient(180deg,transparent,rgba(192,132,252,0.9),rgba(168,85,247,0.6),transparent)",
    iconGlow:     "drop-shadow(0 0 5px rgba(192,132,252,0.9))",
    shimmer:      "rgba(168,85,247,0.08)",
  },
  live: {
    primary:      "#fb923c",
    glow:         "rgba(251,146,60,0.98)",
    soft:         "rgba(251,146,60,0.20)",
    titleColor:   "#fff7ed",
    titleShadow:  "0 0 10px rgba(251,146,60,1.0), 0 0 28px rgba(239,68,68,0.75), 0 0 52px rgba(220,38,38,0.4)",
    metaColor:    "#fed7aa",
    metaShadow:   "0 0 8px rgba(251,146,60,0.92), 0 0 20px rgba(239,68,68,0.55)",
    border:       "rgba(251,146,60,0.65)",
    borderHover:  "rgba(251,146,60,0.95)",
    badge:        "linear-gradient(90deg,#7c2d12,#ea580c)",
    badgeShadow:  "0 0 16px rgba(251,146,60,0.90)",
    trackDot:     "#f97316",
    trackGlow:    "rgba(249,115,22,0.85)",
    number:       "rgba(251,146,60,0.15)",
    cardBg:       "rgba(16,4,0,0.92)",
    cardHoverBg:  "rgba(22,6,0,0.97)",
    tagColor:     "#fdba74",
    tagBorder:    "rgba(251,146,60,0.40)",
    metaBg:       "rgba(80,20,0,0.35)",
    metaBorder:   "rgba(251,146,60,0.35)",
    topLine:      "linear-gradient(90deg,transparent,rgba(239,68,68,0.8),rgba(251,146,60,1.0),rgba(255,255,255,0.7),rgba(251,146,60,1.0),rgba(239,68,68,0.8),transparent)",
    leftBar:      "linear-gradient(180deg,transparent,rgba(251,146,60,0.95),rgba(239,68,68,0.7),transparent)",
    iconGlow:     "drop-shadow(0 0 5px rgba(251,146,60,0.95))",
    shimmer:      "rgba(251,146,60,0.07)",
  },
  upcoming: {
    primary:      "#ef4444",
    glow:         "rgba(239,68,68,0.75)",
    soft:         "rgba(239,68,68,0.12)",
    titleColor:   "#ffe4e4",
    titleShadow:  "0 0 8px rgba(239,68,68,0.65), 0 0 22px rgba(185,28,28,0.35)",
    metaColor:    "#fca5a5",
    metaShadow:   "0 0 6px rgba(239,68,68,0.60)",
    border:       "rgba(239,68,68,0.28)",
    borderHover:  "rgba(239,68,68,0.65)",
    badge:        "linear-gradient(90deg,#7f1d1d,#dc2626)",
    badgeShadow:  "0 0 8px rgba(239,68,68,0.55)",
    trackDot:     "rgba(239,68,68,0.45)",
    trackGlow:    "rgba(239,68,68,0.50)",
    number:       "rgba(239,68,68,0.10)",
    cardBg:       "rgba(8,0,0,0.72)",
    cardHoverBg:  "rgba(14,0,0,0.88)",
    tagColor:     "#f87171",
    tagBorder:    "rgba(239,68,68,0.22)",
    metaBg:       "rgba(50,0,0,0.28)",
    metaBorder:   "rgba(239,68,68,0.18)",
    topLine:      "linear-gradient(90deg,transparent,rgba(185,28,28,0.7),rgba(239,68,68,0.9),rgba(239,68,68,0.9),rgba(185,28,28,0.7),transparent)",
    leftBar:      "linear-gradient(180deg,transparent,rgba(239,68,68,0.75),transparent)",
    iconGlow:     "drop-shadow(0 0 4px rgba(239,68,68,0.65))",
    shimmer:      "rgba(239,68,68,0.05)",
  },
} as const;

/* ─────────────────────────────────────────
   Format helpers
───────────────────────────────────────── */
const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/* ─────────────────────────────────────────
   Card
───────────────────────────────────────── */
function TimelineCard({ item, index, now }: {
  item: TimelineItem; index: number; now: Date;
}) {
  const [hov, setHov] = useState(false);
  const done  = isCompleted(item.endTime, now);
  const live  = isLive(item.startTime, item.endTime, now);
  const t     = done ? THEME.done : live ? THEME.live : THEME.upcoming;
  const lit   = done || live || hov;
  const start = new Date(item.startTime);
  const end   = new Date(item.endTime);

  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 22, scale: 0.96 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 22 } },
      }}
      style={{ position: "relative" }}
    >
      {/* ── Track node ── */}
      <div style={{
        position: "absolute", left: -38, top: 22,
        width: 22, height: 22, borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 4,
        background: done
          ? "linear-gradient(135deg,#4c1d95,#9333ea)"
          : live
          ? "linear-gradient(135deg,#7c2d12,#ea580c)"
          : "rgba(10,0,0,0.92)",
        border: `2px solid ${t.trackDot}`,
        boxShadow: live
          ? `0 0 0 5px rgba(251,146,60,0.12), 0 0 22px ${t.trackGlow}`
          : done
          ? `0 0 14px ${t.trackGlow}`
          : "none",
        animation: live ? "tl-node-fire 1.6s ease-in-out infinite" : "none",
        transition: "all 0.3s",
      }}>
        {done ? (
          <Check size={11} color="#fff" strokeWidth={3} />
        ) : live ? (
          <>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", boxShadow: `0 0 8px ${t.glow}` }} />
            <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: `2px solid rgba(251,146,60,0.55)`, animation: "tl-ping 1.2s ease-out infinite" }} />
          </>
        ) : (
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(239,68,68,0.35)" }} />
        )}
      </div>

      {/* ── Card shell ── */}
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          borderRadius: 14,
          background: hov ? t.cardHoverBg : t.cardBg,
          border: `1px solid ${lit ? t.border : "rgba(180,0,0,0.07)"}`,
          boxShadow: hov
            ? `0 0 0 1px ${t.soft}, 0 0 40px ${t.soft}, 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)`
            : live
            ? `0 0 28px rgba(251,146,60,0.10), 0 4px 20px rgba(0,0,0,0.4)`
            : `0 4px 20px rgba(0,0,0,0.35)`,
          opacity: (!done && !live) ? 0.82 : 1,
          transform: hov ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.22s ease, border-color 0.22s, box-shadow 0.22s, background 0.22s, opacity 0.28s",
          overflow: "hidden",
          padding: "18px 20px 16px 22px",
          willChange: "transform",
        }}
      >
        {/* ── Top neon accent bar ── */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: lit ? t.topLine : "none",
          boxShadow: lit ? `0 0 18px ${t.glow}, 0 0 35px ${t.soft}` : "none",
          transition: "box-shadow 0.22s",
          animation: live ? "tl-topbar-flicker 2.8s ease-in-out infinite" : "none",
        }} />

        {/* ── Left accent bar ── */}
        <div style={{
          position: "absolute", left: 0, top: "12%", bottom: "12%", width: 3,
          borderRadius: "0 3px 3px 0",
          background: lit ? t.leftBar : "transparent",
          boxShadow: lit ? `2px 0 12px ${t.glow}` : "none",
          opacity: lit ? 1 : 0,
          transition: "opacity 0.22s, box-shadow 0.22s",
        }} />

        {/* ── Shimmer sweep on hover ── */}
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(105deg, transparent 40%, ${t.shimmer} 50%, transparent 60%)`,
          transform: hov ? "translateX(100%)" : "translateX(-100%)",
          transition: hov ? "transform 0.55s ease" : "none",
          pointerEvents: "none",
        }} />

        {/* ── Ghost index ── */}
        <div style={{
          position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(2.6rem,4.5vw,3.8rem)",
          fontWeight: 900, lineHeight: 1,
          color: lit ? t.number : "rgba(120,0,0,0.07)",
          userSelect: "none", pointerEvents: "none",
          textShadow: lit ? `0 0 40px ${t.glow}` : "none",
          transition: "color 0.22s, text-shadow 0.22s",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <h3 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(0.72rem,1.5vw,0.92rem)",
            fontWeight: 700, letterSpacing: "0.07em",
            color: lit ? t.titleColor : "rgba(255,190,190,0.50)",
            margin: 0, textTransform: "uppercase",
            textShadow: lit ? t.titleShadow : "none",
            transition: "color 0.22s, text-shadow 0.22s",
            lineHeight: 1.3, maxWidth: "70%",
            animation: live ? "tl-title-fire 2.4s ease-in-out infinite" : "none",
          }}>
            {item.title}
          </h3>

          {/* Badge */}
          <div style={{
            flexShrink: 0,
            background: t.badge,
            color: "#fff",
            fontFamily: "'Orbitron', monospace",
            fontSize: 7.5, fontWeight: 700, letterSpacing: "0.14em",
            padding: "3px 9px", borderRadius: 4,
            boxShadow: t.badgeShadow,
            textTransform: "uppercase",
            textShadow: "0 0 8px rgba(255,255,255,0.5)",
            animation: live ? "tl-badge-blink 1.8s ease-in-out infinite" : "none",
          }}>
            {done ? "✓ DONE" : live ? "🔥 LIVE" : "SOON"}
          </div>
        </div>

        {/* ── Tag ── */}
        {item.tag && (
          <div style={{
            display: "inline-flex", alignItems: "center",
            background: "rgba(0,0,0,0.30)",
            border: `1px solid ${t.tagBorder}`,
            borderRadius: 4, padding: "2px 9px", marginBottom: 10,
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em",
            color: lit ? t.tagColor : "rgba(200,80,80,0.35)",
            textShadow: lit ? `0 0 8px ${t.glow}` : "none",
            textTransform: "uppercase",
            transition: "color 0.22s, text-shadow 0.22s",
          }}>
            {item.tag}
          </div>
        )}

        {/* ── Description ── */}
        {item.description && (
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 12.5, fontWeight: 500, lineHeight: 1.65,
            color: lit ? "rgba(255,220,220,0.60)" : "rgba(255,160,160,0.30)",
            margin: "0 0 12px", letterSpacing: "0.02em",
            transition: "color 0.22s",
          }}>
            {item.description}
          </p>
        )}

        {/* ── Meta pill ── */}
        <div style={{
          display: "flex", flexDirection: "column", gap: 7,
          padding: "10px 13px", borderRadius: 9,
          background: lit ? t.metaBg : "rgba(0,0,0,0.22)",
          border: `1px solid ${lit ? t.metaBorder : "rgba(160,0,0,0.06)"}`,
          marginTop: 6,
          boxShadow: lit ? `inset 0 0 22px rgba(0,0,0,0.45), 0 0 1px ${t.soft}` : "none",
          transition: "background 0.22s, border-color 0.22s",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{
              color: lit ? t.glow : "rgba(180,60,60,0.28)",
              filter: lit ? t.iconGlow : "none",
              display: "flex", alignItems: "center", flexShrink: 0,
              transition: "color 0.22s, filter 0.22s",
            }}>
              <Clock size={13} />
            </span>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 13.5, fontWeight: 700, letterSpacing: "0.05em",
              color: lit ? t.metaColor : "rgba(210,100,100,0.38)",
              textShadow: lit ? t.metaShadow : "none",
              transition: "color 0.22s, text-shadow 0.22s",
              animation: live ? "tl-meta-fire 3.2s ease-in-out infinite" : "none",
            }}>
              {fmtDate(start)}&nbsp;&nbsp;·&nbsp;&nbsp;{fmtTime(start)} – {fmtTime(end)}
            </span>
          </div>

          <div style={{
            height: 1,
            background: lit
              ? `linear-gradient(90deg,transparent,${t.metaBorder},${t.soft},transparent)`
              : "rgba(120,0,0,0.07)",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <span style={{
              color: lit ? t.glow : "rgba(180,60,60,0.28)",
              filter: lit ? t.iconGlow : "none",
              display: "flex", alignItems: "center", flexShrink: 0,
              transition: "color 0.22s, filter 0.22s",
            }}>
              <MapPin size={13} />
            </span>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 13.5, fontWeight: 700, letterSpacing: "0.04em",
              color: lit ? t.metaColor : "rgba(210,100,100,0.38)",
              textShadow: lit ? t.metaShadow : "none",
              transition: "color 0.22s, text-shadow 0.22s",
              animation: live ? "tl-meta-fire 3.6s ease-in-out infinite" : "none",
            }}>
              {item.venue}
            </span>
          </div>
        </div>

        {/* ── Hover sweep bottom bar ── */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg,${t.glow},${t.primary},rgba(255,255,255,0.4),${t.primary},transparent)`,
          transformOrigin: "left",
          transform: hov ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.30s ease",
          boxShadow: `0 0 12px ${t.glow}`,
        }} />

        {/* ── Bottom-right corner accent ── */}
        <div style={{
          position: "absolute", bottom: 0, right: 0,
          width: 28, height: 28,
          borderBottom: `2px solid ${lit ? t.border : "transparent"}`,
          borderRight:  `2px solid ${lit ? t.border : "transparent"}`,
          borderRadius: "0 0 14px 0",
          transition: "border-color 0.22s",
        }} />
        {/* ── Top-left corner accent ── */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: 22, height: 22,
          borderTop:  `2px solid ${lit ? t.border : "transparent"}`,
          borderLeft: `2px solid ${lit ? t.border : "transparent"}`,
          borderRadius: "14px 0 0 0",
          transition: "border-color 0.22s",
        }} />
      </div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Main export
───────────────────────────────────────── */
export default function GlowingTimeline({ items }: TimelineProps) {
  const [now, setNow]             = useState(new Date());
  const containerRef              = useRef<HTMLDivElement>(null);
  const trackRef                  = useRef<HTMLDivElement>(null);
  const [progressH, setProgressH] = useState(0);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const done = items.filter(it => now >= new Date(it.endTime)).length;
    const frac = items.length > 0 ? done / items.length : 0;
    if (trackRef.current) setProgressH(trackRef.current.offsetHeight * frac);
  }, [now, items]);

  const grouped = items.reduce<Record<string, TimelineItem[]>>((acc, item) => {
    const day = new Date(item.startTime).toLocaleDateString("en-IN", {
      weekday: "long", day: "numeric", month: "long", year: "numeric",
    });
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        /* ── Node animations ── */
        @keyframes tl-ping     { 0%{transform:scale(1);opacity:.85} 100%{transform:scale(2.5);opacity:0} }
        @keyframes tl-node-fire{
          0%,100%{box-shadow:0 0 0 4px rgba(251,146,60,0.10),0 0 14px rgba(251,146,60,0.65)}
          50%{box-shadow:0 0 0 8px rgba(251,146,60,0.06),0 0 36px rgba(251,146,60,1.0)}
        }

        /* ── Badge ── */
        @keyframes tl-badge-blink{ 0%,100%{opacity:1} 50%{opacity:.42} }

        /* ── Text fire effects ── */
        @keyframes tl-title-fire{
          0%,100%{text-shadow:0 0 10px rgba(251,146,60,1.0),0 0 28px rgba(239,68,68,0.80),0 0 52px rgba(220,38,38,0.40)}
          30%{text-shadow:0 0 16px rgba(253,186,116,0.9),0 0 36px rgba(251,146,60,0.90),0 0 62px rgba(239,68,68,0.50);filter:brightness(1.1)}
          65%{text-shadow:0 0 8px rgba(251,146,60,0.80),0 0 22px rgba(239,68,68,0.65),0 0 44px rgba(220,38,38,0.35)}
        }
        @keyframes tl-meta-fire{
          0%,100%{text-shadow:0 0 7px rgba(251,146,60,0.88),0 0 16px rgba(239,68,68,0.50)}
          45%{text-shadow:0 0 12px rgba(253,186,116,0.85),0 0 24px rgba(251,146,60,0.70)}
        }
        @keyframes tl-topbar-flicker{0%,100%{opacity:1}45%{opacity:0.68}58%{opacity:0.94}}

        /* ── Header ── */
        @keyframes tl-glitch{
          0%,93%,100%{transform:none;opacity:1}
          94%{transform:translateX(5px);opacity:.70}
          95%{transform:translateX(-3px)}
          96%{transform:none}
        }
        @keyframes tl-header-fire{
          0%,100%{filter:drop-shadow(0 0 18px rgba(239,68,68,0.55)) drop-shadow(0 0 40px rgba(168,85,247,0.28))}
          50%{filter:drop-shadow(0 0 28px rgba(251,146,60,0.70)) drop-shadow(0 0 55px rgba(192,132,252,0.38))}
        }
        @keyframes tl-underline-flame{
          0%,100%{background-position:0% 50%;box-shadow:0 0 14px rgba(249,115,22,0.50),0 0 28px rgba(147,51,234,0.30)}
          50%{background-position:100% 50%;box-hadow:0 0 24px rgba(249,115,22,0.75),0 0 44px rgba(147,51,234,0.50)}
        }
        @keyframes tl-pill-flicker{
          0%,100%{color:rgba(216,180,254,0.75);text-shadow:0 0 10px rgba(168,85,247,0.50)}
          50%{color:rgba(240,160,255,0.90);text-shadow:0 0 18px rgba(192,132,252,0.78)}
        }
        @keyframes tl-dot-blink{0%,100%{opacity:1}50%{opacity:.15}}
        @keyframes tl-clock-glow{
          0%,100%{text-shadow:0 0 8px rgba(168,85,247,0.50)}
          50%{text-shadow:0 0 14px rgba(192,132,252,0.75),0 0 28px rgba(168,85,247,0.35)}
        }
        @keyframes tl-scanline{0%{transform:translateY(-100%)}100%{transform:translateY(320%)}}
        @keyframes tl-day-glow{
          0%,100%{color:rgba(210,150,255,0.72);text-shadow:0 0 12px rgba(168,85,247,0.55),0 0 25px rgba(120,0,200,0.28)}
          50%{color:rgba(230,175,255,0.88);text-shadow:0 0 20px rgba(192,132,252,0.80),0 0 40px rgba(147,51,234,0.42)}
        }

        /* ── Legend ── */
        @keyframes tl-legend-pulse{0%,100%{opacity:.65}50%{opacity:1}}

        /* ── Track progress ── */
        @keyframes tl-track-glow{
          0%,100%{box-shadow:0 0 10px rgba(168,85,247,0.45),0 0 22px rgba(239,68,68,0.25)}
          50%{box-shadow:0 0 16px rgba(192,132,252,0.65),0 0 32px rgba(239,68,68,0.38)}
        }

        .tl-underline-bar{
          width:210px; height:3px; margin:16px auto 0;
          background:linear-gradient(90deg,#7e22ce,#dc2626,#ea580c,#dc2626,#7e22ce);
          background-size:200% 100%; border-radius:2px;
          animation:tl-underline-flame 3.2s ease-in-out infinite;
        }

        @media(max-width:680px){
          .tl-two-col{grid-template-columns:1fr !important}
          .tl-items{padding-left:34px !important}
          .tl-track{left:10px !important}
        }
      `}</style>

      {/* Background is transparent — inherits page bg */}
      <section
        ref={containerRef}
        style={{ position: "relative", padding: "60px 0 90px", overflow: "hidden", background: "transparent" }}
      >
        {/* Parallax purple-crimson shard */}
        <motion.div style={{
          y: bgY,
          position: "absolute", top: "12%", right: "-6%",
          width: "38vw", height: "38vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(120,0,200,0.08) 0%, rgba(200,0,0,0.05) 50%, transparent 70%)",
          pointerEvents: "none", willChange: "transform",
        }} />
        <motion.div style={{
          y: useTransform(scrollYProgress, [0,1], [-20,20]),
          position: "absolute", bottom: "15%", left: "-4%",
          width: "28vw", height: "28vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)",
          pointerEvents: "none", willChange: "transform",
        }} />

        <div style={{ maxWidth: 1020, margin: "0 auto", padding: "0 20px" }}>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }}
            transition={{ duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: "center", marginBottom: 20 }}
          >
            {/* Pill label */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              backgroundColor: "rgba(100,0,160,0.16)",
              border: "1px solid rgba(168,85,247,0.38)",
              borderRadius: 6, padding: "5px 18px", marginBottom: 18,
              fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.22em", textTransform: "uppercase",
              animation: "tl-pill-flicker 3s ease-in-out infinite",
            }}>
              <Radio size={10} color="#a855f7" style={{ filter: "drop-shadow(0 0 4px rgba(168,85,247,0.8))" }} />
              Live Schedule Tracker
            </div>

            {/* Main title */}
            <h2 style={{
              fontFamily: "'Orbitron',monospace",
              fontSize: "clamp(1.9rem,5vw,3.4rem)", fontWeight: 900, letterSpacing: "0.1em",
              backgroundImage: "linear-gradient(135deg,#fff 0%,#fde8ff 14%,#ff3333 42%,#c026d3 68%,#7e22ce 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              margin: 0, lineHeight: 1.1,
              animation: "tl-glitch 8s ease-in-out infinite, tl-header-fire 4s ease-in-out infinite",
            }}>
              EVENT SCHEDULE
            </h2>

            {/* Fire underline */}
            <div className="tl-underline-bar" />

            {/* Live clock */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 9, marginTop: 18,
              backgroundColor: "rgba(0,0,0,0.62)",
              border: "1px solid rgba(168,85,247,0.20)",
              borderRadius: 8, padding: "7px 20px",
              fontFamily: "'Orbitron',monospace", fontSize: 10.5, fontWeight: 700,
              letterSpacing: "0.12em",
              animation: "tl-clock-glow 4s ease-in-out infinite",
              color: "rgba(220,170,255,0.70)",
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%", backgroundColor: "#f97316",
                boxShadow: "0 0 9px rgba(249,115,22,0.90)", display: "inline-block",
                animation: "tl-dot-blink 1.4s ease-in-out infinite",
              }} />
              {now.toLocaleString("en-IN", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </motion.div>

          {/* ── Legend ── */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 52 }}>
            {([
              { dot:"#c084fc", glow:"rgba(192,132,252,0.72)", label:"Completed", bg:"rgba(100,0,180,0.10)", border:"rgba(168,85,247,0.28)", ts:"0 0 8px rgba(192,132,252,0.5)" },
              { dot:"#fb923c", glow:"rgba(251,146,60,0.78)",  label:"Live Now",  bg:"rgba(100,30,0,0.14)",  border:"rgba(251,146,60,0.36)", ts:"0 0 8px rgba(251,146,60,0.6)" },
              { dot:"#ef4444", glow:"rgba(239,68,68,0.62)",   label:"Upcoming",  bg:"rgba(60,0,0,0.11)",    border:"rgba(239,68,68,0.20)", ts:"0 0 8px rgba(239,68,68,0.4)" },
            ] as const).map(s => (
              <div key={s.label} style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                backgroundColor: s.bg, border: `1px solid ${s.border}`,
                borderRadius: 20, padding: "5px 16px",
                fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "rgba(255,255,255,0.72)", textShadow: s.ts,
                animation: "tl-legend-pulse 3.5s ease-in-out infinite",
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: s.dot, boxShadow: `0 0 7px ${s.glow}`, display: "inline-block" }} />
                {s.label}
              </div>
            ))}
          </div>

          {/* ── Day groups ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 58 }}>
            {Object.entries(grouped).map(([day, dayItems], groupIdx) => (
              <div key={day}>

                {/* Day header */}
                <motion.div
                  initial={{ opacity: 0, x: -26 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false, margin: "-40px" }}
                  transition={{ type: "spring", stiffness: 220, damping: 26, delay: groupIdx * 0.06 }}
                  style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}
                >
                  <div style={{
                    fontFamily: "'Orbitron',monospace",
                    fontSize: "clamp(0.65rem,1.6vw,0.82rem)", fontWeight: 700, letterSpacing: "0.14em",
                    textTransform: "uppercase", whiteSpace: "nowrap",
                    animation: "tl-day-glow 4s ease-in-out infinite",
                  }}>
                    {day}
                  </div>
                  <div style={{
                    flex: 1, height: 1,
                    background: "linear-gradient(90deg,rgba(147,51,234,0.40),rgba(239,68,68,0.22),transparent)",
                    boxShadow: "0 0 6px rgba(147,51,234,0.18)",
                  }} />
                  <ChevronRight size={13} color="rgba(168,85,247,0.42)" />
                </motion.div>

                {/* Items + track */}
                <div className="tl-items" style={{ position: "relative", paddingLeft: 46 }}>
                  {/* Track */}
                  <div
                    className="tl-track"
                    ref={groupIdx === 0 ? trackRef : undefined}
                    style={{ position: "absolute", left: 16, top: 0, bottom: 0, width: 2, background: "rgba(100,0,100,0.10)", pointerEvents: "none" }}
                  >
                    <div style={{
                      position: "absolute", left: 0, width: "100%", height: 60,
                      background: "linear-gradient(180deg,transparent,rgba(168,85,247,0.22),rgba(239,68,68,0.16),transparent)",
                      animation: "tl-scanline 4.8s linear infinite",
                    }} />
                    {groupIdx === 0 && (
                      <motion.div
                        animate={{ height: progressH }}
                        transition={{ duration: 1.6, ease: "easeInOut" }}
                        style={{
                          position: "absolute", left: 0, top: 0, width: 2,
                          background: "linear-gradient(180deg,#a855f7,#ec4899,#ef4444,#f97316)",
                          animation: "tl-track-glow 3s ease-in-out infinite",
                        }}
                      />
                    )}
                  </div>

                  {/* Two-col grid */}
                  <motion.div
                    className="tl-two-col"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false, margin: "-30px" }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.07 } },
                    }}
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
                  >
                    {dayItems.map((item, i) => (
                      <TimelineCard key={item.id} item={item} index={i} now={now} />
                    ))}
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

/* ─────────────────────────────────────────
   Demo export
───────────────────────────────────────── */
function TimelineDemo() {
  const items: TimelineItem[] = [
    { id:"1",  title:"Inauguration Ceremony", startTime:new Date(2026,3,2,10,0).toISOString(),  endTime:new Date(2026,3,2,11,0).toISOString(),  venue:"Dr. Triguna Sen Auditorium", tag:"Opening", description:"Official inauguration of Metallix 2026." },
    { id:"2",  title:"Conveynor Speech",       startTime:new Date(2026,3,2,11,0).toISOString(),  endTime:new Date(2026,3,2,12,0).toISOString(),  venue:"Dr. Triguna Sen Auditorium", tag:"Seminar" },
    { id:"3",  title:"Faculty Advisory Speech",startTime:new Date(2026,3,2,12,0).toISOString(),  endTime:new Date(2026,3,2,12,30).toISOString(), venue:"Dr. Triguna Sen Auditorium", tag:"Seminar" },
    { id:"4",  title:"VC, Pro VC, Dean",       startTime:new Date(2026,3,2,12,30).toISOString(), endTime:new Date(2026,3,2,13,30).toISOString(), venue:"Dr. Triguna Sen Auditorium", tag:"Seminar" },
    { id:"5",  title:"Technical Session 1",    startTime:new Date(2026,3,2,13,30).toISOString(), endTime:new Date(2026,3,2,14,30).toISOString(), venue:"Dr. Triguna Sen Auditorium", tag:"Seminar" },
    { id:"6",  title:"Lunch",                  startTime:new Date(2026,3,2,14,30).toISOString(), endTime:new Date(2026,3,2,15,30).toISOString(), venue:"JU Guest House",             tag:"Break" },
    { id:"7",  title:"Technical Session 2",    startTime:new Date(2026,3,2,15,30).toISOString(), endTime:new Date(2026,3,2,18,0).toISOString(),  venue:"Dr. Triguna Sen Auditorium", tag:"Seminar" },
    { id:"8",  title:"CODEMET",                startTime:new Date(2026,3,2,18,30).toISOString(), endTime:new Date(2026,3,2,20,0).toISOString(),  venue:"MetE Dept.",                 tag:"Event" },
    { id:"9",  title:"HACKMET",                startTime:new Date(2026,3,2,20,0).toISOString(),  endTime:new Date(2026,3,2,22,0).toISOString(),  venue:"MetE Dept.",                 tag:"Event" },
    { id:"10", title:"Golazo",                 startTime:new Date(2026,3,3,10,0).toISOString(),  endTime:new Date(2026,3,3,11,0).toISOString(),  venue:"MetE Dept.",                 tag:"Event" },
    { id:"11", title:"Wall Street",            startTime:new Date(2026,3,3,11,0).toISOString(),  endTime:new Date(2026,3,3,12,0).toISOString(),  venue:"K.P Basu Memorial Hall",     tag:"Event" },
    { id:"12", title:"Specio",                 startTime:new Date(2026,3,3,12,0).toISOString(),  endTime:new Date(2026,3,3,12,30).toISOString(), venue:"K.P Basu Memorial Hall",     tag:"Event" },
    { id:"13", title:"Scribe",                 startTime:new Date(2026,3,3,12,30).toISOString(), endTime:new Date(2026,3,3,13,0).toISOString(),  venue:"K.P Basu Memorial Hall",     tag:"Event" },
    { id:"14", title:"Scroll",                 startTime:new Date(2026,3,3,13,0).toISOString(),  endTime:new Date(2026,3,3,13,30).toISOString(), venue:"K.P Basu Memorial Hall",     tag:"Event" },
    { id:"15", title:"Talaash",                startTime:new Date(2026,3,3,13,30).toISOString(), endTime:new Date(2026,3,3,14,30).toISOString(), venue:"K.P Basu Memorial Hall",     tag:"Event" },
    { id:"16", title:"Lunch",                  startTime:new Date(2026,3,3,14,30).toISOString(), endTime:new Date(2026,3,3,15,30).toISOString(), venue:"JU Guest House",             tag:"Break" },
    { id:"17", title:"Gnosis",                 startTime:new Date(2026,3,3,15,30).toISOString(), endTime:new Date(2026,3,3,17,0).toISOString(),  venue:"K.P Basu Memorial Hall",     tag:"Event" },
    { id:"18", title:"Closing Ceremony",       startTime:new Date(2026,3,3,17,0).toISOString(),  endTime:new Date(2026,3,3,18,0).toISOString(),  venue:"K.P Basu Memorial Hall",     tag:"Event" },
  ];
  return <GlowingTimeline items={items} />;
}

export { TimelineDemo };