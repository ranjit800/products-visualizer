"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import PrimaryNav from "@/components/PrimaryNav/PrimaryNav";
import ProductGrid from "@/components/ProductGrid/ProductGrid";
import useCompany from "@/hooks/useCompany";
import ModalAbout from "@/components/ModalAbout/ModalAbout";
import ModalFilters from "@/components/ModalFilters/ModalFilters";
import ModalWishlist from "@/components/ModalWishlist/ModalWishlist";
import BottomNav from "@/components/BottomNav/BottomNav";
import { LoadWishlist } from "@/utils/wishlistUtils";

const DEFAULT_COMPANY_ID = 1725268499620;

const Home = () => {
  const searchParams = useSearchParams();
  const companyIDQuery = searchParams.get("companyID");
  const companyIDFromQuery = useMemo(() => {
    if (!companyIDQuery) return null;
    const parsed = parseInt(companyIDQuery, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [companyIDQuery]);

  const fallbackCompanyID = companyIDFromQuery ?? DEFAULT_COMPANY_ID;

  const { company, isCompanyLoading, isCompanyError } = useCompany(
    fallbackCompanyID
  );

  const activeCompanyID =
    company?.company?.[0]?.companyID ?? fallbackCompanyID;

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
  }, []);

  useEffect(() => {
    if (!activeCompanyID) return;
    setCustomerWishlist(LoadWishlist(activeCompanyID));
  }, [activeCompanyID]);

  useEffect(() => {
    console.log("Customer Wishlist -> " + customerWishlist);
  }, [customerWishlist]);

  useEffect(() => {
    console.log("COMPANY API RESPONSE")
    console.log(company);
  }, [company])

  if (isCompanyLoading) {
    return (
      <div className="flex bg-black p-8 w-screen h-screen justify-center items-center">
        <h2 className="text-white font-normal text-lg">
          Loading Brand Info
        </h2>
      </div>
    );
  }  

  if (isCompanyError) {
    return (
      <div className="flex bg-black p-8 w-screen h-screen justify-center items-center">
        <h2 className="text-white font-normal text-lg">
          There was an error
        </h2>
      </div>
    );
  }

  return (
    <main className="h-[100svh] w-full bg-black overflow-auto">
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
      <ProductGrid
        productItems={company.catalogue}
        category={activeCategory}
        outlet={activeOutlet}
        priceRange={activePriceRange}
        isDisabled={company.catalogue.length == 0}
        wishlistData={customerWishlist}
        onWishlistChange={() => {
          setCustomerWishlist(LoadWishlist(activeCompanyID));
        }}
      />
      <BottomNav
        onWishlistClick={Callback_Modal_Wishlist_Open}
        onCategoryClick={Callback_Modal_Filters_Open}
        onSearchClick={() => {
          // Search functionality can be added here
          console.log("Search clicked");
        }}
        activeCompanyID={activeCompanyID}
      />
    </main>
  );
};

export default Home;
