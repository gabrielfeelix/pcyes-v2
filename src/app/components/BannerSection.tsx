import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function BannerSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.7]);

  return (
    <section ref={ref} className="py-32 md:py-48 px-5 md:px-8">
      <div className="max-w-[1300px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden"
          style={{ borderRadius: "var(--radius-card)" }}
        >
          <div className="relative aspect-[21/9] md:aspect-[21/8]">
            <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1760753145427-c327d09ace00?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBkZXNrJTIwc2V0dXAlMjBkYXJrJTIwYW1iaWVudHxlbnwxfHx8fDE3NzM4Mzk3OTd8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Setup gaming"
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.div className="absolute inset-0 bg-black" style={{ opacity: overlayOpacity }} />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="p-8 md:p-20 max-w-xl">
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-primary tracking-[0.25em] mb-5"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
              >
                MONTE SEU SETUP
              </motion.p>
              <div className="overflow-hidden mb-6">
                <motion.h2
                  initial={{ y: 80 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white"
                  style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 4vw, var(--text-h3))", fontWeight: "var(--font-weight-light)" }}
                >
                  Tudo que você precisa em um só lugar.
                </motion.h2>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-white/40 mb-10"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: "1.8" }}
              >
                De periféricos a componentes internos, encontre produtos de alta performance com o selo PCYES.
              </motion.p>
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                href="/produtos"
                className="group relative inline-block px-10 py-4 bg-white text-black overflow-hidden transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,255,255,0.15)]"
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-500">Ver todos os produtos</span>
                <span className="absolute inset-0 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}