/**
 * Unit tests for catalog filter logic (queryProducts in lib/products.ts)
 */
import {
    queryProducts,
    PRODUCTS,
    getAllCategories,
    getAllTags,
    getProductBySlug,
    formatPriceCents,
} from "@/lib/products";

describe("queryProducts — no filters", () => {
    it("returns all products when no filter is provided (first page)", () => {
        const result = queryProducts({});
        expect(result.total).toBe(PRODUCTS.length);
        expect(result.page).toBe(1);
    });

    it("defaults to pageSize 6", () => {
        const result = queryProducts({});
        expect(result.items.length).toBeLessThanOrEqual(6);
    });
});

describe("queryProducts — category filter", () => {
    it("filters by Chair category", () => {
        const result = queryProducts({ category: "Chair" });
        expect(result.items.every((p) => p.category === "Chair")).toBe(true);
        expect(result.total).toBe(PRODUCTS.filter((p) => p.category === "Chair").length);
    });

    it("filters by Lamp category", () => {
        const result = queryProducts({ category: "Lamp" });
        expect(result.items.every((p) => p.category === "Lamp")).toBe(true);
    });

    it("filters by Desk category", () => {
        const result = queryProducts({ category: "Desk" });
        expect(result.items.every((p) => p.category === "Desk")).toBe(true);
    });
});

describe("queryProducts — tag filter", () => {
    it("filters by 'minimal' tag", () => {
        const result = queryProducts({ tag: "minimal" });
        expect(result.items.every((p) => p.tags.includes("minimal"))).toBe(true);
    });

    it("returns empty items for a non-existing tag", () => {
        const result = queryProducts({ tag: "nonexistent-tag" });
        expect(result.items.length).toBe(0);
        expect(result.total).toBe(0);
    });
});

describe("queryProducts — price range filter", () => {
    it("filters by minimum price", () => {
        const min = 20000;
        const result = queryProducts({ minPriceCents: min });
        expect(result.items.every((p) => p.priceCents >= min)).toBe(true);
    });

    it("filters by maximum price", () => {
        const max = 10000;
        const result = queryProducts({ maxPriceCents: max });
        expect(result.items.every((p) => p.priceCents <= max)).toBe(true);
    });

    it("filters by both min and max price", () => {
        const result = queryProducts({ minPriceCents: 10000, maxPriceCents: 15000 });
        expect(
            result.items.every((p) => p.priceCents >= 10000 && p.priceCents <= 15000)
        ).toBe(true);
    });

    it("returns empty when no products match the price range", () => {
        const result = queryProducts({ minPriceCents: 999999 });
        expect(result.total).toBe(0);
        expect(result.items.length).toBe(0);
    });
});

describe("queryProducts — pagination", () => {
    it("paginates correctly with page=2", () => {
        const page1 = queryProducts({ page: 1, pageSize: 3 });
        const page2 = queryProducts({ page: 2, pageSize: 3 });
        expect(page1.items.length).toBe(3);
        expect(page2.items.length).toBe(3);
        // Items should be different
        expect(page1.items[0].id).not.toBe(page2.items[0].id);
    });

    it("clamps page to totalPages if out of bounds", () => {
        const result = queryProducts({ page: 999, pageSize: 6 });
        expect(result.page).toBeLessThanOrEqual(result.totalPages);
    });

    it("clamps page to 1 if page < 1", () => {
        const result = queryProducts({ page: -5, pageSize: 6 });
        expect(result.page).toBe(1);
    });
});

describe("queryProducts — combined filters", () => {
    it("combines category + tag filter correctly", () => {
        const result = queryProducts({ category: "Chair", tag: "minimal" });
        expect(
            result.items.every(
                (p) => p.category === "Chair" && p.tags.includes("minimal")
            )
        ).toBe(true);
    });
});

describe("helper functions", () => {
    it("getAllCategories returns Chair, Lamp, Desk", () => {
        expect(getAllCategories()).toEqual(["Chair", "Lamp", "Desk"]);
    });

    it("getAllTags returns a sorted list", () => {
        const tags = getAllTags();
        expect(tags.length).toBeGreaterThan(0);
        expect([...tags].sort()).toEqual(tags); // sorted
    });

    it("getProductBySlug finds aurora-chair", () => {
        const product = getProductBySlug("aurora-chair");
        expect(product).toBeDefined();
        expect(product?.id).toBe("chair-aurora");
    });

    it("getProductBySlug returns undefined for unknown slug", () => {
        expect(getProductBySlug("does-not-exist")).toBeUndefined();
    });

    it("formatPriceCents formats correctly", () => {
        expect(formatPriceCents(12999)).toBe("$130");
    });
});
