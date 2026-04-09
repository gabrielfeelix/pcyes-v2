import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Package, Heart, MapPin, User, CreditCard, HelpCircle, Shield, LogOut,
  ChevronRight, Truck, Check, Clock, X as XIcon, Eye, Star, ShoppingBag,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { useFavorites } from "./FavoritesContext";
import { useCart } from "./CartContext";
import { useTheme } from "./ThemeProvider";
import { allProducts } from "./productsData";
import { Footer } from "./Footer";

type Tab = "orders" | "favorites" | "addresses" | "data" | "cards" | "help" | "privacy";

const TABS: { key: Tab; icon: typeof Package; label: string }[] = [
  { key: "orders", icon: Package, label: "Meus Pedidos" },
  { key: "favorites", icon: Heart, label: "Favoritos" },
  { key: "addresses", icon: MapPin, label: "Endereços" },
  { key: "data", icon: User, label: "Dados Pessoais" },
  { key: "cards", icon: CreditCard, label: "Cartões" },
  { key: "help", icon: HelpCircle, label: "Ajuda e Suporte" },
  { key: "privacy", icon: Shield, label: "Privacidade" },
];

const STATUS_MAP = {
  processing: { label: "Em processamento", color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Clock },
  shipped: { label: "Enviado", color: "text-blue-400", bg: "bg-blue-400/10", icon: Truck },
  delivered: { label: "Entregue", color: "text-green-500", bg: "bg-green-500/10", icon: Check },
  cancelled: { label: "Cancelado", color: "text-red-400", bg: "bg-red-400/10", icon: XIcon },
};

export function ProfilePage() {
  const { user, isLoggedIn, setAuthModalOpen, logout, updateUser } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { addItem } = useCart();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  if (!isLoggedIn || !user) {
    return (
      <div className="pt-[92px] min-h-screen flex items-center justify-center px-8">
        <div className="text-center max-w-md">
          <User size={40} className="text-foreground/15 mx-auto mb-6" />
          <h2 className="text-foreground mb-3" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "28px", fontWeight: "var(--font-weight-light)" }}>
            Acesse sua conta
          </h2>
          <p className="text-foreground/35 mb-8" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", lineHeight: "1.7" }}>
            Faça login para acessar seus pedidos, favoritos e informações.
          </p>
          <button onClick={() => setAuthModalOpen(true)}
            className="px-8 py-3.5 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 cursor-pointer"
            style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
          >Entrar na minha conta</button>
        </div>
      </div>
    );
  }

  const favoriteProducts = allProducts.filter((p) => favorites.has(p.id));

  const inputCls = "w-full px-4 py-3 bg-foreground/[0.03] border border-foreground/8 text-foreground placeholder:text-foreground/20 focus:border-foreground/20 focus:outline-none transition-colors";
  const inputStyle = { borderRadius: "var(--radius-button)" as const, fontFamily: "var(--font-family-inter)", fontSize: "13px" };

  return (
    <div className="pt-[92px]">
      {/* Header */}
      <div className="px-4 md:px-6 pt-12 pb-8" style={{ background: isDark ? "#161617" : "#f5f5f7" }}>
        <div className="max-w-[1920px] mx-auto flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>
              {user.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-white mb-0.5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "24px", fontWeight: "var(--font-weight-medium)" }}>
              Olá, {user.name.split(" ")[0]}
            </h1>
            <p className="text-white/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{user.email}</p>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-6 py-10">
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className="w-full lg:w-[220px] flex-shrink-0">
            <nav className="space-y-1">
              {TABS.map((tab) => (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 cursor-pointer ${
                    activeTab === tab.key ? "bg-primary/10 text-primary" : "text-foreground/40 hover:text-foreground/70 hover:bg-foreground/[0.03]"
                  }`}
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </button>
              ))}
              <div className="h-px bg-foreground/5 my-3" />
              <button onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-foreground/30 hover:text-primary transition-all duration-300 cursor-pointer"
                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
              ><LogOut size={16} /> Sair</button>
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              {activeTab === "orders" && (
                <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Meus Pedidos</h2>
                  <div className="space-y-4">
                    {user.orders.map((order) => {
                      const s = STATUS_MAP[order.status];
                      return (
                        <div key={order.id} className="border border-foreground/5 p-5" style={{ borderRadius: "var(--radius-card)" }}>
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <p className="text-foreground/70 mb-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{order.id}</p>
                              <p className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{new Date(order.date).toLocaleDateString("pt-BR")}</p>
                            </div>
                            <span className={`flex items-center gap-1.5 px-3 py-1.5 ${s.bg} ${s.color}`} style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>
                              <s.icon size={12} />{s.label}
                            </span>
                          </div>
                          <div className="flex gap-3 mb-4">
                            {order.items.map((item, i) => (
                              <div key={i} className="w-14 h-14 flex-shrink-0 overflow-hidden" style={{ borderRadius: "var(--radius)", background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                                <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                            ))}
                            <div className="flex-1 min-w-0 flex flex-col justify-center">
                              {order.items.map((item, i) => (
                                <p key={i} className="text-foreground/40 truncate" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                                  {item.qty}x {item.name}
                                </p>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-foreground/5">
                            <span className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{order.total}</span>
                            {order.tracking && (
                              <span className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>Rastreio: {order.tracking}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === "favorites" && (
                <motion.div key="favorites" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Favoritos</h2>
                  {favoriteProducts.length === 0 ? (
                    <div className="text-center py-16">
                      <Heart size={32} className="text-foreground/10 mx-auto mb-4" />
                      <p className="text-foreground/30 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px" }}>Nenhum favorito ainda</p>
                      <p className="text-foreground/20 mb-6" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Clique no coração nos produtos para salvá-los aqui.</p>
                      <Link to="/produtos" className="text-primary hover:underline" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Ver produtos</Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {favoriteProducts.map((product) => (
                        <div key={product.id} className="group border border-foreground/5 overflow-hidden" style={{ borderRadius: "var(--radius-card)" }}>
                          <Link to={`/produto/${product.id}`} className="block relative aspect-square" style={{ background: isDark ? "#1a1a1c" : "#f5f5f5" }}>
                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          </Link>
                          <div className="p-4">
                            <div className="flex items-center gap-1.5 mb-1">
                              <Star size={10} className="fill-primary text-primary" />
                              <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{product.rating}</span>
                            </div>
                            <p className="text-foreground/80 truncate mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{product.name}</p>
                            <p className="text-foreground/50 mb-3" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{product.price}</p>
                            <div className="flex gap-2">
                              <button onClick={() => addItem(product)}
                                className="flex-1 py-2 bg-primary text-primary-foreground flex items-center justify-center gap-1.5 hover:brightness-110 transition-all cursor-pointer"
                                style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}
                              ><ShoppingBag size={12} /> Adicionar</button>
                              <button onClick={() => toggleFavorite(product.id)}
                                className="w-9 h-9 border border-foreground/10 flex items-center justify-center text-primary hover:bg-primary/10 transition-all cursor-pointer"
                                style={{ borderRadius: "var(--radius-button)" }}
                              ><Heart size={13} className="fill-primary" /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === "addresses" && (
                <motion.div key="addresses" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Endereços</h2>
                  <div className="space-y-3">
                    {user.addresses.map((a) => (
                      <div key={a.id} className="flex items-start justify-between p-5 border border-foreground/5" style={{ borderRadius: "var(--radius-card)" }}>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <MapPin size={13} className="text-foreground/30" />
                            <span className="text-foreground/70" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{a.label}</span>
                            {a.isDefault && <span className="px-2 py-0.5 bg-primary/10 text-primary" style={{ borderRadius: "100px", fontSize: "9px" }}>PADRÃO</span>}
                          </div>
                          <p className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", lineHeight: "1.6" }}>
                            {a.street}, {a.number}{a.complement ? ` - ${a.complement}` : ""}<br />{a.neighborhood} · {a.city}/{a.state} · CEP {a.cep}
                          </p>
                        </div>
                        <button className="text-foreground/20 hover:text-foreground/50 transition-colors cursor-pointer" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Editar</button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "data" && (
                <motion.div key="data" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Dados Pessoais</h2>
                  <div className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-foreground/40 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>NOME</label>
                      <input value={user.name} onChange={(e) => updateUser({ name: e.target.value })} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-foreground/40 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>E-MAIL</label>
                      <input value={user.email} onChange={(e) => updateUser({ email: e.target.value })} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-foreground/40 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>TELEFONE</label>
                      <input value={user.phone} onChange={(e) => updateUser({ phone: e.target.value })} className={inputCls} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block text-foreground/40 mb-1.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)", letterSpacing: "0.05em" }}>CPF</label>
                      <input value={user.cpf} disabled className={`${inputCls} opacity-50`} style={inputStyle} />
                    </div>
                    <button className="px-6 py-3 bg-primary text-primary-foreground hover:brightness-110 transition-all duration-300 cursor-pointer"
                      style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "13px", fontWeight: "var(--font-weight-medium)" }}
                    >Salvar alterações</button>
                  </div>
                </motion.div>
              )}

              {activeTab === "cards" && (
                <motion.div key="cards" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Cartões salvos</h2>
                  <div className="space-y-3">
                    {user.cards.map((c) => (
                      <div key={c.id} className="flex items-center gap-4 p-5 border border-foreground/5" style={{ borderRadius: "var(--radius-card)" }}>
                        <div className="w-12 h-8 rounded bg-foreground/5 flex items-center justify-center">
                          <span className="text-foreground/40" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>{c.brand}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>•••• •••• •••• {c.last4}</p>
                          <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px" }}>{c.name} · Validade {c.expiry}</p>
                        </div>
                        {c.isDefault && <span className="px-2 py-0.5 bg-primary/10 text-primary" style={{ borderRadius: "100px", fontSize: "9px" }}>PADRÃO</span>}
                        <button className="text-foreground/20 hover:text-foreground/50 transition-colors cursor-pointer" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Remover</button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "help" && (
                <motion.div key="help" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Ajuda e Suporte</h2>
                  {[
                    { title: "Central de Ajuda", desc: "Encontre respostas para suas dúvidas" },
                    { title: "Fale Conosco", desc: "Entre em contato via chat ou e-mail" },
                    { title: "Política de Trocas", desc: "Saiba como trocar ou devolver" },
                    { title: "Rastrear Pedido", desc: "Acompanhe sua entrega em tempo real" },
                  ].map((item) => (
                    <button key={item.title} className="w-full flex items-center justify-between p-5 border border-foreground/5 mb-2 hover:border-foreground/10 transition-all cursor-pointer"
                      style={{ borderRadius: "var(--radius-card)" }}
                    >
                      <div className="text-left">
                        <p className="text-foreground/60 mb-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{item.title}</p>
                        <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{item.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-foreground/15" />
                    </button>
                  ))}
                </motion.div>
              )}

              {activeTab === "privacy" && (
                <motion.div key="privacy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
                  <h2 className="text-foreground mb-6" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "20px", fontWeight: "var(--font-weight-medium)" }}>Privacidade</h2>
                  {[
                    { title: "Política de Privacidade", desc: "Como tratamos seus dados pessoais" },
                    { title: "Cookies", desc: "Gerencie suas preferências de cookies" },
                    { title: "Excluir minha conta", desc: "Solicite a remoção permanente dos seus dados" },
                  ].map((item) => (
                    <button key={item.title} className="w-full flex items-center justify-between p-5 border border-foreground/5 mb-2 hover:border-foreground/10 transition-all cursor-pointer"
                      style={{ borderRadius: "var(--radius-card)" }}
                    >
                      <div className="text-left">
                        <p className="text-foreground/60 mb-0.5" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{item.title}</p>
                        <p className="text-foreground/25" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{item.desc}</p>
                      </div>
                      <ChevronRight size={16} className="text-foreground/15" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}