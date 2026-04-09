import { allProducts, type Product } from "./productsData";

export interface ProductSwatch {
  color: string;
  label: string;
}

export interface ProductHoverMedia {
  type: "video" | "image";
  src: string;
}

const COLOR_RULES = [
  { keywords: ["black", "preto", "vulcan"], color: "#18181b", label: "Preto" },
  { keywords: ["white", "branco", "ghost"], color: "#f4f4f5", label: "Branco" },
  { keywords: ["red", "vermelho", "magma"], color: "#dc2626", label: "Vermelho" },
  { keywords: ["blue", "azul", "cobalt", "colbat"], color: "#2563eb", label: "Azul" },
  { keywords: ["green", "verde", "mint"], color: "#65a30d", label: "Verde" },
  { keywords: ["purple", "roxo"], color: "#9333ea", label: "Roxo" },
  { keywords: ["yellow", "amarela", "amarelo"], color: "#eab308", label: "Amarelo" },
  { keywords: ["brown", "marrom"], color: "#92400e", label: "Marrom" },
  { keywords: ["pink", "rosa"], color: "#ec4899", label: "Rosa" },
  { keywords: ["silver", "prata"], color: "#a1a1aa", label: "Prata" },
];

const GENERIC_TOKENS = new Set([
  "pcyes",
  "gamer",
  "gaming",
  "ergonomica",
  "ergonômica",
  "vidro",
  "temperado",
  "lateral",
  "pc",
  "yes",
  "mm",
  "rgb",
  "argb",
  "wireless",
  "sem",
  "fio",
  "usb",
  "series",
]);

const hoverVideos: Partial<Record<number, string>> = {};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getColorRule(name: string) {
  const normalized = normalizeText(name);
  return COLOR_RULES.find((rule) => rule.keywords.some((keyword) => normalized.includes(keyword)));
}

function getFamilySignature(product: Pick<Product, "name" | "category">) {
  const normalized = normalizeText(product.name)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .filter((token) => token.length > 2)
    .filter((token) => !GENERIC_TOKENS.has(token))
    .filter((token) => !COLOR_RULES.some((rule) => rule.keywords.includes(token)));

  const familyTokens = normalized.slice(0, 2);
  return `${normalizeText(product.category)}::${familyTokens.join("-")}`;
}

export function getProductSwatches(
  product: Pick<Product, "id" | "name" | "category">,
  catalog: Product[] = allProducts,
): ProductSwatch[] {
  const signature = getFamilySignature(product);
  if (!signature.endsWith("::")) {
    const variants = catalog.filter((candidate) => getFamilySignature(candidate) === signature);
    const deduped = new Map<string, ProductSwatch>();

    variants.forEach((variant) => {
      const rule = getColorRule(variant.name);
      if (rule) deduped.set(rule.label, { color: rule.color, label: rule.label });
    });

    if (deduped.size > 1) {
      return Array.from(deduped.values()).slice(0, 6);
    }
  }

  return [];
}

export function getProductHoverMedia(
  product: Pick<Product, "id" | "image" | "images">,
): ProductHoverMedia | null {
  const video = hoverVideos[product.id];
  if (video) {
    return { type: "video", src: video };
  }

  if (product.images && product.images.length > 1) {
    return { type: "image", src: product.images[1] };
  }

  return null;
}
