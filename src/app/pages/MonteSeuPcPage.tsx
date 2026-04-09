import { useState, useMemo } from "react";
import { Check, ChevronRight, Cpu, HardDrive, Monitor, Settings, Zap, ArrowRight, Save, Share2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ScrollArea } from "../components/ui/scroll-area";
import { Badge } from "../components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";

// --- Mock Data ---
const categories = [
  {
    id: "case",
    title: "Gabinete",
    icon: <Monitor className="w-5 h-5" />,
    options: [
      { id: "case-1", name: "PCYES Boreal Preto", price: 350, image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80", type: "black" },
      { id: "case-2", name: "PCYES Boreal Branco", price: 380, image: "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80", type: "white" },
      { id: "case-3", name: "PCYES RGB Master", price: 450, image: "https://images.unsplash.com/photo-1624704791357-1fb4603378b2?auto=format&fit=crop&q=80", type: "rgb" },
    ]
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
    ]
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
    ]
  },
  {
    id: "ram",
    title: "Memória RAM",
    icon: <Zap className="w-5 h-5" />,
    options: [
      { id: "ram-1", name: "16GB (2x8GB) DDR5 5200MHz", price: 400 },
      { id: "ram-2", name: "32GB (2x16GB) DDR5 6000MHz", price: 800 },
      { id: "ram-3", name: "64GB (2x32GB) DDR5 6400MHz", price: 1600 },
    ]
  },
  {
    id: "gpu",
    title: "Placa de Vídeo",
    icon: <Monitor className="w-5 h-5" />, // reusing icon for simplicity
    options: [
      { id: "gpu-1", name: "RTX 4060 8GB", price: 1800 },
      { id: "gpu-2", name: "RTX 4070 SUPER 12GB", price: 3800 },
      { id: "gpu-3", name: "RX 7800 XT 16GB", price: 3500 },
      { id: "gpu-4", name: "RTX 4090 24GB", price: 12000 },
    ]
  },
  {
    id: "storage",
    title: "Armazenamento",
    icon: <HardDrive className="w-5 h-5" />,
    options: [
      { id: "storage-1", name: "SSD 1TB NVMe M.2 Gen4", price: 450 },
      { id: "storage-2", name: "SSD 2TB NVMe M.2 Gen4", price: 850 },
      { id: "storage-3", name: "SSD 4TB NVMe M.2 Gen4", price: 1800 },
    ]
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
    ]
  }
];

export function MonteSeuPcPage() {
  const [selections, setSelections] = useState<Record<string, string>>({
    case: "case-2", // Default to white case
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
    
    // Auto-advance to next category if possible
    const currentIndex = categories.findIndex(c => c.id === categoryId);
    if (currentIndex < categories.length - 1) {
      setActiveCategory(categories[currentIndex + 1].id);
    }
  };

  const currentCase = useMemo(() => {
    const caseCategory = categories.find(c => c.id === "case");
    return caseCategory?.options.find(o => o.id === selections.case);
  }, [selections.case]);

  const totalPrice = useMemo(() => {
    return Object.entries(selections).reduce((acc, [catId, optId]) => {
      const category = categories.find(c => c.id === catId);
      const option = category?.options.find(o => o.id === optId);
      return acc + (option?.price || 0);
    }, 0);
  }, [selections]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row pt-16 md:pt-20 lg:pt-24">
      {/* LEFT PANEL - VISUALIZATION (Sticky) */}
      <div className="w-full md:w-1/2 lg:w-[60%] h-[40vh] md:h-[calc(100vh-6rem)] sticky top-16 md:top-20 lg:top-24 flex flex-col items-center justify-center p-4 md:p-8 bg-muted/20 relative overflow-hidden group border-r border-border">
        {/* Background ambient glow based on case */}
        <div 
          className="absolute inset-0 opacity-20 blur-3xl transition-colors duration-1000 mix-blend-screen"
          style={{
            backgroundColor: currentCase?.type === "white" ? "#ffffff" : currentCase?.type === "rgb" ? "#8b5cf6" : "#000000"
          }}
        />
        
        <div className="relative w-full h-full max-w-3xl flex items-center justify-center">
          {currentCase?.image ? (
             <img 
               src={currentCase.image} 
               alt="PC Configurator Visual" 
               className="object-contain max-h-full max-w-full drop-shadow-2xl transition-all duration-700 ease-in-out transform scale-100 group-hover:scale-105"
             />
          ) : (
            <div className="w-full h-full bg-muted rounded-xl animate-pulse" />
          )}
        </div>

        {/* Selected components badges overlay */}
        <div className="absolute bottom-8 left-8 right-8 hidden md:flex flex-wrap gap-2 justify-center opacity-80 hover:opacity-100 transition-opacity">
           {Object.entries(selections).map(([catId, optId]) => {
             if (catId === 'case') return null;
             const cat = categories.find(c => c.id === catId);
             const opt = cat?.options.find(o => o.id === optId);
             if (!opt) return null;
             return (
               <Badge key={catId} variant="secondary" className="bg-background/80 backdrop-blur-md border-primary/20 text-xs py-1">
                 {cat?.title}: {opt.name}
               </Badge>
             )
           })}
        </div>
      </div>

      {/* RIGHT PANEL - CONTROLS & SELECTION */}
      <div className="w-full md:w-1/2 lg:w-[40%] flex flex-col bg-background relative h-full md:h-[calc(100vh-6rem)]">
        
        {/* Header Summary */}
        <div className="p-6 md:p-8 border-b border-border bg-background z-10 sticky top-0 md:relative md:top-auto shadow-sm">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 uppercase">Monte seu PC</h1>
          <p className="text-muted-foreground text-sm mb-4">Personalize sua máquina com as melhores peças.</p>
          <div className="flex items-end justify-between">
             <div>
               <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Preço Estimado</p>
               <p className="text-3xl font-bold text-primary">
                 {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPrice)}
               </p>
             </div>
             <div className="flex gap-2">
               <Button variant="outline" size="icon" title="Salvar Configuração"><Save className="w-4 h-4" /></Button>
               <Button variant="outline" size="icon" title="Compartilhar"><Share2 className="w-4 h-4" /></Button>
             </div>
          </div>
        </div>

        {/* Categories Accordion */}
        <ScrollArea className="flex-1 px-6 md:px-8 py-4">
          <Accordion 
            type="single" 
            collapsible 
            value={activeCategory} 
            onValueChange={setActiveCategory}
            className="w-full"
          >
            {categories.map((category) => {
              const selectedOptionId = selections[category.id];
              const selectedOption = category.options.find(o => o.id === selectedOptionId);

              // Filter logic (e.g., Motherboard depends on CPU)
              const filteredOptions = category.options.filter(opt => {
                if (category.id === "motherboard" && opt.req) {
                  return opt.req.includes(selections.cpu);
                }
                return true;
              });

              return (
                <AccordionItem value={category.id} key={category.id} className="border-b border-border/50 py-2">
                  <AccordionTrigger className="hover:no-underline hover:text-primary transition-colors py-4">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-md text-primary">
                          {category.icon}
                        </div>
                        <div className="flex flex-col items-start text-left">
                          <span className="font-semibold text-lg">{category.title}</span>
                          {selectedOption && (
                            <span className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                              {selectedOption.name}
                            </span>
                          )}
                        </div>
                      </div>
                      {selectedOption && (
                        <div className="text-sm font-medium text-foreground">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedOption.price)}
                        </div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredOptions.length > 0 ? filteredOptions.map((option) => {
                        const isSelected = selections[category.id] === option.id;
                        return (
                          <Card 
                            key={option.id}
                            className={`relative cursor-pointer overflow-hidden transition-all duration-200 border-2 flex flex-col ${
                              isSelected 
                                ? "border-primary bg-primary/5 shadow-md shadow-primary/10 scale-[1.02]" 
                                : "border-border hover:border-primary/50 hover:bg-accent"
                            }`}
                            onClick={() => handleSelect(category.id, option.id)}
                          >
                            {/* Color/Image indicator for Case */}
                            {category.id === "case" && option.image && (
                              <div className="h-24 w-full bg-muted border-b border-border/50 overflow-hidden">
                                <img src={option.image} alt={option.name} className="w-full h-full object-cover opacity-80" />
                              </div>
                            )}
                            
                            <div className="p-4 flex flex-col flex-1 justify-between">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-sm leading-tight pr-2">{option.name}</span>
                                {isSelected && (
                                  <div className="bg-primary text-primary-foreground rounded-full p-0.5 shrink-0 mt-0.5">
                                    <Check className="w-3 h-3" />
                                  </div>
                                )}
                              </div>
                              <div className="text-sm font-bold text-primary mt-auto">
                                + {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(option.price)}
                              </div>
                            </div>
                          </Card>
                        )
                      }) : (
                        <div className="col-span-full text-sm text-muted-foreground p-4 text-center border rounded-md border-dashed">
                          Nenhuma opção compatível com a configuração atual.
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
          <div className="h-24" /> {/* Spacer for bottom bar */}
        </ScrollArea>

        {/* Bottom Action Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-background/80 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-20">
          <Button className="w-full h-14 text-lg font-bold uppercase tracking-wider group">
            Concluir Configuração
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

      </div>
    </div>
  );
}
