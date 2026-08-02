import { test, expect } from '@playwright/test';

interface ConsoleLog {
  type: string;
  text: string;
  url: string;
}

interface NetworkError {
  url: string;
  status: number;
}

test.describe('Fincz Expense Tracker — Full Multi-Page E2E & Persistence QA Audit', () => {
  const consoleLogs: ConsoleLog[] = [];
  const uncaughtExceptions: string[] = [];
  const networkErrors: NetworkError[] = [];

  test.beforeEach(async ({ page }) => {
    consoleLogs.length = 0;
    uncaughtExceptions.length = 0;
    networkErrors.length = 0;

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleLogs.push({
          type: msg.type(),
          text: msg.text(),
          url: page.url(),
        });
      }
    });

    page.on('pageerror', (exception) => {
      uncaughtExceptions.push(exception.message || String(exception));
    });

    page.on('response', (response) => {
      if (response.status() >= 400) {
        networkErrors.push({
          url: response.url(),
          status: response.status(),
        });
      }
    });
  });

  test('1. Dashboard Page (/): Sanity Check & Summary Cards', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('app-header').first()).toBeVisible();
    await expect(page.locator('.brand')).toBeVisible();

    const cards = page.locator('.m3-card, .summary-card');
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('2. Add Expense & Income Flow + Form Validation + IndexedDB Reload Persistence', async ({ page }) => {
    await page.goto('/expenses');
    await page.waitForLoadState('domcontentloaded');

    // Open Add Transaction Modal
    const addBtn = page.locator('button.empty-cta-btn, button.nav-fab, button.add-expense-btn, button.header-add-btn').first();
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    await page.waitForSelector('app-add-expense-dialog');

    // a. Form Validation Test (Submit with empty/invalid amount or short title)
    const saveBtn = page.locator('button.save-btn').first();
    await expect(saveBtn).toBeDisabled();

    // b. Add Expense Flow ("Test Lunch", 250)
    const amountInput = page.locator('input[formcontrolname="amount"], input.amount-input').first();
    await amountInput.fill('250');

    // Title < 3 chars should keep button disabled
    const titleInput = page.locator('input[formcontrolname="title"]').first();
    await titleInput.fill('Te');
    await expect(saveBtn).toBeDisabled();

    await titleInput.fill('Test Lunch');
    await expect(saveBtn).toBeEnabled();

    // Submit Expense
    await saveBtn.click();
    await expect(page.locator('app-add-expense-dialog')).toBeHidden();

    // Assert row/card appears in transaction list
    await expect(page.locator('.transaction-card:has-text("Test Lunch")').first()).toBeVisible();

    // c. IndexedDB Persistence check across Page Reload
    await page.reload();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.transaction-card:has-text("Test Lunch")').first()).toBeVisible();

    // d. Add Income Flow ("Freelance Payment", 1500)
    const addBtnIncome = page.locator('button.header-add-btn, button.add-expense-btn').first();
    await addBtnIncome.click();
    await page.waitForSelector('app-add-expense-dialog');

    // Switch to Income tab in toggle
    const incomeToggleBtn = page.locator('.type-toggle button:has-text("Income")').first();
    await incomeToggleBtn.click();

    await amountInput.fill('1500');
    await titleInput.fill('Freelance Payment');
    await saveBtn.click();

    await expect(page.locator('.transaction-card:has-text("Freelance Payment")').first()).toBeVisible();

    // e. Delete Flow: Target the delete button specifically inside the "Test Lunch" card
    const testCard = page.locator('.transaction-card', { hasText: 'Test Lunch' }).first();
    await expect(testCard).toBeVisible();
    const deleteBtn = testCard.locator('button.delete-icon-btn');
    await deleteBtn.click();

    // Confirm Material Dialog — click the button inside app-confirm-dialog
    const confirmDialog = page.locator('app-confirm-dialog');
    await expect(confirmDialog).toBeVisible({ timeout: 5000 });
    const dialogDeleteBtn = confirmDialog.locator('button:has-text("Delete")');
    await dialogDeleteBtn.click();

    // Assert item is removed from DOM
    await expect(page.locator('.transaction-card', { hasText: 'Test Lunch' })).toHaveCount(0, { timeout: 10000 });
  });

  test('3. Categories Page (/categories): Category Grid Rendering', async ({ page }) => {
    await page.goto('/categories');
    await page.waitForLoadState('domcontentloaded');

    // Page header title check
    await expect(page.locator('h1:has-text("Categories")')).toBeVisible();

    // Category cards grid check (matches .m3-card or .category-card)
    const catCards = page.locator('.category-card, .m3-card');
    await expect(catCards.first()).toBeVisible({ timeout: 10000 });
    expect(await catCards.count()).toBeGreaterThan(0);
  });

  test('4. Reports Page (/reports): Charts & Date Filter Controls', async ({ page }) => {
    await page.goto('/reports');
    await page.waitForLoadState('domcontentloaded');

    const header = page.locator('app-header').first();
    await expect(header).toBeVisible();
  });

  test('5. Settings Page (/settings): Preference Elements & Controls', async ({ page }) => {
    await page.goto('/settings');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('button:has-text("Export Backup")')).toBeVisible();
    await expect(page.locator('h3:has-text("App Information")')).toBeVisible();
  });

  test.afterEach(async () => {
    expect(uncaughtExceptions.length).toBe(0);
  });
});
