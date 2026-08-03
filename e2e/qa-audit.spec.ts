import { test, expect } from '@playwright/test';

interface ConsoleLog {
  type: string;
  text: string;
  location?: string;
}

test.describe('Fincz Expense Tracker - E2E QA Crawl & Audit', () => {
  const consoleErrors: ConsoleLog[] = [];
  const uncaughtExceptions: string[] = [];

  test.beforeEach(async ({ page }) => {
    consoleErrors.length = 0;
    uncaughtExceptions.length = 0;

    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        consoleErrors.push({
          type: msg.type(),
          text: msg.text(),
          location: msg.location().url,
        });
      }
    });

    page.on('pageerror', (exception) => {
      uncaughtExceptions.push(exception.message || String(exception));
    });
  });

  test('Route Navigation Crawl & Core Interaction Audit', async ({ page, baseURL }) => {
    const targetURL = baseURL || 'https://expense.fincz.com';

    // 1. Load Root Page
    await page.goto(targetURL);
    await page.waitForLoadState('domcontentloaded');

    // Verify Title
    const pageTitle = await page.title();
    expect(pageTitle).toContain('Fincz Expense Tracker');

    // 2. Navigate Routes: /, /expenses, /categories, /reports, /settings
    const routes = ['/', '/expenses', '/categories', '/reports', '/settings'];
    for (const route of routes) {
      await page.goto(`${targetURL}${route}`);
      await page.waitForLoadState('domcontentloaded');
      await expect(page.locator('app-header').first()).toBeVisible({ timeout: 10000 });
    }

    // 3. Test Form Inputs & Transaction Persist on /expenses
    await page.goto(`${targetURL}/expenses`);
    await page.waitForLoadState('domcontentloaded');

    // Check Quick Add / Add Expense Modal
    const addBtn = page
      .locator(
        'button.empty-cta-btn, button.nav-fab, button.add-expense-btn, button.header-add-btn'
      )
      .first();
    if (await addBtn.isVisible()) {
      await addBtn.click();
      await page.waitForSelector('app-add-expense-dialog', { timeout: 10000 });

      // Fill Form
      const amountInput = page
        .locator('input[formcontrolname="amount"], input.amount-input')
        .first();
      await amountInput.fill('150.50');

      const titleInput = page.locator('input[formcontrolname="notes"]').first();
      await titleInput.fill('QA Automated Test Expense');

      const saveBtn = page.locator('button.save-btn, button:has-text("Save Transaction")').first();
      await saveBtn.click();

      // Verify addition in transaction list
      await expect(page.locator('text=QA Automated Test Expense').first()).toBeVisible({
        timeout: 10000,
      });

      // Delete test expense
      const card = page.locator('.transaction-card:has-text("QA Automated Test Expense")').first();
      if (await card.isVisible()) {
        const deleteBtn = card.locator('button.delete-icon-btn');
        await deleteBtn.click();

        // Confirm dialog if pops up
        const confirmBtn = page.locator('app-confirm-dialog button:has-text("Delete")').first();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
      }
    }

    // 4. Test Backup / Restore Triggers on /settings
    await page.goto(`${targetURL}/settings`);
    await page.waitForLoadState('domcontentloaded');
    const exportBtn = page.locator('button:has-text("Export Backup")').first();
    await expect(exportBtn).toBeVisible({ timeout: 10000 });

    // Check for Console Errors
    if (consoleErrors.length > 0) {
      console.log('Detected Console Log/Warning/Errors:', JSON.stringify(consoleErrors, null, 2));
    }
    if (uncaughtExceptions.length > 0) {
      console.log('Detected Uncaught Exceptions:', JSON.stringify(uncaughtExceptions, null, 2));
    }

    expect(uncaughtExceptions.length).toBe(0);
  });
});
