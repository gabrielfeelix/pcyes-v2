import { Link } from "react-router";
import { useTheme } from "./ThemeProvider";
import { ArrowUp } from "lucide-react";

const columns = [
  {
    title: "AJUDA E SUPORTE",
    links: [
      { label: "F.A.Q", href: "#" },
      { label: "Download e Suporte", href: "#" },
      { label: "Fale Conosco", href: "/fale-conosco" },
      { label: "Pedidos", href: "/perfil" },
      { label: "Política de Garantia, Trocas e Devoluções", href: "#" },
      { label: "Política de Privacidade", href: "#" },
      { label: "Termos de uso", href: "#" },
    ],
  },
  {
    title: "SOBRE A PCYES",
    links: [
      { label: "Quem somos", href: "#" },
      { label: "Onde Encontrar", href: "/onde-encontrar" },
      { label: "Seja um Influenciador", href: "/influenciadores" },
      { label: "Seja um Revendedor", href: "/revendedor" },
      { label: "Maringá FC × PCYES", href: "/maringa-fc" },
    ],
  },
];

const socialIcons = [
  { label: "Instagram", icon: "IG" },
  { label: "X", icon: "X" },
  { label: "YouTube", icon: "YT" },
  { label: "TikTok", icon: "TK" },
  { label: "Twitch", icon: "TW" },
];

const paymentMethods = ["Visa", "Master", "Amex", "Hiper", "Elo", "Pix", "Boleto"];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  return (
    <footer className={`${isDark ? "bg-[#0a0a0a]" : "bg-[#f5f5f5]"} border-t ${isDark ? "border-foreground/5" : "border-foreground/10"} text-foreground`}>
      <div className="max-w-[1300px] mx-auto px-5 md:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          
          {/* Brand & Mission & Socials */}
          <div className="md:col-span-4 flex flex-col items-start">
            <Link to="/" className="text-3xl font-black tracking-tighter mb-5 hover:opacity-80 transition-opacity" style={{ fontFamily: "var(--font-family-figtree)" }}>PCYES.</Link>
            <p className={`mb-8 text-sm leading-relaxed pr-4 ${isDark ? "text-foreground/60" : "text-foreground/70"}`} style={{ fontFamily: "var(--font-family-inter)" }}>
              A PCYES nasceu para impulsionar a performance dos gamers e profissionais, entregando produtos de alta qualidade, tecnologia e design inovador para o seu setup.
            </p>
            <div className="flex items-center gap-3">
              {socialIcons.map((s) => (
                <a key={s.label} href="#"
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-300 ${isDark ? "border-foreground/10 text-foreground/60 hover:text-foreground hover:border-foreground/30" : "border-foreground/20 text-foreground/60 hover:text-foreground hover:border-foreground/40"}`}
                  aria-label={s.label}
                >
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.02em" }}>{s.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8 md:pl-8">
            {columns.map((col) => (
              <div key={col.title}>
                <p className={isDark ? "text-foreground mb-6 tracking-wide" : "text-foreground mb-6 tracking-wide"}
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.04em" }}
                >{col.title}</p>
                <div className="flex flex-col gap-4">
                  {col.links.map((link) => (
                    <Link key={link.label} to={link.href}
                      className={isDark ? "text-foreground/60 hover:text-foreground transition-colors duration-300" : "text-foreground/70 hover:text-foreground transition-colors duration-300"}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                    >{link.label}</Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certificados */}
          <div className="md:col-span-3">
            <p className={isDark ? "text-foreground mb-6 tracking-wide" : "text-foreground mb-6 tracking-wide"}
              style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-bold)", letterSpacing: "0.04em" }}
            >CERTIFICADOS</p>
            <div className="flex items-center gap-4 flex-wrap">
              <div className={`w-[80px] h-[80px] bg-white rounded flex flex-col items-center justify-center shadow-sm border ${isDark ? 'border-transparent' : 'border-gray-200'}`}>
                  <div className="text-green-600" style={{ fontFamily: "var(--font-family-inter)", fontSize: "8px", fontWeight: "var(--font-weight-bold)" }}>CERTIFICADO</div>
                  <div className="text-green-700" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "18px", fontWeight: "900", lineHeight: "1" }}>RA</div>
                  <div className="text-green-700" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "900", lineHeight: "1" }}>1000</div>
                  <div className="text-gray-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "7px" }}>ReclameAqui</div>
              </div>
              <div className={`w-[80px] h-[80px] bg-white rounded flex flex-col items-center justify-center shadow-sm border ${isDark ? 'border-transparent' : 'border-gray-200'} p-2`}>
                  <div className="text-blue-600 mb-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-bold)" }}>SITE</div>
                  <div className="text-blue-800" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "13px", fontWeight: "900", lineHeight: "1" }}>SEGURO</div>
                  <div className="text-gray-500 mt-1 text-center leading-tight" style={{ fontFamily: "var(--font-family-inter)", fontSize: "6px" }}>Google<br/>Safe Browsing</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-[1300px] mx-auto px-5 md:px-8"><div className={`h-px ${isDark ? "bg-foreground/5" : "bg-foreground/10"}`} /></div>

      {/* Bottom Section */}
      <div className="max-w-[1300px] mx-auto px-5 md:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
          {/* Formas de Pagamento */}
          <div className="w-full md:w-auto">
            <p className={`mb-3 tracking-wider ${isDark ? "text-foreground" : "text-foreground"}`} style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-bold)" }}>FORMAS DE PAGAMENTO</p>
            <div className="flex items-center gap-2 flex-wrap">
              {paymentMethods.map((m) => (
                <div key={m} className={`h-[32px] px-3.5 bg-white rounded flex items-center justify-center shadow-sm border ${isDark ? 'border-transparent' : 'border-gray-200'}`}>
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)", color: "#111" }}>{m}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Voltar ao Topo */}
          <button onClick={scrollToTop}
            className={`flex items-center gap-3 transition-colors duration-300 cursor-pointer group ${isDark ? "text-foreground/50 hover:text-foreground" : "text-foreground/60 hover:text-foreground"}`}
          >
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}>Voltar ao topo</span>
            <span className={`w-10 h-10 rounded-full border group-hover:border-foreground flex items-center justify-center transition-all duration-300 ${isDark ? "border-foreground/20" : "border-foreground/30"}`}>
              <ArrowUp size={16} />
            </span>
          </button>
        </div>

        {/* Corporate Info */}
        <div className={`flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pt-6 border-t ${isDark ? "border-foreground/5" : "border-foreground/10"}`}>
          <div className="flex-1">
            <p className={isDark ? "text-foreground/50 mb-1" : "text-foreground/80 mb-1"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)" }}>
              Oderço Distribuidora de Eletrônicos LTDA - 09.301.845/0001-91
            </p>
            <p className={isDark ? "text-foreground/40" : "text-foreground/60"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", lineHeight: "1.6" }}>
              Av. Paranavaí, 1906 - Parque Industrial Bandeirantes, Maringá - PR, 87070-130 | Contato: (44) 2101-1400 | contato@pcyes.com.br
              <br/>
              &copy; {new Date().getFullYear()} Oderço Distribuidora | Todos os direitos reservados.
            </p>
          </div>
          <p className={isDark ? "text-foreground/30" : "text-foreground/50"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-bold)" }}>
            Desenvolvido por Oderço
          </p>
        </div>
      </div>
    </footer>
  );
}
