import { getFormattedPrice } from "@/utils/productInfoUtils";
import { RemoveFromWishlist } from "@/utils/wishlistUtils";
import { HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";

const WishlistItemCard = ({
  productInfo,
  showSeperator = false,
  OnRemoveCallback,
}) => {
  return (
    <div
      className={`flex px-4 py-4 gap-4 items-center justify-between w-full bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-transparent`}
    >
      <Link
        className="flex items-center gap-4 w-full"
        href={"/view/" + productInfo.productID}
      >
        <div className="rounded-lg overflow-clip aspect-square w-20 relative shrink-0">
          <Image
            src={productInfo.poster}
            alt="Product Image"
            quality={100}
            fill
            style={{ objectFit: "cover" }}
            placeholder="blur"
            blurDataURL={productInfo.poster}
          />
        </div>
        <div className="flex flex-col items-start justify-center w-full gap-1">
          <h1 className="font-bold text-sm text-black dark:text-white line-clamp-2">
            {productInfo.productName}
          </h1>
          <h2 className="text-sm font-normal text-gray-600 dark:text-gray-300">
            {getFormattedPrice(productInfo.currency, productInfo.price)}
          </h2>
        </div>
      </Link>

      <button
        className="flex items-center justify-center p-2 text-red-500 hover:text-red-400 transition-colors"
        onClick={(e) => {
          e.stopPropagation();
          RemoveFromWishlist(
            productInfo.productID,
            productInfo.companyID,
            OnRemoveCallback
          );
        }}
      >
        <HeartIcon className="w-6 h-6" />
      </button>
    </div>
  );
};

export default WishlistItemCard;
