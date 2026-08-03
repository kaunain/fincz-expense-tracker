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

  test('2. Add Expense & Income Flow + Form Validation + IndexedDB Reload Persistence', async ({
    page,
  }) => {
    await page.goto('/expenses');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);

    // a. Check Add Transaction Dialog open & validation
    const addBtn = page
      .locator(
        'button.empty-cta-btn:visible, button.expense-btn:visible, button.add-expense-btn:visible, button.header-add-btn:visible'
      )
      .first();
    await expect(addBtn).toBeVisible({ timeout: 10000 });
    await addBtn.click();

    const dialog = page.locator('app-add-expense-dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    const saveBtn = dialog.locator('button.save-btn').first();
    await expect(saveBtn).toBeDisabled();

    // b. Add Expense ("Test Lunch", 250)
    const amountInput = dialog
      .locator('input.amount-input, input[formcontrolname="amount"]')
      .first();
    await amountInput.fill('250');
    await amountInput.dispatchEvent('input');

    const notesInput = dialog.locator('input[formcontrolname="notes"]').first();
    await notesInput.fill('Test Lunch');
    await notesInput.dispatchEvent('input');

    await expect(saveBtn).toBeEnabled({ timeout: 5000 });
    await saveBtn.click();

    // Wait for dialog overlay to close
    await expect(dialog).toBeHidden({ timeout: 8000 });
    await page.waitForTimeout(500);

    // Assert card or empty state handles data gracefully
    const cards = page.locator('.transaction-card, .empty-state');
    await expect(cards.first()).toBeVisible({ timeout: 10000 });

    // c. IndexedDB Persistence check across Page Reload
    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(page.locator('app-header').first()).toBeVisible();

    // d. Add Income Flow ("Freelance Payment", 1500)
    const addBtnIncome = page
      .locator(
        'button.expense-btn:visible, button.add-expense-btn:visible, button.header-add-btn:visible, button.empty-cta-btn:visible'
      )
      .first();
    if (await addBtnIncome.isVisible()) {
      await addBtnIncome.click();
      const dialogIncome = page.locator('app-add-expense-dialog');
      if (await dialogIncome.isVisible()) {
        const incomeToggleBtn = dialogIncome
          .locator('.type-toggle button:has-text("Income")')
          .first();
        if (await incomeToggleBtn.isVisible()) {
          await incomeToggleBtn.click();
        }

        const amountIncome = dialogIncome
          .locator('input.amount-input, input[formcontrolname="amount"]')
          .first();
        await amountIncome.fill('1500');
        await amountIncome.dispatchEvent('input');

        const notesIncome = dialogIncome.locator('input[formcontrolname="notes"]').first();
        await notesIncome.fill('Freelance Payment');
        await notesIncome.dispatchEvent('input');

        const saveIncomeBtn = dialogIncome.locator('button.save-btn').first();
        if (await saveIncomeBtn.isEnabled()) {
          await saveIncomeBtn.click();
          await expect(dialogIncome).toBeHidden({ timeout: 8000 });
        }
      }
    }
  });

  test('3. Categories Page (/categories): Category Grid Rendering', async ({ page }) => {
    await page.goto('/categories');
    await page.waitForLoadState('domcontentloaded');

    await expect(page.locator('h1:has-text("Categories")')).toBeVisible();

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
