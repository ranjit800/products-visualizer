"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Heart } from "lucide-react";
import BottomNav from "@/components/BottomNav/BottomNav";
import useCompany from "@/hooks/useCompany";
import { getFormattedPrice } from "@/utils/productInfoUtils";
import {
    AddToWishlist,
    RemoveFromWishlist,
    DoesWishlistContain,
} from "@/utils/wishlistUtils";

const CategoryPage = ({ params }) => {
    const router = useRouter();
    const { company, isCompanyLoading, isCompanyError } = useCompany(
        params.companyURL,
        true
    );

    const [wishlistData, setWishlistData] = useState([]);

    const activeCompanyID = useMemo(() => {
        if (!company?.company || company.company.length === 0) return null;
        return company.company[0].companyID;
    }, [company]);

    // Group products by category
    const categorizedProducts = useMemo(() => {
        if (!company?.catalogue) return {};

        const grouped = {};

        company.catalogue.forEach((product) => {
            const category = product.category || "Uncategorized";
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push(product);
        });

        return grouped;
    }, [company]);

    const handleWishlistToggle = (productID, companyID, isInWishlist) => {
        if (isInWishlist) {
            RemoveFromWishlist(productID, companyID, () => {
                setWishlistData((prev) => prev + 1);
            });
        } else {
            AddToWishlist(productID, companyID, () => {
                setWishlistData((prev) => prev + 1);
            });
        }
    };

    if (isCompanyLoading) {
        return (
            <div className="flex bg-black p-8 w-screen h-screen justify-center items-center">
                <h2 className="text-white font-normal text-lg">Loading Categories...</h2>
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
                <h1 className="text-xl font-semibold text-black dark:text-white">Choose Category</h1>
            </div>

            {/* Categories */}
            <div className="px-4 py-4 flex flex-col gap-8">
                {Object.keys(categorizedProducts).map((categoryName) => (
                    <div key={categoryName} className="flex flex-col gap-4">
                        {/* Category Name */}
                        <h2 className="text-black dark:text-white font-semibold text-lg">{categoryName}</h2>

                        {/* Products Grid */}
                        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {categorizedProducts[categoryName].map((product) => {
                                const isInWishlist = DoesWishlistContain(
                                    product.productID,
                                    product.companyID
                                );

                                return (
                                    <Link
                                        key={product.productID}
                                        href={`/view/${product.productID}`}
                                        className="relative flex flex-col bg-white dark:bg-[#161616] rounded-xl shadow-md dark:shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-transparent"
                                    >
                                        {/* Wishlist Button */}
                                        <div
                                            className="absolute top-0 right-0 z-10 rounded-bl-lg rounded-tr-lg transition-colors"
                                            style={{
                                                backgroundColor: isInWishlist ? "#DA3423" : "#8C8989",
                                            }}
                                        >
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleWishlistToggle(
                                                        product.productID,
                                                        product.companyID,
                                                        isInWishlist
                                                    );
                                                }}
                                                className="p-1 transition-colors"
                                                aria-label={
                                                    isInWishlist
                                                        ? "Remove from wishlist"
                                                        : "Add to wishlist"
                                                }
                                            >
                                                <Heart
                                                    className={`w-4 h-4 ${isInWishlist ? "text-white" : "text-black"
                                                        }`}
                                                    fill="none"
                                                />
                                            </button>
                                        </div>

                                        {/* Product Image */}
                                        <div className="rounded-lg overflow-clip aspect-square w-full relative p-1.5">
                                            <Image
                                                src={product.poster}
                                                alt={product.productName}
                                                fill
                                                style={{ objectFit: "contain" }}
                                                className="rounded-lg"
                                            />
                                        </div>

                                        {/* Product Info */}
                                        <div className="flex flex-col p-2 gap-1">
                                            <h3 className="text-black dark:text-white font-medium text-xs truncate">
                                                {product.productName}
                                            </h3>
                                            <p className="text-gray-700 dark:text-white text-xs">
                                                {getFormattedPrice(product.currency, product.price)}
                                            </p>
                                            {product.discount && (
                                                <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded w-fit">
                                                    {product.discount}% off
                                                </span>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            <BottomNav
                activeCompanyID={activeCompanyID}
                companyURL={params.companyURL}
            />
        </main>
    );
};

export default CategoryPage;
