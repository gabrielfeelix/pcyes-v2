'use client';

import React, { useState, useEffect, useRef, type ReactNode } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { Search, ShoppingBag, User, Menu, X, Clock, TrendingUp, ArrowUpRight, Heart, ChevronRight, Download, FileText, Sparkles, Grid2x2, Box, Monitor, Cpu, Radio } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { useCart } from "./CartContext";
import { useAuth } from "./AuthContext";
import { useFavorites } from "./FavoritesContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { allProducts } from "./productsData";
import { ThemeToggle } from "./ThemeToggle";

const PCYES_LOGO = "https://pcyes-cdn.oderco.com.br/Logotipos/PCYES/Simbolo-Logo-Horiz-Vermelho.png";

// ─── Mega Menu Data ──────────────────────────────────────────────────────────

interface ProductCard { id: number; name: string; subtitle: string; image: string; price: string; badge?: string }
interface LayoutCard { label: string; desc: string; href: string; image?: string }
interface DownloadItem { name: string; version: string; date: string; href: string }

type RightPanel =
  | { type: "products"; title: string; products: ProductCard[] }
  | { type: "layouts"; title: string; layouts: LayoutCard[] }
  | { type: "featured"; title: string; image: string; name: string; desc: string; href: string }
  | { type: "downloads"; title: string; items: DownloadItem[] };

interface MegaSubItem { label: string; href: string; right: RightPanel }
interface MegaMenu { title: string; subItems: MegaSubItem[] }

const megaMenus: Record<string, MegaMenu> = {
  hardware: {
    title: "Hardware",
    subItems: [
      {
        label: "Placas de Vídeo", href: "/produtos?category=Placas de Vídeo",
        right: {
          type: "products", title: "Placas de Vídeo",
          products: [
            { id: 31, name: "GT 710 2GB DDR3", subtitle: "Low Profile", image: "https://cdn.oderco.com.br/produtos/282767/2D04A9618C5EF13EE0630300A8C0554C", price: "R$ 499,90", badge: "-20%" },
            { id: 32, name: "GT 740 2GB GDDR5", subtitle: "128 Bits", image: "https://cdn.oderco.com.br/produtos/259330/189437062258193CE0630300A8C08D4D", price: "R$ 499,90" },
            { id: 33, name: "GT740 4GB GDDR5", subtitle: "128 Bits High Perf", image: "https://cdn.oderco.com.br/produtos/261071/1982E845579812A0E0630300A8C04222", price: "R$ 499,90" },
            { id: 34, name: "GT730 2GB DDR5", subtitle: "64 Bits Edge LP", image: "https://cdn.oderco.com.br/produtos/261089/1982E845579A12A0E0630300A8C04222", price: "R$ 499,90", badge: "-20%" },
          ]
        }
      },
      {
        label: "SSD e HD", href: "/produtos?category=SSD e HD",
        right: {
          type: "products", title: "Armazenamento",
          products: [
            { id: 36, name: "SSD PCYES 256GB", subtitle: "M.2 NVMe PCIe 3.0", image: "https://cdn.oderco.com.br/produtos/202394/401A241D79BE4FABE0630300A8C0903C", price: "R$ 299,90" },
            { id: 37, name: "SSD PCYES 512GB", subtitle: "M.2 NVMe 2200MB/s", image: "https://cdn.oderco.com.br/produtos/202394/401A241D79BE4FABE0630300A8C0903C", price: "R$ 299,90", badge: "-20%" },
            { id: 39, name: "SSD PCYES 1TB", subtitle: "SATA III Alta Capacidade", image: "https://cdn.oderco.com.br/produtos/202396/401A241D79B44FABE0630300A8C0903C", price: "R$ 299,90" },
          ]
        }
      },
      {
        label: "Refrigeração", href: "/produtos?category=Refrigeração",
        right: {
          type: "products", title: "Refrigeração",
          products: [
            { id: 41, name: "Cooler Nótus ST", subtitle: "Intel TDP 65W", image: "https://cdn.oderco.com.br/produtos/32846/3F9F1AE4EDB8A0D1E0630300A8C05422", price: "R$ 349,90" },
            { id: 42, name: "Sangue Frio 3", subtitle: "Water Cooler 120mm", image: "https://cdn.oderco.com.br/produtos/210397/3D7FF909C0F830B1E0630300A8C042C0", price: "R$ 349,90" },
            { id: 43, name: "Sangue Frio 3 ARGB", subtitle: "Water Cooler 120mm", image: "https://cdn.oderco.com.br/produtos/210410/3D7292BA47F8A9BFE0630300A8C09253", price: "R$ 349,90", badge: "-20%" },
          ]
        }
      },
      {
        label: "Gabinetes", href: "/produtos?category=Gabinetes",
        right: {
          type: "products", title: "Gabinetes",
          products: [
            { id: 6, name: "Forcefield Max", subtitle: "Black Vulcan Vidro Temperado", image: "https://cdn.oderco.com.br/produtos/252557/3F00DCAA20B56D04E0630300A8C06874", price: "R$ 599,90" },
            { id: 7, name: "Forcefield", subtitle: "Black Vulcan Vidro Temperado", image: "https://cdn.oderco.com.br/produtos/191991/3F00DCAA20E46D04E0630300A8C06874", price: "R$ 599,90", badge: "-20%" },
            { id: 8, name: "Forcefield", subtitle: "White Ghost Vidro Temperado", image: "https://cdn.oderco.com.br/produtos/191992/3F00DCAA20EA6D04E0630300A8C06874", price: "R$ 599,90" },
            { id: 9, name: "Set Black Vulcan", subtitle: "Vidro Temperado Lateral", image: "https://cdn.oderco.com.br/produtos/191993/3F00DCAA20D96D04E0630300A8C06874", price: "R$ 599,90" },
          ]
        }
      },
      {
        label: "Monitores", href: "/produtos?category=Monitores",
        right: {
          type: "layouts", title: "Monitores por Resolução",
          layouts: [
            { label: "Full HD 1080p", desc: "Ideal para gaming e trabalho do dia a dia", href: "/produtos?category=Monitores" },
            { label: "Quad HD 1440p", desc: "Qualidade e nitidez superiores", href: "/produtos?category=Monitores" },
            { label: "Ultra HD 4K", desc: "Resolução máxima para criadores", href: "/produtos?category=Monitores" },
            { label: "Curvo Ultrawide", desc: "Imersão total no setup", href: "/produtos?category=Monitores" },
            { label: "Alta Taxa de Atualização", desc: "144Hz, 165Hz e 240Hz disponíveis", href: "/produtos?category=Monitores" },
          ]
        }
      },
      {
        label: "Fontes", href: "/produtos",
        right: {
          type: "layouts", title: "Fontes por Certificação",
          layouts: [
            { label: "80 Plus Bronze", desc: "Custo-benefício para montagens simples", href: "/produtos" },
            { label: "80 Plus Gold", desc: "Alta eficiência para gaming", href: "/produtos" },
            { label: "80 Plus Platinum", desc: "Máxima eficiência energética", href: "/produtos" },
            { label: "Fontes Modulares", desc: "Organização de cabos facilitada", href: "/produtos" },
            { label: "Fontes Semi-Modulares", desc: "Equilíbrio entre preço e organização", href: "/produtos" },
          ]
        }
      },
    ]
  },

  perifericos: {
    title: "Periféricos",
    subItems: [
      {
        label: "Teclados", href: "/produtos?category=Periféricos",
        right: {
          type: "layouts", title: "Teclados por Layout",
          layouts: [
            { label: "100% Full Size", desc: "Com teclado numérico completo", href: "/produtos?category=Periféricos", image: "https://cdn.oderco.com.br/produtos/246231/3FA2133D8BCE330EE0630300A8C0F6B9" },
            { label: "80% TKL", desc: "Sem teclado numérico", href: "/produtos?category=Periféricos", image: "https://cdn.oderco.com.br/produtos/199408/3FA0B95161429B0EE0630300A8C04A18" },
            { label: "75% Compact", desc: "Formato popular e otimizado", href: "/produtos?category=Periféricos", image: "https://cdn.oderco.com.br/produtos/199409/3FA2133D8BC8330EE0630300A8C0F6B9" },
            { label: "65% Compact", desc: "Focado nas setas direcionais", href: "/produtos?category=Periféricos", image: "https://cdn.oderco.com.br/produtos/246230/3FA0FF24E03F4B06E0630300A8C0A92F" },
            { label: "60% Mini", desc: "Ultra compacto para viagem", href: "/produtos?category=Periféricos", image: "https://cdn.oderco.com.br/produtos/286135/25C7064E389DE6C2E0630300A8C0EDA5" },
          ]
        }
      },
      {
        label: "Mouse", href: "/produtos?category=Periféricos",
        right: {
          type: "products", title: "Mouse Gamer",
          products: [
            { id: 16, name: "Basaran Black Vulcan", subtitle: "12400 DPI Silent Click", image: "https://cdn.oderco.com.br/produtos/199399/3F2E42F714F7871CE0630300A8C048F6", price: "R$ 249,90", badge: "-20%" },
            { id: 17, name: "Basaran Stealth White", subtitle: "10000 DPI Sem Fio RGB", image: "https://cdn.oderco.com.br/produtos/199420/FBD0003333EA8CF3E0530300A8C0E348", price: "R$ 249,90" },
            { id: 18, name: "Gaius RGB", subtitle: "12400 DPI 6 Botões", image: "https://cdn.oderco.com.br/produtos/199396/3F2E42F714EB871CE0630300A8C048F6", price: "R$ 249,90" },
          ]
        }
      },
      {
        label: "Mousepads", href: "/produtos?category=Periféricos",
        right: {
          type: "products", title: "Mousepads",
          products: [
            { id: 11, name: "Obsidian G2D Black", subtitle: "500x400mm Speed", image: "https://cdn.oderco.com.br/produtos/207001/0813C43B72B06C60E0630300A8C0C984", price: "R$ 149,90" },
            { id: 12, name: "Obsidian G3D Vidro", subtitle: "500x400mm Glass", image: "https://cdn.oderco.com.br/produtos/207002/FD6585990BA79601E0530300A8C09D90", price: "R$ 149,90" },
            { id: 14, name: "Obsidian G2D Extended", subtitle: "900x420mm Desk Mat", image: "https://cdn.oderco.com.br/produtos/230652/3FA519DFE3CDF8BBE0630300A8C0CD12", price: "R$ 149,90" },
            { id: 15, name: "Maze White Ghost", subtitle: "900x420mm Extended", image: "https://cdn.oderco.com.br/produtos/268133/3FA5BA5A4893B008E0630300A8C0D3E2", price: "R$ 149,90" },
          ]
        }
      },
      {
        label: "Cadeiras", href: "/produtos?category=Cadeiras",
        right: {
          type: "products", title: "Cadeiras Gamer",
          products: [
            { id: 1, name: "Mad Racer V8 Turbo", subtitle: "Amarela — Ergonômica", image: "https://cdn.oderco.com.br/produtos/210197/06D1CA7F36792E05E0630300A8C051C3", price: "R$ 1.299,90", badge: "-20%" },
            { id: 2, name: "Sentinel Black Vulcan", subtitle: "Ergonômica Gamer", image: "https://cdn.oderco.com.br/produtos/212141/138B26D1B2A5AFE5E0630300A8C068DE", price: "R$ 1.299,90" },
            { id: 3, name: "Sentinel Red Magma", subtitle: "Ergonômica Gamer", image: "https://cdn.oderco.com.br/produtos/212143/138B26D1B2AAAFE5E0630300A8C068DE", price: "R$ 1.299,90" },
            { id: 4, name: "Sentinel Cobalt Blue", subtitle: "Ergonômica Gamer", image: "https://cdn.oderco.com.br/produtos/212146/138B26D1B2AFAFE5E0630300A8C068DE", price: "R$ 1.299,90" },
          ]
        }
      },
      {
        label: "Headsets", href: "/produtos?category=Periféricos",
        right: {
          type: "layouts", title: "Headsets por Conexão",
          layouts: [
            { label: "USB 7.1 Surround", desc: "Som envolvente para gaming", href: "/produtos?category=Periféricos" },
            { label: "P2 Analógico", desc: "Compatibilidade universal", href: "/produtos?category=Periféricos" },
            { label: "2.4 GHz Sem Fio", desc: "Liberdade e baixa latência", href: "/produtos?category=Periféricos" },
            { label: "Bluetooth 5.0", desc: "Multi-dispositivo e portátil", href: "/produtos?category=Periféricos" },
          ]
        }
      },
      {
        label: "Streaming", href: "/produtos?category=Streaming",
        right: {
          type: "layouts", title: "Streaming & Podcast",
          layouts: [
            { label: "Microfones USB", desc: "Qualidade estúdio plug & play", href: "/produtos?category=Streaming" },
            { label: "Braço Articulado", desc: "Posicionamento profissional", href: "/produtos?category=Streaming" },
            { label: "Webcams HD", desc: "Imagem nítida para lives e calls", href: "/produtos?category=Streaming" },
            { label: "Interface de Áudio", desc: "Controle total do som", href: "/produtos?category=Streaming" },
          ]
        }
      },
    ]
  },

  computadores: {
    title: "Computadores",
    subItems: [
      {
        label: "Mini PC", href: "/produtos",
        right: {
          type: "featured", title: "Mini PC",
          image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
          name: "PCYES Mini PC",
          desc: "Potência em formato compacto. Ideal para escritório, escola e entretenimento.",
          href: "/produtos"
        }
      },
      {
        label: "PCYES One", href: "/produtos",
        right: {
          type: "featured", title: "PCYES One",
          image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
          name: "PCYES One — All in One",
          desc: "Monitor e computador integrados. Design limpo, zero cabos, máxima praticidade.",
          href: "/produtos"
        }
      },
      {
        label: "Workstation", href: "/produtos",
        right: {
          type: "layouts", title: "Workstation por Finalidade",
          layouts: [
            { label: "Edição de Vídeo", desc: "Processamento pesado e RAM de alta capacidade", href: "/produtos" },
            { label: "Design Gráfico", desc: "GPU poderosa e display preciso", href: "/produtos" },
            { label: "Desenvolvimento", desc: "Multitarefa extrema com SSD rápido", href: "/produtos" },
            { label: "Renderização 3D", desc: "CPU multi-core e GPU profissional", href: "/produtos" },
          ]
        }
      },
    ]
  },

  pcgamer: {
    title: "PC Gamer",
    subItems: [
      {
        label: "Entrada", href: "/produtos",
        right: {
          type: "layouts", title: "PC Gamer Entrada",
          layouts: [
            { label: "Starter R$ 2.500", desc: "1080p @ 60fps — Jogos leves e esports", href: "/produtos" },
            { label: "Entry R$ 3.500", desc: "1080p @ 100fps — Gaming do dia a dia", href: "/produtos" },
            { label: "Budget R$ 4.500", desc: "1080p @ 144fps — Esports competitivo", href: "/produtos" },
          ]
        }
      },
      {
        label: "Intermediário", href: "/produtos",
        right: {
          type: "layouts", title: "PC Gamer Intermediário",
          layouts: [
            { label: "Mid R$ 5.500", desc: "1440p @ 60fps — AAA em alta qualidade", href: "/produtos" },
            { label: "Standard R$ 7.000", desc: "1440p @ 144fps — Gaming premium", href: "/produtos" },
            { label: "Plus R$ 8.500", desc: "4K @ 60fps — Qualidade máxima visual", href: "/produtos" },
          ]
        }
      },
      {
        label: "Avançado", href: "/produtos",
        right: {
          type: "layouts", title: "PC Gamer Avançado",
          layouts: [
            { label: "Pro R$ 10.000", desc: "4K @ 144fps — RTX ON em tudo", href: "/produtos" },
            { label: "Elite R$ 15.000", desc: "4K @ 240fps — Competitivo de alto nível", href: "/produtos" },
            { label: "Ultimate R$ 20.000+", desc: "Sem limites — O melhor do melhor", href: "/produtos" },
          ]
        }
      },
      {
        label: "Pré-Montados", href: "/produtos",
        right: {
          type: "featured", title: "PCs Prontos",
          image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
          name: "Desempenho garantido",
          desc: "Máquinas testadas e prontas para jogar. Garantia total PCYES.",
          href: "/produtos"
        }
      },
    ]
  },

  collab: {
    title: "Collabs",
    subItems: [
      {
        label: "Maringá FC × PCYES", href: "/maringa-fc",
        right: {
          type: "featured", title: "Collab Oficial",
          image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Maring%C3%A1_FC_logo.svg/512px-Maring%C3%A1_FC_logo.svg.png",
          name: "Maringá FC × PCYES",
          desc: "Produtos exclusivos da parceria oficial entre PCYES e o Maringá Futebol Clube. Represente seu time.",
          href: "/maringa-fc"
        }
      },
    ]
  },

  drivers: {
    title: "Drivers e Manuais",
    subItems: [
      {
        label: "Headsets", href: "#",
        right: {
          type: "downloads", title: "Headsets — Drivers",
          items: [
            { name: "Driver Headset Zyron USB 7.1", version: "v2.4.1", date: "Jan 2025", href: "#" },
            { name: "Driver Headset Taranis RGB", version: "v1.9.3", date: "Mar 2024", href: "#" },
            { name: "Manual do Usuário — Série Headset", version: "Rev. 3", date: "Dez 2024", href: "#" },
          ]
        }
      },
      {
        label: "Teclados", href: "#",
        right: {
          type: "downloads", title: "Teclados — Drivers & Software",
          items: [
            { name: "PCYES Lighting Control — Kuromori", version: "v3.1.0", date: "Fev 2025", href: "#" },
            { name: "Driver Teclado Mecânico Universal", version: "v2.0.5", date: "Jan 2025", href: "#" },
            { name: "Manual Kuromori Series", version: "Rev. 2", date: "Nov 2024", href: "#" },
          ]
        }
      },
      {
        label: "Mouse", href: "#",
        right: {
          type: "downloads", title: "Mouse — Drivers & Software",
          items: [
            { name: "PCYES Mouse Config — Basaran", version: "v2.2.0", date: "Mar 2025", href: "#" },
            { name: "Driver Mouse Sem Fio Receptor 2.4G", version: "v1.4.2", date: "Fev 2025", href: "#" },
            { name: "Manual Série Basaran / Gaius", version: "Rev. 1", date: "Out 2024", href: "#" },
          ]
        }
      },
      {
        label: "Monitores", href: "#",
        right: {
          type: "downloads", title: "Monitores — Manuais",
          items: [
            { name: "Manual Monitor PCYES Full HD", version: "Rev. 4", date: "Jan 2025", href: "#" },
            { name: "Manual Monitor Curvo 144Hz", version: "Rev. 2", date: "Abr 2024", href: "#" },
            { name: "Guia de Calibração de Cores", version: "v1.0", date: "Mai 2024", href: "#" },
          ]
        }
      },
      {
        label: "Gabinetes", href: "#",
        right: {
          type: "downloads", title: "Gabinetes — Manuais",
          items: [
            { name: "Manual Gabinete Forcefield Series", version: "Rev. 3", date: "Dez 2024", href: "#" },
            { name: "Manual Gabinete Set Series", version: "Rev. 2", date: "Set 2024", href: "#" },
            { name: "Guia de Montagem Universal", version: "v2.0", date: "Jul 2024", href: "#" },
          ]
        }
      },
      {
        label: "Cadeiras", href: "#",
        right: {
          type: "downloads", title: "Cadeiras — Manuais",
          items: [
            { name: "Manual Montagem Mad Racer V8", version: "Rev. 2", date: "Nov 2024", href: "#" },
            { name: "Manual Série Sentinel", version: "Rev. 3", date: "Jan 2025", href: "#" },
            { name: "Guia de Ajuste Ergonômico", version: "v1.1", date: "Ago 2024", href: "#" },
          ]
        }
      },
    ]
  },
};

// ─── Nav Items ───────────────────────────────────────────────────────────────

interface NavItem { label: string; href?: string; mega?: string }

const navItems: NavItem[] = [
  { label: "Novidades", href: "/produtos" },
  { label: "Hardware", mega: "hardware", href: "/produtos" },
  { label: "Periféricos", mega: "perifericos", href: "/produtos?category=Periféricos" },
  { label: "Computadores", mega: "computadores", href: "/produtos" },
  { label: "PC Gamer", mega: "pcgamer", href: "/produtos" },
  { label: "Collab", mega: "collab", href: "/maringa-fc" },
  { label: "Monte seu PC", href: "/monte-seu-pc" },
  { label: "Seja Influenciador", href: "/influenciadores" },
  { label: "Seja Revendedor", href: "/revendedor" },
  { label: "Drivers e Manuais", mega: "drivers", href: "#" },
  { label: "Fale Conosco", href: "/fale-conosco" },
];

const trending = ["Gabinete Spectrum", "Mouse Cobra", "Teclado Mecânico", "Headset 7.1"];
const recent = ["Fontes modulares", "Cadeiras gaming"];

const isPlaceholderHref = (href?: string) => !href || href === "#";
const resolveMenuHref = (href?: string) => (isPlaceholderHref(href) ? "/produtos" : href);
const getCatalogProduct = (id: number) => allProducts.find((product) => product.id === id);

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [promoHovered, setPromoHovered] = useState(false);
  const [countdown, setCountdown] = useState({ h: 0, m: 0, s: 0 });
  const [activeMega, setActiveMega] = useState<string | null>(null);
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const { isLoggedIn, setAuthModalOpen } = useAuth();
  const { count: favCount } = useFavorites();
  const { resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchDropdownRef = useRef<HTMLDivElement>(null);

  // Countdown
  useEffect(() => {
    const target = new Date(); target.setHours(23, 59, 59, 999);
    const targetTime = target.getTime();
    const tick = () => {
      const diff = Math.max(0, targetTime - Date.now());
      if (diff <= 0) { setPromoDismissed(true); return; }
      setCountdown({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setSearchOpen((p) => !p); }
      if (e.key === "Escape" && searchOpen) { setSearchOpen(false); setSearchQuery(""); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [searchOpen]);

  useEffect(() => { if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 100); else setSearchQuery(""); }, [searchOpen]);
  useEffect(() => {
    if (!searchOpen) return;
    const h = (e: MouseEvent) => { if (searchDropdownRef.current && !searchDropdownRef.current.contains(e.target as Node)) setSearchOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, [searchOpen]);

  // Auto-select first subitem when mega menu changes
  useEffect(() => {
    if (activeMega) {
      const menu = megaMenus[activeMega];
      if (menu?.subItems?.[0]) setActiveSubItem(menu.subItems[0].label);
    } else {
      setActiveSubItem(null);
    }
  }, [activeMega]);

  const showExpanded = isHome && !scrolled;
  const promoTop = (promoDismissed || !showExpanded) ? 0 : 36;
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;

  const searchResults = searchQuery.trim().length > 0
    ? allProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleMegaEnter = (mega: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current);
    setActiveMega(mega);
  };
  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 180);
  };

  const handleUserClick = () => { if (isLoggedIn) navigate("/perfil"); else setAuthModalOpen(true); };

  const iconColor = showExpanded
    ? (promoHovered ? (isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black") : (isDark ? "text-white/40 hover:text-white" : "text-black/40 hover:text-black"))
    : (isDark ? "text-foreground/40 hover:text-foreground" : "text-foreground/50 hover:text-foreground");
  const navTextColor = showExpanded
    ? (promoHovered ? (isDark ? "text-white/70 hover:text-white" : "text-black/70 hover:text-black") : (isDark ? "text-white/45 hover:text-white" : "text-black/45 hover:text-black"))
    : (isDark ? "text-foreground/40 hover:text-foreground" : "text-foreground/50 hover:text-foreground");
  const categoryLinkColor = showExpanded ? "text-white/45 hover:text-white" : (isDark ? "text-foreground/45 hover:text-foreground" : "text-foreground/50 hover:text-foreground");

  const renderIcons = () => (
    <div className="flex items-center gap-1">
      <button onClick={() => setSearchOpen(!searchOpen)} className={`relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${iconColor}`}>
        <Search size={16} strokeWidth={1.5} />
      </button>
      <button onClick={() => navigate("/perfil")} className={`relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${iconColor}`}>
        <Heart size={16} strokeWidth={1.5} />
        <AnimatePresence>
          {favCount > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
              style={{ fontSize: "9px", fontFamily: "var(--font-family-inter)", fontWeight: "var(--font-weight-medium)" }}
            ><span className="text-primary-foreground">{favCount}</span></motion.span>
          )}
        </AnimatePresence>
      </button>
      <ThemeToggle showExpanded={showExpanded} navbarIsDark={isDark} />
      <button onClick={handleUserClick} className={`relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${iconColor}`}>
        {isLoggedIn ? (
          <span className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-primary" style={{ fontSize: "10px", fontFamily: "var(--font-family-inter)", fontWeight: "var(--font-weight-medium)" }}>J</span>
          </span>
        ) : <User size={16} strokeWidth={1.5} />}
      </button>
      <button onClick={() => setCartOpen(true)} className={`relative w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${iconColor}`}>
        <ShoppingBag size={16} strokeWidth={1.5} />
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center"
              style={{ fontSize: "9px", fontFamily: "var(--font-family-inter)", fontWeight: "var(--font-weight-medium)" }}
            ><span className="text-primary-foreground">{totalItems}</span></motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );

  // ─── Right Panel Renderer ──────────────────────────────────────────────────
  const renderRightPanel = (panel: RightPanel) => {
    const panelHeader = (title: string, hint: string) => (
      <div className="mb-5 flex items-start justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary/80">
            <Sparkles size={12} />
            <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "600", letterSpacing: "0.18em" }}>
              ACESSO RÁPIDO
            </span>
          </div>
          <h4 className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "600", lineHeight: 1 }}>
            {title}
          </h4>
          <p className="mt-2 max-w-[560px] text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.5 }}>
            {hint}
          </p>
        </div>
        <div className="hidden xl:flex items-center gap-2 rounded-full border border-foreground/8 bg-foreground/[0.03] px-3 py-2 text-foreground/35">
          <Grid2x2 size={12} />
          <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "600", letterSpacing: "0.14em" }}>
            MEGA MENU
          </span>
        </div>
      </div>
    );

    const elevatedCardClass = "group relative grid h-full min-h-[270px] grid-rows-[150px_auto] overflow-hidden rounded-[24px] border border-foreground/8 bg-linear-to-b from-foreground/[0.05] to-transparent p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(255,43,46,0.12)]";
    const layoutElevatedCardClass = "group relative grid h-full min-h-[290px] grid-rows-[170px_auto] overflow-hidden rounded-[24px] border border-foreground/8 bg-linear-to-b from-foreground/[0.05] to-transparent p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(255,43,46,0.12)]";

    const showcaseCard = (
      href: string,
      title: string,
      subtitle: string,
      image: string | undefined,
      meta?: string,
      badge?: string,
    ) => {
      const catalogImage = href.startsWith("/produto/")
        ? getCatalogProduct(Number(href.split("/").pop()))?.image
        : undefined;
      const visualSrc = catalogImage ?? image;

      return (
      <Link to={resolveMenuHref(href)} onClick={() => setActiveMega(null)} className={elevatedCardClass}>
        {badge && (
          <span className="absolute right-4 top-4 z-20 rounded-full bg-primary px-2.5 py-1 text-primary-foreground shadow-[0_0_15px_rgba(255,43,46,0.5)]"
            style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "700", letterSpacing: "0.08em" }}>
            {badge}
          </span>
        )}
        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[20px] border border-foreground/8 bg-foreground/[0.04] px-4 py-5 transition-colors group-hover:bg-primary/[0.02]">
          <div className="absolute inset-4 rounded-full bg-primary/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          {visualSrc ? (
            <ImageWithFallback
              src={visualSrc}
              alt={title}
              className="relative h-full w-full object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.3)] transition-transform duration-500 group-hover:scale-[1.08] group-hover:-translate-y-1"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center rounded-[18px] border border-foreground/8 bg-background/60">
              <Box size={34} className="text-primary/70" />
            </div>
          )}
        </div>
        <div className="flex h-full flex-col justify-end pt-4">
          {meta && (
            <span className="mb-2 text-foreground/40 font-medium" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", letterSpacing: "0.05em" }}>
              {meta}
            </span>
          )}
          <p className="text-foreground transition-colors group-hover:text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "600", lineHeight: 1.05 }}>
            {title}
          </p>
          {subtitle && (
            <p className="mt-2 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.5 }}>
              {subtitle}
            </p>
          )}
        </div>
      </Link>
    )};

    const compactLinkCard = (
      href: string,
      title: string,
      subtitle: string,
      icon?: ReactNode,
    ) => (
      <Link
        to={href}
        onClick={() => setActiveMega(null)}
        className="group flex h-full rounded-[22px] border border-foreground/8 bg-foreground/[0.03] px-4 py-4 transition-all duration-300 hover:border-primary/30 hover:bg-foreground/[0.05] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,43,46,0.08)]"
      >
        <div className="flex items-start gap-3 w-full">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl border border-foreground/8 bg-background/70 text-primary/75 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            {icon ?? <ArrowUpRight size={15} />}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground/85 transition-colors group-hover:text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "600" }}>
              {title}
            </p>
            <p className="mt-1 text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", lineHeight: 1.45 }}>
              {subtitle}
            </p>
          </div>
        </div>
      </Link>
    );

    const getIconForConceptual = (index: number) => {
      const icons = [<Monitor size={80} />, <Cpu size={80} />, <Box size={80} />, <Radio size={80} />, <Grid2x2 size={80} />];
      return icons[index % icons.length];
    };

    const conceptualLinkCard = (
      href: string,
      title: string,
      subtitle: string,
      icon: ReactNode,
    ) => (
      <Link
        to={href}
        onClick={() => setActiveMega(null)}
        className="group relative overflow-hidden flex h-full flex-col rounded-[22px] border border-foreground/8 bg-foreground/[0.03] px-5 py-5 transition-all duration-300 hover:border-primary/30 hover:bg-foreground/[0.05] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(255,43,46,0.08)]"
      >
        <div className="absolute -bottom-6 -right-6 text-foreground opacity-[0.03] transition-all duration-500 group-hover:text-primary group-hover:opacity-10 group-hover:scale-110 group-hover:-rotate-6">
          {icon}
        </div>
        <div className="relative z-10 flex flex-col items-start gap-3 flex-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-foreground/8 bg-background/70 text-primary/80 transition-all duration-500 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
            {icon ? React.cloneElement(icon as React.ReactElement, { size: 18 }) : <ArrowUpRight size={18} />}
          </div>
          <div className="mt-2">
            <p className="text-foreground/90 transition-colors group-hover:text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", fontWeight: "600" }}>
              {title}
            </p>
            <p className="mt-1.5 text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.5 }}>
              {subtitle}
            </p>
          </div>
        </div>
      </Link>
    );

    const showcaseLayoutCard = (
      href: string,
      title: string,
      subtitle: string,
      image?: string,
      meta?: string,
    ) => (
      <Link to={resolveMenuHref(href)} onClick={() => setActiveMega(null)} className={layoutElevatedCardClass}>
        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-[20px] border border-foreground/8 bg-foreground/[0.035] px-4 py-4 transition-colors group-hover:bg-primary/[0.02]">
          <div className="absolute inset-3 rounded-full bg-primary/10 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
          {image ? (
            <ImageWithFallback
              src={image}
              alt={title}
              className="relative h-[132px] w-auto max-w-[92%] object-contain drop-shadow-[0_18px_32px_rgba(0,0,0,0.32)] transition-transform duration-500 group-hover:scale-[1.08] group-hover:-translate-y-1"
              loading="eager"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="relative flex h-full w-full items-center justify-center rounded-[18px] border border-foreground/8 bg-background/60">
              <Grid2x2 size={34} className="text-primary/70" />
            </div>
          )}
        </div>
        <div className="flex h-full flex-col justify-end pt-4">
          {meta && (
            <span className="mb-2 text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "600", letterSpacing: "0.14em" }}>
              {meta}
            </span>
          )}
          <p className="text-foreground transition-colors group-hover:text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "600", lineHeight: 1.05 }}>
            {title}
          </p>
          <p className="mt-2 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.5 }}>
            {subtitle}
          </p>
        </div>
      </Link>
    );

    const containerVariants = {
      hidden: { opacity: 0 },
      show: { opacity: 1, transition: { staggerChildren: 0.04 } }
    };
    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
    };

    if (panel.type === "products") {
      const featured = panel.products.slice(0, 3);
      const quick = panel.products.slice(3, 7);
      
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
          <motion.div variants={itemVariants}>
            {panelHeader(panel.title, "Produtos em destaque acima e atalhos rápidos abaixo, com uma leitura mais estável e visualmente forte.")}
          </motion.div>
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
            {featured.map((p) => (
              <motion.div key={`${p.id}-${p.subtitle}`} variants={itemVariants} className="min-h-[190px]">
                {showcaseCard(`/produto/${p.id}`, p.name, p.subtitle, p.image, p.price, p.badge)}
              </motion.div>
            ))}
          </div>
          <div className={`mt-5 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 ${quick.length > 0 ? "xl:grid-cols-4" : "xl:grid-cols-3"}`}>
            {quick.map((p) => (
              <motion.div key={`quick-${p.id}-${p.subtitle}`} variants={itemVariants}>
                {compactLinkCard(`/produto/${p.id}`, p.name, `${p.subtitle} · ${p.price}`, <ArrowUpRight size={15} />)}
              </motion.div>
            ))}
            <motion.div variants={itemVariants} className={quick.length === 0 ? "xl:col-start-2 xl:col-span-1" : ""}>
              <Link
                to={resolveMenuHref(activeSubData?.href)}
                onClick={() => setActiveMega(null)}
                className="group flex h-full min-h-[90px] flex-col justify-center rounded-[22px] border border-primary/20 bg-primary/[0.05] px-5 py-4 transition-all duration-300 hover:bg-primary/[0.10] hover:shadow-[0_8px_24px_rgba(255,43,46,0.12)] hover:-translate-y-0.5"
              >
                <p className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.18em" }}>
                  EXPLORAR
                </p>
                <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "18px", fontWeight: "600", lineHeight: 1.1 }}>
                  Ver toda a coleção
                </p>
                <div className="mt-2 flex items-center gap-2 text-primary/80 group-hover:text-primary transition-colors">
                  <span style={{ fontSize: "12px", fontWeight: "500" }}>Acessar catálogo</span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    if (panel.type === "layouts") {
      const hasImages = panel.layouts.some((l) => l.image);
      if (hasImages) {
        const featured = panel.layouts.slice(0, 3);
        const quick = panel.layouts.slice(3, 8);
        return (
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
            <motion.div variants={itemVariants}>
              {panelHeader(panel.title, "Subcategorias visuais com imagem forte e cartões elevados para acelerar o reconhecimento do formato ideal.")}
            </motion.div>
            <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              {featured.map((l) => (
                <motion.div key={l.label} variants={itemVariants} className="min-h-[190px]">
                  {showcaseLayoutCard(l.href, l.label, l.desc, l.image, "SUBCATEGORIA")}
                </motion.div>
              ))}
            </div>
            <div className="mt-5 grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {quick.map((l) => (
                <motion.div key={`layout-${l.label}`} variants={itemVariants}>
                  {compactLinkCard(l.href, l.label, l.desc, <Grid2x2 size={15} />)}
                </motion.div>
              ))}
              <motion.div variants={itemVariants} className="rounded-[22px] border border-dashed border-foreground/15 bg-transparent px-5 py-4 flex flex-col justify-center">
                <p className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.16em" }}>
                  COMO ESCOLHER
                </p>
                <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "18px", fontWeight: "600", lineHeight: 1.1 }}>
                  Navegue pelo formato que combina com o seu setup
                </p>
              </motion.div>
            </div>
          </motion.div>
        );
      }
      const conceptualGridClass = panel.layouts.length <= 4 ? "grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-2" : "grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3";
      
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
          <motion.div variants={itemVariants}>
            {panelHeader(panel.title, "Uma estrutura fixa e previsível para categorias conceituais, com blocos rápidos em vez de listas soltas.")}
          </motion.div>
          <div className={conceptualGridClass}>
            {panel.layouts.map((l, index) => (
              <motion.div key={l.label} variants={itemVariants}>
                {conceptualLinkCard(
                  l.href,
                  l.label,
                  l.desc,
                  getIconForConceptual(index),
                )}
              </motion.div>
            ))}
            <motion.div variants={itemVariants}>
              <Link
                to={resolveMenuHref(activeSubData?.href)}
                onClick={() => setActiveMega(null)}
                className="group flex h-full min-h-[110px] flex-col justify-center rounded-[22px] border border-primary/20 bg-primary/[0.05] px-6 py-5 transition-all duration-300 hover:bg-primary/[0.10] hover:shadow-[0_12px_32px_rgba(255,43,46,0.12)] hover:-translate-y-0.5"
              >
                <p className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.18em" }}>
                  VER TUDO
                </p>
                <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "21px", fontWeight: "600", lineHeight: 1.05 }}>
                  Abrir categoria completa
                </p>
                <p className="mt-2 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.5 }}>
                  Continue a exploração com todos os filtros e produtos disponíveis.
                </p>
                <div className="mt-4 flex items-center gap-2 text-primary group-hover:text-primary transition-colors">
                  <span style={{ fontSize: "12px", fontWeight: "600" }}>Acessar</span>
                  <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    if (panel.type === "featured") {
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
          <motion.div variants={itemVariants}>
            {panelHeader(panel.title, "Destacamos o universo da categoria com uma peça principal e um acesso mais elegante para continuar a navegação.")}
          </motion.div>
          <motion.div variants={itemVariants} className="flex-1">
            <Link to={resolveMenuHref(panel.href)} onClick={() => setActiveMega(null)} className="group grid h-full min-h-[360px] grid-cols-1 gap-5 overflow-hidden rounded-[32px] border border-foreground/8 bg-linear-to-br from-foreground/[0.04] via-transparent to-primary/[0.06] p-6 transition-all duration-500 hover:border-primary/30 hover:shadow-[0_24px_80px_rgba(255,43,46,0.15)] xl:grid-cols-[1.1fr_1fr]">
              <div className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                    <p className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.18em" }}>
                      DESTAQUE ESPECIAL
                    </p>
                  </div>
                  <p className="text-foreground transition-colors group-hover:text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "42px", fontWeight: "700", lineHeight: 0.95 }}>
                    {panel.name}
                  </p>
                  <p className="mt-5 max-w-[460px] text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px", lineHeight: 1.6 }}>
                    {panel.desc}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-primary mt-6">
                  <span style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "700", letterSpacing: "0.12em" }}>
                    EXPLORAR UNIVERSO
                  </span>
                  <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </div>
              <div className="relative flex min-h-[260px] items-center justify-center rounded-[28px] border border-foreground/8 bg-background/60 p-6 overflow-hidden">
                <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
                <ImageWithFallback src={panel.image} alt={panel.name} className="relative z-10 h-full max-h-[320px] w-auto max-w-[120%] object-contain drop-shadow-[0_28px_40px_rgba(0,0,0,0.4)] transition-transform duration-700 group-hover:scale-[1.1] group-hover:-translate-x-2 group-hover:-translate-y-2" loading="eager" referrerPolicy="no-referrer" />
              </div>
            </Link>
          </motion.div>
        </motion.div>
      );
    }

    if (panel.type === "downloads") {
      return (
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex h-full flex-col">
          <motion.div variants={itemVariants}>
            {panelHeader(panel.title, "Documentos e drivers organizados em cards estáveis, evitando aquele sobe-e-desce de altura a cada categoria.")}
          </motion.div>
          <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {panel.items.map((item) => {
              const isPdf = item.name.toLowerCase().includes("manual") || item.name.toLowerCase().includes("guia");
              const badgeText = isPdf ? "PDF" : "EXE";
              
              const innerCard = (
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] border border-foreground/8 bg-background/70 transition-transform duration-300 group-hover:-translate-y-1 group-hover:bg-primary/10">
                      {isPdf
                        ? <FileText size={18} className="text-primary/75 group-hover:text-primary transition-colors" />
                        : <Download size={18} className="text-primary/75 group-hover:text-primary transition-colors" />
                      }
                    </div>
                    <span className="px-2 py-0.5 rounded text-foreground/40 bg-foreground/5 border border-foreground/10" style={{ fontSize: "9px", fontWeight: "700", letterSpacing: "0.1em" }}>
                      {badgeText}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-foreground/85 transition-colors group-hover:text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "600", lineHeight: 1.45 }}>
                      {item.name}
                    </p>
                    <p className="mt-2 text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", lineHeight: 1.5 }}>
                      {item.version} · {item.date}
                    </p>
                  </div>
                </div>
              );

              return isPlaceholderHref(item.href) ? (
                <motion.div
                  key={item.name}
                  variants={itemVariants}
                  className="group rounded-[24px] border border-foreground/8 bg-foreground/[0.03] px-6 py-5 transition-all duration-300 hover:border-primary/30 hover:bg-foreground/[0.05] hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,43,46,0.05)] cursor-pointer"
                >
                  {innerCard}
                </motion.div>
              ) : (
                <motion.a
                  key={item.name}
                  variants={itemVariants}
                  href={item.href}
                  className="group rounded-[24px] border border-foreground/8 bg-foreground/[0.03] px-6 py-5 transition-all duration-300 hover:border-primary/30 hover:bg-foreground/[0.05] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(255,43,46,0.1)]"
                >
                  {innerCard}
                </motion.a>
              )
            })}
            <motion.div variants={itemVariants}>
              <Link to="/fale-conosco" onClick={() => setActiveMega(null)} className="group flex h-full min-h-[140px] flex-col justify-center rounded-[24px] border border-primary/20 bg-primary/[0.05] px-6 py-5 transition-all duration-300 hover:bg-primary/[0.10] hover:shadow-[0_12px_32px_rgba(255,43,46,0.12)] hover:-translate-y-0.5">
                <p className="text-primary" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "700", letterSpacing: "0.18em" }}>
                  CENTRAL DE SUPORTE
                </p>
                <p className="mt-2 text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "600", lineHeight: 1.1 }}>
                  Ver todos os downloads
                </p>
                <p className="mt-2 text-foreground/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: 1.5 }}>
                  Acesse a biblioteca completa de drivers, manuais e utilitários.
                </p>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      );
    }

    return null;
  };
  const activeMegaData = activeMega ? megaMenus[activeMega] : null;
  const activeSubData = activeMegaData?.subItems.find((s) => s.label === activeSubItem);

  return (
    <>
      {/* Header wrapper with unified hover */}
      <div className="fixed top-0 left-0 right-0 z-50" onMouseEnter={() => setPromoHovered(true)} onMouseLeave={() => setPromoHovered(false)}>
        {/* Promo banner */}
        <AnimatePresence>
          {!promoDismissed && showExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`transition-all duration-500 cursor-pointer ${isDark ? "bg-white" : "bg-black"}`}
            >
              <div className="flex items-center justify-center h-[36px] px-4 relative">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 border transition-colors duration-500 ${isDark
                    ? "border-black/20 text-black"
                    : "border-white/20 text-white"
                    }`}
                    style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "var(--text-micro)", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.08em" }}>PROMO</span>
                  <span className={`tracking-[0.12em] transition-colors duration-500 ${isDark
                    ? "text-black/70"
                    : "text-white/70"
                    }`}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-micro)" }}>PROMO DO DIA: FRETE GRÁTIS</span>
                  <span className={`tracking-[0.12em] transition-colors duration-500 ${isDark
                    ? "text-black/70"
                    : "text-white/70"
                    }`}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-micro)" }}>
                    {countdown.h.toString().padStart(2, "0")}:{countdown.m.toString().padStart(2, "0")}:{countdown.s.toString().padStart(2, "0")}
                  </span>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setPromoDismissed(true); }}
                  className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors duration-300 cursor-pointer ${isDark
                    ? "text-black/40 hover:text-black/60"
                    : "text-white/40 hover:text-white/60"
                    }`}
                ><X size={12} /></button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main nav */}
        <nav className="transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{
            backgroundColor: showExpanded
              ? (promoHovered ? (isDark ? "rgba(0,0,0,0.95)" : "rgba(255,255,255,0.95)") : "transparent")
              : (isDark ? "rgba(18,18,18,0.95)" : "rgba(250,250,250,0.95)"),
            backdropFilter: showExpanded ? (promoHovered ? "blur(40px)" : "none") : "blur(40px)",
            borderBottom: showExpanded
              ? "1px solid transparent"
              : `1px solid ${isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)"}`,
          }}
        >
          {/* Top row */}
          <div className="max-w-[1440px] mx-auto px-5 md:px-8 flex items-center justify-between transition-all duration-700"
            style={{ height: showExpanded ? 50 : 56 }}
          >
            {/* Left: logo */}
            <div className="flex items-center">
              <div className="transition-all duration-700 overflow-hidden" style={{ maxWidth: showExpanded ? 0 : 200, opacity: showExpanded ? 0 : 1 }}>
                <Link to="/" className="block flex-shrink-0">
                  <img src={PCYES_LOGO} alt="PCYES" className="h-[22px] w-auto object-contain" />
                </Link>
              </div>
            </div>

            {/* Center: compact nav links */}
            <div className="hidden lg:flex items-center gap-2 transition-all duration-700 self-stretch"
              style={{ opacity: showExpanded ? 0 : 1, pointerEvents: showExpanded ? "none" : "auto" }}
            >
              {navItems.filter(item => ["Novidades", "Hardware", "Periféricos", "Computadores", "PC Gamer", "Collab", "Monte seu PC", "Drivers e Manuais"].includes(item.label)).map((item) => (
                <div key={item.label}
                  onMouseEnter={() => {
                    if (item.mega) handleMegaEnter(item.mega);
                    else { if (megaTimeout.current) clearTimeout(megaTimeout.current); setActiveMega(null); }
                  }}
                  onMouseLeave={handleMegaLeave}
                  className="flex items-center h-full"
                >
                  {!isPlaceholderHref(item.href) ? (
                    <Link to={resolveMenuHref(item.href)}
                      className={`relative flex h-full items-center rounded-full px-3 py-1.5 transition-all duration-300 ${activeMega === item.mega
                        ? "bg-primary/[0.10] text-foreground"
                        : navTextColor}`}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                    >{item.label}</Link>
                  ) : (
                    <button className={`relative flex h-full cursor-pointer items-center rounded-full px-3 py-1.5 transition-all duration-300 ${activeMega === item.mega
                      ? "bg-primary/[0.10] text-foreground"
                      : navTextColor}`}
                      style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                    >{item.label}</button>
                  )}
                </div>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
              {renderIcons()}
              <button className={`lg:hidden w-9 h-9 flex items-center justify-center transition-colors cursor-pointer ${iconColor}`}
                onClick={() => setMobileOpen(!mobileOpen)}
              >{mobileOpen ? <X size={18} /> : <Menu size={18} />}</button>
            </div>
          </div>

          {/* Big logo (expanded) */}
          <div className="text-center overflow-hidden transition-all duration-700"
            style={{ maxHeight: showExpanded ? 80 : 0, opacity: showExpanded ? 1 : 0, paddingBottom: showExpanded ? 12 : 0 }}
          >
            <Link to="/" className="inline-block">
              <img src={PCYES_LOGO} alt="PCYES" className="h-[40px] md:h-[48px] w-auto object-contain mx-auto" />
            </Link>
          </div>

          {/* Category links (expanded) */}
          <div className="hidden md:flex items-center justify-center gap-0 overflow-hidden transition-all duration-700"
            style={{ maxHeight: showExpanded ? 50 : 0, opacity: showExpanded ? 1 : 0, paddingBottom: showExpanded ? 16 : 0, pointerEvents: showExpanded ? "auto" : "none" }}
          >
            {navItems.map((item) => (
              <div key={item.label}
                onMouseEnter={() => {
                    if (item.mega) handleMegaEnter(item.mega);
                    else { if (megaTimeout.current) clearTimeout(megaTimeout.current); setActiveMega(null); }
                  }}
                onMouseLeave={handleMegaLeave}
              >
                {!isPlaceholderHref(item.href) ? (
                  <Link to={resolveMenuHref(item.href)}
                    className={`relative rounded-full px-4 py-1.5 transition-all duration-300 ${activeMega === item.mega
                      ? "bg-primary/[0.12] text-foreground"
                      : (showExpanded && !promoHovered ? "text-white/45 hover:text-white" : (isDark ? "text-foreground/45 hover:text-foreground" : "text-foreground/50 hover:text-foreground"))}`}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                  >{item.label}</Link>
                ) : (
                  <button className={`relative rounded-full px-4 py-1.5 transition-all duration-300 cursor-pointer ${activeMega === item.mega
                    ? "bg-primary/[0.12] text-foreground"
                    : (showExpanded && !promoHovered ? "text-white/45 hover:text-white" : (isDark ? "text-foreground/45 hover:text-foreground" : "text-foreground/50 hover:text-foreground"))}`}
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                  >{item.label}</button>
                )}
              </div>
            ))}
          </div>

          {/* ─── Mega Menu ──────────────────────────────────────────────────────── */}
          <AnimatePresence>
            {activeMega && activeMegaData && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 right-0 z-[52] overflow-hidden border-t border-foreground/5 shadow-2xl"
                style={{ backgroundColor: isDark ? "rgba(20,20,21,0.99)" : "rgba(252,252,252,0.99)", backdropFilter: "blur(60px)" }}
                onMouseEnter={() => handleMegaEnter(activeMega)} onMouseLeave={handleMegaLeave}
              >
                <div className="mx-auto flex h-[640px] max-w-[1440px] px-5 md:px-8">
                  {/* Left sidebar */}
                  <div className="h-full w-[220px] flex-shrink-0 border-r border-foreground/5 py-7 pr-6 xl:w-[240px]">
                    <p className="mb-3 px-3 text-foreground/30 tracking-widest" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px", fontWeight: "600" }}>
                      {activeMegaData.title.toUpperCase()}
                    </p>
                    <ul className="flex flex-col gap-0.5">
                      {activeMegaData.subItems.map((sub) => {
                        const isActive = activeSubItem === sub.label;
                        return (
                          <li key={sub.label}>
                            {isPlaceholderHref(sub.href) ? (
                              <button
                                type="button"
                                onMouseEnter={() => setActiveSubItem(sub.label)}
                                className={`group relative flex w-full items-center justify-between rounded-[18px] px-3 py-3 text-left transition-all duration-200 ${isActive
                                  ? (isDark ? "bg-white/[0.07] text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" : "bg-black/[0.05] text-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]")
                                  : "text-foreground/45 hover:bg-foreground/[0.03] hover:text-foreground/75"
                                  }`}
                                style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: isActive ? "500" : "400" }}
                              >
                                <span className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300 ${isActive ? "opacity-100 shadow-[0_0_10px_rgba(255,43,46,0.8)]" : "opacity-0"}`} />
                                <span className={`transition-transform duration-300 ${isActive ? "translate-x-1 font-medium text-foreground" : "group-hover:translate-x-1"}`}>{sub.label}</span>
                                <ChevronRight size={13} className={`flex-shrink-0 transition-all ${isActive ? "translate-x-0 opacity-60" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-40"}`} />
                              </button>
                            ) : (
                              <Link
                                to={resolveMenuHref(sub.href)}
                                onMouseEnter={() => setActiveSubItem(sub.label)}
                                onClick={() => setActiveMega(null)}
                                className={`group relative flex items-center justify-between rounded-[18px] px-3 py-3 transition-all duration-200 ${isActive
                                  ? (isDark ? "bg-white/[0.07] text-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]" : "bg-black/[0.05] text-foreground shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]")
                                  : "text-foreground/45 hover:bg-foreground/[0.03] hover:text-foreground/75"
                                  }`}
                                style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: isActive ? "500" : "400" }}
                              >
                                <span className={`absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-300 ${isActive ? "opacity-100 shadow-[0_0_10px_rgba(255,43,46,0.8)]" : "opacity-0"}`} />
                                <span className={`transition-transform duration-300 ${isActive ? "translate-x-1 font-medium text-foreground" : "group-hover:translate-x-1"}`}>{sub.label}</span>
                                <ChevronRight size={13} className={`flex-shrink-0 transition-all ${isActive ? "translate-x-0 opacity-60" : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-40"}`} />
                              </Link>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                    <div className="mt-5 border-t border-foreground/5 px-3 pt-4">
                      <Link
                        to={resolveMenuHref(activeSubData?.href)}
                        onClick={() => setActiveMega(null)}
                        className="flex items-center gap-1.5 text-primary hover:opacity-75 transition-opacity"
                        style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "500" }}
                      >
                        <span>Ver tudo</span>
                        <ArrowUpRight size={11} />
                      </Link>
                    </div>
                  </div>

                  {/* Right panel */}
                  <div className="flex h-full flex-1 flex-col overflow-hidden py-7 pl-8">
                    <AnimatePresence mode="wait">
                      {activeSubData && (
                        <motion.div
                          key={activeSubData.label}
                          initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -4 }}
                          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                          className="h-full overflow-y-auto pr-4 pb-6"
                        >
                          {renderRightPanel(activeSubData.right)}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </div>

      {/* Search dropdown */}
      <AnimatePresence>
        {searchOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[49] bg-black/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <motion.div ref={searchDropdownRef}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="fixed left-0 right-0 z-[51] border-t border-foreground/5 shadow-2xl"
              style={{ top: promoTop + (showExpanded ? 170 : 56), backgroundColor: isDark ? "rgba(22,22,23,0.98)" : "rgba(250,250,250,0.98)", backdropFilter: "blur(40px)" }}
            >
              <div className="max-w-[640px] mx-auto px-6 md:px-8">
                <div className="flex items-center gap-4 py-4 border-b border-foreground/5">
                  <Search size={16} className="text-foreground/30 flex-shrink-0" />
                  <input ref={searchInputRef} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && searchQuery.trim().length > 0) {
                        setSearchOpen(false);
                        navigate(`/produtos?search=${encodeURIComponent(searchQuery.trim())}`);
                      }
                    }}
                    placeholder="Buscar produtos, categorias..." className="flex-1 bg-transparent text-foreground placeholder:text-foreground/20 outline-none"
                    style={{ fontFamily: "var(--font-family-inter)", fontSize: "15px" }} />
                  <div className="flex items-center gap-2">
                    {searchQuery && <button onClick={() => setSearchQuery("")} className="text-foreground/20 hover:text-foreground/50 transition-colors cursor-pointer"><X size={14} /></button>}
                    <kbd className="hidden md:flex items-center px-2 py-0.5 bg-foreground/5 text-foreground/20" style={{ borderRadius: "var(--radius)", fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>ESC</kbd>
                  </div>
                </div>
                <div className="max-h-[50vh] overflow-y-auto py-4">
                  {searchQuery.trim().length === 0 ? (
                    <div>
                      <div className="mb-5">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp size={11} className="text-primary" />
                          <span className="text-foreground/30 tracking-wider" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>TENDÊNCIAS</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {trending.map((t) => (
                            <button key={t} onClick={() => setSearchQuery(t)}
                              className="px-4 py-2 bg-foreground/[0.03] border border-border/5 text-foreground/50 hover:text-foreground hover:border-border/20 transition-all duration-300 cursor-pointer"
                              style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                            >{t}</button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock size={11} className="text-foreground/30" />
                          <span className="text-foreground/30 tracking-wider" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>RECENTES</span>
                        </div>
                        {recent.map((r) => (
                          <button key={r} onClick={() => setSearchQuery(r)}
                            className="flex items-center gap-3 w-full px-3 py-2.5 text-foreground/40 hover:text-foreground hover:bg-foreground/[0.03] transition-all duration-200 cursor-pointer"
                            style={{ borderRadius: "var(--radius)", fontFamily: "var(--font-family-inter)", fontSize: "14px" }}
                          ><Clock size={13} className="text-foreground/15" />{r}</button>
                        ))}
                      </div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <p className="px-1 pb-3 text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>
                        {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""}
                      </p>
                      {searchResults.map((product, i) => (
                        <motion.a key={product.id} href={`/produto/${product.id}`}
                          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.15, delay: i * 0.03 }}
                          className="group flex items-center gap-4 p-3 hover:bg-foreground/[0.03] transition-colors"
                          style={{ borderRadius: "var(--radius-card)" }} onClick={() => setSearchOpen(false)}
                        >
                          <div className="w-[48px] h-[48px] flex-shrink-0 overflow-hidden" style={{ borderRadius: "var(--radius)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground group-hover:text-primary transition-colors truncate" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{product.name}</p>
                            <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{product.category}</p>
                          </div>
                          <span className="text-foreground/40 flex-shrink-0" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{product.price}</span>
                          <ArrowUpRight size={14} className="text-foreground/10 group-hover:text-foreground/40 transition-colors flex-shrink-0" />
                        </motion.a>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <p className="text-foreground/30 mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}>Nenhum resultado</p>
                      <p className="text-foreground/15" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Tente buscar por outro termo</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }} className="fixed inset-0 z-40 bg-background pt-[140px] overflow-y-auto"
          >
            <div className="px-8 py-8 flex flex-col gap-6">
              {navItems.map((item, i) => (
                <motion.div key={item.label} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06, duration: 0.4 }}>
                  {!isPlaceholderHref(item.href) ? (
                    <Link to={resolveMenuHref(item.href)} onClick={() => setMobileOpen(false)}
                      className="text-foreground/70 hover:text-foreground transition-colors block"
                      style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-light)" }}
                    >{item.label}</Link>
                  ) : (
                    <button onClick={() => { navigate("/produtos"); setMobileOpen(false); }}
                      className="text-foreground/70 hover:text-foreground transition-colors text-left cursor-pointer"
                      style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-light)" }}
                    >{item.label}</button>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
