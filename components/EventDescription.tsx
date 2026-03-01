"use client"

import React, { useEffect } from 'react'
import { cn } from "@/lib/utils"
import { motion } from 'framer-motion'
import type { Variants } from "framer-motion"
import type { HTMLMotionProps } from "framer-motion"

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
@keyframes edhShimmer {
  from { transform: translateX(-100%); }
  to   { transform: translateX(300%); }
}
@keyframes edhPulse {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.5; }
}
.edh-cta {
  transition: transform 0.2s ease, box-shadow 0.25s ease;
  position: relative;
  overflow: hidden;
}
.edh-cta:hover { transform: translateY(-2px) scale(1.02); }
.edh-cta:active { transform: scale(0.97); }
.edh-shimmer { display: none; }
.edh-cta:hover .edh-shimmer { display: block; }
.edh-info-card {
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.edh-info-card:hover {
  border-color: rgba(160, 30, 220, 0.55) !important;
  box-shadow: 0 0 20px rgba(140, 20, 200, 0.22) !important;
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

/* ── Icons ── */
const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
)

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
)

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)

const ZapIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
)

/* ── Theme tokens ── */
const theme = {
  red:    { glow: 'rgba(220,30,10,0.9)',    soft: 'rgba(220,30,10,0.2)',  border: 'rgba(220,30,10,0.5)',  text: '#ff9070' },
  violet: { glow: 'rgba(160,30,220,0.85)',  soft: 'rgba(140,20,200,0.2)', border: 'rgba(140,20,200,0.45)', text: '#d090ff' },
}

/* ── Info card sub-component ── */
function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div
      className="edh-info-card"
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(160,30,220,0.25)',
        borderRadius: 10,
        padding: '12px 16px',
        boxShadow: '0 0 12px rgba(140,20,200,0.10)',
      }}
    >
      <div style={{
        marginTop: 1,
        color: theme.violet.text,
        filter: `drop-shadow(0 0 6px ${theme.violet.glow})`,
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: 3,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: '#fff',
          letterSpacing: '0.02em',
          lineHeight: 1.3,
        }}>
          {value}
        </div>
      </div>
    </div>
  )
}

/* ── Props ── */
export interface EventDescriptionHeroProps extends HTMLMotionProps<"section"> {
  image: string
  title: string
  description: string
  contactName: string
  contactNumber: string
  location: string
  date: string
  time: string
}

/* ── Animation variants ── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.25 },
  },
} as const satisfies Variants

const itemVariants = {
  hidden: { y: 24, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.55, ease: "easeOut" },
  },
} as const satisfies Variants

/* ── Main component ── */
export const EventDescriptionHero = React.forwardRef<HTMLDivElement, EventDescriptionHeroProps>(
  (
    { className, image, title, description, contactName, contactNumber, location, date, time, ...props },
    ref
  ) => {
    useEffect(() => {
      injectFonts()
      injectStyles()
    }, [])

    return (
      <motion.section
        ref={ref}
        className={cn('relative w-full overflow-hidden', className)}
        style={{
          minHeight: '100vh',
          background:
            'radial-gradient(ellipse at 15% 30%, rgba(100,10,10,0.55) 0%, transparent 55%), radial-gradient(ellipse at 80% 70%, rgba(80,10,140,0.4) 0%, transparent 55%), #040000',
          fontFamily: "'Rajdhani', sans-serif",
        }}
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        {...props}
      >
        {/* Top neon line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 20,
          backgroundImage: `linear-gradient(90deg, transparent, ${theme.red.glow} 25%, #fff 50%, ${theme.violet.glow} 75%, transparent)`,
          boxShadow: `0 0 18px ${theme.red.glow}`,
        }} />

        {/* Ambient corner glows */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 320, height: 320, borderRadius: '50%', background: `radial-gradient(circle, ${theme.red.soft} 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 280, height: 280, borderRadius: '50%', background: `radial-gradient(circle, rgba(120,20,200,0.22) 0%, transparent 70%)`, pointerEvents: 'none' }} />

        {/* Scanline overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.06) 3px, rgba(0,0,0,0.06) 4px)',
        }} />

        <div className="relative z-10 flex flex-col md:flex-row w-full" style={{ minHeight: '100vh' }}>

          {/* ── LEFT: Content ── */}
          <div
            className="flex flex-col justify-between w-full md:w-3/5"
            style={{ padding: 'clamp(32px, 5vw, 72px)' }}
          >
            <div>
              {/* Event badge */}
              <motion.div variants={itemVariants} style={{ marginBottom: 28 }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontFamily: "'Orbitron', monospace",
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: theme.red.text,
                  border: `1px solid ${theme.red.border}`,
                  borderRadius: 4,
                  padding: '4px 12px',
                  background: 'rgba(220,30,10,0.08)',
                  boxShadow: `0 0 12px rgba(220,30,10,0.15)`,
                }}>
                  <ZapIcon /> Event Details
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1 variants={itemVariants} style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 'clamp(2rem, 4.5vw, 3.4rem)',
                fontWeight: 900,
                lineHeight: 1.15,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#fff',
                margin: 0,
                textShadow: `0 0 30px ${theme.red.glow}, 0 0 60px rgba(200,20,0,0.3)`,
              }}>
                {title}
              </motion.h1>

              {/* Dual accent line */}
              <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: 0, margin: '20px 0 28px' }}>
                <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, ${theme.red.glow}, transparent)`, boxShadow: `0 0 8px ${theme.red.glow}` }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', boxShadow: `0 0 8px ${theme.violet.glow}, 0 0 16px ${theme.red.glow}`, margin: '0 6px' }} />
                <div style={{ width: 60, height: 3, background: `linear-gradient(90deg, transparent, ${theme.violet.glow})`, boxShadow: `0 0 8px ${theme.violet.glow}` }} />
              </motion.div>

              {/* Description */}
              <motion.p variants={itemVariants} style={{
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.75,
                color: 'rgba(255,255,255,0.62)',
                maxWidth: 520,
                marginBottom: 40,
                letterSpacing: '0.02em',
              }}>
                {description}
              </motion.p>

              {/* Info grid */}
              <motion.div
                variants={containerVariants}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, maxWidth: 560 }}
              >
                <motion.div variants={itemVariants}><InfoCard icon={<CalendarIcon />} label="Date" value={date} /></motion.div>
                <motion.div variants={itemVariants}><InfoCard icon={<ClockIcon />} label="Time" value={time} /></motion.div>
                <motion.div variants={itemVariants}><InfoCard icon={<LocationIcon />} label="Location" value={location} /></motion.div>
                <motion.div variants={itemVariants}><InfoCard icon={<UserIcon />} label="Contact" value={contactName} /></motion.div>
              </motion.div>
            </div>

            {/* Footer: CTA + contact number */}
            <motion.footer variants={itemVariants} style={{ marginTop: 48 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
                <button
                  className="edh-cta"
                  style={{
                    height: 50,
                    padding: '0 32px',
                    borderRadius: 10,
                    border: `1px solid ${theme.red.border}`,
                    background: 'linear-gradient(145deg, rgba(28,2,0,0.95), rgba(8,0,0,0.98))',
                    color: '#fff',
                    fontFamily: "'Orbitron', monospace",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    boxShadow: `0 0 18px ${theme.red.soft}, inset 0 1px 0 rgba(255,60,20,0.06)`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <div className="edh-shimmer" style={{
                    position: 'absolute', inset: 0, left: '-100%', width: '60%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,80,30,0.14), transparent)',
                    animation: 'edhShimmer 0.65s ease-in-out',
                    pointerEvents: 'none',
                  }} />
                  <ZapIcon />
                  Link Available Soon
                </button>

                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  color: theme.violet.text,
                  fontSize: 14, fontWeight: 600, letterSpacing: '0.04em',
                  filter: `drop-shadow(0 0 6px ${theme.violet.glow})`,
                }}>
                  <PhoneIcon />
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontFamily: "'Rajdhani', sans-serif" }}>
                    {contactNumber}
                  </span>
                </div>
              </div>

              <div style={{
                marginTop: 32, height: 1,
                background: `linear-gradient(90deg, ${theme.red.glow}, ${theme.violet.glow}, transparent)`,
                boxShadow: `0 0 8px rgba(160,30,220,0.3)`,
                opacity: 0.6,
              }} />
            </motion.footer>
          </div>

          {/* ── RIGHT: Image panel ── */}
          {/*
            Strategy:
            • The outer motion.div keeps the diagonal clipPath tilt animation — unchanged.
            • Inside, we use the same two-layer technique:
                1. A blurred, darkened copy of the image as a CSS background-image (covers all dead space).
                2. The real <img> with objectFit: contain so the full image is always visible.
            • The clip cuts the parallelogram shape from the outside, so the image
              content inside is never cropped — only the container edges are shaped.
          */}
          <motion.div
            className="w-full md:w-2/5"
            style={{
              position: 'relative',
              minHeight: 340,
              overflow: 'hidden',
            }}
            initial={{ clipPath: 'polygon(100% 0, 100% 0, 100% 100%, 100% 100%)' }}
            animate={{ clipPath: 'polygon(18% 0, 100% 0, 100% 100%, 0% 100%)' }}
            transition={{ duration: 1.3, ease: 'circOut', delay: 0.3 }}
          >
            {/* Layer 1 – blurred bg fills dead space caused by contain */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'blur(22px) brightness(0.28) saturate(1.5)',
                transform: 'scale(1.15)', // prevent blur-edge bleed
                zIndex: 0,
              }}
            />

            {/* Layer 2 – foreground image, fully visible */}
            <img
              src={image}
              alt={title}
              style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                display: 'block',
                filter: 'brightness(0.88) saturate(1.1)',
              }}
            />

            {/* Layer 3 – subtle bottom fade so content blends into section bg */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 2,
              background: 'linear-gradient(180deg, rgba(4,0,8,0.05) 0%, rgba(4,0,8,0.65) 100%)',
              pointerEvents: 'none',
            }} />

            {/* Left violet edge line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, bottom: 0, width: 3, zIndex: 3,
              background: `linear-gradient(180deg, transparent, ${theme.violet.glow}, transparent)`,
              boxShadow: `0 0 12px ${theme.violet.glow}`,
            }} />

            {/* Top red edge line */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 3,
              background: `linear-gradient(90deg, ${theme.violet.glow}, transparent)`,
              boxShadow: `0 0 8px ${theme.violet.glow}`,
            }} />

            {/* Floating date badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.5 }}
              style={{
                position: 'absolute', bottom: 28, left: 32, zIndex: 4,
                background: 'rgba(4,0,8,0.88)',
                border: `1px solid ${theme.violet.border}`,
                borderRadius: 10,
                padding: '10px 18px',
                boxShadow: `0 0 24px rgba(140,20,200,0.35)`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <div style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 9, fontWeight: 700, letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: theme.violet.text,
                marginBottom: 4,
              }}>
                Scheduled
              </div>
              <div style={{
                fontFamily: "'Orbitron', monospace",
                fontSize: 14, fontWeight: 900, letterSpacing: '0.05em',
                color: '#fff',
                textShadow: `0 0 12px ${theme.violet.glow}`,
              }}>
                {date}
              </div>
              <div style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: 12, fontWeight: 600,
                color: 'rgba(255,255,255,0.5)',
                marginTop: 2,
              }}>
                {time}
              </div>
            </motion.div>
          </motion.div>

        </div>
      </motion.section>
    )
  }
)

EventDescriptionHero.displayName = 'EventDescriptionHero'

export default EventDescriptionHero