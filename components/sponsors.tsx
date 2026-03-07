"use client"

import { memo, useEffect, useRef, useCallback, CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"

const CSS = `
@keyframes sp-in {
  from { opacity:0; transform:translateY(20px) scale(0.97); }
  to   { opacity:1; transform:translateY(0) scale(1); }
}
@keyframes sp-minor-in {
  from { opacity:0; transform:translateY(14px); }
  to   { opacity:1; transform:translateY(0); }
}
@keyframes sp-scan {
  from { transform:scaleX(0); opacity:0; }
  to   { transform:scaleX(1); opacity:1; }
}
@keyframes sp-badge-glow {
  0%,100% { box-shadow: 0 0 8px rgba(255,40,10,0.4); }
  50%     { box-shadow: 0 0 18px rgba(255,40,10,0.85); }
}

.sp2-root  { animation: sp-in 0.5s cubic-bezier(0.22,1,0.36,1) both; }

.sp2-title-wrap {
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
}
.sp2-title-wrap:hover { transform: translateY(-4px) scale(1.015); }

.sp2-minor-wrap {
  will-change: transform;
  transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), border-color 0.25s, box-shadow 0.25s;
  animation: sp-minor-in 0.45s cubic-bezier(0.22,1,0.36,1) both;
}
.sp2-minor-wrap:hover { transform: translateY(-4px) scale(1.05); }
.sp2-minor-wrap:nth-child(1) { animation-delay:0.06s; }
.sp2-minor-wrap:nth-child(2) { animation-delay:0.12s; }
.sp2-minor-wrap:nth-child(3) { animation-delay:0.18s; }
.sp2-minor-wrap:nth-child(4) { animation-delay:0.24s; }

.sp2-scan {
  transform-origin: left center;
  animation: sp-scan 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both;
}
.sp2-badge { animation: sp-badge-glow 2.5s ease-in-out infinite; }

/* ✅ Flex layout for minor sponsors — centers nicely at any count */
.sp2-minor-flex {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.sp2-minor-item {
  flex: 0 0 auto;
  width: 140px;
}

@media (max-width: 600px) {
  .sp2-minor-item { width: 130px; }
}

@media (max-width: 360px) {
  .sp2-minor-item { width: 110px; }
}
`

let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return
  stylesInjected = true
  const s = document.createElement("style")
  s.textContent = CSS
  document.head.appendChild(s)
}

/* ═══════════════════════════════════════════
   ELECTRIC BORDER
═══════════════════════════════════════════ */
function hexToRgba(hex: string, alpha = 1): string {
  if (!hex) return `rgba(0,0,0,${alpha})`
  let h = hex.replace("#", "")
  if (h.length === 3) h = h.split("").map(c => c + c).join("")
  const int = parseInt(h, 16)
  return `rgba(${(int >> 16) & 255},${(int >> 8) & 255},${int & 255},${alpha})`
}

interface ElectricBorderProps {
  children?: ReactNode
  color?: string
  speed?: number
  chaos?: number
  borderRadius?: number
  className?: string
  style?: CSSProperties
}

const ElectricBorder = memo(function ElectricBorder({
  children,
  color = "#cc2200",
  speed = 1,
  chaos = 0.10,
  borderRadius = 18,
  className,
  style,
}: ElectricBorderProps) {
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef       = useRef<number | null>(null)
  const timeRef      = useRef(0)
  const lastRef      = useRef(0)

  const rnd = useCallback((x: number) => (Math.sin(x * 12.9898) * 43758.5453) % 1, [])

  const noise2D = useCallback((x: number, y: number) => {
    const i = Math.floor(x), j = Math.floor(y)
    const fx = x - i, fy = y - j
    const a = rnd(i + j * 57), b = rnd(i + 1 + j * 57)
    const c = rnd(i + (j + 1) * 57), d = rnd(i + 1 + (j + 1) * 57)
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy)
    return a*(1-ux)*(1-uy) + b*ux*(1-uy) + c*(1-ux)*uy + d*ux*uy
  }, [rnd])

  const octNoise = useCallback((x: number, t: number, seed: number) => {
    let y = 0, amp = chaos, freq = 10
    for (let i = 0; i < 8; i++) {
      y += (i === 0 ? 0 : amp) * noise2D(freq * x + seed * 100, t * freq * 0.3)
      freq *= 1.6; amp *= 0.7
    }
    return y
  }, [noise2D, chaos])

  const cornerPt = useCallback((cx: number, cy: number, r: number, sa: number, al: number, p: number) => ({
    x: cx + r * Math.cos(sa + p * al),
    y: cy + r * Math.sin(sa + p * al),
  }), [])

  const rectPt = useCallback((t: number, l: number, top: number, w: number, h: number, r: number) => {
    const sw = w - 2*r, sh = h - 2*r
    const ca = (Math.PI * r) / 2
    const perim = 2*sw + 2*sh + 4*ca
    let d = t * perim, acc = 0
    if (d <= acc + sw) return { x: l+r+(d-acc)/sw*sw, y: top }
    acc += sw
    if (d <= acc + ca) return cornerPt(l+w-r, top+r, r, -Math.PI/2, Math.PI/2, (d-acc)/ca)
    acc += ca
    if (d <= acc + sh) return { x: l+w, y: top+r+(d-acc)/sh*sh }
    acc += sh
    if (d <= acc + ca) return cornerPt(l+w-r, top+h-r, r, 0, Math.PI/2, (d-acc)/ca)
    acc += ca
    if (d <= acc + sw) return { x: l+w-r-(d-acc)/sw*sw, y: top+h }
    acc += sw
    if (d <= acc + ca) return cornerPt(l+r, top+h-r, r, Math.PI/2, Math.PI/2, (d-acc)/ca)
    acc += ca
    if (d <= acc + sh) return { x: l, y: top+h-r-(d-acc)/sh*sh }
    acc += sh
    return cornerPt(l+r, top+r, r, Math.PI, Math.PI/2, (d-acc)/ca)
  }, [cornerPt])

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const OFFSET = 48, DISP = 46

    const resize = () => {
      const rect = container.getBoundingClientRect()
      const w = rect.width + OFFSET * 2
      const h = rect.height + OFFSET * 2
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.scale(dpr, dpr)
      return { w, h }
    }

    let { w, h } = resize()

    const draw = (now: number) => {
      const dt = (now - lastRef.current) / 1000
      timeRef.current += dt * speed
      lastRef.current = now

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.scale(dpr, dpr)

      ctx.strokeStyle = color
      ctx.lineWidth = 1.2
      ctx.lineCap = "round"
      ctx.lineJoin = "round"

      const bw = w - 2*OFFSET, bh = h - 2*OFFSET
      const maxR = Math.min(bw, bh) / 2
      const r = Math.min(borderRadius, maxR)
      const samples = Math.floor((2*(bw+bh) + 2*Math.PI*r) / 2)

      ctx.beginPath()
      for (let i = 0; i <= samples; i++) {
        const p = i / samples
        const pt = rectPt(p, OFFSET, OFFSET, bw, bh, r)
        const dx = octNoise(p * 8, timeRef.current, 0) * DISP
        const dy = octNoise(p * 8, timeRef.current, 1) * DISP
        i === 0 ? ctx.moveTo(pt.x+dx, pt.y+dy) : ctx.lineTo(pt.x+dx, pt.y+dy)
      }
      ctx.closePath()
      ctx.stroke()
      rafRef.current = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => { const s = resize(); w = s.w; h = s.h })
    ro.observe(container)
    rafRef.current = requestAnimationFrame(draw)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [color, speed, borderRadius, octNoise, rectPt])

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-visible isolate", className)}
      style={{ borderRadius, ...style } as CSSProperties}
    >
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[2]">
        <canvas ref={canvasRef} className="block" />
      </div>
      <div className="absolute inset-0 rounded-[inherit] pointer-events-none z-0">
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ border: `1.5px solid ${hexToRgba(color, 0.45)}`, filter: "blur(1px)" }} />
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none"
          style={{ border: `1.5px solid ${color}`, filter: "blur(3px)" }} />
        <div className="absolute inset-0 rounded-[inherit] pointer-events-none -z-[1] scale-110 opacity-20"
          style={{ filter: "blur(26px)", background: `linear-gradient(-30deg,${color},transparent,${color})` }} />
      </div>
      <div className="relative rounded-[inherit] z-[1]">{children}</div>
    </div>
  )
})

/* ═══════════════════════════════════════════
   TYPES
═══════════════════════════════════════════ */
export interface MinorSponsor {
  name: string
  image: string
  url?: string
}

export interface SponsorsProps {
  titleSponsor: { name: string; image: string; tagline?: string; url?: string }
  minorSponsors?: MinorSponsor[]
  sectionLabel?: string
  className?: string
}

/* ═══════════════════════════════════════════
   DIVIDER
═══════════════════════════════════════════ */
const Divider = memo(function Divider({ label, dimmer = false }: { label: string; dimmer?: boolean }) {
  const alpha = dimmer ? 0.4 : 0.65
  return (
    <div style={{ display:"flex", alignItems:"center", gap:14 }}>
      <div style={{ flex:1, height:1, backgroundImage:`linear-gradient(90deg,transparent,rgba(255,36,10,${alpha}))` }} />
      <span style={{
        fontFamily:"'Orbitron',monospace",
        fontSize: dimmer ? 9 : 10,
        fontWeight:700, letterSpacing:"0.26em",
        color: dimmer ? "rgba(200,70,40,0.58)" : "rgba(255,100,60,0.85)",
        textTransform:"uppercase", whiteSpace:"nowrap",
      }}>
        {label}
      </span>
      <div style={{ flex:1, height:1, backgroundImage:`linear-gradient(90deg,rgba(255,36,10,${alpha}),transparent)` }} />
    </div>
  )
})

/* ═══════════════════════════════════════════
   TITLE CARD INNER
═══════════════════════════════════════════ */
const TitleInner = memo(function TitleInner({
  name, image, tagline,
}: { name:string; image:string; tagline?:string }) {
  const glow = "rgba(255,36,10,0.85)"
  const soft = "rgba(255,36,10,0.20)"
  const mid  = "rgba(255,36,10,0.09)"

  return (
    <div
      className="sp2-title-wrap"
      style={{
        position:"relative", borderRadius:18,
        backgroundColor:"#070000",
        backgroundImage:"linear-gradient(150deg,rgba(26,3,0,0.98) 0%,rgba(5,0,0,1) 100%)",
        padding:"clamp(20px,4vw,32px) clamp(18px,5vw,36px) clamp(18px,4vw,28px)",
        display:"flex", flexDirection:"column", alignItems:"center", gap:16,
        overflow:"hidden", cursor:"pointer",
      }}
    >
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:2,
        backgroundImage:`linear-gradient(90deg,transparent,${glow} 25%,#fff 50%,${glow} 75%,transparent)`,
        boxShadow:`0 0 14px ${glow}`,
      }} />
      <div style={{
        position:"absolute", top:-65, left:"50%", transform:"translateX(-50%)",
        width:260, height:150, borderRadius:"50%",
        backgroundImage:`radial-gradient(ellipse,${soft} 0%,transparent 70%)`,
        pointerEvents:"none",
      }} />
      <div style={{
        position:"absolute", bottom:-45, right:-45, width:130, height:130,
        borderRadius:"50%",
        backgroundImage:`radial-gradient(circle,${mid} 0%,transparent 70%)`,
        pointerEvents:"none",
      }} />

      <div className="sp2-badge" style={{
        fontFamily:"'Orbitron',monospace",
        fontSize:9, fontWeight:700, letterSpacing:"0.22em",
        color:"rgba(255,110,65,0.9)", textTransform:"uppercase",
        border:"1px solid rgba(255,55,15,0.38)", borderRadius:4,
        padding:"3px 14px",
        backgroundImage:"linear-gradient(90deg,rgba(255,35,8,0.12),rgba(255,55,20,0.06))",
      }}>
        ★ Title Sponsor
      </div>

      <div style={{
        width:"100%", maxWidth:280, height:140,
        display:"flex", alignItems:"center", justifyContent:"center", position:"relative",
      }}>
        <div style={{
          position:"absolute", inset:-10,
          backgroundImage:`radial-gradient(ellipse,${mid} 0%,transparent 70%)`,
          borderRadius:14,
        }} />
        <img src={image} alt={name} loading="lazy" decoding="async"
          style={{
            maxWidth:"100%", maxHeight:"100%", objectFit:"contain",
            filter:"brightness(1.05) contrast(1.05)", position:"relative",
          }}
        />
      </div>

      <div className="sp2-scan" style={{
        width:"75%", height:1,
        backgroundImage:`linear-gradient(90deg,transparent,${glow},rgba(255,120,50,0.5),transparent)`,
        boxShadow:`0 0 6px ${glow}`,
      }} />

      <div style={{
        fontFamily:"'Orbitron',monospace",
        fontSize:"clamp(13px,3vw,17px)", fontWeight:900, letterSpacing:"0.06em",
        color:"#fff", textShadow:`0 0 16px ${glow}`,
        textTransform:"uppercase", textAlign:"center",
      }}>
        {name}
      </div>

      {tagline && (
        <div style={{
          fontFamily:"'Rajdhani',sans-serif",
          fontSize:13, fontWeight:500, letterSpacing:"0.08em",
          color:"rgba(255,150,105,0.70)", textAlign:"center", marginTop:-4,
        }}>
          {tagline}
        </div>
      )}
    </div>
  )
})

/* ═══════════════════════════════════════════
   MINOR CARD INNER
═══════════════════════════════════════════ */
const MinorInner = memo(function MinorInner({ name, image }: { name:string; image:string }) {
  const glow = "rgba(190,24,6,0.72)"
  const mid  = "rgba(190,24,6,0.08)"

  return (
    <div
      className="sp2-minor-wrap"
      style={{
        position:"relative", borderRadius:12,
        backgroundColor:"#040000",
        backgroundImage:"linear-gradient(145deg,rgba(16,2,0,0.97) 0%,rgba(2,0,0,1) 100%)",
        border:"1px solid rgba(150,16,4,0.30)",
        padding:"20px 16px 16px",
        display:"flex", flexDirection:"column", alignItems:"center", gap:10,
        overflow:"hidden",
        width:"100%",        // ✅ fills the flex item width
        height:"100%",
        cursor:"pointer",
        boxSizing:"border-box",
      }}
    >
      <div style={{
        position:"absolute", top:0, left:0, right:0, height:1.5,
        backgroundImage:`linear-gradient(90deg,transparent,${glow},transparent)`,
        boxShadow:`0 0 7px ${glow}`,
      }} />
      <div style={{
        position:"absolute", top:-30, left:"50%", transform:"translateX(-50%)",
        width:120, height:70, borderRadius:"50%",
        backgroundImage:`radial-gradient(ellipse,${mid} 0%,transparent 70%)`,
        pointerEvents:"none",
      }} />

      <div style={{
        width:"100%", maxWidth:110, height:80,
        display:"flex", alignItems:"center", justifyContent:"center", position:"relative",
      }}>
        <div style={{
          position:"absolute", inset:-6,
          backgroundImage:`radial-gradient(ellipse,${mid} 0%,transparent 70%)`,
          borderRadius:8,
        }} />
        <img src={image} alt={name} loading="lazy" decoding="async"
          style={{
            maxWidth:"100%", maxHeight:"100%", objectFit:"contain",
            position:"relative", filter:"brightness(1.05) contrast(1.05)",
          }}
        />
      </div>

      <div style={{
        width:"60%", height:1,
        backgroundImage:`linear-gradient(90deg,transparent,${glow},transparent)`,
        opacity:0.42,
      }} />

      <div style={{
        fontFamily:"'Rajdhani',sans-serif",
        fontSize:11, fontWeight:700, letterSpacing:"0.13em",
        color:"rgba(255,125,85,0.80)", textTransform:"uppercase", textAlign:"center",
      }}>
        {name}
      </div>
    </div>
  )
})

/* ═══════════════════════════════════════════
   ROOT
═══════════════════════════════════════════ */
export function Sponsors({
  titleSponsor,
  minorSponsors = [],
  sectionLabel = "Our Sponsors",
  className,
}: SponsorsProps) {
  useEffect(() => { injectStyles() }, [])

  const capped = minorSponsors.slice(0, 4)

  return (
    <div
      className={cn("sp2-root", className)}
      style={{
        position:"relative", width:"100%", maxWidth:660,
        padding:"clamp(24px,5vw,36px) clamp(16px,4vw,24px) clamp(22px,5vw,32px)",
        borderRadius:24,
        backgroundColor:"#030000",
        backgroundImage:"linear-gradient(160deg,rgba(14,2,0,0.98) 0%,rgba(2,0,0,1) 100%)",
        border:"1px solid rgba(150,16,4,0.22)",
        boxShadow:"0 0 0 1px rgba(170,16,4,0.06), 0 0 50px rgba(150,16,4,0.12), inset 0 1px 0 rgba(255,40,15,0.04)",
        fontFamily:"'Rajdhani',sans-serif",
        overflow:"hidden", boxSizing:"border-box",
      }}
    >
      {/* Ambient glows */}
      <div style={{
        position:"absolute", top:-85, left:"50%", transform:"translateX(-50%)",
        width:460, height:220, borderRadius:"50%",
        backgroundImage:"radial-gradient(ellipse,rgba(160,16,4,0.08) 0%,transparent 70%)",
        pointerEvents:"none",
      }} />
      <div style={{
        position:"absolute", bottom:-65, left:"50%", transform:"translateX(-50%)",
        width:360, height:170, borderRadius:"50%",
        backgroundImage:"radial-gradient(ellipse,rgba(130,8,0,0.06) 0%,transparent 70%)",
        pointerEvents:"none",
      }} />

      {/* Section label */}
      <div style={{ marginBottom:"clamp(20px,4vw,28px)" }}>
        <Divider label={sectionLabel} />
      </div>

      {/* Title sponsor */}
      {titleSponsor.url ? (
        <a href={titleSponsor.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration:"none", display:"block" }}>
          <ElectricBorder color="#cc2200" speed={0.85} chaos={0.09} borderRadius={18} style={{ display:"block" }}>
            <TitleInner name={titleSponsor.name} image={titleSponsor.image} tagline={titleSponsor.tagline} />
          </ElectricBorder>
        </a>
      ) : (
        <ElectricBorder color="#cc2200" speed={0.85} chaos={0.09} borderRadius={18} style={{ display:"block" }}>
          <TitleInner name={titleSponsor.name} image={titleSponsor.image} tagline={titleSponsor.tagline} />
        </ElectricBorder>
      )}

      {/* ✅ Minor sponsors — flex layout, centered, wraps cleanly */}
      {capped.length > 0 && (
        <div style={{ marginTop:"clamp(20px,4vw,28px)" }}>
          <div style={{ marginBottom:"clamp(14px,3vw,18px)" }}>
            <Divider label="Supported By" dimmer />
          </div>

          <div className="sp2-minor-flex">
            {capped.map((s) => {
              const card = <MinorInner name={s.name} image={s.image} />
              return (
                <div key={s.name} className="sp2-minor-item">
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer"
                      style={{ textDecoration:"none", display:"flex", height:"100%" }}>
                      {card}
                    </a>
                  ) : (
                    <div style={{ display:"flex", height:"100%" }}>{card}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Sponsors