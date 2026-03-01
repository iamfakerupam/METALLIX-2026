import { ImageTrailDemo } from "./About";
import { TimelineDemo } from "./Timeline";
import FAQs from "./Faq";
import SplashCursor from "@/components/SplashCursor";
import Sponsors from "@/components/sponsors";
import SmoothScrollWrapper from "@/components/Smoothscrollwrapper";
import { HeroVideoDemo } from "./Hero";
import Navbar from "@/components/Navbar";
import MetallixFooter from "@/components/Footer";
import ContactUsSection from "@/components/contactSection";

export default function Home() {
  return (
    <div className="bg-black">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&display=swap');
        html { scroll-behavior: auto; }
      `}</style>
 <Navbar/>
      <SmoothScrollWrapper>
       
        <section id="home"><HeroVideoDemo/></section>
        <SplashCursor/>
        <div
          className="relative min-h-screen font-sans overflow-x-hidden"
          style={{ backgroundColor: "#000000" }}
        >
          {/* ── BACKGROUND LAYER ── */}
          <div style={{
            position: "fixed", inset: 0, zIndex: 0,
            overflow: "hidden", pointerEvents: "none",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse 90% 65% at 50% 0%, #180000 0%, #000000 68%)",
            }} />
            <div style={{ position: "absolute", top: "-18%", left: "-12%", width: "72vw", height: "72vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(180,0,0,0.22) 0%, rgba(120,0,0,0.08) 42%, transparent 68%)" }} />
            <div style={{ position: "absolute", top: "8%", right: "-16%", width: "66vw", height: "66vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(220,20,20,0.16) 0%, rgba(150,0,0,0.05) 40%, transparent 68%)" }} />
            <div style={{ position: "absolute", top: "42%", left: "18%", width: "56vw", height: "56vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(160,0,0,0.13) 0%, transparent 65%)" }} />
            <div style={{ position: "absolute", bottom: "-22%", right: "8%", width: "62vw", height: "62vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(130,0,0,0.16) 0%, transparent 65%)" }} />
            <div style={{ position: "absolute", top: "62%", left: "-12%", width: "46vw", height: "46vw", borderRadius: "50%",
              background: "radial-gradient(circle, rgba(200,40,40,0.09) 0%, transparent 65%)" }} />
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `linear-gradient(rgba(255,26,26,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(255,26,26,0.055) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 120px, rgba(255,26,26,0.022) 120px, rgba(255,26,26,0.022) 121px)`,
            }} />
            <div style={{ position: "absolute", top: 0, left: 0, width: 320, height: 320,
              background: "radial-gradient(circle at top left, rgba(204,0,0,0.18) 0%, transparent 70%)" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 420, height: 420,
              background: "radial-gradient(circle at bottom right, rgba(255,26,26,0.13) 0%, transparent 70%)" }} />
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: "linear-gradient(90deg, transparent, rgba(255,26,26,0.9), rgba(204,0,0,0.85), rgba(255,60,60,0.7), transparent)",
              boxShadow: "0 0 22px rgba(255,26,26,0.65), 0 0 44px rgba(204,0,0,0.25)",
            }} />
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at center, transparent 48%, rgba(0,0,0,0.62) 100%)",
            }} />
          </div>

          {/* ── PAGE CONTENT ── */}
          <div style={{ position: "relative", zIndex: 1 }}>
            <section id="about"><ImageTrailDemo /></section>

            <section id="events"><TimelineDemo /></section>

            <section id="sponsors">
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
                <Sponsors
                  titleSponsor={{ name: "TATA STEEL", image: "/tatasteel.jpg", tagline: "Building the future", url: "https://www.tatasteel.com/" }}
                  minorSponsors={[
                    { name: "Coming Soon1", image: "/sponsors/devtools.png" },
                    { name: "Coming Soon2", image: "/sponsors/cloudx.png" },
                    { name: "Coming Soon3", image: "/sponsors/bytehub.png" },
                    { name: "Coming Soon4", image: "/sponsors/nexaui.png" },
                  ]}
                />
              </div>
            </section>

            <section id="faq"><FAQs /></section>
            <section id="contact"><ContactUsSection /></section>
          </div>
        </div>
        <MetallixFooter />
      </SmoothScrollWrapper>
    </div>
  );
}