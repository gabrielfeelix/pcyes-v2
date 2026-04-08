import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";

const backgroundImage =
  "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

const youtubeEmbed =
  "https://www.youtube.com/embed/g-QIHcPg1Ko?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=g-QIHcPg1Ko";

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function BannerSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
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
    if (isActive && !mediaFullyExpanded) {
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
  }, [isActive, mediaFullyExpanded]);

  useEffect(() => {
    if (!isActive || mediaFullyExpanded) return;

    const section = sectionRef.current;
    if (!section) return;

    const snapTop = section.offsetTop;
    if (Math.abs(window.scrollY - snapTop) > 2) {
      window.scrollTo({ top: snapTop, behavior: "auto" });
    }
  }, [isActive, mediaFullyExpanded]);

  useEffect(() => {
    const updateProgress = (delta: number) => {
      const next = clamp(scrollProgress + delta, 0, 1);
      setScrollProgress(next);
      setMediaFullyExpanded(next >= 1);
      setShowContent(next >= 0.62);
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isActive) return;

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

  const mediaWidth = 300 + scrollProgress * (isMobile ? 660 : 1220);
  const mediaHeight = 420 + scrollProgress * (isMobile ? 220 : 390);
  const textTranslateX = scrollProgress * (isMobile ? 20 : 14);
  const backgroundOpacity = 1 - scrollProgress * 0.5;
  const videoOverlayOpacity = Math.max(0.08, 0.38 - scrollProgress * 0.24);

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

      <div className="relative z-10 flex h-[100dvh] w-full items-center justify-center px-4">
        <div
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-[28px]"
          style={{
            width: `${mediaWidth}px`,
            height: `${mediaHeight}px`,
            maxWidth: "95vw",
            maxHeight: "86vh",
            boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
          }}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-black">
            <iframe
              width="100%"
              height="100%"
              src={youtubeEmbed}
              className="pointer-events-none h-full w-full rounded-[28px]"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Setup gamer PCYES"
            />
            <motion.div
              className="absolute inset-0 rounded-[28px] bg-black"
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

        <motion.div
          className="absolute inset-x-0 bottom-0 z-30 px-5 pb-8 md:px-8 md:pb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0, y: showContent ? 0 : 24 }}
          transition={{ duration: 0.45 }}
        >
          <div className="mx-auto flex max-w-[1300px] justify-start">
            <div className="max-w-[520px] rounded-[30px] border border-white/10 bg-black/45 p-6 backdrop-blur-xl md:p-8">
              <p
                className="mb-3 text-primary"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "11px",
                  fontWeight: "var(--font-weight-bold)",
                  letterSpacing: "0.22em",
                }}
              >
                SETUP GAMER
              </p>
              <h3
                className="mb-4 text-white"
                style={{
                  fontFamily: "var(--font-family-figtree)",
                  fontSize: "clamp(28px, 4vw, 44px)",
                  fontWeight: 600,
                  lineHeight: 1.02,
                }}
              >
                Performance, iluminação e presença em uma só experiência.
              </h3>
              <p
                className="mb-7 text-white/62"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "14px",
                  lineHeight: 1.7,
                }}
              >
                De placas de vídeo a periféricos, monte um setup completo com atmosfera gamer e produtos que conversam entre si.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/produtos"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-black transition-all duration-300 hover:bg-primary hover:text-white"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Explorar produtos
                </Link>
                <Link
                  to="/produtos"
                  className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3 text-white/86 transition-all duration-300 hover:border-white/25 hover:bg-white/10"
                  style={{
                    fontFamily: "var(--font-family-inter)",
                    fontSize: "13px",
                    fontWeight: "var(--font-weight-medium)",
                  }}
                >
                  Montar meu setup
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
