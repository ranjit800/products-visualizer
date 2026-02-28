"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { Search, Mic, Clock } from "lucide-react";
import BottomNav from "@/components/BottomNav/BottomNav";
import useCompany from "@/hooks/useCompany";
import { getFormattedPrice } from "@/utils/productInfoUtils";

const SearchPage = ({ params }) => {
    const router = useRouter();
    const { company, isCompanyLoading, isCompanyError } = useCompany(
        params.companyURL,
        true
    );

    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(true);

    const activeCompanyID = useMemo(() => {
        if (!company?.company || company.company.length === 0) return null;
        return company.company[0].companyID;
    }, [company]);

    // Load recent searches from localStorage
    useEffect(() => {
        if (activeCompanyID) {
            const stored = localStorage.getItem(`recentSearches_${activeCompanyID}`);
            if (stored) {
                setRecentSearches(JSON.parse(stored));
            }
        }
    }, [activeCompanyID]);

    // Generate search results based on query
    useEffect(() => {
        if (searchQuery.trim() && company?.catalogue) {
            const results = company.catalogue
                .filter(product =>
                    product.productName.toLowerCase().includes(searchQuery.toLowerCase())
                );

            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, company]);

    const saveToRecentSearches = (query) => {
        if (!query.trim() || !activeCompanyID) return;

        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem(`recentSearches_${activeCompanyID}`, JSON.stringify(updated));
    };

    const handleSearch = (query) => {
        if (query.trim()) {
            saveToRecentSearches(query);
            setSearchQuery(query);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (productName) => {
        setSearchQuery(productName);
        saveToRecentSearches(productName);
        setShowSuggestions(false);
    };

    const handleRecentSearchClick = (query) => {
        setSearchQuery(query);
        saveToRecentSearches(query);
        setShowSuggestions(false);
    };

    const clearRecentSearches = () => {
        if (activeCompanyID) {
            setRecentSearches([]);
            localStorage.removeItem(`recentSearches_${activeCompanyID}`);
        }
    };

    if (isCompanyLoading) {
        return (
            <div className="flex bg-black p-8 w-screen h-screen justify-center items-center">
                <h2 className="text-white font-normal text-lg">
                    Loading Search...
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
            {/* Header with Search Bar */}
            <div className="sticky top-0 z-10 bg-white dark:bg-black p-4 flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900"
                >
                    <ArrowLeftIcon className="w-6 h-6 text-black dark:text-white" />
                </button>

                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                        placeholder="Search here"
                        className="w-full bg-transparent border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-black dark:text-white placeholder-gray-500 focus:outline-none focus:border-gray-400 dark:focus:border-gray-600"
                    />
                </div>

                <button className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900">
                    <Mic className="w-6 h-6 text-black dark:text-white" />
                </button>
            </div>

            {/* Content */}
            <div className="px-4 py-2">
                {/* Search Suggestions (when typing and showSuggestions is true) */}
                {searchQuery && showSuggestions && searchResults.length > 0 && (
                    <div className="flex flex-col gap-1">
                        {searchResults.slice(0, 10).map((product, index) => (
                            <button
                                key={index}
                                onClick={() => handleSuggestionClick(product.productName)}
                                className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            >
                                <Search className="w-5 h-5 text-gray-400" />
                                <div className="flex-1 text-left">
                                    <span className="text-black dark:text-white">{product.productName}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Search Results (after search is executed) */}
                {searchQuery && !showSuggestions && searchResults.length > 0 && (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
                        {searchResults.map((product) => (
                            <Link
                                key={product.productID}
                                href={`/view/${product.productID}`}
                                className="relative flex flex-col bg-white dark:bg-[#161616] rounded-xl shadow-md dark:shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-transparent"
                            >
                                <div className="rounded-lg overflow-clip aspect-square w-full relative p-1.5">
                                    <Image
                                        src={product.poster}
                                        alt={product.productName}
                                        fill
                                        style={{ objectFit: "contain" }}
                                        className="rounded-lg"
                                    />
                                </div>
                                <div className="flex flex-col p-2 gap-1">
                                    <h3 className="text-black dark:text-white font-medium text-xs truncate">
                                        {product.productName}
                                    </h3>
                                    <p className="text-gray-700 dark:text-white text-xs">
                                        {getFormattedPrice(product.currency, product.price)}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {/* No Results */}
                {searchQuery && !showSuggestions && searchResults.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-20 gap-4">
                        <Search className="w-12 h-12 text-gray-600" />
                        <p className="text-gray-500 font-medium">No products found</p>
                    </div>
                )}

                {/* Recent Searches (when not typing) */}
                {!searchQuery && recentSearches.length > 0 && (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="text-gray-400 text-sm font-medium">Recent</h2>
                            <button
                                onClick={clearRecentSearches}
                                className="text-gray-500 text-xs hover:text-gray-400"
                            >
                                Clear all
                            </button>
                        </div>
                        {recentSearches.map((search, index) => (
                            <button
                                key={index}
                                onClick={() => handleRecentSearchClick(search)}
                                className="flex items-center gap-3 py-3 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                            >
                                <Clock className="w-5 h-5 text-gray-400" />
                                <span className="text-gray-600 dark:text-white text-left flex-1">{search}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!searchQuery && recentSearches.length === 0 && (
                    <div className="flex flex-col items-center justify-center mt-20 gap-4">
                        <Search className="w-12 h-12 text-gray-600" />
                        <p className="text-gray-500 font-medium">Start searching for products</p>
                    </div>
                )}
            </div>

            <BottomNav activeCompanyID={activeCompanyID} companyURL={params.companyURL} />
        </main>
    );
};

export default SearchPage;
