import { useMemo, useState } from "react";
import { ArrowRight, Check, Cpu, HardDrive, Monitor, Save, Settings, Share2, Zap } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const categories = [
  {
    id: "case",
    title: "Gabinete",
    icon: <Monitor className="w-5 h-5" />,
    options: [
      {
        id: "case-1",
        name: "PCYES Boreal Preto",
        price: 350,
        image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1200",
        type: "black",
      },
      {
        id: "case-2",
        name: "PCYES Boreal Branco",
        price: 380,
        image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1200",
        type: "white",
      },
      {
        id: "case-3",
        name: "PCYES RGB Master",
        price: 450,
        image: "https://images.unsplash.com/photo-1624704791357-1fb4603378b2?auto=format&fit=crop&q=80&w=1200",
        type: "rgb",
      },
    ],
  },
  {
    id: "cpu",
    title: "Processador",
    icon: <Cpu className="w-5 h-5" />,
    options: [
      { id: "cpu-1", name: "Intel Core i5-13400F", price: 1200 },
      { id: "cpu-2", name: "Intel Core i7-13700K", price: 2500 },
      { id: "cpu-3", name: "AMD Ryzen 5 7600", price: 1400 },
      { id: "cpu-4", name: "AMD Ryzen 7 7800X3D", price: 2800 },
    ],
  },
  {
    id: "motherboard",
    title: "Placa Mãe",
    icon: <Settings className="w-5 h-5" />,
    options: [
      { id: "mb-1", name: "B760M AORUS ELITE (Intel)", price: 1100, req: ["cpu-1", "cpu-2"] },
      { id: "mb-2", name: "Z790 GAMING X (Intel)", price: 1800, req: ["cpu-1", "cpu-2"] },
      { id: "mb-3", name: "B650M TUF GAMING (AMD)", price: 1300, req: ["cpu-3", "cpu-4"] },
      { id: "mb-4", name: "X670E ROG STRIX (AMD)", price: 2500, req: ["cpu-3", "cpu-4"] },
    ],
  },
  {
    id: "ram",
    title: "Memória RAM",
    icon: <Zap className="w-5 h-5" />,
    options: [
      { id: "ram-1", name: "16GB (2x8GB) DDR5 5200MHz", price: 400 },
      { id: "ram-2", name: "32GB (2x16GB) DDR5 6000MHz", price: 800 },
      { id: "ram-3", name: "64GB (2x32GB) DDR5 6400MHz", price: 1600 },
    ],
  },
  {
    id: "gpu",
    title: "Placa de Vídeo",
    icon: <Monitor className="w-5 h-5" />,
    options: [
      { id: "gpu-1", name: "RTX 4060 8GB", price: 1800 },
      { id: "gpu-2", name: "RTX 4070 SUPER 12GB", price: 3800 },
      { id: "gpu-3", name: "RX 7800 XT 16GB", price: 3500 },
      { id: "gpu-4", name: "RTX 4090 24GB", price: 12000 },
    ],
  },
  {
    id: "storage",
    title: "Armazenamento",
    icon: <HardDrive className="w-5 h-5" />,
    options: [
      { id: "storage-1", name: "SSD 1TB NVMe M.2 Gen4", price: 450 },
      { id: "storage-2", name: "SSD 2TB NVMe M.2 Gen4", price: 850 },
      { id: "storage-3", name: "SSD 4TB NVMe M.2 Gen4", price: 1800 },
    ],
  },
  {
    id: "psu",
    title: "Fonte de Alimentação",
    icon: <Zap className="w-5 h-5" />,
    options: [
      { id: "psu-1", name: "PCYES Spark 600W 80 Plus Bronze", price: 300 },
      { id: "psu-2", name: "PCYES Electro V2 750W 80 Plus Gold", price: 550 },
      { id: "psu-3", name: "PCYES Electro V2 850W 80 Plus Gold", price: 650 },
      { id: "psu-4", name: "1000W 80 Plus Platinum", price: 1200 },
    ],
  },
] as const;

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const getAmbientBackground = (type?: string) => {
  switch (type) {
    case "white":
      return "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.14), transparent 60%)";
    case "rgb":
      return "radial-gradient(circle at 50% 45%, rgba(139,92,246,0.22), transparent 60%)";
    default:
      return "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.05), transparent 60%)";
  }
};

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
  const [activeCategory, setActiveCategory] = useState("case");

  const handleSelect = (categoryId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [categoryId]: optionId }));

    const currentIndex = categories.findIndex((category) => category.id === categoryId);
    if (currentIndex < categories.length - 1) {
      setActiveCategory(categories[currentIndex + 1].id);
    }
  };

  const currentCase = useMemo(() => {
    const caseCategory = categories.find((category) => category.id === "case");
    return caseCategory?.options.find((option) => option.id === selections.case);
  }, [selections.case]);

  const totalPrice = useMemo(
    () =>
      Object.entries(selections).reduce((acc, [categoryId, optionId]) => {
        const category = categories.find((item) => item.id === categoryId);
        const option = category?.options.find((item) => item.id === optionId);
        return acc + (option?.price || 0);
      }, 0),
    [selections],
  );

  return (
    <div className="min-h-screen bg-background pt-16 text-foreground md:overflow-hidden md:pt-20 lg:pt-24">
      <div className="flex min-h-[calc(100vh-4rem)] flex-col md:h-[calc(100vh-5rem)] md:min-h-0 md:flex-row lg:h-[calc(100vh-6rem)]">
        <div className="relative flex h-[42vh] min-h-0 w-full items-center justify-center overflow-hidden border-r border-border bg-muted/20 p-4 md:h-full md:w-1/2 md:p-8 lg:w-[60%]">
          <div
            className="absolute inset-0 transition-[background] duration-300"
            style={{ background: getAmbientBackground(currentCase?.type) }}
          />

          <div className="relative flex h-full w-full items-center justify-center">
            {currentCase?.image ? (
              <img
                src={currentCase.image}
                alt="PC Configurator Visual"
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="h-full w-full object-contain object-center"
              />
            ) : (
              <div className="h-full w-full animate-pulse rounded-xl bg-muted" />
            )}
          </div>

          <div className="absolute bottom-8 left-8 right-8 hidden flex-wrap justify-center gap-2 opacity-80 transition-opacity hover:opacity-100 md:flex">
            {Object.entries(selections).map(([categoryId, optionId]) => {
              if (categoryId === "case") {
                return null;
              }

              const category = categories.find((item) => item.id === categoryId);
              const option = category?.options.find((item) => item.id === optionId);
              if (!option) {
                return null;
              }

              return (
                <Badge key={categoryId} variant="secondary" className="border-primary/20 bg-background/90 py-1 text-xs">
                  {category?.title}: {option.name}
                </Badge>
              );
            })}
          </div>
        </div>

        <div className="relative flex h-full min-h-0 w-full flex-col bg-background md:w-1/2 md:overflow-hidden lg:w-[40%]">
          <div className="sticky top-0 z-10 border-b border-border bg-background p-6 shadow-sm md:relative md:top-auto md:p-8">
            <h1 className="mb-2 text-3xl font-extrabold uppercase tracking-tight md:text-4xl">Monte seu PC</h1>
            <p className="mb-4 text-sm text-muted-foreground">Personalize sua máquina com as melhores peças.</p>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">Preço Estimado</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(totalPrice)}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" title="Salvar Configuração">
                  <Save className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" title="Compartilhar">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 py-4 md:px-8">
            <Accordion
              type="single"
              collapsible
              value={activeCategory}
              onValueChange={(value) => {
                if (value) {
                  setActiveCategory(value);
                }
              }}
              className="w-full"
            >
              {categories.map((category) => {
                const selectedOptionId = selections[category.id];
                const selectedOption = category.options.find((option) => option.id === selectedOptionId);
                const filteredOptions = category.options.filter((option) => {
                  if (category.id === "motherboard" && "req" in option && option.req) {
                    return option.req.includes(selections.cpu);
                  }

                  return true;
                });

                return (
                  <AccordionItem value={category.id} key={category.id} className="border-b border-border/50 py-2">
                    <AccordionTrigger className="py-4 transition-colors hover:text-primary hover:no-underline">
                      <div className="flex w-full items-center justify-between pr-4">
                        <div className="flex items-center gap-3">
                          <div className="rounded-md bg-primary/10 p-2 text-primary">{category.icon}</div>
                          <div className="flex flex-col items-start text-left">
                            <span className="text-lg font-semibold">{category.title}</span>
                            {selectedOption ? (
                              <span className="mt-0.5 line-clamp-1 text-sm text-muted-foreground">
                                {selectedOption.name}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        {selectedOption ? (
                          <div className="text-sm font-medium text-foreground">{formatCurrency(selectedOption.price)}</div>
                        ) : null}
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-6">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {filteredOptions.length > 0 ? (
                          filteredOptions.map((option) => {
                            const isSelected = selections[category.id] === option.id;

                            return (
                              <Card
                                key={option.id}
                                className={`relative flex cursor-pointer flex-col overflow-hidden border-2 transition-colors duration-150 ${
                                  isSelected
                                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                                    : "border-border hover:border-primary/50 hover:bg-accent"
                                }`}
                                onClick={() => handleSelect(category.id, option.id)}
                              >
                                {category.id === "case" && "image" in option && option.image ? (
                                  <div className="h-24 w-full overflow-hidden border-b border-border/50 bg-muted">
                                    <img
                                      src={option.image}
                                      alt={option.name}
                                      loading="lazy"
                                      decoding="async"
                                      className="h-full w-full object-cover opacity-80"
                                    />
                                  </div>
                                ) : null}

                                <div className="flex flex-1 flex-col justify-between p-4">
                                  <div className="mb-2 flex items-start justify-between">
                                    <span className="pr-2 text-sm font-medium leading-tight">{option.name}</span>
                                    {isSelected ? (
                                      <div className="mt-0.5 shrink-0 rounded-full bg-primary p-0.5 text-primary-foreground">
                                        <Check className="h-3 w-3" />
                                      </div>
                                    ) : null}
                                  </div>
                                  <div className="mt-auto text-sm font-bold text-primary">+ {formatCurrency(option.price)}</div>
                                </div>
                              </Card>
                            );
                          })
                        ) : (
                          <div className="col-span-full rounded-md border border-dashed p-4 text-center text-sm text-muted-foreground">
                            Nenhuma opção compatível com a configuração atual.
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
            <div className="h-24" />
          </div>

          <div className="sticky bottom-0 left-0 right-0 z-20 border-t border-border bg-background p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] md:p-6">
            <Button className="group h-14 w-full text-lg font-bold uppercase tracking-wider">
              Concluir Configuração
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
