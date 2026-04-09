import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { motion, useInView } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowUpRight } from "lucide-react";

type Audience = "Todos" | "Gamers" | "Escritório";

interface CategoryCard {
  name: string;
  caption: string;
  href: string;
  image: string;
  span: string;
}

const categoryGroups: Record<Audience, CategoryCard[]> = {
  Todos: [
    {
      name: "Hardware",
      caption: "Peças e componentes para upgrades completos",
      href: "/produtos",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1 sm:col-span-2 row-span-2",
    },
    {
      name: "Periféricos",
      caption: "Mouse, teclado, headset e acessórios do dia a dia",
      href: "/produtos?category=Perif%C3%A9ricos",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "Computadores",
      caption: "Soluções prontas para produtividade e operação",
      href: "/produtos",
      image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "PC Gamer",
      caption: "Combinações pensadas para jogar com performance",
      href: "/produtos",
      image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "Placas de Vídeo",
      caption: "Mais poder gráfico para criação e jogos",
      href: "/produtos?category=Placas%20de%20V%C3%ADdeo",
      image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "Cadeiras",
      caption: "Conforto para longas jornadas no setup",
      href: "/produtos?category=Cadeiras",
      image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1 sm:col-span-2",
    },
  ],
  Gamers: [
    {
      name: "Gabinetes",
      caption: "Presença visual, airflow e vidro temperado",
      href: "/produtos?category=Gabinetes",
      image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1 sm:col-span-2 row-span-2",
    },
    {
      name: "Placas de Vídeo",
      caption: "FPS alto, ray tracing e potência bruta",
      href: "/produtos?category=Placas%20de%20V%C3%ADdeo",
      image: "https://images.unsplash.com/photo-1591799265444-d66432b91588?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "PC Gamer",
      caption: "Builds prontas para entrar em jogo",
      href: "/produtos",
      image: "https://images.unsplash.com/photo-1629429408209-1f912961dbd8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "Streaming",
      caption: "Áudio, suporte e presença para criadores",
      href: "/produtos?category=Streaming",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "Mouse Gamer",
      caption: "Precisão e resposta rápida na mão",
      href: "/produtos?category=Perif%C3%A9ricos",
      image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1 sm:col-span-2",
    },
  ],
  Escritório: [
    {
      name: "Computadores",
      caption: "Máquinas versáteis para rotina e operação",
      href: "/produtos",
      image: "https://images.unsplash.com/photo-1496171367470-9ed9a91ea931?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1 sm:col-span-2 row-span-2",
    },
    {
      name: "Monitores",
      caption: "Mais área útil e ergonomia para produtividade",
      href: "/produtos?category=Monitores",
      image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "SSD e HD",
      caption: "Armazenamento rápido para abrir tudo sem espera",
      href: "/produtos?category=SSD%20e%20HD",
      image: "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "Periféricos",
      caption: "Itens essenciais para uma mesa funcional",
      href: "/produtos?category=Perif%C3%A9ricos",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1",
    },
    {
      name: "Cadeiras",
      caption: "Postura e conforto pensados para o dia inteiro",
      href: "/produtos?category=Cadeiras",
      image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1200",
      span: "col-span-1 sm:col-span-2",
    },
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
    <section
      ref={ref}
      className="relative overflow-hidden px-5 pt-14 pb-16 md:px-8 md:pt-18 md:pb-20"
      style={{ background: isDark ? "#0d0b0b" : "transparent" }}
      id="explore"
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,43,46,0.08)_0%,transparent_72%)]" />

      <div className="relative max-w-[1300px] mx-auto">
        <div className="mb-12 flex flex-col items-center text-center gap-6">
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

            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: 80 }}
                animate={isInView ? { y: 0 } : {}}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-foreground"
                style={{ fontSize: "clamp(42px, 6vw, 74px)", fontFamily: "var(--font-family-figtree)", fontWeight: "var(--font-weight-light)", letterSpacing: "-0.03em" }}
              >
                Explore por categoria
              </motion.h2>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2">
            {(["Todos", "Gamers", "Escritório"] as Audience[]).map((audience) => {
              const active = activeAudience === audience;
              return (
                <button
                  key={audience}
                  onClick={() => setActiveAudience(audience)}
                  onMouseEnter={() => setActiveAudience(audience)}
                  className={`cursor-pointer rounded-full border px-4 py-2 transition-all duration-300 ${
                    active
                      ? "border-primary/30 bg-primary/[0.12] text-foreground"
                      : "border-white/10 bg-transparent text-white/45 hover:text-white/75 hover:border-white/20"
                  }`}
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "600" }}
                >
                  {audience}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 auto-rows-[220px] gap-4">
          {cards.map((card, i) => (
            <Link
              key={`${activeAudience}-${card.name}`}
              to={card.href}
              className={`group relative overflow-hidden cursor-pointer block ${card.span}`}
              style={{ borderRadius: "var(--radius-card)" }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.07 * i, ease: [0.16, 1, 0.3, 1] }}
                className="relative h-full w-full"
              >
                <ImageWithFallback
                  src={card.image}
                  alt={card.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/14 to-transparent group-hover:from-black/85 transition-all duration-500" />
                <div className="absolute inset-x-0 top-0 h-[2px] origin-left scale-x-0 bg-primary transition-transform duration-700 group-hover:scale-x-100" />

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-white mb-1.5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "clamp(22px, 2vw, 28px)", fontWeight: "600", lineHeight: 1.05 }}>
                    {card.name}
                  </p>
                  <p className="mb-4 max-w-[30ch] text-white/55" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.55 }}>
                    {card.caption}
                  </p>
                  <span
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/80 group-hover:bg-white group-hover:text-black transition-all duration-500"
                    style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.08em" }}
                  >
                    Ver categoria
                    <ArrowUpRight size={11} />
                  </span>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
