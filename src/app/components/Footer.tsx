import { Link } from "react-router";
import { useTheme } from "./ThemeProvider";
import { ArrowUp, CreditCard } from "lucide-react";

const columns = [
  {
    title: "NAVEGUE",
    links: [
      { label: "Para Gamers", href: "/produtos?category=Periféricos" },
      { label: "Para Escritórios", href: "/produtos" },
    ],
  },
  {
    title: "SUPORTE",
    links: [
      { label: "F.A.Q", href: "#" },
      { label: "Download e Suporte", href: "#" },
      { label: "Fale Conosco", href: "/fale-conosco" },
      { label: "Pedidos", href: "/perfil" },
      { label: "Onde Encontrar", href: "/onde-encontrar" },
    ],
  },
  {
    title: "A PCYES",
    links: [
      { label: "Quem somos", href: "#" },
      { label: "Seja um Influenciador", href: "/influenciadores" },
      { label: "Seja um Revendedor", href: "/revendedor" },
      { label: "Onde Encontrar", href: "/onde-encontrar" },
      { label: "Maringá FC × PCYES", href: "/maringa-fc" },
    ],
  },
  {
    title: "LEGAL",
    links: [
      { label: "Política de Privacidade", href: "#" },
      { label: "Política de Garantia, Trocas e Devoluções", href: "#" },
      { label: "Termos de uso", href: "#" },
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
    <footer className={`${isDark ? "bg-[#0a0a0a]" : "bg-[#f5f5f5]"} border-t ${isDark ? "border-foreground/5" : "border-foreground/10"}`}>
      {/* Main footer links */}
      <div className="max-w-[1300px] mx-auto px-5 md:px-8 pt-16 pb-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <p className={isDark ? "text-foreground/50 mb-6 tracking-wide" : "text-foreground/70 mb-6 tracking-wide"}
                style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.04em" }}
              >{col.title}</p>
              <div className="flex flex-col gap-3.5">
                {col.links.map((link) => (
                  <Link key={link.label} to={link.href}
                    className={isDark ? "text-foreground/30 hover:text-foreground transition-colors duration-300" : "text-foreground/50 hover:text-foreground transition-colors duration-300"}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                  >{link.label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Separator */}
      <div className="max-w-[1300px] mx-auto px-5 md:px-8"><div className={`h-px ${isDark ? "bg-foreground/5" : "bg-foreground/10"}`} /></div>

      {/* Payment + Seal */}
      <div className="max-w-[1300px] mx-auto px-5 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* RA 1000 Seal */}
          <div className="flex items-center gap-5">
            <div className="w-[80px] h-[80px] bg-white rounded-lg flex items-center justify-center flex-shrink-0 p-2 shadow-sm">
              <div className="text-center">
                <div className="text-green-600" style={{ fontFamily: "var(--font-family-inter)", fontSize: "8px", fontWeight: "var(--font-weight-medium)" }}>CERTIFICADO</div>
                <div className="text-green-700" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)", lineHeight: "1" }}>RA</div>
                <div className="text-green-700" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "var(--font-weight-medium)", lineHeight: "1" }}>1000</div>
                <div className="text-gray-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "6px" }}>ReclameAqui</div>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={14} className={isDark ? "text-foreground/30" : "text-foreground/50"} />
              <span className={isDark ? "text-foreground/50 tracking-wider" : "text-foreground/70 tracking-wider"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>FORMAS DE PAGAMENTO</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {paymentMethods.map((m) => (
                <div key={m} className="w-[52px] h-[34px] bg-white rounded flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)", color: "#333" }}>{m}</span>
                </div>
              ))}
            </div>
            <p className={isDark ? "text-foreground/20" : "text-foreground/50"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
              Parcele suas compras ou ganhe descontos exclusivos pagando via Pix ou Boleto.
            </p>
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="max-w-[1300px] mx-auto px-5 md:px-8"><div className={`h-px ${isDark ? "bg-foreground/5" : "bg-foreground/10"}`} /></div>

      {/* Bottom row */}
      <div className="max-w-[1300px] mx-auto px-5 md:px-8 py-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-10">
          {/* Company info */}
          <div className="flex-1">
            <p className={isDark ? "text-foreground/30 mb-1.5" : "text-foreground/60 mb-1.5"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>
              Oderco Distribuidora de Eletronicos LTDA - 09.301.845/0001-91
            </p>
            <p className={isDark ? "text-foreground/15 mb-4 max-w-lg" : "text-foreground/40 mb-4 max-w-lg"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", lineHeight: "1.7" }}>
              Endereço: Av. Paranavaí, 1906 - Parque Industrial Bandeirantes, Maringá - PR, 87070-130 |{" "}
              <span className={isDark ? "text-foreground/25" : "text-foreground/50"}>Telefone: (44) 2101-1400</span> |{" "}
              <span className={isDark ? "text-foreground/25" : "text-foreground/50"}>E-mail: contato@pcyes.com.br</span>
            </p>
            <div className={`h-px ${isDark ? "bg-foreground/5" : "bg-foreground/10"} mb-4 max-w-lg`} />
            <p className={isDark ? "text-foreground/15" : "text-foreground/40"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>
              Oderço Distribuidora &copy; 1988 - 2026 | Todos os direitos reservados
            </p>
          </div>

          {/* Right side */}
          <div className="flex flex-col items-start md:items-end gap-6">
            {/* Scroll to top */}
            <button onClick={scrollToTop}
              className={`flex items-center gap-2 transition-colors duration-300 cursor-pointer group ${isDark ? "text-foreground/25 hover:text-foreground" : "text-foreground/40 hover:text-foreground"}`}
            >
              <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>Voltar ao topo</span>
              <span className={`w-9 h-9 rounded-full border group-hover:border-foreground/25 flex items-center justify-center transition-all duration-300 ${isDark ? "border-foreground/10" : "border-foreground/15"}`}>
                <ArrowUp size={14} />
              </span>
            </button>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialIcons.map((s) => (
                <a key={s.label} href="#"
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${isDark ? "border-foreground/10 text-foreground/25 hover:text-foreground hover:border-foreground/30" : "border-foreground/15 text-foreground/40 hover:text-foreground hover:border-foreground/30"}`}
                  aria-label={s.label}
                >
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.02em" }}>{s.icon}</span>
                </a>
              ))}
            </div>

            {/* Developed by */}
            <p className={isDark ? "text-foreground/10" : "text-foreground/30"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>
              Desenvolvido por Oderço
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
