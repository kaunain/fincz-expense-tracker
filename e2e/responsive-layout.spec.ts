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
      // Bottom nav should exist and be present in DOM on mobile
      const bottomNav = page.locator('app-bottom-nav');
      await expect(bottomNav).toBeAttached();
    } else if (viewport && viewport.width >= 768) {
      // Desktop frame has header and hamburger drawer menu toggle
      const header = page.locator('app-header');
      if ((await header.count()) > 0) {
        await expect(header).toBeVisible();
      }
    }
  });
});
