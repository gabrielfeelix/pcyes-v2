import { useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShoppingBag, Heart, Star } from "lucide-react";
import { useCart } from "./CartContext";
import { allProducts as catalogProducts } from "./productsData";
import { getProductHoverMedia, getProductSwatches } from "./productPresentation";

const tags = ["Todos", "Gaming", "Streaming", "Escritório", "RGB", "Wireless"];

const tagProducts = [
  { id: 1, name: "Cobra V2 Mouse", price: "R$ 189,90", rating: 4.8, reviews: 234, tags: ["Gaming", "RGB"], image: "https://images.unsplash.com/photo-1768561327952-119a4c9c76f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBtb3VzZSUyMGRhcmslMjBtaW5pbWFsfGVufDF8fHx8MTc3MzgzOTc5NHww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 2, name: "Mancer Pro Teclado", price: "R$ 349,90", rating: 4.9, reviews: 512, tags: ["Gaming", "RGB", "Wireless"], image: "https://images.unsplash.com/photo-1718803448073-90ebd0d982e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWNoYW5pY2FsJTIwa2V5Ym9hcmQlMjBjbG9zZXVwJTIwZGFya3xlbnwxfHx8fDE3NzM4Mzk3OTZ8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 3, name: "Fallen 7.1 Headset", price: "R$ 279,90", rating: 4.7, reviews: 189, tags: ["Gaming", "Streaming"], image: "https://images.unsplash.com/photo-1673669231301-09baa4d7761b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0JTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzczODM5Nzk1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 4, name: "Spectrum Pro Gabinete", price: "R$ 599,90", rating: 4.9, reviews: 347, tags: ["Gaming", "RGB"], image: "https://images.unsplash.com/photo-1695120485648-0b6eed4707aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGNhc2UlMjB0b3dlciUyMGRhcmt8ZW58MXx8fHwxNzczODM5Nzk1fDA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 5, name: "Controle Vortex", price: "R$ 329,90", rating: 4.6, reviews: 98, tags: ["Gaming", "Wireless"], image: "https://images.unsplash.com/photo-1622349851524-890cc3641b87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBjb250cm9sbGVyJTIwd2lyZWxlc3MlMjBkYXJrfGVufDF8fHx8MTc3Mzg0MDQwOXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 6, name: "Studio X Microfone", price: "R$ 489,90", rating: 4.8, reviews: 156, tags: ["Streaming", "Escritório"], image: "https://images.unsplash.com/photo-1579870946215-8284f1a47c9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3Bob25lJTIwY29uZGVuc2VyJTIwc3R1ZGlvJTIwZGFya3xlbnwxfHx8fDE3NzM4NDA0MTB8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 7, name: "Deskpad RGB Pro", price: "R$ 149,90", rating: 4.5, reviews: 203, tags: ["RGB", "Escritório"], image: "https://images.unsplash.com/photo-1713012003065-7ca32db003ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxSR0IlMjBtb3VzZXBhZCUyMGRlc2slMjBtYXQlMjBkYXJrfGVufDF8fHx8MTc3Mzg0MDQwOXww&ixlib=rb-4.1.0&q=80&w=1080" },
  { id: 8, name: "Electra 750W Fonte", price: "R$ 449,90", rating: 4.9, reviews: 421, tags: ["Gaming"], image: "https://images.unsplash.com/photo-1630831506636-5209d7349db9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMHBvd2VyJTIwc3VwcGx5JTIwdW5pdCUyMGRhcmt8ZW58MXx8fHwxNzczODM5Nzk2fDA&ixlib=rb-4.1.0&q=80&w=1080" },
];

export function ProductsByTags() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.05 });
  const [activeTag, setActiveTag] = useState("Todos");
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const [hoveredProductId, setHoveredProductId] = useState<number | null>(null);
  const { addItem } = useCart();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const filtered = activeTag === "Todos" ? tagProducts : tagProducts.filter((p) => p.tags.includes(activeTag));

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    setLikedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <section ref={ref} className="py-20 md:py-24 px-5 md:px-8" style={{ background: isDark ? "#161617" : "transparent" }}>
      <div className="max-w-[1760px] mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-primary tracking-[0.25em] mb-5"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
          >
            CATÁLOGO
          </motion.p>
          <div className="overflow-hidden mb-6">
            <motion.h2
              initial={{ y: 80 }}
              animate={isInView ? { y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-foreground"
              style={{ fontSize: "clamp(36px, 5vw, var(--text-h2))", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)" }}
            >
              Produtos por tag
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-foreground/30 max-w-md mx-auto"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-base)", lineHeight: "1.8" }}
          >
            Filtre por interesse e encontre exatamente o que procura.
          </motion.p>
        </div>

        {/* Tag pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-2.5 mb-10"
        >
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`relative px-6 py-2.5 transition-all duration-400 border ${activeTag === tag
                  ? "bg-primary border-primary text-primary-foreground shadow-[0_0_25px_rgba(255,43,46,0.2)]"
                  : "border-border/15 text-foreground/40 hover:text-foreground hover:border-foreground/30"
                }`}
              style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="group"
              >
                {(() => {
                  const catalogProduct = catalogProducts.find((item) => item.id === product.id);
                  const hoverMedia = getProductHoverMedia(catalogProduct ?? { id: product.id, image: product.image, images: [product.image] });
                  const swatches = catalogProduct ? getProductSwatches(catalogProduct) : [];
                  const primaryImage = catalogProduct?.image ?? product.image;

                  return (
                    <>
                <div
                  className="relative overflow-hidden mb-5 aspect-square"
                  style={{
                    borderRadius: "var(--radius-card)",
                    background: isDark
                      ? "linear-gradient(180deg, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.015) 100%)"
                      : "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(242,242,242,1) 100%)",
                  }}
                  onMouseEnter={() => setHoveredProductId(product.id)}
                  onMouseLeave={() => setHoveredProductId((current) => (current === product.id ? null : current))}
                >
                  <Link to={`/produto/${product.id}`} className="block h-full">
                    <ImageWithFallback
                      src={primaryImage}
                      alt={product.name}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-[900ms] ease-out ${
                        hoverMedia ? "group-hover:scale-[1.02] group-hover:opacity-0" : "group-hover:scale-105"
                      }`}
                    />

                    {hoverMedia?.type === "image" && (
                      <ImageWithFallback
                        src={hoverMedia.src}
                        alt={`${product.name} em destaque`}
                        className="absolute inset-0 h-full w-full object-cover opacity-0 scale-[1.04] transition-all duration-[900ms] ease-out group-hover:scale-100 group-hover:opacity-100"
                      />
                    )}

                    {hoverMedia?.type === "video" && hoveredProductId === product.id && (
                      <iframe
                        src={`${hoverMedia.src}${hoverMedia.src.includes("?") ? "&" : "?"}autoplay=1&mute=1&loop=1&controls=0&playsinline=1`}
                        title={`${product.name} video`}
                        className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                        style={{ border: "none" }}
                        allow="autoplay; encrypted-media"
                      />
                    )}
                  </Link>

                  {/* Hover overlay actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500" />

                  {/* Like button */}
                  <button
                    onClick={(e) => toggleLike(product.id, e)}
                    className="absolute top-4 right-4 w-9 h-9 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400"
                  >
                    <Heart
                      size={14}
                      className={likedIds.has(product.id) ? "fill-primary text-primary" : "text-white/80"}
                      strokeWidth={1.5}
                    />
                  </button>

                  {/* Quick add */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <button
                      onClick={(e) => { e.preventDefault(); addItem(product); }}
                      className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-black flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                    >
                      <ShoppingBag size={13} strokeWidth={1.5} />
                      Adicionar
                    </button>
                  </div>

                  {/* Tags */}
                  <div className="absolute top-4 left-4 flex gap-1.5">
                    {product.tags.slice(0, 2).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-black/30 backdrop-blur-sm text-white/80"
                        style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "9px", letterSpacing: "0.05em" }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="px-1">
                  {swatches.length > 1 && (
                    <div className="mb-2.5 flex items-center gap-1.5">
                      {swatches.map((swatch) => (
                        <span
                          key={`${product.id}-${swatch.label}`}
                          className="h-3.5 w-3.5 rounded-full border border-foreground/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]"
                          style={{ backgroundColor: swatch.color }}
                          title={swatch.label}
                        />
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star size={11} className="fill-primary text-primary" />
                    <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                      {product.rating}
                    </span>
                    <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                      ({product.reviews})
                    </span>
                  </div>
                  <p className="text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5 truncate" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}>
                    {product.name}
                  </p>
                  <p className="text-foreground/90" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-sm)", fontWeight: "500" }}>
                    {product.price}
                  </p>
                  {product.reviews > 150 && (
                    <p className="text-foreground/25 mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>
                      {product.reviews}+ vendidos
                    </p>
                  )}
                </div>
                    </>
                  );
                })()}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Load more */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          className="text-center mt-10"
        >
          <Link
            to="/produtos"
            className="inline-block px-10 py-4 border border-border/15 text-foreground/50 hover:text-foreground hover:border-foreground/40 transition-all duration-500"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
          >
            Ver todos os produtos
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
