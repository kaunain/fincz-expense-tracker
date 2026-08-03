/**
 * @file category.service.ts
 * @description Service to manage category operations in IndexedDB via Dexie with Angular Signals state.
 */

import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { db } from '../db/app-database';
import { Category, DEFAULT_CATEGORIES } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private platformId = inject(PLATFORM_ID);

  /** Signal holding all loaded categories */
  private categoriesSignal = signal<Category[]>([]);

  /** Read-only public signal accessor */
  public readonly categories = computed(() => this.categoriesSignal());

  constructor() {
    this.initCategories();
  }

  /**
   * Initializes category store and seeds default items if DB is empty
   */
  async initCategories(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      let items = await db.categories.toArray();
      if (items.length === 0) {
        await db.categories.bulkAdd(DEFAULT_CATEGORIES);
        items = await db.categories.toArray();
      } else {
        // Migration check for existing databases: ensure Salary & Income categories have type: 'income'
        const incomeNames = ['Salary', 'Freelance', 'Business', 'Investment', 'Dividend', 'Bank Interest', 'Gift', 'Rental', 'Pension', 'Income', 'Other'];
        let updated = false;
        for (const item of items) {
          if (incomeNames.includes(item.name) && item.type !== 'income') {
            item.type = 'income';
            if (item.id) {
              await db.categories.update(item.id, { type: 'income' });
            }
            updated = true;
          }
        }
        if (updated) {
          items = await db.categories.toArray();
        }
      }

      // Hard safety check: assign type based on DEFAULT_CATEGORIES map if type is undefined/wrong
      const defaultTypeMap = new Map(DEFAULT_CATEGORIES.map((c) => [c.name, c.type]));
      items = items.map((cat) => {
        const expectedType = defaultTypeMap.get(cat.name);
        if (expectedType && cat.type !== expectedType) {
          return { ...cat, type: expectedType };
        }
        return cat;
      });

      this.categoriesSignal.set(items);
    } catch (error) {
      console.error('Failed to initialize categories:', error);
    }
  }

  /**
   * Add a custom new category to local database
   */
  async addCategory(category: Omit<Category, 'id'>): Promise<number> {
    const id = await db.categories.add(category as Category);
    await this.initCategories();
    return id;
  }

  /**
   * Delete a custom category by ID (Default categories protected)
   */
  async deleteCategory(id: number): Promise<void> {
    const category = await db.categories.get(id);
    if (category?.isDefault) {
      throw new Error('Cannot delete system default category.');
    }
    await db.categories.delete(id);
    await this.initCategories();
  }
}
