'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
} from 'framer-motion'
import Image from 'next/image'

/* ================================================================
   ✏️  EDIT YOUR CONTACT DETAILS HERE
   ================================================================ */
const CONTACTS = [
  {
    id: '01',
    name: 'Alex Mercer',
    position: 'Lead Event Coordinator',
    gmail: 'alex.mercer@gmail.com',
    phone: '+1 (555) 012-3456',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '02',
    name: 'Jordan Kim',
    position: 'Operations Manager',
    gmail: 'jordan.kim@gmail.com',
    phone: '+1 (555) 098-7654',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '03',
    name: 'Casey Rivera',
    position: 'Creative Director',
    gmail: 'casey.rivera@gmail.com',
    phone: '+1 (555) 246-1357',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
  },
  {
    id: '04',
    name: 'Taylor Nguyen',
    position: 'Brand Strategist',
    gmail: 'taylor.nguyen@gmail.com',
    phone: '+1 (555) 369-2580',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop',
  },
]
/* ================================================================ */

/* ── Font injection ── */
let fontsInjected = false
function injectFonts() {
  if (fontsInjected || typeof document === 'undefined') return
  fontsInjected = true
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href =
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;500;600;700&display=swap'
  document.head.appendChild(link)
}

/* ── CSS injection ── */
const CSS = `
@keyframes cuGreenPulse {
  0%,100% { opacity:1; box-shadow: 0 0 8px #22c55e; }
  50%      { opacity:0.5; box-shadow: 0 0 20px #22c55e; }
}
.cu-row {
  border-top: 1px solid rgba(220,30,10,0.12);
  position: relative;
  overflow: hidden;
}
.cu-row:last-child {
  border-bottom: 1px solid rgba(220,30,10,0.12);
}
.cu-row::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    rgba(220,30,10,0.0),
    rgba(220,30,10,0.05) 35%,
    rgba(147,51,234,0.05) 65%,
    rgba(147,51,234,0.0)
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
}
.cu-row:hover::before,
.cu-row.is-active::before { opacity: 1; }

.cu-name {
  transition: color 0.3s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1);
  color: rgba(255,255,255,0.28);
}
.cu-row:hover .cu-name,
.cu-row.is-active .cu-name {
  color: #ffffff !important;
  transform: translateX(14px);
}

.cu-index {
  transition: color 0.3s ease;
  color: rgba(255,255,255,0.15);
}
.cu-row:hover .cu-index,
.cu-row.is-active .cu-index { color: rgba(220,30,10,0.85) !important; }

.cu-role {
  transition: color 0.3s ease;
  color: rgba(255,255,255,0.18);
}
.cu-row:hover .cu-role,
.cu-row.is-active .cu-role { color: rgba(192,132,252,0.9) !important; }

.cu-chip {
  transition: background 0.25s, border-color 0.25s, transform 0.2s;
  text-decoration: none;
}
.cu-chip:hover {
  background: rgba(147,51,234,0.14) !important;
  border-color: rgba(147,51,234,0.55) !important;
  transform: translateX(4px);
}
`

let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  stylesInjected = true
  const s = document.createElement('style')
  s.textContent = CSS
  document.head.appendChild(s)
}

/* ── Theme ── */
const T = {
  red:    { glow: 'rgba(220,30,10,0.9)',    soft: 'rgba(220,30,10,0.15)',  border: 'rgba(220,30,10,0.5)',   text: '#ff7a5a' },
  purple: { glow: 'rgba(147,51,234,0.85)',  soft: 'rgba(126,34,206,0.15)', border: 'rgba(147,51,234,0.45)', text: '#c084fc' },
}

/* ── Inline icons ── */
const GmailSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
)
const PhoneSVG = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const ZapSVG = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const ArrowUpRightSVG = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 17L17 7"/><path d="M7 7h10v10"/>
  </svg>
)
const PlusSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const MinusSVG = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

/* ── Contact chip ── */
function Chip({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="cu-chip"
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 13px',
        borderRadius: 8,
        border: '1px solid rgba(147,51,234,0.2)',
        background: 'rgba(255,255,255,0.02)',
        cursor: 'pointer',
      }}
    >
      <span style={{ color: T.purple.text, display: 'flex', filter: `drop-shadow(0 0 4px ${T.purple.glow})` }}>
        {icon}
      </span>
      <div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 8, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: 1 }}>{label}</div>
        <div style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '0.02em', lineHeight: 1.2 }}>{value}</div>
      </div>
    </a>
  )
}

type Contact = typeof CONTACTS[number]

/* ── Row ── */
function ContactRow({
  data, index, isActive, setActiveId, isMobile, isAnyActive,
}: {
  data: Contact; index: number; isActive: boolean
  setActiveId: (id: string | null) => void
  isMobile: boolean; isAnyActive: boolean
}) {
  const isDimmed = isAnyActive && !isActive

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: isDimmed ? 0.22 : 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      onMouseEnter={() => !isMobile && setActiveId(data.id)}
      onMouseLeave={() => !isMobile && setActiveId(null)}
      onClick={() => isMobile && setActiveId(isActive ? null : data.id)}
      className={`cu-row${isActive ? ' is-active' : ''}`}
      style={{ cursor: isMobile ? 'pointer' : 'default' }}
    >
      {/* ── Main row ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column',
        padding: isMobile ? '20px 16px' : '26px 0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Left: index + name */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: isMobile ? 14 : 26 }}>
            <span
              className="cu-index"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                flexShrink: 0,
              }}
            >
              {data.id}
            </span>
            <h2
              className="cu-name"
              style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: isMobile ? 20 : 'clamp(1.7rem, 3.2vw, 3rem)',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                margin: 0, lineHeight: 1,
              }}
            >
              {data.name}
            </h2>
          </div>

          {/* Right: role + icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            {!isMobile && (
              <span className="cu-role" style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 10, fontWeight: 700, letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}>
                {data.position}
              </span>
            )}

            {isMobile ? (
              <span style={{ color: T.purple.text }}>
                {isActive ? <MinusSVG /> : <PlusSVG />}
              </span>
            ) : (
              <motion.div
                animate={{ x: isActive ? 0 : -12, opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.28 }}
                style={{ color: T.red.text, filter: `drop-shadow(0 0 8px ${T.red.glow})` }}
              >
                <ArrowUpRightSVG />
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile: role under name */}
        {isMobile && (
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
            marginTop: 5, paddingLeft: 30,
          }}>
            {data.position}
          </div>
        )}
      </div>

      {/* ── MOBILE accordion ── */}
      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Image */}
              <div style={{
                position: 'relative', width: '100%', aspectRatio: '16/9',
                borderRadius: 10, overflow: 'hidden',
                border: `1px solid rgba(220,30,10,0.3)`,
              }}>
                {/* Blurred bg */}
                <div style={{
                  position: 'absolute', inset: 0, zIndex: 0,
                  backgroundImage: `url(${data.image})`,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  filter: 'blur(18px) brightness(0.22) saturate(1.4)',
                  transform: 'scale(1.1)',
                }} />
                <Image src={data.image} alt={data.name} fill style={{ objectFit: 'contain', zIndex: 1, filter: 'brightness(0.88) saturate(1.05)' }} />
                {/* Bottom fade */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(180deg,transparent 40%,rgba(4,0,8,0.85) 100%)' }} />
                {/* Left bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, zIndex: 3, background: `linear-gradient(180deg,transparent,${T.red.glow},transparent)`, boxShadow: `0 0 8px ${T.red.glow}` }} />
                {/* Top bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, zIndex: 3, background: `linear-gradient(90deg,${T.red.glow},${T.purple.glow},transparent)` }} />
              </div>

              {/* Chips */}
              <Chip icon={<GmailSVG />} label="Gmail" value={data.gmail} href={`mailto:${data.gmail}`} />
              <Chip icon={<PhoneSVG />} label="Phone" value={data.phone} href={`tel:${data.phone}`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ── Main export ── */
export default function ContactUsSection() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springCfg = { damping: 20, stiffness: 155, mass: 0.5 }
  const cursorX = useSpring(mouseX, springCfg)
  const cursorY = useSpring(mouseY, springCfg)

  useEffect(() => {
    injectFonts()
    injectStyles()
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return
    mouseX.set(e.clientX + 24)
    mouseY.set(e.clientY + 24)
  }

  const active = CONTACTS.find(c => c.id === activeId)

  return (
    <div
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        width: '100%',
        background:
          'radial-gradient(ellipse at 10% 20%, rgba(180,10,0,0.26) 0%, transparent 50%), ' +
          'radial-gradient(ellipse at 88% 80%, rgba(100,20,180,0.2) 0%, transparent 50%), ' +
          '#04000a',
        padding: 'clamp(40px, 6vw, 80px) clamp(20px, 6vw, 72px)',
        fontFamily: "'Rajdhani', sans-serif",
        cursor: 'default',
        overflow: 'hidden',
      }}
    >
      {/* Scanlines */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.04) 3px, rgba(0,0,0,0.04) 4px)',
      }} />

      {/* Top neon bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 10,
        backgroundImage: `linear-gradient(90deg, transparent, ${T.red.glow} 25%, #fff 50%, ${T.purple.glow} 75%, transparent)`,
        boxShadow: `0 0 16px ${T.red.glow}`,
      }} />

      {/* Ambient corner glows */}
      <div style={{ position: 'absolute', top: -70, left: -70, width: 240, height: 240, borderRadius: '50%', background: `radial-gradient(circle,${T.red.soft} 0%,transparent 70%)`, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle,${T.purple.soft} 0%,transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1100, margin: '0 auto' }}>

        {/* ── Header ── */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          style={{
            marginBottom: 48,
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            justifyContent: 'space-between',
            gap: 14,
          }}
        >
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              style={{ marginBottom: 10 }}
            >
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: "'Orbitron', monospace",
                fontSize: 8, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: T.red.text,
                border: `1px solid ${T.red.border}`,
                borderRadius: 4, padding: '3px 10px',
                background: 'rgba(220,30,10,0.07)',
                boxShadow: `0 0 10px rgba(220,30,10,0.12)`,
              }}>
                <ZapSVG /> Contact Us
              </span>
            </motion.div>

            <h1 style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(2.2rem, 5.5vw, 5rem)',
              fontWeight: 900, lineHeight: 1.04,
              letterSpacing: '0.05em', textTransform: 'uppercase',
              color: '#fff', margin: 0,
              textShadow: `0 0 32px ${T.red.glow}, 0 0 65px rgba(200,20,0,0.18)`,
            }}>
              Get In{' '}
              <span style={{ color: 'rgba(255,255,255,0.18)' }}>Touch</span>
            </h1>
          </div>

          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 10 }}>
              <div style={{ width: 60, height: 1, background: 'linear-gradient(90deg,transparent,rgba(220,30,10,0.35))' }} />
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 9, fontWeight: 700, letterSpacing: '0.3em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)',
              }}>
                Direct Line
              </span>
            </div>
          )}
        </motion.header>

        {/* Accent divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.65, delay: 0.18 }}
          style={{ display: 'flex', alignItems: 'center', marginBottom: 4, transformOrigin: 'left' }}
        >
          <div style={{ width: 44, height: 2, background: `linear-gradient(90deg,${T.red.glow},transparent)`, boxShadow: `0 0 6px ${T.red.glow}` }} />
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', boxShadow: `0 0 6px ${T.purple.glow},0 0 12px ${T.red.glow}`, margin: '0 5px' }} />
          <div style={{ width: 44, height: 2, background: `linear-gradient(90deg,transparent,${T.purple.glow})`, boxShadow: `0 0 6px ${T.purple.glow}` }} />
        </motion.div>

        {/* ── Contact rows ── */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {CONTACTS.map((contact, index) => (
            <ContactRow
              key={contact.id}
              data={contact}
              index={index}
              isActive={activeId === contact.id}
              setActiveId={setActiveId}
              isMobile={isMobile}
              isAnyActive={activeId !== null}
            />
          ))}
        </div>

        {/* Bottom rule */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          style={{
            marginTop: 28, height: 1,
            background: `linear-gradient(90deg,${T.red.glow},${T.purple.glow},transparent)`,
            boxShadow: `0 0 6px rgba(147,51,234,0.2)`, opacity: 0.38,
          }}
        />
      </div>

      {/* ── DESKTOP: spring-physics floating cursor card ── */}
      {!isMobile && (
        <div style={{ position: 'fixed', left: 0, top: 0, zIndex: 9999, pointerEvents: 'none' }}>
          <motion.div style={{ x: cursorX, y: cursorY }}>
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, scale: 0.52, filter: 'blur(14px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.52, filter: 'blur(14px)' }}
                  transition={{ type: 'spring', stiffness: 290, damping: 24 }}
                  style={{
                    width: 270, height: 340,
                    borderRadius: 14, overflow: 'hidden',
                    border: `1px solid rgba(220,30,10,0.4)`,
                    boxShadow: `0 0 0 1px rgba(147,51,234,0.18), 0 22px 55px rgba(0,0,0,0.75), 0 0 35px rgba(220,30,10,0.1)`,
                    background: '#04000a',
                    position: 'relative',
                  }}
                >
                  {/* Blurred bg fill */}
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 0,
                    backgroundImage: `url(${active.image})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    filter: 'blur(20px) brightness(0.2) saturate(1.4)',
                    transform: 'scale(1.12)',
                  }} />

                  {/* Foreground image — fully visible */}
                  <Image
                    src={active.image}
                    alt={active.name}
                    fill
                    style={{ objectFit: 'contain', zIndex: 1, filter: 'brightness(0.9) saturate(1.1)' }}
                  />

                  {/* Top neon line */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 4,
                    backgroundImage: `linear-gradient(90deg,transparent,${T.red.glow} 35%,${T.purple.glow} 70%,transparent)`,
                    boxShadow: `0 0 10px ${T.red.glow}`,
                  }} />

                  {/* Left red accent bar */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0, width: 2, zIndex: 4,
                    background: `linear-gradient(180deg,transparent,${T.red.glow},transparent)`,
                    boxShadow: `0 0 8px ${T.red.glow}`,
                  }} />

                  {/* Bottom gradient fade */}
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    background: 'linear-gradient(180deg,rgba(4,0,8,0) 38%,rgba(4,0,8,0.94) 100%)',
                  }} />

                  {/* Info overlay */}
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, padding: '12px 14px' }}>
                    {/* Status */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <div style={{
                        width: 6, height: 6, borderRadius: '50%',
                        background: '#22c55e', boxShadow: '0 0 8px #22c55e',
                        animation: 'cuGreenPulse 2s ease-in-out infinite',
                      }} />
                      <span style={{
                        fontFamily: "'Rajdhani', sans-serif",
                        fontSize: 8, fontWeight: 700, letterSpacing: '0.22em',
                        textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)',
                      }}>Available</span>
                    </div>

                    <div style={{
                      fontFamily: "'Orbitron', monospace",
                      fontSize: 12, fontWeight: 900, letterSpacing: '0.05em',
                      color: '#fff', textShadow: `0 0 10px ${T.red.glow}`, marginBottom: 2,
                    }}>{active.name}</div>

                    <div style={{
                      fontFamily: "'Rajdhani', sans-serif",
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
                      textTransform: 'uppercase', color: T.purple.text, marginBottom: 8,
                    }}>{active.position}</div>

                    <div style={{
                      borderTop: '1px solid rgba(220,30,10,0.2)',
                      paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 5,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ color: T.purple.text, display: 'flex' }}><GmailSVG /></span>
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{active.gmail}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ color: T.red.text, display: 'flex' }}><PhoneSVG /></span>
                        <span style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{active.phone}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
    </div>
  )
}