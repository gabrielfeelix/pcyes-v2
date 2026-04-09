import { useTheme } from "./ThemeProvider";
import { FeaturedProduct } from "./FeaturedProduct";
import { CategoryGrid } from "./CategoryGrid";
import { NewReleasesSection } from "./NewReleasesSection";
import { ProductsByTags } from "./ProductsByTags";
import { ProductCarousel, recentArrivalIds } from "./ProductCarousel";
import { WorldSection } from "./WorldSection";
import { InRealLifeSection } from "./InRealLifeSection";
import { FeaturesStrip } from "./FeaturesStrip";
import { Newsletter } from "./Newsletter";
import { BannerSection } from "./BannerSection";
import { Footer } from "./Footer";
import { HeroSection } from "./HeroSection";

export function HomePage() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === undefined;
  const darkBg = isDark ? "#161617" : "transparent";

  return (
    <>
      <HeroSection />

      <div style={{ background: darkBg }}>
        <FeaturedProduct
          label="LANÇAMENTO"
          title="Headset Fallen 7.1"
          description="Som surround 7.1 com drivers de 50mm, microfone removível com cancelamento de ruído e almofadas de espuma viscoelástica para sessões sem limites."
          image="https://images.unsplash.com/photo-1673669231301-09baa4d7761b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBoZWFkc2V0JTIwZGFyayUyMGJhY2tncm91bmR8ZW58MXx8fHwxNzczODM5Nzk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          imageAlt="Headset Fallen 7.1"
          price="R$ 279,90"
          oldPrice="R$ 349,90"
          reverse
          specs={["7.1 Surround", "50mm Drivers", "Mic Removível", "Memory Foam"]}
          productId={3}
        />
      </div>

      <div style={{ background: darkBg }}>
        <CategoryGrid />
      </div>

      <div style={{ background: darkBg }}>
        <BannerSection />
      </div>

      <ProductCarousel
        label="NOVIDADES"
        title="Acabou de chegar"
        subtitle="Seleção com imagens reais do catálogo PCYES para destacar o que acabou de entrar ou merece atenção agora."
        productIds={recentArrivalIds}
        compactTop
      />

      <ProductCarousel />

      <div style={{ background: darkBg }}>
        <WorldSection />
      </div>

      <NewReleasesSection />

      <div style={{ background: darkBg }}>
        <ProductsByTags />
      </div>

      <InRealLifeSection />

      <Newsletter />
      <FeaturesStrip />
      <Footer />
    </>
  );
}
