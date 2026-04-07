import { useState } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { X, Minus, Plus, ShoppingBag, Trash2, Truck, Tag, Loader2, Check, MapPin, ChevronDown } from "lucide-react";
import { useCart } from "./CartContext";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const MOCK_SHIPPING: Record<string, { name: string; price: number; days: string }[]> = {
  default: [
    { name: "PAC", price: 18.9, days: "8-12 dias úteis" },
    { name: "SEDEX", price: 32.5, days: "3-5 dias úteis" },
  ],
  free: [
    { name: "Frete Grátis (PAC)", price: 0, days: "8-12 dias úteis" },
    { name: "SEDEX", price: 24.9, days: "3-5 dias úteis" },
  ],
};

const COUPONS: Record<string, number> = {
  PCYES10: 10, PROMO20: 20, BEMVINDO: 15,
};

export function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalItems, lastAdded } = useCart();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const navigate = useNavigate();

  const [shippingOpen, setShippingOpen] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);

  const [cep, setCep] = useState("");
  const [shippingOptions, setShippingOptions] = useState<typeof MOCK_SHIPPING.default | null>(null);
  const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
  const [loadingCep, setLoadingCep] = useState(false);

  const [coupon, setCoupon] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [couponError, setCouponError] = useState("");

  const parsePrice = (p: string) => parseFloat(p.replace("R$ ", "").replace(".", "").replace(",", "."));
  const formatPrice = (n: number) => `R$ ${n.toFixed(2).replace(".", ",")}`;

  const subtotal = items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0);
  const discountPct = appliedCoupon ? COUPONS[appliedCoupon] || 0 : 0;
  const discountValue = subtotal * (discountPct / 100);
  const shippingCost = selectedShipping !== null && shippingOptions ? shippingOptions[selectedShipping].price : 0;
  const total = subtotal - discountValue + shippingCost;

  const handleCepSearch = () => {
    if (cep.replace(/\D/g, "").length < 8) return;
    setLoadingCep(true);
    setSelectedShipping(null);
    setTimeout(() => {
      setShippingOptions(subtotal >= 299 ? MOCK_SHIPPING.free : MOCK_SHIPPING.default);
      setLoadingCep(false);
    }, 1200);
  };

  const handleApplyCoupon = () => {
    const c = coupon.trim().toUpperCase();
    if (COUPONS[c]) { setAppliedCoupon(c); setCouponError(""); }
    else { setCouponError("Cupom inválido"); setAppliedCoupon(null); }
  };

  const formatCep = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 8);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />

          <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 right-0 bottom-0 z-[61] w-full max-w-[460px] border-l border-border/10 flex flex-col"
            style={{ background: isDark ? "#161617" : "white" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-7 py-5 border-b border-foreground/5">
              <div className="flex items-center gap-3">
                <ShoppingBag size={18} className="text-foreground" strokeWidth={1.5} />
                <span className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "18px", fontWeight: "var(--font-weight-medium)" }}>Carrinho</span>
                <span className="px-2 py-0.5 bg-primary text-primary-foreground" style={{ borderRadius: "100px", fontFamily: "var(--font-family-inter)", fontSize: "10px", fontWeight: "var(--font-weight-medium)" }}>{totalItems}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-9 h-9 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors rounded-full hover:bg-foreground/5 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-7 py-5" style={{ scrollbarWidth: "none" }}>
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-foreground/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag size={28} className="text-foreground/20" strokeWidth={1} />
                  </div>
                  <p className="text-foreground/60 mb-2" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "17px", fontWeight: "var(--font-weight-medium)" }}>Carrinho vazio</p>
                  <p className="text-foreground/30" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Adicione produtos para começar</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div key={item.id} layout initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30, height: 0 }} transition={{ duration: 0.3 }}
                        className={`flex gap-4 p-3.5 border ${lastAdded?.id === item.id ? "border-primary/30 bg-primary/5" : "border-foreground/5 bg-foreground/[0.02]"} transition-colors duration-700`}
                        style={{ borderRadius: "var(--radius-card)" }}
                      >
                        <div className="w-[75px] h-[75px] flex-shrink-0 overflow-hidden" style={{ borderRadius: "var(--radius)", background: isDark ? "#1e1e20" : "#f5f5f5" }}>
                          <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <p className="text-foreground truncate mb-0.5" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}>{item.name}</p>
                            <p className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{item.price}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-0 border border-foreground/10" style={{ borderRadius: "var(--radius)" }}>
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors cursor-pointer"><Minus size={12} /></button>
                              <span className="w-7 h-7 flex items-center justify-center text-foreground" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center text-foreground/40 hover:text-foreground transition-colors cursor-pointer"><Plus size={12} /></button>
                            </div>
                            <button onClick={() => removeItem(item.id)} className="text-foreground/20 hover:text-primary transition-colors cursor-pointer"><Trash2 size={14} /></button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-foreground/5 px-7 py-5 space-y-3 max-h-[55vh] overflow-y-auto" style={{ scrollbarWidth: "none" }}>

                {/* Collapsible: Calcular Frete */}
                <div>
                  <button onClick={() => setShippingOpen(!shippingOpen)}
                    className="flex items-center justify-between w-full py-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin size={12} className="text-foreground/25" />
                      <span className="text-foreground/30 group-hover:text-foreground/50 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                        {shippingOptions && selectedShipping !== null ? `Frete: ${shippingOptions[selectedShipping].name}` : "Calcular frete"}
                      </span>
                    </div>
                    <ChevronDown size={11} className={`text-foreground/20 transition-transform duration-300 ${shippingOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {shippingOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="pt-3 space-y-2">
                          <div className="flex gap-2">
                            <input type="text" placeholder="00000-000" value={cep}
                              onChange={(e) => setCep(formatCep(e.target.value))}
                              onKeyDown={(e) => e.key === "Enter" && handleCepSearch()}
                              className="flex-1 px-3 py-2 border border-foreground/8 bg-foreground/[0.03] text-foreground placeholder:text-foreground/15 focus:border-foreground/20 focus:outline-none transition-colors"
                              style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }} />
                            <button onClick={handleCepSearch} disabled={loadingCep || cep.replace(/\D/g, "").length < 8}
                              className="px-3 py-2 text-foreground/30 hover:text-foreground/60 transition-all duration-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                              style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                            >{loadingCep ? <Loader2 size={13} className="animate-spin" /> : "Calcular"}</button>
                          </div>
                          <AnimatePresence>
                            {shippingOptions && (
                              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                                {shippingOptions.map((opt, idx) => (
                                  <button key={opt.name} onClick={() => setSelectedShipping(idx)}
                                    className={`w-full flex items-center justify-between px-3 py-2 border transition-all duration-300 cursor-pointer ${
                                      selectedShipping === idx ? "border-primary/30 bg-primary/5" : "border-foreground/5 hover:border-foreground/10"
                                    }`}
                                    style={{ borderRadius: "var(--radius-button)" }}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Truck size={12} className={selectedShipping === idx ? "text-primary" : "text-foreground/25"} />
                                      <div className="text-left">
                                        <p className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>{opt.name}</p>
                                        <p className="text-foreground/20" style={{ fontFamily: "var(--font-family-inter)", fontSize: "9px" }}>{opt.days}</p>
                                      </div>
                                    </div>
                                    <span className={opt.price === 0 ? "text-green-500" : "text-foreground/40"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "11px", fontWeight: "var(--font-weight-medium)" }}>
                                      {opt.price === 0 ? "Grátis" : formatPrice(opt.price)}
                                    </span>
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Collapsible: Cupom */}
                <div>
                  <button onClick={() => setCouponOpen(!couponOpen)}
                    className="flex items-center justify-between w-full py-1 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <Tag size={12} className="text-foreground/25" />
                      <span className="text-foreground/30 group-hover:text-foreground/50 transition-colors" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                        {appliedCoupon ? `Cupom: ${appliedCoupon} (-${discountPct}%)` : "Cupom de desconto"}
                      </span>
                    </div>
                    <ChevronDown size={11} className={`text-foreground/20 transition-transform duration-300 ${couponOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {couponOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                        <div className="pt-3">
                          {appliedCoupon ? (
                            <div className="flex items-center justify-between px-3 py-2 border border-green-500/20 bg-green-500/5" style={{ borderRadius: "var(--radius-button)" }}>
                              <div className="flex items-center gap-2">
                                <Check size={13} className="text-green-500" />
                                <span className="text-green-400" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px", fontWeight: "var(--font-weight-medium)" }}>{appliedCoupon}</span>
                                <span className="text-green-500/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>(-{discountPct}%)</span>
                              </div>
                              <button onClick={() => { setAppliedCoupon(null); setCoupon(""); }} className="text-foreground/30 hover:text-foreground transition-colors cursor-pointer"><X size={13} /></button>
                            </div>
                          ) : (
                            <>
                              <div className="flex gap-2">
                                <input type="text" placeholder="Ex: PCYES10" value={coupon}
                                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponError(""); }}
                                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                                  className="flex-1 px-3 py-2 border border-foreground/8 bg-foreground/[0.03] text-foreground placeholder:text-foreground/15 focus:border-foreground/20 focus:outline-none transition-colors"
                                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "12px" }} />
                                <button onClick={handleApplyCoupon} disabled={!coupon.trim()}
                                  className="px-3 py-2 text-foreground/30 hover:text-foreground/60 transition-all duration-300 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}
                                >Aplicar</button>
                              </div>
                              {couponError && <p className="text-primary mt-1" style={{ fontFamily: "var(--font-family-inter)", fontSize: "10px" }}>{couponError}</p>}
                            </>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="h-px bg-foreground/5" />

                {/* Totals */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>Subtotal</span>
                    <span className="text-foreground/60" style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}>{formatPrice(subtotal)}</span>
                  </div>
                  {discountValue > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Desconto ({discountPct}%)</span>
                      <span className="text-green-500" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>-{formatPrice(discountValue)}</span>
                    </div>
                  )}
                  {selectedShipping !== null && shippingOptions && (
                    <div className="flex items-center justify-between">
                      <span className="text-foreground/35" style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>Frete</span>
                      <span className={shippingCost === 0 ? "text-green-500" : "text-foreground/50"} style={{ fontFamily: "var(--font-family-inter)", fontSize: "12px" }}>
                        {shippingCost === 0 ? "Grátis" : formatPrice(shippingCost)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-foreground/50" style={{ fontFamily: "var(--font-family-inter)", fontSize: "14px" }}>Total</span>
                  <span className="text-foreground" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "22px", fontWeight: "var(--font-weight-medium)" }}>{formatPrice(total)}</span>
                </div>

                <button
                  className="w-full py-4 bg-primary text-primary-foreground hover:shadow-[0_0_40px_rgba(255,43,46,0.25)] transition-all duration-500 flex items-center justify-center gap-2 cursor-pointer"
                  style={{ borderRadius: "var(--radius-button)", fontFamily: "var(--font-family-inter)", fontSize: "14px", fontWeight: "var(--font-weight-medium)" }}
                  onClick={() => { setIsOpen(false); navigate("/checkout"); }}
                >Finalizar compra</button>
                <button onClick={() => setIsOpen(false)}
                  className="w-full py-2 text-foreground/30 hover:text-foreground/50 transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-family-inter)", fontSize: "13px" }}
                >Continuar comprando</button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
