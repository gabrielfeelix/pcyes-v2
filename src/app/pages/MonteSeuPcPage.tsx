import { useMemo, useRef, useState, type ReactNode } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Check, ChevronRight, Cpu, HardDrive, Monitor, Settings, Zap } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { allProducts } from "../components/productsData";
import { useCart } from "../components/CartContext";

type SectionId =
  | "case"
  | "cpu"
  | "motherboard"
  | "ram"
  | "gpu"
  | "storage"
  | "psu"
  | "monitor"
  | "keyboard"
  | "mouse"
  | "mousepad";

type Platform = "intel" | "amd";

interface ConfigOption {
  id: string;
  name: string;
  priceNum: number;
  image?: string;
  description: string;
  specs: string[];
  productId?: number;
  productPrice?: string;
  platform?: Platform;
  badge?: string;
}

interface ConfigSection {
  id: SectionId;
  title: string;
  eyebrow: string;
  description: string;
  required: boolean;
  icon: ReactNode;
  options: ConfigOption[];
  skipLabel?: string;
}

type SelectionState = Record<SectionId, string | null>;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const buildCatalogOption = (
  productId: number,
  description: string,
  specs: string[] = [],
  badge?: string,
): ConfigOption | null => {
  const product = allProducts.find((item) => item.id === productId);

  if (!product) {
    return null;
  }

  return {
    id: `catalog-${product.id}`,
    name: product.name,
    priceNum: product.priceNum,
    productId: product.id,
    productPrice: product.price,
    image: product.images?.[0] ?? product.image,
    description,
    specs: specs.length ? specs : product.features?.slice(0, 3) ?? [product.category],
    badge,
  };
};

const compactName = (name: string, fallback: string) => {
  const cleaned = name
    .replace(/^Gabinete Gamer\s*/i, "")
    .replace(/^Teclado Mecânico\s*/i, "")
    .replace(/^Mouse Gamer\s*/i, "")
    .replace(/^Mouse\s*/i, "")
    .replace(/^SSD\s*/i, "")
    .replace(/^Suporte\s*/i, "");

  return cleaned.length > 64 ? fallback : cleaned;
};

const caseOptions = [
  buildCatalogOption(6, "Airflow reforçado, visual limpo e estrutura pronta para uma build premium.", ["Mid Tower", "Vidro temperado", "Airflow"], "Mais equilibrado"),
  buildCatalogOption(7, "Silhueta agressiva para setups escuros, com presença forte na mesa.", ["Black edition", "RGB-ready", "Painel lateral"]),
  buildCatalogOption(8, "Base clara para composições clean e iluminação mais visível.", ["White edition", "Vidro temperado", "Cable cover"]),
  buildCatalogOption(9, "Perfil mais sóbrio, com leitura industrial e visual enxuto.", ["Minimal", "Painel lateral", "Gaming"]),
  buildCatalogOption(10, "Versão clara com leitura mais leve para setups elegantes.", ["White Ghost", "Vidro lateral", "Desk setup"]),
].filter(Boolean) as ConfigOption[];

const gpuOptions = [583, 601, 619, 638, 656]
  .map((id, index) =>
    buildCatalogOption(
      id,
      "Potência gráfica para gaming e criadores, com foco em estabilidade visual e longevidade da build.",
      [
        index === 0 ? "Entrada" : index < 3 ? "1080p / 1440p" : "Multi-monitor",
        "PCIe",
        "Cooler dedicado",
      ],
      index === 1 ? "Melhor custo-benefício" : undefined,
    ),
  )
  .filter(Boolean) as ConfigOption[];

const storageOptions = [674, 693, 711, 729, 748]
  .map((id) =>
    buildCatalogOption(
      id,
      "Armazenamento rápido para sistema, projetos e jogos sem gargalo no dia a dia.",
      ["SSD", "Boot rápido", "Leitura estável"],
    ),
  )
  .filter(Boolean) as ConfigOption[];

const monitorOptions = [509, 528, 546, 564, 502]
  .map((id, index) =>
    buildCatalogOption(
      id,
      index === 4
        ? "Acessório de mesa para um setup mais flexível quando o monitor já existe."
        : "Tela para produtividade e jogo com mais conforto visual no setup.",
      index === 4 ? ["Ergonomia", "Braço articulado", "Desk setup"] : ["Monitor", "Ergonomia", "Setup"],
    ),
  )
  .filter(Boolean)
  .slice(0, 4) as ConfigOption[];

const keyboardOptions = [392, 410, 429, 447, 465]
  .map((id) =>
    buildCatalogOption(
      id,
      "Resposta tátil e construção premium para digitação e gameplay prolongados.",
      ["Mecânico", "Layout gamer", "Iluminação"],
    ),
  )
  .filter(Boolean) as ConfigOption[];

const mouseOptions = [300, 319, 337, 355, 374]
  .map((id) =>
    buildCatalogOption(
      id,
      "Pegada precisa para jogo e navegação, com sensor estável e leitura rápida.",
      ["Sensor gamer", "RGB", "Alta precisão"],
    ),
  )
  .filter(Boolean) as ConfigOption[];

const mousepadOptions = [209, 227, 245, 264, 282]
  .map((id) =>
    buildCatalogOption(
      id,
      "Superfície para deslize controlado e acabamento consistente no visual da mesa.",
      ["Deslize suave", "Base estável", "Setup"],
    ),
  )
  .filter(Boolean) as ConfigOption[];

const cpuOptions: ConfigOption[] = [
  {
    id: "cpu-intel-i5",
    name: "Intel Core i5-14400F",
    priceNum: 1299.9,
    description: "Base sólida para uma build gamer equilibrada, com ótima folga para multitarefa.",
    specs: ["10 núcleos", "Intel", "Gaming / multitarefa"],
    platform: "intel",
    badge: "Base recomendada",
  },
  {
    id: "cpu-intel-i7",
    name: "Intel Core i7-14700K",
    priceNum: 2499.9,
    description: "Mais agressivo para stream, criação e sessões longas sem sensação de limite.",
    specs: ["20 núcleos", "Intel", "High-end"],
    platform: "intel",
  },
  {
    id: "cpu-amd-r5",
    name: "AMD Ryzen 5 7600",
    priceNum: 1499.9,
    description: "Processador enxuto e rápido para quem quer performance forte sem exagero de orçamento.",
    specs: ["6 núcleos", "AMD", "Eficiência"],
    platform: "amd",
  },
  {
    id: "cpu-amd-r7",
    name: "AMD Ryzen 7 7800X3D",
    priceNum: 2899.9,
    description: "Foco em FPS alto e constância em títulos competitivos e AAA.",
    specs: ["8 núcleos", "AMD", "3D V-Cache"],
    platform: "amd",
    badge: "Topo para games",
  },
];

const motherboardCatalog: ConfigOption[] = [
  {
    id: "mb-b760m",
    name: "B760M AORUS Elite AX",
    priceNum: 1199.9,
    description: "Plataforma Intel pronta para memória rápida, conectividade moderna e montagem limpa.",
    specs: ["Intel", "Wi-Fi", "DDR5"],
    platform: "intel",
  },
  {
    id: "mb-z790",
    name: "Z790 Gaming X",
    priceNum: 1899.9,
    description: "Mais margem para uma build premium com expansão e refrigeração melhor distribuídas.",
    specs: ["Intel", "ATX", "Overclock"],
    platform: "intel",
  },
  {
    id: "mb-b650m",
    name: "B650M TUF Gaming",
    priceNum: 1399.9,
    description: "Equilíbrio muito forte para plataformas AMD atuais, com leitura estética limpa.",
    specs: ["AMD", "DDR5", "PCIe 4.0"],
    platform: "amd",
  },
  {
    id: "mb-x670e",
    name: "X670E ROG Strix",
    priceNum: 2499.9,
    description: "Base premium para setups AMD mais ambiciosos, com expansão para ciclos futuros.",
    specs: ["AMD", "PCIe 5.0", "Premium"],
    platform: "amd",
  },
];

const ramOptions: ConfigOption[] = [
  {
    id: "ram-16",
    name: "16 GB DDR5 5600 MHz",
    priceNum: 459.9,
    description: "Ponto de partida limpo para jogo e uso diário com boa folga de sistema.",
    specs: ["2x8 GB", "DDR5", "Base"],
  },
  {
    id: "ram-32",
    name: "32 GB DDR5 6000 MHz",
    priceNum: 849.9,
    description: "Faixa ideal para builds premium, stream, multitarefa e criação leve a média.",
    specs: ["2x16 GB", "DDR5", "Sweet spot"],
    badge: "Mais indicado",
  },
  {
    id: "ram-64",
    name: "64 GB DDR5 6400 MHz",
    priceNum: 1649.9,
    description: "Reserva máxima para edição pesada, 3D e uso intenso por muitos anos.",
    specs: ["2x32 GB", "DDR5", "Creator / heavy use"],
  },
];

const psuOptions: ConfigOption[] = [
  {
    id: "psu-650",
    name: "Fonte 650W 80 Plus Bronze",
    priceNum: 399.9,
    description: "Entrega confiável para builds médias com organização de custo mais enxuta.",
    specs: ["650W", "80 Plus Bronze", "Build média"],
  },
  {
    id: "psu-750",
    name: "Fonte 750W 80 Plus Gold",
    priceNum: 579.9,
    description: "Faixa recomendada para uma build gamer equilibrada com espaço para upgrade.",
    specs: ["750W", "80 Plus Gold", "Recomendada"],
    badge: "Mais segura",
  },
  {
    id: "psu-850",
    name: "Fonte 850W 80 Plus Gold",
    priceNum: 719.9,
    description: "Mais folga para placas de vídeo fortes, airflow pesado e acessórios extras.",
    specs: ["850W", "80 Plus Gold", "Upgrade-ready"],
  },
  {
    id: "psu-1000",
    name: "Fonte 1000W 80 Plus Platinum",
    priceNum: 1249.9,
    description: "Reserva premium para builds extremas e ciclos longos sem preocupação.",
    specs: ["1000W", "Platinum", "Extreme build"],
  },
];

const initialSelections: SelectionState = {
  case: caseOptions[0]?.id ?? null,
  cpu: cpuOptions[0]?.id ?? null,
  motherboard: "mb-b760m",
  ram: "ram-32",
  gpu: gpuOptions[1]?.id ?? gpuOptions[0]?.id ?? null,
  storage: storageOptions[1]?.id ?? storageOptions[0]?.id ?? null,
  psu: "psu-750",
  monitor: null,
  keyboard: null,
  mouse: null,
  mousepad: null,
};

const sectionOrder: SectionId[] = [
  "case",
  "cpu",
  "motherboard",
  "ram",
  "gpu",
  "storage",
  "psu",
  "monitor",
  "keyboard",
  "mouse",
  "mousepad",
];

export function MonteSeuPcPage() {
  const navigate = useNavigate();
  const { addItem, items, removeItem, setIsOpen } = useCart();
  const sectionRefs = useRef<Partial<Record<SectionId | "summary", HTMLElement | null>>>({});
  const [selections, setSelections] = useState<SelectionState>(initialSelections);
  const [activeSection, setActiveSection] = useState<SectionId>("case");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = useMemo<ConfigSection[]>(() => {
    const selectedCpu = cpuOptions.find((option) => option.id === selections.cpu);
    const platform = selectedCpu?.platform ?? "intel";

    return [
      {
        id: "case",
        title: "Gabinete",
        eyebrow: "Obrigatório",
        description: "A presença da build começa aqui. É o volume visual, o airflow e o tom do setup inteiro.",
        required: true,
        icon: <Monitor className="size-4" />,
        options: caseOptions,
      },
      {
        id: "cpu",
        title: "Processador",
        eyebrow: "Obrigatório",
        description: "Escolha o cérebro da máquina antes de decidir plataforma, memória e margem de upgrade.",
        required: true,
        icon: <Cpu className="size-4" />,
        options: cpuOptions,
      },
      {
        id: "motherboard",
        title: "Placa-mãe",
        eyebrow: "Obrigatório",
        description: "Uma base boa deixa a build mais estável, mais limpa e com caminho claro para evoluir.",
        required: true,
        icon: <Settings className="size-4" />,
        options: motherboardCatalog.filter((option) => option.platform === platform),
      },
      {
        id: "ram",
        title: "Memória",
        eyebrow: "Obrigatório",
        description: "A quantidade certa muda a sensação de velocidade em jogo, edição e multitarefa.",
        required: true,
        icon: <Zap className="size-4" />,
        options: ramOptions,
      },
      {
        id: "gpu",
        title: "Placa de vídeo",
        eyebrow: "Obrigatório",
        description: "Se amanhã houver 10 GPUs aqui, a estrutura continua elegante: lista compacta, leitura rápida e decisão sem ruído.",
        required: true,
        icon: <Monitor className="size-4" />,
        options: gpuOptions,
      },
      {
        id: "storage",
        title: "Armazenamento",
        eyebrow: "Obrigatório",
        description: "Defina o ritmo da build no boot, nos projetos e no tempo de abertura dos jogos.",
        required: true,
        icon: <HardDrive className="size-4" />,
        options: storageOptions,
      },
      {
        id: "psu",
        title: "Fonte",
        eyebrow: "Obrigatório",
        description: "Potência com folga dá estabilidade, segurança e espaço para a build respirar.",
        required: true,
        icon: <Zap className="size-4" />,
        options: psuOptions,
      },
      {
        id: "monitor",
        title: "Monitor",
        eyebrow: "Opcional",
        description: "Se o setup ainda não está completo, aqui entram tela e ergonomia sem travar o fluxo.",
        required: false,
        skipLabel: "Vou usar o meu monitor",
        icon: <Monitor className="size-4" />,
        options: monitorOptions,
      },
      {
        id: "keyboard",
        title: "Teclado",
        eyebrow: "Opcional",
        description: "Pode entrar agora ou ficar para depois. O configurador precisa respeitar essa decisão.",
        required: false,
        skipLabel: "Montar sem teclado",
        icon: <Settings className="size-4" />,
        options: keyboardOptions,
      },
      {
        id: "mouse",
        title: "Mouse",
        eyebrow: "Opcional",
        description: "Escolha o periférico junto da build ou mantenha seu mouse atual sem quebrar o fluxo.",
        required: false,
        skipLabel: "Montar sem mouse novo",
        icon: <Settings className="size-4" />,
        options: mouseOptions,
      },
      {
        id: "mousepad",
        title: "Mouse pad",
        eyebrow: "Opcional",
        description: "Camada final do setup. Um detalhe pequeno, mas que fecha a leitura visual da mesa.",
        required: false,
        skipLabel: "Sem mouse pad por agora",
        icon: <Settings className="size-4" />,
        options: mousepadOptions,
      },
    ];
  }, [selections.cpu]);

  const selectedEntries = useMemo(
    () =>
      sections
        .map((section) => {
          const selectedId = selections[section.id];
          const option = section.options.find((item) => item.id === selectedId) ?? null;
          return { section, option };
        })
        .filter((entry) => entry.option),
    [sections, selections],
  );

  const requiredSections = sections.filter((section) => section.required);
  const optionalSections = sections.filter((section) => !section.required);

  const completionCount = requiredSections.filter((section) => Boolean(selections[section.id])).length;
  const isBuildReady = completionCount === requiredSections.length;

  const missingRequired = requiredSections.filter((section) => !selections[section.id]);
  const firstMissingSection = missingRequired[0]?.id ?? "summary";

  const subtotalRequired = selectedEntries
    .filter(({ section }) => section.required)
    .reduce((sum, { option }) => sum + (option?.priceNum ?? 0), 0);

  const subtotalOptional = selectedEntries
    .filter(({ section }) => !section.required)
    .reduce((sum, { option }) => sum + (option?.priceNum ?? 0), 0);

  const totalPrice = subtotalRequired + subtotalOptional;

  const activeSelection =
    selectedEntries.find((entry) => entry.section.id === activeSection)?.option ??
    selectedEntries.find((entry) => entry.option?.image)?.option ??
    caseOptions[0];

  const skippedOptional = optionalSections.filter((section) => !selections[section.id]);

  const scrollToAnchor = (anchor: SectionId | "summary") => {
    setActiveSection(anchor === "summary" ? activeSection : anchor);
    sectionRefs.current[anchor]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const selectOption = (sectionId: SectionId, optionId: string | null) => {
    setSelections((prev) => {
      const next = { ...prev, [sectionId]: optionId };

      if (sectionId === "cpu") {
        const chosenCpu = cpuOptions.find((option) => option.id === optionId);
        const compatibleMotherboards = motherboardCatalog.filter(
          (option) => option.platform === chosenCpu?.platform,
        );

        if (!compatibleMotherboards.some((option) => option.id === prev.motherboard)) {
          next.motherboard = compatibleMotherboards[0]?.id ?? null;
        }
      }

      return next;
    });

    setActiveSection(sectionId);
  };

  const finalizeBuild = () => {
    if (!isBuildReady) {
      scrollToAnchor(firstMissingSection);
      return;
    }

    setIsSubmitting(true);

    items
      .filter((item) => item.cartKey.startsWith("pc-build-"))
      .forEach((item) => removeItem(item.cartKey));

    selectedEntries.forEach(({ section, option }, index) => {
      if (!option) return;

      addItem({
        cartKey: `pc-build-${section.id}`,
        id: option.productId ?? 9000 + index,
        name: `${section.title}: ${option.name}`,
        price: option.productPrice ?? formatCurrency(option.priceNum),
        image: option.image ?? activeSelection?.image ?? caseOptions[0]?.image ?? "",
      });
    });

    setIsOpen(false);
    navigate("/checkout");
    setIsSubmitting(false);
  };

  return (
    <div className="bg-[#070708] text-white pt-16 md:pt-0">
      <div className="md:mt-20 lg:mt-24 md:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)] md:overflow-hidden md:flex">
        <aside className="relative border-b border-white/10 bg-[#09090b] md:w-[52%] md:border-b-0 md:border-r md:border-white/8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,43,46,0.15),transparent_42%),linear-gradient(180deg,#111214_0%,#09090b_72%)]" />

          <div className="relative flex h-full flex-col px-6 pb-8 pt-8 md:px-10 md:pb-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className="mb-3 text-[11px] uppercase tracking-[0.38em] text-primary/90"
                  style={{ fontFamily: "var(--font-family-inter)", fontWeight: 600 }}
                >
                  PCYES Custom Build
                </p>
                <h1
                  className="max-w-[12ch] text-white"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "clamp(34px,4vw,64px)",
                    fontWeight: 300,
                    lineHeight: 0.94,
                    letterSpacing: "-0.04em",
                  }}
                >
                  Monte seu PC com ritmo de configurador premium.
                </h1>
              </div>

              <div className="min-w-[118px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Progresso</p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {completionCount}/{requiredSections.length}
                </p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${(completionCount / requiredSections.length) * 100}%` }}
                />
              </div>
              <p className="text-sm text-white/60">
                {isBuildReady ? "Resumo pronto" : `${requiredSections.length - completionCount} etapa(s) obrigatória(s) faltando`}
              </p>
            </div>

            <div className="relative mt-8 flex flex-1 items-center justify-center overflow-hidden rounded-[32px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.01))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.12),transparent_48%)]" />
              {activeSelection?.image ? (
                <img
                  src={activeSelection.image}
                  alt={activeSelection.name}
                  loading="eager"
                  decoding="async"
                  className="relative z-10 max-h-full w-full object-contain"
                />
              ) : (
                <div className="relative z-10 flex h-full w-full items-center justify-center rounded-[24px] border border-dashed border-white/12 text-white/40">
                  Visual da configuração
                </div>
              )}

              <div className="absolute bottom-4 left-4 right-4 z-20 rounded-[24px] border border-white/10 bg-black/55 p-4 backdrop-blur-md">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.24em] text-primary/90">
                      Em foco
                    </p>
                    <p className="mt-1 text-lg font-semibold text-white">{activeSelection?.name}</p>
                    <p className="mt-1 text-sm text-white/55">
                      {sections.find((section) => section.id === activeSection)?.title ?? "Configuração"}
                    </p>
                  </div>
                  <p className="text-lg font-semibold text-white">{formatCurrency(totalPrice)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 xl:grid-cols-2">
              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Leitura da build</p>
                <p className="mt-3 text-2xl font-semibold text-white">
                  {selectedEntries.length} escolhas
                </p>
                <p className="mt-2 text-sm leading-6 text-white/55">
                  Base obrigatória mais opcionais livres, sem forçar teclado, mouse ou monitor no fluxo.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Resumo de preço</p>
                <div className="mt-3 space-y-2 text-sm text-white/65">
                  <div className="flex items-center justify-between">
                    <span>Base da build</span>
                    <span className="text-white">{formatCurrency(subtotalRequired)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Opcionais</span>
                    <span className="text-white">{formatCurrency(subtotalOptional)}</span>
                  </div>
                </div>
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Total estimado</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(totalPrice)}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {selectedEntries.slice(0, 7).map(({ section, option }) => (
                <Badge
                  key={section.id}
                  className="rounded-full border border-white/10 bg-white/7 px-3 py-1.5 text-xs font-medium text-white/70"
                >
                  {section.title}: {compactName(option?.name ?? "", section.title)}
                </Badge>
              ))}
            </div>
          </div>
        </aside>

        <section className="md:w-[48%] md:bg-[#0b0c0f]">
          <div className="h-full overflow-y-auto overscroll-contain px-5 pb-32 pt-6 md:px-8 md:pt-8">
            <div className="sticky top-0 z-30 -mx-5 mb-8 border-b border-white/8 bg-[#0b0c0f]/95 px-5 pb-5 pt-2 backdrop-blur-xl md:-mx-8 md:px-8">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-primary/90">Configurador</p>
                  <h2
                    className="mt-2 text-white"
                    style={{
                      fontFamily: "var(--font-family-figtree)",
                      fontSize: "clamp(28px,3vw,46px)",
                      fontWeight: 300,
                      letterSpacing: "-0.04em",
                      lineHeight: 0.98,
                    }}
                  >
                    Fluxo interno, leitura limpa e resumo forte no fim.
                  </h2>
                </div>

                <div className="hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-3 md:block">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Total atual</p>
                  <p className="mt-2 text-xl font-semibold text-white">{formatCurrency(totalPrice)}</p>
                </div>
              </div>

              <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToAnchor(section.id)}
                    className={`shrink-0 rounded-full border px-3 py-2 text-xs transition-colors ${
                      activeSection === section.id
                        ? "border-primary/50 bg-primary/12 text-white"
                        : selections[section.id]
                          ? "border-white/14 bg-white/7 text-white/80"
                          : "border-white/8 bg-transparent text-white/45 hover:text-white/75"
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
                <button
                  onClick={() => scrollToAnchor("summary")}
                  className="shrink-0 rounded-full border border-white/10 bg-white/7 px-3 py-2 text-xs text-white/80"
                >
                  Resumo
                </button>
              </div>
            </div>

            <div className="space-y-8">
              {sections.map((section) => {
                const selectedId = selections[section.id];
                const selectedOption = section.options.find((option) => option.id === selectedId) ?? null;

                return (
                  <section
                    key={section.id}
                    ref={(element) => {
                      sectionRefs.current[section.id] = element;
                    }}
                    className="scroll-mt-32 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.035),rgba(255,255,255,0.015))] p-5 md:p-6"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                      <div className="max-w-[42ch]">
                        <div className="mb-3 flex items-center gap-3">
                          <span className="flex size-9 items-center justify-center rounded-2xl border border-white/10 bg-white/7 text-white/80">
                            {section.icon}
                          </span>
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.26em] text-primary/80">{section.eyebrow}</p>
                            <h3
                              className="text-white"
                              style={{
                                fontFamily: "var(--font-family-figtree)",
                                fontSize: "clamp(22px,2vw,32px)",
                                fontWeight: 400,
                                letterSpacing: "-0.03em",
                              }}
                            >
                              {section.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm leading-7 text-white/58">{section.description}</p>
                      </div>

                      <div className="min-w-[220px] rounded-[24px] border border-white/8 bg-black/24 p-4">
                        <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Selecionado</p>
                        <p className="mt-2 text-base font-semibold text-white">
                          {selectedOption?.name ?? "Nada selecionado"}
                        </p>
                        <p className="mt-1 text-sm text-white/45">
                          {selectedOption
                            ? formatCurrency(selectedOption.priceNum)
                            : section.required
                              ? "Escolha obrigatória"
                              : "Pode pular esta etapa"}
                        </p>
                        {!section.required && (
                          <button
                            onClick={() => selectOption(section.id, null)}
                            className={`mt-4 w-full rounded-full border px-3 py-2 text-sm transition-colors ${
                              !selectedOption
                                ? "border-white/14 bg-white/8 text-white"
                                : "border-white/10 text-white/65 hover:border-white/16 hover:text-white"
                            }`}
                          >
                            {section.skipLabel}
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 space-y-3">
                      {section.options.map((option) => {
                        const isSelected = selectedId === option.id;

                        return (
                          <button
                            key={option.id}
                            onClick={() => selectOption(section.id, option.id)}
                            className={`group w-full rounded-[26px] border text-left transition-all ${
                              isSelected
                                ? "border-primary/45 bg-primary/[0.09] shadow-[0_20px_40px_rgba(255,43,46,0.08)]"
                                : "border-white/8 bg-white/[0.02] hover:border-white/16 hover:bg-white/[0.04]"
                            }`}
                          >
                            <div className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:p-5">
                              {option.image ? (
                                <div className="h-28 w-full overflow-hidden rounded-[20px] border border-white/8 bg-black/30 md:h-24 md:w-32 md:shrink-0">
                                  <img
                                    src={option.image}
                                    alt={option.name}
                                    loading="lazy"
                                    decoding="async"
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                                  />
                                </div>
                              ) : (
                                <div className="flex h-24 w-full items-center justify-center rounded-[20px] border border-white/8 bg-white/[0.03] md:w-32 md:shrink-0">
                                  <span className="text-sm uppercase tracking-[0.24em] text-white/35">{section.title}</span>
                                </div>
                              )}

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                  <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <p className="text-base font-semibold text-white md:text-lg">{option.name}</p>
                                      {option.badge && (
                                        <Badge className="rounded-full border border-primary/20 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-primary">
                                          {option.badge}
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="mt-2 max-w-[50ch] text-sm leading-6 text-white/58">
                                      {option.description}
                                    </p>
                                  </div>

                                  <div className="flex items-center justify-between gap-3 md:block md:text-right">
                                    <div>
                                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/35">Preço</p>
                                      <p className="mt-1 text-lg font-semibold text-white">
                                        {formatCurrency(option.priceNum)}
                                      </p>
                                    </div>
                                    <span
                                      className={`flex size-10 items-center justify-center rounded-full border transition-colors ${
                                        isSelected
                                          ? "border-primary bg-primary text-white"
                                          : "border-white/10 bg-white/[0.04] text-white/45 group-hover:border-white/20 group-hover:text-white/80"
                                      }`}
                                    >
                                      {isSelected ? <Check className="size-4" /> : <ChevronRight className="size-4" />}
                                    </span>
                                  </div>
                                </div>

                                <div className="mt-4 flex flex-wrap gap-2">
                                  {option.specs.map((spec) => (
                                    <span
                                      key={spec}
                                      className="rounded-full border border-white/8 bg-white/[0.04] px-3 py-1.5 text-xs text-white/55"
                                    >
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </section>
                );
              })}

              <section
                ref={(element) => {
                  sectionRefs.current.summary = element;
                }}
                className="scroll-mt-32 rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] p-6 md:p-7"
              >
                <p className="text-[11px] uppercase tracking-[0.28em] text-primary/85">Resumo</p>
                <h3
                  className="mt-3 text-white"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "clamp(28px,3vw,42px)",
                    fontWeight: 300,
                    lineHeight: 0.98,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {isBuildReady
                    ? "Seu PC está pronto para ir direto ao checkout."
                    : "A build já tem direção. Falta só fechar as etapas obrigatórias."}
                </h3>
                <p className="mt-4 max-w-[56ch] text-sm leading-7 text-white/58">
                  A referência da Porsche aqui vira regra de UX: visual firme à esquerda, decisões claras à direita e um fechamento de compra sem ruído.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[24px] border border-white/8 bg-black/22 p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Build base</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{formatCurrency(subtotalRequired)}</p>
                  </div>
                  <div className="rounded-[24px] border border-white/8 bg-black/22 p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Opcionais</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{formatCurrency(subtotalOptional)}</p>
                  </div>
                  <div className="rounded-[24px] border border-primary/18 bg-primary/[0.08] p-5">
                    <p className="text-[11px] uppercase tracking-[0.22em] text-primary/80">Total</p>
                    <p className="mt-3 text-2xl font-semibold text-white">{formatCurrency(totalPrice)}</p>
                  </div>
                </div>

                <div className="mt-8 rounded-[28px] border border-white/8 bg-black/18 p-5 md:p-6">
                  <div className="flex items-center justify-between gap-4 border-b border-white/8 pb-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-white/45">Equipamento selecionado</p>
                      <p className="mt-2 text-lg font-semibold text-white">Resumo final da sua configuração</p>
                    </div>
                    <Badge className="rounded-full border border-white/10 bg-white/7 px-3 py-1.5 text-xs text-white/75">
                      {selectedEntries.length} item(ns)
                    </Badge>
                  </div>

                  <div className="mt-5 space-y-3">
                    {selectedEntries.map(({ section, option }) => (
                      <div
                        key={section.id}
                        className="flex flex-col gap-3 rounded-[22px] border border-white/8 bg-white/[0.03] p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/70">
                            <Check className="size-4" />
                          </span>
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">{section.title}</p>
                            <p className="mt-1 text-base font-semibold text-white">{option?.name}</p>
                            <p className="mt-1 text-sm text-white/45">{option?.description}</p>
                          </div>
                        </div>

                        <p className="text-base font-semibold text-white">
                          {formatCurrency(option?.priceNum ?? 0)}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {skippedOptional.map((section) => (
                      <Badge
                        key={section.id}
                        className="rounded-full border border-white/8 bg-transparent px-3 py-1.5 text-xs text-white/48"
                      >
                        {section.title} pulado
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="max-w-[40ch] text-sm leading-7 text-white/56">
                    Ao concluir, a página envia todos os itens selecionados para o checkout já prontos no carrinho. Se você optar por não incluir teclado, mouse ou monitor, o fluxo respeita isso.
                  </div>
                  <Button
                    onClick={finalizeBuild}
                    disabled={isSubmitting || !isBuildReady}
                    className="h-12 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.18em]"
                  >
                    {isBuildReady ? "Finalizar e ir ao checkout" : "Complete as etapas obrigatórias"}
                    <ArrowRight className="size-4" />
                  </Button>
                </div>
              </section>
            </div>
          </div>

          <div className="sticky bottom-0 z-30 border-t border-white/8 bg-[#0b0c0f]/94 px-5 py-4 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/40">Total</p>
                <p className="mt-1 text-xl font-semibold text-white">{formatCurrency(totalPrice)}</p>
              </div>
              <Button
                onClick={() => scrollToAnchor(isBuildReady ? "summary" : firstMissingSection)}
                className="rounded-full px-5"
              >
                {isBuildReady ? "Ver resumo" : "Continuar"}
              </Button>
            </div>
          </div>

          <div className="sticky bottom-0 hidden border-t border-white/8 bg-[#0b0c0f]/92 px-8 py-5 backdrop-blur-xl md:block">
            <div className="flex items-center justify-between gap-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Próximo passo</p>
                <p className="mt-2 text-base text-white/75">
                  {isBuildReady
                    ? "Revise o resumo final e envie a build para o checkout."
                    : `Complete ${requiredSections.length - completionCount} etapa(s) obrigatória(s) para fechar a configuração.`}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">Total</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{formatCurrency(totalPrice)}</p>
                </div>

                <Button
                  onClick={() => scrollToAnchor(isBuildReady ? "summary" : firstMissingSection)}
                  className="h-12 rounded-full px-6 text-sm font-semibold uppercase tracking-[0.18em]"
                >
                  {isBuildReady ? "Ver resumo" : "Continuar build"}
                  <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
