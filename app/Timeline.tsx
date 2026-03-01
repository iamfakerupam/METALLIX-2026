"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Clock, MapPin, Check, Radio, Zap, ChevronRight } from "lucide-react";

interface TimelineItem {
  id: string;
  title: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  venue: string;
  description?: string;
  tag?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

/* ── Status helpers ── */
const isCompleted = (endTime: string, now: Date) => now >= new Date(endTime);
const isLive      = (startTime: string, endTime: string, now: Date) =>
  now >= new Date(startTime) && now < new Date(endTime);
const isUpcoming  = (startTime: string, now: Date) => now < new Date(startTime);

/* ── Accent themes ── */
const THEME = {
  done: {
    primary:  "#34d399",
    glow:     "rgba(52,211,153,0.80)",
    soft:     "rgba(52,211,153,0.10)",
    text:     "#6ee7b7",
    border:   "rgba(52,211,153,0.35)",
    badge:    "linear-gradient(90deg,#065f46,#10b981)",
    trackDot: "#34d399",
    number:   "rgba(52,211,153,0.15)",
    cardBg:   "rgba(2,14,8,0.72)",
    tagBg:    "rgba(52,211,153,0.08)",
  },
  live: {
    primary:  "#fbbf24",
    glow:     "rgba(251,191,36,0.92)",
    soft:     "rgba(251,191,36,0.14)",
    text:     "#fde68a",
    border:   "rgba(251,191,36,0.55)",
    badge:    "linear-gradient(90deg,#92400e,#fbbf24)",
    trackDot: "#fbbf24",
    number:   "rgba(251,191,36,0.13)",
    cardBg:   "rgba(14,9,0,0.78)",
    tagBg:    "rgba(251,191,36,0.08)",
  },
  upcoming: {
    primary:  "#ff3a3a",
    glow:     "rgba(255,26,26,0.60)",
    soft:     "rgba(255,26,26,0.07)",
    text:     "#fca5a5",
    border:   "rgba(255,26,26,0.20)",
    badge:    "linear-gradient(90deg,#7f1d1d,#dc2626)",
    trackDot: "rgba(255,60,60,0.30)",
    number:   "rgba(255,26,26,0.08)",
    cardBg:   "rgba(8,0,0,0.55)",
    tagBg:    "rgba(255,26,26,0.06)",
  },
} as const;

/* ── Format helpers ── */
const fmtTime = (d: Date) =>
  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

/* ════════════════════════════════════════════
   Card
════════════════════════════════════════════ */
function TimelineCard({
  item, index, now,
}: {
  item: TimelineItem;
  index: number;
  now: Date;
}) {
  const [hov, setHov] = useState(false);

  const done    = isCompleted(item.endTime, now);
  const live    = isLive(item.startTime, item.endTime, now);
  const theme   = done ? THEME.done : live ? THEME.live : THEME.upcoming;
  const lit     = done || live || hov;
  const start   = new Date(item.startTime);
  const end     = new Date(item.endTime);

  return (
    <motion.div
      variants={{
        hidden:   { opacity: 0, x: index % 2 === 0 ? -24 : 24 },
        visible:  { opacity: 1, x: 0, transition: { type: "spring", stiffness: 220, damping: 28 } },
      }}
      style={{ position: "relative" }}
    >
      {/* ── Track node ── */}
      <div style={{
        position: "absolute",
        left: -38, top: 22,
        width: 20, height: 20,
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 4,
        background: done
          ? "linear-gradient(135deg,#065f46,#34d399)"
          : live
          ? "linear-gradient(135deg,#78350f,#f59e0b)"
          : "rgba(6,0,0,0.90)",
        border: `2px solid ${theme.trackDot}`,
        boxShadow: live
          ? `0 0 0 5px rgba(251,191,36,0.12), 0 0 18px ${theme.glow}`
          : done
          ? `0 0 10px ${theme.glow}`
          : "none",
        animation: live ? "nodeGoldPulse 1.8s ease-in-out infinite" : "none",
        transition: "border-color 0.3s, box-shadow 0.3s",
      }}>
        {done ? (
          <Check size={10} color="#fff" strokeWidth={3} />
        ) : live ? (
          <>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", boxShadow: `0 0 6px ${theme.glow}` }} />
            <div style={{
              position: "absolute", inset: -4, borderRadius: "50%",
              border: `2px solid rgba(251,191,36,0.55)`,
              animation: "nodePing 1.4s ease-out infinite",
            }} />
          </>
        ) : (
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,55,55,0.22)" }} />
        )}
      </div>

      {/* ── Card ── */}
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          position: "relative",
          borderRadius: 12,
          background: theme.cardBg,
          border: `1px solid ${lit ? theme.border : "rgba(255,26,26,0.07)"}`,
          boxShadow: hov
            ? `0 0 0 1px ${theme.soft}, 0 0 28px ${theme.soft}, inset 0 1px 0 rgba(255,255,255,0.03)`
            : live
            ? `0 0 18px rgba(251,191,36,0.07)`
            : `0 0 0 1px rgba(255,26,26,0.03)`,
          opacity: (!done && !live) ? 0.75 : 1,
          transform: hov ? "translateY(-2px)" : "translateY(0)",
          transition: "transform 0.20s ease, border-color 0.20s, box-shadow 0.20s, opacity 0.28s",
          overflow: "hidden",
          padding: "16px 18px 14px 20px",
          willChange: "transform",
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: lit
            ? `linear-gradient(90deg, transparent, ${theme.glow}, transparent)`
            : "none",
          boxShadow: lit ? `0 0 10px ${theme.glow}` : "none",
          transition: "box-shadow 0.20s",
        }} />

        {/* Left glow bar */}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0, width: 2,
          background: `linear-gradient(180deg, transparent, ${theme.glow}, transparent)`,
          opacity: lit ? 1 : 0,
          transition: "opacity 0.20s",
        }} />

        {/* Big ghost index number */}
        <div style={{
          position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
          fontFamily: "'Orbitron', monospace",
          fontSize: "clamp(2.8rem, 5vw, 4rem)",
          fontWeight: 900, lineHeight: 1,
          color: theme.number,
          userSelect: "none", pointerEvents: "none",
          transition: "color 0.20s",
        }}>
          {String(index + 1).padStart(2, "0")}
        </div>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 10 }}>
          <h3 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(0.72rem, 1.5vw, 0.88rem)",
            fontWeight: 700, letterSpacing: "0.07em",
            color: "#fff", margin: 0, textTransform: "uppercase",
            textShadow: lit ? `0 0 14px ${theme.glow}` : "none",
            transition: "text-shadow 0.20s",
            lineHeight: 1.25, maxWidth: "75%",
          }}>
            {item.title}
          </h3>

          {/* Status badge */}
          <div style={{
            flexShrink: 0,
            background: theme.badge,
            color: "#fff",
            fontFamily: "'Orbitron', monospace",
            fontSize: 7, fontWeight: 700, letterSpacing: "0.14em",
            padding: "3px 8px", borderRadius: 4,
            boxShadow: `0 0 8px ${theme.glow}`,
            textTransform: "uppercase",
            animation: live ? "badgeBlink 2s ease-in-out infinite" : "none",
          }}>
            {done ? "DONE" : live ? "⚡ LIVE" : "SOON"}
          </div>
        </div>

        {/* Tag */}
        {item.tag && (
          <div style={{
            display: "inline-flex", alignItems: "center",
            background: theme.tagBg,
            border: `1px solid ${theme.border}`,
            borderRadius: 4, padding: "2px 8px", marginBottom: 10,
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
            color: theme.text, textTransform: "uppercase",
          }}>
            {item.tag}
          </div>
        )}

        {/* Description */}
        {item.description && (
          <p style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 12, fontWeight: 500, lineHeight: 1.6,
            color: "rgba(255,210,210,0.38)",
            margin: "0 0 10px", letterSpacing: "0.02em",
          }}>
            {item.description}
          </p>
        )}

        {/* Meta row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 14px" }}>
          <MetaChip
            icon={<Clock size={9} />}
            text={`${fmtDate(start)} · ${fmtTime(start)} – ${fmtTime(end)}`}
            color={theme.text} glow={theme.glow} lit={lit}
          />
          <MetaChip
            icon={<MapPin size={9} />}
            text={item.venue}
            color={theme.text} glow={theme.glow} lit={lit}
          />
        </div>

        {/* Hover bottom line */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
          background: `linear-gradient(90deg, ${theme.glow}, transparent)`,
          transformOrigin: "left",
          transform: hov ? "scaleX(1)" : "scaleX(0)",
          transition: "transform 0.26s ease",
        }} />
      </div>
    </motion.div>
  );
}

function MetaChip({ icon, text, color, glow, lit }: {
  icon: React.ReactNode; text: string; color: string; glow: string; lit: boolean;
}) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      fontFamily: "'Rajdhani', sans-serif",
      fontSize: 10, fontWeight: 600, letterSpacing: "0.03em",
      color: lit ? color : "rgba(255,100,100,0.22)",
      transition: "color 0.20s",
    }}>
      <span style={{ color: lit ? glow : "rgba(255,60,60,0.20)" }}>{icon}</span>
      {text}
    </div>
  );
}

/* ════════════════════════════════════════════
   Main export
════════════════════════════════════════════ */
export default function GlowingTimeline({ items }: TimelineProps) {
  const [now, setNow]         = useState(new Date());
  const containerRef          = useRef<HTMLDivElement>(null);
  const trackRef              = useRef<HTMLDivElement>(null);
  const [progressH, setProgressH] = useState(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  /* Clock tick */
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  /* Progress bar height */
  useEffect(() => {
    const done = items.filter(it => now >= new Date(it.endTime)).length;
    const frac = items.length > 0 ? done / items.length : 0;
    if (trackRef.current) setProgressH(trackRef.current.offsetHeight * frac);
  }, [now, items]);

  /* Day groups */
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

        @keyframes nodePing      { 0%{transform:scale(1);opacity:.8} 100%{transform:scale(2.2);opacity:0} }
        @keyframes nodeGoldPulse { 0%,100%{box-shadow:0 0 0 4px rgba(251,191,36,0.10),0 0 12px rgba(251,191,36,0.55)} 50%{box-shadow:0 0 0 8px rgba(251,191,36,0.06),0 0 28px rgba(251,191,36,0.85)} }
        @keyframes badgeBlink    { 0%,100%{opacity:1} 50%{opacity:.55} }
        @keyframes dotBlink      { 0%,100%{opacity:1} 50%{opacity:.15} }
        @keyframes scanline      { 0%{transform:translateY(-100%)} 100%{transform:translateY(200%)} }
        @keyframes glitch        { 0%,95%,100%{transform:none;opacity:1} 96%{transform:translateX(3px);opacity:.7} 97%{transform:translateX(-2px)} 98%{transform:none} }

        .tl-card-col { display:flex; flex-direction:column; gap:10px; }

        @media (max-width:680px) {
          .tl-two-col { grid-template-columns:1fr !important; }
          .tl-items   { padding-left:34px !important; }
          .tl-track   { left:10px !important; }
        }
      `}</style>

      <section
        ref={containerRef}
        style={{ position: "relative", padding: "60px 0 80px", overflow: "hidden", background: "transparent" }}
      >
        {/* Parallax bg shard — no paint, transform-only */}
        <motion.div style={{
          y: bgY,
          position: "absolute", top: "15%", right: "-8%",
          width: "38vw", height: "38vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(180,0,0,0.10) 0%, transparent 70%)",
          pointerEvents: "none", willChange: "transform",
        }} />

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 20px" }}>

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              backgroundColor: "rgba(255,26,26,0.09)",
              border: "1px solid rgba(255,26,26,0.30)",
              borderRadius: 6, padding: "5px 16px", marginBottom: 16,
              fontFamily: "'Rajdhani',sans-serif", fontSize: 11, fontWeight: 700,
              letterSpacing: "0.2em", color: "#ffb3b3", textTransform: "uppercase",
            }}>
              <Radio size={10} /> Live Schedule Tracker
            </div>

            <h2 style={{
              fontFamily: "'Orbitron',monospace",
              fontSize: "clamp(1.9rem,5vw,3.2rem)", fontWeight: 900, letterSpacing: "0.1em",
              backgroundImage: "linear-gradient(135deg,#fff 0%,#fff 20%,#ff1a1a 55%,#990000 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              textShadow: "none",
              margin: 0, lineHeight: 1.1,
              animation: "glitch 8s ease-in-out infinite",
            }}>
              EVENT SCHEDULE
            </h2>

            <div style={{
              width: 160, height: 2, margin: "14px auto 0",
              background: "linear-gradient(90deg,transparent,#ff1a1a,#cc0000,transparent)",
              boxShadow: "0 0 12px rgba(255,26,26,0.60)", borderRadius: 2,
            }} />

            {/* Live clock */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8, marginTop: 14,
              backgroundColor: "rgba(0,0,0,0.50)",
              border: "1px solid rgba(255,26,26,0.14)",
              borderRadius: 8, padding: "6px 18px",
              fontFamily: "'Orbitron',monospace", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.12em", color: "rgba(255,200,200,0.42)",
            }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%", backgroundColor: "#ff4040",
                boxShadow: "0 0 6px rgba(255,26,26,0.75)", display: "inline-block",
                animation: "dotBlink 1.4s ease-in-out infinite",
              }} />
              {now.toLocaleString("en-IN", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
            </div>
          </motion.div>

          {/* ── Legend ── */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 44 }}>
            {([
              { dot: "#34d399", glow: "rgba(52,211,153,0.55)",  label: "Completed", bg: "rgba(52,211,153,0.06)",  border: "rgba(52,211,153,0.18)" },
              { dot: "#fbbf24", glow: "rgba(251,191,36,0.65)",  label: "Live Now",  bg: "rgba(251,191,36,0.08)",  border: "rgba(251,191,36,0.28)" },
              { dot: "#ff4040", glow: "rgba(255,26,26,0.45)",   label: "Upcoming",  bg: "rgba(255,26,26,0.05)",   border: "rgba(255,26,26,0.16)"  },
            ] as const).map(s => (
              <div key={s.label} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                backgroundColor: s.bg, border: `1px solid ${s.border}`,
                borderRadius: 20, padding: "4px 14px",
                fontFamily: "'Rajdhani',sans-serif", fontSize: 10, fontWeight: 700,
                letterSpacing: "0.14em", color: "rgba(255,255,255,0.50)", textTransform: "uppercase",
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", backgroundColor: s.dot, boxShadow: `0 0 5px ${s.glow}`, display: "inline-block" }} />
                {s.label}
              </div>
            ))}
          </div>

          {/* ── Day groups ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 52 }}>
            {Object.entries(grouped).map(([day, dayItems], groupIdx) => (
              <div key={day}>

                {/* Day header */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ type: "spring", stiffness: 240, damping: 28, delay: groupIdx * 0.06 }}
                  style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}
                >
                  <div style={{
                    fontFamily: "'Orbitron',monospace",
                    fontSize: "clamp(0.65rem,1.6vw,0.80rem)", fontWeight: 700, letterSpacing: "0.14em",
                    color: "rgba(255,140,140,0.45)", textTransform: "uppercase", whiteSpace: "nowrap",
                  }}>
                    {day}
                  </div>
                  <div style={{
                    flex: 1, height: 1,
                    background: "linear-gradient(90deg, rgba(255,26,26,0.22), transparent)",
                  }} />
                  <ChevronRight size={12} color="rgba(255,60,60,0.28)" />
                </motion.div>

                {/* Items + track */}
                <div className="tl-items" style={{ position: "relative", paddingLeft: 46 }}>

                  {/* Track */}
                  <div
                    className="tl-track"
                    ref={groupIdx === 0 ? trackRef : undefined}
                    style={{
                      position: "absolute", left: 16, top: 0, bottom: 0, width: 2,
                      background: "rgba(255,26,26,0.06)", pointerEvents: "none",
                    }}
                  >
                    {/* Scanline effect */}
                    <div style={{
                      position: "absolute", left: 0, width: "100%", height: 40,
                      background: "linear-gradient(180deg, transparent, rgba(255,26,26,0.18), transparent)",
                      animation: "scanline 4s linear infinite",
                    }} />
                    {groupIdx === 0 && (
                      <motion.div
                        animate={{ height: progressH }}
                        transition={{ duration: 1.4, ease: "easeInOut" }}
                        style={{
                          position: "absolute", left: 0, top: 0, width: 2,
                          background: "linear-gradient(180deg,#34d399,#10b981,#fbbf24)",
                          boxShadow: "0 0 8px rgba(52,211,153,0.35)",
                        }}
                      />
                    )}
                  </div>

                  {/* Two-column grid */}
                  <motion.div
                    className="tl-two-col"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-30px" }}
                    variants={{
                      hidden: {},
                      visible: { transition: { staggerChildren: 0.06 } },
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 10,
                    }}
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

/* ── Demo export ── */
function TimelineDemo() {
  const items: TimelineItem[] = [
    {
      id: "1", title: "Inauguration Ceremony",
      startTime: new Date(2026, 3, 2, 10, 0).toISOString(),
      endTime:   new Date(2026, 3, 2, 11, 0).toISOString(),
      venue: "Dr. Triguna Sen Auditorium",
      tag: "Opening", description: "Official inauguration of Metallix 2026.",
    },
    {
      id: "2", title: "Conveynor Speech",
      startTime: new Date(2026, 3, 2, 11, 0).toISOString(),
      endTime:   new Date(2026, 3, 2, 12, 0).toISOString(),
      venue: "Dr. Triguna Sen Auditorium",
      tag: "Seminar",
    },
    {
      id: "3", title: "Faculty Advisory Speech",
      startTime: new Date(2026, 3, 2, 12, 0).toISOString(),
      endTime:   new Date(2026, 3, 2, 12, 30).toISOString(),
      venue: "Dr. Triguna Sen Auditorium",
      tag: "Seminar",
    },
    {
      id: "4", title: "VC, Pro VC, Dean",
      startTime: new Date(2026, 3, 2, 12, 30).toISOString(),
      endTime:   new Date(2026, 3, 2, 13, 30).toISOString(),
      venue: "Dr. Triguna Sen Auditorium",
      tag: "Seminar",
    },
    {
      id: "5", title: "Technical Session 1",
      startTime: new Date(2026,3,2, 13, 30).toISOString(),
      endTime:   new Date(2026,3, 2, 14, 30).toISOString(),
      venue: "Dr. Triguna Sen Auditorium",
      tag: "Seminar",
    },
    {
      id: "6", title: "Lunch",
      startTime: new Date(2026, 3, 2, 14, 30).toISOString(),
      endTime:   new Date(2026, 3, 2, 15, 30).toISOString(),
      venue: "JU Guest House",
      tag: "Break",
    },
    {
      id: "7", title: "Technical Session 2",
      startTime: new Date(2026, 3, 2, 15, 30).toISOString(),
      endTime:   new Date(2026, 3, 2, 18, 0).toISOString(),
      venue: "Dr. Triguna Sen Auditorium",
      tag: "Seminar",
    },
    {
      id: "8", title: "CODEMET",
      startTime: new Date(2026, 3, 2, 18,30).toISOString(),
      endTime:   new Date(2026, 3, 2,20, 0).toISOString(),
      venue: "MetE Dept.",
      tag: "Event",
    },
    {
      id: "9", title: "HACKMET",
      startTime: new Date(2026, 3, 2, 20, 0).toISOString(),
      endTime:   new Date(2026, 3, 2, 22, 0).toISOString(),
      venue: "MetE Dept.",
      tag: "Event",
    },
    {
      id: "10", title: "Golazo",
      startTime: new Date(2026, 3, 3, 10, 0).toISOString(),
      endTime:   new Date(2026, 3, 3, 11, 0).toISOString(),
      venue: "MetE Dept.",
      tag: "Event",
    },
     {
      id: "11", title: "Wall Street",
      startTime: new Date(2026, 3, 3, 11, 0).toISOString(),
      endTime:   new Date(2026, 3, 3, 12, 0).toISOString(),
      venue: "K.P Basu Memorial Hall",
      tag: "Event",
    },
     {
      id: "12", title: "Specio",
      startTime: new Date(2026, 3, 3, 12, 0).toISOString(),
      endTime:   new Date(2026, 3, 3, 12, 30).toISOString(),
      venue: "K.P Basu Memorial Hall",
      tag: "Event",
    },
    {
      id: "13", title: "Scribe",
      startTime: new Date(2026, 3, 3, 12, 30).toISOString(),
      endTime:   new Date(2026, 3, 3, 13, 0).toISOString(),
      venue: "K.P Basu Memorial Hall",
      tag: "Event",
    },
    {
      id: "14", title: "Scroll",
      startTime: new Date(2026, 3, 3, 13, 0).toISOString(),
      endTime:   new Date(2026, 3, 3, 13, 30).toISOString(),
      venue: "K.P Basu Memorial Hall",
      tag: "Event",
    },
    {
      id: "15", title: "Talaash",
      startTime: new Date(2026, 3, 3, 13, 30).toISOString(),
      endTime:   new Date(2026, 3, 3, 14, 30).toISOString(),
      venue: "K.P Basu Memorial Hall",
      tag: "Event",
    },
    {
      id: "16", title: "Lunch",
      startTime: new Date(2026, 3, 3, 14, 30).toISOString(),
      endTime:   new Date(2026, 3, 3, 15, 30).toISOString(),
      venue: "JU Guest House",
      tag: "Break",
    },
    {
      id: "17", title: "Gnosis",
      startTime: new Date(2026, 3, 3, 15, 30).toISOString(),
      endTime:   new Date(2026, 3, 3, 17, 0).toISOString(),
      venue: "K.P Basu Memorial Hall",
      tag: "Event",
    },
    {
      id: "18", title: "Closing Ceremony",
      startTime: new Date(2026, 3, 3, 17, 0).toISOString(),
      endTime:   new Date(2026, 3, 3, 18, 0).toISOString(),
      venue: "K.P Basu Memorial Hall",
      tag: "Event",
    },
  ];
  return <GlowingTimeline items={items} />;
}

export { TimelineDemo };