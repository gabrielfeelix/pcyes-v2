import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { useTheme } from "./ThemeProvider";
import { Truck, Shield, CreditCard, Headphones } from "lucide-react";

const features = [
  { icon: Truck, title: "Frete grátis", desc: "Compras acima de R$ 299" },
  { icon: Shield, title: "Garantia estendida", desc: "Até 3 anos de cobertura" },
  { icon: CreditCard, title: "12x sem juros", desc: "Em todos os cartões" },
  { icon: Headphones, title: "Suporte 24/7", desc: "Atendimento especializado" },
];

export function FeaturesStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const backgroundColor = isDark ? "#cfcfd3" : "#d9d9dd";

  return (
    <section ref={ref} className="py-24 border-y border-black/8" style={{ background: backgroundColor }}>
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group text-center"
          >
            <div className="w-14 h-14 mx-auto mb-5 border border-black/10 rounded-full flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all duration-500">
              <f.icon size={20} strokeWidth={1} className="text-black/40 group-hover:text-primary transition-colors duration-500" />
            </div>
            <p className="text-black mb-1" style={{ fontFamily: "var(--font-family-figtree)", fontSize: "16px", fontWeight: "var(--font-weight-medium)" }}>
              {f.title}
            </p>
            <p className="text-black/45" style={{ fontFamily: "var(--font-family-inter)", fontSize: "var(--text-caption)" }}>
              {f.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
