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
   * Import backup JSON file, validate structure, and populate IndexedDB
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

          // Clear existing data and import backup
          await db.expenses.clear();
          
          // Strip auto-generated primary key IDs for clean re-insertion if needed
          const sanitizedExpenses = payload.expenses.map(({ id, ...rest }) => rest as Expense);
          await db.expenses.bulkAdd(sanitizedExpenses);

          if (payload.categories && Array.isArray(payload.categories)) {
            const sanitizedCategories = payload.categories.map(({ id, ...rest }) => rest as Category);
            // Ignore duplicate names during category import
            await db.categories.bulkPut(sanitizedCategories);
          }

          await this.expenseService.refreshExpenses();
          await this.categoryService.initCategories();

          resolve({
            success: true,
            importedCount: sanitizedExpenses.length,
            message: `Successfully imported ${sanitizedExpenses.length} transactions!`
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
