"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import useCompany from "@/hooks/useCompany";
import { LoadWishlist, RemoveFromWishlist } from "@/utils/wishlistUtils";
import BottomNav from "@/components/BottomNav/BottomNav";
import { ArrowLeftIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import WishlistItemCard from "@/components/ModalWishlist/SubComps/WishlistItemCard";

const WishlistPage = ({ params }) => {
    const router = useRouter();
    const { company, isCompanyLoading, isCompanyError } = useCompany(
        params.companyURL,
        true
    );

    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoadingWishlist, setIsLoadingWishlist] = useState(true);

    const activeCompanyID = useMemo(() => {
        if (!company?.company || company.company.length === 0) return null;
        return company.company[0].companyID;
    }, [company]);

    useEffect(() => {
        if (activeCompanyID && company?.catalogue) {
            const wishlistIDs = LoadWishlist(activeCompanyID);
            // Ensure IDs are compared as strings to avoid type mismatches
            const items = company.catalogue.filter((product) =>
                wishlistIDs.some(id => String(id) === String(product.productID))
            );
            setWishlistItems(items);
            setIsLoadingWishlist(false);
        } else if (!isCompanyLoading && !company) {
            setIsLoadingWishlist(false);
        }
    }, [activeCompanyID, company, isCompanyLoading]);

    const handleRemoveItem = () => {
        // Re-fetch wishlist
        if (activeCompanyID && company?.catalogue) {
            const wishlistIDs = LoadWishlist(activeCompanyID);
            const items = company.catalogue.filter((product) =>
                wishlistIDs.some(id => String(id) === String(product.productID))
            );
            setWishlistItems(items);
        }
    };

    if (isCompanyLoading || (isLoadingWishlist && !isCompanyError)) {
        return (
            <div className="flex bg-black p-8 w-screen h-screen justify-center items-center">
                <h2 className="text-white font-normal text-lg">
                    Loading Wishlist...
                </h2>
            </div>
        );
    }

    if (isCompanyError) {
        return (
            <div className="flex bg-black p-8 w-screen h-screen justify-center items-center">
                <h2 className="text-white font-normal text-lg">
                    Error loading company data
                </h2>
            </div>
        );
    }

    return (
        <main className="min-h-screen w-full bg-white dark:bg-black pb-20">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white dark:bg-black p-4 flex items-center justify-center border-b border-gray-200 dark:border-gray-800 relative">
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-black dark:text-white" />
                </button>
                <h1 className="text-xl font-semibold text-black dark:text-white">My Wish list</h1>
            </div>

            {/* Content */}
            <div className="px-4 py-4 flex flex-col gap-4">
                {wishlistItems && wishlistItems.length > 0 ? (
                    wishlistItems.map((item) => (
                        <WishlistItemCard
                            key={item.productID}
                            productInfo={item}
                            showSeperator={false}
                            OnRemoveCallback={handleRemoveItem}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center mt-20 gap-4">
                        <ExclamationCircleIcon className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Your wishlist is empty</p>
                    </div>
                )}
            </div>

            <BottomNav activeCompanyID={activeCompanyID} companyURL={params.companyURL} />
        </main>
    );
};

export default WishlistPage;
