/**
 * @file app-database.ts
 * @description Dexie.js (IndexedDB wrapper) database configuration for local-first storage.
 */

import Dexie, { Table } from 'dexie';
import { Expense } from '../models/expense.model';
import { Category, DEFAULT_CATEGORIES } from '../models/category.model';
import { Account, DEFAULT_ACCOUNTS } from '../models/account.model';

export class AppDatabase extends Dexie {
  expenses!: Table<Expense, number>;
  categories!: Table<Category, number>;
  accounts!: Table<Account, number>;

  constructor() {
    super('FinczExpenseTrackerDB');

    // Version 1 — original schema
    this.version(1).stores({
      expenses: '++id, title, amount, category, date, paymentMethod, createdAt',
      categories: '++id, &name, isDefault',
    });

    // Version 2 — add 'type' index for income/expense filtering
    this.version(2)
      .stores({
        expenses: '++id, title, amount, category, date, paymentMethod, type, createdAt',
        categories: '++id, &name, isDefault, type',
      })
      .upgrade(async (tx) => {
        // Migrate existing expenses to have type='expense'
        await tx
          .table('expenses')
          .toCollection()
          .modify((expense: any) => {
            if (!expense.type) {
              expense.type = 'expense';
            }
          });
        // Migrate existing categories to have type='expense'
        await tx
          .table('categories')
          .toCollection()
          .modify((cat: any) => {
            if (!cat.type) {
              cat.type = 'expense';
            }
          });
      });

    // Version 3 — sync category name changes and add new default categories for existing users
    this.version(3)
      .stores({
        expenses: '++id, title, amount, category, date, paymentMethod, type, createdAt',
        categories: '++id, &name, isDefault, type',
      })
      .upgrade(async (tx) => {
        // Rename shortened category names for existing users
        const renames: Record<string, string> = {
          'Food & Dining': 'Food',
          'Housing & Rent': 'Rent',
          Transportation: 'Transport',
          'Utilities & Bills': 'Bills',
          'Health & Fitness': 'Health',
          'Other Income': 'Other',
        };

        for (const [oldName, newName] of Object.entries(renames)) {
          // Update the category record itself
          await tx
            .table('categories')
            .where('name')
            .equals(oldName)
            .modify((cat: any) => {
              cat.name = newName;
            });

          // Also update any expenses that referenced the old category name
          await tx
            .table('expenses')
            .where('category')
            .equals(oldName)
            .modify((exp: any) => {
              exp.category = newName;
            });
        }

        // Add new categories that did not exist before (only if not already present)
        const newCategories = [
          { name: 'Transfer', icon: '🔄', color: '#6366f1', type: 'expense', isDefault: true },
          { name: 'Rental', icon: '🏘️', color: '#457b9d', type: 'income', isDefault: true },
          { name: 'Pension', icon: '👴', color: '#8338ec', type: 'income', isDefault: true },
        ];

        for (const cat of newCategories) {
          const exists = await tx.table('categories').where('name').equals(cat.name).count();
          if (exists === 0) {
            await tx.table('categories').add(cat);
          }
        }
      });

    // Version 4 — add Dividend & Bank Interest income categories for existing users
    this.version(4)
      .stores({
        expenses: '++id, title, amount, category, date, paymentMethod, type, createdAt',
        categories: '++id, &name, isDefault, type',
      })
      .upgrade(async (tx) => {
        const v4Categories = [
          { name: 'Dividend', icon: '🪙', color: '#f4a261', type: 'income', isDefault: true },
          { name: 'Bank Interest', icon: '🏦', color: '#2a9d8f', type: 'income', isDefault: true },
        ];

        for (const cat of v4Categories) {
          const exists = await tx.table('categories').where('name').equals(cat.name).count();
          if (exists === 0) {
            await tx.table('categories').add(cat);
          }
        }
      });

    // Version 5 — add accounts table
    this.version(5)
      .stores({
        expenses: '++id, title, amount, category, date, paymentMethod, type, createdAt',
        categories: '++id, &name, isDefault, type',
        accounts: '++id, &name, type',
      })
      .upgrade(async (tx) => {
        for (const acc of DEFAULT_ACCOUNTS) {
          const exists = await tx.table('accounts').where('name').equals(acc.name).count();
          if (exists === 0) {
            await tx.table('accounts').add(acc);
          }
        }
      });

    // Version 6 — fix income category types (Salary, Income, Freelance, Business, Investment, etc.) in IndexedDB
    this.version(6)
      .stores({
        expenses: '++id, title, amount, category, date, paymentMethod, type, createdAt',
        categories: '++id, &name, isDefault, type',
        accounts: '++id, &name, type',
      })
      .upgrade(async (tx) => {
        const incomeCategoryNames = [
          'Salary', 'Freelance', 'Business', 'Investment',
          'Dividend', 'Bank Interest', 'Gift', 'Rental', 'Pension', 'Other Income', 'Income'
        ];

        await tx
          .table('categories')
          .toCollection()
          .modify((cat: any) => {
            if (incomeCategoryNames.includes(cat.name)) {
              cat.type = 'income';
            }
          });
      });

    // Version 7 — remove legacy 'Salary & Income' category or migrate it to type: 'income'
    this.version(7)
      .stores({
        expenses: '++id, title, amount, category, date, paymentMethod, type, createdAt',
        categories: '++id, &name, isDefault, type',
        accounts: '++id, &name, type',
      })
      .upgrade(async (tx) => {
        // Delete legacy category named 'Salary & Income' if it exists
        await tx.table('categories').where('name').equals('Salary & Income').delete();
        // Also update any expenses using category 'Salary & Income' to 'Salary'
        await tx
          .table('expenses')
          .where('category')
          .equals('Salary & Income')
          .modify((exp: any) => {
            exp.category = 'Salary';
          });
      });

    this.on('populate', async () => {
      await this.categories.bulkAdd(DEFAULT_CATEGORIES);
      await this.accounts.bulkAdd(DEFAULT_ACCOUNTS);
    });
  }
}

export const db = new AppDatabase();
