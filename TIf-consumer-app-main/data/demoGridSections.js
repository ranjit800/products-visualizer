// Demo data for OnDemandGrid component
// This will be replaced with actual API data from company endpoint

export const demoGridSections = {
    enabled: true,
    sections: [
        {
            id: 1,
            title: "Feature Product",
            enabled: true,
            showSeeAll: true,
            maxCards: 4, // Grid shows 2x2 = 4 products
            order: 1,
            layout: "grid", // 2x2 grid layout
            productIds: "first-4"
        },
        {
            id: 2,
            title: "Top Picks",
            enabled: true,
            showSeeAll: true,
            maxCards: 4,
            order: 2,
            layout: "grid",
            productIds: "next-4"
        }
    ]
};

// Helper function to get products for grid sections
export const getGridSectionProducts = (section, catalogue) => {
    if (!catalogue || catalogue.length === 0) return [];

    if (section.productIds === "first-4") {
        return catalogue.slice(0, 4);
    } else if (section.productIds === "next-4") {
        return catalogue.slice(4, 8);
    } else if (Array.isArray(section.productIds)) {
        // Future: when API provides specific product IDs
        return catalogue.filter(product =>
            section.productIds.includes(product.productID)
        );
    }

    return [];
};
