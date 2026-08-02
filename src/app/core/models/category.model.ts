/**
 * @file category.model.ts
 * @description Data model and default presets for Expense and Income Categories.
 *
 * Changes:
 * - Shortened some category names for better display on small screens
 * - Added 'Transfer' category (used by the money-transfer feature in Settings)
 * - Added 'Rental' and 'Pension' income categories
 */

export interface Category {
  id?: number;
  name: string;
  icon: string;
  color: string;
  /** 'expense' or 'income' — determines which tab shows this category */
  type?: 'expense' | 'income';
  isDefault?: boolean;
  budgetLimit?: number;
}

/**
 * DEFAULT_CATEGORIES — seeded when the database is first created (fresh install).
 *
 * IMPORTANT: Changes here only affect NEW users.
 * For existing users, add a DB version migration in app-database.ts to sync these changes.
 */
export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = [
  // --- Expense categories ---
  { name: 'Food', icon: '🍔', color: '#ff6b6b', type: 'expense', isDefault: true },
  { name: 'Rent', icon: '🏠', color: '#4ecdc4', type: 'expense', isDefault: true },
  { name: 'Transport', icon: '🚗', color: '#ffe66d', type: 'expense', isDefault: true },
  { name: 'Bills', icon: '⚡', color: '#1a535c', type: 'expense', isDefault: true },
  { name: 'Entertainment', icon: '🎬', color: '#9b5de5', type: 'expense', isDefault: true },
  { name: 'Shopping', icon: '🛍️', color: '#f15bb5', type: 'expense', isDefault: true },
  { name: 'Health', icon: '❤️', color: '#00bbf9', type: 'expense', isDefault: true },
  { name: 'Education', icon: '📚', color: '#f77f00', type: 'expense', isDefault: true },
  { name: 'Travel', icon: '✈️', color: '#7209b7', type: 'expense', isDefault: true },
  { name: 'Miscellaneous', icon: '📦', color: '#6c757d', type: 'expense', isDefault: true },
  // Transfer is used internally when moving money between payment accounts
  { name: 'Transfer', icon: '🔄', color: '#6366f1', type: 'expense', isDefault: true },

  // --- Income categories ---
  { name: 'Salary', icon: '💼', color: '#06d6a0', type: 'income', isDefault: true },
  { name: 'Freelance', icon: '💻', color: '#118ab2', type: 'income', isDefault: true },
  { name: 'Business', icon: '🏢', color: '#073b4c', type: 'income', isDefault: true },
  { name: 'Investment', icon: '📈', color: '#2ec4b6', type: 'income', isDefault: true },
  { name: 'Gift', icon: '🎁', color: '#e76f51', type: 'income', isDefault: true },
  { name: 'Rental', icon: '🏘️', color: '#457b9d', type: 'income', isDefault: true },
  { name: 'Pension', icon: '👴', color: '#8338ec', type: 'income', isDefault: true },
  { name: 'Other', icon: '💰', color: '#264653', type: 'income', isDefault: true },
];
