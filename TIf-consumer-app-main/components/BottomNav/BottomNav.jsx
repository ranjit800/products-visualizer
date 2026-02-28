"use client";

import { usePathname, useRouter } from "next/navigation";
import { Heart, Home, Grid3x3, Search } from "lucide-react";
import { useState } from "react";

const BottomNav = ({
  onWishlistClick,
  onCategoryClick,
  onSearchClick,
  activeCompanyID,
  companyURL,
}) => {
  const pathname = usePathname();
  const router = useRouter();

  // Helper to check if we are on the home page of the company
  const isHome = pathname === `/${companyURL}`;
  const isWishlist = pathname.includes("/wishlist");
  const isSearch = pathname.includes("/search");
  const isCategory = pathname.includes("/category");

  const handleHomeClick = () => {
    if (!isHome) {
      router.push(`/${companyURL}`);
    }
  };

  const handleWishlistClick = () => {
    if (onWishlistClick) {
      onWishlistClick();
    } else {
      // Fallback if no callback provided (e.g. from Wishlist page)
      router.push(`/${companyURL}/wishlist`);
    }
  };

  const handleCategoryClick = () => {
    if (onCategoryClick) {
      onCategoryClick();
    } else {
      // Navigate to category page
      router.push(`/${companyURL}/category`);
    }
  };

  const handleSearchClick = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      // Navigate to search page
      router.push(`/${companyURL}/search`);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40  border-t border-gray-800 lg:hidden">
      <div className="flex items-center justify-around h-[8vh] px-2 bg-[#161616] backdrop-blur-xl">
     

        {/* Home */}
        <button
          onClick={handleHomeClick}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${isHome && !isWishlist
            ? "text-white"
            : "text-gray-500 hover:text-gray-300"
            }`}
          aria-label="Home"
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-medium">Home</span>
        </button>

        {/* Category */}
        <button
          onClick={handleCategoryClick}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${isCategory ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          aria-label="Category"
        >
          <Grid3x3 className="w-6 h-6" />
          <span className="text-xs font-medium">Category</span>
        </button>

        {/* Search */}
        <button
          onClick={handleSearchClick}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${isSearch ? "text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          aria-label="Search"
        >
          <Search className="w-6 h-6" />
          <span className="text-xs font-medium">Search</span>
        </button>

           {/* Wishlist */}
        <button
          onClick={handleWishlistClick}
          className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${isWishlist
            ? "text-white"
            : "text-gray-500 hover:text-gray-300"
            }`}
          aria-label="Wishlist"
        >
          <Heart className="w-6 h-6" fill={isWishlist ? "currentColor" : "none"} />
          <span className="text-xs font-medium">Wishlist</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;


