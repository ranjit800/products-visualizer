import { test, expect } from "@playwright/test";

test.describe("Product Visualizer Flow", () => {
    test("should navigate from catalog to product and change configuration", async ({ page }) => {
        // 1. Start at the products catalog
        console.log("Navigating to /products...");
        await page.goto("/products", { waitUntil: "networkidle" });
        // Use a more specific selector for the main page header
        await expect(page.getByRole('heading', { name: /^Products$/i, level: 1 })).toBeVisible();

        // 2. Select the first product (Aurora Chair)
        console.log("Selecting product...");
        // Find link by text or aria-label. Product names are inside h1s too in the catalog.
        const auroraLink = page.getByRole('link', { name: /Aurora Chair/i });
        await expect(auroraLink).toBeVisible();
        await auroraLink.click();

        // 3. Verify we are on the product page
        console.log("Verifying product page...");
        await expect(page).toHaveURL(/.*\/products\/aurora-chair/);
        // On the product page, the main product name is the h1
        await expect(page.getByRole('heading', { name: /Aurora Chair/i, level: 1 })).toBeVisible();

        // 4. Change a material color
        console.log("Changing color...");
        // Our color swatches in DesktopViewer use title={c.label}
        const colorSwatches = page.locator("button[title]");
        await expect(colorSwatches.first()).toBeVisible();
        await colorSwatches.nth(1).click();

        // 5. Save and Share
        console.log("Clicking Save & Share...");
        const saveButton = page.getByRole("button", { name: /Save & Share/i });
        await expect(saveButton).toBeVisible();
        await saveButton.click();

        // 6. Verify success message
        console.log("Waiting for success message...");
        // The message is "✓ Link copied!"
        await expect(page.locator("text=✓ Link copied!")).toBeVisible({ timeout: 10000 });
        console.log("Test finished successfully!");
    });
});
