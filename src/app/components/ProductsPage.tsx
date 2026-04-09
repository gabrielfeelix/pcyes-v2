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
import { allProducts, allTags as productTags, brands as productBrands, categories as productCategories, type Product } from "./productsData";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { findProductBySwatch, getProductSwatches } from "./productPresentation";

const categoryMap: Record<string, string> = {
  ...Object.fromEntries(productCategories.map((category) => [category, category])),
  "Coolers": "Refrigeração",
  "Linha BrTT": "Periféricos",
};
const categories = Object.keys(categoryMap);
const allTags = productTags.filter((tag) => ["Gaming", "RGB", "Wireless", "Streaming", "Escritório"].includes(tag));
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
const brandsList = productBrands;
const GLOBAL_MIN = 0;
const GLOBAL_MAX = 15000;

function getDiscount(p: Product) {
  if (!p.oldPriceNum || p.oldPriceNum <= p.priceNum) return 0;
  return Math.round(((p.oldPriceNum - p.priceNum) / p.oldPriceNum) * 100);
}

function getProductSubcategory(product: Product) {
  const name = product.name.toLowerCase();
  const compactName = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (compactName.includes("teclado")) {
    const size = compactName.match(/\b(100|80|75|65|60)%/);
    return size ? `Teclados ${size[1]}%` : "Teclados";
  }
  if (name.includes("teclado")) return "Teclados";
  if (name.includes("mousepad") || name.includes("mouse pad")) return "Mousepads";
  if (name.includes("mouse")) return "Mouses";
  if (name.includes("headset") || name.includes("fone")) return "Headsets";
  if (name.includes("water cooler")) return "Water Coolers";
  if (name.includes("cooler")) return "Coolers";
  if (product.subcategory) return product.subcategory;
  return product.category;
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
    <div className="space-y-4 mt-2">
      {/* Slider track */}
      <div ref={trackRef} className="relative h-2 bg-foreground/[0.08] rounded-full cursor-pointer select-none">
        {/* Active range */}
        <div
          className="absolute top-0 h-full rounded-full bg-foreground"
          style={{ left: `${minPct}%`, width: `${maxPct - minPct}%` }}
        />
        {/* Min thumb */}
        <div
          onMouseDown={handlePointerDown("min")}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-foreground border-2 border-background shadow-md cursor-grab active:cursor-grabbing z-10"
          style={{ left: `calc(${minPct}% - 10px)` }}
          aria-label="Preço mínimo"
          role="slider"
        />
        {/* Max thumb */}
        <div
          onMouseDown={handlePointerDown("max")}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-foreground border-2 border-background shadow-md cursor-grab active:cursor-grabbing z-10"
          style={{ left: `calc(${maxPct}% - 10px)` }}
          aria-label="Preço máximo"
          role="slider"
        />
      </div>
      {/* Min / Max inputs */}
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-foreground/40 mb-1.5 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.06em" }}>MÍN</label>
          <input
            type="number" value={min} min={GLOBAL_MIN} max={max - 100}
            onChange={(e) => onMinChange(Math.max(GLOBAL_MIN, Math.min(parseInt(e.target.value) || 0, max - 100)))}
            onBlur={onApply}
            className="w-full border border-foreground/15 px-3 py-2 bg-transparent text-foreground focus:border-foreground/30 focus:outline-none transition-colors text-center"
            style={{ borderRadius: "6px", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
          />
        </div>
        <div className="flex-1">
          <label className="text-foreground/40 mb-1.5 block" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.06em" }}>MÁX</label>
          <input
            type="number" value={max} min={min + 100} max={GLOBAL_MAX}
            onChange={(e) => onMaxChange(Math.min(GLOBAL_MAX, Math.max(parseInt(e.target.value) || GLOBAL_MAX, min + 100)))}
            onBlur={onApply}
            className="w-full border border-foreground/15 px-3 py-2 bg-transparent text-foreground focus:border-foreground/30 focus:outline-none transition-colors text-center"
            style={{ borderRadius: "6px", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
          />
        </div>
      </div>
      {/* Visual labels */}
      <div className="flex justify-between" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", color: "var(--text-muted)" }}>
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
    initialCategory ? new Set([categoryMap[initialCategory] ?? initialCategory]) : new Set()
  );
  const [selectedSubcategories, setSelectedSubcategories] = useState<Set<string>>(new Set());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set());
  const [priceMin, setPriceMin] = useState(GLOBAL_MIN);
  const [priceMax, setPriceMax] = useState(GLOBAL_MAX);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
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
  const [selectedVariants, setSelectedVariants] = useState<Record<number, Product>>({});
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    categories: true, brands: true, tags: false, price: true, rating: false, promo: false,
  });

  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat && categoryMap[cat]) {
      setSelectedCategories(new Set([categoryMap[cat]]));
      setSelectedSubcategories(new Set());
    }
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
    setSelectedCategories(new Set()); setSelectedSubcategories(new Set()); setSelectedTags(new Set()); setSelectedBrands(new Set());
    setPriceMin(GLOBAL_MIN); setPriceMax(GLOBAL_MAX); setOnlyDiscount(false); setMinDiscount(null); setMinRating(null);
    setInStockOnly(false); setSearchQuery("");
    const sp = new URLSearchParams(searchParams); sp.delete("category"); sp.delete("search"); setSearchParams(sp, { replace: true });
  };

  const activeFilterCount = selectedCategories.size + selectedSubcategories.size + selectedTags.size + selectedBrands.size
    + (priceMin > GLOBAL_MIN || priceMax < GLOBAL_MAX ? 1 : 0) + (onlyDiscount ? 1 : 0)
    + (minDiscount !== null ? 1 : 0)
    + (minRating !== null ? 1 : 0) + (searchQuery ? 1 : 0) + (inStockOnly ? 1 : 0);

  /* ── Filtered + sorted products ── */
  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerQ) || p.category.toLowerCase().includes(lowerQ));
    }
    if (selectedCategories.size > 0) result = result.filter((p) => selectedCategories.has(p.category));
    if (selectedSubcategories.size > 0) result = result.filter((p) => selectedSubcategories.has(getProductSubcategory(p)));
    if (selectedTags.size > 0) result = result.filter((p) => p.tags.some((t) => selectedTags.has(t)));
    if (selectedBrands.size > 0) result = result.filter((p) => p.brand && selectedBrands.has(p.brand));
    if (priceMin > GLOBAL_MIN) result = result.filter((p) => p.priceNum >= priceMin);
    if (priceMax < GLOBAL_MAX) result = result.filter((p) => p.priceNum <= priceMax);
    if (onlyDiscount) result = result.filter((p) => p.oldPrice && p.oldPriceNum && p.oldPriceNum > p.priceNum);
    if (minDiscount !== null) result = result.filter((p) => getDiscount(p) >= minDiscount);
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
  }, [selectedCategories, selectedSubcategories, selectedTags, selectedBrands, priceMin, priceMax, onlyDiscount, minDiscount, minRating, inStockOnly, sortBy, searchQuery]);

  const subcategories = useMemo(() => {
    const productsForCurrentCategory = selectedCategories.size > 0
      ? allProducts.filter((product) => selectedCategories.has(product.category))
      : allProducts;

    return Array.from(new Set(productsForCurrentCategory.map(getProductSubcategory))).sort((a, b) => a.localeCompare(b));
  }, [selectedCategories]);

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
    <div className="space-y-6 pr-2">
      {/* Subcategorias */}
      <FilterSection title="Subcategorias" expanded={expandedSections.categories} onToggle={() => toggleSection("categories")}>
        {subcategories.map((subcat) => {
          const count = allProducts.filter((p) => {
            const categoryMatches = selectedCategories.size === 0 || selectedCategories.has(p.category);
            return categoryMatches && getProductSubcategory(p) === subcat;
          }).length;
          const active = selectedSubcategories.has(subcat);
          return (
            <label key={subcat} className="flex items-center gap-3 py-2 cursor-pointer group/item">
              <input type="checkbox" className="hidden" checked={active} onChange={() => toggleSet(setSelectedSubcategories, subcat)} />
              <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "4px" }}>
                {active && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span className="text-foreground/70 group-hover/item:text-foreground transition-colors flex-1 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{subcat}</span>
              <span className="text-foreground/30 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>({count})</span>
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
            <label key={brand} className="flex items-center gap-3 py-2 cursor-pointer group/item">
              <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "4px" }}>
                {active && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span className="text-foreground/70 group-hover/item:text-foreground transition-colors flex-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{brand}</span>
              <span className="text-foreground/30 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>({count})</span>
            </label>
          );
        })}
      </FilterSection>

      {/* Promoção */}
      <FilterSection title="Promo" expanded={expandedSections.promo} onToggle={() => toggleSection("promo")}>
        <label className="flex items-center gap-3 py-2 cursor-pointer group/item">
          <input type="checkbox" className="hidden" checked={onlyDiscount} onChange={() => setOnlyDiscount(!onlyDiscount)} />
          <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${onlyDiscount ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "4px" }}>
            {onlyDiscount && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span className="text-foreground/70 group-hover/item:text-foreground transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Em promoção</span>
        </label>
        {[10, 20, 30, 40].map((pct) => {
          const count = allProducts.filter((pr) => getDiscount(pr) >= pct).length;
          const active = minDiscount === pct;
          return (
            <label key={pct} className="flex items-center gap-3 py-2 cursor-pointer group/item">
              <input type="checkbox" className="hidden" checked={active} onChange={() => setMinDiscount(active ? null : pct)} />
              <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "4px" }}>
                {active && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
              </span>
              <span className="text-foreground/70 group-hover/item:text-foreground transition-colors flex-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>A partir de {pct}% OFF</span>
              <span className="text-foreground/30 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>({count})</span>
            </label>
          );
        })}
      </FilterSection>

      {/* Tags */}
      <FilterSection title="Tags" expanded={expandedSections.tags} onToggle={() => toggleSection("tags")}>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = selectedTags.has(tag);
            return (
              <button key={tag} onClick={() => toggleSet(setSelectedTags, tag)}
                className={`px-4 py-2 border transition-colors ${active ? "border-foreground/30 bg-foreground/5 text-foreground" : "border-foreground/10 text-foreground/50 hover:border-foreground/25"
                  }`}
                style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
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
            <label key={r} className="flex items-center gap-3 py-2 cursor-pointer group/item">
              <input type="radio" name="rating" className="hidden" checked={active} onChange={() => setMinRating(active ? null : r)} />
              <span className={`w-4 h-4 border-2 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${active ? "border-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`}>
                {active && <span className="w-2 h-2 rounded-full bg-foreground" />}
              </span>
              <div className="flex items-center gap-1.5">
                <Star size={14} className="fill-foreground text-foreground" />
                <span className="text-foreground/70 group-hover/item:text-foreground transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{r}+</span>
              </div>
            </label>
          );
        })}
      </FilterSection>

      {/* Em estoque */}
      <div>
        <label className="flex items-center gap-3 py-2 cursor-pointer group/item">
          <input type="checkbox" className="hidden" checked={inStockOnly} onChange={() => setInStockOnly(!inStockOnly)} />
          <span className={`w-4 h-4 border flex items-center justify-center flex-shrink-0 transition-colors ${inStockOnly ? "border-foreground bg-foreground" : "border-foreground/20 group-hover/item:border-foreground/40"}`} style={{ borderRadius: "4px" }}>
            {inStockOnly && <svg width="10" height="10" viewBox="0 0 8 8"><path d="M1.5 4L3 5.5L6.5 2.5" stroke={isDark ? "#0a0a0a" : "#fff"} strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
          </span>
          <span className="text-foreground/70 group-hover/item:text-foreground transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Em estoque</span>
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
      <div className="px-5 md:px-8 pt-10 pb-8" style={{ background: isDark ? "#161617" : "#f5f5f7" }}>
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div className="flex items-center gap-2 mb-5">
            <Link to="/" className="text-foreground/40 hover:text-foreground/80 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Home</Link>
            <span className="text-foreground/20" style={{ fontSize: "12px" }}>›</span>
            <span className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
              {initialCategory ? categoryMap[initialCategory] || "Produtos" : "Produtos"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              className={isDark ? "text-white" : "text-foreground"}
              style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(32px, 4vw, 44px)", fontWeight: "var(--font-weight-medium)" }}
            >
              {initialCategory ? categoryMap[initialCategory] || "Todos os Produtos" : "Todos os Produtos"}
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              className={isDark ? "text-white/50" : "text-foreground/50"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", whiteSpace: "nowrap" }}
            >
              {filtered.length} produto{filtered.length !== 1 ? "s" : ""}
            </motion.p>
          </div>
        </div>
      </div>

      {/* ── Main Content — Insider layout ── */}
      <div className="px-5 md:px-8 py-8">
        <div style={{ maxWidth: "1600px", margin: "0 auto" }}>
          <div className="flex gap-8 lg:gap-14">
            {/* ── Sidebar (Insider: narrow, left-aligned, auto-height) ── */}
            <aside className="hidden lg:block w-[240px] xl:w-[280px] flex-shrink-0">
              <div className="sticky top-[112px]">
                {filterSidebar}
              </div>
            </aside>

            {/* ── Products area ── */}
            <div className="flex-1 min-w-0">
              {/* Control bar */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-foreground/5">
                <div className="flex items-center gap-4">
                  <button onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 border border-foreground/15 text-foreground/70 hover:text-foreground transition-colors"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                  >
                    <SlidersHorizontal size={14} /> Filtros
                    {activeFilterCount > 0 && (
                      <span className="ml-1 w-5 h-5 rounded-full bg-foreground text-background flex items-center justify-center font-bold" style={{ fontSize: "11px" }}>{activeFilterCount}</span>
                    )}
                  </button>
                  <button onClick={() => setFilterDrawerOpen(true)}
                    className="hidden lg:flex items-center gap-2 text-foreground/50 hover:text-foreground/80 transition-colors"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                  >
                    <Filter size={14} /> Filtros
                    {activeFilterCount > 0 && (
                      <span className="ml-1 text-foreground/70 font-semibold">({activeFilterCount})</span>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Sort */}
                  <div className="relative">
                    <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                      className="flex items-center gap-2 text-foreground/50 hover:text-foreground/80 transition-colors"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                    >
                      <ArrowUpDown size={14} />
                      {sortOptions.find((s) => s.value === sortBy)?.label}
                      <ChevronDown size={12} className={`transition-transform duration-200 ${sortDropdownOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {sortDropdownOpen && (
                        <motion.div initial={{ opacity: 0, y: -5, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.97 }} transition={{ duration: 0.15 }}
                          className="absolute right-0 top-full mt-3 border border-foreground/10 shadow-xl z-30 min-w-[200px] py-2"
                          style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1e1e20" : "#fff" }}
                        >
                          {sortOptions.map((opt) => (
                            <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                              className={`w-full text-left px-4 py-2.5 transition-colors ${sortBy === opt.value ? "text-foreground bg-foreground/[0.06]" : "text-foreground/70 hover:text-foreground hover:bg-foreground/[0.03]"
                                }`}
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                            >{opt.label}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Grid / List */}
                  <div className="hidden sm:flex border border-foreground/10 overflow-hidden" style={{ borderRadius: "var(--radius-button)" }}>
                    <button onClick={() => setGridMode("grid")}
                      className={`p-2 transition-colors ${gridMode === "grid" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
                      aria-label="Visualização em grade"
                    ><Grid3X3 size={16} /></button>
                    <button onClick={() => setGridMode("list")}
                      className={`p-2 transition-colors ${gridMode === "list" ? "bg-foreground/[0.08] text-foreground" : "text-foreground/40 hover:text-foreground/60"}`}
                      aria-label="Visualização em lista"
                    ><LayoutList size={16} /></button>
                  </div>
                </div>
              </div>

              {/* Active filter pills */}
              <AnimatePresence>
                {activeFilterCount > 0 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap items-center gap-2 mb-6">
                    {searchQuery && <FilterPill label={`"${searchQuery}"`} onRemove={() => { setSearchQuery(""); const sp = new URLSearchParams(searchParams); sp.delete("search"); setSearchParams(sp, { replace: true }); }} />}
                    {[...selectedCategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleCategory(c)} />)}
                    {[...selectedSubcategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleSet(setSelectedSubcategories, c)} />)}
                    {[...selectedBrands].map((b) => <FilterPill key={b} label={b} onRemove={() => toggleSet(setSelectedBrands, b)} />)}
                    {[...selectedTags].map((t) => <FilterPill key={t} label={t} onRemove={() => toggleSet(setSelectedTags, t)} />)}
                    {(priceMin > GLOBAL_MIN || priceMax < GLOBAL_MAX) && <FilterPill label={`R$ ${priceMin} – R$ ${priceMax}`} onRemove={() => { setPriceMin(GLOBAL_MIN); setPriceMax(GLOBAL_MAX); }} />}
                    {onlyDiscount && <FilterPill label="Promoção" onRemove={() => setOnlyDiscount(false)} />}
                    {minDiscount !== null && <FilterPill label={`> ${minDiscount}% OFF`} onRemove={() => setMinDiscount(null)} />}
                    {minRating !== null && <FilterPill label={`${minRating}+ Estrelas`} onRemove={() => setMinRating(null)} />}
                    {inStockOnly && <FilterPill label="Em estoque" onRemove={() => setInStockOnly(false)} />}
                    
                    <button onClick={clearAll} className="text-foreground/50 hover:text-foreground underline px-2 py-1 text-[12px] font-inter transition-colors">Limpar tudo</button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Loading skeleton ── */}
              {isLoading ? (
                <div className={`grid gap-x-6 gap-y-10 ${gridMode === "grid" ? `grid-cols-1 sm:grid-cols-2 xl:grid-cols-${colsCount}` : "space-y-4"}`}>
                  {Array.from({ length: colsCount * 2 }).map((_, i) => (
                    <div key={i} className="animate-pulse" style={{ borderRadius: "var(--radius-card)" }}>
                      <div className="aspect-square bg-foreground/[0.05]" style={{ borderRadius: "var(--radius-card)" }} />
                      <div className="mt-4 h-4 bg-foreground/[0.05] w-20 rounded" />
                      <div className="mt-3 h-5 bg-foreground/[0.05] w-full rounded" />
                      <div className="mt-2 h-5 bg-foreground/[0.05] w-24 rounded" />
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-foreground/[0.05] flex items-center justify-center">
                    <ShoppingBag size={24} className="text-foreground/30" />
                  </div>
                  <p className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-medium)" }}>Nenhum produto encontrado</p>
                  <p className="text-foreground/50 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px" }}>Tente ajustar os filtros ou mudar os termos de busca.</p>
                  <button onClick={clearAll}
                    className="px-6 py-3 border border-foreground/15 text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-all font-medium"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                  >Limpar filtros</button>
                </motion.div>
              ) : gridMode === "grid" ? (
                <div className={`grid gap-x-6 gap-y-10 grid-cols-1 sm:grid-cols-2 xl:grid-cols-${colsCount}`}>
                  <AnimatePresence mode="popLayout">
                    {filtered.map((product, i) => {
                      const displayProduct = selectedVariants[product.id] ?? product;
                      const discount = getDiscount(displayProduct);
                      const productImages = displayProduct.images && displayProduct.images.length > 0 ? displayProduct.images : [displayProduct.image];
                      const imgIdx = getImageIndex(displayProduct.id, productImages.length);
                      const swatches = getProductSwatches(displayProduct);

                      return (
                        <motion.div key={product.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
                          transition={{ duration: 0.3, delay: Math.min(i * 0.025, 0.35) }}
                          className="group relative"
                        >
                          <div className="relative overflow-hidden mb-4 aspect-square" style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f0f0f0" }}>
                            <Link to={`/produto/${displayProduct.id}`} className="block h-full">
                              <ImageWithFallback
                                src={productImages[imgIdx]}
                                alt={displayProduct.name}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1s] ease-out"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.06] transition-colors duration-500" />
                            </Link>

                            {/* Badges — top-left corner */}
                            <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                              {discount > 0 && (
                                <span className="px-2.5 py-1 bg-red-600 text-white shadow-sm" style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.03em" }}>
                                  {discount}% OFF
                                </span>
                              )}
                              {displayProduct.badge && (
                                <span className={`px-2.5 py-1 text-white shadow-sm ${displayProduct.badge.toUpperCase().includes('BLUE') ? 'bg-blue-600' : displayProduct.badge.toUpperCase().includes('RED') ? 'bg-red-600' : displayProduct.badge.toUpperCase().includes('BROWN') ? 'bg-amber-700' : 'bg-foreground'}`}
                                  style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "600", letterSpacing: "0.03em" }}>
                                  {displayProduct.badge}
                                </span>
                              )}
                              {displayProduct.inStock === false && (
                                <span className="px-2.5 py-1 bg-foreground/80 text-background shadow-sm" style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "600" }}>
                                  Esgotado
                                </span>
                              )}
                            </div>

                            {/* Favorite + Quick View — top-right */}
                            <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                              <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(displayProduct.id); }}
                                className="w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-black/50 hover:scale-105"
                                aria-label={isFavorite(displayProduct.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                              >
                                <Heart size={16} className={isFavorite(displayProduct.id) ? "fill-red-500 text-red-500" : "text-white"} strokeWidth={2} />
                              </button>
                              <button onClick={(e) => { e.preventDefault(); setQuickViewProduct(displayProduct); }}
                                className="w-9 h-9 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 hover:bg-black/50 hover:scale-105 hidden lg:flex"
                                aria-label="Visualização Rápida"
                              >
                                <Eye size={16} className="text-white" />
                              </button>
                            </div>

                            {/* Carousel arrows (multi-image) */}
                            {productImages.length > 1 && (
                              <>
                                <button
                                  onClick={(e) => { e.preventDefault(); setImageIdx(displayProduct.id, imgIdx - 1, productImages.length); }}
                                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 text-white hover:bg-black/50 z-10"
                                  aria-label="Imagem anterior"
                                >
                                  <ChevronLeft size={18} />
                                </button>
                                <button
                                  onClick={(e) => { e.preventDefault(); setImageIdx(displayProduct.id, imgIdx + 1, productImages.length); }}
                                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 delay-75 text-white hover:bg-black/50 z-10"
                                  aria-label="Próxima imagem"
                                >
                                  <ChevronRight size={18} />
                                </button>
                                {/* Dots */}
                                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                                  {productImages.map((_, idx) => (
                                    <button key={idx}
                                      onClick={(e) => { e.preventDefault(); setImageIdx(displayProduct.id, idx, productImages.length); }}
                                      aria-label={`Ir para imagem ${idx + 1}`}
                                      className={`h-1.5 rounded-full transition-all ${idx === imgIdx ? "bg-white w-5" : "bg-white/50 w-1.5 hover:bg-white/80"}`}
                                    />
                                  ))}
                                </div>
                              </>
                            )}

                            {/* Quick add — Insider "Compra Rápida" style */}
                            <div className="absolute bottom-0 left-0 right-0 z-10">
                              <button
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddToCart(displayProduct); }}
                                className="w-full py-3.5 bg-foreground/95 backdrop-blur-md text-background flex items-center justify-center gap-2 lg:opacity-0 lg:translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "700", letterSpacing: "0.06em", textTransform: "uppercase" }}
                              >
                                <ShoppingBag size={14} /> Adicionar ao Carrinho
                              </button>
                            </div>
                          </div>

                          {/* Product info — Insider order: Swatches → Name → Rating → Price */}
                          <div className="px-1">
                            {/* Color swatches */}
                            {swatches.length > 1 && (
                              <div className="flex items-center gap-1.5 mb-3">
                                {swatches.map((sw) => (
                                  <button
                                    key={sw.productId}
                                    className={`w-4 h-4 rounded-full border border-foreground/15 transition-transform hover:scale-125 cursor-pointer ${
                                      sw.productId === displayProduct.id ? "ring-2 ring-primary/70 ring-offset-2 ring-offset-background" : ""
                                    }`}
                                    style={{ backgroundColor: sw.color }}
                                    title={sw.label}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      const variant = findProductBySwatch(sw);
                                      if (variant) setSelectedVariants((prev) => ({ ...prev, [product.id]: variant }));
                                    }}
                                  />
                                ))}
                              </div>
                            )}

                            {/* Name */}
                            <Link to={`/produto/${displayProduct.id}`}>
                              <p className="text-foreground group-hover:text-foreground/70 transition-colors mb-2 truncate leading-snug"
                                style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)", lineHeight: 1.4 }}>
                                {displayProduct.name}
                              </p>
                            </Link>

                            {/* Rating + Price inline */}
                            <div className="flex items-center justify-between mt-1">
                              <div className="flex items-center gap-1.5">
                                <Star size={12} className="fill-foreground text-foreground" />
                                <span className="text-foreground/60 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                                  {displayProduct.rating}
                                </span>
                                <span className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                  ({displayProduct.reviews})
                                </span>
                              </div>
                              <div className="text-right">
                                <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "16px", fontWeight: "700" }}>
                                  {displayProduct.price}
                                </p>
                                {displayProduct.oldPrice && (
                                  <p className="text-foreground/40 line-through mt-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>
                                    {displayProduct.oldPrice}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              ) : (
                /* ── LIST VIEW ── */
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {filtered.map((product, i) => {
                      const discount = getDiscount(product);
                      return (
                        <motion.div key={product.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25, delay: i * 0.02 }}
                          className="group flex flex-col sm:flex-row sm:items-center gap-5 border border-foreground/10 hover:border-foreground/20 p-4 transition-all duration-300"
                          style={{ borderRadius: "var(--radius-card)" }}
                        >
                          <Link to={`/produto/${product.id}`} className="w-full sm:w-[140px] aspect-square sm:h-[140px] flex-shrink-0 overflow-hidden relative block" style={{ borderRadius: "var(--radius-button)", background: isDark ? "#1a1a1c" : "#f0f0f0" }}>
                            <ImageWithFallback src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            {discount > 0 && (
                              <span className="absolute top-2 left-2 px-2 py-1 bg-red-600 text-white" style={{ borderRadius: "4px", fontSize: "11px", fontWeight: "700" }}>{discount}% OFF</span>
                            )}
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-foreground/40 uppercase font-semibold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.05em" }}>{product.category}</span>
                              {product.brand && <span className="text-foreground/30 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>· {product.brand}</span>}
                            </div>
                            <Link to={`/produto/${product.id}`}>
                              <p className="text-foreground group-hover:text-foreground/70 transition-colors mb-2 text-lg" style={{ fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-medium)", lineHeight: 1.3 }}>
                                {product.name}
                              </p>
                            </Link>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                              <p className="text-foreground text-xl" style={{ fontFamily: "var(--font-family-inter)", fontWeight: "700" }}>{product.price}</p>
                              {product.oldPrice && <p className="text-foreground/40 line-through text-sm" style={{ fontFamily: "var(--font-family-inter)" }}>{product.oldPrice}</p>}
                            </div>
                          </div>
                          <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 flex-shrink-0 mt-4 sm:mt-0">
                            <button onClick={() => toggleFavorite(product.id)}
                              className="w-10 h-10 border border-foreground/15 rounded-full flex items-center justify-center text-foreground/40 hover:text-foreground hover:border-foreground/30 transition-all bg-foreground/[0.02]"
                              aria-label={isFavorite(product.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                            ><Heart size={16} className={isFavorite(product.id) ? "fill-red-500 text-red-500" : ""} strokeWidth={2} /></button>
                            <button onClick={() => handleAddToCart(product)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-foreground text-background hover:opacity-90 transition-all font-semibold"
                              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                            ><ShoppingBag size={14} /> Adicionar</button>
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
              className="fixed left-0 top-0 bottom-0 w-[320px] max-w-[85vw] z-50 overflow-y-auto p-6"
              style={{ background: isDark ? "#161617" : "#fff", borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-foreground/70 tracking-[0.15em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-bold)" }}>FILTROS</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-foreground/40 hover:text-foreground transition-colors p-2" aria-label="Fechar filtros"><X size={20} /></button>
              </div>
              {filterSidebar}
              <div className="sticky bottom-0 pt-4 mt-8 bg-inherit">
                <button onClick={() => { applyFilters(); setMobileFiltersOpen(false); }}
                  className="w-full py-3.5 bg-foreground text-background font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-lg"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  <Check size={16} /> Mostrar {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Filter Drawer (desktop optional - used if they click Filter button instead of sidebar) ── */}
      <AnimatePresence>
        {filterDrawerOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setFilterDrawerOpen(false)}
            />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[360px] z-50 overflow-y-auto p-8 shadow-2xl"
              style={{ background: isDark ? "#161617" : "#fff", borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-foreground/70 tracking-[0.15em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-bold)" }}>FILTROS</span>
                <button onClick={() => setFilterDrawerOpen(false)} className="text-foreground/40 hover:text-foreground transition-colors p-2" aria-label="Fechar"><X size={20} /></button>
              </div>
              {filterSidebar}
              <div className="sticky bottom-0 pt-6 mt-8 space-y-3 bg-inherit pb-2">
                <button onClick={() => { applyFilters(); setFilterDrawerOpen(false); }}
                  className="w-full py-3.5 bg-foreground text-background font-bold flex items-center justify-center gap-2 transition-opacity hover:opacity-90 shadow-lg"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                >
                  <Check size={16} /> Mostrar {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
                </button>
                {activeFilterCount > 0 && (
                  <button onClick={clearAll}
                    className="w-full py-3 border border-foreground/15 text-foreground/60 hover:text-foreground hover:border-foreground/30 transition-colors font-medium"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
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
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[85vh] z-50 overflow-y-auto p-8 shadow-2xl"
              style={{ background: isDark ? "#161617" : "#fff", borderRadius: "var(--radius-card)" }}
            >
              <button onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-foreground/5 rounded-full text-foreground/50 hover:text-foreground hover:bg-foreground/10 transition-colors z-10"
                aria-label="Fechar"
              ><X size={20} /></button>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="aspect-square overflow-hidden" style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f0f0f0" }}>
                  <ImageWithFallback src={quickViewProduct.image} alt={quickViewProduct.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  {getDiscount(quickViewProduct) > 0 && (
                    <span className="absolute top-4 left-4 px-3 py-1.5 bg-red-600 text-white shadow-sm" style={{ borderRadius: "4px", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "700", letterSpacing: "0.03em" }}>
                      {getDiscount(quickViewProduct)}% OFF
                    </span>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <p className="text-foreground/40 uppercase mb-3 font-semibold tracking-wider" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{quickViewProduct.category}</p>
                  <h3 className="text-foreground mb-3 text-2xl md:text-3xl" style={{ fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-medium)", lineHeight: 1.2 }}>{quickViewProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-5">
                    <Star size={16} className="fill-foreground text-foreground" />
                    <span className="text-foreground/70 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{quickViewProduct.rating}</span>
                    <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>({quickViewProduct.reviews} avaliações)</span>
                  </div>
                  <div className="flex flex-col gap-1 mb-6">
                    {quickViewProduct.oldPrice && (
                      <p className="text-foreground/40 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px" }}>{quickViewProduct.oldPrice}</p>
                    )}
                    <p className="text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "28px", fontWeight: "700" }}>{quickViewProduct.price}</p>
                  </div>
                  {quickViewProduct.description && (
                    <p className="text-foreground/60 mb-8 leading-relaxed" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", lineHeight: 1.6 }}>{quickViewProduct.description}</p>
                  )}
                  <div className="flex gap-4 mt-auto">
                    <button onClick={() => { handleAddToCart(quickViewProduct); setQuickViewProduct(null); }}
                      className="flex-1 py-3.5 bg-foreground text-background flex items-center justify-center gap-2 font-bold transition-opacity hover:opacity-90 shadow-md"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", letterSpacing: "0.04em", textTransform: "uppercase" }}
                    >
                      <ShoppingBag size={16} /> Adicionar
                    </button>
                    <Link to={`/produto/${quickViewProduct.id}`}
                      className="py-3.5 px-6 border border-foreground/15 text-foreground/70 hover:text-foreground hover:border-foreground/30 transition-colors flex items-center justify-center font-semibold"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                    >
                      Detalhes <ArrowUpRight size={16} className="ml-1" />
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
    <div className="border-b border-foreground/5 py-4 last:border-0">
      <button onClick={toggle} className="flex items-center justify-between w-full mb-1 group outline-none" aria-expanded={open}>
        <span className="text-foreground/80 tracking-[0.08em] font-bold" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{title.toUpperCase()}</span>
        <ChevronDown size={14} className={`text-foreground/40 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
            <div className="pt-3 pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button onClick={onRemove}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-foreground/[0.06] text-foreground/80 border border-foreground/10 hover:border-foreground/25 hover:bg-foreground/[0.08] transition-colors font-medium"
      style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
      aria-label={`Remover filtro ${label}`}
    >
      {label} <X size={12} className="opacity-60" />
    </button>
  );
}
