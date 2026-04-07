import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingBag, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { Link } from "react-router";

const products = [
  { id: 1, name: "Cobra V2", category: "Mouse", price: "R$ 189,90", badge: null, image: "https://images.unsplash.com/photo-1768561327952-119a4c9c76f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZSUyMGRhcmslMjBtaW5pbWFsfGVufDF8fHx8MTc3MzgzOTc5NHww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, name: "Mancer Pro", category: "Teclado Mecânico", price: "R$ 349,90", badge: "Novo", image: "https://images.unsplash.com/photo-1718803448073-90ebd0d982e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjBjbG9zZXVwJTIwZGFya3xlbnwxfHx8fDE3NzM4Mzk3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, name: "Fallen 7.1", category: "Headset", price: "R$ 279,90", badge: null, image: "https://images.unsplash.com/photo-1673669231301-09baa4d7761b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0JTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzczODM5Nzk1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 4, name: "Electra 750W", category: "Fonte Modular", price: "R$ 449,90", badge: "Best Seller", image: "https://images.unsplash.com/photo-1630831506636-5209d7349db9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHBvd2VyJTIwc3VwcGx5JTIwdW5pdCUyMGRhcmt8ZW58MXx8fHwxNzczODM5Nzk2fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 5, name: "Spectrum X", category: "Gabinete", price: "R$ 599,90", badge: null, image: "https://images.unsplash.com/photo-1695120485648-0b6eed4707aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGNhc2UlMjB0b3dlciUyMGRhcmt8ZW58MXx8fHwxNzczODM5Nzk1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 6, name: "Arctic 360", category: "Cooler AIO", price: "R$ 219,90", badge: "Novo", image: "https://images.unsplash.com/photo-1602951236204-ac1cf7682875?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDUFUlMjBjb29sZXIlMjBmYW4lMjBkYXJrfGVufDF8fHx8MTc3MzgzOTc5N3ww&ixlib=rb-4.1.0&q=80&w=1080" },
];

export function ProductCarousel() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { addItem } = useCart();
  const { addFavorite } = useFavorites();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth > 768 ? 400 : clientWidth;
      scrollRef.current.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section ref={ref} className="py-28 md:py-40">
      <div className="max-w-[1300px] mx-auto px-5 md:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-primary tracking-[0.25em] mb-5"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
            >
              MAIS VENDIDOS
            </motion.p>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-foreground"
                style={{ fontSize: "clamp(36px, 5vw, var(--text-h2))", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)" }}
              >
                Escolhidos<br />para você
              </motion.h2>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4"
          >
            <p className="text-foreground/30 md:hidden" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
              Arraste para navegar →
            </p>
            <div className="hidden md:flex gap-2">
              <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer">
                <ChevronLeft size={16} />
              </button>
              <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full border border-foreground/10 flex items-center justify-center text-foreground/40 hover:text-foreground hover:bg-foreground/5 transition-all cursor-pointer">
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Horizontal scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto px-5 md:px-8 pb-4 scrollbar-hide snap-x md:snap-none"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none", scrollSnapType: "x mandatory" }}
        >
          {products.map((product, i) => (
            <motion.a
              key={product.id}
              href={`/produto/${product.id}`}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 * i }}
              className="group flex-shrink-0 w-[300px] md:w-[380px] snap-center block relative cursor-pointer"
            >
              <div className="relative overflow-hidden mb-6 aspect-square" style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                />

                {/* Badge */}
                {product.badge && (
                  <span
                    className={`absolute top-4 left-4 px-3 py-1 ${product.badge.toUpperCase().includes('BLUE') ? 'bg-blue-500 text-white' : product.badge.toUpperCase().includes('RED') ? 'bg-red-500 text-white' : product.badge.toUpperCase().includes('BROWN') ? 'bg-amber-700 text-white' : 'bg-primary text-primary-foreground'}`}
                    style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.1em" }}
                  >
                    {product.badge.toUpperCase()}
                  </span>
                )}

                {/* Quick add */}
                <div className="absolute bottom-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  <button
                    className="w-11 h-11 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                    onClick={(e) => { e.preventDefault(); addItem({ id: product.id, name: product.name, price: product.price, image: product.image }); }}
                  >
                    <ShoppingBag size={16} strokeWidth={1.5} />
                  </button>
                </div>

                {/* Favorite */}
                <div className="absolute top-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                  <button
                    className="w-11 h-11 bg-foreground text-background rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                    onClick={(e) => { e.preventDefault(); addFavorite({ id: product.id, name: product.name, price: product.price, image: product.image }); }}
                  >
                    <Heart size={16} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <p className="text-foreground/50 mb-1.5 tracking-wide" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)", fontWeight: "var(--font-weight-normal)" }}>
                {product.category.toUpperCase()}
              </p>
              <div className="flex items-baseline justify-between">
                <p className="text-foreground group-hover:text-primary transition-colors duration-300" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>
                  {product.name}
                </p>
                <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: "var(--font-weight-normal)" }}>
                  {product.price}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      </motion.div>
    </section>
  );
}