/**
 * @file app-database.ts
 * @description Dexie.js (IndexedDB wrapper) database configuration for local-first storage.
 * 
 * Open-Source Customization Note:
 * To add new database tables or fields, update the schema definition inside the constructor.
 * Dexie handles indexed fields automatically based on comma-separated keys.
 */

import Dexie, { Table } from 'dexie';
import { Expense } from '../models/expense.model';
import { Category, DEFAULT_CATEGORIES } from '../models/category.model';

export class AppDatabase extends Dexie {
  /** Expenses IndexedDB Table */
  expenses!: Table<Expense, number>;

  /** Categories IndexedDB Table */
  categories!: Table<Category, number>;

  constructor() {
    super('FinczExpenseTrackerDB');

    // Define Dexie Schema & Indexes
    // ++id = Auto-increment primary key
    // Indexed fields: date, category, amount, title
    this.version(1).stores({
      expenses: '++id, title, amount, category, date, paymentMethod, createdAt',
      categories: '++id, &name, isDefault'
    });

    // Hook to pre-seed default categories on first database creation
    this.on('populate', async () => {
      await this.categories.bulkAdd(DEFAULT_CATEGORIES);
    });
  }
}

/** Singleton Database Instance */
export const db = new AppDatabase();
