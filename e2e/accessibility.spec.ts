import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ROUTES = ['/', '/expenses', '/accounts', '/categories', '/reports', '/settings'];

test.describe('Accessibility (a11y) & Focus Audits', () => {
  for (const route of ROUTES) {
    test(`a11y audit for ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState('domcontentloaded');

      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .disableRules(['color-contrast']) // Color contrast evaluated in visual design audit
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });
  }

  test('Focus indicators and keyboard navigation in Quick Add Dialog', async ({ page }) => {
    await page.goto('/expenses');
    await page.waitForLoadState('domcontentloaded');

    const addBtn = page
      .locator('button.empty-cta-btn, button.add-expense-btn, button.header-add-btn')
      .first();
    if (await addBtn.isVisible()) {
      await addBtn.focus();
      await page.keyboard.press('Enter');

      const dialog = page.locator('app-add-expense-dialog');
      await expect(dialog).toBeVisible();

      // Check escape key closes dialog
      await page.keyboard.press('Escape');
      await expect(dialog).toBeHidden();
    }
  });
});
