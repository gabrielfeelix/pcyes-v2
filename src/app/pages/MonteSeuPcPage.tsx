import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Cpu,
  Expand,
  HardDrive,
  Monitor,
  Save,
  Settings,
  Share2,
  ShoppingCart,
  Zap,
} from "lucide-react";
import { Footer } from "../components/Footer";
import { allProducts } from "../components/productsData";
import { useCart } from "../components/CartContext";
import { Button } from "../components/ui/button";
import { cn } from "../components/ui/utils";

type VisualKind =
  | "cpu"
  | "motherboard"
  | "ram"
  | "gpu"
  | "cooling"
  | "storage"
  | "case"
  | "psu"
  | "peripheral";

type Option = {
  id: string;
  name: string;
  price: number;
  image?: string;
  gallery?: string[];
  summary?: string;
  highlights?: string[];
  type?: string;
  standard?: boolean;
  req?: string[];
};

type Category = {
  id: string;
  title: string;
  icon: React.ReactNode;
  options: Option[];
};

const CONFIG_STORAGE_KEY = "pcyes-monte-seu-pc-config";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const escapeSvgText = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const buildComponentVisual = ({
  title,
  subtitle,
  accent,
  kind,
}: {
  title: string;
  subtitle: string;
  accent: string;
  kind: VisualKind;
}) => {
  const safeTitle = escapeSvgText(title);
  const safeSubtitle = escapeSvgText(subtitle);

  let illustration = "";

  switch (kind) {
    case "cpu":
      illustration = `
        <rect x="390" y="170" width="420" height="420" rx="48" fill="#0B0F18" stroke="${accent}" stroke-width="16"/>
        <rect x="470" y="250" width="260" height="260" rx="30" fill="url(#accentGlow)" stroke="rgba(255,255,255,0.24)" stroke-width="8"/>
        <rect x="520" y="300" width="160" height="160" rx="22" fill="#05070B" stroke="rgba(255,255,255,0.18)" stroke-width="6"/>
        ${Array.from({ length: 10 })
          .map((_, index) => `<rect x="${348 + index * 50}" y="128" width="18" height="56" rx="8" fill="${accent}" opacity="0.85"/>`)
          .join("")}
        ${Array.from({ length: 10 })
          .map((_, index) => `<rect x="${348 + index * 50}" y="576" width="18" height="56" rx="8" fill="${accent}" opacity="0.85"/>`)
          .join("")}
      `;
      break;
    case "motherboard":
      illustration = `
        <rect x="320" y="150" width="560" height="470" rx="42" fill="#090B10" stroke="${accent}" stroke-width="14"/>
        <rect x="390" y="220" width="220" height="220" rx="26" fill="#0F1520" stroke="rgba(255,255,255,0.15)" stroke-width="8"/>
        <rect x="650" y="220" width="140" height="36" rx="12" fill="${accent}" opacity="0.85"/>
        <rect x="650" y="282" width="160" height="28" rx="10" fill="rgba(255,255,255,0.12)"/>
        <rect x="650" y="330" width="120" height="28" rx="10" fill="rgba(255,255,255,0.12)"/>
        <rect x="650" y="378" width="180" height="28" rx="10" fill="rgba(255,255,255,0.12)"/>
        <rect x="370" y="472" width="460" height="56" rx="20" fill="#111722" stroke="rgba(255,255,255,0.14)" stroke-width="6"/>
        <circle cx="770" cy="520" r="28" fill="${accent}" opacity="0.92"/>
      `;
      break;
    case "ram":
      illustration = `
        <rect x="220" y="338" width="760" height="170" rx="34" fill="#0A0F18" stroke="${accent}" stroke-width="14"/>
        ${Array.from({ length: 8 })
          .map((_, index) => `<rect x="${286 + index * 78}" y="296" width="42" height="128" rx="16" fill="${accent}" opacity="${0.32 + index * 0.06}"/>`)
          .join("")}
        ${Array.from({ length: 10 })
          .map((_, index) => `<rect x="${272 + index * 66}" y="510" width="16" height="70" rx="8" fill="#C7CFDD" opacity="0.7"/>`)
          .join("")}
      `;
      break;
    case "gpu":
      illustration = `
        <rect x="230" y="298" width="740" height="220" rx="40" fill="#0A0D14" stroke="${accent}" stroke-width="14"/>
        <circle cx="430" cy="408" r="88" fill="#101621" stroke="rgba(255,255,255,0.14)" stroke-width="10"/>
        <circle cx="430" cy="408" r="38" fill="${accent}" opacity="0.92"/>
        <circle cx="720" cy="408" r="88" fill="#101621" stroke="rgba(255,255,255,0.14)" stroke-width="10"/>
        <circle cx="720" cy="408" r="38" fill="${accent}" opacity="0.92"/>
        <rect x="892" y="346" width="42" height="126" rx="16" fill="#DDE3ED" opacity="0.9"/>
      `;
      break;
    case "cooling":
      illustration = `
        <rect x="230" y="250" width="480" height="300" rx="38" fill="#0B1018" stroke="${accent}" stroke-width="14"/>
        <circle cx="380" cy="400" r="90" fill="#111722" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
        <circle cx="560" cy="400" r="90" fill="#111722" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
        <circle cx="380" cy="400" r="34" fill="${accent}" opacity="0.92"/>
        <circle cx="560" cy="400" r="34" fill="${accent}" opacity="0.92"/>
        <rect x="760" y="320" width="138" height="138" rx="28" fill="#0B1018" stroke="rgba(255,255,255,0.14)" stroke-width="8"/>
        <path d="M710 400C748 400 748 389 760 389" stroke="${accent}" stroke-width="16" stroke-linecap="round"/>
      `;
      break;
    case "storage":
      illustration = `
        <rect x="220" y="352" width="760" height="124" rx="34" fill="#0B0E15" stroke="${accent}" stroke-width="14"/>
        <circle cx="314" cy="414" r="30" fill="${accent}" opacity="0.95"/>
        <rect x="388" y="382" width="250" height="30" rx="12" fill="rgba(255,255,255,0.15)"/>
        <rect x="388" y="428" width="188" height="24" rx="10" fill="rgba(255,255,255,0.1)"/>
        ${Array.from({ length: 6 })
          .map((_, index) => `<rect x="${726 + index * 32}" y="386" width="18" height="56" rx="8" fill="#DCE4F2" opacity="0.84"/>`)
          .join("")}
      `;
      break;
    case "case":
      illustration = `
        <rect x="430" y="160" width="320" height="540" rx="52" fill="#090C11" stroke="${accent}" stroke-width="14"/>
        <rect x="500" y="230" width="178" height="390" rx="32" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" stroke-width="8"/>
        <rect x="626" y="250" width="18" height="344" rx="9" fill="${accent}" opacity="0.9"/>
        <circle cx="598" cy="650" r="18" fill="#D9E0EB" opacity="0.85"/>
      `;
      break;
    case "psu":
      illustration = `
        <rect x="270" y="288" width="660" height="260" rx="40" fill="#0A0E14" stroke="${accent}" stroke-width="14"/>
        <circle cx="430" cy="418" r="96" fill="#101722" stroke="rgba(255,255,255,0.16)" stroke-width="10"/>
        <circle cx="430" cy="418" r="36" fill="${accent}" opacity="0.94"/>
        ${Array.from({ length: 8 })
          .map((_, index) => `<rect x="${664 + index * 28}" y="342" width="16" height="152" rx="8" fill="#DBE2EE" opacity="0.75"/>`)
          .join("")}
      `;
      break;
    case "peripheral":
      illustration = `
        <rect x="240" y="430" width="520" height="126" rx="28" fill="#0B1018" stroke="${accent}" stroke-width="14"/>
        ${Array.from({ length: 11 })
          .map((_, index) => `<rect x="${284 + index * 40}" y="466" width="24" height="24" rx="6" fill="rgba(255,255,255,${0.18 + (index % 3) * 0.05})"/>`)
          .join("")}
        <path d="M790 382C852 382 904 434 904 496V538H840C797 538 762 503 762 460V410C762 394 774 382 790 382Z" fill="#101722" stroke="${accent}" stroke-width="14"/>
      `;
      break;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" fill="none">
      <defs>
        <linearGradient id="bg" x1="120" y1="80" x2="1080" y2="820" gradientUnits="userSpaceOnUse">
          <stop stop-color="#14171E"/>
          <stop offset="1" stop-color="#07080B"/>
        </linearGradient>
        <radialGradient id="accentGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(600 360) rotate(90) scale(280 280)">
          <stop stop-color="${accent}" stop-opacity="0.34"/>
          <stop offset="1" stop-color="${accent}" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <circle cx="965" cy="164" r="176" fill="${accent}" fill-opacity="0.12"/>
      <circle cx="250" cy="742" r="220" fill="${accent}" fill-opacity="0.08"/>
      <path d="M0 132H1200" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
      <path d="M0 720H1200" stroke="rgba(255,255,255,0.05)" stroke-width="2"/>
      ${illustration}
      <text x="92" y="120" fill="white" font-family="Arial, sans-serif" font-size="62" font-weight="700">${safeTitle}</text>
      <text x="92" y="176" fill="rgba(255,255,255,0.62)" font-family="Arial, sans-serif" font-size="28" font-weight="400">${safeSubtitle}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};

const findCatalogProduct = (...needles: string[]) =>
  allProducts.find((product) =>
    needles.every((needle) => product.name.toLowerCase().includes(needle.toLowerCase())),
  );

const blackCase = findCatalogProduct("forcefield", "black vulcan");
const whiteCase = findCatalogProduct("forcefield", "white ghost");
const setCase = findCatalogProduct("set black");
const coolerAir = findCatalogProduct("nótus st");
const coolerWhite = findCatalogProduct("sangue frio 3 white ghost");
const coolerArgb = findCatalogProduct("sangue frio 3 argb");
const nvme256 = findCatalogProduct("ssd pcyes 256gb m.2 nvme");
const nvme512 = findCatalogProduct("ssd pcyes 512gb m.2 nvme");
const sata1tb = findCatalogProduct("ssd pcyes 1tb sata");
const keyboardBlack = findCatalogProduct("kuromori black vulcan blue");
const keyboardWhite = findCatalogProduct("kuromori white ghost blue");
const mouseBlack = findCatalogProduct("basaran black vulcan");

const categories: Category[] = [
  {
    id: "cpu",
    title: "Processador",
    icon: <Cpu className="h-4 w-4" />,
    options: [
      {
        id: "cpu-1",
        name: "Intel Core i5-13400F",
        price: 1200,
        standard: true,
        summary: "Intel 10 núcleos com ótimo custo para começar a montagem.",
        highlights: ["LGA1700", "10 núcleos", "Até 4.6GHz"],
        image: buildComponentVisual({
          title: "Intel Core i5",
          subtitle: "LGA1700 · 10 núcleos",
          accent: "#00AEEF",
          kind: "cpu",
        }),
        gallery: [
          buildComponentVisual({
            title: "Intel Core i5",
            subtitle: "LGA1700 · 10 núcleos",
            accent: "#00AEEF",
            kind: "cpu",
          }),
        ],
      },
      {
        id: "cpu-2",
        name: "Intel Core i7-13700K",
        price: 2500,
        summary: "Mais fôlego para multitarefa e placas de vídeo mais fortes.",
        highlights: ["LGA1700", "16 núcleos", "Até 5.4GHz"],
        image: buildComponentVisual({
          title: "Intel Core i7",
          subtitle: "LGA1700 · 16 núcleos",
          accent: "#0EA5E9",
          kind: "cpu",
        }),
        gallery: [
          buildComponentVisual({
            title: "Intel Core i7",
            subtitle: "LGA1700 · 16 núcleos",
            accent: "#0EA5E9",
            kind: "cpu",
          }),
        ],
      },
      {
        id: "cpu-3",
        name: "AMD Ryzen 5 7600",
        price: 1400,
        summary: "Entrada forte na plataforma AM5 com ótimo equilíbrio.",
        highlights: ["AM5", "6 núcleos", "Até 5.1GHz"],
        image: buildComponentVisual({
          title: "AMD Ryzen 5",
          subtitle: "AM5 · 6 núcleos",
          accent: "#F97316",
          kind: "cpu",
        }),
        gallery: [
          buildComponentVisual({
            title: "AMD Ryzen 5",
            subtitle: "AM5 · 6 núcleos",
            accent: "#F97316",
            kind: "cpu",
          }),
        ],
      },
      {
        id: "cpu-4",
        name: "AMD Ryzen 7 7800X3D",
        price: 2800,
        summary: "Opção premium para foco em games e alto FPS.",
        highlights: ["AM5", "8 núcleos", "3D V-Cache"],
        image: buildComponentVisual({
          title: "AMD Ryzen 7",
          subtitle: "AM5 · 3D V-Cache",
          accent: "#FB923C",
          kind: "cpu",
        }),
        gallery: [
          buildComponentVisual({
            title: "AMD Ryzen 7",
            subtitle: "AM5 · 3D V-Cache",
            accent: "#FB923C",
            kind: "cpu",
          }),
        ],
      },
    ],
  },
  {
    id: "motherboard",
    title: "Placa Mãe",
    icon: <Settings className="h-4 w-4" />,
    options: [
      {
        id: "mb-1",
        name: "B760M AORUS ELITE (Intel)",
        price: 1100,
        req: ["cpu-1", "cpu-2"],
        standard: true,
        summary: "Base sólida para Intel com boa expansão e visual limpo.",
        highlights: ["LGA1700", "DDR5", "mATX"],
        image: buildComponentVisual({
          title: "B760M AORUS",
          subtitle: "Intel · DDR5 · mATX",
          accent: "#38BDF8",
          kind: "motherboard",
        }),
        gallery: [
          buildComponentVisual({
            title: "B760M AORUS",
            subtitle: "Intel · DDR5 · mATX",
            accent: "#38BDF8",
            kind: "motherboard",
          }),
        ],
      },
      {
        id: "mb-2",
        name: "Z790 GAMING X (Intel)",
        price: 1800,
        req: ["cpu-1", "cpu-2"],
        summary: "Mais robusta para extrair tudo dos Intel de nível mais alto.",
        highlights: ["LGA1700", "PCIe 5.0", "ATX"],
        image: buildComponentVisual({
          title: "Z790 GAMING X",
          subtitle: "Intel · PCIe 5.0",
          accent: "#0EA5E9",
          kind: "motherboard",
        }),
        gallery: [
          buildComponentVisual({
            title: "Z790 GAMING X",
            subtitle: "Intel · PCIe 5.0",
            accent: "#0EA5E9",
            kind: "motherboard",
          }),
        ],
      },
      {
        id: "mb-3",
        name: "B650M TUF GAMING (AMD)",
        price: 1300,
        req: ["cpu-3", "cpu-4"],
        summary: "Opção enxuta para plataforma AM5 com base muito segura.",
        highlights: ["AM5", "DDR5", "mATX"],
        image: buildComponentVisual({
          title: "B650M TUF",
          subtitle: "AMD · DDR5 · mATX",
          accent: "#F97316",
          kind: "motherboard",
        }),
        gallery: [
          buildComponentVisual({
            title: "B650M TUF",
            subtitle: "AMD · DDR5 · mATX",
            accent: "#F97316",
            kind: "motherboard",
          }),
        ],
      },
      {
        id: "mb-4",
        name: "X670E ROG STRIX (AMD)",
        price: 2500,
        req: ["cpu-3", "cpu-4"],
        summary: "Placa mais premium para AM5, preparada para build topo.",
        highlights: ["AM5", "PCIe 5.0", "ATX"],
        image: buildComponentVisual({
          title: "X670E ROG",
          subtitle: "AMD · PCIe 5.0",
          accent: "#FB923C",
          kind: "motherboard",
        }),
        gallery: [
          buildComponentVisual({
            title: "X670E ROG",
            subtitle: "AMD · PCIe 5.0",
            accent: "#FB923C",
            kind: "motherboard",
          }),
        ],
      },
    ],
  },
  {
    id: "ram",
    title: "Memória RAM",
    icon: <Zap className="h-4 w-4" />,
    options: [
      {
        id: "ram-1",
        name: "16GB (2x8GB) DDR5 5200MHz",
        price: 400,
        standard: true,
        summary: "Ponto de partida para jogos competitivos e uso geral.",
        highlights: ["16GB", "DDR5", "5200MHz"],
        image: buildComponentVisual({
          title: "DDR5 16GB",
          subtitle: "2x8GB · 5200MHz",
          accent: "#8B5CF6",
          kind: "ram",
        }),
        gallery: [
          buildComponentVisual({
            title: "DDR5 16GB",
            subtitle: "2x8GB · 5200MHz",
            accent: "#8B5CF6",
            kind: "ram",
          }),
        ],
      },
      {
        id: "ram-2",
        name: "32GB (2x16GB) DDR5 6000MHz",
        price: 800,
        summary: "Melhor equilíbrio para jogos AAA, multitarefa e criação.",
        highlights: ["32GB", "DDR5", "6000MHz"],
        image: buildComponentVisual({
          title: "DDR5 32GB",
          subtitle: "2x16GB · 6000MHz",
          accent: "#A855F7",
          kind: "ram",
        }),
        gallery: [
          buildComponentVisual({
            title: "DDR5 32GB",
            subtitle: "2x16GB · 6000MHz",
            accent: "#A855F7",
            kind: "ram",
          }),
        ],
      },
      {
        id: "ram-3",
        name: "64GB (2x32GB) DDR5 6400MHz",
        price: 1600,
        summary: "Para streaming pesado, edição e longevidade do setup.",
        highlights: ["64GB", "DDR5", "6400MHz"],
        image: buildComponentVisual({
          title: "DDR5 64GB",
          subtitle: "2x32GB · 6400MHz",
          accent: "#C084FC",
          kind: "ram",
        }),
        gallery: [
          buildComponentVisual({
            title: "DDR5 64GB",
            subtitle: "2x32GB · 6400MHz",
            accent: "#C084FC",
            kind: "ram",
          }),
        ],
      },
    ],
  },
  {
    id: "gpu",
    title: "Placa de Vídeo",
    icon: <Monitor className="h-4 w-4" />,
    options: [
      {
        id: "gpu-1",
        name: "RTX 4060 8GB",
        price: 1800,
        standard: true,
        summary: "Entrada sólida para Full HD com ray tracing acessível.",
        highlights: ["8GB", "DLSS", "Full HD"],
        image: buildComponentVisual({
          title: "RTX 4060",
          subtitle: "8GB · DLSS",
          accent: "#22C55E",
          kind: "gpu",
        }),
        gallery: [
          buildComponentVisual({
            title: "RTX 4060",
            subtitle: "8GB · DLSS",
            accent: "#22C55E",
            kind: "gpu",
          }),
        ],
      },
      {
        id: "gpu-2",
        name: "RTX 4070 SUPER 12GB",
        price: 3800,
        summary: "Ponto de equilíbrio para QHD com sobra para os próximos anos.",
        highlights: ["12GB", "QHD", "DLSS 3"],
        image: buildComponentVisual({
          title: "RTX 4070 SUPER",
          subtitle: "12GB · QHD",
          accent: "#16A34A",
          kind: "gpu",
        }),
        gallery: [
          buildComponentVisual({
            title: "RTX 4070 SUPER",
            subtitle: "12GB · QHD",
            accent: "#16A34A",
            kind: "gpu",
          }),
        ],
      },
      {
        id: "gpu-3",
        name: "RX 7800 XT 16GB",
        price: 3500,
        summary: "Entrega muita memória de vídeo e ótimo custo em QHD.",
        highlights: ["16GB", "QHD", "RDNA 3"],
        image: buildComponentVisual({
          title: "RX 7800 XT",
          subtitle: "16GB · RDNA 3",
          accent: "#F97316",
          kind: "gpu",
        }),
        gallery: [
          buildComponentVisual({
            title: "RX 7800 XT",
            subtitle: "16GB · RDNA 3",
            accent: "#F97316",
            kind: "gpu",
          }),
        ],
      },
      {
        id: "gpu-4",
        name: "RTX 4090 24GB",
        price: 12000,
        summary: "Build máxima para 4K e uso extremo sem concessões.",
        highlights: ["24GB", "4K", "Flagship"],
        image: buildComponentVisual({
          title: "RTX 4090",
          subtitle: "24GB · 4K",
          accent: "#22C55E",
          kind: "gpu",
        }),
        gallery: [
          buildComponentVisual({
            title: "RTX 4090",
            subtitle: "24GB · 4K",
            accent: "#22C55E",
            kind: "gpu",
          }),
        ],
      },
    ],
  },
  {
    id: "cooling",
    title: "Refrigeração",
    icon: <Settings className="h-4 w-4" />,
    options: [
      {
        id: "cooling-1",
        name: coolerAir?.name ?? "Cooler PCYES Nótus ST Intel",
        price: coolerAir?.priceNum ?? 350,
        image:
          coolerAir?.image ??
          buildComponentVisual({
            title: "Nótus ST",
            subtitle: "Air cooler",
            accent: "#22C55E",
            kind: "cooling",
          }),
        gallery:
          coolerAir?.images ??
          [
            buildComponentVisual({
              title: "Nótus ST",
              subtitle: "Air cooler",
              accent: "#22C55E",
              kind: "cooling",
            }),
          ],
        standard: true,
        req: ["cpu-1", "cpu-2"],
        summary: "Air cooler simples e direto para as opções Intel de entrada.",
        highlights: ["Air cooler", "Intel", "65W TDP"],
      },
      {
        id: "cooling-2",
        name: coolerWhite?.name ?? "Water Cooler PCYES Sangue Frio 3 White Ghost 120mm",
        price: coolerWhite?.priceNum ?? 550,
        image:
          coolerWhite?.image ??
          buildComponentVisual({
            title: "Sangue Frio 3",
            subtitle: "120mm",
            accent: "#60A5FA",
            kind: "cooling",
          }),
        gallery:
          coolerWhite?.images ??
          [
            buildComponentVisual({
              title: "Sangue Frio 3",
              subtitle: "120mm",
              accent: "#60A5FA",
              kind: "cooling",
            }),
          ],
        summary: "AIO enxuto para segurar melhor calor e ruído no setup.",
        highlights: ["120mm", "AIO", "White Ghost"],
      },
      {
        id: "cooling-3",
        name: coolerArgb?.name ?? "Water Cooler PCYES Sangue Frio 3 ARGB White Ghost 120mm",
        price: coolerArgb?.priceNum ?? 690,
        image:
          coolerArgb?.image ??
          buildComponentVisual({
            title: "Sangue Frio 3 ARGB",
            subtitle: "120mm · ARGB",
            accent: "#A855F7",
            kind: "cooling",
          }),
        gallery:
          coolerArgb?.images ??
          [
            buildComponentVisual({
              title: "Sangue Frio 3 ARGB",
              subtitle: "120mm · ARGB",
              accent: "#A855F7",
              kind: "cooling",
            }),
          ],
        summary: "Versão mais chamativa para build com iluminação e vitrine.",
        highlights: ["120mm", "ARGB", "AIO"],
      },
    ],
  },
  {
    id: "storage",
    title: "HD e SSD",
    icon: <HardDrive className="h-4 w-4" />,
    options: [
      {
        id: "storage-1",
        name: nvme256?.name ?? "SSD PCYES 256GB M.2 NVMe PCIe 3.0x4",
        price: nvme256?.priceNum ?? 300,
        image:
          nvme256?.image ??
          buildComponentVisual({
            title: "SSD NVMe 256GB",
            subtitle: "PCIe 3.0",
            accent: "#06B6D4",
            kind: "storage",
          }),
        gallery:
          nvme256?.images ??
          [
            buildComponentVisual({
              title: "SSD NVMe 256GB",
              subtitle: "PCIe 3.0",
              accent: "#06B6D4",
              kind: "storage",
            }),
          ],
        standard: true,
        summary: "Opção de entrada para sistema e jogos principais.",
        highlights: ["256GB", "NVMe", "M.2"],
      },
      {
        id: "storage-2",
        name: nvme512?.name ?? "SSD PCYES 512GB M.2 NVMe 2200MB/s",
        price: nvme512?.priceNum ?? 420,
        image:
          nvme512?.image ??
          buildComponentVisual({
            title: "SSD NVMe 512GB",
            subtitle: "2200MB/s",
            accent: "#0891B2",
            kind: "storage",
          }),
        gallery:
          nvme512?.images ??
          [
            buildComponentVisual({
              title: "SSD NVMe 512GB",
              subtitle: "2200MB/s",
              accent: "#0891B2",
              kind: "storage",
            }),
          ],
        summary: "Equilíbrio melhor para não lotar o armazenamento tão cedo.",
        highlights: ["512GB", "NVMe", "2200MB/s"],
      },
      {
        id: "storage-3",
        name: sata1tb?.name ?? "SSD PCYES 1TB SATA III 2.5",
        price: sata1tb?.priceNum ?? 550,
        image:
          sata1tb?.image ??
          buildComponentVisual({
            title: "SSD 1TB",
            subtitle: "SATA III",
            accent: "#14B8A6",
            kind: "storage",
          }),
        gallery:
          sata1tb?.images ??
          [
            buildComponentVisual({
              title: "SSD 1TB",
              subtitle: "SATA III",
              accent: "#14B8A6",
              kind: "storage",
            }),
          ],
        summary: "Mais espaço útil para biblioteca de jogos e arquivos.",
        highlights: ["1TB", "SATA III", "2.5 pol"],
      },
    ],
  },
  {
    id: "case",
    title: "Gabinete",
    icon: <Monitor className="h-4 w-4" />,
    options: [
      {
        id: "case-1",
        name: blackCase?.name ?? "Gabinete PCYES Forcefield Black Vulcan",
        price: blackCase?.priceNum ?? 600,
        image:
          blackCase?.image ??
          buildComponentVisual({
            title: "Forcefield Black",
            subtitle: "Black Vulcan",
            accent: "#D4D4D8",
            kind: "case",
          }),
        gallery:
          blackCase?.images ??
          [
            buildComponentVisual({
              title: "Forcefield Black",
              subtitle: "Black Vulcan",
              accent: "#D4D4D8",
              kind: "case",
            }),
          ],
        summary: "Visual mais sóbrio para setup escuro e discreto.",
        highlights: ["Black Vulcan", "Vidro temperado", "ATX"],
        type: "black",
      },
      {
        id: "case-2",
        name: whiteCase?.name ?? "Gabinete PCYES Forcefield White Ghost",
        price: whiteCase?.priceNum ?? 600,
        image:
          whiteCase?.image ??
          buildComponentVisual({
            title: "Forcefield White",
            subtitle: "White Ghost",
            accent: "#F5F5F5",
            kind: "case",
          }),
        gallery:
          whiteCase?.images ??
          [
            buildComponentVisual({
              title: "Forcefield White",
              subtitle: "White Ghost",
              accent: "#F5F5F5",
              kind: "case",
            }),
          ],
        standard: true,
        summary: "A leitura mais premium para o configurador, bem vitrificada.",
        highlights: ["White Ghost", "Vidro temperado", "ATX"],
        type: "white",
      },
      {
        id: "case-3",
        name: setCase?.name ?? "Gabinete PCYES Set Black Vulcan",
        price: setCase?.priceNum ?? 650,
        image:
          setCase?.image ??
          buildComponentVisual({
            title: "Set Black",
            subtitle: "Black Vulcan",
            accent: "#A855F7",
            kind: "case",
          }),
        gallery:
          setCase?.images ??
          [
            buildComponentVisual({
              title: "Set Black",
              subtitle: "Black Vulcan",
              accent: "#A855F7",
              kind: "case",
            }),
          ],
        summary: "Gabinete mais agressivo visualmente para build com presença.",
        highlights: ["Black Vulcan", "Vidro lateral", "Mid tower"],
        type: "rgb",
      },
    ],
  },
  {
    id: "psu",
    title: "Fonte de Alimentação",
    icon: <Zap className="h-4 w-4" />,
    options: [
      {
        id: "psu-1",
        name: "PCYES Spark 600W 80+ Bronze",
        price: 300,
        standard: true,
        summary: "Entrega suficiente para builds de entrada bem equilibradas.",
        highlights: ["600W", "80+ Bronze", "ATX"],
        image: buildComponentVisual({
          title: "Spark 600W",
          subtitle: "80+ Bronze",
          accent: "#F59E0B",
          kind: "psu",
        }),
        gallery: [
          buildComponentVisual({
            title: "Spark 600W",
            subtitle: "80+ Bronze",
            accent: "#F59E0B",
            kind: "psu",
          }),
        ],
      },
      {
        id: "psu-2",
        name: "PCYES Electro V2 750W 80+ Gold",
        price: 550,
        summary: "Ponto mais seguro para RTX 4070 SUPER e upgrades futuros.",
        highlights: ["750W", "80+ Gold", "PFC ativo"],
        image: buildComponentVisual({
          title: "Electro 750W",
          subtitle: "80+ Gold",
          accent: "#EAB308",
          kind: "psu",
        }),
        gallery: [
          buildComponentVisual({
            title: "Electro 750W",
            subtitle: "80+ Gold",
            accent: "#EAB308",
            kind: "psu",
          }),
        ],
      },
      {
        id: "psu-3",
        name: "PCYES Electro V2 850W 80+ Gold",
        price: 650,
        summary: "Margem extra para GPUs fortes e build com mais ventoinhas.",
        highlights: ["850W", "80+ Gold", "ATX"],
        image: buildComponentVisual({
          title: "Electro 850W",
          subtitle: "80+ Gold",
          accent: "#FACC15",
          kind: "psu",
        }),
        gallery: [
          buildComponentVisual({
            title: "Electro 850W",
            subtitle: "80+ Gold",
            accent: "#FACC15",
            kind: "psu",
          }),
        ],
      },
      {
        id: "psu-4",
        name: "PCYES Titan 1000W 80+ Platinum",
        price: 1200,
        summary: "Escolha topo para 4090 e configuração sem gargalo de energia.",
        highlights: ["1000W", "80+ Platinum", "High-end"],
        image: buildComponentVisual({
          title: "Titan 1000W",
          subtitle: "80+ Platinum",
          accent: "#E5E7EB",
          kind: "psu",
        }),
        gallery: [
          buildComponentVisual({
            title: "Titan 1000W",
            subtitle: "80+ Platinum",
            accent: "#E5E7EB",
            kind: "psu",
          }),
        ],
      },
    ],
  },
  {
    id: "peripherals",
    title: "Periféricos",
    icon: <Settings className="h-4 w-4" />,
    options: [
      {
        id: "peripherals-1",
        name: "Sem periféricos adicionais",
        price: 0,
        standard: true,
        summary: "Mantém o configurador focado só na torre e componentes internos.",
        highlights: ["Sem extra", "Mais enxuto"],
        image: buildComponentVisual({
          title: "Sem periféricos",
          subtitle: "Somente a máquina",
          accent: "#6B7280",
          kind: "peripheral",
        }),
        gallery: [
          buildComponentVisual({
            title: "Sem periféricos",
            subtitle: "Somente a máquina",
            accent: "#6B7280",
            kind: "peripheral",
          }),
        ],
      },
      {
        id: "peripherals-2",
        name: "Teclado PCYES Kuromori Black Vulcan",
        price: keyboardBlack?.priceNum ?? 400,
        image:
          keyboardBlack?.image ??
          buildComponentVisual({
            title: "Kuromori",
            subtitle: "Black Vulcan",
            accent: "#F87171",
            kind: "peripheral",
          }),
        gallery:
          keyboardBlack?.images ??
          [
            buildComponentVisual({
              title: "Kuromori",
              subtitle: "Black Vulcan",
              accent: "#F87171",
              kind: "peripheral",
            }),
          ],
        summary: "Teclado mecânico mais próximo da linguagem visual do site atual.",
        highlights: ["Blue Switch", "Mecânico", "ABNT2"],
      },
      {
        id: "peripherals-3",
        name: "Combo Kuromori + Basaran",
        price: (keyboardWhite?.priceNum ?? 400) + (mouseBlack?.priceNum ?? 250),
        image:
          keyboardWhite?.image ??
          buildComponentVisual({
            title: "Combo PCYES",
            subtitle: "Teclado + mouse",
            accent: "#22D3EE",
            kind: "peripheral",
          }),
        gallery:
          keyboardWhite?.images ??
          [
            buildComponentVisual({
              title: "Combo PCYES",
              subtitle: "Teclado + mouse",
              accent: "#22D3EE",
              kind: "peripheral",
            }),
          ],
        summary: "Entrega uma escolha pronta para quem quer setup completo.",
        highlights: ["Teclado", "Mouse RGB", "White Ghost"],
      },
    ],
  },
];

interface AmbientConfig {
  bg: string;
  glow: string;
}

const getAmbient = (type?: string): AmbientConfig => {
  switch (type) {
    case "white":
      return {
        bg: "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.12), transparent 28%), radial-gradient(circle at 78% 18%, rgba(255,255,255,0.08), transparent 24%), linear-gradient(180deg, #171717 0%, #090909 100%)",
        glow: "rgba(255,255,255,0.14)",
      };
    case "rgb":
      return {
        bg: "radial-gradient(circle at 18% 16%, rgba(139,92,246,0.22), transparent 28%), radial-gradient(circle at 82% 18%, rgba(6,182,212,0.16), transparent 22%), linear-gradient(180deg, #12091d 0%, #080808 100%)",
        glow: "rgba(139,92,246,0.26)",
      };
    default:
      return {
        bg: "radial-gradient(circle at 22% 14%, rgba(255,255,255,0.07), transparent 26%), radial-gradient(circle at 82% 16%, rgba(255,255,255,0.04), transparent 20%), linear-gradient(180deg, #141414 0%, #080808 100%)",
        glow: "rgba(255,255,255,0.09)",
      };
  }
};

export function MonteSeuPcPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const previewRef = useRef<HTMLDivElement>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  const [selections, setSelections] = useState<Record<string, string>>({
    cpu: "cpu-1",
    motherboard: "mb-1",
    ram: "ram-1",
    gpu: "gpu-1",
    cooling: "cooling-1",
    storage: "storage-1",
    case: "case-2",
    psu: "psu-1",
    peripherals: "peripherals-1",
  });
  const [activeCategory, setActiveCategory] = useState<string>("cpu");
  const [expandedCategory, setExpandedCategory] = useState<string>("cpu");
  const [activeView, setActiveView] = useState(0);
  const [actionFeedback, setActionFeedback] = useState("");

  const categoriesWithSelected = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        selectedOption: category.options.find((option) => option.id === selections[category.id]),
      })),
    [selections],
  );

  const currentCategory = categoriesWithSelected.find((category) => category.id === activeCategory);
  const currentPreviewOption = currentCategory?.selectedOption ?? categoriesWithSelected.find((category) => category.id === "case")?.selectedOption;
  const currentGallery =
    currentPreviewOption?.gallery?.length
      ? currentPreviewOption.gallery
      : currentPreviewOption?.image
        ? [currentPreviewOption.image]
        : [];

  const currentCase = categoriesWithSelected.find((category) => category.id === "case")?.selectedOption;
  const ambient = useMemo(() => getAmbient(currentCase?.type), [currentCase?.type]);

  const priceBreakdown = useMemo(() => {
    let base = 0;
    let equipment = 0;

    Object.entries(selections).forEach(([categoryId, optionId]) => {
      const category = categories.find((item) => item.id === categoryId);
      const option = category?.options.find((item) => item.id === optionId);
      if (!option) return;

      if (option.standard) base += option.price;
      else equipment += option.price;
    });

    return { base, equipment, total: base + equipment };
  }, [selections]);

  const configurationName = useMemo(() => {
    const caseName = currentCase?.name ?? "PCYES Custom";
    return `${caseName} · Build personalizada`;
  }, [currentCase?.name]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CONFIG_STORAGE_KEY);
      if (!raw) return;

      const savedSelections = JSON.parse(raw) as Record<string, string>;
      if (!savedSelections || typeof savedSelections !== "object") return;
      setSelections((prev) => ({ ...prev, ...savedSelections }));
    } catch {
      // Ignore invalid saved data.
    }
  }, []);

  useEffect(() => {
    setSelections((prev) => {
      let changed = false;
      const next = { ...prev };

      categories.forEach((category) => {
        const selected = category.options.find((option) => option.id === next[category.id]);
        if (!selected) return;

        if (selected.req && !selected.req.includes(next.cpu)) {
          const fallback = category.options.find((option) => !option.req || option.req.includes(next.cpu));
          if (fallback) {
            next[category.id] = fallback.id;
            changed = true;
          }
        }
      });

      return changed ? next : prev;
    });
  }, [selections.cpu]);

  useEffect(() => {
    setActiveView(0);
  }, [activeCategory, currentPreviewOption?.id]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const pushFeedback = (message: string) => {
    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    setActionFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => {
      setActionFeedback("");
      feedbackTimerRef.current = null;
    }, 2400);
  };

  const getVisibleOptions = (category: Category) =>
    category.options.filter((option) => !option.req || option.req.includes(selections.cpu));

  const handleSelect = (categoryId: string, optionId: string) => {
    setSelections((prev) => ({ ...prev, [categoryId]: optionId }));
    setActiveCategory(categoryId);

    const currentIndex = categories.findIndex((category) => category.id === categoryId);
    const nextCategory = categories[currentIndex + 1];
    if (nextCategory) {
      setExpandedCategory(nextCategory.id);
      setActiveCategory(nextCategory.id);
    }
  };

  const toggleSection = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? "" : categoryId));
    setActiveCategory(categoryId);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate("/produtos");
  };

  const handleSave = () => {
    window.localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(selections));
    pushFeedback("Configuração salva");
  };

  const handleShare = async () => {
    const shareData = {
      title: configurationName,
      text: `Confira esta configuração PCYES em ${formatCurrency(priceBreakdown.total)}.`,
      url: window.location.href,
    };

    try {
      if (navigator.share) await navigator.share(shareData);
      else if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(window.location.href);
      pushFeedback("Link pronto para compartilhar");
    } catch {
      pushFeedback("Compartilhamento cancelado");
    }
  };

  const handleFullscreen = async () => {
    if (!previewRef.current) return;

    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await previewRef.current.requestFullscreen();
    } catch {
      pushFeedback("Tela cheia indisponível");
    }
  };

  const handleAddToCart = () => {
    const cartKey = `pc-builder-${Object.entries(selections)
      .map(([categoryId, optionId]) => `${categoryId}:${optionId}`)
      .join("|")}`;

    addItem({
      cartKey,
      id: 900001,
      name: configurationName,
      price: formatCurrency(priceBreakdown.total),
      image: currentCase?.image ?? currentPreviewOption?.image ?? "",
    });

    pushFeedback("Configuração adicionada ao carrinho");
  };

  return (
    <div className="bg-[#080808] pt-[92px] text-[#f5f5f5]">
      <header className="sticky top-[92px] z-40 border-b border-white/[0.06] bg-[#090909]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1920px] items-center justify-between gap-4 px-4 py-3 md:px-6 lg:px-8">
          <div className="flex items-center gap-2 md:gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 rounded-full px-3 text-sm text-zinc-300 hover:bg-white/[0.06] hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="gap-2 rounded-full px-3 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white"
            >
              <Save className="h-4 w-4" />
              <span className="hidden sm:inline">Salvar</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="gap-2 rounded-full px-3 text-sm text-zinc-400 hover:bg-white/[0.06] hover:text-white"
            >
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Compartilhar</span>
            </Button>
          </div>

          <div className="hidden text-center md:block">
            <p className="text-sm font-semibold tracking-[0.18em] text-zinc-100">
              MONTE SEU PC
              <span className="ml-2 text-xs font-normal tracking-[0.12em] text-zinc-500">PCYES</span>
            </p>
            {actionFeedback && <p className="mt-1 text-[11px] text-zinc-400">{actionFeedback}</p>}
          </div>

          <div className="text-right">
            <p className="text-lg font-bold tabular-nums">{formatCurrency(priceBreakdown.total)}</p>
            <p className="text-[10px] text-zinc-500">Valores não incluem frete</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-[1920px] flex-col gap-0 md:items-start md:flex-row">
        <section className="border-b border-white/[0.05] md:sticky md:top-[151px] md:h-[calc(100vh-151px)] md:w-[63%] md:self-start md:border-b-0 md:border-r md:border-white/[0.04]">
          <div className="flex h-full flex-col px-4 pb-6 pt-4 md:px-6 md:pb-8 lg:px-8">
            <div
              ref={previewRef}
              className="relative min-h-[420px] flex-1 overflow-hidden rounded-[28px] border border-white/[0.06] shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
              style={{ background: ambient.bg }}
            >
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px] transition-all duration-700 md:h-[480px] md:w-[480px]"
                style={{ backgroundColor: ambient.glow }}
              />

              {currentGallery[activeView] ? (
                <img
                  src={currentGallery[activeView]}
                  alt={currentPreviewOption?.name ?? "Prévia da configuração"}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-500"
                />
              ) : (
                <div className="absolute inset-0 animate-pulse bg-white/[0.04]" />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/50" />

              <button
                type="button"
                onClick={handleFullscreen}
                className="absolute right-5 top-5 z-20 rounded-2xl border border-white/10 bg-black/35 p-3 text-zinc-100 transition hover:bg-black/55"
                aria-label="Abrir em tela cheia"
              >
                <Expand className="h-4 w-4" />
              </button>

              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-5 pt-20 md:px-7 md:pb-7">
                <div className="max-w-[560px]">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-400">{currentCategory?.title ?? "Configuração"}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white md:text-[32px]">{currentPreviewOption?.name ?? configurationName}</h2>
                  {currentPreviewOption?.summary && <p className="mt-2 max-w-[46ch] text-sm text-zinc-300 md:text-[15px]">{currentPreviewOption.summary}</p>}
                  {currentPreviewOption?.highlights && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentPreviewOption.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[11px] text-zinc-200"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {currentGallery.length > 1 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {currentGallery.map((image, index) => (
                  <button
                    key={`${currentPreviewOption?.id ?? "preview"}-${index}`}
                    type="button"
                    onClick={() => setActiveView(index)}
                    className={cn(
                      "h-20 w-24 overflow-hidden rounded-2xl border transition",
                      activeView === index
                        ? "border-white/30 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                        : "border-white/[0.08] opacity-70 hover:border-white/20 hover:opacity-100",
                    )}
                  >
                    <img src={image} alt={`${currentPreviewOption?.name ?? "Prévia"} ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        <aside className="w-full md:w-[37%] md:self-start">
          <div className="px-5 py-6 md:px-6 lg:px-7">
            <div className="mb-6">
              <h1 className="text-[28px] font-semibold tracking-tight text-white">Monte seu PC</h1>
              <p className="mt-1 text-sm text-zinc-500">
                O fluxo da escolha fica aqui na direita. Abrimos uma etapa por vez, com imagem e contexto de cada item.
              </p>
            </div>

            <div className="space-y-3">
              {categoriesWithSelected.map((category) => {
                const isOpen = expandedCategory === category.id;
                const visibleOptions = getVisibleOptions(category);
                const hasSelection = Boolean(category.selectedOption);

                return (
                  <div
                    key={category.id}
                    className={cn(
                      "overflow-hidden rounded-[24px] border bg-white/[0.02] transition-colors",
                      hasSelection
                        ? "border-emerald-500/18 bg-emerald-500/[0.03]"
                        : "border-white/[0.06]",
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(category.id)}
                      className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left md:px-5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={cn(
                            "flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border",
                            hasSelection
                              ? "border-emerald-500/30 bg-emerald-500/[0.07]"
                              : "border-white/[0.06] bg-white/[0.05] text-zinc-400",
                          )}
                        >
                          {category.selectedOption?.image ? (
                            <img
                              src={category.selectedOption.image}
                              alt={category.selectedOption.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            category.icon
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-base font-semibold text-white">{category.title}</p>
                          {category.selectedOption && (
                            <p className="mt-1 truncate text-sm text-zinc-500">{category.selectedOption.name}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {category.selectedOption && (
                          <span
                            className={cn(
                              "text-sm tabular-nums",
                              hasSelection ? "text-emerald-400/95" : "text-zinc-300",
                            )}
                          >
                            {category.selectedOption.standard
                              ? "Equipamento de série"
                              : `+ ${formatCurrency(category.selectedOption.price)}`}
                          </span>
                        )}
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-zinc-500 transition-transform duration-200",
                            isOpen && "rotate-180",
                          )}
                        />
                      </div>
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300",
                        isOpen ? "max-h-[2400px] opacity-100" : "max-h-0 opacity-0",
                      )}
                    >
                      <div className="border-t border-white/[0.05] px-4 py-4 md:px-5">
                        <div className="grid gap-3">
                          {visibleOptions.map((option) => {
                            const selected = selections[category.id] === option.id;

                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => handleSelect(category.id, option.id)}
                                className={cn(
                                  "group relative flex items-start gap-3 rounded-[22px] border p-3.5 text-left transition-all duration-200 md:p-4",
                                  selected
                                    ? "border-white/20 bg-white/[0.05] shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
                                    : "border-white/[0.07] bg-transparent hover:border-white/[0.14] hover:bg-white/[0.02]",
                                )}
                              >
                                <div className="h-20 w-24 shrink-0 overflow-hidden rounded-[18px] bg-white/[0.04]">
                                  {option.image ? (
                                    <img src={option.image} alt={option.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-white/[0.03] text-zinc-600">
                                      {category.icon}
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-start justify-between gap-3">
                                    <div>
                                      <span className="block text-sm font-semibold leading-snug text-zinc-100">
                                        {option.name}
                                      </span>
                                      {option.summary && (
                                        <p className="mt-1 text-sm leading-relaxed text-zinc-400">{option.summary}</p>
                                      )}
                                    </div>

                                    {selected && (
                                      <div className="shrink-0 rounded-full bg-white/12 p-1">
                                        <Check className="h-3.5 w-3.5 text-white" />
                                      </div>
                                    )}
                                  </div>

                                  {option.highlights && option.highlights.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1.5">
                                      {option.highlights.map((highlight) => (
                                        <span
                                          key={highlight}
                                          className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] text-zinc-300"
                                        >
                                          {highlight}
                                        </span>
                                      ))}
                                    </div>
                                  )}

                                  <div className="mt-3 flex items-center justify-between">
                                    <span
                                      className={cn(
                                        "text-sm tabular-nums",
                                        option.standard ? "text-emerald-400/85" : "text-zinc-200",
                                      )}
                                    >
                                      {option.standard ? "Equipamento de série" : `+ ${formatCurrency(option.price)}`}
                                    </span>
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[28px] border border-white/[0.06] bg-white/[0.02] p-5 md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">Resumo</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Sua configuração</h2>
                </div>
                <div className="text-right">
                  <p className="text-sm text-zinc-500">Total</p>
                  <p className="text-2xl font-semibold text-white">{formatCurrency(priceBreakdown.total)}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {categoriesWithSelected.map((category) => {
                  if (!category.selectedOption) return null;

                  return (
                    <div
                      key={`summary-${category.id}`}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.06] bg-black/20 px-3 py-3"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="h-12 w-14 shrink-0 overflow-hidden rounded-xl bg-white/[0.04]">
                          {category.selectedOption.image && (
                            <img
                              src={category.selectedOption.image}
                              alt={category.selectedOption.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs uppercase tracking-[0.12em] text-zinc-500">{category.title}</p>
                          <p className="truncate text-sm font-medium text-zinc-100">{category.selectedOption.name}</p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm tabular-nums text-zinc-300">
                        {category.selectedOption.standard ? "Série" : formatCurrency(category.selectedOption.price)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Button
                type="button"
                onClick={handleAddToCart}
                className="mt-6 h-14 w-full rounded-2xl bg-white text-base font-semibold text-black transition hover:bg-white/90"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Adicionar ao Carrinho
              </Button>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  );
}
