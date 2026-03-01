"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { label: "Home",     href: "home" },
  { label: "About",    href: "about" },
  { label: "Schedule",   href: "events" },
  { label: "Team",     href: "contact" },
  { label: "Sponsors", href: "sponsors" },
  { label: "FAQ",      href: "faq" },
];

const scrollToSection = (id: string) => {
  if (typeof window !== "undefined" && (window as Window & { scrollToSection?: (id: string) => void }).scrollToSection) {
    (window as Window & { scrollToSection: (id: string) => void }).scrollToSection(id);
  } else {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }
};

/* ── Roll-up text on hover ── */
function RollText({ label }: { label: string }) {
  const [hov, setHov] = useState(false);
  return (
    <span
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        height: "1.1em",
        overflow: "hidden",
        verticalAlign: "bottom",
        color: hov ? "#EE220E" : "rgba(255,255,255,0.38)",
        transition: "color 0.22s",
      }}
    >
      <motion.span
        animate={{ y: hov ? "-110%" : "0%" }}
        transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
        style={{ display: "block", whiteSpace: "nowrap" }}
      >
        {label}
      </motion.span>
      <motion.span
        animate={{ y: hov ? "-110%" : "0%" }}
        transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
        style={{ position: "absolute", top: "110%", left: 0, display: "block", whiteSpace: "nowrap" }}
      >
        {label}
      </motion.span>
    </span>
  );
}

function NavItem({ label, href, index }: {
  label: string; href: string; index: number;
}) {
  return (
    <motion.button
      onClick={() => scrollToSection(href)}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index, type: "spring", stiffness: 280, damping: 24 }}
      style={{
        position: "relative", minWidth: 82,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "7px 14px",
        fontFamily: "'Orbitron', monospace",
        fontSize: 10, fontWeight: 700, letterSpacing: "0.15em",
        textTransform: "uppercase",
        cursor: "pointer", userSelect: "none", whiteSpace: "nowrap",
        background: "none", border: "none", outline: "none",
      }}
    >
      <RollText label={label} />
    </motion.button>
  );
}

function MobileNavItem({ label, href, index, onClose }: {
  label: string; href: string; index: number; onClose: () => void;
}) {
  const [hov, setHov] = useState(false);
  return (
    <motion.button
      onClick={() => { scrollToSection(href); onClose(); }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      initial={{ x: -28, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -16, opacity: 0 }}
      transition={{ delay: 0.05 * index, type: "spring", stiffness: 300, damping: 26 }}
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 28px", width: "100%",
        fontFamily: "'Orbitron', monospace",
        fontSize: 11, fontWeight: 700, letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: hov ? "#fff" : "rgba(255,255,255,0.45)",
        background: hov ? "rgba(238,34,14,0.05)" : "transparent",
        transition: "color 0.18s, border-color 0.18s, background 0.18s",
        cursor: "pointer", outline: "none", border: "none",
        borderLeft: `2px solid ${hov ? "#EE220E" : "rgba(238,34,14,0.12)"}`,
      }}
    >
      <motion.span
        animate={{ opacity: hov ? 1 : 0, scale: hov ? 1 : 0.3 }}
        transition={{ duration: 0.15 }}
        style={{ width: 5, height: 5, borderRadius: "50%", background: "#EE220E", boxShadow: "0 0 10px #EE220E", flexShrink: 0 }}
      />
      {label}
      <span style={{ marginLeft: "auto", fontFamily: "'Orbitron', monospace", fontSize: 8, color: "rgba(238,34,14,0.25)", letterSpacing: "0.1em" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.button>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [visible, setVisible]       = useState(true);
  const [atTop, setAtTop]           = useState(true);
  const prevScrollY                 = useRef(0);

  useEffect(() => {
    const handler = (e: Event) => {
      const cur = (e as CustomEvent<{ scrollY: number }>).detail.scrollY;
      const prev = prevScrollY.current;

      setAtTop(cur < 10);

      if (cur < 60) {
        setVisible(true);
      } else if (cur > prev + 8) {
        setVisible(false);
        setMobileOpen(false);
      } else if (cur < prev - 8) {
        setVisible(true);
      }

      prevScrollY.current = cur;
    };

    window.addEventListener("navscroll", handler);
    return () => window.removeEventListener("navscroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600;700&display=swap');
      `}</style>

      {/* DESKTOP */}
      <motion.div
        animate={{ y: visible ? 0 : -90, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed", top: 18, left: 0, right: 0, zIndex: 1000,
          display: "flex", justifyContent: "center", pointerEvents: "none",
        }}
        className="navbar-desktop-wrap"
      >
        <nav style={{
          pointerEvents: "auto",
          display: "flex", alignItems: "center",
          padding: "0 8px", height: 52, borderRadius: 999,
          background: atTop ? "rgba(8,2,22,0.52)" : "rgba(8,2,22,0.84)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: atTop
            ? "0 4px 28px rgba(0,0,0,0.28)"
            : "0 8px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          transition: "background 0.4s, box-shadow 0.4s",
        }}>
          <div style={{ width: 24, flexShrink: 0 }} />
          {NAV_LINKS.map((link, i) => (
            <NavItem key={link.label} label={link.label} href={link.href} index={i} />
          ))}
          <div style={{ width: 24, flexShrink: 0 }} />
        </nav>
      </motion.div>

      {/* MOBILE BAR */}
      <motion.div
        animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        style={{
          position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
          alignItems: "center", justifyContent: "space-between",
          height: 58, padding: "0 20px",
          background: "rgba(6,0,18,0.9)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(238,34,14,0.1)",
        }}
        className="navbar-mobile-bar"
      >
        <span style={{
          fontFamily: "'Orbitron', monospace", fontSize: 13, fontWeight: 900,
          letterSpacing: "0.18em", color: "#fff",
          textShadow: "0 0 14px rgba(238,34,14,0.35)",
        }}>METALLIX</span>

        <motion.button
          onClick={() => setMobileOpen((v) => !v)}
          whileTap={{ scale: 0.9 }}
          style={{
            width: 38, height: 38, borderRadius: 8,
            background: "rgba(238,34,14,0.07)", border: "1px solid rgba(238,34,14,0.22)",
            color: mobileOpen ? "#EE220E" : "rgba(255,255,255,0.65)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", transition: "color 0.2s",
          }}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait">
            {mobileOpen
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}><X size={17} /></motion.div>
              : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}><Menu size={17} /></motion.div>
            }
          </AnimatePresence>
        </motion.button>
      </motion.div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: "fixed", inset: 0, zIndex: 998, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            />
            <motion.div key="dr" initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 330, damping: 36 }}
              style={{
                position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 999,
                width: "min(300px, 82vw)", background: "rgba(4,0,16,0.97)",
                borderLeft: "1px solid rgba(238,34,14,0.15)", backdropFilter: "blur(28px)",
                display: "flex", flexDirection: "column", overflow: "hidden",
              }}
            >
              <div style={{ position: "absolute", top: -60, right: -60, width: 200, height: 200, borderRadius: "50%",
                background: "radial-gradient(circle,rgba(238,34,14,0.13) 0%,transparent 70%)", filter: "blur(28px)", pointerEvents: "none" }} />
              <div style={{ padding: "18px 22px 16px", borderBottom: "1px solid rgba(238,34,14,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontFamily:"'Orbitron',monospace", fontSize:12, fontWeight:900, letterSpacing:"0.18em", color:"#fff" }}>METALLIX</div>
                  <div style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:9, fontWeight:600, letterSpacing:"0.22em", color:"rgba(238,34,14,0.5)", marginTop:2 }}>NAVIGATION</div>
                </div>
                <button onClick={() => setMobileOpen(false)} style={{
                  width:32, height:32, borderRadius:7, background:"rgba(238,34,14,0.07)",
                  border:"1px solid rgba(238,34,14,0.2)", color:"rgba(255,255,255,0.55)",
                  display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer",
                }}><X size={14} /></button>
              </div>
              <div style={{ flex:1, paddingTop:10, paddingBottom:20, overflowY:"auto" }}>
                {NAV_LINKS.map((link, i) => (
                  <MobileNavItem key={link.label} label={link.label} href={link.href} index={i} onClose={() => setMobileOpen(false)} />
                ))}
              </div>
              <div style={{ padding:"16px 22px", borderTop:"1px solid rgba(238,34,14,0.1)" }}>
                <p style={{ fontFamily:"'Rajdhani',sans-serif", fontSize:10, fontWeight:600, letterSpacing:"0.14em", color:"rgba(255,255,255,0.18)", textAlign:"center", textTransform:"uppercase", margin:0 }}>
                  Jadavpur University · Met & Mat Engg
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        .navbar-desktop-wrap { display: flex !important; }
        .navbar-mobile-bar   { display: none !important; }
        @media (max-width: 780px) {
          .navbar-desktop-wrap { display: none !important; }
          .navbar-mobile-bar   { display: flex !important; }
        }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(238,34,14,0.3); border-radius: 2px; }
      `}</style>
    </>
  );
}