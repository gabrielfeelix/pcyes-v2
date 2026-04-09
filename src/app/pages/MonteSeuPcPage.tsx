import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Cpu,
  Expand,
  HardDrive,
  Monitor,
  RotateCcw,
  Save,
  Settings,
  Share2,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { cn } from "../components/ui/utils";

/* ───────────────────── DATA ───────────────────── */

type Option = {
  id: string;
  name: string;
  price: number;
  image?: string;
  type?: string;
  standard?: boolean;
  req?: string[];
};

type Category = {
  id: string;
  title: string;
  icon: React.ReactNode;
  options: Option[];
};

const categories: Category[] = [
  {
    id: "case",
    title: "Gabinete",
    icon: <Monitor className="w-4 h-4" />,
    options: [
      {
        id: "case-1",
        name: "PCYES Boreal Preto",
        price: 350,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1200",
        type: "black",
      },
      {
        id: "case-2",
        name: "PCYES Boreal Branco",
        price: 380,
        image:
          "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1200",
        type: "white",
        standard: true,
      },
      {
        id: "case-3",
        name: "PCYES RGB Master",
        price: 450,
        image:
          "https://images.unsplash.com/photo-1624704791357-1fb4603378b2?auto=format&fit=crop&q=80&w=1200",
        type: "rgb",
      },
    ],
  },
  {
    id: "cpu",
    title: "Processador",
    icon: <Cpu className="w-4 h-4" />,
    options: [
      { id: "cpu-1", name: "Intel Core i5-13400F", price: 1200, standard: true },
      { id: "cpu-2", name: "Intel Core i7-13700K", price: 2500 },
      { id: "cpu-3", name: "AMD Ryzen 5 7600", price: 1400 },
      { id: "cpu-4", name: "AMD Ryzen 7 7800X3D", price: 2800 },
    ],
  },
  {
    id: "motherboard",
    title: "Placa Mãe",
    icon: <Settings className="w-4 h-4" />,
    options: [
      { id: "mb-1", name: "B760M AORUS ELITE (Intel)", price: 1100, req: ["cpu-1", "cpu-2"], standard: true },
      { id: "mb-2", name: "Z790 GAMING X (Intel)", price: 1800, req: ["cpu-1", "cpu-2"] },
      { id: "mb-3", name: "B650M TUF GAMING (AMD)", price: 1300, req: ["cpu-3", "cpu-4"] },
      { id: "mb-4", name: "X670E ROG STRIX (AMD)", price: 2500, req: ["cpu-3", "cpu-4"] },
    ],
  },
  {
    id: "ram",
    title: "Memória RAM",
    icon: <Zap className="w-4 h-4" />,
    options: [
      { id: "ram-1", name: "16GB (2x8GB) DDR5 5200MHz", price: 400, standard: true },
      { id: "ram-2", name: "32GB (2x16GB) DDR5 6000MHz", price: 800 },
      { id: "ram-3", name: "64GB (2x32GB) DDR5 6400MHz", price: 1600 },
    ],
  },
  {
    id: "gpu",
    title: "Placa de Vídeo",
    icon: <Monitor className="w-4 h-4" />,
    options: [
      { id: "gpu-1", name: "RTX 4060 8GB", price: 1800, standard: true },
      { id: "gpu-2", name: "RTX 4070 SUPER 12GB", price: 3800 },
      { id: "gpu-3", name: "RX 7800 XT 16GB", price: 3500 },
      { id: "gpu-4", name: "RTX 4090 24GB", price: 12000 },
    ],
  },
  {
    id: "storage",
    title: "Armazenamento",
    icon: <HardDrive className="w-4 h-4" />,
    options: [
      { id: "storage-1", name: "SSD 1TB NVMe M.2 Gen4", price: 450, standard: true },
      { id: "storage-2", name: "SSD 2TB NVMe M.2 Gen4", price: 850 },
      { id: "storage-3", name: "SSD 4TB NVMe M.2 Gen4", price: 1800 },
    ],
  },
  {
    id: "psu",
    title: "Fonte de Alimentação",
    icon: <Zap className="w-4 h-4" />,
    options: [
      { id: "psu-1", name: "PCYES Spark 600W 80+ Bronze", price: 300, standard: true },
      { id: "psu-2", name: "PCYES Electro V2 750W 80+ Gold", price: 550 },
      { id: "psu-3", name: "PCYES Electro V2 850W 80+ Gold", price: 650 },
      { id: "psu-4", name: "PCYES Titan 1000W 80+ Platinum", price: 1200 },
    ],
  },
];

/* ───────────────────── UTILS ───────────────────── */

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

/* ───────────────────── AMBIENT HELPERS ───────────────────── */

interface AmbientConfig {
  bg: string;
  glow: string;
  accent: string;
}

const getAmbient = (type?: string): AmbientConfig => {
  switch (type) {
    case "white":
      return {
        bg: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.08), transparent 70%)",
        glow: "rgba(255,255,255,0.12)",
        accent: "#ffffff",
      };
    case "rgb":
      return {
        bg: "radial-gradient(ellipse at 50% 50%, rgba(139,92,246,0.15), transparent 70%)",
        glow: "rgba(139,92,246,0.20)",
        accent: "#8b5cf6",
      };
    default:
      return {
        bg: "radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.04), transparent 70%)",
        glow: "rgba(255,255,255,0.06)",
        accent: "#a1a1aa",
      };
  }
};

/* ───────────────────── SWATCH COLORS ───────────────────── */

const swatchMap: Record<string, string[]> = {
  case: [
    "from-zinc-800 to-zinc-900",
    "from-zinc-200 to-zinc-300",
    "from-violet-600 to-fuchsia-600",
  ],
};

const swatchLabels: Record<string, string[]> = {
  case: ["Preto", "Branco", "RGB"],
};

/* ───────────────────── THUMBNAIL VIEWS ───────────────────── */

const viewAngles = [
  { label: "Frontal", icon: "⬛" },
  { label: "Lateral", icon: "▭" },
  { label: "Interior", icon: "◻" },
  { label: "Topo", icon: "▬" },
];

/* ═══════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════ */

export function MonteSeuPcPage() {
  const [selections, setSelections] = useState<Record<string, string>>({
    case: "case-2",
    cpu: "cpu-1",
    motherboard: "mb-1",
    ram: "ram-1",
    gpu: "gpu-1",
    storage: "storage-1",
    psu: "psu-1",
  });
  const [activeCategory, setActiveCategory] = useState<string | null>("case");
  const [activeView, setActiveView] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["case"])
  );

  /* ── Derived ── */

  const currentCase = useMemo(() => {
    const cat = categories.find((c) => c.id === "case");
    return cat?.options.find((o) => o.id === selections.case);
  }, [selections.case]);

  const ambient = useMemo(() => getAmbient(currentCase?.type), [currentCase?.type]);

  const priceBreakdown = useMemo(() => {
    let base = 0;
    let equipment = 0;
    Object.entries(selections).forEach(([catId, optId]) => {
      const cat = categories.find((c) => c.id === catId);
      const opt = cat?.options.find((o) => o.id === optId);
      if (!opt) return;
      if (opt.standard) {
        base += opt.price;
      } else {
        equipment += opt.price;
      }
    });
    return { base, equipment, total: base + equipment };
  }, [selections]);

  /* ── Handlers ── */

  const handleSelect = (catId: string, optId: string) => {
    setSelections((prev) => ({ ...prev, [catId]: optId }));
    const idx = categories.findIndex((c) => c.id === catId);
    if (idx < categories.length - 1) {
      setActiveCategory(categories[idx + 1].id);
    }
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* ── Render helpers ── */

  const isExpanded = (id: string) => expandedSections.has(id);

  const isSelected = (catId: string, optId: string) =>
    selections[catId] === optId;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5] md:overflow-hidden">
      {/* ── Sticky top bar (Porsche-style) ── */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-white/[0.06] bg-[#0a0a0a]/90 backdrop-blur-xl px-4 py-3 md:px-6 lg:px-8">
        {/* Left actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-sm text-zinc-400 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <div className="h-4 w-px bg-white/10" />
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-sm text-zinc-400 hover:text-white"
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Salvar</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-sm text-zinc-400 hover:text-white"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Compartilhar</span>
          </Button>
        </div>

        {/* Center — model name */}
        <div className="hidden text-center md:block">
          <p className="text-sm font-semibold tracking-wide">
            PCYES BOREAL
            <span className="ml-1.5 text-xs font-normal text-zinc-500">
              2025
            </span>
          </p>
        </div>

        {/* Right — price */}
        <div className="text-right">
          <p className="text-lg font-bold tabular-nums">
            {formatCurrency(priceBreakdown.total)}
          </p>
          <p className="text-[10px] text-zinc-500">
            Valores não incluem frete
          </p>
        </div>
      </header>

      {/* ── Main split ── */}
      <div className="flex flex-col md:h-[calc(100vh-53px)] md:flex-row">
        {/* ═══════════ LEFT: PREVIEW ═══════════ */}
        <section className="relative flex h-[45vh] w-full items-center justify-center overflow-hidden border-r border-white/[0.04] md:h-full md:w-[60%] lg:w-[62%]">
          {/* Ambient background */}
          <div
            className="absolute inset-0 transition-all duration-700"
            style={{ background: ambient.bg }}
          />

          {/* Glow ring */}
          <div
            className="pointer-events-none absolute h-[320px] w-[320px] rounded-full blur-[120px] transition-all duration-700 md:h-[420px] md:w-[420px]"
            style={{ backgroundColor: ambient.glow }}
          />

          {/* Main image */}
          <div className="relative z-10 flex h-full w-full items-center justify-center px-6">
            {currentCase?.image ? (
              <img
                src={currentCase.image}
                alt="PC Configurator"
                className="h-full w-full max-w-[640px] object-contain transition-all duration-500"
              />
            ) : (
              <div className="h-48 w-48 animate-pulse rounded-2xl bg-white/[0.04]" />
            )}
          </div>

          {/* Fullscreen button */}
          <button className="absolute right-4 top-4 z-20 rounded-lg bg-white/[0.06] p-2.5 text-zinc-300 transition hover:bg-white/[0.12]">
            <Expand className="h-4 w-4" />
          </button>

          {/* View thumbnails (Porsche-style bottom strip) */}
          <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {viewAngles.map((view, i) => (
              <button
                key={view.label}
                onClick={() => setActiveView(i)}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-lg border text-xs font-medium transition",
                  activeView === i
                    ? "border-white/30 bg-white/[0.1]"
                    : "border-white/[0.06] bg-white/[0.04] text-zinc-500 hover:border-white/20 hover:text-zinc-300"
                )}
                title={view.label}
              >
                {view.icon}
              </button>
            ))}
          </div>

          {/* Active selections badge strip */}
          <div className="absolute bottom-20 left-4 right-4 z-20 hidden flex-wrap gap-1.5 md:flex">
            {Object.entries(selections)
              .filter(([c]) => c !== "case")
              .map(([catId, optId]) => {
                const cat = categories.find((c) => c.id === catId);
                const opt = cat?.options.find((o) => o.id === optId);
                if (!opt) return null;
                return (
                  <Badge
                    key={catId}
                    variant="outline"
                    className="border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] text-zinc-400"
                  >
                    {cat?.title}: {opt.name}
                  </Badge>
                );
              })}
          </div>
        </section>

        {/* ═══════════ RIGHT: CONFIG PANEL ═══════════ */}
        <aside className="relative flex h-auto w-full flex-col md:h-full md:w-[40%] md:overflow-hidden lg:w-[38%]">
          {/* Price breakdown */}
          <div className="border-b border-white/[0.06] px-6 py-5">
            <div className="mb-3">
              <h1 className="text-xl font-semibold tracking-tight">
                Monte seu PC
              </h1>
              <p className="mt-0.5 text-xs text-zinc-500">
                Personalize sua máquina com as melhores peças.
              </p>
            </div>

            <div className="space-y-1 text-xs text-zinc-500">
              <div className="flex justify-between">
                <span>Preço Base</span>
                <span className="tabular-nums text-zinc-300">
                  {formatCurrency(priceBreakdown.base)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Equipamentos</span>
                <span className="tabular-nums text-zinc-300">
                  {formatCurrency(priceBreakdown.equipment)}
                </span>
              </div>
              <div className="my-1 h-px bg-white/[0.06]" />
              <div className="flex justify-between text-sm font-semibold text-white">
                <span>Preço Total</span>
                <span className="tabular-nums text-lg">
                  {formatCurrency(priceBreakdown.total)}
                </span>
              </div>
            </div>
          </div>

          {/* ── Sections list ── */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-48 pt-2 md:pb-40">
            {categories.map((category) => {
              const selOpt = category.options.find(
                (o) => o.id === selections[category.id]
              );
              const hasSwatches = swatchMap[category.id];
              const isCase = category.id === "case";

              return (
                <div
                  key={category.id}
                  className="border-b border-white/[0.04] py-4"
                >
                  {/* Section header */}
                  <button
                    onClick={() => toggleSection(category.id)}
                    className="group flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-white/[0.05] p-2 text-zinc-400">
                        {category.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">
                          {category.title}
                        </p>
                        {selOpt && (
                          <p className="mt-0.5 truncate text-xs text-zinc-500">
                            {selOpt.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {selOpt && (
                        <span
                          className={cn(
                            "text-xs tabular-nums",
                            selOpt.standard
                              ? "text-emerald-500/80"
                              : "text-zinc-300"
                          )}
                        >
                          {selOpt.standard
                            ? "Série"
                            : `+ ${formatCurrency(selOpt.price)}`}
                        </span>
                      )}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 text-zinc-500 transition-transform duration-200",
                          isExpanded(category.id) && "rotate-180"
                        )}
                      />
                    </div>
                  </button>

                  {/* Expanded content */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isExpanded(category.id)
                        ? "mt-4 max-h-[800px] opacity-100"
                        : "max-h-0 opacity-0"
                    )}
                  >
                    {/* ── Swatches (color-based categories) ── */}
                    {hasSwatches ? (
                      <div className="flex flex-wrap gap-3">
                        {category.options.map((opt, i) => (
                          <button
                            key={opt.id}
                            onClick={() => handleSelect(category.id, opt.id)}
                            className="group/swatch flex flex-col items-center gap-1.5"
                          >
                            <div
                              className={cn(
                                "h-14 w-14 rounded-lg bg-gradient-to-br transition-all duration-200",
                                swatchMap[category.id]?.[i] ??
                                "from-zinc-700 to-zinc-800",
                                isSelected(category.id, opt.id) &&
                                "ring-2 ring-offset-2 ring-offset-[#0a0a0a] ring-white"
                              )}
                            />
                            <span
                              className={cn(
                                "text-[10px] text-zinc-500 transition",
                                isSelected(category.id, opt.id) &&
                                "text-white"
                              )}
                            >
                              {swatchLabels[category.id]?.[i] ?? opt.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* ── Option cards ── */
                      <div
                        className={cn(
                          "grid gap-2.5",
                          isCase ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"
                        )}
                      >
                        {category.options.map((opt) => {
                          const sel = isSelected(category.id, opt.id);

                          return (
                            <button
                              key={opt.id}
                              onClick={() => handleSelect(category.id, opt.id)}
                              className={cn(
                                "group/card relative flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 hover:scale-[1.015]",
                                sel
                                  ? "border-white/20 bg-white/[0.04]"
                                  : "border-white/[0.06] bg-transparent hover:border-white/[0.12] hover:bg-white/[0.02]"
                              )}
                            >
                              {/* Thumbnail (case only) */}
                              {isCase && opt.image && (
                                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-white/[0.04]">
                                  <img
                                    src={opt.image}
                                    alt={opt.name}
                                    className="h-full w-full object-cover opacity-70"
                                  />
                                </div>
                              )}

                              <div className="flex min-w-0 flex-1 flex-col">
                                <span className="text-xs font-medium leading-snug text-zinc-200">
                                  {opt.name}
                                </span>
                                <span
                                  className={cn(
                                    "mt-1 text-xs tabular-nums",
                                    opt.standard
                                      ? "text-emerald-500/70"
                                      : "text-zinc-400"
                                  )}
                                >
                                  {opt.standard
                                    ? "Equipamento de série"
                                    : formatCurrency(opt.price)}
                                </span>
                              </div>

                              {/* Check indicator */}
                              {sel && (
                                <div className="mt-0.5 shrink-0 rounded-full bg-white/10 p-0.5">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Sticky bottom bar ── */}
          <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/[0.06] bg-[#0a0a0a]/95 backdrop-blur-xl p-4 md:px-6">
            <div className="flex gap-3">
              <Button className="flex-1 h-12 gap-2 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all">
                <ShoppingCart className="h-4 w-4" />
                Adicionar ao Carrinho
              </Button>
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-xl border-white/10 bg-transparent text-white text-sm hover:bg-white/[0.06] transition-all"
              >
                <Save className="h-4 w-4" />
                Salvar
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
