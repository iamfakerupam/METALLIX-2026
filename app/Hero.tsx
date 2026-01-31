'use client'

import { useRef } from "react"
import { RotatingText, RotatingTextContainer } from "@/components/animate-ui/primitives/texts/rotating"
import { ShimmeringText } from "@/components/animate-ui/primitives/texts/shimmering"
import {
  ContainerAnimated,
  ContainerInset,
  ContainerScroll,
  ContainerSticky,
  HeroButton,
  HeroVideo,
} from "@/components/animated-video-on-scroll"
import { ImageTrail } from "@/components/ui/image-trail"

export const HeroVideoDemo = () => {
  const imageTrailRef = useRef<HTMLDivElement>(null!)

  // Images for the trail effect
  const images = [
    "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
    "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
  ].map(url => `${url}?auto=format&fit=crop&w=300&q=80`)

  return (
    <section>
      <ContainerScroll className="h-[350vh]">
        <ContainerSticky
          ref={imageTrailRef}
          style={{
            background:
              "radial-gradient(40% 40% at 50% 20%, #1a1a1a 0%, #0f0f0f 35%, #050505 70%, #000000 100%)",
          }}
          className="px-6 py-10 text-slate-100 overflow-hidden"
        >
          {/* Video layer - behind everything */}
          <ContainerInset 
            className="h-full w-full absolute inset-0"
            insetYRange={[45, 0]}
            insetXRange={[45, 0]}
          >
            <HeroVideo
              src="/explore.mp4"
              className="w-full h-full object-cover"
            />
          </ContainerInset>

          {/* Image Trail Layer - above video, below text */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <ImageTrail containerRef={imageTrailRef}>
              {images.map((url, index) => (
                <div
                  key={index}
                  className="flex relative overflow-hidden w-24 h-24 rounded-lg pointer-events-auto"
                >
                  <img
                    src={url}
                    alt={`Trail image ${index + 1}`}
                    className="object-cover absolute inset-0 hover:scale-110 transition-transform"
                  />
                </div>
              ))}
            </ImageTrail>
          </div>

          {/* Content layer - stays fixed on top */}
          <div className="relative z-20 flex flex-col items-center h-full">
            <div className="space-y-4 text-center pt-10">
              <h1 className="text-5xl font-extrabold tracking-tighter md:text-6xl">
                <ShimmeringText text="METALLIX 2026" />
              </h1>

              <div className="mx-auto max-w-[60ch] text-xl font-bold flex justify-center items-center gap-2">
                <span>CELEBRATING 16 YEARS OF METALLURGICAL</span>

                {/* Fixed-width wrapper to prevent movement */}
                <span className="inline-block min-w-[170px] text-left">
                  <RotatingTextContainer
                    text={[
                      "🚀 EXCELLENCE",
                      "💡 INNOVATION",
                      "🛡️ INTEGRITY",
                      "⚙️ INGENUITY",
                      "🏗️ ENGINEERING",
                      "🤝 COLLABORATION",
                      "📊 ANALYTICS"
                    ]}
                  >
                    <RotatingText />
                  </RotatingTextContainer>
                </span>
              </div>
            </div>
          </div>

          {/* Button - fixed at bottom center with significant gap */}
          <div className="relative z-20 absolute bottom-16 md:bottom-20 left-0 right-0 flex justify-center">
            <HeroButton className="bg-white text-black hover:bg-gray-200 mt-120 ">
              Register Now
            </HeroButton>
          </div>
        </ContainerSticky>
      </ContainerScroll>
    </section>
  )
}