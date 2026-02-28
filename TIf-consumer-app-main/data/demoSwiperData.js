// Demo data structure that mimics future API response
// This will be replaced with actual API data from company endpoint

export const demoSwiperData = {
    enabled: true, // Company can enable/disable swiper
    autoplayDelay: 3000, // Configurable autoplay delay
    banners: [
        {
            id: 1,
            title: "Summer Sale",
            imageUrl: "/Temimg/offer1.png",
            link: null, // Optional: link to specific product/category
            active: true,
            order: 1
        },
        {
            id: 2,
            title: "New Collection",
            imageUrl: "/Temimg/offer2.png",
            link: null,
            active: true,
            order: 2
        },
        {
            id: 3,
            title: "Special Offer",
            imageUrl: "/Temimg/offer1.png",
            link: null,
            active: true,
            order: 3
        },
        {
            id: 4,
            title: "Limited Edition",
            imageUrl: "/Temimg/offer2.png",
            link: null,
            active: true,
            order: 4
        },
        
    ]
};

// Future API structure will look like:
// GET /api/company/{companyId}
// Response: {
//   company: {...},
//   catalogue: [...],
//   categories: [...],
//   swiper: {
//     enabled: true,
//     autoplayDelay: 3000,
//     banners: [...]
//   }
// }
