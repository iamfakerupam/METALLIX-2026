'use client'

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Zap, Trophy, Star, Users, Calendar } from "lucide-react"

/* ── Typewriter ── */
const TW_LINES = [
  "Where Metallurgy Meets Innovation.",
  "Two Days. Eight Events. One Stage.",
  "JU's Premier Technical Fest.",
  "Compete. Create. Conquer.",
]

function Typewriter() {
  const [mounted, setMounted] = useState(false)
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [pause, setPause] = useState(false)

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(id)
  }, [])

  useEffect(() => {
    if (!mounted) return
    if (pause) {
      const t = setTimeout(() => setPause(false), 1800)
      return () => clearTimeout(t)
    }
    const speed = deleting ? 28 : 48
    const t = setTimeout(() => {
      const line = TW_LINES[lineIdx]
      if (!deleting) {
        if (charIdx < line.length) setCharIdx(c => c + 1)
        else { setPause(true); setDeleting(true) }
      } else {
        if (charIdx > 0) setCharIdx(c => c - 1)
        else { setDeleting(false); setLineIdx(i => (i + 1) % TW_LINES.length) }
      }
    }, speed)
    return () => clearTimeout(t)
  }, [charIdx, deleting, pause, lineIdx, mounted])

  if (!mounted) return <span style={{ visibility: "hidden" }}>{TW_LINES[0]}|</span>

  return (
    <span>
      {TW_LINES[lineIdx].slice(0, charIdx)}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        style={{ color: "#EE220E" }}
      >|</motion.span>
    </span>
  )
}

const STATS = [
  { icon: <Trophy size={14} />,   value: "₹1L+",  label: "Prize Pool"    },
  { icon: <Star   size={14} />,   value: "9",      label: "Events"        },
  { icon: <Users  size={14} />,   value: "FREE",   label: "Registration"  },
  { icon: <Calendar size={14} />, value: "2 Days", label: "2nd-3rd April" },
]

const ImageTrailDemo = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] })
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');

        @keyframes spinRing  { to { transform: rotate(360deg);  } }
        @keyframes spinRing2 { to { transform: rotate(-360deg); } }

        .about-stat-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 14px;
          border-radius: 8px;
          background: rgba(255, 26, 26, 0.07);
          border: 1px solid rgba(255, 26, 26, 0.18);
          transition: background 0.2s ease, border-color 0.2s ease;
          cursor: default;
        }
        .about-stat-pill:hover {
          background: rgba(255, 26, 26, 0.13);
          border-color: rgba(255, 26, 26, 0.38);
        }

        /* Red button — same as original */
        .about-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 11px 24px;
          border-radius: 9px;
          background: linear-gradient(135deg, #990000, #ff1a1a);
          border: 1px solid rgba(255, 60, 60, 0.45);
          color: #fff;
          font-family: 'Orbitron', monospace;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          text-decoration: none;
          box-shadow: 0 0 22px rgba(255, 26, 26, 0.30);
          transition: box-shadow 0.2s ease, transform 0.2s ease;
          cursor: pointer;
        }
        .about-cta-btn:hover {
          box-shadow: 0 0 36px rgba(255, 26, 26, 0.55);
          transform: translateY(-2px);
        }

        /* Desktop grid */
        .about-grid {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 0 56px;
          align-items: stretch;
        }
        .about-left-col {
          display: flex;
          flex-direction: row;
          align-items: stretch;
          gap: 20px;
        }
        .about-left-title {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        /* Red divider with faint violet tail */
        .about-divider-line {
          width: 1px;
          align-self: stretch;
          background: linear-gradient(180deg, transparent 0%, rgba(238,34,14,0.65) 25%, rgba(238,34,14,0.65) 65%, rgba(120,40,180,0.25) 90%, transparent 100%);
          box-shadow: 0 0 8px rgba(238,34,14,0.28);
          flex-shrink: 0;
        }

        /* Mobile */
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 32px 0 !important;
          }
          .about-left-col {
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
          }
          .about-left-title {
            writing-mode: horizontal-tb !important;
            transform: none !important;
            text-align: center !important;
            flex-direction: row !important;
            gap: 12px !important;
            align-items: baseline !important;
          }
          .about-left-title h2 p { display: inline !important; }
          .about-divider-line {
            width: 100% !important;
            height: 1px !important;
            align-self: auto !important;
            background: linear-gradient(90deg, transparent 0%, rgba(238,34,14,0.65) 30%, rgba(238,34,14,0.65) 70%, rgba(120,40,180,0.20) 90%, transparent 100%) !important;
            box-shadow: 0 0 8px rgba(238,34,14,0.22) !important;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        style={{ position: "relative", padding: "80px 24px 90px", overflow: "hidden" }}
      >
        {/* Main red bg glow */}
        <div style={{
          position: "absolute", top: "30%", left: "50%",
          transform: "translateX(-50%)",
          width: "70vw", height: "40vw",
          background: "radial-gradient(ellipse, rgba(180,0,0,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Parallax blob — red, very faint violet at edge */}
        <motion.div style={{
          y: y1,
          position: "absolute", top: "0%", right: "-10%",
          width: "40vw", height: "40vw", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(204,0,0,0.11) 0%, rgba(90,20,140,0.03) 70%, transparent 100%)",
          pointerEvents: "none",
          willChange: "transform",
        }} />

        {/* Rotating ring — red outer, violet inner (minor) */}
        <div style={{
          position: "absolute", top: 24, right: 32,
          width: 140, height: 140,
          border: "1px solid rgba(238,34,14,0.10)",
          borderRadius: "50%",
          animation: "spinRing 28s linear infinite",
          pointerEvents: "none",
          willChange: "transform",
        }}>
          <div style={{
            position: "absolute", top: "20%", left: "20%", right: "20%", bottom: "20%",
            border: "1px solid rgba(110,40,170,0.07)",
            borderRadius: "50%",
            animation: "spinRing2 18s linear infinite",
          }} />
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div className="about-grid">

            {/* LEFT */}
            <motion.div
              className="about-left-col"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="about-left-title">
                <h2 style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: "clamp(2.2rem, 5vw, 4.2rem)",
                  fontWeight: 900,
                  letterSpacing: "0.1em",
                  /* White → red dominant, violet only at very bottom as a hint */
                  backgroundImage: "linear-gradient(180deg, #ffffff 0%, #ff3333 40%, #cc0000 72%, #7c1fa0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  margin: 0, lineHeight: 1, whiteSpace: "nowrap",
                  display: "flex", flexDirection: "column",
                  justifyContent: "center", alignItems: "center",
                }}>
                  <p style={{ margin: 0 }}>ABOUT</p>
                  <p style={{ margin: 0 }}>METALLIX</p>
                </h2>

                {/* Violet used only as tiny muted year label */}
                <span style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 11, fontWeight: 700,
                  letterSpacing: "0.25em",
                  color: "rgba(150,70,210,0.38)",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                }}>2026</span>
              </div>

              <div className="about-divider-line" />
            </motion.div>

            {/* RIGHT */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ type: "spring", stiffness: 240, damping: 28, delay: 0.08 }}
              style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, paddingTop: 4 }}
            >
              <div style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: "clamp(1rem, 2.2vw, 1.25rem)",
                fontWeight: 600, letterSpacing: "0.05em",
                color: "rgba(255,200,200,0.50)",
                minHeight: 28,
              }}>
                <Typewriter />
              </div>

              <div style={{
                background: "rgba(12,0,0,0.90)",
                border: "1px solid rgba(255,26,26,0.16)",
                borderRadius: 14, padding: "24px 28px",
                boxShadow: "0 0 40px rgba(180,0,0,0.09)",
                position: "relative", overflow: "hidden",
              }}>
                {/* Red accent line, violet only at far edge */}
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0, height: 2,
                  background: "linear-gradient(90deg, transparent, rgba(238,34,14,0.85), #fff, rgba(238,34,14,0.70), rgba(110,30,160,0.25), transparent)",
                  boxShadow: "0 0 12px rgba(238,34,14,0.60)",
                }} />
                <p style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "clamp(0.92rem, 1.6vw, 1.05rem)",
                  fontWeight: 500, lineHeight: 1.85,
                  color: "rgba(255,220,220,0.52)",
                  margin: 0, letterSpacing: "0.02em",
                }}>
                  <span style={{ color: "#ff4444", fontWeight: 700 }}>Metallix</span> is the annual technical symposium of the{" "}
                  <span style={{ color: "#ff8080", fontWeight: 700 }}>Department of Metallurgical &amp; Material Engineering</span>,
                  Jadavpur University — where curious minds collide with cutting-edge ideas across{" "}
                  <span style={{ color: "#ffaaaa", fontWeight: 700 }}>9 unique events</span> with a prize pool of{" "}
                  <span style={{ color: "#fef08a", fontWeight: 700 }}>₹1 Lakh+</span>.
                  Open to all students. Zero registration fee. Unlimited potential.
                </p>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                {STATS.map((s) => (
                  <div key={s.label} className="about-stat-pill">
                    <span style={{ color: "#ff4040" }}>{s.icon}</span>
                    <span style={{
                      fontFamily: "'Orbitron', monospace",
                      fontSize: 13, fontWeight: 900, color: "#fff",
                      textShadow: "0 0 10px rgba(238,34,14,0.50)",
                    }}>{s.value}</span>
                    <span style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "rgba(255,180,180,0.40)",
                      textTransform: "uppercase",
                    }}>{s.label}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <a href="/events" className="about-cta-btn">
                  <Zap size={11} /> Explore Events
                </a>
                <span style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 12, fontWeight: 600,
                  letterSpacing: "0.08em",
                  color: "rgba(255,180,180,0.30)",
                }}>
                  Registrations close 31st March 2026
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}

export { ImageTrailDemo }