import Image from "next/image";
import PN_SearchBar from "./SubComps/PN_SearchBar";
import CategorySlider from "../CategorySlider/CategorySlider";
import BannerSwiper from "../BannerSwiper/BannerSwiper";
import { HeartIcon } from "@heroicons/react/24/solid";
import { ListFilter, Sun, Moon, Monitor, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";

const PrimaryNav = ({
  companyInfo,
  activeCategory,
  activeCategoryCallback,
  openAboutUsModalCallback,
  openFiltersModalCallback,
  openWishlistCallback,
  isDisabled = false,
}) => {
  const { theme, setTheme, actualTheme } = useTheme();
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "auto", label: "Auto", icon: Monitor },
  ];

  function categoryChangedCallback(categoryName) {
    activeCategoryCallback(categoryName);
  }

  function requestOpenAboutUsModalCallback() {
    openAboutUsModalCallback();
  }

  function handleThemeChange(mode) {
    setTheme(mode);
    setShowThemeDropdown(false);
  }

  return (
    <>
      {/* Brand Section - Always Sticky */}
      <section className="sticky top-0 flex flex-col justify-center items-center w-full pt-4 pb-2 bg-white dark:bg-black z-40">
        <div className="flex flex-col md:flex-row justify-center items-center w-full max-w-full gap-4 px-4">
          {/* Brand Section */}
          <section className="flex gap-4 w-full md:w-[80%] items-center justify-between">
            <div className="flex gap-4 items-center">
              {/* Logo Div */}
              <div className="rounded-lg overflow-clip aspect-square h-14 relative shadow-inner">
                <Image
                  src={companyInfo.companyLogo}
                  blurDataURL={companyInfo.companyLogo}
                  alt="Company Logo"
                  quality={100}
                  fill
                  style={{ objectFit: "cover" }}
                  placeholder="blur"
                />
              </div>

              {/* Name & About Div */}
              <div>
                <h1 className="font-medium text-lg text-black dark:text-white">{companyInfo.companyName}</h1>
                <button
                  className="px-2 py-[4px] bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 font-normal text-xs rounded-md transition-colors"
                  onClick={() => requestOpenAboutUsModalCallback()}
                >
                  About Us
                </button>
              </div>
            </div>

            {/* Right Side: Wishlist + Theme */}
            <div className="flex items-center gap-2">
              {/* Wishlist Button - Desktop Only */}
              <button
                className="hidden lg:flex items-center justify-center px-3 py-1.5 gap-1.5 text-sm text-black dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-full transition-colors"
                onClick={() => openWishlistCallback()}
                disabled={isDisabled}
              >
                <HeartIcon className="w-4 h-4" />
                <span className="text-xs">Wishlist</span>
              </button>

              {/* Theme Mode Dropdown */}
              <div className="relative">
                <button
                  className="flex items-center justify-center px-3 py-1.5 gap-1.5 text-sm text-black dark:text-white bg-transparent border border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 rounded-full transition-colors"
                  onClick={() => setShowThemeDropdown(!showThemeDropdown)}
                >
                  {theme === "light" && <Sun className="w-3.5 h-3.5" />}
                  {theme === "dark" && <Moon className="w-3.5 h-3.5" />}
                  {theme === "auto" && <Monitor className="w-3.5 h-3.5" />}
                  <span className="capitalize text-xs">{theme}</span>
                  <ChevronDown className="w-3 h-3" />
                </button>

                {/* Dropdown Menu */}
                {showThemeDropdown && (
                  <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-[#1A1A1A] border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                    {themeOptions.map((option) => {
                      const Icon = option.icon;
                      return (
                        <button
                          key={option.value}
                          className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors ${theme === option.value
                            ? "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`}
                          onClick={() => handleThemeChange(option.value)}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{option.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Banner Swiper - Scrolls Away */}
      <BannerSwiper />
    </>
  );
};

export default PrimaryNav;
