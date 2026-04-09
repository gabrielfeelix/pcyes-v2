import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  SlidersHorizontal, ArrowUpDown, ChevronDown, Grid3X3, LayoutList,
  Heart, ShoppingBag, Star, X, Percent, ArrowUpRight, ChevronLeft,
  ChevronRight, Check, Eye, Filter, Minus, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { useCart } from "./CartContext";
import { useFavorites } from "./FavoritesContext";
import { useTheme } from "./ThemeProvider";
import { Footer } from "./Footer";
import { allProducts } from "./productsData";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const categoryMap: Record<string, string> = {
  "Gabinetes": "Gabinetes", "Periféricos": "Periféricos", "Coolers": "Refrigeração",
  "Fontes": "Fontes", "Cadeiras": "Cadeiras", "Monitores": "Monitores",
  "Streaming": "Streaming", "Linha BrTT": "Periféricos", "Placas de Vídeo": "Placas de Vídeo", "SSD e HD": "SSD e HD", "Refrigeração": "Refrigeração"
};
const categories = Object.keys(categoryMap);
const allTags = ["Gaming", "RGB", "Wireless", "Streaming", "Escritório"];
const sortOptions = [
  { label: "Relevância", value: "relevance" },
  { label: "Mais vendidos", value: "bestselling" },
  { label: "A – Z", value: "az" },
  { label: "Z – A", value: "za" },
  { label: "Menor preço", value: "price-asc" },
  { label: "Maior preço", value: "price-desc" },
  { label: "Mais avaliados", value: "rating" },
  { label: "Maior desconto", value: "discount" },
];
const brandsList = ["PCYES", "Mancer", "Fallen"];
const GLOBAL_MIN = 0;
const GLOBAL_MAX = 15000;

function getDiscount(p: typeof allProducts[0]) {
  if (!p.oldPriceNum) return 0;
  return Math.round(((p.oldPriceNum - p.priceNum) / p.oldPriceNum) * 100);
}

/* ── Color extraction ── */
const colorSwatches: Record<string, { color: string; label: string }[]> = {};
allProducts.forEach((p) => {
  const swatches: { color: string; label: string }[] = [];
  const name = p.name.toLowerCase();
  if (name.includes("black") || name.includes("preto") || name.includes("vulcan"))
    swatches.push({ color: "#18181b", label: "Preto" });
  if (name.includes("white") || name.includes("branco") || name.includes("ghost"))
    swatches.push({ color: "#f4f4f5", label: "Branco" });
  if (name.includes("red") || name.includes("magma"))
    swatches.push({ color: "#dc2626", label: "Vermelho" });
  if (name.includes("blue") || name.includes("cobalt"))
    swatches.push({ color: "#2563eb", label: "Azul" });
  if (name.includes("green") || name.includes("mint"))
    swatches.push({ color: "#65a30d", label: "Verde" });
  if (name.includes("purple"))
    swatches.push({ color: "#9333ea", label: "Roxo" });
  if (name.includes("yellow") || name.includes("amarela"))
    swatches.push({ color: "#eab308", label: "Amarelo" });
  if (swatches.length <= 1) swatches.push({ color: "#3f3f46", label: "Default" });
  colorSwatches[p.id] = swatches.slice(0, 6);
});

/* ═══════════════════════════════════════════════════════
   PRICE RANGE SLIDER
   ═══════════════════════════════════════════════════════ */

function PriceRangeSlider({
  min, max, onMinChange, onMaxChange, onApply,
}: {
  min: number; max: number;
  onMinChange: (v: number) => void;
  onMaxChange: (v: number) => void;
  onApply: () => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const minPct = ((min - GLOBAL_MIN) / (GLOBAL_MAX - GLOBAL_MIN)) * 100;
  const maxPct = ((max - GLOBAL_MIN) / (GLOBAL_MAX - GLOBAL_MIN)) * 100;

  const getPctFromEvent = (e: MouseEvent | React.MouseEvent) => {
    if (!trackRef.current) return 0;
    const rect = trackRef.current.getBoundingClientRect();
    const x = "touches" in e ? (e as any).touches[0].clientX : e.clientX;
    return Math.max(0, Math.min(1, (x - rect.left) / rect.width));
  };

  const handlePointerDown = (thumb: "min" | "max") => (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(thumb);
    const pct = getPctFromEvent(e);
    const val = Math.round(GLOBAL_MIN + pct * (GLOBAL_MAX - GLOBAL_MIN));
    if (thumb === "min") onMinChange(Math.min(val, max - 100));
    else onMaxChange(Math.max(val, min + 100));
  };

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: MouseEvent) => {
      const pct = getPctFromEvent(e as any);
      const val = Math.round(GLOBAL_MIN + pct * (GLOBAL_MAX - GLOBAL_MIN));
      if (dragging === "min") onMinChange(Math.min(val, max - 100));
      else onMaxChange(Math.max(val, min + 100));
    };
    const handleUp = () => { setDragging(null); onApply(); };
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
    return () => { window.removeEventListener("mousemove", handleMove); window.removeEventListener("mouseup", handleUp); };
  }, [dragging, min, max, onMinChange, onMaxChange, onApply]);

  const formatBRL = (v: number) =>
    v >= 1000 ? `R$ ${(v / 1000).toFixed(0)}k` : `R$ ${v}`;

  return (
    <div className="space-y-3">
      {/* Slider track */}
      <div ref={trackRef} className="relative h-1.5 bg-foreground/[0.08] rounded-full cursor-pointer select-none">
        {/* Active range */}
        <div
          className="absolute top-0 h-full rounded-full bg-foreground"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Min thumb */}
        <div
          onMouseDown={handlePointerDown("min")}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-background shadow-md cursor-grab active:cursor-grabbing z-10"
          style={{ left: `calc(${minPct}% - 8px)` }}
        />
        {/* Max thumb */}
        <div
          onMouseDown={handlePointerDown("max")}
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-foreground border-2 border-background shadow-md cursor-grab active:cursor-grabbing z-10"
          style={{ left: `calc(${maxPct}% - 8px)` }}
        />
      </div>
      {/* Min / Max inputs */}
      <div className="flex gap-2">
        <div className="flex-1">
          <label className="text-foreground/25 mb-1 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", letterSpacing: "0.06em" }}>MÍN</label>
          <input
            type="number" value={min} min={GLOBAL_MIN} max={max - 100}
            onChange={(e) => onMinChange(Math.max(GLOBAL_MIN, Math.min(parseInt(e.target.value) || 0, max - 100)))}
            onBlur={onApply}
            className="w-full border border-foreground/8 px-2 py-1.5 bg-transparent text-foreground focus:border-foreground/20 focus:outline-none transition-colors text-center"
            style={{ borderRadius: "6px", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
          />
        </div>
        <div className="flex-1">
          <label className="text-foreground/25 mb-1 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", letterSpacing: "0.06em" }}>MÁX</label>
          <input
            type="number" value={max} min={min + 100} max={GLOBAL_MAX}
            onChange={(e) => onMaxChange(Math.min(GLOBAL_MAX, Math.max(parseInt(e.target.value) || GLOBAL_MAX, min + 100)))}
            onBlur={onApply}
            className="w-full border border-foreground/8 px-2 py-1.5 bg-transparent text-foreground focus:border-foreground/20 focus:outline-none transition-colors text-center"
            style={{ borderRadius: "6px", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
          />
        </div>
      </div>
      {/* Visual labels */}
      <div className="flex justify-between" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", color: "var(--text-muted)" }}>
        <span>{formatBRL(min)}</span>
        <span>{formatBRL(max)}</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const initialSearch = searchParams.get("search") || "";

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    initialCategory ? new Set([initialCategory]) : new Set()
  );
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState(GLOBAL_MIN);
  const [priceMax, setPriceMax] = useState(GLOBAL_MAX);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");
  const [gridMode, setGridMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [colsCount, setColsCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<typeof allProducts[0] | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true, brands: true, tags: false, price: true, rating: false, promo: false,
  });

  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categoryMap[cat]) setSelectedCategories(new Set([cat]));
    const sq = searchParams.get("search");
    if (sq) setSearchQuery(sq);
  }, [searchParams]);

  /* ── Responsive columns ── */
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w >= 1800) setColsCount(4);
      else if (w >= 1280) setColsCount(3);
      else if (w >= 768) setColsCount(2);
      else setColsCount(1);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  /* ── Scroll to top on category change ── */
  const mainRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [initialCategory]);

  /* ── Helpers ── */
  const toggleSet = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, val: T) => {
    setter((prev) => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n; });
  };
  const toggleCategory = (cat: string) => {
    toggleSet(setSelectedCategories, cat);
    if (selectedCategories.has(cat)) {
      const sp = new URLSearchParams(searchParams); sp.delete("category"); setSearchParams(sp, { replace: true });
    }
  };
  const toggleSection = (key: string) => setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

  const clearAll = () => {
    setSelectedCategories(new Set()); setSelectedTags(new Set()); setSelectedBrands(new Set());
    setPriceMin(GLOBAL_MIN); setPriceMax(GLOBAL_MAX); setOnlyDiscount(false); setMinRating(null);
    setInStockOnly(false); setSearchQuery("");
    const sp = new URLSearchParams(searchParams); sp.delete("category"); sp.delete("search"); setSearchParams(sp, { replace: true });
  };

  const activeFilterCount = selectedCategories.size + selectedTags.size + selectedBrands.size
    + (priceMin > GLOBAL_MIN || priceMax < GLOBAL_MAX ? 1 : 0) + (onlyDiscount ? 1 : 0)
    + (minRating !== null ? 1 : 0) + (searchQuery ? 1 : 0) + (inStockOnly ? 1 : 0);

  /* ── Filtered + sorted products ── */
  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerQ) || p.category.toLowerCase().includes(lowerQ));
    }
    if (selectedCategories.size > 0) result = result.filter((p) => selectedCategories.has(p.category));
    if (selectedTags.size > 0) result = result.filter((p) => p.tags.some((t) => selectedTags.has(t)));
    if (selectedBrands.size > 0) result = result.filter((p) => p.brand && selectedBrands.has(p.brand));
    if (priceMin > GLOBAL_MIN) result = result.filter((p) => p.priceNum >= priceMin);
    if (priceMax < GLOBAL_MAX) result = result.filter((p) => p.priceNum <= priceMax);
    if (onlyDiscount) result = result.filter((p) => p.oldPrice);
    if (minRating !== null) result = result.filter((p) => p.rating >= minRating);
    if (inStockOnly) result = result.filter((p) => p.inStock !== false);

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.priceNum - b.priceNum); break;
      case "price-desc": result.sort((a, b) => b.priceNum - a.priceNum); break;
      case "rating": result.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews); break;
      case "discount": result.sort((a, b) => getDiscount(b) - getDiscount(a)); break;
      case "bestselling": result.sort((a, b) => b.reviews - a.reviews); break;
      case "az": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "za": result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return result;
  }, [selectedCategories, selectedTags, selectedBrands, priceMin, priceMax, onlyDiscount, minRating, inStockOnly, sortBy, searchQuery]);

  /* ── Apply filters with loading ── */
  const applyFilters = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 350);
  };

  /* ── Add to cart with toast ── */
  const handleAddToCart = useCallback((product: typeof allProducts[0]) => {
    addItem(product);
    toast.success(`${product.name.split(" ").slice(0, 4).join(" ")}…`, {
      description: product.price,
      duration: 2500,
    });
  }, [addItem]);

  /* ── Image carousel ── */
  const getImageIndex = (productId: number, max: number) => Math.min(activeImageIndex[productId] ?? 0, max - 1);
  const setImageIdx = (productId: number, idx: number, max: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [productId]: Math.max(0, Math.min(idx, max - 1)) }));
  };

  /* ═══════════════════════════════════════════════════════
     FILTER SIDEBAR CONTENT
     ═══════════════════════════════════════════════════════ */

  const filterSidebar = (
    <div className="space-y-5">
      {/* Categorias */}
      <FilterSection title="Categorias" expanded={expandedSections.categories} onToggle={() => toggleSection("categories")}>
        {categories.map((cat) => {
          const count = allProducts.filter((p) => p.category === cat).length;
          const active = selectedCategories.has(cat);
          return (
            <label key={cat} className="flex items-center gap-2.5 py-1.5 cursor-pointer group/item">
              <span className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/15 group-hover/item:border-foreground/30"}`} style={{ borderRadius: "3px" }}>
                {active && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span className="text-foreground/55 group-hover/item:text-foreground/80 transition-colors flex-1 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{cat}</span>
              <span className="text-foreground/20 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>({count})</span>
            </label>
          );
        })}
      </FilterSection>

      {/* Marca */}
      <FilterSection title="Marca" expanded={expandedSections.brands} onToggle={() => toggleSection("brands")}>
        {brandsList.map((brand) => {
          const count = allProducts.filter((p) => p.brand === brand).length;
          const active = selectedBrands.has(brand);
          return (
            <label key={brand} className="flex items-center gap-2.5 py-1.5 cursor-pointer group/item">
              <span className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/15 group-hover/item:border-foreground/30"}`} style={{ borderRadius: "3px" }}>
                {active && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span className="text-foreground/55 group-hover/item:text-foreground/80 transition-colors flex-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{brand}</span>
              <span className="text-foreground/20 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>({count})</span>
            </label>
          );
        })}
      </FilterSection>

      {/* Promoção */}
      <FilterSection title="Promo" expanded={expandedSections.promo} onToggle={() => toggleSection("promo")}>
        <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group/item">
          <span className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${onlyDiscount ? "border-foreground bg-foreground" : "border-foreground/15 group-hover/item:border-foreground/30"}`} style={{ borderRadius: "3px" }}>
            {onlyDiscount && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span className="text-foreground/55 group-hover/item:text-foreground/80 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Em promoção</span>
        </label>
        {[10, 20, 30, 40].map((pct) => {
          const count = allProducts.filter((pr) => getDiscount(pr) >= pct).length;
          return (
            <label key={pct} className="flex items-center gap-2.5 py-1.5 cursor-pointer group/item">
              <span className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${false ? "border-foreground bg-foreground" : "border-foreground/15 group-hover/item:border-foreground/30"}`} style={{ borderRadius: "3px" }} />
              <span className="text-foreground/55 group-hover/item:text-foreground/80 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>A partir de {pct}% OFF</span>
              <span className="text-foreground/20 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>({count})</span>
            </label>
          );
        })}
      </FilterSection>

      {/* Tags */}
      <FilterSection title="Tags" expanded={expandedSections.tags} onToggle={() => toggleSection("tags")}>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const active = selectedTags.has(tag);
            return (
              <button key={tag} onClick={() => toggleSet(setSelectedTags, tag)}
                className={`px-3 py-1.5 border transition-colors ${active ? "border-foreground/20 bg-foreground/[0.04] text-foreground" : "border-foreground/8 text-foreground/35 hover:border-foreground/15"
                  }`}
                style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
              >{tag}</button>
            );
          })}
        </div>
      </FilterSection>

      {/* Preço — Slider + Inputs (Insider style) */}
      <FilterSection title="Preço" expanded={expandedSections.price} onToggle={() => toggleSection("price")}>
        <PriceRangeSlider
          min={priceMin} max={priceMax}
          onMinChange={setPriceMin} onMaxChange={setPriceMax}
          onApply={applyFilters}
        />
      </FilterSection>

      {/* Avaliação */}
      <FilterSection title="Avaliação" expanded={expandedSections.rating} onToggle={() => toggleSection("rating")}>
        {[4.5, 4.0, 3.5].map((r) => {
          const active = minRating === r;
          return (
            <label key={r} className="flex items-center gap-2.5 py-1.5 cursor-pointer group/item">
              <span className={`w-3.5 h-3.5 border-2 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground" : "border-foreground/15 group-hover/item:border-foreground/30"}`}>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-foreground" />}
              </span>
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-foreground text-foreground" />
                <span className="text-foreground/55 group-hover/item:text-foreground/80 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{r}+</span>
              </div>
            </label>
          );
        })}
      </FilterSection>

      {/* Em estoque */}
      <div>
        <label className="flex items-center gap-2.5 py-1.5 cursor-pointer group/item">
          <span className={`w-3.5 h-3.5 border flex items-center justify-center flex-shrink-0 transition-colors ${inStockOnly ? "border-foreground bg-foreground" : "border-foreground/15 group-hover/item:border-foreground/30"}`} style={{ borderRadius: "3px" }}>
            {inStockOnly && <svg width="8" height="8" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span className="text-foreground/55 group-hover/item:text-foreground/80 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Em estoque</span>
        </label>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <div ref={mainRef} className="pt-[92px] min-h-screen">
      {/* ── Hero Header (compact) ── */}
      <div className="px-4 md:px-6 pt-10 pb-8" style={{ background: isDark ? "#161617" : "#f5f5f7" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div className="flex items-center gap-2 mb-5">
            <Link to="/" className="text-foreground/30 hover:text-foreground/60 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>Home</Link>
            <span className="text-foreground/15" style={{ fontSize: "10px" }}>›</span>
            <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
              {initialCategory ? categoryMap[initialCategory] || "Produtos" : "Produtos"}
            </span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className={isDark ? "text-white" : "text-foreground"}
              style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(28px, 3.5vw, 40px)", fontWeight: "var(--font-weight-light)" }}
            >
              {initialCategory ? categoryMap[initialCategory] || "Todos os Produtos" : "Todos os Produtos"}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className={isDark ? "text-white/35" : "text-foreground/35"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", whiteSpace: "nowrap" }}
            >
              {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Main Content — Insider layout ── */}
      <div className="px-4 md:px-6 py-6">
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div className="flex gap-8 lg:gap-12">
            {/* ── Sidebar (Insider: narrow, left-aligned, auto-height) ── */}
            <aside className="hidden lg:block w-[180px] xl:w-[200px] flex-shrink-0">
              <div className="sticky top-[108px]">
                {filterSidebar}
              </div>
            </aside>

            {/* ── Products area ── */}
            <div className="flex-1 min-w-0">
              {/* Control bar */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <button onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-3 py-1.5 border border-foreground/8 text-foreground/50 hover:text-foreground transition-colors"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
                  >
                    <SlidersHorizontal size={12} /> Filtros
                    {activeFilterCount > 0 && (
                      <span className="ml-1 w-4 h-4 rounded-full bg-foreground text-background flex items-center justify-center" style={{ fontSize: "9px" }}>{activeFilterCount}</span>
                    )}
                  </button>
                  <button onClick={() => setFilterDrawerOpen(true)}
                    className="hidden lg:flex items-center gap-1.5 text-foreground/35 hover:text-foreground/60 transition-colors"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
                  >
                    <Filter size={11} /> Filtros
                    {activeFilterCount > 0 && (
                      <span className="ml-0.5 text-foreground/50">({activeFilterCount})</span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  {/* Sort */}
                  <div className="relative">
                    <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                      className="flex items-center gap-1.5 text-foreground/35 hover:text-foreground/60 transition-colors"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
                    >
                      <ArrowUpDown size={11} />
                      {sortOptions.find((s) => s.value === sortBy)?.label}
                      <ChevronDown size={9} className={`transition-transform duration-200 ${sortDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {sortDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: -5, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.97 }} transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-2 border border-foreground/8 shadow-xl z-30 min-w-[180px] py-1"
                          style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1e1e20" : "#fff" }}
                        >
                          {sortOptions.map((opt) => (
                            <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                              className={`w-full text-left px-3 py-2 transition-colors ${sortBy === opt.value ? "text-foreground bg-foreground/[0.04]" : "text-foreground/50 hover:text-foreground hover:bg-foreground/[0.02]"
                                }`}
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
                            >{opt.label}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Grid / List */}
                  <div className="hidden sm:flex border border-foreground/8 overflow-hidden" style={{ borderRadius: "var(--radius-button)" }}>
                    <button onClick={() => setGridMode("grid")}
                      className={`p-1.5 transition-colors ${gridMode === "grid" ? "bg-foreground/[0.06] text-foreground" : "text-foreground/25 hover:text-foreground/40"}`}
                    ><Grid3X3 size={13} /></button>
                    <button onClick={() => setGridMode("list")}
                      className={`p-1.5 transition-colors ${gridMode === "list" ? "bg-foreground/[0.06] text-foreground" : "text-foreground/25 hover:text-foreground/40"}`}
                    ><LayoutList size={13} /></button>
                  </div>
                </div>
              </div>

              {/* Active filter pills */}
              <AnimatePresence>
                {activeFilterCount > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap items-center gap-1.5 mb-5">
                    {searchQuery && <FilterPill label={`"${searchQuery}"`} onRemove={() => { setSearchQuery(""); const sp = new URLSearchParams(searchParams); sp.delete("search"); setSearchParams(sp, { replace: true }); }} />}
                    {[...selectedCategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleCategory(c)} />)}
                    {[...selectedBrands].map((b) => <FilterPill key={b} label={b} onRemove={() => toggleSet(setSelectedBrands, b)} />)}
                    {[...selectedTags].map((t) => <FilterPill key={t} label={t} onRemove={() => toggleSet(setSelectedTags, t)} />)}
                    {(priceMin > GLOBAL_MIN || priceMax < GLOBAL_MAX) && <FilterPill label={`R$ ${priceMin} – R$ ${priceMax}`} onRemove={() => { setPriceMin(GLOBAL_MIN); setPriceMax(GLOBAL_MAX); }} />}
                    {onlyDiscount && <FilterPill label="Promo" onRemove={() => setOnlyDiscount(false)} />}
                    {minRating !== null && <FilterPill label={`${minRating}+`} onRemove={() => setMinRating(null)} />}
                    {inStockOnly && <FilterPill label="Em estoque" onRemove={() => setInStockOnly(false)} />}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Loading skeleton ── */}
              {isLoading ? (
                <div className={`grid gap-x-4 gap-y-8 ${gridMode === "grid" ? `grid-cols-1 sm:grid-cols-2 xl:grid-cols-${colsCount}` : "space-y-3"}`}>
                  {Array.from({ length: colsCount * 2 }).map((_, i) => (
                    <div key={i} className="animate-pulse" style={{ borderRadius: "var(--radius-card)" }}>
                      <div className="aspect-[3/4] bg-foreground/[0.04]" style={{ borderRadius: "var(--radius-card)" }} />
                      <div className="mt-3 h-3 bg-foreground/[0.04] w-16 rounded" />
                      <div className="mt-2 h-4 bg-foreground/[0.04] w-full rounded" />
                      <div className="mt-2 h-4 bg-foreground/[0.04] w-20 rounded" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-foreground/[0.04] flex items-center justify-center">
                    <ShoppingBag size={20} className="text-foreground/20" />
                  </div>
                  <p className="text-foreground/30 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-light)" }}>Nenhum produto encontrado</p>
                  <p className="text-foreground/20 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Tente ajustar os filtros.</p>
                  <button onClick={clearAll}
                    className="px-5 py-2 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/25 transition-all"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                  >Limpar filtros</button>
                </motion.div>
              ) : gridMode === "grid" ? (
                <div className={`grid gap-x-4 gap-y-8 grid-cols-1 sm:grid-cols-2 xl:grid-cols-${colsCount}`}>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((product, i) => {
                      const discount = getDiscount(product);
                      const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
                      const imgIdx = getImageIndex(product.id, productImages.length);
                      const swatches = colorSwatches[product.id] ?? [{ color: "#3f3f46", label: "Default" }];

                      return (
                        <motion.div key={product.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.35) }}
                          className="group relative"
                        >
                          <div className="relative overflow-hidden mb-3 aspect-[3/4]" style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f0f0f0" }}>
                            <Link to={`/produto/${product.id}`} className="block h-full">
                              <ImageWithFallback
                                src={productImages[imgIdx]}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s] ease-out"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.06] transition-colors duration-500" />
                            </Link>

                            {/* Badges — top-left corner */}
                            <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                              {discount > 0 && (
                                <span className="px-2 py-0.5 bg-foreground text-background" style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.03em" }}>
                                  {discount}% OFF
                                </span>
                              )}
                              {product.badge && (
                                <span className={`px-2 py-0.5 text-white ${product.badge.toUpperCase().includes('BLUE') ? 'bg-blue-600' : product.badge.toUpperCase().includes('RED') ? 'bg-red-600' : product.badge.toUpperCase().includes('BROWN') ? 'bg-amber-700' : 'bg-foreground'}`}
                                  style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.03em" }}>
                                  {product.badge}
                                </span>
                              )}
                              {product.inStock === false && (
                                <span className="px-2 py-0.5 bg-foreground/60 text-background" style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "var(--font-weight-medium)" }}>
                                  Esgotado
                                </span>
                              )}
                            </div>

                            {/* Favorite + Quick View — top-right */}
                            <div className="absolute top-2.5 right-2.5 flex flex-col gap-1">
                              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
                                className="w-7 h-7 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                              >
                                <Heart size={11} className={isFavorite(product.id) ? "fill-foreground text-foreground" : "text-white/70"} strokeWidth={1.5} />
                              </button>
                              <button onClick={(e) => { e.preventDefault(); setQuickViewProduct(product); }}
                                className="w-7 h-7 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75"
                              >
                                <Eye size={11} className="text-white/70" />
                              </button>
                            </div>

                            {/* Carousel arrows (multi-image) */}
                            {productImages.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => { e.preventDefault(); setImageIdx(product.id, imgIdx - 1, productImages.length); }}
                                  className="absolute left-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white/70"
                                >
                                  <ChevronLeft size={12} />
                                </button>
                                <button
                                  onClick={(e) => { e.preventDefault(); setImageIdx(product.id, imgIdx + 1, productImages.length); }}
                                  className="absolute right-1.5 top-1/2 -translate-y-1/2 w-6 h-6 bg-black/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 text-white/70"
                                >
                                  <ChevronRight size={12} />
                                </button>
                                {/* Dots */}
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                  {productImages.map((_, idx) => (
                                    <button key={idx}
                                      onClick={(e) => { e.preventDefault(); setImageIdx(product.id, idx, productImages.length); }}
                                      className={`h-1 rounded-full transition-all ${idx === imgIdx ? "bg-white w-4" : "bg-white/40 w-1"}`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}

                            {/* Quick add — Insider "Compra Rápida" style */}
                            <div className="absolute bottom-0 left-0 right-0">
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                                className="w-full py-2.5 bg-foreground/90 backdrop-blur-sm text-background flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-full group-hover:translate-y-0 transition-all duration-300"
                                style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.06em", textTransform: "uppercase" }}
                              >
                                <ShoppingBag size={11} /> Compra Rápida
                              </button>
                            </div>
                          </div>

                          {/* Product info — Insider order: Swatches → Name → Rating → Price */}
                          <div className="px-0.5">
                            {/* Color swatches */}
                            {swatches.length > 1 && (
                              <div className="flex items-center gap-1 mb-2">
                                {swatches.map((sw, idx) => (
                                  <span
                                    key={idx}
                                    className="w-3.5 h-3.5 rounded-full border border-foreground/10 transition-transform hover:scale-125 cursor-pointer"
                                    style={{ backgroundColor: sw.color }}
                                    title={sw.label}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Name */}
                            <Link to={`/produto/${product.id}`}>
                              <p className="text-foreground group-hover:text-foreground/60 transition-colors mb-1.5 truncate leading-snug"
                                style={{ fontFamily: "var(--font-family-figtree)", fontSize: "13px", fontWeight: "var(--font-weight-medium)", lineHeight: 1.35 }}>
                                {product.name}
                              </p>
                            </Link>

                            {/* Rating + Price inline */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Star size={8} className="fill-foreground text-foreground" />
                                <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>
                                  {product.rating}
                                </span>
                                <span className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>
                                  ({product.reviews})
                                </span>
                              </div>
                              <p className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "500" }}>
                                {product.price}
                              </p>
                            </div>
                            {product.oldPrice && (
                              <p className="text-foreground/20 line-through mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                                {product.oldPrice}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── LIST VIEW ── */
                <div className="space-y-2.5">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((product, i) => {
                      const discount = getDiscount(product);
                      return (
                        <motion.div key={product.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25, delay: i * 0.02 }}
                          className="group flex items-center gap-5 border border-foreground/5 hover:border-foreground/10 p-2.5 transition-all duration-300"
                          style={{ borderRadius: "var(--radius-card)" }}
                        >
                          <Link to={`/produto/${product.id}`} className="w-[100px] h-[100px] flex-shrink-0 overflow-hidden relative block" style={{ borderRadius: "var(--radius-button)", background: isDark ? "#1a1a1c" : "#f0f0f0" }}>
                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            {discount > 0 && (
                              <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-foreground text-background" style={{ borderRadius: "3px", fontSize: "8px", fontWeight: "var(--font-weight-medium)" }}>{discount}% OFF</span>
                            )}
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="text-foreground/25 uppercase" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", letterSpacing: "0.05em" }}>{product.category}</span>
                              {product.brand && <span className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px" }}>· {product.brand}</span>}
                            </div>
                            <p className="text-foreground group-hover:text-foreground/60 transition-colors truncate mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>
                              {product.name}
                            </p>
                            <div className="flex items-center gap-2">
                              <p className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "500" }}>{product.price}</p>
                              {product.oldPrice && <p className="text-foreground/20 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{product.oldPrice}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <button onClick={() => toggleFavorite(product.id)}
                              className="w-8 h-8 border border-foreground/8 rounded-full flex items-center justify-center text-foreground/25 hover:text-foreground hover:border-foreground/15 transition-all"
                            ><Heart size={12} className={isFavorite(product.id) ? "fill-foreground text-foreground" : ""} strokeWidth={1.5} /></button>
                            <button onClick={() => handleAddToCart(product)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/[0.04] hover:bg-foreground hover:text-background text-foreground/50 transition-all"
                              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.04em", textTransform: "uppercase" }}
                            ><ShoppingBag size={11} /> Adicionar</button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Drawer ── */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] z-50 overflow-y-auto p-6"
              style={{ background: isDark ? "#161617" : "#fff", borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-foreground/60 tracking-[0.15em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>FILTROS</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-foreground/30 hover:text-foreground transition-colors"><X size={16} /></button>
              </div>
              {filterSidebar}
              <div className="sticky bottom-0 pt-4 mt-6">
                <button onClick={() => { applyFilters(); setMobileFiltersOpen(false); }}
                  className="w-full py-2.5 bg-foreground text-background font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  <Check size={13} /> Mostrar {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Filter Drawer (desktop) ── */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setFilterDrawerOpen(false)}
            />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[340px] z-50 overflow-y-auto p-6"
              style={{ background: isDark ? "#161617" : "#fff", borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-foreground/60 tracking-[0.15em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>FILTROS</span>
                <button onClick={() => setFilterDrawerOpen(false)} className="text-foreground/30 hover:text-foreground transition-colors"><X size={16} /></button>
              </div>
              {filterSidebar}
              <div className="sticky bottom-0 pt-4 mt-6 space-y-2">
                <button onClick={() => { applyFilters(); setFilterDrawerOpen(false); }}
                  className="w-full py-2.5 bg-foreground text-background font-semibold flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  <Check size={13} /> Mostrar {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </button>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll}
                    className="w-full py-2.5 border border-foreground/8 text-foreground/40 hover:text-foreground hover:border-foreground/20 transition-colors"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
                  >Limpar tudo</button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Quick View Modal ── */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[680px] md:max-h-[80vh] z-50 overflow-y-auto p-6"
              style={{ background: isDark ? "#161617" : "#fff", borderRadius: "var(--radius-card)" }}
            >
              <button onClick={() => setQuickViewProduct(null)}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center text-foreground/30 hover:text-foreground transition-colors z-10"
              ><X size={16} /></button>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="aspect-[3/4] overflow-hidden" style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f0f0f0" }}>
                  <ImageWithFallback src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-foreground/25 uppercase mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", letterSpacing: "0.1em" }}>{quickViewProduct.category}</p>
                  <h3 className="text-foreground mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "18px", fontWeight: "var(--font-weight-medium)", lineHeight: 1.3 }}>{quickViewProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={10} className="fill-foreground text-foreground" />
                    <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{quickViewProduct.rating}</span>
                    <span className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>({quickViewProduct.reviews})</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <p className="text-foreground/80" style={{ fontFamily: "var(--font-family-inter)", fontSize: "20px", fontWeight: "600" }}>{quickViewProduct.price}</p>
                    {quickViewProduct.oldPrice && (
                      <p className="text-foreground/20 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{quickViewProduct.oldPrice}</p>
                    )}
                  </div>
                  {quickViewProduct.description && (
                    <p className="text-foreground/35 mb-5 leading-relaxed" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.6 }}>{quickViewProduct.description}</p>
                  )}
                  <div className="flex gap-2.5">
                    <button onClick={() => { handleAddToCart(quickViewProduct); setQuickViewProduct(null); }}
                      className="flex-1 py-2.5 bg-foreground text-background flex items-center justify-center gap-1.5 font-semibold transition-opacity hover:opacity-90"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                    >
                      <ShoppingBag size={12} /> Adicionar
                    </button>
                    <Link to={`/produto/${quickViewProduct.id}`}
                      className="py-2.5 px-4 border border-foreground/8 text-foreground/50 hover:text-foreground hover:border-foreground/20 transition-colors flex items-center justify-center"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
                    >
                      Detalhes <ArrowUpRight size={11} className="ml-0.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUB-COMPONENTS
   ═══════════════════════════════════════════════════════ */

function FilterSection({ title, expanded = true, onToggle, children }: { title: string; expanded?: boolean; onToggle?: () => void; children: React.ReactNode }) {
  const [open, setOpen] = useState(expanded);
  const toggle = onToggle ?? (() => setOpen(!open));
  return (
    <div>
      <button onClick={toggle} className="flex items-center justify-between w-full mb-2 group">
        <span className="text-foreground/60 tracking-[0.1em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>{title.toUpperCase()}</span>
        <ChevronDown size={10} className={`text-foreground/20 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pb-2">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button onClick={onRemove}
      className="flex items-center gap-1 px-2.5 py-1 bg-foreground/[0.04] text-foreground/60 border border-foreground/8 hover:border-foreground/15 transition-colors"
      style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px" }}
    >
      {label} <X size={9} />
    </button>
  );
}
