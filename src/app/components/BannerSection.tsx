import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";

const backgroundImage =
  "https://www.oderco.com.br/media/descricoes/Imagens/293948/2.png";

const youtubeEmbed =
  "https://www.youtube.com/embed/g-QIHcPg1Ko?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=g-QIHcPg1Ko";

export function BannerSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // All mutable values via refs — zero stale-closure risk, no re-registration on state change
  const progressRef = useRef(0);
  const expandedRef = useRef(false);
  const lockedRef = useRef(false); // true = body overflow hidden, user cannot scroll past section
  const touchStartY = useRef(0);

  // React state only for triggering re-renders
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showCta, setShowCta] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [viewport, setViewport] = useState({ w: 1920, h: 900 });

  // Viewport size tracking
  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < 768);
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Scroll-bound animation engine — registered once, reads refs directly
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Lock body scroll so the user CANNOT scroll past this section
    const lockScroll = () => {
      if (lockedRef.current) return;
      lockedRef.current = true;
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    };

    // Unlock body scroll so the user CAN continue past this section
    const unlockScroll = () => {
      if (!lockedRef.current) return;
      lockedRef.current = false;
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };

    // Capture zone: section is visible and its top is near the viewport top
    const inCaptureZone = () => {
      const r = section.getBoundingClientRect();
      return r.top <= 2 && r.bottom > window.innerHeight * 0.4;
    };

    // Normalize deltaY across pixel / line / page scroll modes
    const normWheel = (e: WheelEvent) => {
      if (e.deltaMode === 1) return e.deltaY * 20;
      if (e.deltaMode === 2) return e.deltaY * window.innerHeight;
      return e.deltaY;
    };

    // Apply a pixel-space delta, update refs and state.
    // Returns true if the event was captured (should preventDefault).
    const advance = (pixelDelta: number): boolean => {
      const prog = progressRef.current;
      const expanded = expandedRef.current;

      // Scrolling UP from the very start → let page scroll normally
      if (prog <= 0 && pixelDelta < 0) {
        unlockScroll();
        return false;
      }

      // Scrolling DOWN when already fully expanded → release user to continue
      if (expanded && pixelDelta > 0) {
        unlockScroll();
        return false;
      }

      // While animating (0 < progress < 1), lock scroll
      lockScroll();

      const next = Math.min(Math.max(prog + pixelDelta * 0.0009, 0), 1);
      progressRef.current = next;
      expandedRef.current = next >= 1;

      setScrollProgress(next);
      if (next >= 0.85) setShowCta(true);
      else if (next < 0.75) setShowCta(false);

      return true;
    };

    const handleWheel = (e: WheelEvent) => {
      // Once unlocked (user scrolled past section), don't capture anymore
      if (!lockedRef.current && !inCaptureZone()) return;
      const normalized = normWheel(e);
      if (advance(normalized)) {
        e.preventDefault();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!lockedRef.current && !inCaptureZone()) return;
      const touchPx = touchStartY.current - e.touches[0].clientY;
      touchStartY.current = e.touches[0].clientY;
      // Scale touch pixels to equivalent wheel-pixel units (~5.5× feels natural)
      if (advance(touchPx * 5.5)) {
        e.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      // Always unlock on unmount
      unlockScroll();
    };
  }, []); // ← intentionally empty: all mutable values live in refs

  // Visual values derived from progress
  const startW = 300;
  const startH = isMobile ? 360 : 420;
  // Interpolate to exact viewport dimensions so expansion is total at progress=1
  const mediaWidth = startW + scrollProgress * (viewport.w - startW);
  const mediaHeight = startH + scrollProgress * (viewport.h - startH);
  const textShift = scrollProgress * (isMobile ? 180 : 150);
  const bgOpacity = 1 - scrollProgress * 0.55;
  const overlayOpacity = 0.38 - scrollProgress * 0.3;
  const headlineOpacity =
    scrollProgress < 0.65 ? 1 : Math.max(0, 1 - (scrollProgress - 0.65) / 0.2);
  const borderRadius = Math.max(0, 28 - scrollProgress * 28);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] bg-[#0f1011] overflow-x-hidden"
    >
      <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
        {/* Background image — fades out as video expands */}
        <motion.div
          className="absolute inset-0 z-0 h-full"
          animate={{ opacity: bgOpacity }}
          transition={{ duration: 0.1 }}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
          />
          <div className="absolute inset-0 bg-black/28" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,48,48,0.14),transparent_42%)]" />
        </motion.div>

        {/* Centered layout */}
        <div className="flex flex-col items-center justify-center w-full min-h-[100dvh] relative z-10">
          {/* Video container — grows from small card to full viewport */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
              borderRadius: `${borderRadius}px`,
              overflow: "hidden",
              boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
            }}
          >
            <div className="relative w-full h-full pointer-events-none">
              <iframe
                src={youtubeEmbed}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: "177.78vh",
                  height: "100vh",
                  minWidth: "100%",
                  minHeight: "100%",
                }}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Setup gamer PCYES"
              />
              <motion.div
                className="absolute inset-0 bg-black pointer-events-none"
                animate={{ opacity: overlayOpacity }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>

          {/* Headline — slides apart and fades as video takes over */}
          <div
            className="flex flex-col items-center text-center gap-3 relative z-10 w-full"
            style={{ opacity: headlineOpacity }}
          >
            <p
              className="text-primary"
              style={{
                transform: `translateX(-${textShift * 0.1}vw)`,
                fontFamily: "var(--font-family-inter)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.34em",
                textShadow: "0 8px 28px rgba(0,0,0,0.28)",
              }}
            >
              MONTE SEU SETUP
            </p>
            <h2
              className="text-white"
              style={{
                transform: `translateX(-${textShift}px)`,
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(52px, 8vw, 116px)",
                fontWeight: 700,
                lineHeight: 0.9,
                textShadow: "0 14px 48px rgba(0,0,0,0.34)",
              }}
            >
              SETUP
            </h2>
            <h2
              className="text-white"
              style={{
                transform: `translateX(${textShift}px)`,
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(52px, 8vw, 116px)",
                fontWeight: 700,
                lineHeight: 0.9,
                textShadow: "0 14px 48px rgba(0,0,0,0.34)",
              }}
            >
              GAMER
            </h2>
          </div>
        </div>

        {/* CTA — appears when fully expanded */}
        <motion.div
          className="absolute bottom-[72px] left-1/2 z-30 -translate-x-1/2"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: showCta ? 1 : 0, y: showCta ? 0 : 28 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/monte-seu-pc"
            className="inline-flex items-center justify-center rounded-full border border-white/18 bg-white px-8 py-3.5 text-black shadow-[0_20px_70px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-primary hover:bg-primary hover:text-white"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "13px",
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            Monte seu setup
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
