import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * wishlistStore — manages the user's wishlist.
 * Persisted to localStorage so items survive page refresh.
 */

export type WishlistState = {
    wishlist: string[]; // Array of product slugs
};

export type WishlistActions = {
    toggleWishlist: (slug: string) => void;
    isInWishlist: (slug: string) => boolean;
    clearWishlist: () => void;
};

export const useWishlistStore = create<WishlistState & WishlistActions>()(
    devtools(
        persist(
            (set, get) => ({
                /* State */
                wishlist: [],

                /* Actions */
                toggleWishlist: (slug: string) => {
                    const { wishlist } = get();
                    const isItemInWishlist = wishlist.includes(slug);

                    if (isItemInWishlist) {
                        set({ wishlist: wishlist.filter((item) => item !== slug) }, false, "toggleWishlist:remove");
                    } else {
                        set({ wishlist: [...wishlist, slug] }, false, "toggleWishlist:add");
                    }
                },

                isInWishlist: (slug: string) => {
                    return get().wishlist.includes(slug);
                },

                clearWishlist: () => {
                    set({ wishlist: [] }, false, "clearWishlist");
                },
            }),
            {
                name: "viz_wishlist", // localStorage key
            }
        ),
        { name: "wishlistStore" }
    )
);
