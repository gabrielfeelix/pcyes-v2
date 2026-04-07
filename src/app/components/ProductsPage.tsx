import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { SlidersHorizontal, ArrowUpDown, ChevronDown, Grid3X3, LayoutList, Heart, ShoppingBag, Star, X, Percent, ArrowUpRight } from "lucide-react";
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
const priceRanges = [
  { label: "Até R$ 200", min: 0, max: 200 },
  { label: "R$ 200 – R$ 500", min: 200, max: 500 },
  { label: "R$ 500 – R$ 1.000", min: 500, max: 1000 },
  { label: "Acima de R$ 1.000", min: 1000, max: Infinity },
];
const sortOptions = [
  { label: "Relevância", value: "relevance" },
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
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState("relevance");
  const [gridMode, setGridMode] = useState<"grid" | "list">("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    categories: true, tags: true, price: true, brands: false, rating: false,
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

  const toggleSet = <T,>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, val: T) => {
    setter((prev) => { const n = new Set(prev); n.has(val) ? n.delete(val) : n.add(val); return n; });
  };
  const toggleCategory = (cat: string) => {
    toggleSet(setSelectedCategories, cat);
    if (selectedCategories.has(cat)) {
      const sp = new URLSearchParams(searchParams); sp.delete("category"); setSearchParams(sp, { replace: true });
    }
  };
  const toggleSection = (key: keyof typeof expandedSections) => setExpandedSections((p) => ({ ...p, [key]: !p[key] }));

  const clearAll = () => {
    setSelectedCategories(new Set()); setSelectedTags(new Set()); setSelectedBrands(new Set());
    setSelectedPriceRange(null); setOnlyDiscount(false); setMinRating(null); setSearchQuery("");
    const sp = new URLSearchParams(searchParams); sp.delete("category"); sp.delete("search"); setSearchParams(sp, { replace: true });
  };

  const filtered = useMemo(() => {
    let result = [...allProducts];
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(lowerQ) || p.category.toLowerCase().includes(lowerQ));
    }
    if (selectedCategories.size > 0) result = result.filter((p) => selectedCategories.has(p.category));
    if (selectedTags.size > 0) result = result.filter((p) => p.tags.some((t) => selectedTags.has(t)));
    if (selectedBrands.size > 0) result = result.filter((p) => p.brand && selectedBrands.has(p.brand));
    if (selectedPriceRange !== null) {
      const range = priceRanges[selectedPriceRange];
      result = result.filter((p) => p.priceNum >= range.min && p.priceNum < range.max);
    }
    if (onlyDiscount) result = result.filter((p) => p.oldPrice);
    if (minRating !== null) result = result.filter((p) => p.rating >= minRating);

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.priceNum - b.priceNum); break;
      case "price-desc": result.sort((a, b) => b.priceNum - a.priceNum); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      case "discount": result.sort((a, b) => getDiscount(b) - getDiscount(a)); break;
    }
    return result;
  }, [selectedCategories, selectedTags, selectedBrands, selectedPriceRange, onlyDiscount, minRating, sortBy, searchQuery]);

  const activeFilterCount = selectedCategories.size + selectedTags.size + selectedBrands.size + (selectedPriceRange !== null ? 1 : 0) + (onlyDiscount ? 1 : 0) + (minRating !== null ? 1 : 0) + (searchQuery ? 1 : 0);

  const filterSidebar = (
    <div className="space-y-8">
      <button
        onClick={() => setOnlyDiscount(!onlyDiscount)}
        className={`w-full flex items-center gap-3 px-4 py-3 border transition-all duration-300 cursor-pointer ${
          onlyDiscount ? "border-primary bg-primary/10 text-primary" : "border-foreground/8 text-foreground/50 hover:border-foreground/15"
        }`}
        style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
      >
        <Percent size={14} />
        Em promoção
        {onlyDiscount && <span className="ml-auto w-2 h-2 rounded-full bg-primary" />}
      </button>

      <div className="h-px bg-foreground/5" />

      <FilterSection title="CATEGORIAS" expanded={expandedSections.categories} onToggle={() => toggleSection("categories")}>
        {categories.map((cat) => {
          const count = allProducts.filter((p) => p.category === cat).length;
          const active = selectedCategories.has(cat);
          return (
            <button
              key={cat} onClick={() => toggleCategory(cat)}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition-all duration-300 cursor-pointer ${
                active ? "bg-primary/10 text-foreground" : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.03]"
              }`}
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 border flex items-center justify-center transition-all duration-300 ${active ? "border-primary bg-primary" : "border-foreground/20"}`} style={{ borderRadius: "4px" }}>
                  {active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                {cat}
              </div>
              <span className="text-foreground/20" style={{ fontSize: "11px" }}>{count}</span>
            </button>
          );
        })}
      </FilterSection>

      <div className="h-px bg-foreground/5" />

      <FilterSection title="MARCA" expanded={expandedSections.brands} onToggle={() => toggleSection("brands")}>
        {brandsList.map((brand) => {
          const count = allProducts.filter((p) => p.brand === brand).length;
          const active = selectedBrands.has(brand);
          return (
            <button
              key={brand} onClick={() => toggleSet(setSelectedBrands, brand)}
              className={`w-full flex items-center justify-between px-3 py-2.5 transition-all duration-300 cursor-pointer ${
                active ? "bg-primary/10 text-foreground" : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.03]"
              }`}
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >
              <div className="flex items-center gap-3">
                <span className={`w-4 h-4 border flex items-center justify-center transition-all duration-300 ${active ? "border-primary bg-primary" : "border-foreground/20"}`} style={{ borderRadius: "4px" }}>
                  {active && <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                </span>
                {brand}
              </div>
              <span className="text-foreground/20" style={{ fontSize: "11px" }}>{count}</span>
            </button>
          );
        })}
      </FilterSection>

      <div className="h-px bg-foreground/5" />

      <FilterSection title="TAGS" expanded={expandedSections.tags} onToggle={() => toggleSection("tags")}>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const active = selectedTags.has(tag);
            return (
              <button key={tag} onClick={() => toggleSet(setSelectedTags, tag)}
                className={`px-4 py-2 border transition-all duration-300 cursor-pointer ${
                  active ? "border-primary bg-primary/10 text-primary" : "border-foreground/10 text-foreground/40 hover:text-foreground/60 hover:border-foreground/20"
                }`}
                style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
              >{tag}</button>
            );
          })}
        </div>
      </FilterSection>

      <div className="h-px bg-foreground/5" />

      <FilterSection title="FAIXA DE PREÇO" expanded={expandedSections.price} onToggle={() => toggleSection("price")}>
        {priceRanges.map((range, idx) => {
          const active = selectedPriceRange === idx;
          return (
            <button key={range.label} onClick={() => setSelectedPriceRange(active ? null : idx)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-300 cursor-pointer ${
                active ? "bg-primary/10 text-foreground" : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.03]"
              }`}
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >
              <span className={`w-3.5 h-3.5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${active ? "border-primary" : "border-foreground/20"}`}>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </span>
              {range.label}
            </button>
          );
        })}
      </FilterSection>

      <div className="h-px bg-foreground/5" />

      <FilterSection title="AVALIAÇÃO" expanded={expandedSections.rating} onToggle={() => toggleSection("rating")}>
        {[4.5, 4.0, 3.5].map((r) => {
          const active = minRating === r;
          return (
            <button key={r} onClick={() => setMinRating(active ? null : r)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 transition-all duration-300 cursor-pointer ${
                active ? "bg-primary/10 text-foreground" : "text-foreground/50 hover:text-foreground/70 hover:bg-foreground/[0.03]"
              }`}
              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
            >
              <span className={`w-3.5 h-3.5 border-2 rounded-full flex items-center justify-center transition-all duration-300 ${active ? "border-primary" : "border-foreground/20"}`}>
                {active && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
              </span>
              <div className="flex items-center gap-1">
                <Star size={11} className="fill-primary text-primary" />
                {r}+ estrelas
              </div>
            </button>
          );
        })}
      </FilterSection>

      {activeFilterCount > 0 && (
        <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={clearAll}
          className="w-full py-2.5 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/25 transition-all duration-300 cursor-pointer"
          style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
        >
          Limpar filtros ({activeFilterCount})
        </motion.button>
      )}
    </div>
  );

  return (
    <div className="pt-[92px]">
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

      <div className="px-5 md:px-8 py-12">
        <div className="max-w-[1300px] mx-auto flex gap-12">
          <motion.aside initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block w-[240px] flex-shrink-0 sticky top-[100px] self-start max-h-[calc(100vh-120px)] overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {filterSidebar}
          </motion.aside>

          <div className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-between mb-8"
            >
              <button onClick={() => setMobileFiltersOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-foreground/10 text-foreground/50 hover:text-foreground transition-all duration-300 cursor-pointer"
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
              >
                <SlidersHorizontal size={13} /> Filtros
                {activeFilterCount > 0 && <span className="ml-1 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center" style={{ fontSize: "10px" }}>{activeFilterCount}</span>}
              </button>
              <div className="hidden lg:block" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <button onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="flex items-center gap-2 px-4 py-2 border border-foreground/10 text-foreground/50 hover:text-foreground hover:border-foreground/20 transition-all duration-300 cursor-pointer"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                  >
                    <ArrowUpDown size={12} />
                    {sortOptions.find((s) => s.value === sortBy)?.label}
                    <ChevronDown size={10} className={`transition-transform duration-200 ${sortDropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {sortDropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: -5, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.97 }} transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 border border-foreground/10 shadow-2xl z-30 min-w-[180px] py-1 overflow-hidden"
                        style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1e1e20" : "#fff" }}
                      >
                        {sortOptions.map((opt) => (
                          <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2.5 transition-colors duration-200 cursor-pointer ${
                              sortBy === opt.value ? "text-primary bg-primary/5" : "text-foreground/60 hover:text-foreground hover:bg-foreground/[0.03]"
                            }`}
                            style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                          >{opt.label}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="hidden sm:flex border border-foreground/10 overflow-hidden" style={{ borderRadius: "var(--radius-button)" }}>
                  <button onClick={() => setGridMode("grid")}
                    className={`p-2 transition-colors duration-200 cursor-pointer ${gridMode === "grid" ? "bg-foreground/10 text-foreground" : "text-foreground/30 hover:text-foreground/50"}`}
                  ><Grid3X3 size={14} /></button>
                  <button onClick={() => setGridMode("list")}
                    className={`p-2 transition-colors duration-200 cursor-pointer ${gridMode === "list" ? "bg-foreground/10 text-foreground" : "text-foreground/30 hover:text-foreground/50"}`}
                  ><LayoutList size={14} /></button>
                </div>
              </div>
            </motion.div>

            <AnimatePresence>
              {activeFilterCount > 0 && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-wrap gap-2 mb-8 overflow-hidden">
                  {searchQuery && <FilterPill label={`Busca: "${searchQuery}"`} onRemove={() => { setSearchQuery(""); const sp = new URLSearchParams(searchParams); sp.delete("search"); setSearchParams(sp, { replace: true }); }} />}
                  {[...selectedCategories].map((c) => <FilterPill key={c} label={c} onRemove={() => toggleCategory(c)} />)}
                  {[...selectedBrands].map((b) => <FilterPill key={b} label={b} onRemove={() => toggleSet(setSelectedBrands, b)} />)}
                  {[...selectedTags].map((t) => <FilterPill key={t} label={t} onRemove={() => toggleSet(setSelectedTags, t)} />)}
                  {selectedPriceRange !== null && <FilterPill label={priceRanges[selectedPriceRange].label} onRemove={() => setSelectedPriceRange(null)} />}
                  {onlyDiscount && <FilterPill label="Em promoção" onRemove={() => setOnlyDiscount(false)} />}
                  {minRating !== null && <FilterPill label={`${minRating}+ estrelas`} onRemove={() => setMinRating(null)} />}
                </motion.div>
              )}
            </AnimatePresence>

            {filtered.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
                <p className="text-foreground/30 mb-4" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-light)" }}>Nenhum produto encontrado</p>
                <p className="text-foreground/20 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Tente ajustar os filtros para ver mais resultados.</p>
                <button onClick={clearAll}
                  className="px-6 py-2.5 border border-foreground/15 text-foreground/50 hover:text-foreground hover:border-foreground/30 transition-all duration-300 cursor-pointer"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                >Limpar filtros</button>
              </motion.div>
            ) : gridMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => {
                    const discount = getDiscount(product);
                    return (
                      <motion.div key={product.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.4, delay: i * 0.04 }} className="group"
                      >
                        <div className="relative overflow-hidden mb-4 aspect-square" style={{ borderRadius: "var(--radius-card)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>                          <Link to={`/produto/${product.id}`}>
                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[1.2s] ease-out" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-500" />
                          </Link>

                          {discount > 0 && (
                            <span className="absolute top-4 left-4 px-2.5 py-1 bg-green-600 text-white" style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>
                              -{discount}%
                            </span>
                          )}
                          {product.badge && (
                            <span className={`absolute left-4 px-2.5 py-1 ${product.badge.toUpperCase().includes('BLUE') ? 'bg-blue-500 text-white' : product.badge.toUpperCase().includes('RED') ? 'bg-red-500 text-white' : product.badge.toUpperCase().includes('BROWN') ? 'bg-amber-700 text-white' : 'bg-primary text-white'} ${discount > 0 ? 'top-12' : 'top-4'}`} style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>
                              {product.badge}
                            </span>
                          )}

                          <span className="absolute top-4 right-12 px-2.5 py-1 bg-black/30 backdrop-blur-sm text-white/80"
                            style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "9px", letterSpacing: "0.05em" }}
                          >{product.category}</span>

                          <button onClick={() => toggleFavorite(product.id)}
                            className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400 cursor-pointer"
                          >
                            <Heart size={13} className={isFavorite(product.id) ? "fill-primary text-primary" : "text-white/80"} strokeWidth={1.5} />
                          </button>

                          <div className="absolute bottom-4 left-4 right-4 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400">
                            <button onClick={() => addItem(product)}
                              className="w-full py-2.5 bg-white/95 backdrop-blur-sm text-black flex items-center justify-center gap-2 hover:bg-primary hover:text-white transition-colors duration-300 cursor-pointer"
                              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                            >
                              <ShoppingBag size={13} strokeWidth={1.5} /> Adicionar <span className="hidden sm:inline">ao carrinho</span>
                            </button>
                          </div>
                        </div>

                        <div className="px-0.5">
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Star size={11} className="fill-primary text-primary" />
                            <span className="text-foreground/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{product.rating}</span>
                            <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>({product.reviews})</span>
                            {product.brand && <span className="text-foreground/20 ml-auto" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>{product.brand}</span>}
                          </div>
                          <p className="text-foreground group-hover:text-primary transition-colors duration-300 mb-1.5 truncate" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: "var(--font-weight-medium)" }}>
                            <Link to={`/produto/${product.id}`}>{product.name}</Link>
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{product.price}</p>
                            {product.oldPrice && (
                              <p className="text-foreground/25 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{product.oldPrice}</p>
                            )}
                            {discount > 0 && (
                              <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>-{discount}%</span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            ) : (
              <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => {
                    const discount = getDiscount(product);
                    return (
                      <motion.div key={product.id} layout initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.35, delay: i * 0.03 }}
                        className="group flex items-center gap-6 border border-foreground/5 hover:border-foreground/10 p-3 transition-all duration-400"
                        style={{ borderRadius: "var(--radius-card)" }}
                      >
                        <div className="w-[100px] h-[100px] flex-shrink-0 overflow-hidden relative" style={{ borderRadius: "var(--radius-button)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                          <Link to={`/produto/${product.id}`}>
                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          </Link>
                          {discount > 0 && (
                            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-green-600 text-white" style={{ borderRadius: "100px", fontSize: "8px", fontWeight: "var(--font-weight-medium)" }}>-{discount}%</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", letterSpacing: "0.05em" }}>{product.category.toUpperCase()}</span>
                            <Star size={10} className="fill-primary text-primary" />
                            <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>{product.rating}</span>
                            {product.brand && <span className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>· {product.brand}</span>}
                          </div>
                          <p className="text-foreground group-hover:text-primary transition-colors duration-300 truncate mb-0.5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "15px", fontWeight: "var(--font-weight-medium)" }}>
                            <Link to={`/produto/${product.id}`}>{product.name}</Link>
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>{product.price}</p>
                            {product.oldPrice && <p className="text-foreground/25 line-through" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{product.oldPrice}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => toggleFavorite(product.id)}
                            className="w-9 h-9 border border-foreground/10 rounded-full flex items-center justify-center text-foreground/30 hover:text-primary hover:border-primary/30 transition-all duration-300 cursor-pointer"
                          ><Heart size={13} className={isFavorite(product.id) ? "fill-primary text-primary" : ""} strokeWidth={1.5} /></button>
                          <button onClick={() => addItem(product)}
                            className="flex items-center gap-2 px-4 py-2 bg-foreground/5 hover:bg-primary text-foreground/60 hover:text-white transition-all duration-300 cursor-pointer"
                            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}
                          ><ShoppingBag size={13} strokeWidth={1.5} /> Adicionar</button>
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

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setMobileFiltersOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-[300px] bg-background border-r border-foreground/5 z-50 p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-10">
                <span className="text-foreground/70 tracking-[0.2em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>FILTROS</span>
                <button onClick={() => setMobileFiltersOpen(false)} className="text-foreground/40 hover:text-foreground transition-colors cursor-pointer"><X size={18} /></button>
              </div>
              {filterSidebar}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

function FilterSection({ title, expanded, onToggle, children }: { title: string; expanded: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div>
      <button onClick={onToggle} className="flex items-center justify-between w-full mb-4 group cursor-pointer">
        <span className="text-foreground/70 tracking-[0.2em]" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>{title}</span>
        <ChevronDown size={12} className={`text-foreground/30 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden space-y-1">
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
      className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary border border-primary/15 cursor-pointer"
      style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "11px" }}
    >
      {label} <X size={10} />
    </button>
  );
}
