import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import WishlistItemCard from "../ModalWishlist/SubComps/WishlistItemCard";

const WishlistDisplay = ({ wishlistItems, onRemoveCallback, headerStart }) => {
    return (
        <div className="flex flex-col w-full min-h-screen  bg-white dark:bg-black">
            {/* Header */}
            <div className="flex items-center justify-center p-4 border-b border-gray-200 dark:border-gray-800 relative">
                {headerStart && <div className="absolute left-4">{headerStart}</div>}
                <h1 className="text-xl font-bold text-black dark:text-white">My Wish list</h1>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[80vh] lg:max-h-[70vh] md:max-h-[85vh]">
                {wishlistItems && wishlistItems.length > 0 ? (
                    wishlistItems.map((item, index) => (
                        <WishlistItemCard
                            key={item.productID}
                            productInfo={item}
                            showSeperator={false}
                            OnRemoveCallback={onRemoveCallback}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center mt-10 gap-4">
                        <ExclamationCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Your wishlist is empty</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistDisplay;
