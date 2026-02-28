import Link from "next/link";
import { getFormattedPrice } from "@/utils/productInfoUtils";
import { useEffect, useState } from "react";
import {
  DoesWishlistContain,
  AddToWishlist,
  RemoveFromWishlist,
} from "@/utils/wishlistUtils";
import { Heart } from "lucide-react";
import Image from "next/image";

const PG_Card = ({
  productInfo,
  wishlistData,
  show3D = false,
  onWishlistChange,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);

  useEffect(() => {
    setIsInWishlist(
      DoesWishlistContain(productInfo.productID, productInfo.companyID)
    );
  }, [wishlistData, productInfo.productID, productInfo.companyID]);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      RemoveFromWishlist(
        productInfo.productID,
        productInfo.companyID,
        () => {
          setIsInWishlist(false);
          if (onWishlistChange) {
            onWishlistChange();
          }
        }
      );
    } else {
      AddToWishlist(
        productInfo.productID,
        productInfo.companyID,
        () => {
          setIsInWishlist(true);
          if (onWishlistChange) {
            onWishlistChange();
          }
        }
      );
    }
  };

  console.log("Product Card Rendered");

  return (
    <Link
      className="relative flex flex-col bg-white dark:bg-[#161616] rounded-xl shadow-md dark:shadow-[0_0px_15px_3px_rgba(0,0,0,0.10)] border border-gray-200 dark:border-transparent"
      href={"/view/" + productInfo.productID}
    >
      <div
        className="absolute top-0 right-0 z-10 rounded-bl-lg rounded-tr-lg transition-colors"
        style={{ backgroundColor: isInWishlist ? '#DA3423' : '#8C8989' }}
      >
        <button
          onClick={handleWishlistClick}
          className="p-1.5 transition-colors"
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart
            className={`w-5 h-5 ${isInWishlist ? "text-white" : "text-black"
              }`}
            fill="none"
          />
        </button>
      </div>

      <div
        id="card"
        className="flex flex-col px-2 pt-2 pb-4  gap-4 w-full h-64 md:h-80 lg:h-80 justify-center items-center relative"
      >
        {show3D && (
          <model-viewer
            src={productInfo.glb}
            ios-src={productInfo.usdz}
            poster={productInfo.poster}
            alt="3D model of the product"
            shadow-intensity="1"
            camera-controls
            touch-action="pan-y"
            auto-rotate
            autoplay
          //ar-modes="webxr scene-viewer quick-look"
          //ar-modes="webxr"
          ></model-viewer>
        )}

        {!show3D && (
          <div className="rounded-lg overflow-clip aspect-square w-full h-full relative">
            <Image
              src={productInfo.poster}
              blurDataURL={productInfo.poster}
              alt={productInfo.productName + " Image"}
              quality={100}
              fill
              style={{ objectFit: "contain" }}
              placeholder="blur"
            />
          </div>
        )}

        <div className="flex flex-col w-full justify-center gap-3">
          <h1 className="md:text-xl text-base font-medium truncate text-black dark:text-white">
            {productInfo.productName}
          </h1>
          <h2 className="text-base font-normal text-gray-700 dark:text-white">
            {getFormattedPrice(productInfo.currency, productInfo.price)}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default PG_Card;
