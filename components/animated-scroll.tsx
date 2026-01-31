'use client'
import React, { useState, useEffect, useRef } from 'react';

const pages = [
  {
    leftBgImage: 'https://images.unsplash.com/photo-1748968218568-a5eac621e65c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1M3x8fGVufDB8fHx8fA%3D%3D',
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: 'Welcome Aboard!',
      description: 'Hold on to your mouse, things are about to get wild!',
    },
  },
  {
    leftBgImage: null,
    rightBgImage: 'https://images.unsplash.com/photo-1749315099905-9cf6cabd9126?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0Nnx8fGVufDB8fHx8fA%3D%3D',
    leftContent: {
      heading: 'Page 2',
      description: 'Spoiler alert: its still empty. Keep that scroll finger limber!',
    },
    rightContent: null,
  },
  {
    leftBgImage: 'https://images.unsplash.com/photo-1747893541442-a139096ea39c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMzZ8fHxlbnwwfHx8fHw%3D',
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: 'Page 3',
      description: 'Plot twist: Youve reached the midpoint. Bravo!',
    },
  },
  {
    leftBgImage: null,
    rightBgImage: 'https://images.unsplash.com/photo-1748164521179-ae3b61c6dd90?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMjR8fHxlbnwwfHx8fHw%3D',
    leftContent: {
      heading: 'Page 4',
      description: 'One more scroll, I promise—almost there!',
    },
    rightContent: null,
  },
  {
    leftBgImage: 'https://images.unsplash.com/photo-1742626157052-f5a373a727ef?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyMnx8fGVufDB8fHx8fA%3D%3D',
    rightBgImage: null,
    leftContent: null,
    rightContent: {
      heading: 'Epic Finale!',
      description: (
        <>
         :)
        </>
      ),
    },
  },
];

export default function ScrollAdventure() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isActive, setIsActive] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [allowScrollUp, setAllowScrollUp] = useState(false);
  const numOfPages = pages.length;
  const animTime = 1000;
  const scrolling = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigateUp = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1);
      setAllowScrollUp(false);
    } else if (currentPage === 1) {
      // On first page, allow scroll up to previous component
      setAllowScrollUp(true);
      setIsActive(false);
    }
  };

  const navigateDown = () => {
    if (currentPage < numOfPages) {
      setCurrentPage(p => p + 1);
      setAllowScrollUp(false);
    } else if (currentPage === numOfPages) {
      // Animation complete, mark it and allow normal scroll
      setAnimationComplete(true);
    }
  };

  const handleWheel = (e: WheelEvent) => {
    if (!isActive) return;
    
    // Allow scrolling up on first page
    if (currentPage === 1 && e.deltaY < 0) {
      setAllowScrollUp(true);
      setIsActive(false);
      return; // Don't prevent default, allow normal scroll
    }

    // Allow normal scroll after completion
    if (animationComplete) return;

    e.preventDefault();
    e.stopPropagation();
    
    if (scrolling.current) return;
    
    scrolling.current = true;
    
    if (e.deltaY > 0) {
      navigateDown();
    } else {
      navigateUp();
    }
    
    setTimeout(() => {
      scrolling.current = false;
    }, animTime);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isActive || animationComplete) return;
    
    // Allow scrolling up on first page
    if (currentPage === 1 && (e.key === 'ArrowUp' || e.key === 'PageUp')) {
      setAllowScrollUp(true);
      setIsActive(false);
      return; // Don't prevent default, allow normal scroll
    }
    
    if (scrolling.current) return;
    
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault();
      scrolling.current = true;
      
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        navigateUp();
      } else {
        navigateDown();
      }
      
      setTimeout(() => {
        scrolling.current = false;
      }, animTime);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Component is fully visible (100% in viewport)
          if (entry.intersectionRatio >= 0.99) {
            if (!allowScrollUp) { // Don't reactivate if user scrolled up
              setIsActive(true);
              setAnimationComplete(false);
              if (!isActive) {
                setCurrentPage(1);
              }
            }
          } else if (entry.intersectionRatio < 0.5) {
            // Component is leaving viewport
            if (!isActive) {
              setAllowScrollUp(false);
            }
          }
        });
      },
      {
        threshold: [0, 0.5, 0.99, 1],
        rootMargin: '0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, [allowScrollUp, isActive]);

  useEffect(() => {
    if (!isActive || animationComplete) return;

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, currentPage, animationComplete]);

  return (
    <div 
  ref={containerRef}
  className="relative overflow-hidden h-full bg-black snap-start"  // Changed h-screen to h-full
  style={{ scrollSnapAlign: 'start' }}
>
      {/* Progress indicator */}
      {isActive && !animationComplete && (
        <>
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
            {currentPage} / {numOfPages}
          </div>

          {/* Page indicator dots */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex gap-2">
            {Array.from({ length: numOfPages }).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentPage === i + 1 ? 'bg-white w-8' : 'bg-white/50 w-2'
                }`}
              />
            ))}
          </div>

          {/* Scroll hint */}
          {currentPage === 1 && (
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-50 text-white/70 text-sm animate-bounce">
              Scroll to continue
            </div>
          )}
        </>
      )}

      {/* Completion message */}
      {animationComplete && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 text-white text-center">
          <p className="text-2xl mb-2">✨ Animation Complete! ✨</p>
          <p className="text-lg text-white/70 animate-bounce">Scroll down to continue</p>
        </div>
      )}

      {pages.map((page, i) => {
        const idx = i + 1;
        const isPageActive = currentPage === idx && isActive && !animationComplete;
        const upOff = 'translateY(-100%)';
        const downOff = 'translateY(100%)';
        const leftTrans = isPageActive ? 'translateY(0)' : downOff;
        const rightTrans = isPageActive ? 'translateY(0)' : upOff;

        return (
          <div key={idx} className="absolute inset-0">
            {/* Left Half */}
            <div
              className="absolute top-0 left-0 w-1/2 h-full transition-transform duration-[1000ms] ease-in-out"
              style={{ transform: leftTrans }}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: page.leftBgImage ? `url(${page.leftBgImage})` : undefined,
                  backgroundColor: page.leftBgImage ? undefined : '#1a1a1a'
                }}
              >
                <div className="flex flex-col items-center justify-center h-full text-white p-8 bg-black/40">
                  {page.leftContent && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-bold uppercase mb-4 text-center">
                        {page.leftContent.heading}
                      </h2>
                      <p className="text-xl md:text-2xl text-center max-w-md">
                        {page.leftContent.description}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Right Half */}
            <div
              className="absolute top-0 left-1/2 w-1/2 h-full transition-transform duration-[1000ms] ease-in-out"
              style={{ transform: rightTrans }}
            >
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ 
                  backgroundImage: page.rightBgImage ? `url(${page.rightBgImage})` : undefined,
                  backgroundColor: page.rightBgImage ? undefined : '#1a1a1a'
                }}
              >
                <div className="flex flex-col items-center justify-center h-full text-white p-8 bg-black/40">
                  {page.rightContent && (
                    <>
                      <h2 className="text-4xl md:text-6xl font-bold uppercase mb-4 text-center">
                        {page.rightContent.heading}
                      </h2>
                      {typeof page.rightContent.description === 'string' ? (
                        <p className="text-xl md:text-2xl text-center max-w-md">
                          {page.rightContent.description}
                        </p>
                      ) : (
                        <div className="text-xl md:text-2xl text-center max-w-md">
                          {page.rightContent.description}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}