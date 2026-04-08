import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

const backgroundImage =
  "https://images.unsplash.com/photo-1760753145427-c327d09ace00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBkZXNrJTIwc2V0dXAlMjBkYXJrJTIwYW1iaWVudHxlbnwxfHx8fDE3NzM4Mzk3OTd8MA&ixlib=rb-4.1.0&q=80&w=1920";

const youtubeEmbed =
  "https://www.youtube.com/embed/g-QIHcPg1Ko?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&playlist=g-QIHcPg1Ko";

export function BannerSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
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

  const easedProgress = Math.min(progress * 1.45, 1);
  const mediaWidth = isMobile ? `${76 + easedProgress * 20}vw` : `${62 + easedProgress * 32}vw`;
  const mediaHeight = isMobile ? `${46 + easedProgress * 34}vh` : `${48 + easedProgress * 40}vh`;
  const textOffset = easedProgress * (isMobile ? 8 : 12);
  const backgroundScale = 1.08 - easedProgress * 0.08;
  const backgroundOverlay = 0.34 + easedProgress * 0.18;
  const videoOpacity = 0.82 + easedProgress * 0.18;
  const contentOpacity = easedProgress > 0.36 ? (easedProgress - 0.36) / 0.26 : 0;
  const contentY = 36 - Math.min(contentOpacity, 1) * 36;

  return (
    <section ref={sectionRef} className="relative h-[122vh] md:h-[136vh] bg-[#0f1011]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale: backgroundScale }}
        >
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url("${backgroundImage}")` }}
          />
          <div className="absolute inset-0" style={{ background: `rgba(0, 0, 0, ${backgroundOverlay})` }} />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,56,56,0.14),transparent_42%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,9,10,0.25)_0%,rgba(9,9,10,0.2)_100%)]" />
        </motion.div>

        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-[28px]"
            style={{
              width: mediaWidth,
              height: mediaHeight,
              maxWidth: "96vw",
              maxHeight: "88vh",
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
                style={{ opacity: videoOpacity }}
              />
              <div className="absolute inset-0 rounded-[28px] bg-black/25" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 via-black/12 to-transparent" />
            </div>
          </div>

          <div className="relative z-20 flex w-full max-w-[1440px] flex-col items-center justify-center gap-4 px-2 text-center">
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
                  textShadow: "0 10px 40px rgba(0,0,0,0.34)",
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
                  textShadow: "0 10px 40px rgba(0,0,0,0.34)",
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
      </div>
    </section>
  );
}
