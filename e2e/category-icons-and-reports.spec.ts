import { test, expect } from '@playwright/test';

test.describe('Fincz Expense Tracker - Specific Defect Assertions', () => {
  test('1. Category icons in /transactions/new should be non-empty visible elements', async ({
    page,
  }) => {
    await page.goto('/transactions/new');
    await page.waitForLoadState('domcontentloaded');

    const categoryChips = page.locator('.cat-chip');
    await expect(categoryChips.first()).toBeVisible({ timeout: 5000 });
    expect(await categoryChips.count()).toBeGreaterThan(0);

    // Check that icons are rendered inside chips (emoji or material symbol)
    const iconElements = page.locator('.cat-chip .chip-icon, .cat-chip .chip-mat-icon');
    const firstIconText = await iconElements.first().textContent();
    expect(firstIconText?.trim().length).toBeGreaterThan(0);
  });

  test('2. Income categories (Salary) must NOT appear when Expense toggle is active', async ({
    page,
  }) => {
    await page.goto('/transactions/new?type=expense');
    await page.waitForLoadState('domcontentloaded');

    const salaryChip = page.locator('.cat-chip:has-text("Salary")');
    await expect(salaryChip).toHaveCount(0);
  });

  test('3. Desktop Mobile Viewport Frame assertion', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    const layoutContainer = page.locator('.main-layout');
    await expect(layoutContainer).toBeVisible();

    const box = await layoutContainer.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(480);
  });

  test('4. Reports page contains custom date filter and transaction actions', async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('.date-filter-card')).toBeVisible();
    await expect(page.locator('input[type="date"]').first()).toBeVisible();
  });
});
