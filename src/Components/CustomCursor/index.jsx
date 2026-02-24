import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

// Simple mobile detection hook (replaces the Next.js version)
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export default function CustomCursor() {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const dotsRef = useRef(null);
  const touchIndicatorRef = useRef(null);
  const touchRippleRef = useRef(null);
  const isMobile = useIsMobile(768);
  const [cursorText, setCursorText] = useState('');

  useEffect(() => {
    const outerEl = outerRef.current;
    const innerEl = innerRef.current;
    const dotsEl = dotsRef.current;
    const touchIndicatorEl = touchIndicatorRef.current;
    const touchRippleEl = touchRippleRef.current;
    
    if (!outerEl || !innerEl) return;

    if (isMobile) {
      // ═══════════════ MOBILE TOUCH EXPERIENCE ═══════════════
      let touchX = 0;
      let touchY = 0;

      const handleTouchStart = (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          touchX = touch.clientX;
          touchY = touch.clientY;

          if (touchIndicatorEl) {
            gsap.to(touchIndicatorEl, {
              x: touchX,
              y: touchY,
              xPercent: -50,
              yPercent: -50,
              opacity: 1,
              scale: 1,
              duration: 0.15,
              ease: 'power3.out',
            });
          }

          if (touchRippleEl) {
            gsap.set(touchRippleEl, {
              x: touchX,
              y: touchY,
              xPercent: -50,
              yPercent: -50,
              opacity: 0.8,
              scale: 0.3,
            });
            
            gsap.to(touchRippleEl, {
              scale: 1.5,
              opacity: 0,
              duration: 0.8,
              ease: 'power2.out',
            });

            gsap.fromTo(touchRippleEl, 
              { scale: 0.5, opacity: 0.5 },
              { 
                scale: 2, 
                opacity: 0, 
                duration: 1,
                delay: 0.1,
                ease: 'power2.out',
              }
            );
          }
        }
      };

      const handleTouchMove = (e) => {
        if (e.touches.length > 0) {
          const touch = e.touches[0];
          touchX = touch.clientX;
          touchY = touch.clientY;

          if (touchIndicatorEl) {
            gsap.to(touchIndicatorEl, {
              x: touchX,
              y: touchY,
              xPercent: -50,
              yPercent: -50,
              duration: 0.05,
              ease: 'power3.out',
              overwrite: true,
            });
          }
        }
      };

      const handleTouchEnd = () => {
        if (touchIndicatorEl) {
          gsap.to(touchIndicatorEl, {
            opacity: 0,
            scale: 0.3,
            duration: 0.4,
            ease: 'power3.in',
          });
        }
      };

      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });

      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };
    } else {
      // ═══════════════ DESKTOP PREMIUM CURSOR ═══════════════
      let mouseX = 0;
      let mouseY = 0;
      let currentScale = 1;

      const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        gsap.to([outerEl, innerEl, dotsEl], {
          opacity: 1,
          duration: 0.2,
          overwrite: true,
        });

        [outerEl, innerEl, dotsEl].forEach(el => {
          if (el) {
            el.style.opacity = '1';
            el.style.display = 'block';
            el.style.visibility = 'visible';
          }
        });

        const magneticElements = document.querySelectorAll('[data-magnetic]');
        let isMagnetic = false;

        magneticElements.forEach((el) => {
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt(
            Math.pow(mouseX - centerX, 2) + Math.pow(mouseY - centerY, 2)
          );

          if (distance < 120) {
            isMagnetic = true;
            const pullX = (centerX - mouseX) * 0.3;
            const pullY = (centerY - mouseY) * 0.3;

            gsap.to(innerEl, {
              x: mouseX + pullX,
              y: mouseY + pullY,
              xPercent: -50,
              yPercent: -50,
              duration: 0.3,
              ease: 'power3.out',
            });

            gsap.to(outerEl, {
              x: mouseX + pullX * 0.5,
              y: mouseY + pullY * 0.5,
              xPercent: -50,
              yPercent: -50,
              duration: 0.5,
              ease: 'power3.out',
            });
          }
        });

        if (!isMagnetic) {
          gsap.to(innerEl, {
            x: mouseX,
            y: mouseY,
            xPercent: -50,
            yPercent: -50,
            duration: 0.1,
            ease: 'power3.out',
            overwrite: true,
          });

          gsap.to(outerEl, {
            x: mouseX,
            y: mouseY,
            xPercent: -50,
            yPercent: -50,
            duration: 0.4,
            ease: 'power3.out',
            overwrite: true,
          });
        }

        if (dotsEl) {
          gsap.to(dotsEl, {
            x: mouseX,
            y: mouseY,
            xPercent: -50,
            yPercent: -50,
            duration: 0.8,
            ease: 'power3.out',
            overwrite: true,
          });
        }
      };

      const handleMouseDown = () => {
        currentScale = 0.75;
        gsap.to(outerEl, {
          scale: 0.75,
          borderWidth: '3px',
          duration: 0.2,
          ease: 'power3.out',
          overwrite: 'auto',
        });
        gsap.to(innerEl, {
          scale: 0.5,
          duration: 0.2,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      };

      const handleMouseUp = () => {
        currentScale = 1;
        gsap.to(outerEl, {
          scale: 1,
          borderWidth: '2px',
          duration: 0.3,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto',
        });
        gsap.to(innerEl, {
          scale: 1,
          duration: 0.3,
          ease: 'elastic.out(1, 0.3)',
          overwrite: 'auto',
        });
      };

      const handleOver = (e) => {
        const target = e.target;
        if (!target) return;

        if (target.closest('a, button')) {
          gsap.to(outerEl, {
            scale: 2,
            borderColor: '#982826',
            backgroundColor: 'rgba(152, 66, 38, 0.1)',
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          });
          gsap.to(innerEl, {
            scale: 0,
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }

        if (target.closest('input, textarea')) {
          gsap.to(outerEl, {
            scale: 1.5,
            borderColor: '#982626',
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }

        if (target.closest('img')) {
          gsap.to(outerEl, {
            scale: 2.5,
            borderWidth: '1px',
            borderColor: '#982626',
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          });
          gsap.to(innerEl, {
            scale: 1.5,
            backgroundColor: 'rgba(152, 38, 38, 0.5)',
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }

        const textAttr = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');
        if (textAttr) {
          setCursorText(textAttr);
          gsap.to(outerEl, {
            scale: 3,
            backgroundColor: 'rgba(152, 38, 38, 0.95)',
            borderColor: '#982626',
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          });
          gsap.to(innerEl, {
            scale: 0,
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      };

      const handleOut = (e) => {
        const target = e.target ;
        if (!target) return;

        setCursorText('');

        if (target.closest('a, button, input, textarea, img, [data-cursor-text]')) {
          gsap.to(outerEl, {
            scale: currentScale,
            borderColor: 'rgba(152, 38, 38, 0.5)',
            backgroundColor: 'transparent',
            borderWidth: '2px',
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          });
          gsap.to(innerEl, {
            scale: currentScale,
            backgroundColor: '#982626',
            duration: 0.3,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      };

      const handleMouseLeave = () => {
        gsap.to([outerEl, innerEl, dotsEl], {
          opacity: 0,
          duration: 0.3,
        });
      };

      const handleMouseEnter = () => {
        gsap.to([outerEl, innerEl, dotsEl], {
          opacity: 1,
          duration: 0.3,
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseover', handleOver);
      document.addEventListener('mouseout', handleOut);
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleMouseEnter);

      if (typeof window !== 'undefined') {
        gsap.set([outerEl, innerEl, dotsEl], {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2,
          xPercent: -50,
          yPercent: -50,
          opacity: 1,
        });
      }

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseover', handleOver);
        document.removeEventListener('mouseout', handleOut);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseenter', handleMouseEnter);
      };
    }
  }, [isMobile]);

  return (
    <>
      {/* Desktop Premium Cursor */}
      <div 
        ref={outerRef} 
        className="cursor-outer fixed flex items-center justify-center"
      >
        {cursorText && (
          <span className="cursor-text text-white text-xs font-semibold uppercase tracking-wider">
            {cursorText}
          </span>
        )}
      </div>
      <div ref={innerRef} className="cursor-inner fixed block" />
      <div ref={dotsRef} className="cursor-dots fixed block" />

      {/* Mobile Touch Indicator */}
      <div ref={touchIndicatorRef} className="touch-indicator" />
      <div ref={touchRippleRef} className="touch-ripple" />

      <style>{`
        /* Hide default cursor only on body */
        body {
          cursor: none;
        }

        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
          .cursor-outer, .cursor-inner, .cursor-dots {
            display: none !important;
          }
          .touch-indicator, .touch-ripple {
            display: block !important;
          }
        }

        /* Desktop Cursor Styles */
        .cursor-outer {
          position: fixed;
          top: 0;
          left: 0;
          width: 40px;
          height: 40px;
          border: 2px solid rgba(152, 38, 38, 0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          transition: border-color 0.3s ease;
          backdrop-filter: blur(2px);
        }

        .cursor-inner {
          position: fixed;
          top: 0;
          left: 0;
          width: 8px;
          height: 8px;
          background: #982c26;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          box-shadow: 0 0 10px rgba(152, 59, 38, 0.5);
        }

        .cursor-dots {
          position: fixed;
          top: 0;
          left: 0;
          width: 4px;
          height: 4px;
          pointer-events: none;
          z-index: 99998;
        }

        .cursor-dots::before,
        .cursor-dots::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: rgba(152, 80, 38, 0.3);
          border-radius: 50%;
        }

        .cursor-dots::before {
          top: -15px;
          left: -15px;
        }

        .cursor-dots::after {
          bottom: -15px;
          right: -15px;
        }

        .cursor-text {
          white-space: nowrap;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        /* Mobile Touch Styles */
        .touch-indicator {
          position: fixed;
          top: 0;
          left: 0;
          width: 60px;
          height: 60px;
          border: 3px solid rgba(152, 38, 38, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          opacity: 0;
          background: radial-gradient(circle, rgba(132, 152, 38, 0.2) 0%, transparent 70%);
          box-shadow: 
            0 0 20px rgba(152, 103, 38, 0.4),
            inset 0 0 20px rgba(132, 152, 38, 0.2);
        }

        .touch-ripple {
          position: fixed;
          top: 0;
          left: 0;
          width: 80px;
          height: 80px;
          border: 2px solid rgba(152, 78, 38, 0.6);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          opacity: 0;
        }

        /* Smooth transitions */
        @media (prefers-reduced-motion: reduce) {
          .cursor-outer,
          .cursor-inner,
          .cursor-dots,
          .touch-indicator,
          .touch-ripple {
            transition: none !important;
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}