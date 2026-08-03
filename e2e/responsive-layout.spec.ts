import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/expenses', '/accounts', '/categories', '/reports', '/settings'];

test.describe('Responsive Layout & Horizontal Scroll Audits', () => {
  for (const route of ROUTES) {
    test(`Verify no horizontal scroll/overflow on ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      const isHorizontalScrollable = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(isHorizontalScrollable).toBe(false);
    });
  }

  test('Breakpoint transition checks (< 768px vs >= 768px)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const viewport = page.viewportSize();
    if (viewport && viewport.width < 768) {
      // Bottom nav should be visible on mobile
      const bottomNav = page.locator('app-bottom-nav');
      if (await bottomNav.count() > 0) {
        await expect(bottomNav).toBeVisible();
      }
    } else if (viewport && viewport.width >= 768) {
      // Sidebar should be visible on desktop
      const sidebar = page.locator('app-sidebar');
      if (await sidebar.count() > 0) {
        await expect(sidebar).toBeVisible();
      }
    }
  });
});
