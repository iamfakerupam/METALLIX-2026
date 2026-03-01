'use client'

import { EventCountdownCard } from '@/components/event-countdown-card'
import React from 'react'

const Event = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 20% 20%, #2a0a0a 0%, #0f0000 40%, #050000 100%)',
        backgroundAttachment: 'fixed',
      }}
      className="relative"
    >
      {/* Subtle noise/grain overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
          pointerEvents: 'none',
          zIndex: 0,
          opacity: 0.5,
        }}
      />

      {/* Top glow accent */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(220,30,10,0.8) 30%, #fff 50%, rgba(220,30,10,0.8) 70%, transparent)',
          boxShadow: '0 0 20px rgba(255,30,10,0.6)',
          zIndex: 10,
        }}
      />

      <div className="relative z-10 px-6 md:px-20 py-14">
        {/* Page Title */}
        <div className="mb-14 text-center">
          <h1
            style={{
              fontFamily: "'Orbitron', monospace",
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 900,
              letterSpacing: '0.18em',
              color: '#fff',
              textShadow:
                '0 0 30px rgba(255,40,10,0.9), 0 0 60px rgba(200,20,0,0.5), 0 0 100px rgba(150,10,0,0.3)',
              textTransform: 'uppercase',
              margin: 0,
            }}
          >
            Events
          </h1>
          {/* Underline accent */}
          <div
            style={{
              margin: '12px auto 0',
              width: 120,
              height: 2,
              background:
                'linear-gradient(90deg, transparent, rgba(255,40,10,0.9), transparent)',
              boxShadow: '0 0 10px rgba(255,40,10,0.7)',
            }}
          />
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9 justify-items-center">
          <EventCountdownCard image="/codemet.png"   title="CODEMET"  attendees={0} />
          <EventCountdownCard image="/hackemet.png"  title="HACKMET"  attendees={0} />
          <EventCountdownCard image="/scribe.png"    title="SCRIBE"   attendees={0} />
          <EventCountdownCard image="/specio.png"    title="SPECIO"   attendees={0} />
          <EventCountdownCard image="/scroll.png"    title="SCROLL"   attendees={0} />
          <EventCountdownCard image="/talaash.png"   title="TALAASH"  attendees={0} />
          <EventCountdownCard image="/gnosis.png"    title="GNOSIS"   attendees={0} />
          <EventCountdownCard image="/wallst.png"    title="WALLST"   attendees={0} />
          <EventCountdownCard image="/"              title="GOLAZO"   attendees={0} />
        </div>
      </div>
    </div>
  )
}

export default Event