import type { Locale } from "@/lib/i18n";

export type ProductCategory = "Chair" | "Lamp" | "Desk";

export type Product = {
  id: string;
  slug: string;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  category: ProductCategory;
  priceCents: number;
  tags: string[];
  thumbnailSrc: string;
};

export const PRODUCTS: Product[] = [
  {
    id: "chair-aurora",
    slug: "aurora-chair",
    title: { en: "Aurora Chair", hi: "ऑरोरा कुर्सी" },
    description: {
      en: "A minimalist chair with soft curves and a sturdy frame.",
      hi: "नरम घुमाव और मज़बूत फ्रेम वाली मिनिमलिस्ट कुर्सी।",
    },
    category: "Chair",
    priceCents: 12999,
    tags: ["minimal", "indoor"],
    thumbnailSrc: "/images/products/aurora-chair.svg",
  },
  {
    id: "chair-ember",
    slug: "ember-chair",
    title: { en: "Ember Chair", hi: "एम्बर कुर्सी" },
    description: {
      en: "Comfort-first seating with a warm, modern silhouette.",
      hi: "गर्म आधुनिक डिज़ाइन के साथ आरामदायक सीटिंग।",
    },
    category: "Chair",
    priceCents: 14999,
    tags: ["comfort", "indoor"],
    thumbnailSrc: "/images/products/ember-chair.svg",
  },
  {
    id: "chair-orbit",
    slug: "orbit-chair",
    title: { en: "Orbit Chair", hi: "ऑर्बिट कुर्सी" },
    description: {
      en: "Compact chair designed for small spaces and big style.",
      hi: "छोटी जगहों के लिए कॉम्पैक्ट और स्टाइलिश कुर्सी।",
    },
    category: "Chair",
    priceCents: 10999,
    tags: ["compact", "minimal"],
    thumbnailSrc: "/images/products/orbit-chair.svg",
  },
  {
    id: "lamp-lumen",
    slug: "lumen-lamp",
    title: { en: "Lumen Lamp", hi: "ल्यूमेन लैम्प" },
    description: {
      en: "A clean desk lamp with focused light and soft diffusion.",
      hi: "फोकस्ड लाइट और सॉफ्ट डिफ्यूज़न वाला डेस्क लैम्प।",
    },
    category: "Lamp",
    priceCents: 6999,
    tags: ["desk", "minimal"],
    thumbnailSrc: "/images/products/lumen-lamp.svg",
  },
  {
    id: "lamp-halo",
    slug: "halo-lamp",
    title: { en: "Halo Lamp", hi: "हेलो लैम्प" },
    description: {
      en: "Ambient lighting with a gentle ring glow.",
      hi: "सॉफ्ट रिंग ग्लो के साथ एंबियंट लाइटिंग।",
    },
    category: "Lamp",
    priceCents: 8999,
    tags: ["ambient", "indoor"],
    thumbnailSrc: "/images/products/halo-lamp.svg",
  },
  {
    id: "lamp-arc",
    slug: "arc-lamp",
    title: { en: "Arc Lamp", hi: "आर्क लैम्प" },
    description: {
      en: "A floor lamp with an arched arm and warm presence.",
      hi: "आर्च्ड आर्म वाला फ्लोर लैम्प और वॉर्म प्रेज़ेंस।",
    },
    category: "Lamp",
    priceCents: 15999,
    tags: ["floor", "warm"],
    thumbnailSrc: "/images/products/arc-lamp.svg",
  },
  {
    id: "desk-summit",
    slug: "summit-desk",
    title: { en: "Summit Desk", hi: "समिट डेस्क" },
    description: {
      en: "A sturdy desk built for focused work and clean cable routing.",
      hi: "फोकस्ड काम और साफ़ केबल रूटिंग के लिए मज़बूत डेस्क।",
    },
    category: "Desk",
    priceCents: 24999,
    tags: ["work", "minimal"],
    thumbnailSrc: "/images/products/summit-desk.svg",
  },
  {
    id: "desk-drift",
    slug: "drift-desk",
    title: { en: "Drift Desk", hi: "ड्रिफ्ट डेस्क" },
    description: {
      en: "A compact desk that fits neatly into modern rooms.",
      hi: "आधुनिक कमरों में आसानी से फिट होने वाला कॉम्पैक्ट डेस्क।",
    },
    category: "Desk",
    priceCents: 19999,
    tags: ["compact", "work"],
    thumbnailSrc: "/images/products/drift-desk.svg",
  },
  {
    id: "desk-atlas",
    slug: "atlas-desk",
    title: { en: "Atlas Desk", hi: "एटलस डेस्क" },
    description: {
      en: "Wide surface area with a premium, durable finish.",
      hi: "प्रीमियम और टिकाऊ फिनिश के साथ चौड़ी सतह।",
    },
    category: "Desk",
    priceCents: 29999,
    tags: ["premium", "work"],
    thumbnailSrc: "/images/products/atlas-desk.svg",
  },
];

export type ProductQuery = {
  category?: ProductCategory;
  tag?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  page?: number;
  pageSize?: number;
};

export function queryProducts(query: ProductQuery) {
  const {
    category,
    tag,
    minPriceCents,
    maxPriceCents,
    page = 1,
    pageSize = 6,
  } = query;

  let items = PRODUCTS.slice();

  if (category) items = items.filter((p) => p.category === category);
  if (tag) items = items.filter((p) => p.tags.includes(tag));
  if (typeof minPriceCents === "number") items = items.filter((p) => p.priceCents >= minPriceCents);
  if (typeof maxPriceCents === "number") items = items.filter((p) => p.priceCents <= maxPriceCents);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const paged = items.slice(start, start + pageSize);

  return {
    items: paged,
    total,
    totalPages,
    page: safePage,
    pageSize,
  };
}

export function getAllCategories(): ProductCategory[] {
  return ["Chair", "Lamp", "Desk"];
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const p of PRODUCTS) for (const tag of p.tags) set.add(tag);
  return Array.from(set).sort();
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getAllSlugs(): string[] {
  return PRODUCTS.map((p) => p.slug);
}

export function formatPriceCents(priceCents: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(priceCents / 100);
}
