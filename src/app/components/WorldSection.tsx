import { motion } from "motion/react";
import { Link } from "react-router";

const videos = [
  {
    id: "9co8PcrCTDk",
    title: "Linha BrTT",
    category: "Periféricos",
    href: "/produtos?search=BrTT",
    cta: "Ver Linha BrTT",
    description: "Uma assinatura competitiva com identidade forte, periféricos marcantes e linguagem feita para quem joga para vencer.",
  },
  {
    id: "71hTv_lqLAc",
    title: "Linha Maringá FC",
    category: "Collab",
    href: "/maringa-fc",
    cta: "Ver Linha Maringá FC",
    description: "A collab oficial que leva o universo do clube para produtos exclusivos, com presença visual e sentimento de torcida.",
  },
  {
    id: "MTZcszksk_g",
    title: "Linha PCYES News",
    category: "Lançamentos",
    href: "/produtos",
    cta: "Ver Linha PCYES News",
    description: "Conteúdo, drops e lançamentos em uma frente viva da marca, conectando produto novo, cultura e movimento.",
  },
];

export function WorldSection() {
  return (
    <section className="py-32 px-5 md:px-8">
      <div className="max-w-[1300px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-6"
        >
          <h2
            className="text-foreground mb-5"
            style={{
              fontFamily: "var(--font-family-figtree)",
              fontSize: "clamp(32px, 4vw, var(--text-h3))",
              fontWeight: "var(--font-weight-light)",
              lineHeight: "1.1",
            }}
          >
            Linhas PCYES
          </h2>
          <p
            className="text-foreground/35 max-w-lg mx-auto mb-8"
            style={{
              fontFamily: "var(--font-family-inter)",
              fontSize: "var(--text-base)",
              lineHeight: "1.7",
            }}
          >
            Coleções, collabs e frentes criativas que traduzem a PCYES em linguagens diferentes, da arena competitiva ao conteúdo da marca.
          </p>
          <Link
            to="/produtos"
            className="inline-block px-8 py-3 border border-foreground/15 text-foreground/60 hover:text-foreground hover:border-foreground/40 transition-all duration-500"
            style={{
              borderRadius: "var(--radius-button)",
              fontFamily: "var(--font-family-inter)",
              fontSize: "13px",
              fontWeight: "var(--font-weight-medium)",
            }}
          >
            Explorar linhas
          </Link>
        </motion.div>

        {/* 3 vertical videos grid — more gap, shorter aspect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 mt-16">
          {videos.map((video, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: i * 0.15 }}
              className="group"
            >
              {/* Video container — zoomed in to fill, no black bars */}
              <Link
                to={video.href}
                className="block relative overflow-hidden aspect-[9/14] mb-6 cursor-pointer"
                style={{ borderRadius: "var(--radius-card)" }}
              >
                <iframe
                  src={`https://www.youtube.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&iv_load_policy=3&fs=0`}
                  title={video.title}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ border: "none", width: "300%", height: "200%", minWidth: "100%", minHeight: "100%" }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen={false}
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                {/* CTA at bottom on hover */}
                <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <span
                    className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md text-white/90 border border-white/15"
                    style={{
                      borderRadius: "var(--radius-button)",
                      fontFamily: "var(--font-family-inter)",
                      fontSize: "12px",
                      fontWeight: "var(--font-weight-medium)",
                    }}
                  >
                    {video.cta}
                  </span>
                </div>
              </Link>

              {/* Text below video */}
              <Link to={video.href}>
                <h3
                  className="text-foreground mb-2 group-hover:text-primary transition-colors duration-300"
                  style={{
                    fontFamily: "var(--font-family-figtree)",
                    fontSize: "20px",
                    fontWeight: "var(--font-weight-medium)",
                    lineHeight: "1.3",
                  }}
                >
                  {video.title}
                </h3>
              </Link>
              <p
                className="text-foreground/30"
                style={{
                  fontFamily: "var(--font-family-inter)",
                  fontSize: "var(--text-sm)",
                  lineHeight: "1.7",
                }}
              >
                {video.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
