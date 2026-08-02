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
      }
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
