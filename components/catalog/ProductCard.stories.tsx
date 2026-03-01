/* eslint-disable storybook/no-renderer-packages */
import type { Meta, StoryObj } from "@storybook/react";
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/products";

const sampleProduct: Product = {
  id: "1",
  slug: "aurora-chair",
  title: {
    en: "Aurora Chair",
    hi: "अरोरा कुर्सी",
  },
  description: {
    en: "A premium ergonomic chair.",
    hi: "एक प्रीमियम एर्गोनोमिक कुर्सी।",
  },
  priceCents: 12900,
  category: "Chair",
  tags: ["Office", "Ergonomic"],
  thumbnailSrc: "/poster/aurora-chair-poster.webp",
};

const meta: Meta<typeof ProductCard> = {
  title: "Catalog/ProductCard",
  component: ProductCard,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

export const Default: Story = {
  args: {
    product: sampleProduct,
  },
  render: (args) => (
    <div className="w-80">
      <ProductCard {...args} />
    </div>
  ),
};
