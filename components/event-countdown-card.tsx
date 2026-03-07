"use client"

import { useEffect, useState, useCallback, memo, useRef } from "react"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"

/* ── Fonts ── */
let fontsInjected = false
function injectFonts() {
  if (fontsInjected || typeof document === "undefined") return
  fontsInjected = true
  const link = document.createElement("link")
  link.rel = "stylesheet"
  link.href =
    "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap"
  document.head.appendChild(link)
}

/* ── Styles (injected once) ── */
const CSS = `
@keyframes cardIn {
  from { opacity:0; transform:translateY(24px) scale(0.96); }
  to   { opacity:1; transform:translateY(0)    scale(1); }
}
@keyframes secBlink {
  0%,100% { opacity:1; }
  50%     { opacity:0.3; }
}
@keyframes shimmer {
  from { transform:translateX(-100%); }
  to   { transform:translateX(220%); }
}
.ecc-root {
  animation: cardIn 0.48s cubic-bezier(0.22,1,0.36,1) both;
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
}
.ecc-root:hover {
  transform: translateY(-5px) scale(1.015);
}
.ecc-img {
  will-change: transform;
  transition: transform 0.5s cubic-bezier(0.4,0,0.2,1);
}
.ecc-root:hover .ecc-img { transform: scale(1.06); }
.ecc-sec { animation: secBlink 1s ease-in-out infinite; }
.ecc-btn {
  transition: background-image 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease, transform 0.2s ease !important;
  position: relative;
  overflow: hidden;
}
.ecc-btn:hover {
  background-image: linear-gradient(135deg,#b01200,#ee220e) !important;
  box-shadow: 0 0 20px rgba(238,34,14,0.65), 0 0 40px rgba(238,34,14,0.2) !important;
  border-color: rgba(238,34,14,0.6) !important;
  transform: translateY(-2px) scale(1.03) !important;
}
.ecc-shimmer { display:none; }
.ecc-btn:hover .ecc-shimmer { display:block; }
`

let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return
  stylesInjected = true
  const s = document.createElement("style")
  s.textContent = CSS
  document.head.appendChild(s)
}

/* ── Accent palette ── */
const ACCENTS = {
  crimson: {
    glow: "rgba(255,26,26,0.9)",
    soft: "rgba(255,26,26,0.22)",
    mid: "rgba(255,26,26,0.10)",
    border: "rgba(255,40,20,0.50)",
    grad: "linear-gradient(135deg,#cc1000,#ff2010)",
    tile: "rgba(255,26,26,0.10)",
    tileBrd: "rgba(255,40,20,0.28)",
    text: "#ffb3a0",
  },
  ember: {
    glow: "rgba(220,38,10,0.9)",
    soft: "rgba(220,38,10,0.22)",
    mid: "rgba(220,38,10,0.10)",
    border: "rgba(220,38,10,0.48)",
    grad: "linear-gradient(135deg,#991b0a,#dc2606)",
    tile: "rgba(220,38,10,0.10)",
    tileBrd: "rgba(220,38,10,0.28)",
    text: "#fca590",
  },
  scarlet: {
    glow: "rgba(255,50,20,0.9)",
    soft: "rgba(255,50,20,0.22)",
    mid: "rgba(255,50,20,0.10)",
    border: "rgba(255,50,20,0.48)",
    grad: "linear-gradient(135deg,#b91000,#ff3c10)",
    tile: "rgba(255,50,20,0.10)",
    tileBrd: "rgba(255,50,20,0.28)",
    text: "#ffccb0",
  },
  blood: {
    glow: "rgba(180,10,0,0.9)",
    soft: "rgba(180,10,0,0.22)",
    mid: "rgba(180,10,0,0.10)",
    border: "rgba(180,10,0,0.48)",
    grad: "linear-gradient(135deg,#7f0a00,#b41000)",
    tile: "rgba(180,10,0,0.10)",
    tileBrd: "rgba(180,10,0,0.28)",
    text: "#ff9080",
  },
  hot: {
    glow: "rgba(255,80,20,0.9)",
    soft: "rgba(255,80,20,0.22)",
    mid: "rgba(255,80,20,0.10)",
    border: "rgba(255,80,20,0.48)",
    grad: "linear-gradient(135deg,#dc2000,#ff5010)",
    tile: "rgba(255,80,20,0.10)",
    tileBrd: "rgba(255,80,20,0.28)",
    text: "#fecab0",
  },
}

type AccentKey = keyof typeof ACCENTS
type AC = (typeof ACCENTS)[AccentKey]

export interface EventCountdownCardProps {
  title?: string
  date?: Date
  image?: string
  attendees?: number
  onJoin?: () => void
  className?: string
  accentColor?: AccentKey
}

function makeDefaultDate(): Date {
  return new Date(Date.now() + 2 * 86400000 + 5 * 3600000 + 30 * 60000)
}

const Tile = memo(function Tile({
  label,
  value,
  ac,
  isSec,
}: {
  label: string
  value: string
  ac: AC
  isSec: boolean
}) {
  return (
    <div
      className={isSec ? "ecc-sec" : undefined}
      style={{
        backgroundColor: ac.tile,
        border: `1px solid ${ac.tileBrd}`,
        borderRadius: 10,
        padding: "10px 4px 8px",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
        boxShadow: `inset 0 0 16px ${ac.mid}`,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          backgroundImage: `linear-gradient(90deg,transparent,${ac.glow},transparent)`,
        }}
      />
      <div
        style={{
          fontFamily: "'Orbitron',monospace",
          fontSize: 22,
          fontWeight: 900,
          lineHeight: 1,
          color: "#fff",
          textShadow: `0 0 14px ${ac.glow}`,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontFamily: "'Rajdhani',sans-serif",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "0.18em",
          color: ac.text,
          marginTop: 4,
          textTransform: "uppercase",
        }}
      >
        {label}
      </div>
    </div>
  )
})

const Pill = memo(function Pill({
  icon,
  text,
  ac,
}: {
  icon: string
  text: string
  ac: AC
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        backgroundColor: ac.tile,
        border: `1px solid ${ac.tileBrd}`,
        borderRadius: 6,
        padding: "3px 9px",
        fontFamily: "'Rajdhani',sans-serif",
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: "0.04em",
        color: ac.text,
      }}
    >
      <span style={{ fontSize: 11 }}>{icon}</span>
      <span>{text}</span>
    </div>
  )
})

const CTA = memo(function CTA({
  label,
  onClick,
  ac,
}: {
  label: string
  onClick?: () => void
  ac: AC
}) {
  return (
    <button
      className="ecc-btn"
      onClick={onClick}
      style={{
        width: "100%",
        height: 46,
        borderRadius: 10,
        border: `1px solid ${ac.border}`,
        backgroundImage:
          "linear-gradient(145deg,rgba(28,2,0,0.95),rgba(8,0,0,0.98))",
        color: "#fff",
        fontFamily: "'Orbitron',monospace",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        cursor: "pointer",
        boxShadow: `0 0 12px ${ac.soft}, inset 0 1px 0 rgba(255,60,20,0.06)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
      }}
    >
      <div
        className="ecc-shimmer"
        style={{
          position: "absolute",
          inset: 0,
          left: "-100%",
          width: "60%",
          backgroundImage:
            "linear-gradient(90deg,transparent,rgba(255,80,30,0.14),transparent)",
          animation: "shimmer 0.65s ease-in-out",
          pointerEvents: "none",
        }}
      />
      <Zap size={13} />
      {label}
    </button>
  )
})

/* ── Main card ── */
export function EventCountdownCard({
  title = "React & AI Workshop",
  date,
  image = "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop",
  attendees,
  onJoin,
  className,
  accentColor = "crimson",
}: EventCountdownCardProps) {
  const ac = ACCENTS[accentColor]

  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  // ✅ Stable ref — updated whenever date prop changes
  const targetMs = useRef<number>((date ?? makeDefaultDate()).getTime())

  useEffect(() => {
    injectFonts()
    injectStyles()
    // Update the target whenever the date prop changes
    targetMs.current = (date ?? makeDefaultDate()).getTime()

    const tick = () =>
      setTimeLeft(Math.max(0, Math.floor((targetMs.current - Date.now()) / 1000)))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [date]) // ✅ re-runs when date prop changes

  const toUnits = useCallback(
    (s: number) => ({
      days: Math.floor(s / 86400),
      hours: Math.floor((s % 86400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    }),
    []
  )

  // ✅ displayDate derived directly from prop, no stale state
  const displayDate = date ?? makeDefaultDate()
  const live = timeLeft !== null && timeLeft <= 0
  const soon = timeLeft !== null && timeLeft > 0 && timeLeft < 86400
  const u = timeLeft !== null && timeLeft > 0 ? toUnits(timeLeft) : null

  return (
    <div
      className={cn("ecc-root", className)}
      style={{
        width: 340,
        height: 520,
        flexShrink: 0,
        position: "relative",
        borderRadius: 20,
        backgroundColor: "#020000",
        backgroundImage:
          "linear-gradient(145deg,rgba(20,2,0,0.97) 0%,rgba(4,0,0,0.99) 100%)",
        border: `1px solid ${ac.border}`,
        boxShadow: `0 0 0 1px ${ac.mid}, 0 0 32px ${ac.soft}, inset 0 1px 0 rgba(255,60,20,0.05)`,
        backdropFilter: "blur(20px)",
        fontFamily: "'Rajdhani',sans-serif",
        overflow: "hidden",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top neon line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          zIndex: 10,
          backgroundImage: `linear-gradient(90deg,transparent,${ac.glow} 30%,#fff 50%,${ac.glow} 70%,transparent)`,
          boxShadow: `0 0 14px ${ac.glow}`,
        }}
      />

      {/* Corner glows */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 180,
          height: 180,
          borderRadius: "50%",
          backgroundImage: `radial-gradient(circle,${ac.soft} 0%,transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -50,
          left: -40,
          width: 150,
          height: 150,
          borderRadius: "50%",
          backgroundImage: `radial-gradient(circle,${ac.mid} 0%,transparent 70%)`,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* ── Image area ── */}
      <div
        style={{
          position: "relative",
          height: 200,
          flexShrink: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(20px) brightness(0.30) saturate(1.6)",
            transform: "scale(1.2)",
            zIndex: 0,
          }}
        />

        <img
          src={image}
          alt={title}
          className="ecc-img"
          loading="lazy"
          decoding="async"
          style={{
            position: "relative",
            zIndex: 1,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
            filter: "brightness(0.85) saturate(1.1)",
          }}
        />

        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            backgroundImage:
              "linear-gradient(180deg,rgba(2,0,0,0.0) 40%,rgba(2,0,0,0.92) 100%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            width: 2,
            zIndex: 3,
            backgroundImage: `linear-gradient(180deg,transparent,${ac.glow},transparent)`,
            boxShadow: `0 0 8px ${ac.glow}`,
          }}
        />

        {soon && (
          <div
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              zIndex: 4,
              backgroundImage: "linear-gradient(90deg,#800000,#ff2000)",
              color: "#fff",
              fontFamily: "'Orbitron',monospace",
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: "0.12em",
              padding: "4px 10px",
              borderRadius: 4,
              boxShadow: "0 0 14px rgba(255,30,0,0.75)",
              textTransform: "uppercase",
            }}
          >
            ⚡ STARTS SOON
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div
        style={{
          flex: 1,
          padding: "18px 22px 22px",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          zIndex: 1,
          minHeight: 0,
        }}
      >
        <h3
          style={{
            fontFamily: "'Orbitron',monospace",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: "#fff",
            textShadow: `0 0 16px ${ac.glow}`,
            margin: 0,
            lineHeight: 1.35,
            textTransform: "uppercase",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {title}
        </h3>

        <div
          style={{
            height: 1,
            marginTop: 8,
            marginBottom: 12,
            backgroundImage: `linear-gradient(90deg,${ac.glow},transparent)`,
            boxShadow: `0 0 6px ${ac.glow}`,
            flexShrink: 0,
          }}
        />

        {/* Pills */}
        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
            flexShrink: 0,
          }}
        >
          <Pill
            icon="📅"
            text={displayDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
            ac={ac}
          />
          {attendees != null && attendees > 0 && (
            <Pill icon="👥" text={`${attendees} attending`} ac={ac} />
          )}
        </div>

        {/* Countdown / Live */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            marginTop: 12,
          }}
        >
          {live ? (
            <div
              style={{
                textAlign: "center",
                padding: "14px 0",
                fontFamily: "'Orbitron',monospace",
                color: "#ff4020",
                fontSize: 15,
                fontWeight: 700,
                textShadow: "0 0 18px rgba(255,50,10,0.85)",
                letterSpacing: "0.1em",
              }}
            >
              ⚡ EVENT IS LIVE
            </div>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  marginBottom: 10,
                  fontFamily: "'Rajdhani',sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.15em",
                  color: ac.text,
                  textTransform: "uppercase",
                }}
              >
                <Zap size={12} color={ac.text} />
                Event Starts In
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4,1fr)",
                  gap: 8,
                }}
              >
                {u ? (
                  <>
                    <Tile label="DAYS" value={String(u.days).padStart(2, "0")}    ac={ac} isSec={false} />
                    <Tile label="HRS"  value={String(u.hours).padStart(2, "0")}   ac={ac} isSec={false} />
                    <Tile label="MIN"  value={String(u.minutes).padStart(2, "0")} ac={ac} isSec={false} />
                    <Tile label="SEC"  value={String(u.seconds).padStart(2, "0")} ac={ac} isSec={true}  />
                  </>
                ) : (
                  ["DAYS", "HRS", "MIN", "SEC"].map((l) => (
                    <Tile key={l} label={l} value="--" ac={ac} isSec={false} />
                  ))
                )}
              </div>
            </>
          )}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 16, flexShrink: 0 }}>
          <CTA
            label={live ? "Join Now" : "Reserve Your Spot"}
            onClick={onJoin}
            ac={ac}
          />
        </div>
      </div>
    </div>
  )
}

export default EventCountdownCard