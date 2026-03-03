"use client";
import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Instagram, Facebook, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Font injection ── */
let fontsInjected = false;
function injectFonts() {
  if (fontsInjected || typeof document === "undefined") return;
  fontsInjected = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

/* ── Ember particle for the METALLIX text ── */
type Ember = {
  id: number;
  x: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  color: string;
};

function generateEmbers(count: number): Ember[] {
  const colors = [
    "rgba(220,30,10,0.9)",
    "rgba(255,80,20,0.8)",
    "rgba(180,20,180,0.7)",
    "rgba(255,140,0,0.85)",
    "rgba(255,60,10,0.75)",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 5 + Math.random() * 90,
    startY: 60 + Math.random() * 30,
    size: 1.5 + Math.random() * 3,
    duration: 2.5 + Math.random() * 3,
    delay: Math.random() * 4,
    drift: (Math.random() - 0.5) * 40,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
}

function useEmbers(count = 18) {
  const [embers, setEmbers] = useState<Ember[]>([]);
  useEffect(() => {
    setEmbers(generateEmbers(count));
  }, [count]);
  return embers;
}

/* ── TextHoverEffect ── */
export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });
  const embers = useEmbers(22);

  useEffect(() => {
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({ cx: `${cxPercentage}%`, cy: `${cyPercentage}%` });
    }
  }, [cursor]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* ── Ambient glow orbs beneath the text ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 51,
      }}>
        {/* Red glow left */}
        <div style={{
          position: "absolute",
          left: "15%", bottom: "20%",
          width: 320, height: 120,
          background: "radial-gradient(ellipse, rgba(220,30,10,0.22) 0%, transparent 70%)",
          filter: "blur(18px)",
          animation: "ftGlowPulse 3.5s ease-in-out infinite",
        }} />
        {/* Purple glow right */}
        <div style={{
          position: "absolute",
          right: "12%", bottom: "25%",
          width: 260, height: 100,
          background: "radial-gradient(ellipse, rgba(140,20,200,0.18) 0%, transparent 70%)",
          filter: "blur(22px)",
          animation: "ftGlowPulse 4.2s ease-in-out infinite 0.8s",
        }} />
        {/* Center white hot core */}
        <div style={{
          position: "absolute",
          left: "50%", bottom: "28%",
          transform: "translateX(-50%)",
          width: 400, height: 60,
          background: "radial-gradient(ellipse, rgba(255,100,40,0.10) 0%, transparent 70%)",
          filter: "blur(12px)",
          animation: "ftGlowPulse 2.8s ease-in-out infinite 0.3s",
        }} />
      </div>

      {/* ── Floating ember particles — only rendered client-side after mount ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 52,
      }}>
        {embers.map((e) => (
          <div
            key={e.id}
            style={{
              position: "absolute",
              left: `${e.x}%`,
              bottom: `${e.startY - 55}%`,
              width: e.size,
              height: e.size,
              borderRadius: "50%",
              background: e.color,
              boxShadow: `0 0 ${e.size * 3}px ${e.color}`,
              animation: `ftEmberRise ${e.duration}s ease-out ${e.delay}s infinite`,
              ["--drift" as string]: `${e.drift}px`,
            }}
          />
        ))}
      </div>

      {/* ── Horizontal scan line sweep ── */}
      <div style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        zIndex: 53,
      }}>
        <div style={{
          position: "absolute",
          left: 0, right: 0,
          height: 2,
          background: "linear-gradient(90deg, transparent 0%, rgba(220,30,10,0.0) 20%, rgba(220,30,10,0.55) 50%, rgba(220,30,10,0.0) 80%, transparent 100%)",
          filter: "blur(1px)",
          animation: "ftScanLine 4s linear infinite",
          bottom: "38%",
        }} />
      </div>

      {/* ── Keyframes injected via <style> ── */}
      <style>{`
        @keyframes ftGlowPulse {
          0%, 100% { opacity: 0.6; transform: scaleX(1) scaleY(1); }
          50%       { opacity: 1.0; transform: scaleX(1.12) scaleY(1.2); }
        }
        @keyframes ftEmberRise {
          0%   { opacity: 0;   transform: translateY(0px)   translateX(0px) scale(1); }
          15%  { opacity: 1; }
          80%  { opacity: 0.6; }
          100% { opacity: 0;   transform: translateY(-120px) translateX(var(--drift)) scale(0.3); }
        }
        @keyframes ftScanLine {
          0%   { bottom: 10%; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 0.7; }
          100% { bottom: 90%; opacity: 0; }
        }
        @keyframes ftFlicker {
          0%, 100% { opacity: 1; }
          92%       { opacity: 1; }
          93%       { opacity: 0.4; }
          94%       { opacity: 1; }
          97%       { opacity: 0.7; }
          98%       { opacity: 1; }
        }
      `}</style>

      {/* ── The actual SVG text ── */}
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 300 100"
        xmlns="http://www.w3.org/2000/svg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
        className={cn("select-none uppercase cursor-pointer", className)}
        style={{
          position: "relative",
          zIndex: 54,
          animation: "ftFlicker 6s ease-in-out infinite",
        }}
      >
        <defs>
          <linearGradient id="ftTextGrad" gradientUnits="userSpaceOnUse">
            {hovered && (
              <>
                <stop offset="0%" stopColor="#ff2010" />
                <stop offset="35%" stopColor="#cc1000" />
                <stop offset="65%" stopColor="#9010cc" />
                <stop offset="100%" stopColor="#6000aa" />
              </>
            )}
          </linearGradient>
          <motion.radialGradient
            id="ftRevealMask"
            gradientUnits="userSpaceOnUse"
            r="22%"
            initial={{ cx: "50%", cy: "50%" }}
            animate={maskPosition}
            transition={{ duration: duration ?? 0, ease: "easeOut" }}
          >
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </motion.radialGradient>
          <mask id="ftTextMask">
            <rect x="0" y="0" width="100%" height="100%" fill="url(#ftRevealMask)" />
          </mask>
          {/* Glow filter for the stroke text */}
          <filter id="ftGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Shadow / depth layer */}
        <text
          x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          strokeWidth="0.3"
          style={{
            fill: "transparent",
            stroke: "rgba(255,40,10,0.18)",
            fontFamily: "'Orbitron', monospace",
            fontSize: "4rem", fontWeight: 900,
            opacity: hovered ? 0.7 : 0,
            transition: "opacity 0.3s",
          }}
        >{text}</text>

        {/* Animated draw-on stroke */}
        <motion.text
          x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          strokeWidth="0.3"
          filter="url(#ftGlow)"
          style={{
            fill: "transparent",
            stroke: "rgba(220,30,10,0.55)",
            fontFamily: "'Orbitron', monospace",
            fontSize: "4rem", fontWeight: 900,
          }}
          initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
          animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
          transition={{ duration: 4, ease: "easeInOut" }}
        >{text}</motion.text>

        {/* Hover-reveal coloured fill */}
        <text
          x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          stroke="url(#ftTextGrad)" strokeWidth="0.3"
          mask="url(#ftTextMask)"
          style={{
            fill: "transparent",
            fontFamily: "'Orbitron', monospace",
            fontSize: "4rem", fontWeight: 900,
          }}
        >{text}</text>
      </svg>
    </div>
  );
};

/* ── Background gradient ── */
export const FooterBg = () => (
  <div
    className="absolute inset-0"
    style={{
      zIndex: 51,
      background:
        "radial-gradient(120% 120% at 50% 0%, rgba(15,0,0,0.85) 40%, rgba(80,10,140,0.25) 100%)",
    }}
  />
);

/* ── Section heading ── */
function SectionHead({ num, title }: { num: string; title: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8 }}>
        <span style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 10, fontWeight: 700,
          color: "rgba(220,30,10,0.75)",
          letterSpacing: "0.1em",
        }}>{num}/</span>
        <span style={{
          fontFamily: "'Orbitron', monospace",
          fontSize: 11, fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#fff",
        }}>{title}</span>
      </div>
      <div style={{
        height: 1,
        background: "linear-gradient(90deg, rgba(220,30,10,0.6), rgba(140,20,200,0.3), transparent)",
      }} />
    </div>
  );
}

function SocialBtn({
  icon, label, href,
}: { icon: React.ReactNode; label: string; href: string }) {
  const [hov, setHov] = useState(false);

  return (
    <motion.a
      href={href}
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onPointerEnter={() => setHov(true)}
      onPointerLeave={() => setHov(false)}
      whileHover={{ scale: 1.14, y: -3 }}
      whileTap={{ scale: 0.91 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 36,
        height: 36,
        borderRadius: "50%",
        border: `1px solid ${hov ? "rgba(220,30,10,0.90)" : "rgba(220,30,10,0.30)"}`,
        background: hov ? "rgba(220,30,10,0.18)" : "rgba(220,30,10,0.06)",
        color: hov ? "#ffffff" : "rgba(255,255,255,0.50)",
        boxShadow: hov
          ? "0 0 18px rgba(220,30,10,0.50), 0 0 36px rgba(220,30,10,0.18)"
          : "none",
        cursor: "pointer",
        textDecoration: "none",
        transition: "border 0.20s ease, background 0.20s ease, color 0.20s ease, box-shadow 0.20s ease",
        position: "relative",
        zIndex: 55,
      }}
    >
      {icon}
    </motion.a>
  );
}

/* ── EventLink ── */
function EventLink({ label, href }: { label: string; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.a
      href={href}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      onPointerEnter={() => setHov(true)}
      onPointerLeave={() => setHov(false)}
      whileHover={{ x: 5 }}
      transition={{ type: "spring", stiffness: 420, damping: 26 }}
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: "0.06em",
        color: hov ? "#ff5030" : "rgba(255,255,255,0.50)",
        cursor: "pointer",
        textDecoration: "none",
        padding: "4px 0",
        display: "block",
        transition: "color 0.20s ease",
      }}
    >
      {label}
    </motion.a>
  );
}

/* ── ContactLink ── */
function ContactLink({ children, href }: { children: React.ReactNode; href: string }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontSize: 14,
        fontWeight: 500,
        letterSpacing: "0.04em",
        color: hov ? "#ff5030" : "rgba(255,255,255,0.50)",
        transition: "color 0.20s ease",
        cursor: "pointer",
        textDecoration: "none",
        display: "block",
      }}
    >
      {children}
    </a>
  );
}

/* ── Main Footer ── */
function MetallixFooter() {
  useEffect(() => { injectFonts(); }, []);

  const eventLinks = [
    { label: "Codemet",     href: "/events/codemet" },
    { label: "Hackmet",     href: "/events/hackmet" },
    { label: "Scribe",      href: "/events/scribe" },
    { label: "Specio",      href: "/events/specio" },
    { label: "Scroll",      href: "/events/scroll" },
    { label: "Talaash",     href: "/events/talaash" },
    { label: "Gnosis",      href: "/events/gnosis" },
    { label: "Wall Street", href: "/events/wallst" },
  ];

  const eventsCol1 = eventLinks.slice(0, 4);
  const eventsCol2 = eventLinks.slice(4);

  const socialLinks = [
    { icon: <Instagram size={16} />, label: "Instagram", href: "https://www.instagram.com/metallix2026/" },
    { icon: <Facebook  size={16} />, label: "Facebook",  href: "https://www.facebook.com/metallixju"  },
    { icon: <Linkedin  size={16} />, label: "LinkedIn",  href: "https://www.linkedin.com/company/metallix2024"  },
  ];

  const contactItems = [
    {
      icon: <Mail size={16} />,
      label: "Email",
      lines: ["metallixju2026@gmail.com"],
      href: "mailto:metallixju2026@gmail.com",
    },
    {
      icon: <MapPin size={16} />,
      label: "Address",
      lines: [
        "Dept. of Metallurgical & Material Engineering,",
        "Jadavpur University",
      ],
      href: null,
    },
    {
      icon: <Phone size={16} />,
      label: "Phone",
      lines: ["+91 XXXXX XXXXX", "+91 XXXXX XXXXX"],
      href: null,
    },
  ];

  return (
    <div style={{ zIndex: 55, position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap');
        @media (max-width: 768px) {
          .ft-main-grid          { grid-template-columns: 1fr !important; gap: 40px 0 !important; }
          .ft-outer-pad          { padding: 40px 22px 0 !important; }
          .ft-brand-desc         { max-width: 100% !important; }
          .ft-bottom-bar         { justify-content: center !important; text-align: center !important; }
          .ft-section-divider-section { margin-top: 8px !important; }
        }
      `}</style>

      <footer style={{
        position: "relative",
        overflow: "hidden",
        margin: "0",
        background: "#030000",
        borderTop: "1px solid rgba(220,30,10,0.25)",
      }}>
        {/* Top neon line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 2,
          background: "linear-gradient(90deg, transparent, rgba(220,30,10,0.8) 30%, #fff 50%, rgba(140,20,200,0.6) 70%, transparent)",
          boxShadow: "0 0 18px rgba(220,30,10,0.5)",
          zIndex: 60,
        }} />

        {/* Scanline */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 51,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)",
        }} />

        <FooterBg />

        <div
          className="ft-outer-pad"
          style={{
            position: "relative", zIndex: 56,
            maxWidth: 1200, margin: "0 auto",
            padding: "56px 48px 0",
          }}
        >
          {/* ── Main grid ── */}
          <div
            className="ft-main-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.3fr 0.9fr",
              gap: "0 52px",
              paddingBottom: 48,
              alignItems: "start",
              position: "relative",
              zIndex: 57,
            }}
          >
            {/* COL 1: Brand */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <h2 style={{
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 26, fontWeight: 900,
                  letterSpacing: "0.1em",
                  color: "#fff", margin: 0,
                  textShadow: "0 0 28px rgba(220,30,10,0.8)",
                  textTransform: "uppercase",
                  lineHeight: 1.1,
                }}>
                  METALLIX
                  <span style={{ color: "rgba(220,30,10,0.9)" }}>`26</span>
                </h2>
                <div style={{
                  marginTop: 10, height: 2, width: 72,
                  background: "linear-gradient(90deg, rgba(220,30,10,0.9), rgba(140,20,200,0.5))",
                  boxShadow: "0 0 8px rgba(220,30,10,0.5)",
                }} />
              </div>

              <p style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 10, fontWeight: 700,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(220,30,10,0.75)",
                margin: 0,
              }}>
                FORGE. FUSE. FLOURISH.
              </p>

              <p
                className="ft-brand-desc"
                style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: 13, fontWeight: 500, lineHeight: 1.65,
                  color: "rgba(255,255,255,0.42)", margin: 0, maxWidth: 240,
                }}
              >
                Annual techno-cultural fest of the Department of Metallurgical and
                Material Engineering, Jadavpur University.
              </p>

              <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                {socialLinks.map((s) => (
                  <SocialBtn key={s.label} icon={s.icon} label={s.label} href={s.href} />
                ))}
              </div>
            </div>

            {/* COL 2: Let's Connect */}
            <div className="ft-section-divider-section">
              <SectionHead num="001" title="Let's Connect" />
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {contactItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <span style={{
                      display: "flex", alignItems: "center", justifyContent: "center",
                      width: 20, flexShrink: 0, marginTop: 2,
                      color: "rgba(220,30,10,0.8)",
                    }}>{item.icon}</span>
                    <div>
                      <div style={{
                        fontFamily: "'Orbitron', monospace",
                        fontSize: 10, fontWeight: 700,
                        letterSpacing: "0.12em",
                        color: "rgba(220,30,10,0.85)",
                        marginBottom: 3,
                        textTransform: "uppercase",
                      }}>
                        {item.label}
                      </div>
                      {item.lines.map((line, j) =>
                        item.href ? (
                          <ContactLink key={j} href={item.href}>{line}</ContactLink>
                        ) : (
                          <div key={j} style={{
                            fontFamily: "'Rajdhani', sans-serif",
                            fontSize: 13, fontWeight: 500, lineHeight: 1.5,
                            color: "rgba(255,255,255,0.48)",
                          }}>
                            {line}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 3: Events */}
            <div className="ft-section-divider-section">
              <SectionHead num="002" title="Events" />
              <div style={{ display: "flex", gap: 32 }}>
                <nav style={{ display: "flex", flexDirection: "column" }}>
                  {eventsCol1.map((link) => (
                    <EventLink key={link.label} label={link.label} href={link.href} />
                  ))}
                </nav>
                <nav style={{ display: "flex", flexDirection: "column" }}>
                  {eventsCol2.map((link) => (
                    <EventLink key={link.label} label={link.label} href={link.href} />
                  ))}
                </nav>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: "linear-gradient(90deg, transparent, rgba(220,30,10,0.4) 30%, rgba(140,20,200,0.22) 70%, transparent)",
            boxShadow: "0 0 6px rgba(140,20,200,0.08)",
            position: "relative",
            zIndex: 57,
          }} />

          {/* Bottom bar */}
          <div
            className="ft-bottom-bar"
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "18px 0 20px",
              gap: 12,
              position: "relative",
              zIndex: 57,
            }}
          >
            <p style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: 12, fontWeight: 500,
              color: "rgba(255,255,255,0.28)",
              margin: 0, letterSpacing: "0.06em",
            }}>
              © {new Date().getFullYear()} CREATED BY TEAM METALLIX.
            </p>
          </div>

          {/* Large hover text — desktop only */}
          <div
            className="lg:flex hidden"
            style={{
              height: "28rem",
              marginTop: "-10rem",
              marginBottom: "-8rem",
              pointerEvents: "none",
              zIndex: 58,
              position: "relative",
            }}
          >
            <div style={{ width: "100%", height: "100%", pointerEvents: "auto" }}>
              <TextHoverEffect text="METALLIX" className="z-50" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MetallixFooter;