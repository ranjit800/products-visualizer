"use client";

import { useRouter } from "next/navigation";
import PG_Card from "../ProductGrid/SubComps/PG_Card";

const ProductSection = ({
    section,
    products,
    wishlistData,
    onWishlistChange
}) => {
    const router = useRouter();

    if (!section || !section.enabled || !products || products.length === 0) {
        return null;
    }

    const handleSeeAll = () => {
        // Future: Navigate to a filtered view or category
        console.log(`See all for section: ${section.title}`);
    };

    return (
        <section className="w-full px-4 py-6">
            {/* Section Header */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl md:text-2xl font-bold text-black dark:text-white">
                    {section.title}
                </h2>
                {section.showSeeAll && (
                    <button
                        onClick={handleSeeAll}
                        className="text-sm md:text-base font-medium text-tif-blue hover:text-tif-blue/80 transition-colors"
                    >
                        See All
                    </button>
                )}
            </div>

            {/* Product Cards - Horizontal Scroll */}
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
                {products.slice(0, section.maxCards).map((product) => (
                    <div
                        key={product.productID}
                        className="flex-shrink-0 w-[160px] md:w-[200px]"
                    >
                        <PG_Card
                            productInfo={product}
                            wishlistData={wishlistData}
                            show3D={false}
                            onWishlistChange={onWishlistChange}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductSection;
