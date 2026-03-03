import React from 'react'

const LoadingScreen = () => {
  return (
    <div style={{
      background: "#030000",
      height: "100vh",
      width: "100vw",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      position: "relative",
    }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@500;600&display=swap');

        @keyframes neonPulse {
          0%, 100% { opacity: 1; text-shadow: 0 0 20px rgba(220,30,10,0.9), 0 0 60px rgba(220,30,10,0.4); }
          50%       { opacity: 0.7; text-shadow: 0 0 8px rgba(220,30,10,0.4); }
        }

        @keyframes barFill {
          0%   { width: 0%; }
          100% { width: 100%; }
        }

        @keyframes barGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(220,30,10,0.8), 0 0 24px rgba(220,30,10,0.3); }
          50%       { box-shadow: 0 0 18px rgba(220,30,10,1), 0 0 48px rgba(220,30,10,0.6); }
        }

        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        @keyframes dotBlink {
          0%, 100% { opacity: 1; }
          33%       { opacity: 0.1; }
        }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        @keyframes counterSpin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(-360deg); }
        }

        .ml-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(28px, 5vw, 48px);
          font-weight: 900;
          letter-spacing: 0.22em;
          color: #fff;
          text-transform: uppercase;
          animation: neonPulse 2.4s ease-in-out infinite, fadeSlideUp 0.6s ease both;
        }

        .ml-year {
          color: rgba(220,30,10,0.95);
        }

        .ml-subtitle {
          font-family: 'Rajdhani', sans-serif;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.38em;
          color: rgba(220,30,10,0.6);
          text-transform: uppercase;
          animation: fadeSlideUp 0.6s 0.2s ease both;
          margin-top: 6px;
        }

        .ml-bar-track {
          width: clamp(220px, 32vw, 380px);
          height: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 2px;
          overflow: hidden;
          margin-top: 40px;
          animation: fadeSlideUp 0.6s 0.35s ease both;
          opacity: 0;
        }

        .ml-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, rgba(220,30,10,0.6), #EE220E, rgba(180,30,200,0.8));
          border-radius: 2px;
          animation: barFill 2.8s cubic-bezier(0.4,0,0.2,1) 0.5s both,
                     barGlow 1.2s ease-in-out infinite;
        }

        .ml-status {
          font-family: 'Rajdhani', sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.24em;
          color: rgba(255,255,255,0.25);
          text-transform: uppercase;
          margin-top: 14px;
          animation: fadeSlideUp 0.6s 0.5s ease both;
          opacity: 0;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .ml-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(220,30,10,0.7);
          display: inline-block;
        }
        .ml-dot:nth-child(1) { animation: dotBlink 1.2s 0s infinite; }
        .ml-dot:nth-child(2) { animation: dotBlink 1.2s 0.2s infinite; }
        .ml-dot:nth-child(3) { animation: dotBlink 1.2s 0.4s infinite; }

        .ml-ring-outer {
          animation: orbitSpin 4s linear infinite;
        }
        .ml-ring-inner {
          animation: counterSpin 2.5s linear infinite;
        }

        .ml-scanline {
          position: absolute;
          left: 0; right: 0;
          height: 120px;
          background: linear-gradient(180deg, transparent, rgba(220,30,10,0.03) 50%, transparent);
          pointer-events: none;
          animation: scanline 4s linear infinite;
        }
      `}</style>

      {/* Scanline sweep */}
      <div className="ml-scanline" />

      {/* Background radial glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(80,0,0,0.35) 0%, transparent 70%)",
      }} />

      {/* Scanline texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.08) 3px, rgba(0,0,0,0.08) 4px)",
      }} />

      {/* Top neon line */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: "linear-gradient(90deg, transparent, rgba(220,30,10,0.8) 30%, #fff 50%, rgba(140,20,200,0.7) 70%, transparent)",
        boxShadow: "0 0 18px rgba(220,30,10,0.5)",
      }} />

      {/* Spinning rings */}
      <div style={{ position: "relative", width: 100, height: 100, marginBottom: 32 }}>
        {/* Outer ring */}
        <svg className="ml-ring-outer" width="100" height="100" viewBox="0 0 100 100"
          style={{ position: "absolute", inset: 0 }}>
          <circle cx="50" cy="50" r="46"
            fill="none"
            stroke="rgba(220,30,10,0.15)"
            strokeWidth="1"
          />
          <circle cx="50" cy="50" r="46"
            fill="none"
            stroke="rgba(220,30,10,0.8)"
            strokeWidth="1.5"
            strokeDasharray="30 260"
            strokeLinecap="round"
          />
        </svg>

        {/* Inner ring */}
        <svg className="ml-ring-inner" width="100" height="100" viewBox="0 0 100 100"
          style={{ position: "absolute", inset: 0 }}>
          <circle cx="50" cy="50" r="34"
            fill="none"
            stroke="rgba(140,20,200,0.15)"
            strokeWidth="1"
          />
          <circle cx="50" cy="50" r="34"
            fill="none"
            stroke="rgba(140,20,200,0.7)"
            strokeWidth="1.5"
            strokeDasharray="18 196"
            strokeLinecap="round"
          />
        </svg>

        {/* Center dot */}
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 8, height: 8, borderRadius: "50%",
          background: "#EE220E",
          boxShadow: "0 0 16px rgba(220,30,10,1), 0 0 40px rgba(220,30,10,0.5)",
        }} />
      </div>

      {/* Title */}
      <div className="ml-title">
        METALLIX<span className="ml-year">`26</span>
      </div>

      {/* Subtitle */}
      <div className="ml-subtitle">Forge · Fuse · Flourish</div>

      {/* Progress bar */}
      <div className="ml-bar-track">
        <div className="ml-bar-fill" />
      </div>

      {/* Status */}
      <div className="ml-status">
        Initializing
        <span className="ml-dot" />
        <span className="ml-dot" />
        <span className="ml-dot" />
      </div>

      {/* Corner accents */}
      {[
        { top: 20, left: 20, borderTop: "1px solid rgba(220,30,10,0.3)", borderLeft: "1px solid rgba(220,30,10,0.3)" },
        { top: 20, right: 20, borderTop: "1px solid rgba(220,30,10,0.3)", borderRight: "1px solid rgba(220,30,10,0.3)" },
        { bottom: 20, left: 20, borderBottom: "1px solid rgba(220,30,10,0.3)", borderLeft: "1px solid rgba(220,30,10,0.3)" },
        { bottom: 20, right: 20, borderBottom: "1px solid rgba(220,30,10,0.3)", borderRight: "1px solid rgba(220,30,10,0.3)" },
      ].map((style, i) => (
        <div key={i} style={{
          position: "absolute", width: 20, height: 20, ...style,
        }} />
      ))}
    </div>
  )
}

export default LoadingScreen