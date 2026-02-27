export type ProductCategory = "Chair" | "Lamp" | "Desk";

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProductCategory;
  priceCents: number;
  tags: string[];
  thumbnailSrc: string;
};

export const PRODUCTS: Product[] = [];

