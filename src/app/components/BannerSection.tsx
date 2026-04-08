import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const backgroundImage =
  "https://images.unsplash.com/photo-1616588589676-62b3bd2f190b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920";

const youtubeEmbed =
  "https://www.youtube.com/embed/g-QIHcPg1Ko?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=g-QIHcPg1Ko";

export function BannerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
  });

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const mediaWidth = 320 + progress * (isMobile ? 600 : 1080);
  const mediaHeight = 380 + progress * (isMobile ? 180 : 360);
  const textOffset = progress * (isMobile ? 18 : 24);
  const backgroundOpacity = Math.max(0.08, 1 - progress * 1.2);
  const contentOpacity = progress > 0.48 ? (progress - 0.48) / 0.34 : 0;
  const contentY = 28 - Math.min(contentOpacity, 1) * 28;

  return (
    <section ref={sectionRef} className="relative h-[220vh] bg-[#0f1011]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ opacity: backgroundOpacity }}
        >
          <ImageWithFallback
            src={backgroundImage}
            alt="Setup gamer cinematográfico"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,56,56,0.12),transparent_40%)]" />
        </motion.div>

        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-[28px]"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
              maxWidth: "94vw",
              maxHeight: "82vh",
              boxShadow: "0 40px 120px rgba(0,0,0,0.45)",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-black">
              <iframe
                width="100%"
                height="100%"
                src={youtubeEmbed}
                className="h-full w-full rounded-[28px]"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Setup gamer PCYES"
              />
              <div className="absolute inset-0 rounded-[28px] bg-black/35" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
            </div>
          </div>

          <div className="relative z-20 flex w-full max-w-[1440px] flex-col items-center justify-center gap-4 px-2 text-center mix-blend-screen">
            <motion.p
              className="text-primary"
              style={{
                transform: `translateX(-${textOffset}vw)`,
                fontFamily: "var(--font-family-inter)",
                fontSize: "12px",
                fontWeight: "var(--font-weight-bold)",
                letterSpacing: "0.34em",
              }}
            >
              MONTE SEU SETUP
            </motion.p>
            <motion.h2
              className="text-white"
              style={{
                transform: `translateX(-${textOffset}vw)`,
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(42px, 7vw, 92px)",
                fontWeight: 700,
                lineHeight: 0.95,
              }}
            >
              SETUP
            </motion.h2>
            <motion.h2
              className="text-white"
              style={{
                transform: `translateX(${textOffset}vw)`,
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(42px, 7vw, 92px)",
                fontWeight: 700,
                lineHeight: 0.95,
              }}
            >
              GAMER
            </motion.h2>
          </div>

          <motion.div
            className="absolute inset-x-0 bottom-0 z-30 px-5 pb-8 md:px-8 md:pb-10"
            style={{ opacity: Math.min(contentOpacity, 1), transform: `translateY(${contentY}px)` }}
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
                    to="/monte-seu-pc"
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
      </div>
    </section>
  );
}
