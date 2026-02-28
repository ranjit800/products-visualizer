import { getFormattedPrice } from "@/utils/productInfoUtils";
import {
  AddToWishlist,
  DoesWishlistContain,
  RemoveFromWishlist,
} from "@/utils/wishlistUtils";
import { HeartIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState, useRef } from "react";

const ProductViewInfoCard = ({ productInfo, analyticsOnWishlistClick }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [sheetState, setSheetState] = useState("collapsed"); // collapsed, half, full
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const sheetRef = useRef(null);

  // Define sheet positions as percentages of viewport height
  const SHEET_STATES = {
    collapsed: 15, // 15% of screen
    half: 45,      // 45% of screen
    full: 85,      // 85% of screen
  };

  useEffect(() => {
    setIsInWishlist(
      DoesWishlistContain(
        productInfo.data.productID,
        productInfo.data.companyID
      )
    );
    console.log("Is in wishlist - " + isInWishlist);
  }, []);

  function Callback_OnAddToWishlist() {
    setIsInWishlist(true);
    analyticsOnWishlistClick();
  }

  function Callback_OnRemoveFromWishlist() {
    setIsInWishlist(false);
  }

  function wishListAction() {
    if (isInWishlist) {
      console.log("Trying to remove from wishlist");
      RemoveFromWishlist(
        productInfo.data.productID,
        productInfo.data.companyID,
        Callback_OnRemoveFromWishlist
      );
    } else {
      console.log("Trying to add to wishlist");
      AddToWishlist(
        productInfo.data.productID,
        productInfo.data.companyID,
        Callback_OnAddToWishlist
      );
    }
  }

  // Handle touch/mouse start
  const handleTouchStart = (e) => {
    setIsDragging(true);
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setCurrentY(clientY);
  };

  // Handle touch/mouse move
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setCurrentY(clientY);
  };

  // Handle touch/mouse end - snap to nearest state
  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaY = startY - currentY;
    const threshold = 50; // minimum drag distance to trigger state change

    if (Math.abs(deltaY) < threshold) {
      // Small drag - treat as tap, cycle to next state
      handleTap();
      return;
    }

    // Dragging up (deltaY > 0) - expand
    if (deltaY > 0) {
      if (sheetState === "collapsed") {
        setSheetState("half");
      } else if (sheetState === "half") {
        setSheetState("full");
      }
    }
    // Dragging down (deltaY < 0) - collapse
    else {
      if (sheetState === "full") {
        setSheetState("half");
      } else if (sheetState === "half") {
        setSheetState("collapsed");
      }
    }
  };

  // Handle tap on handle - cycle through states
  const handleTap = () => {
    if (sheetState === "collapsed") {
      setSheetState("half");
    } else if (sheetState === "half") {
      setSheetState("full");
    } else {
      setSheetState("collapsed");
    }
  };

  // Get current height based on state
  const getSheetHeight = () => {
    if (isDragging) {
      // Calculate real-time height during drag
      const viewportHeight = window.innerHeight;
      const currentHeight = SHEET_STATES[sheetState];
      const dragDelta = ((startY - currentY) / viewportHeight) * 100;
      const newHeight = Math.min(Math.max(currentHeight + dragDelta, 15), 85);
      return `${newHeight}vh`;
    }
    return `${SHEET_STATES[sheetState]}vh`;
  };

  return (
    <section
      ref={sheetRef}
      className="fixed bottom-0 left-0 right-0 flex flex-col items-center w-full text-black dark:text-white bg-[#ECECEC] dark:bg-black rounded-t-[2rem] shadow-[0_-10px_25px_5px_rgba(0,0,0,0.15)] border-t border-gray-300 dark:border-gray-800 z-30"
      style={{
        height: getSheetHeight(),
        transition: isDragging ? "none" : "height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* Drag Handle */}
      <div
        className="flex flex-col items-center justify-center w-full py-3 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onClick={handleTap}
      >
        {/* Handle Icon */}
        <div className="w-12 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mb-1"></div>

        {/* Product Name - Always Visible */}
        <div className="flex items-center justify-between w-full px-6 pt-2">
          <h1 className="text-lg font-bold text-black dark:text-white truncate">
            {productInfo.data.productName}
          </h1>
          <div className="text-lg font-bold text-black dark:text-white whitespace-nowrap ml-4">
            {getFormattedPrice(
              productInfo.data.currency,
              productInfo.data.discountPercent > 0
                ? productInfo.data.discountedPrice
                : productInfo.data.price
            )}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex flex-col gap-6 w-full px-6 pb-6 overflow-y-auto no-scrollbar flex-1">
        {/* Description */}
        <div className="flex flex-col gap-2">
          <p className="text-sm font-normal text-gray-600 dark:text-gray-400 leading-relaxed">
            {productInfo.data.description}
          </p>
        </div>

        <hr className="border-gray-300 dark:border-gray-800" />

        {/* Dimensions */}
        <div className="flex flex-col gap-3">
          <h1 className="text-base font-bold text-black dark:text-white">
            Dimensions ( L x W x H )
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-[#343434] text-gray-700 dark:text-gray-300 text-sm font-medium">
              {productInfo.data.productLength +
                " " +
                productInfo.data.dimensionUnit}
            </div>
            <span className="text-gray-500 dark:text-[#C1C1C1] text-sm">x</span>
            <div className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-[#343434] text-gray-700 dark:text-gray-300 text-sm font-medium">
              {productInfo.data.width + " " + productInfo.data.dimensionUnit}
            </div>
            <span className="text-gray-500 dark:text-[#C1C1C1] text-sm">x</span>
            <div className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-[#343434] text-gray-700 dark:text-gray-300 text-sm font-medium">
              {productInfo.data.height + " " + productInfo.data.dimensionUnit}
            </div>
          </div>
        </div>

        {/* Weight */}
        <div className="flex flex-col gap-3">
          <h1 className="text-base font-bold text-black dark:text-white">
            Weight
          </h1>
          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-lg bg-gray-300 dark:bg-[#343434] text-gray-700 dark:text-gray-300 text-sm font-medium">
              {productInfo.data.weight + " " + productInfo.data.weightUnit}
            </div>
          </div>
        </div>

        <hr className="border-gray-300 dark:border-gray-800" />

        {/* Price Details */}
        <div className="flex flex-col gap-2">
          <h2 className="text-base font-bold text-black dark:text-white">Price Details</h2>
          <div className="flex items-center gap-4">
            {productInfo.data.discountPercent > 0 && (
              <div className="flex items-center justify-center px-3 py-1.5 text-lg font-bold text-white bg-[#DA3423] rounded-lg">
                -{productInfo.data.discountPercent}%
              </div>
            )}

            <div className="flex flex-col">
              {productInfo.data.discountPercent > 0 && (
                <h2 className="line-through text-gray-500 text-xs font-medium">
                  {getFormattedPrice(
                    productInfo.data.currency,
                    productInfo.data.price
                  )}
                </h2>
              )}
              <h1 className="text-2xl font-bold text-black dark:text-white">
                {getFormattedPrice(
                  productInfo.data.currency,
                  productInfo.data.discountPercent > 0
                    ? productInfo.data.discountedPrice
                    : productInfo.data.price
                )}
              </h1>
            </div>
          </div>
        </div>

        {/* Wishlist Button */}
        <div className="w-full pt-2 pb-4">
          <button
            className="flex gap-3 p-4 items-center justify-center w-full text-white text-sm font-medium rounded-xl bg-black hover:bg-gray-900 transition-all active:scale-95"
            onClick={() => wishListAction()}
          >
            {!isInWishlist && <HeartIcon className="h-5 w-5" />}
            {isInWishlist && <TrashIcon className="h-5 w-5" />}
            <span>{isInWishlist ? "Remove from wishlist" : "Add to wishlist"}</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductViewInfoCard;
