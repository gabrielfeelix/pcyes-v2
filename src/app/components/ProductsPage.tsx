import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  SlidersHorizontal, ArrowUpDown, ChevronDown, Grid3X3, LayoutList,
  Heart, ShoppingBag, Star, X, Percent, ArrowUpRight, ChevronLeft,
  ChevronRight, Check, Eye, Loader2, Filter,
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

function getDiscount(p: typeof allProducts[0]) {
  if (!p.oldPriceNum) return 0;
  return Math.round(((p.oldPriceNum - p.priceNum) / p.oldPriceNum) * 100);
}

/* ── Color extraction from product names / tags ── */
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
  colorSwatches[p.id] = swatches.slice(0, 5);
});

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
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
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
  const [pendingFilters, setPendingFilters] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState<Record<number, number>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<typeof allProducts[0] | null>(null);

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
      if (w >= 1600) setColsCount(4);
      else if (w >= 1200) setColsCount(3);
      else if (w >= 640) setColsCount(2);
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

  const clearAll = () => {
    setSelectedCategories(new Set()); setSelectedTags(new Set()); setSelectedBrands(new Set());
    setPriceMin(""); setPriceMax(""); setOnlyDiscount(false); setMinRating(null);
    setInStockOnly(false); setSearchQuery("");
    const sp = new URLSearchParams(searchParams); sp.delete("category"); sp.delete("search"); setSearchParams(sp, { replace: true });
  };

  const activeFilterCount = selectedCategories.size + selectedTags.size + selectedBrands.size
    + (priceMin || priceMax ? 1 : 0) + (onlyDiscount ? 1 : 0) + (minRating !== null ? 1 : 0)
    + (searchQuery ? 1 : 0) + (inStockOnly ? 1 : 0);

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
    if (priceMin) result = result.filter((p) => p.priceNum >= parseFloat(priceMin));
    if (priceMax) result = result.filter((p) => p.priceNum <= parseFloat(priceMax));
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

  /* ── Pending filters pattern (Keychron-style) ── */
  const applyFilters = () => {
    setIsLoading(true);
    setPendingFilters(false);
    setTimeout(() => setIsLoading(false), 400);
  };

  const hasPendingChanges = useMemo(() => {
    /* simplified — always "apply" on mobile drawer */
    return pendingFilters;
  }, [pendingFilters]);

  /* ── Add to cart with toast ── */
  const handleAddToCart = useCallback((product: typeof allProducts[0]) => {
    addItem(product);
    toast.success(`${product.name.split(" ").slice(0, 3).join(" ")}… adicionado!`, {
      description: product.price,
      action: {
        label: "Ver carrinho",
        onClick: () => { },
      },
      duration: 3000,
    });
  }, [addItem]);

  /* ── Image carousel state ── */
  const getImageIndex = (productId: number, max: number) => {
    return Math.min(activeImageIndex[productId] ?? 0, max - 1);
  };
  const setImageIdx = (productId: number, idx: number, max: number) => {
    setActiveImageIndex((prev) => ({ ...prev, [productId]: Math.max(0, Math.min(idx, max - 1)) }));
  };

  /* ═══════════════════════════════════════════════════════
     FILTER SIDEBAR CONTENT
     ═══════════════════════════════════════════════════════ */

  const filterSidebar = (
    <div className="space-y-6">
      {/* Promoção */}
      <button
        onClick={() => setOnlyDiscount(!onlyDiscount)}
        className={`w-full flex items-center gap-3 px-4 py-3 border transition-all duration-200 ${onlyDiscount ? "border-foreground/20 bg-foreground/[0.04]" : "border-foreground/8 text-foreground/50 hover:border-foreground/15"
          }`}
        style={{ borderRadius: "var(--radius-button)" }}
      >
        <Percent size={14} />
        <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}>
          Em promoção
        </span>
        {onlyDiscount && <span className="ml-auto w-2 h-2 rounded-full bg-foreground" />}
      </button>

      {/* Categorias */}
      <FilterSection title="CATEGORIAS">
        {categories.map((cat) => {
          const count = allProducts.filter((p) => p.category === cat).length;
          const active = selectedCategories.has(cat);
          return (
            <button
              key={cat} onClick={() => toggleCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors ${active ? "bg-foreground/[0.04] text-foreground" : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.02]"
                }`}
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 border flex items-center justify-center transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20"}`} style={{ borderRadius: "4px" }}>
                  {active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                {cat}
              </div>
              <span className="text-foreground/20" style={{ fontSize: "11px" }}>{count}</span>
            </button>
          );
        })}
      </FilterSection>

      {/* Marca */}
      <FilterSection title="MARCA">
        {brandsList.map((brand) => {
          const count = allProducts.filter((p) => p.brand === brand).length;
          const active = selectedBrands.has(brand);
          return (
            <button
              key={brand} onClick={() => toggleSet(setSelectedBrands, brand)}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition-colors ${active ? "bg-foreground/[0.04] text-foreground" : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.02]"
                }`}
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 border flex items-center justify-center transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20"}`} style={{ borderRadius: "4px" }}>
                  {active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                {brand}
              </div>
              <span className="text-foreground/20" style={{ fontSize: "11px" }}>{count}</span>
            </button>
          );
        })}
      </FilterSection>

      {/* Tags */}
      <FilterSection title="TAGS">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = selectedTags.has(tag);
            return (
              <button key={tag} onClick={() => toggleSet(setSelectedTags, tag)}
                className={`px-4 py-2 border transition-colors ${active ? "border-foreground/20 bg-foreground/[0.04] text-foreground" : "border-foreground/10 text-foreground/40 hover:border-foreground/20"
                  }`}
                style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
              >{tag}</button>
            );
          })}
        </div>
      </FilterSection>

      {/* Preço — min/max inputs */}
      <FilterSection title="FAIXA DE PREÇO">
        <div className="flex gap-2 mb-3">
          <div className="flex-1">
            <label className="text-foreground/30 mb-1 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", letterSpacing: "0.05em" }}>De</label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => setPriceMin(e.target.value)}
              placeholder="0"
              className="w-full border border-foreground/10 px-3 py-2 bg-transparent text-foreground focus:border-foreground/30 focus:outline-none transition-colors"
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            />
          </div>
          <div className="flex-1">
            <label className="text-foreground/30 mb-1 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", letterSpacing: "0.05em" }}>Até</label>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => setPriceMax(e.target.value)}
              placeholder="99999"
              className="w-full border border-foreground/10 px-3 py-2 bg-transparent text-foreground focus:border-foreground/30 focus:outline-none transition-colors"
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            />
          </div>
        </div>
        {(priceMin || priceMax) && (
          <button onClick={() => { setPriceMin(""); setPriceMax(""); }}
            className="text-foreground/30 hover:text-foreground/60 transition-colors"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
          >Limpar preço</button>
        )}
      </FilterSection>

      {/* Avaliação */}
      <FilterSection title="AVALIAÇÃO">
        {[4.5, 4.0, 3.5].map((r) => {
          const active = minRating === r;
          return (
            <button key={r} onClick={() => setMinRating(active ? null : r)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${active ? "bg-foreground/[0.04] text-foreground" : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.02]"
                }`}
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >
              <span className={`w-3.5 h-3.5 border-2 rounded-full flex items-center justify-center transition-colors ${active ? "border-foreground" : "border-foreground/20"}`}>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-foreground" />}
              </span>
              <div className="flex items-center gap-1">
                <Star size={11} className="fill-foreground text-foreground" />
                {r}+ estrelas
              </div>
            </button>
          );
        })}
      </FilterSection>

      {/* Em estoque */}
      <FilterSection title="DISPONIBILIDADE">
        <button
          onClick={() => setInStockOnly(!inStockOnly)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 transition-colors ${inStockOnly ? "bg-foreground/[0.04] text-foreground" : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.02]"
            }`}
          style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
        >
          <span className={`w-4 h-4 border flex items-center justify-center transition-colors ${inStockOnly ? "border-foreground bg-foreground" : "border-foreground/20"}`} style={{ borderRadius: "4px" }}>
            {inStockOnly && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          Em estoque
        </button>
      </FilterSection>
    </div>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */

  return (
    <div ref={mainRef} className="pt-[92px] min-h-screen">
      {/* ── Hero Header ── */}
      <div className="px-5 md:px-8 pt-16 pb-12" style={{ background: isDark ? "#161617" : "#f5f5f7" }}>
        <div className="max-w-[1300px] mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <Link to="/" className="text-foreground/30 hover:text-foreground/60 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Home</Link>
            <span className="text-foreground/20" style={{ fontSize: "10px" }}>›</span>
            <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
              {initialCategory ? categoryMap[initialCategory] || "Produtos" : "Produtos"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}
              className={isDark ? "text-white" : "text-foreground"}
              style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(32px, 4vw, 48px)", fontWeight: "var(--font-weight-light)" }}
            >
              {initialCategory ? categoryMap[initialCategory] || "Todos os Produtos" : "Todos os Produtos"}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              className={isDark ? "text-white/40" : "text-foreground/40"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >
              {filtered.length} {filtered.length === 1 ? "produto" : "produtos"}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-5 md:px-8"><div className="h-px bg-foreground/5" /></div>

      {/* ── Main Content ── */}
      <div className="px-5 md:px-8 py-8">
        <div className="max-w-[1300px] mx-auto flex gap-12">
          {/* ── Sidebar (desktop) ── */}
          <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block w-[240px] flex-shrink-0 sticky top-[100px] self-start max-h-[calc(100vh-120px)] overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {filterSidebar}
          </motion.aside>

          {/* ── Products area ── */}
          <div className="flex-1 min-w-0">
            {/* Control bar */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-between mb-6"
            >
              <div className="flex items-center gap-3">
                {/* Mobile filter trigger */}
                <button onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 border border-foreground/10 text-foreground/50 hover:text-foreground transition-colors"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                >
                  <SlidersHorizontal size={13} /> Filtros
                  {activeFilterCount > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center" style={{ fontSize: "10px" }}>{activeFilterCount}</span>
                  )}
                </button>

                {/* Filter drawer trigger (desktop too) */}
                <button onClick={() => setFilterDrawerOpen(true)}
                  className="hidden lg:flex items-center gap-2 px-4 py-2 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20 transition-colors"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                >
                  <Filter size={12} /> Filter & Sort
                  {activeFilterCount > 0 && (
                    <span className="ml-1 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center" style={{ fontSize: "10px" }}>{activeFilterCount}</span>
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="relative">
                  <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20 transition-colors"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                  >
                    <ArrowUpDown size={12} />
                    {sortOptions.find((s) => s.value === sortBy)?.label}
                    <ChevronDown size={10} className={`transition-transform duration-200 ${sortDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: -5, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.97 }} transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 border border-foreground/10 shadow-2xl z-30 min-w-[200px] py-1 overflow-hidden"
                        style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1e1e20" : "#fff" }}
                      >
                        {sortOptions.map((opt) => (
                          <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 transition-colors ${sortBy === opt.value ? "text-foreground bg-foreground/[0.04]" : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.02]"
                              }`}
                            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                          >{opt.label}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Grid / List toggle */}
                <div className="hidden sm:flex border border-foreground/10 overflow-hidden" style={{ borderRadius: "var(--radius-button)" }}>
                  <button onClick={() => setGridMode("grid")}
                    className={`p-2 transition-colors ${gridMode === "grid" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/30 hover:text-foreground/50"}`}
                  ><Grid3X3 size={14} /></button>
                  <button onClick={() => setGridMode("list")}
                    className={`p-2 transition-colors ${gridMode === "list" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/30 hover:text-foreground/50"}`}
                  ><LayoutList size={14} /></button>
                </div>
              </div>
            </motion.div>

            {/* Active filter pills */}
            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap items-center gap-2 mb-6">
                  {searchQuery && <FilterPill label={`Busca: "${searchQuery}"`} onRemove={() => { setSearchQuery(""); const sp = new URLSearchParams(searchParams); sp.delete("search"); setSearchParams(sp, { replace: true }); }} />}
                  {[...selectedCategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleCategory(c)} />)}
                  {[...selectedBrands].map((b) => <FilterPill key={b} label={b} onRemove={() => toggleSet(setSelectedBrands, b)} />)}
                  {[...selectedTags].map((t) => <FilterPill key={t} label={t} onRemove={() => toggleSet(setSelectedTags, t)} />)}
                  {(priceMin || priceMax) && <FilterPill label={`R$ ${priceMin || "0"} – R$ ${priceMax || "∞"}`} onRemove={() => { setPriceMin(""); setPriceMax(""); }} />}
                  {onlyDiscount && <FilterPill label="Em promoção" onRemove={() => setOnlyDiscount(false)} />}
                  {minRating !== null && <FilterPill label={`${minRating}+ estrelas`} onRemove={() => setMinRating(null)} />}
                  {inStockOnly && <FilterPill label="Em estoque" onRemove={() => setInStockOnly(false)} />}
                  <button onClick={clearAll}
                    className="ml-1 text-foreground/30 hover:text-foreground/60 transition-colors"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
                  >
                    Limpar tudo
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Loading skeleton ── */}
            {isLoading ? (
              <div className={`grid gap-5 ${gridMode === "grid" ? `grid-cols-1 sm:grid-cols-2 xl:grid-cols-${colsCount}` : "space-y-3"}`}>
                {Array.from({ length: colsCount * 2 }).map((_, i) => (
                  <div key={i} className="animate-pulse" style={{ borderRadius: "var(--radius-card)" }}>
                    <div className="aspect-[4/3] bg-foreground/[0.04]" style={{ borderRadius: "var(--radius-card)" }} />
                    <div className="mt-3 h-3 bg-foreground/[0.04] w-20 rounded" />
                    <div className="mt-2 h-4 bg-foreground/[0.04] w-full rounded" />
                    <div className="mt-2 h-4 bg-foreground/[0.04] w-24 rounded" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground/[0.04] flex items-center justify-center">
                  <ShoppingBag size={24} className="text-foreground/20" />
                </div>
                <p className="text-foreground/30 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-light)" }}>Nenhum produto encontrado</p>
                <p className="text-foreground/20 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Tente ajustar os filtros para ver mais resultados.</p>
                <button onClick={clearAll}
                  className="px-6 py-2.5 border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                >Limpar filtros</button>
              </motion.div>
            ) : gridMode === "grid" ? (
              <div className={`grid gap-x-5 gap-y-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-${colsCount}`}>
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => {
                    const discount = getDiscount(product);
                    const productImages = product.images && product.images.length > 0 ? product.images : [product.image];
                    const imgIdx = getImageIndex(product.id, productImages.length);
                    const swatches = colorSwatches[product.id] ?? [{ color: "#3f3f46", label: "Default" }];

                    return (
                      <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.4) }}
                        className="group relative"
                      >
                        <div className="relative overflow-hidden mb-3 aspect-[4/3]" style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                          <Link to={`/produto/${product.id}`} className="block h-full">
                            <ImageWithFallback
                              src={productImages[imgIdx]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.08] transition-colors duration-500" />
                          </Link>

                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {discount > 0 && (
                              <span className="px-2 py-0.5 bg-foreground text-background" style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>
                                -{discount}%
                              </span>
                            )}
                            {product.badge && (
                              <span className={`px-2 py-0.5 text-white ${product.badge.toUpperCase().includes('BLUE') ? 'bg-blue-500' : product.badge.toUpperCase().includes('RED') ? 'bg-red-500' : product.badge.toUpperCase().includes('BROWN') ? 'bg-amber-700' : 'bg-foreground'}`}
                                style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>
                                {product.badge}
                              </span>
                            )}
                            {product.inStock === false && (
                              <span className="px-2 py-0.5 bg-foreground/50 text-background" style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "var(--font-weight-medium)" }}>
                                Esgotado
                              </span>
                            )}
                          </div>

                          {/* Category */}
                          <span className="absolute top-3 right-14 px-2 py-0.5 bg-black/25 backdrop-blur-sm text-white/70"
                            style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "9px", letterSpacing: "0.05em" }}
                          >{product.category}</span>

                          {/* Favorite + Quick View */}
                          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
                              className="w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300"
                            >
                              <Heart size={12} className={isFavorite(product.id) ? "fill-foreground text-foreground" : "text-white/80"} strokeWidth={1.5} />
                            </button>
                            <button onClick={(e) => { e.preventDefault(); setQuickViewProduct(product); }}
                              className="w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 delay-75"
                            >
                              <Eye size={12} className="text-white/80" />
                            </button>
                          </div>

                          {/* Carousel arrows (multi-image products) */}
                          {productImages.length > 1 && (
                            <>
                              <button
                                onClick={(e) => { e.preventDefault(); setImageIdx(product.id, imgIdx - 1, productImages.length); }}
                                className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white/80"
                              >
                                <ChevronLeft size={14} />
                              </button>
                              <button
                                onClick={(e) => { e.preventDefault(); setImageIdx(product.id, imgIdx + 1, productImages.length); }}
                                className="absolute right-14 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 text-white/80"
                              >
                                <ChevronRight size={14} />
                              </button>
                              {/* Dots */}
                              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                {productImages.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => { e.preventDefault(); setImageIdx(product.id, idx, productImages.length); }}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${idx === imgIdx ? "bg-white w-4" : "bg-white/40"}`}
                                  />
                                ))}
                              </div>
                            </>
                          )}

                          {/* Quick add button */}
                          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <button
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(product); }}
                              className="w-full py-2.5 bg-foreground/90 backdrop-blur-sm text-background flex items-center justify-center gap-2 hover:bg-foreground transition-colors"
                              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.04em" }}
                            >
                              <ShoppingBag size={12} /> ADICIONAR
                            </button>
                          </div>
                        </div>

                        {/* Product info — Keychron order: Rating → Name → Price */}
                        <div className="px-0.5">
                          {/* Rating FIRST */}
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Star size={10} className="fill-foreground text-foreground" />
                            <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                              {product.rating}
                            </span>
                            <span className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                              ({product.reviews})
                            </span>
                            {product.brand && (
                              <span className="text-foreground/20 ml-auto" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>{product.brand}</span>
                            )}
                          </div>

                          {/* Name */}
                          <Link to={`/produto/${product.id}`}>
                            <p className="text-foreground group-hover:text-foreground/70 transition-colors mb-1.5 truncate leading-snug"
                              style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "var(--font-weight-medium)", lineHeight: 1.3 }}>
                              {product.name}
                            </p>
                          </Link>

                          {/* Price */}
                          <div className="flex items-center gap-2">
                            <p className="text-foreground/80" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "500" }}>
                              {product.price}
                            </p>
                            {product.oldPrice && (
                              <p className="text-foreground/25 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                {product.oldPrice}
                              </p>
                            )}
                          </div>

                          {/* Color swatches */}
                          {swatches.length > 1 && (
                            <div className="flex items-center gap-1.5 mt-2.5">
                              {swatches.map((sw, idx) => (
                                <span
                                  key={idx}
                                  className="w-4 h-4 rounded-full border border-foreground/10 transition-transform hover:scale-125 cursor-pointer"
                                  style={{ backgroundColor: sw.color }}
                                  title={sw.label}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              /* ── LIST VIEW (Keychron-style dense comparison) ── */
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => {
                    const discount = getDiscount(product);
                    return (
                      <motion.div key={product.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, delay: i * 0.02 }}
                        className="group flex items-center gap-6 border border-foreground/5 hover:border-foreground/10 p-3 transition-all duration-300"
                        style={{ borderRadius: "var(--radius-card)" }}
                      >
                        <Link to={`/produto/${product.id}`} className="w-[120px] h-[120px] flex-shrink-0 overflow-hidden relative block" style={{ borderRadius: "var(--radius-button)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                          <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          {discount > 0 && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-foreground text-background" style={{ borderRadius: "100px", fontSize: "9px", fontWeight: "var(--font-weight-medium)" }}>-{discount}%</span>
                          )}
                        </Link>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-foreground/30 uppercase" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", letterSpacing: "0.05em" }}>{product.category}</span>
                            <Star size={10} className="fill-foreground text-foreground" />
                            <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>{product.rating}</span>
                            <span className="text-foreground/15" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>({product.reviews})</span>
                            {product.brand && <span className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>· {product.brand}</span>}
                          </div>
                          <p className="text-foreground group-hover:text-foreground/70 transition-colors truncate mb-1.5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: "var(--font-weight-medium)" }}>
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-foreground/80" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: "500" }}>{product.price}</p>
                            {product.oldPrice && <p className="text-foreground/25 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{product.oldPrice}</p>}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => toggleFavorite(product.id)}
                            className="w-9 h-9 border border-foreground/10 rounded-full flex items-center justify-center text-foreground/30 hover:text-foreground hover:border-foreground/20 transition-all"
                          ><Heart size={13} className={isFavorite(product.id) ? "fill-foreground text-foreground" : ""} strokeWidth={1.5} /></button>
                          <button onClick={() => handleAddToCart(product)}
                            className="flex items-center gap-2 px-4 py-2 bg-foreground/[0.04] hover:bg-foreground hover:text-background text-foreground/60 transition-all"
                            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.04em" }}
                          ><ShoppingBag size={12} /> ADICIONAR</button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination-like bottom CTA */}
            {filtered.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="text-center mt-16 pt-12 border-t border-foreground/5"
              >
                <p className="text-foreground/20 mb-5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                  {filtered.length} produto{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
         MOBILE FILTER DRAWER
         ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[320px] z-50 overflow-y-auto p-8"
              style={{ background: isDark ? "#161617" : "#fff", borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-foreground/70 tracking-[0.2em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>FILTROS</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-foreground/40 hover:text-foreground transition-colors"><X size={18} /></button>
              </div>
              {filterSidebar}
              {/* Apply button (mobile) */}
              <div className="sticky bottom-0 pt-4 mt-6">
                <button onClick={() => { applyFilters(); setMobileFiltersOpen(false); }}
                  className="w-full py-3 bg-foreground text-background font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", letterSpacing: "0.04em" }}
                >
                  <Check size={14} /> Mostrar {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
         FILTER DRAWER (desktop — Keychron style)
         ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setFilterDrawerOpen(false)}
            />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[360px] z-50 overflow-y-auto p-8"
              style={{ background: isDark ? "#161617" : "#fff", borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <span className="text-foreground/70 tracking-[0.2em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>FILTER & SORT</span>
                  {activeFilterCount > 0 && (
                    <p className="mt-1 text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                      {activeFilterCount} filtro{activeFilterCount !== 1 ? "s" : ""} ativo{activeFilterCount !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>
                <button onClick={() => setFilterDrawerOpen(false)} className="text-foreground/40 hover:text-foreground transition-colors"><X size={18} /></button>
              </div>
              {filterSidebar}
              {/* Apply + Show Results */}
              <div className="sticky bottom-0 pt-4 mt-6 space-y-2">
                <button onClick={() => { applyFilters(); setFilterDrawerOpen(false); }}
                  className="w-full py-3 bg-foreground text-background font-semibold flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", letterSpacing: "0.04em" }}
                >
                  <Check size={14} /> Mostrar {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </button>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll}
                    className="w-full py-3 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20 transition-colors"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                  >Limpar todos os filtros</button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ═══════════════════════════════════════════════════════
         QUICK VIEW MODAL
         ═══════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {quickViewProduct && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[700px] md:max-h-[80vh] z-50 overflow-y-auto p-8"
              style={{ background: isDark ? "#161617" : "#fff", borderRadius: "var(--radius-card)" }}
            >
              <button onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors"
              ><X size={18} /></button>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="aspect-square overflow-hidden" style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                  <ImageWithFallback src={quickViewProduct.image} alt={quickViewProduct.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <p className="text-foreground/30 uppercase mb-2" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", letterSpacing: "0.08em" }}>{quickViewProduct.category}</p>
                  <h3 className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)", lineHeight: 1.3 }}>{quickViewProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={12} className="fill-foreground text-foreground" />
                    <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{quickViewProduct.rating}</span>
                    <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>({quickViewProduct.reviews} avaliações)</span>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <p className="text-foreground/80" style={{ fontFamily: "var(--font-family-inter)", fontSize: "22px", fontWeight: "600" }}>{quickViewProduct.price}</p>
                    {quickViewProduct.oldPrice && (
                      <p className="text-foreground/25 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{quickViewProduct.oldPrice}</p>
                    )}
                  </div>
                  {quickViewProduct.description && (
                    <p className="text-foreground/40 mb-6 leading-relaxed" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", lineHeight: 1.6 }}>{quickViewProduct.description}</p>
                  )}
                  <div className="flex gap-3">
                    <button onClick={() => { handleAddToCart(quickViewProduct); setQuickViewProduct(null); }}
                      className="flex-1 py-3 bg-foreground text-background flex items-center justify-center gap-2 font-semibold transition-opacity hover:opacity-90"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", letterSpacing: "0.04em" }}
                    >
                      <ShoppingBag size={14} /> Adicionar
                    </button>
                    <Link to={`/produto/${quickViewProduct.id}`}
                      className="py-3 px-5 border border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/20 transition-colors flex items-center justify-center"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                    >
                      Ver detalhes <ArrowUpRight size={12} className="ml-1" />
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

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  return (
    <div>
      <button onClick={() => setExpanded(!expanded)} className="flex items-center justify-between w-full mb-3 group">
        <span className="text-foreground/70 tracking-[0.15em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>{title}</span>
        <ChevronDown size={12} className={`text-foreground/30 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden space-y-1">
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button onClick={onRemove}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/[0.04] text-foreground/70 border border-foreground/10 hover:border-foreground/20 transition-colors"
      style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
    >
      {label} <X size={10} />
    </button>
  );
}
