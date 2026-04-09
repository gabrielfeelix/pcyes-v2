import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Cpu,
  Expand,
  HardDrive,
  Monitor,
  Save,
  Settings,
  Share2,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { useCart } from "../components/CartContext";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/utils";

type Option = {
  id: string;
  name: string;
  price: number;
  image?: string;
  gallery?: string[];
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

const CONFIG_STORAGE_KEY = "pcyes-monte-seu-pc-config";

const categories: Category[] = [
  {
    id: "case",
    title: "Gabinete",
    icon: <Monitor className="h-4 w-4" />,
    options: [
      {
        id: "case-1",
        name: "PCYES Boreal Preto",
        price: 350,
        image:
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1400",
        gallery: [
          "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&q=80&w=1600",
        ],
        type: "black",
      },
      {
        id: "case-2",
        name: "PCYES Boreal Branco",
        price: 380,
        image:
          "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1400",
        gallery: [
          "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1624705002806-5d72df19c3ad?auto=format&fit=crop&q=80&w=1600",
        ],
        type: "white",
        standard: true,
      },
      {
        id: "case-3",
        name: "PCYES RGB Master",
        price: 450,
        image:
          "https://images.unsplash.com/photo-1624704791357-1fb4603378b2?auto=format&fit=crop&q=80&w=1400",
        gallery: [
          "https://images.unsplash.com/photo-1624704791357-1fb4603378b2?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&q=80&w=1600",
          "https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=1600",
        ],
        type: "rgb",
      },
    ],
  },
  {
    id: "cpu",
    title: "Processador",
    icon: <Cpu className="h-4 w-4" />,
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
    icon: <Settings className="h-4 w-4" />,
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
    icon: <Zap className="h-4 w-4" />,
    options: [
      { id: "ram-1", name: "16GB (2x8GB) DDR5 5200MHz", price: 400, standard: true },
      { id: "ram-2", name: "32GB (2x16GB) DDR5 6000MHz", price: 800 },
      { id: "ram-3", name: "64GB (2x32GB) DDR5 6400MHz", price: 1600 },
    ],
  },
  {
    id: "gpu",
    title: "Placa de Vídeo",
    icon: <Monitor className="h-4 w-4" />,
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
    icon: <HardDrive className="h-4 w-4" />,
    options: [
      { id: "storage-1", name: "SSD 1TB NVMe M.2 Gen4", price: 450, standard: true },
      { id: "storage-2", name: "SSD 2TB NVMe M.2 Gen4", price: 850 },
      { id: "storage-3", name: "SSD 4TB NVMe M.2 Gen4", price: 1800 },
    ],
  },
  {
    id: "psu",
    title: "Fonte de Alimentação",
    icon: <Zap className="h-4 w-4" />,
    options: [
      { id: "psu-1", name: "PCYES Spark 600W 80+ Bronze", price: 300, standard: true },
      { id: "psu-2", name: "PCYES Electro V2 750W 80+ Gold", price: 550 },
      { id: "psu-3", name: "PCYES Electro V2 850W 80+ Gold", price: 650 },
      { id: "psu-4", name: "PCYES Titan 1000W 80+ Platinum", price: 1200 },
    ],
  },
];

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

interface AmbientConfig {
  bg: string;
  glow: string;
  accent: string;
}

const getAmbient = (type?: string): AmbientConfig => {
  switch (type) {
    case "white":
      return {
        bg: "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.12), transparent 28%), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.08), transparent 24%), linear-gradient(180deg, #171717 0%, #090909 100%)",
        glow: "rgba(255,255,255,0.12)",
        accent: "#f5f5f5",
      };
    case "rgb":
      return {
        bg: "radial-gradient(circle at 18% 16%, rgba(139,92,246,0.22), transparent 28%), radial-gradient(circle at 82% 18%, rgba(6,182,212,0.16), transparent 22%), linear-gradient(180deg, #12091d 0%, #080808 100%)",
        glow: "rgba(139,92,246,0.24)",
        accent: "#d946ef",
      };
    default:
      return {
        bg: "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.07), transparent 26%), radial-gradient(circle at 82% 16%, rgba(255,255,255,0.04), transparent 20%), linear-gradient(180deg, #141414 0%, #080808 100%)",
        glow: "rgba(255,255,255,0.08)",
        accent: "#d4d4d8",
      };
  }
};

const swatchMap: Record<string, string[]> = {
  case: [
    "from-zinc-800 via-zinc-800 to-zinc-950",
    "from-zinc-100 via-zinc-200 to-zinc-300",
    "from-violet-600 via-fuchsia-500 to-cyan-400",
  ],
};

const swatchLabels: Record<string, string[]> = {
  case: ["Preto", "Branco", "RGB"],
};

const viewAngles = [
  { label: "Frontal", icon: "⬛" },
  { label: "Lateral", icon: "▭" },
  { label: "Detalhe", icon: "◻" },
  { label: "Setup", icon: "▬" },
];

export function MonteSeuPcPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const previewRef = useRef<HTMLDivElement>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const [selections, setSelections] = useState<Record<string, string>>({
    case: "case-2",
    cpu: "cpu-1",
    motherboard: "mb-1",
    ram: "ram-1",
    gpu: "gpu-1",
    storage: "storage-1",
    psu: "psu-1",
  });
  const [activeView, setActiveView] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["case"]));
  const [actionFeedback, setActionFeedback] = useState("");

  const currentCase = useMemo(() => {
    const category = categories.find((item) => item.id === "case");
    return category?.options.find((option) => option.id === selections.case);
  }, [selections.case]);

  const currentGallery = currentCase?.gallery?.length ? currentCase.gallery : currentCase?.image ? [currentCase.image] : [];
  const currentPreviewImage = currentGallery[activeView] ?? currentCase?.image;
  const ambient = useMemo(() => getAmbient(currentCase?.type), [currentCase?.type]);

  const priceBreakdown = useMemo(() => {
    let base = 0;
    let equipment = 0;

    Object.entries(selections).forEach(([categoryId, optionId]) => {
      const category = categories.find((item) => item.id === categoryId);
      const option = category?.options.find((item) => item.id === optionId);
      if (!option) return;

      if (option.standard) {
        base += option.price;
      } else {
        equipment += option.price;
      }
    });

    return { base, equipment, total: base + equipment };
  }, [selections]);

  const selectedSummary = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        selectedOption: category.options.find((option) => option.id === selections[category.id]),
      })),
    [selections],
  );

  const configurationName = useMemo(() => {
    const caseName = currentCase?.name ?? "PCYES Boreal";
    return `${caseName} Custom`;
  }, [currentCase?.name]);

  const pushFeedback = (message: string) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    setActionFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => {
      setActionFeedback("");
      feedbackTimerRef.current = null;
    }, 2400);
  };

  useEffect(() => {
    setActiveView(0);
  }, [currentCase?.id]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!raw) return;

      const savedSelections = JSON.parse(raw) as Record<string, string>;
      if (!savedSelections || typeof savedSelections !== "object") return;

      setSelections((prev) => ({ ...prev, ...savedSelections }));
    } catch {
      // Ignore invalid persisted data.
    }
  }, []);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const isExpanded = (id: string) => expandedSections.has(id);
  const isSelected = (categoryId: string, optionId: string) => selections[categoryId] === optionId;

  const handleSelect = (categoryId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [categoryId]: optionId }));
  };

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/produtos");
  };

  const handleSave = () => {
    window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(selections));
    pushFeedback("Configuração salva");
  };

  const handleShare = async () => {
    const shareData = {
      title: configurationName,
      text: `Confira esta configuração PCYES em ${formatCurrency(priceBreakdown.total)}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(window.location.href);
      }

      pushFeedback("Link pronto para compartilhar");
    } catch {
      pushFeedback("Compartilhamento cancelado");
    }
  };

  const handleFullscreen = async () => {
    const previewElement = previewRef.current;
    if (!previewElement) return;

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await previewElement.requestFullscreen();
      }
    } catch {
      pushFeedback("Tela cheia indisponível");
    }
  };

  const handleAddToCart = () => {
    const cartKey = `pc-builder-${Object.entries(selections)
      .map(([categoryId, optionId]) => `${categoryId}:${optionId}`)
      .join("|")}`;

    addItem({
      cartKey,
      id: 900001,
      name: configurationName,
      price: formatCurrency(priceBreakdown.total),
      image: currentPreviewImage ?? currentCase?.image ?? "",
    });

    pushFeedback("Configuração adicionada ao carrinho");
  };

  return (
    <div className="bg-[#080808] pt-[92px] text-[#f5f5f5]">
      <header className="sticky top-[92px] z-40 border-b border-white/[0.06] bg-[#090909]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 rounded-full px-3 text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="gap-2 rounded-full px-3 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Salvar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2 rounded-full px-3 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </div>

          <div className="hidden text-center md:block">
            <p className="text-sm font-semibold tracking-[0.18em] text-zinc-100">
              PCYES BOREAL
              <span className="ml-2 text-xs font-normal tracking-[0.12em] text-zinc-500">2025</span>
            </p>
            {actionFeedback && <p className="mt-1 text-[11px] text-zinc-400">{actionFeedback}</p>}
          </div>

          <div className="text-right">
            <p className="text-lg font-bold tabular-nums">{formatCurrency(priceBreakdown.total)}</p>
            <p className="text-[10px] text-zinc-500">Valores não incluem frete</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1920px] flex-col md:min-h-[calc(100vh-150px)] md:flex-row">
        <section className="border-b border-white/[0.05] md:sticky md:top-[151px] md:h-[calc(100vh-151px)] md:w-[66%] md:border-b-0 md:border-r md:border-white/[0.04]">
          <div className="flex h-full flex-col px-4 pb-6 pt-4 md:px-6 md:pb-8 lg:px-8">
            <div
              ref={previewRef}
              className="relative min-h-[420px] flex-1 overflow-hidden rounded-[28px] border border-white/[0.06] shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
              style={{ background: ambient.bg }}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] transition-all duration-700 md:h-[480px] md:w-[480px]"
                style={{ backgroundColor: ambient.glow }}
              />

              {currentPreviewImage ? (
                <img
                  src={currentPreviewImage}
                  alt={configurationName}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/30" />

              <button
                type="button"
                onClick={handleFullscreen}
                className="absolute right-5 top-5 z-20 rounded-2xl border border-white/10 bg-black/35 p-3 text-zinc-100 transition hover:bg-black/55"
                aria-label="Abrir em tela cheia"
              >
                <Expand className="h-4 w-4" />
              </button>

              <div className="absolute bottom-5 left-5 z-20 flex gap-2">
                {viewAngles.map((view, index) => (
                  <button
                    key={view.label}
                    type="button"
                    onClick={() => setActiveView(index)}
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-2xl border text-xs font-medium transition",
                      activeView === index
                        ? "border-white/30 bg-white/[0.12] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                        : "border-white/[0.08] bg-black/35 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
                    )}
                    title={view.label}
                    aria-label={view.label}
                  >
                    {view.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="flex w-full flex-col md:max-h-[calc(100vh-151px)] md:w-[34%] md:overflow-y-auto">
          <div className="border-b border-white/[0.06] px-5 py-6 md:px-6 lg:px-7">
            <div className="mb-4">
              <h1 className="text-[28px] font-semibold tracking-tight text-white">Monte seu PC</h1>
              <p className="mt-1 text-sm text-zinc-500">Personalize sua máquina com as melhores peças.</p>
            </div>

            <div className="space-y-1.5 text-sm text-zinc-500">
              <div className="flex items-center justify-between">
                <span>Preço Base</span>
                <span className="tabular-nums text-zinc-300">{formatCurrency(priceBreakdown.base)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Equipamentos</span>
                <span className="tabular-nums text-zinc-300">{formatCurrency(priceBreakdown.equipment)}</span>
              </div>
              <div className="my-2 h-px bg-white/[0.06]" />
              <div className="flex items-center justify-between text-base font-semibold text-white">
                <span>Preço Total</span>
                <span className="text-[20px] tabular-nums">{formatCurrency(priceBreakdown.total)}</span>
              </div>
            </div>
          </div>

          <div className="flex-1 px-5 pb-8 pt-2 md:px-6 lg:px-7">
            {selectedSummary.map((category) => {
              const selectedOption = category.selectedOption;
              const hasSwatches = Boolean(swatchMap[category.id]);
              const isCase = category.id === "case";

              return (
                <div key={category.id} className="border-b border-white/[0.05] py-4">
                  <button
                    type="button"
                    onClick={() => toggleSection(category.id)}
                    className="group flex w-full items-center justify-between gap-3 text-left"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="rounded-xl bg-white/[0.05] p-2 text-zinc-400">{category.icon}</div>
                      <div className="min-w-0">
                        <p className="text-xl font-semibold leading-none text-white">{category.title}</p>
                        {selectedOption && <p className="mt-1 truncate text-sm text-zinc-500">{selectedOption.name}</p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {selectedOption && (
                        <span
                          className={cn(
                            "text-sm tabular-nums",
                            selectedOption.standard ? "text-emerald-400/90" : "text-zinc-300",
                          )}
                        >
                          {selectedOption.standard ? "Equipamento de série" : `+ ${formatCurrency(selectedOption.price)}`}
                        </span>
                      )}
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
                          isExpanded(category.id) && "rotate-180",
                        )}
                      />
                    </div>
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isExpanded(category.id) ? "mt-5 max-h-[900px] opacity-100" : "max-h-0 opacity-0",
                    )}
                  >
                    {hasSwatches ? (
                      <div className="flex flex-wrap gap-3 px-1 py-1">
                        {category.options.map((option, index) => {
                          const selected = isSelected(category.id, option.id);

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleSelect(category.id, option.id)}
                              className="flex flex-col items-center gap-1.5 text-center"
                            >
                              <div
                                className={cn(
                                  "rounded-[18px] p-[2px] transition-all duration-200",
                                  selected ? "bg-white shadow-[0_0_0_1px_rgba(255,255,255,0.12)]" : "bg-transparent",
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-14 w-14 rounded-[16px] bg-gradient-to-br",
                                    swatchMap[category.id]?.[index] ?? "from-zinc-700 to-zinc-800",
                                  )}
                                />
                              </div>
                              <span className={cn("text-xs transition", selected ? "text-white" : "text-zinc-500")}>
                                {swatchLabels[category.id]?.[index] ?? option.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={cn("grid gap-3", isCase ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2")}>
                        {category.options.map((option) => {
                          const selected = isSelected(category.id, option.id);

                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => handleSelect(category.id, option.id)}
                              className={cn(
                                "group relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200",
                                selected
                                  ? "border-white/20 bg-white/[0.05] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                                  : "border-white/[0.07] bg-transparent hover:border-white/[0.14] hover:bg-white/[0.02]",
                              )}
                            >
                              {isCase && option.image && (
                                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/[0.04]">
                                  <img src={option.image} alt={option.name} className="h-full w-full object-cover opacity-80" />
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <span className="block text-sm font-medium leading-snug text-zinc-100">{option.name}</span>
                                <span
                                  className={cn(
                                    "mt-1 block text-sm tabular-nums",
                                    option.standard ? "text-emerald-400/85" : "text-zinc-400",
                                  )}
                                >
                                  {option.standard ? "Equipamento de série" : formatCurrency(option.price)}
                                </span>
                              </div>

                              {selected && (
                                <div className="mt-0.5 shrink-0 rounded-full bg-white/12 p-1">
                                  <Check className="h-3.5 w-3.5 text-white" />
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

          <div className="sticky bottom-0 z-20 border-t border-white/[0.06] bg-[#090909]/96 p-4 backdrop-blur-xl md:px-6 lg:px-7">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                onClick={handleAddToCart}
                className="h-14 flex-1 rounded-2xl bg-white text-base font-semibold text-black transition hover:bg-white/90"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
