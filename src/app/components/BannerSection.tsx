import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

const backgroundImage =
  "https://www.oderco.com.br/media/descricoes/Imagens/293948/2.png";

const youtubeEmbed =
  "https://www.youtube.com/embed/g-QIHcPg1Ko?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=g-QIHcPg1Ko";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress;

export function BannerSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState(false);
  const [touchStartY, setTouchStartY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    const updateActiveState = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const navHeight = 72;
      const active = rect.top <= navHeight + 16 && rect.bottom >= window.innerHeight * 0.55;

      setIsActive(active);
    };

    updateActiveState();
    window.addEventListener("scroll", updateActiveState, { passive: true });
    window.addEventListener("resize", updateActiveState);

    return () => {
      window.removeEventListener("scroll", updateActiveState);
      window.removeEventListener("resize", updateActiveState);
    };
  }, []);

  useEffect(() => {
    if (isActive && !mediaFullyExpanded && scrollProgress > 0) {
      const previousBodyOverflow = document.body.style.overflow;
      const previousHtmlOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousBodyOverflow;
        document.documentElement.style.overflow = previousHtmlOverflow;
      };
    }

    return;
  }, [isActive, mediaFullyExpanded, scrollProgress]);

  useEffect(() => {
    if (!isActive || mediaFullyExpanded || scrollProgress <= 0) return;

    const section = sectionRef.current;
    if (!section) return;

    const snapTop = section.offsetTop;
    if (Math.abs(window.scrollY - snapTop) > 2) {
      window.scrollTo({ top: snapTop, behavior: "auto" });
    }
  }, [isActive, mediaFullyExpanded, scrollProgress]);

  useEffect(() => {
    const updateProgress = (delta: number) => {
      const next = clamp(scrollProgress + delta, 0, 1);
      setScrollProgress(next);
      setMediaFullyExpanded(next >= 1);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isActive) return;

      const shouldIntercept = e.deltaY > 0 || scrollProgress > 0;
      if (!shouldIntercept) return;

      if (!mediaFullyExpanded || (e.deltaY < 0 && scrollProgress > 0)) {
        e.preventDefault();
        updateProgress(e.deltaY * 0.00115);
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (!isActive) return;
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isActive || touchStartY === 0) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      const shouldIntercept = deltaY > 0 || scrollProgress > 0;
      if (!shouldIntercept) {
        setTouchStartY(touchY);
        return;
      }

      if (!mediaFullyExpanded || (deltaY < 0 && scrollProgress > 0)) {
        e.preventDefault();
        const factor = deltaY < 0 ? 0.007 : 0.0045;
        updateProgress(deltaY * factor);
      }

      setTouchStartY(touchY);
    };

    const handleTouchEnd = () => {
      setTouchStartY(0);
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: false });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isActive, mediaFullyExpanded, scrollProgress, touchStartY]);

  const mediaWidth = `${lerp(isMobile ? 76 : 26, 100, scrollProgress)}vw`;
  const mediaHeight = `${lerp(isMobile ? 54 : 58, 100, scrollProgress)}dvh`;
  const mediaRadius = `${lerp(28, 0, scrollProgress)}px`;
  const textTranslateX = scrollProgress * (isMobile ? 20 : 14);
  const backgroundOpacity = 1 - scrollProgress * 0.5;
  const videoOverlayOpacity = Math.max(0.08, 0.38 - scrollProgress * 0.24);
  const iframeCoverWidth = isMobile ? "178vh" : "177.78vh";
  const iframeCoverHeight = isMobile ? "100dvh" : "100dvh";

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#0f1011]"
    >
      <motion.div
        className="absolute inset-0 z-0"
        animate={{ opacity: backgroundOpacity }}
        transition={{ duration: 0.15 }}
      >
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${backgroundImage}")` }}
        />
        <div className="absolute inset-0 bg-black/28" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,48,48,0.14),transparent_42%)]" />
      </motion.div>

      <div className="relative z-10 flex h-[100dvh] w-full items-center justify-center">
        <div
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: mediaWidth,
            height: mediaHeight,
            maxWidth: "100vw",
            maxHeight: "100dvh",
            borderRadius: mediaRadius,
            boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
          }}
        >
          <div
            className="relative h-full w-full overflow-hidden bg-transparent"
            style={{ borderRadius: mediaRadius }}
          >
            <iframe
              width="177.78%"
              height="100%"
              src={youtubeEmbed}
              className="pointer-events-none absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
              style={{
                borderRadius: mediaRadius,
                width: iframeCoverWidth,
                height: iframeCoverHeight,
              }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Setup gamer PCYES"
            />
            <motion.div
              className="absolute inset-0 bg-black"
              style={{ borderRadius: mediaRadius }}
              animate={{ opacity: videoOverlayOpacity }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </div>

        <div className="relative z-20 flex w-full flex-col items-center justify-center gap-3 text-center">
          <motion.p
            className="text-primary"
            style={{
              transform: `translateX(-${textTranslateX}vw)`,
              fontFamily: "var(--font-family-inter)",
              fontSize: "12px",
              fontWeight: "var(--font-weight-bold)",
              letterSpacing: "0.34em",
              textShadow: "0 8px 28px rgba(0,0,0,0.28)",
            }}
          >
            MONTE SEU SETUP
          </motion.p>
          <motion.h2
            className="text-white"
            style={{
              transform: `translateX(-${textTranslateX}vw)`,
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(52px, 8vw, 116px)",
              fontWeight: 700,
              lineHeight: 0.9,
              textShadow: "0 14px 48px rgba(0,0,0,0.34)",
            }}
          >
            SETUP
          </motion.h2>
          <motion.h2
            className="text-white"
            style={{
              transform: `translateX(${textTranslateX}vw)`,
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(52px, 8vw, 116px)",
              fontWeight: 700,
              lineHeight: 0.9,
              textShadow: "0 14px 48px rgba(0,0,0,0.34)",
            }}
          >
            GAMER
          </motion.h2>
        </div>

      </div>
    </section>
  );
}
