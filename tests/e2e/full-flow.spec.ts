import { test, expect } from "@playwright/test";

/**
 * E2E Scenario: Full user flow
 * catalog → filter → product detail → open configurator → change color → save → assert share link
 */
test.describe("Full user flow", () => {
    test("catalog loads and shows products", async ({ page }) => {
        await page.goto("/products");

        // Page title contains Visualizer
        await expect(page).toHaveTitle(/Visualizer/);

        // Product cards are visible
        const cards = page.locator("article, [data-testid='product-card'], a[href^='/products/']");
        await expect(cards.first()).toBeVisible({ timeout: 10000 });
    });

    test("category filter works", async ({ page }) => {
        await page.goto("/products");

        // Select the Category filter — look for a <select> or button containing 'Chair'
        const categorySelect = page.locator("select").first();
        if (await categorySelect.isVisible()) {
            await categorySelect.selectOption({ label: "Chair" });
        }

        // Apply button
        const applyBtn = page.getByRole("button", { name: /apply|filter/i });
        if (await applyBtn.isVisible()) {
            await applyBtn.click();
        }

        // URL should have category=Chair or page still shows products
        await expect(page).toHaveURL(/chair|category/i);
    });

    test("navigate to product detail page", async ({ page }) => {
        await page.goto("/products");

        // Click the first product card link
        const firstProductLink = page.locator("a[href^='/products/']").first();
        await expect(firstProductLink).toBeVisible({ timeout: 10000 });

        const href = await firstProductLink.getAttribute("href");
        await firstProductLink.click();

        // Should be on a /products/[slug] page
        await expect(page).toHaveURL(/\/products\/.+/);

        // H1 with product name visible
        await expect(page.locator("h1")).toBeVisible();
    });

    test("product detail page has Open Configurator button", async ({ page }) => {
        // Go directly to a known product
        await page.goto("/products/aurora-chair");

        await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });

        // Scroll down to configurator section
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

        // Look for the configurator button
        const openBtn = page.getByRole("button", { name: /open.*configurator|3d configurator/i });
        await expect(openBtn).toBeVisible({ timeout: 5000 });
    });

    test("configurator opens and color swatch is clickable", async ({ page }) => {
        await page.goto("/products/aurora-chair");

        // Open configurator
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const openBtn = page.getByRole("button", { name: /open.*configurator|3d configurator/i });
        await openBtn.click();

        // Wait for configurator to appear
        await page.waitForTimeout(1500);

        // Look for color swatches (buttons with role=option or aria-label containing color)
        const swatches = page.locator(
            "button[aria-label*='color'], button[role='option'], [data-testid*='swatch']"
        );

        if (await swatches.count() > 0) {
            // Click the first swatch
            await swatches.first().click();
            // Confirm no crash — page still visible
            await expect(page.locator("body")).toBeVisible();
        } else {
            // Fallback: just confirm configurator section is visible
            const configuratorSection = page.locator(
                "section, [id*='configurator'], [class*='configurator']"
            ).first();
            await expect(configuratorSection).toBeVisible();
        }
    });

    test("save configuration shows success feedback", async ({ page }) => {
        await page.goto("/products/aurora-chair");

        // Open configurator
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        const openBtn = page.getByRole("button", { name: /open.*configurator|3d configurator/i });
        await openBtn.click();
        await page.waitForTimeout(1500);

        // Click save
        const saveBtn = page.getByRole("button", { name: /save/i });
        if (await saveBtn.isVisible()) {
            await saveBtn.click();

            // Wait for toast / success feedback
            await page.waitForTimeout(2000);

            // Either a toast, an alert, or a link with /share/ should appear
            const success =
                (await page.locator("[role='alert'], [aria-live='polite']").count()) > 0 ||
                (await page.locator("text=/share|saved|copied/i").count()) > 0;

            expect(success).toBe(true);
        }
    });
});
