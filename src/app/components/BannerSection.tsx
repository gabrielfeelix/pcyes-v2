import { useRef, useState, useEffect } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, useMotionTemplate } from "motion/react";

const backgroundImage =
  "https://www.oderco.com.br/media/descricoes/Imagens/293948/2.png";

const youtubeEmbed =
  "https://www.youtube.com/embed/g-QIHcPg1Ko?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&disablekb=1&modestbranding=1&playlist=g-QIHcPg1Ko";

export function BannerSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const mediaWidth = useTransform(scrollYProgress, [0, 1], [isMobile ? 76 : 26, 100]);
  const mediaWidthWithUnit = useMotionTemplate`${mediaWidth}vw`;
  
  const mediaHeight = useTransform(scrollYProgress, [0, 1], [isMobile ? 54 : 58, 100]);
  const mediaHeightWithUnit = useMotionTemplate`${mediaHeight}vh`;

  const mediaRadius = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const mediaRadiusWithUnit = useMotionTemplate`${mediaRadius}px`;

  const textTranslateX = useTransform(scrollYProgress, [0, 1], [0, isMobile ? 20 : 14]);
  const textTranslateXWithUnitLeft = useMotionTemplate`-${textTranslateX}vw`;
  const textTranslateXWithUnitRight = useMotionTemplate`${textTranslateX}vw`;
  const headlineOpacity = useTransform(scrollYProgress, [0, 0.72, 0.9], [1, 1, 0]);
  const headlineScale = useTransform(scrollYProgress, [0, 0.9], [1, 0.96]);
  const ctaOpacity = useTransform(scrollYProgress, [0.78, 1], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.78, 1], [28, 0]);

  const backgroundOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const videoOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0.38, 0.08]);

  const iframeCoverWidth = isMobile ? "178vh" : "177.78vh";
  const iframeCoverHeight = "100vh";

  return (
    <section
      ref={containerRef}
      className="relative bg-[#0f1011]"
      style={{ height: "220dvh" }}
    >
      <div className="sticky top-0 flex h-screen w-full items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{ opacity: backgroundOpacity }}
        >
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
          />
          <div className="absolute inset-0 bg-black/28" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,48,48,0.14),transparent_42%)]" />
        </motion.div>

        <div className="pointer-events-none relative z-10 flex h-screen w-full items-center justify-center">
          <motion.div
            className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 overflow-hidden bg-transparent"
            style={{
              width: mediaWidthWithUnit,
              height: mediaHeightWithUnit,
              borderRadius: mediaRadiusWithUnit,
              boxShadow: "0 30px 90px rgba(0,0,0,0.38)",
            }}
          >
            <iframe
              width="177.78%"
              height="100%"
              src={youtubeEmbed}
              className="pointer-events-none absolute left-1/2 top-1/2 min-h-full min-w-full -translate-x-1/2 -translate-y-1/2"
              style={{
                width: iframeCoverWidth,
                height: iframeCoverHeight,
              }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Setup gamer PCYES"
            />
            <motion.div
              className="absolute inset-0 bg-black pointer-events-none"
              style={{ opacity: videoOverlayOpacity }}
            />
          </motion.div>

          <motion.div
            className="relative z-20 flex w-full flex-col items-center justify-center gap-3 text-center"
            style={{ opacity: headlineOpacity, scale: headlineScale }}
          >
            <motion.p
              className="text-primary"
              style={{
                x: textTranslateXWithUnitLeft,
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
                x: textTranslateXWithUnitLeft,
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
                x: textTranslateXWithUnitRight,
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(52px, 8vw, 116px)",
                fontWeight: 700,
                lineHeight: 0.9,
                textShadow: "0 14px 48px rgba(0,0,0,0.34)",
              }}
            >
              GAMER
            </motion.h2>
          </motion.div>

          <motion.div
            className="pointer-events-auto absolute bottom-[72px] left-1/2 z-30 -translate-x-1/2"
            style={{ opacity: ctaOpacity, y: ctaY }}
          >
            <Link
              to="/monte-seu-pc"
              className="group inline-flex items-center justify-center rounded-full border border-white/18 bg-white px-8 py-3.5 text-black shadow-[0_20px_70px_rgba(0,0,0,0.35)] transition-all duration-500 hover:border-primary hover:bg-primary hover:text-white"
              style={{
                fontFamily: "var(--font-family-inter)",
                fontSize: "13px",
                fontWeight: "var(--font-weight-medium)",
                letterSpacing: "0.02em",
              }}
            >
              Monte seu setup
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
