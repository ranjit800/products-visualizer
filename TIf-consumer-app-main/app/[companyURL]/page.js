"use client";

import { useState, useEffect, useMemo } from "react";
import PrimaryNav from "@/components/PrimaryNav/PrimaryNav";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import OnDemandSlider from "@/components/OnDemandSections/OnDemandSlider";
import OnDemandGrid from "@/components/OnDemandSections/OnDemandGrid";
import CategorySlider from "@/components/CategorySlider/CategorySlider";
import useCompany from "@/hooks/useCompany";
import ModalAbout from "@/components/ModalAbout/ModalAbout";
import ModalFilters from "@/components/ModalFilters/ModalFilters";
import ModalWishlist from "@/components/ModalWishlist/ModalWishlist";
import BottomNav from "@/components/BottomNav/BottomNav";
import { LoadWishlist } from "@/utils/wishlistUtils";
import { demoProductSections, getSectionProducts } from "@/data/demoProductSections";
import { demoGridSections, getGridSectionProducts } from "@/data/demoGridSections";
import Image from "next/image";

const CompanyHome = ({ params }) => {
  const { company, isCompanyLoading, isCompanyError } = useCompany(
    params.companyURL,
    true
  );

  const activeCompanyID = useMemo(() => {
    if (!company?.company || company.company.length === 0) return null;
    return company.company[0].companyID;
  }, [company]);

  const [activeCategory, setActiveCategory] = useState(["All"]);
  const [activeOutlet, setActiveOutlet] = useState(-1);
  const [activePriceRange, setActivePriceRange] = useState({
    min: Number.MIN_VALUE,
    max: Number.MAX_VALUE,
  });
  const [openAboutUsModal, setOpenAboutUsModal] = useState(false);
  const [openFiltersModal, setOpenFiltersModal] = useState(false);
  const [openWishlistModal, setOpenWishlistModal] = useState(false);
  const [customerWishlist, setCustomerWishlist] = useState(null);

  const handleCategoryChange = (newActiveCategory) => {
    setActiveCategory(newActiveCategory);
  };

  const handleOutletChange = (newActiveOutlet) => {
    setActiveOutlet(newActiveOutlet);
  };

  const handlePriceRangeChange = (newActivePriceRange) => {
    setActivePriceRange(newActivePriceRange);
  };

  function Callback_Modal_AboutUs_Open() {
    setOpenAboutUsModal(true);
  }

  function Callback_Modal_AboutUs_Close() {
    setOpenAboutUsModal(false);
  }

  function Callback_Modal_Filters_Open() {
    setOpenFiltersModal(true);
  }

  function Callback_Modal_Wishlist_Open() {
    if (!activeCompanyID) return;
    setCustomerWishlist(LoadWishlist(activeCompanyID));
    setOpenWishlistModal(true);
  }

  function Callback_Modal_Wishlist_Close() {
    setOpenWishlistModal(false);
  }

  function Callback_Modal_Wishlist_RemoveItem() {
    console.log("Removing item");
    if (!activeCompanyID) return;
    setCustomerWishlist(LoadWishlist(activeCompanyID));
  }

  function Callback_Modal_Filters_Close(outletFilter, priceRangeFilter) {
    console.log("Outlet Filter recieved at page -> " + outletFilter);
    console.log(
      "Price Filter recieved at page -> " + JSON.stringify(priceRangeFilter)
    );

    setOpenFiltersModal(false);
    handleOutletChange(outletFilter);
    if (priceRangeFilter) handlePriceRangeChange(priceRangeFilter);
  }

  useEffect(() => {
    // This is where we will initialize Model Viewer.
    // We'll do this asynchronously because it's a heavy operation.
    import("@google/model-viewer")
      .then(({ ModelViewerElement }) => {
        // Here, ModelViewerElement is now available and can be used.
        customElements.get("model-viewer") ||
          customElements.define("model-viewer", ModelViewerElement);
      })
      .catch((error) => {
        console.error("Error loading Model Viewer", error);
      });
  }, []); // We pass an empty dependency array so this runs once on mount.

  useEffect(() => {
    if (!activeCompanyID) return;
    setCustomerWishlist(LoadWishlist(activeCompanyID));
  }, [activeCompanyID]);

  useEffect(() => {
    console.log("COMPANY API RESPONSE");
    console.log(company);
  }, [company]);

  if (isCompanyLoading) {
    return (
      <div className="flex bg-white dark:bg-black p-8 w-screen h-screen justify-center items-center">
        <h2 className="text-white font-normal text-lg">
          Loading Brand Info
        </h2>
      </div>
    );
  }

  if (isCompanyError) {
    return (
      <div className="flex bg-white dark:bg-black p-8 w-screen h-screen justify-center items-center">
        <h2 className="text-white font-normal text-lg">
          There was an error
        </h2>
      </div>
    );
  }

  if (company?.company) {
    return (
      <main className="h-[100svh] w-full bg-white dark:bg-black overflow-auto pb-32 md:pb-96">
        <ModalAbout
          doOpen={openAboutUsModal}
          companyInfo={company.company[0]}
          callback_OnClose={Callback_Modal_AboutUs_Close}
        />
        <ModalFilters
          doOpen={openFiltersModal}
          companyOutlets={company.outletList}
          companyProducts={company.catalogue}
          activeOutlet={activeOutlet}
          activePriceRange={activePriceRange}
          callback_OnClose={Callback_Modal_Filters_Close}
        />
        <ModalWishlist
          doOpen={openWishlistModal}
          wishlistData={customerWishlist}
          companyProducts={company.catalogue}
          callback_OnClose={Callback_Modal_Wishlist_Close}
          callback_OnRemove={Callback_Modal_Wishlist_RemoveItem}
        />
        <PrimaryNav
          companyInfo={company.company[0]}
          activeCategory={activeCategory}
          activeCategoryCallback={handleCategoryChange}
          openAboutUsModalCallback={Callback_Modal_AboutUs_Open}
          openFiltersModalCallback={Callback_Modal_Filters_Open}
          openWishlistCallback={Callback_Modal_Wishlist_Open}
          isDisabled={company.catalogue.length == 0}
        />

        {/* Dynamic Product Sections - Slider */}
        {demoProductSections.enabled &&
          demoProductSections.sections
            .filter(section => section.enabled)
            .sort((a, b) => a.order - b.order)
            .map(section => {
              // Get products for this section using helper
              const sectionProducts = getSectionProducts(section, company.catalogue);

              return (
                <OnDemandSlider
                  key={section.id}
                  section={section}
                  products={sectionProducts}
                  wishlistData={customerWishlist}
                  onWishlistChange={() => {
                    if (!activeCompanyID) return;
                    setCustomerWishlist(LoadWishlist(activeCompanyID));
                  }}
                />
              );
            })
        }

        {/* Dynamic Product Sections - Grid */}
        {demoGridSections.enabled &&
          demoGridSections.sections
            .filter(section => section.enabled)
            .sort((a, b) => a.order - b.order)
            .map(section => {
              // Get products for this section using helper
              const sectionProducts = getGridSectionProducts(section, company.catalogue);

              return (
                <OnDemandGrid
                  key={section.id}
                  section={section}
                  products={sectionProducts}
                  wishlistData={customerWishlist}
                  onWishlistChange={() => {
                    if (!activeCompanyID) return;
                    setCustomerWishlist(LoadWishlist(activeCompanyID));
                  }}
                />
              );
            })
        }

        {/* Category Slider - Separator between OnDemand sections and main grid */}
        <section className="sticky top-[72px] flex flex-col justify-center items-center w-full gap-4 pb-2 pt-4 bg-white dark:bg-black z-30">
          <CategorySlider
            categoryItems={company.company[0].categories}
            id="PrimaryCatSlider"
            currActiveCategory={activeCategory}
            activeCategoryCallback={handleCategoryChange}
            openFiltersCallback={Callback_Modal_Filters_Open}
            isDisabled={company.catalogue.length == 0}
          />
        </section>

        <ProductGrid
          productItems={company.catalogue}
          category={activeCategory}
          outlet={activeOutlet}
          priceRange={activePriceRange}
          isDisabled={company.catalogue.length == 0}
          wishlistData={customerWishlist}
          onWishlistChange={() => {
            if (!activeCompanyID) return;
            setCustomerWishlist(LoadWishlist(activeCompanyID));
          }}
        />
        <BottomNav
          activeCompanyID={activeCompanyID}
          companyURL={params.companyURL}
        />
      </main>
    );
  } else {
    return (
      <main className="h-[100svh] w-full bg-white dark:bg-black overflow-auto">
        <div className="flex flex-col items-center justify-center w-full h-full gap-6 p-8">
          <Image
            src="/Logos/BFSHorizontal.png"
            alt="Try It First Logo"
            width={200}
            height={32}
            className="animate-slideInSpringedBottom pb-2"
          />

          <h2 className="text-red-500 font-normal text-lg text-center">
            Sorry, we couldn't find the page you are looking for
          </h2>
        </div>
      </main>
    );
  }
};

export default CompanyHome;
