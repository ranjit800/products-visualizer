// Demo data for dynamic product sections
// This will be replaced with actual API data from company endpoint

export const demoProductSections = {
    enabled: true, // Company can enable/disable sections
    sections: [
        {
            id: 1,
            title: "Deals for you",
            enabled: true,
            showSeeAll: true,
            maxCards: 6, // Number of products to show
            order: 1,
            // Will use first 6 products from catalogue
            productIds: "first-6"
        },
        {
            id: 2,
            title: "New Arrivals",
            enabled: true,
            showSeeAll: true,
            maxCards: 4,
            order: 2,
            // Will use products 7-10 from catalogue
            productIds: "next-4"
        }
    ]
};

// Helper function to get products for a section
export const getSectionProducts = (section, catalogue) => {
    if (!catalogue || catalogue.length === 0) return [];

    if (section.productIds === "first-6") {
        return catalogue.slice(0, 6);
    } else if (section.productIds === "next-4") {
        return catalogue.slice(6, 10);
    } else if (Array.isArray(section.productIds)) {
        // Future: when API provides specific product IDs
        return catalogue.filter(product =>
            section.productIds.includes(product.productID)
        );
    }

    return [];
};

// Future API structure will look like:
// GET /api/company/{companyId}
// Response: {
//   company: {...},
//   catalogue: [...],
//   categories: [...],
//   swiper: {...},
//   productSections: {
//     enabled: true,
//     sections: [...]
//   }
// }
