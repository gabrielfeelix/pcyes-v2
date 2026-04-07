import { useRef } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight } from "lucide-react";

const categories = [
  { name: "Gabinetes", count: 42, image: "https://images.unsplash.com/photo-1695120485648-0b6eed4707aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGNhc2UlMjB0b3dlciUyMGRhcmt8ZW58MXx8fHwxNzczODM5Nzk1fDA&ixlib=rb-4.1.0&q=80&w=1080", span: "col-span-1 sm:col-span-2 row-span-2" },
  { name: "Periféricos", count: 86, image: "https://images.unsplash.com/photo-1768561327952-119a4c9c76f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZSUyMGRhcmslMjBtaW5pbWFsfGVufDF8fHx8MTc3MzgzOTc5NHww&ixlib=rb-4.1.0&q=80&w=1080", span: "col-span-1" },
  { name: "Coolers", count: 31, image: "https://images.unsplash.com/photo-1602951236204-ac1cf7682875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDUFUlMjBjb29sZXIlMjBmYW4lMjBkYXJrfGVufDF8fHx8MTc3MzgzOTc5N3ww&ixlib=rb-4.1.0&q=80&w=1080", span: "col-span-1" },
  { name: "Fontes", count: 24, image: "https://images.unsplash.com/photo-1630831506636-5209d7349db9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHBvd2VyJTIwc3VwcGx5JTIwdW5pdCUyMGRhcmt8ZW58MXx8fHwxNzczODM5Nzk2fDA&ixlib=rb-4.1.0&q=80&w=1080", span: "col-span-1" },
  { name: "Streaming", count: 18, image: "https://images.unsplash.com/photo-1579870946215-8284f1a47c9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lJTIwY29uZGVuc2VyJTIwc3R1ZGlvJTIwZGFya3xlbnwxfHx8fDE3NzM4NDA0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080", span: "col-span-1" },
  { name: "Cadeiras", count: 15, image: "https://images.unsplash.com/photo-1757194455393-8e3134d4ce19?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjaGFpciUyMGVyZ29ub21pYyUyMGRhcmt8ZW58MXx8fHwxNzczODQwNDA4fDA&ixlib=rb-4.1.0&q=80&w=1080", span: "col-span-1 sm:col-span-2" },
];

export function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  return (
    <section ref={ref} className="py-28 md:py-40 px-8 md:px-16" style={{ background: isDark ? "#161617" : "transparent" }} id="explore">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-primary tracking-[0.25em] mb-5"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
            >
              CATEGORIAS
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-foreground"
                style={{ fontSize: "clamp(36px, 5vw, var(--text-h2))", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)" }}
              >
                Explore por<br />categoria
              </motion.h2>
            </div>
          </div>
          <Link
            to="/produtos"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 self-start md:self-auto"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
          >
            Ver todas categorias
            <ArrowUpRight size={13} />
          </Link>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 auto-rows-[200px] gap-4">
          {categories.map((cat, i) => (
            <Link
              key={cat.name}
              to={`/produtos?category=${encodeURIComponent(cat.name)}`}
              className={`group relative overflow-hidden cursor-pointer block ${cat.span}`}
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.1 * i, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full relative"
              >
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent group-hover:from-black/85 transition-all duration-500" />

                <div className="absolute top-0 left-0 right-0 h-[2px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />

                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                  <div>
                    <p className="text-white mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>
                      {cat.name}
                    </p>
                    <p className="text-white/50 mb-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
                      {cat.count} produtos
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 group-hover:bg-white group-hover:text-black transition-all duration-500"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-micro)", fontWeight: "var(--font-weight-medium)" }}
                    >
                      Ver categoria
                      <ArrowUpRight size={11} />
                    </span>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
