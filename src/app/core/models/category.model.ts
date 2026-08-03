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

import appConfig from '../config/app-config.json';

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

export const DEFAULT_CATEGORIES: Omit<Category, 'id'>[] = appConfig.categories as Omit<Category, 'id'>[];
