import { useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion, useInView } from "motion/react";
import {
  ShoppingBag, Heart, Star, ChevronLeft, ChevronRight, Truck, Shield, RotateCcw,
  Check, Minus, Plus, Share2, Package,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useCart } from "./CartContext";
import { useTheme } from "./ThemeProvider";
import { allProducts } from "./productsData";
import { Footer } from "./Footer";

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = allProducts.find((p) => p.id === Number(id));
  const { addItem } = useCart();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<"specs" | "features">("specs");
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const relatedRef = useRef<HTMLDivElement>(null);
  const relatedInView = useInView(relatedRef, { once: true, amount: 0.1 });

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <p
          className="text-foreground/30"
          style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-light)" }}
        >
          Produto não encontrado
        </p>
        <Link
          to="/produtos"
          className="px-6 py-3 border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all duration-300"
          style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
        >
          Ver todos os produtos
        </Link>
      </div>
    );
  }

  // Use same image repeated as gallery mockup
  const galleryImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const related = allProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  if (related.length < 4) {
    const extras = allProducts.filter((p) => p.id !== product.id && !related.find((r) => r.id === p.id)).slice(0, 4 - related.length);
    related.push(...extras);
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const installments = Math.ceil(product.priceNum / 12);
  const installmentStr = `12x de R$ ${installments.toFixed(2).replace(".", ",")} sem juros`;

  return (
    <div className="pt-[92px]">
      {/* Breadcrumb */}
      <div className="px-5 md:px-8 pt-8 pb-4">
        <div className="max-w-[1760px] mx-auto flex items-center gap-2 flex-wrap">
          <Link to="/" className="text-foreground/25 hover:text-foreground/50 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
            Home
          </Link>
          <span className="text-foreground/15" style={{ fontSize: "10px" }}>›</span>
          <Link to="/produtos" className="text-foreground/25 hover:text-foreground/50 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
            Produtos
          </Link>
          <span className="text-foreground/15" style={{ fontSize: "10px" }}>›</span>
          <Link
            to={`/produtos?category=${encodeURIComponent(product.category)}`}
            className="text-foreground/25 hover:text-foreground/50 transition-colors"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
          >
            {product.category}
          </Link>
          <span className="text-foreground/15" style={{ fontSize: "10px" }}>›</span>
          <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
            {product.name}
          </span>
        </div>
      </div>

      {/* ─── Main PDP section ─── */}
      <div className="px-5 md:px-8 pb-24">
        <div className="max-w-[1760px] mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20">

          {/* ── Left: Gallery ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-[55%] flex-shrink-0"
          >
            {/* Main image */}
            <div
              className="relative overflow-hidden aspect-square mb-4 group"
              style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(22,22,23,0.5)" : "#f5f5f5" }}
            >
              <ImageWithFallback
                src={galleryImages[selectedImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />

              {/* Nav arrows */}
              <button
                onClick={() => setSelectedImageIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={() => setSelectedImageIndex((i) => (i + 1) % galleryImages.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center text-white/70 hover:text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>

              {/* Category badge */}
              <span
                className="absolute top-5 left-5 px-3 py-1.5 bg-black/20 backdrop-blur-md text-white/70"
                style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", letterSpacing: "0.08em" }}
              >
                {product.category}
              </span>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              {galleryImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`aspect-square overflow-hidden transition-all duration-300 cursor-pointer ${
                    selectedImageIndex === i ? "ring-2 ring-primary/50 ring-offset-2 ring-offset-background" : "opacity-40 hover:opacity-70"
                  }`}
                  style={{ borderRadius: "var(--radius)", background: isDark ? "rgba(22,22,23,0.5)" : "#f5f5f5" }}
                >
                  <ImageWithFallback src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Info ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-[45%] flex flex-col"
          >
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 border border-foreground/8 text-foreground/30"
                  style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", letterSpacing: "0.06em" }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Name */}
            <h1
              className="text-foreground mb-3"
              style={{
                fontFamily: "var(--font-family-figtree)",
                fontSize: "clamp(28px, 3.5vw, 40px)",
                fontWeight: "var(--font-weight-light)",
                lineHeight: "1.15",
              }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? "fill-primary text-primary" : "text-foreground/10"}
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                {product.rating}
              </span>
              <span className="text-foreground/15" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                ({product.reviews} avaliações)
              </span>
            </div>

            {/* Description */}
            <p
              className="text-foreground/40 mb-8"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: "1.8" }}
            >
              {product.description}
            </p>

            {/* Divider */}
            <div className="h-px bg-foreground/5 mb-8" />

            {/* Price block */}
            <div className="mb-8">
              <div className="flex items-baseline gap-3 mb-1">
                <span
                  className="text-foreground"
                  style={{ fontFamily: "var(--font-family-figtree)", fontSize: "32px", fontWeight: "var(--font-weight-medium)" }}
                >
                  {product.price}
                </span>
              </div>
              <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                ou {installmentStr}
              </p>
              <p className="text-primary/70 mt-1 flex items-center gap-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                <Truck size={12} />
                Frete grátis para todo o Brasil
              </p>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              {/* Qty */}
              <div
                className="flex items-center border border-foreground/10 overflow-hidden flex-shrink-0"
                style={{ borderRadius: "var(--radius-button)" }}
              >
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-11 h-12 flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 cursor-pointer"
                >
                  <Minus size={14} />
                </button>
                <span
                  className="w-12 h-12 flex items-center justify-center text-foreground border-x border-foreground/10"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                >
                  {qty}
                </span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-11 h-12 flex items-center justify-center text-foreground/30 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 cursor-pointer"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAdd}
                className={`flex-1 h-12 flex items-center justify-center gap-2.5 transition-all duration-500 cursor-pointer ${
                  addedToCart
                    ? "bg-green-600 text-white"
                    : "bg-primary text-primary-foreground hover:brightness-110"
                }`}
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
              >
                {addedToCart ? (
                  <>
                    <Check size={16} />
                    Adicionado!
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    Adicionar ao carrinho
                  </>
                )}
              </button>

              {/* Like */}
              <button
                onClick={() => setLiked(!liked)}
                className={`w-12 h-12 flex-shrink-0 border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  liked ? "border-primary/30 text-primary bg-primary/5" : "border-foreground/10 text-foreground/25 hover:text-foreground/50 hover:border-foreground/20"
                }`}
                style={{ borderRadius: "var(--radius-button)" }}
              >
                <Heart size={16} className={liked ? "fill-primary" : ""} strokeWidth={1.5} />
              </button>

              {/* Share */}
              <button
                className="w-12 h-12 flex-shrink-0 border border-foreground/10 text-foreground/25 hover:text-foreground/50 hover:border-foreground/20 flex items-center justify-center transition-all duration-300 cursor-pointer"
                style={{ borderRadius: "var(--radius-button)" }}
              >
                <Share2 size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { icon: Truck, label: "Entrega Rápida", sub: "2-5 dias úteis" },
                { icon: Shield, label: "Garantia", sub: "1 ano PCYES" },
                { icon: RotateCcw, label: "Troca Fácil", sub: "7 dias grátis" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2 py-4 border border-foreground/5 text-center"
                  style={{ borderRadius: "var(--radius-card)" }}
                >
                  <badge.icon size={16} className="text-foreground/20" strokeWidth={1.5} />
                  <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>
                    {badge.label}
                  </span>
                  <span className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>
                    {badge.sub}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-foreground/5 mb-8" />

            {/* Tabs: Specs / Features */}
            <div className="flex gap-0 mb-6 border-b border-foreground/5">
              {(["specs", "features"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-5 py-3 transition-colors duration-300 cursor-pointer ${
                    activeTab === tab ? "text-foreground" : "text-foreground/25 hover:text-foreground/50"
                  }`}
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.08em" }}
                >
                  {tab === "specs" ? "ESPECIFICAÇÕES" : "DESTAQUES"}
                  {activeTab === tab && (
                    <motion.div
                      layoutId="pdp-tab"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
                      transition={{ duration: 0.25 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {activeTab === "specs" && product.specs ? (
              <motion.div
                key="specs"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-0"
              >
                {product.specs.map((spec, i) => (
                  <div
                    key={spec.label}
                    className={`flex items-center justify-between py-3 ${i < product.specs!.length - 1 ? "border-b border-foreground/[0.04]" : ""}`}
                  >
                    <span className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                      {spec.label}
                    </span>
                    <span className="text-foreground/70 text-right" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}>
                      {spec.value}
                    </span>
                  </div>
                ))}
              </motion.div>
            ) : product.features ? (
              <motion.div
                key="features"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {product.features.map((feat) => (
                  <div key={feat} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={10} className="text-primary" />
                    </div>
                    <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: "1.6" }}>
                      {feat}
                    </span>
                  </div>
                ))}
              </motion.div>
            ) : null}
          </motion.div>
        </div>
      </div>

      {/* ─── Related products ─── */}
      <div ref={relatedRef} className="px-5 md:px-8 py-24 border-t border-foreground/5">
        <div className="max-w-[1760px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={relatedInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span
                className="text-foreground/25 tracking-[0.25em] block mb-3"
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
              >
                VOCÊ TAMBÉM VAI GOSTAR
              </span>
              <h2
                className="text-foreground"
                style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: "var(--font-weight-light)" }}
              >
                Produtos Relacionados
              </h2>
            </div>
            <Link
              to={`/produtos?category=${encodeURIComponent(product.category)}`}
              className="hidden md:flex items-center gap-2 text-foreground/25 hover:text-foreground/50 transition-colors duration-300"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >
              Ver todos
              <ChevronRight size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((rProduct, i) => (
              <motion.div
                key={rProduct.id}
                initial={{ opacity: 0, y: 30 }}
                animate={relatedInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group cursor-pointer"
                onClick={() => { navigate(`/produto/${rProduct.id}`); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              >
                <div
                  className="relative overflow-hidden aspect-square mb-4"
                  style={{ borderRadius: "var(--radius-card)", background: isDark ? "rgba(22,22,23,0.5)" : "#f5f5f5" }}
                >
                  <ImageWithFallback
                    src={rProduct.image}
                    alt={rProduct.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />

                  {/* Quick add */}
                  <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                    <button
                      onClick={(e) => { e.stopPropagation(); addItem(rProduct); }}
                      className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-black flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                    >
                      <ShoppingBag size={13} strokeWidth={1.5} />
                      Adicionar <span className="hidden sm:inline">ao carrinho</span>
                    </button>
                  </div>
                </div>

                <div className="px-0.5">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Star size={11} className="fill-primary text-primary" />
                    <span className="text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{rProduct.rating}</span>
                  </div>
                  <p
                    className="text-foreground group-hover:text-primary transition-colors duration-300 mb-1 truncate"
                    style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: "var(--font-weight-medium)" }}
                  >
                    {rProduct.name}
                  </p>
                  <p className="text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>
                    {rProduct.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
