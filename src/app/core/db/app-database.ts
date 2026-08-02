/**
 * @file app-database.ts
 * @description Dexie.js (IndexedDB wrapper) database configuration for local-first storage.
 */

import Dexie, { Table } from 'dexie';
import { Expense } from '../models/expense.model';
import { Category, DEFAULT_CATEGORIES } from '../models/category.model';

export class AppDatabase extends Dexie {
  expenses!: Table<Expense, number>;
  categories!: Table<Category, number>;

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

    this.on('populate', async () => {
      await this.categories.bulkAdd(DEFAULT_CATEGORIES);
    });
  }
}

export const db = new AppDatabase();
