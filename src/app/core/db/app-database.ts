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
      categories: '++id, &name, isDefault'
    });

    // Version 2 — add 'type' index for income/expense filtering
    this.version(2).stores({
      expenses: '++id, title, amount, category, date, paymentMethod, type, createdAt',
      categories: '++id, &name, isDefault, type'
    }).upgrade(async tx => {
      // Migrate existing expenses to have type='expense'
      await tx.table('expenses').toCollection().modify((expense: any) => {
        if (!expense.type) {
          expense.type = 'expense';
        }
      });
      // Migrate existing categories to have type='expense'
      await tx.table('categories').toCollection().modify((cat: any) => {
        if (!cat.type) {
          cat.type = 'expense';
        }
      });
    });

    this.on('populate', async () => {
      await this.categories.bulkAdd(DEFAULT_CATEGORIES);
    });
  }
}

export const db = new AppDatabase();
