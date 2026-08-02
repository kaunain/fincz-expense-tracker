/**
 * @file category.model.ts
 * @description Data model and default presets for Expense and Income Categories.
 *
 * Expanded Income presets:
 * - Salary 💼
 * - Freelance 💻
 * - Business 🏢
 * - Investment 📈
 * - Dividend 🪙
 * - Bank Interest 🏦
 * - Gift 🎁
 * - Rental 🏘️
 * - Pension 👴
 * - Other 💰
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
  { name: 'Transfer', icon: '🔄', color: '#6366f1', type: 'expense', isDefault: true },

  // --- Income categories ---
  { name: 'Salary', icon: '💼', color: '#06d6a0', type: 'income', isDefault: true },
  { name: 'Freelance', icon: '💻', color: '#118ab2', type: 'income', isDefault: true },
  { name: 'Business', icon: '🏢', color: '#073b4c', type: 'income', isDefault: true },
  { name: 'Investment', icon: '📈', color: '#2ec4b6', type: 'income', isDefault: true },
  { name: 'Dividend', icon: '🪙', color: '#f4a261', type: 'income', isDefault: true },
  { name: 'Bank Interest', icon: '🏦', color: '#2a9d8f', type: 'income', isDefault: true },
  { name: 'Gift', icon: '🎁', color: '#e76f51', type: 'income', isDefault: true },
  { name: 'Rental', icon: '🏘️', color: '#457b9d', type: 'income', isDefault: true },
  { name: 'Pension', icon: '👴', color: '#8338ec', type: 'income', isDefault: true },
  { name: 'Other', icon: '💰', color: '#264653', type: 'income', isDefault: true },
];
