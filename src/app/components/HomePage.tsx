import { useTheme } from "./ThemeProvider";
import { Marquee } from "./Marquee";
import { FeaturedProduct } from "./FeaturedProduct";
import { CategoryGrid } from "./CategoryGrid";
import { NewReleasesSection } from "./NewReleasesSection";
import { ProductsByTags } from "./ProductsByTags";
import { ProductCarousel } from "./ProductCarousel";
import { PopularGrid } from "./PopularGrid";
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
  const darkerBg = isDark ? "#0f0f10" : "transparent";

  return (
    <>
      <HeroSection />

      <div style={{ background: darkBg }}>
        <CategoryGrid />
      </div>

      <ProductCarousel />

      <div style={{ background: darkerBg }}>
        <FeaturedProduct
          label="DESTAQUE"
          title="Gabinete Spectrum Pro"
          description="Design em vidro temperado com fluxo de ar otimizado, iluminação ARGB integrada e espaço para builds de alta performance. Engenharia pensada em cada detalhe."
          image="https://images.unsplash.com/photo-1695120485648-0b6eed4707aa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21wdXRlciUyMGNhc2UlMjB0b3dlciUyMGRhcmt8ZW58MXx8fHwxNzczODM5Nzk1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          imageAlt="Gabinete Spectrum Pro"
          price="R$ 599,90"
          specs={["ATX", "Vidro Temperado", "6 Fans", "USB-C"]}
          productId={4}
        />
      </div>

      <Marquee words={["Performance", "Precisão", "Design", "Inovação", "Tecnologia", "Gaming"]} speed={40} />

      <NewReleasesSection />

      <div style={{ background: darkerBg }}>
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
        <ProductsByTags />
      </div>

      <Marquee words={["Gabinetes", "Teclados", "Mouses", "Headsets", "Fontes", "Coolers", "Cadeiras", "Monitores"]} speed={50} separator="·" />

      <PopularGrid />

      <div style={{ background: darkBg }}>
        <WorldSection />
      </div>
      <InRealLifeSection />

      <FeaturesStrip />
      <Newsletter />
      <BannerSection />
      <Footer />
    </>
  );
}
