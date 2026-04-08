import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight } from "lucide-react";
import { allProducts } from "./productsData";

type Audience = "Todos" | "Gamers" | "Escritório";

interface CategoryCard {
  name: string;
  caption: string;
  href: string;
  image: string;
  emphasis?: "large";
}

const imageById = (id: number) => allProducts.find((product) => product.id === id)?.image ?? "";

const categoryGroups: Record<Audience, CategoryCard[]> = {
  Todos: [
    { name: "Hardware", caption: "Peças e componentes para montar ou turbinar seu setup", href: "/produtos", image: imageById(37), emphasis: "large" },
    { name: "Periféricos", caption: "Teclados, mouses e acessórios de uso diário", href: "/produtos?category=Perif%C3%A9ricos", image: imageById(16) },
    { name: "Computadores", caption: "Máquinas prontas e soluções para produtividade", href: "/produtos", image: imageById(27) },
    { name: "PC Gamer", caption: "Combinações pensadas para jogar com performance", href: "/produtos", image: imageById(6) },
    { name: "Placas de Vídeo", caption: "Mais poder gráfico para criação e jogos", href: "/produtos?category=Placas%20de%20V%C3%ADdeo", image: imageById(35) },
    { name: "Cadeiras", caption: "Conforto de longa duração para trabalho ou gameplay", href: "/produtos?category=Cadeiras", image: imageById(1) },
  ],
  Gamers: [
    { name: "Gabinetes", caption: "Fluxo de ar, vidro temperado e presença visual de setup", href: "/produtos?category=Gabinetes", image: imageById(6), emphasis: "large" },
    { name: "Placas de Vídeo", caption: "Renderização, FPS e visual no máximo", href: "/produtos?category=Placas%20de%20V%C3%ADdeo", image: imageById(35) },
    { name: "PC Gamer", caption: "Builds pensadas para jogar desde o primeiro boot", href: "/produtos", image: imageById(7) },
    { name: "Streaming", caption: "Áudio, suporte e presença para live e conteúdo", href: "/produtos?category=Streaming", image: imageById(26) },
    { name: "Mouse Gamer", caption: "Precisão, resposta rápida e conforto em combate", href: "/produtos?category=Perif%C3%A9ricos", image: imageById(16) },
  ],
  Escritório: [
    { name: "Computadores", caption: "Soluções versáteis para rotina, estudo e operação", href: "/produtos", image: imageById(27), emphasis: "large" },
    { name: "Monitores", caption: "Mais área útil e ergonomia para produtividade", href: "/produtos?category=Monitores", image: imageById(28) },
    { name: "SSD e HD", caption: "Armazenamento rápido para abrir tudo sem espera", href: "/produtos?category=SSD%20e%20HD", image: imageById(37) },
    { name: "Periféricos", caption: "Mouse, teclado e apoio para longas jornadas", href: "/produtos?category=Perif%C3%A9ricos", image: imageById(11) },
    { name: "Cadeiras", caption: "Postura e conforto pensados para o dia inteiro", href: "/produtos?category=Cadeiras", image: imageById(2) },
  ],
};

export function CategoryGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const [activeAudience, setActiveAudience] = useState<Audience>("Todos");

  const cards = useMemo(() => categoryGroups[activeAudience], [activeAudience]);

  return (
    <section ref={ref} className="py-24 md:py-32 px-5 md:px-8" style={{ background: isDark ? "#161617" : "transparent" }} id="explore">
      <div className="max-w-[1300px] mx-auto">
        <div className="mb-14 flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-primary tracking-[0.25em] mb-5"
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-label)", fontWeight: "var(--font-weight-medium)" }}
            >
              CATEGORIAS
            </motion.p>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: 80 }}
                  animate={isInView ? { y: 0 } : {}}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="text-foreground"
                  style={{ fontSize: "clamp(36px, 5vw, var(--text-h2))", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)", lineHeight: 1.02 }}
                >
                  Explore por categoria
                </motion.h2>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {(["Todos", "Gamers", "Escritório"] as Audience[]).map((audience) => {
                  const active = activeAudience === audience;
                  return (
                    <button
                      key={audience}
                      onClick={() => setActiveAudience(audience)}
                      onMouseEnter={() => setActiveAudience(audience)}
                      className={`cursor-pointer rounded-full border px-4 py-2 transition-all duration-300 ${
                        active
                          ? "border-primary/25 bg-primary/[0.1] text-foreground"
                          : "border-foreground/8 bg-transparent text-foreground/35 hover:text-foreground/70 hover:border-foreground/15"
                      }`}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "600" }}
                    >
                      {audience}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <Link
            to="/produtos"
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 self-start md:self-auto"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
          >
            Ver todas categorias
            <ArrowUpRight size={13} />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {cards.map((card, i) => {
            const isLarge = card.emphasis === "large";
            return (
              <motion.div
                key={`${activeAudience}-${card.name}`}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.06 * i }}
                className={isLarge ? "md:col-span-5" : "md:col-span-4"}
              >
                <Link
                  to={card.href}
                  className="group relative block h-full min-h-[260px] overflow-hidden"
                  style={{ borderRadius: "var(--radius-card)" }}
                >
                  <div className="absolute inset-0 bg-linear-to-br from-primary/[0.08] via-transparent to-transparent z-[1]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/12 to-transparent z-[1]" />
                  <ImageWithFallback
                    src={card.image}
                    alt={card.name}
                    className={`h-full w-full transition-transform duration-[1.4s] ease-out group-hover:scale-105 ${isLarge ? "object-contain p-8" : "object-contain p-7"}`}
                    style={{ background: isDark ? "#131314" : "#f4f4f4" }}
                  />

                  <div className="absolute left-0 right-0 top-0 z-[2] h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-700 group-hover:scale-x-100" />

                  <div className="absolute bottom-0 left-0 right-0 z-[2] p-6">
                    <p className="mb-2 text-white" style={{ fontFamily: "var(--font-family-figtree)", fontSize: isLarge ? "28px" : "22px", fontWeight: "600", lineHeight: 1.05 }}>
                      {card.name}
                    </p>
                    <p className="mb-4 max-w-[32ch] text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.55 }}>
                      {card.caption}
                    </p>
                    <span
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-white/85 backdrop-blur-sm transition-all duration-500 group-hover:bg-white group-hover:text-black"
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.1em" }}
                    >
                      VER CATEGORIA
                      <ArrowUpRight size={11} />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
