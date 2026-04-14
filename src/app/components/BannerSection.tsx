import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";

const backgroundImage =
  "https://www.oderco.com.br/media/descricoes/Imagens/293948/2.png";

const youtubeEmbed =
  "https://www.youtube.com/embed/g-QIHcPg1Ko?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=g-QIHcPg1Ko";

export function BannerSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fullyExpanded, setFullyExpanded] = useState(false);
  const [showCta, setShowCta] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const getSectionState = () => {
      const section = sectionRef.current;
      if (!section) return null;

      const rect = section.getBoundingClientRect();
      return {
        section,
        rect,
        shouldCapture: rect.top <= 0 && rect.bottom > window.innerHeight * 0.45,
        isPinnedTop: Math.abs(rect.top) <= 6,
      };
    };

    const pinSection = (section: HTMLElement) => {
      window.scrollTo({ top: section.offsetTop, behavior: "auto" });
    };

    const handleWheel = (e: WheelEvent) => {
      const sectionState = getSectionState();
      if (!sectionState?.shouldCapture) return;

      if (fullyExpanded && e.deltaY < 0 && sectionState.isPinnedTop) {
        setFullyExpanded(false);
        setShowCta(false);
        pinSection(sectionState.section);
        e.preventDefault();
        return;
      }
      if (fullyExpanded) return;
      if (scrollProgress <= 0 && e.deltaY < 0) return;

      e.preventDefault();
      pinSection(sectionState.section);
      const delta = e.deltaY * 0.0009;
      setScrollProgress((prev) => {
        const next = Math.min(Math.max(prev + delta, 0), 1);
        if (next >= 1) { setFullyExpanded(true); setShowCta(true); }
        else if (next < 0.75) setShowCta(false);
        return next;
      });
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const sectionState = getSectionState();
      if (!sectionState?.shouldCapture) return;

      const deltaY = touchStartY.current - e.touches[0].clientY;
      if (fullyExpanded && deltaY < -20 && sectionState.isPinnedTop) {
        setFullyExpanded(false);
        setShowCta(false);
        pinSection(sectionState.section);
        e.preventDefault();
        touchStartY.current = e.touches[0].clientY;
        return;
      }
      if (fullyExpanded) return;
      if (scrollProgress <= 0 && deltaY < 0) return;

      e.preventDefault();
      pinSection(sectionState.section);
      const factor = deltaY < 0 ? 0.008 : 0.005;
      const delta = deltaY * factor;
      setScrollProgress((prev) => {
        const next = Math.min(Math.max(prev + delta, 0), 1);
        if (next >= 1) { setFullyExpanded(true); setShowCta(true); }
        else if (next < 0.75) setShowCta(false);
        return next;
      });
      touchStartY.current = e.touches[0].clientY;
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [fullyExpanded, scrollProgress]);

  // Derived visual values
  const mediaWidth = 300 + scrollProgress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + scrollProgress * (isMobile ? 200 : 400);
  const textShift = scrollProgress * (isMobile ? 180 : 150);
  const bgOpacity = 1 - scrollProgress * 0.55;
  const overlayOpacity = 0.38 - scrollProgress * 0.3;
  const headlineOpacity = scrollProgress < 0.65 ? 1 : Math.max(0, 1 - (scrollProgress - 0.65) / 0.2);
  const borderRadius = Math.max(0, 28 - scrollProgress * 28);

  return (
    <section ref={sectionRef} className="relative min-h-[100dvh] bg-[#0f1011] overflow-x-hidden">
      <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
        {/* Background */}
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

        {/* Centered content area */}
        <div className="flex flex-col items-center justify-center w-full min-h-[100dvh] relative z-10">
          {/* Video container — expands on scroll */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
              maxWidth: "100vw",
              maxHeight: "100dvh",
              borderRadius: `${borderRadius}px`,
              overflow: "hidden",
              boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
            }}
          >
            <div className="relative w-full h-full pointer-events-none">
              <iframe
                src={youtubeEmbed}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{ width: "177.78vh", height: "100vh", minWidth: "100%", minHeight: "100%" }}
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

          {/* Headline — MONTE SEU SETUP / SETUP / GAMER */}
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

        {/* CTA — fades in when fully expanded */}
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
