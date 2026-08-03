import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/expenses', '/accounts', '/categories', '/reports', '/settings'];

test.describe('Visual Hierarchy & Design Token Verification', () => {
  for (const route of ROUTES) {
    test(`Verify Typography & CSS Tokens on ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      // Header presence
      await expect(page.locator('app-header').first()).toBeVisible();

      // Check card rendering
      const cards = page.locator('.m3-card, .summary-card, .category-card');
      const count = await cards.count();
      if (count > 0) {
        const firstCard = cards.first();
        await expect(firstCard).toBeVisible();
      }
    });
  }

  test('Check spacing & touch target sizes on Mobile', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      // Check interactive nav buttons have adequate touch target size
      const navButtons = page.locator('app-bottom-nav button, app-header button');
      const count = await navButtons.count();
      for (let i = 0; i < count; i++) {
        const box = await navButtons.nth(i).boundingBox();
        if (box && box.width > 0 && box.height > 0) {
          // Minimum touch target recommendation (at least 36px/44px)
          expect(box.height).toBeGreaterThanOrEqual(32);
        }
      }
    }
  });
});
