/**
 * @file import-export.service.ts
 * @description Service to handle JSON export and import for Local-First data backup and portability.
 */

import { Injectable, inject } from '@angular/core';
import { db } from '../db/app-database';
import { ExpenseService } from './expense.service';
import { CategoryService } from './category.service';
import { Expense } from '../models/expense.model';
import { Category } from '../models/category.model';

export interface BackupPayload {
  app: string;
  version: string;
  exportedAt: string;
  expenses: Expense[];
  categories: Category[];
}

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);

  /**
   * Export all local database content into a formatted JSON backup file
   */
  async exportData(): Promise<void> {
    const expenses = await db.expenses.toArray();
    const categories = await db.categories.toArray();

    const payload: BackupPayload = {
      app: 'Fincz Expense Tracker',
      version: '0.2.0',
      exportedAt: new Date().toISOString(),
      expenses,
      categories
    };

    const jsonString = JSON.stringify(payload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `fincz-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);
  }

  /**
   * Import backup JSON file, validate structure, and populate IndexedDB without ConstraintErrors
   */
  async importData(file: File): Promise<{ success: boolean; importedCount: number; message: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const payload: BackupPayload = JSON.parse(content);

          if (!payload.expenses || !Array.isArray(payload.expenses)) {
            return resolve({
              success: false,
              importedCount: 0,
              message: 'Invalid backup format: Missing expenses array.'
            });
          }

          // Clear existing expenses and categories to prevent unique index ConstraintError
          await db.transaction('rw', [db.expenses, db.categories], async () => {
            await db.expenses.clear();
            await db.categories.clear();

            // Import expenses
            const sanitizedExpenses = payload.expenses.map(({ id, ...rest }) => rest as Expense);
            if (sanitizedExpenses.length > 0) {
              await db.expenses.bulkAdd(sanitizedExpenses);
            }

            // Deduplicate categories by name
            if (payload.categories && Array.isArray(payload.categories) && payload.categories.length > 0) {
              const uniqueCategoriesMap = new Map<string, Category>();
              for (const cat of payload.categories) {
                if (cat.name && !uniqueCategoriesMap.has(cat.name)) {
                  const { id, ...rest } = cat;
                  uniqueCategoriesMap.set(cat.name, rest as Category);
                }
              }
              const sanitizedCategories = Array.from(uniqueCategoriesMap.values());
              await db.categories.bulkAdd(sanitizedCategories);
            }
          });

          await this.categoryService.initCategories();
          await this.expenseService.refreshExpenses();

          const count = payload.expenses.length;
          resolve({
            success: true,
            importedCount: count,
            message: `Successfully imported ${count} transactions!`
          });
        } catch (error) {
          resolve({
            success: false,
            importedCount: 0,
            message: `Failed to parse backup file: ${(error as Error).message}`
          });
        }
      };

      reader.onerror = () => {
        reject(new Error('Failed to read file.'));
      };

      reader.readAsText(file);
    });
  }
}
