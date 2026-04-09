import { useRef } from "react";
import { Link } from "react-router";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight, ShoppingBag, Heart } from "lucide-react";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";

interface FeaturedProductProps {
  label: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  reverse?: boolean;
  price: string;
  oldPrice?: string;
  specs?: string[];
  productId?: number;
}

export function FeaturedProduct({ label, title, description, image, imageAlt, reverse, price, oldPrice, specs, productId }: FeaturedProductProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const { addItem } = useCart();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-6 md:px-12">
      <div className={`max-w-[1920px] mx-auto flex flex-col ${reverse ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-16 md:gap-28`}>
        {/* Image */}
        <motion.div className="flex-1 w-full" style={{ y: imageY }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden group cursor-pointer"
            style={{ borderRadius: "var(--radius-card)" }}
          >
            <Link to={productId ? `/produto/${productId}` : "/produtos"}>
              <ImageWithFallback
                src={image}
                alt={imageAlt}
                className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-primary/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <ArrowUpRight size={18} className="text-primary-foreground" />
              </div>
            </Link>
          </motion.div>
        </motion.div>

        {/* Content */}
        <div className="flex-1 max-w-lg">
          <motion.p
            initial={{ opacity: 0, x: reverse ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-primary tracking-[0.25em] mb-6"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
          >
            {label}
          </motion.p>

          <div className="overflow-hidden mb-8">
            <motion.h2
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="text-foreground"
              style={{ fontSize: "clamp(36px, 5vw, var(--text-h3))", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)" }}
            >
              {title}
            </motion.h2>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-foreground/40 mb-8"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: "1.8" }}
          >
            {description}
          </motion.p>

          {specs && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-wrap gap-3 mb-10"
            >
              {specs.map((spec) => (
                <span
                  key={spec}
                  className="px-4 py-1.5 border border-border/15 text-foreground/40"
                  style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)" }}
                >
                  {spec}
                </span>
              ))}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex items-center gap-4 flex-wrap"
          >
            <p className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-h4)", fontWeight: "var(--font-weight-light)" }}>
              {price}
            </p>
            {oldPrice && (
              <p className="text-foreground/40 line-through" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "var(--text-h4)", fontWeight: "var(--font-weight-light)" }}>
                {oldPrice}
              </p>
            )}
            <div className="flex items-center gap-3">
              <button
                className="group relative px-8 py-3.5 bg-primary text-primary-foreground overflow-hidden transition-all duration-500 hover:shadow-[0_0_40px_rgba(255,0,4,0.25)] flex items-center gap-2 cursor-pointer"
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                onClick={() => addItem({ id: productId || (title.length * 100 + price.length), name: title, price, image })}
              >
                <ShoppingBag size={14} strokeWidth={1.5} className="relative z-10" />
                <span className="relative z-10">Adicionar ao carrinho</span>
                <span className="absolute inset-0 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              </button>
              <Link
                to={productId ? `/produto/${productId}` : "/produtos"}
                className="px-6 py-3.5 border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all duration-300"
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
              >
                Ver produto
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
