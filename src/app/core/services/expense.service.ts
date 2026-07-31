/**
 * @file expense.service.ts
 * @description Core Expense Data Engine providing local-first IndexedDB CRUD operations via Dexie.js
 * and exposing Angular Reactive Signals for responsive UI integration.
 */

import { Injectable, signal, computed } from '@angular/core';
import { db } from '../db/app-database';
import { Expense, ExpenseFilter, FinancialSummary } from '../models/expense.model';
import { DEFAULT_CATEGORIES } from '../models/category.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  /** Reactive signal holding raw array of all expenses */
  private expensesSignal = signal<Expense[]>([]);

  /** Filter criteria signal for active queries */
  private filterSignal = signal<ExpenseFilter>({
    sortBy: 'date',
    sortDirection: 'desc'
  });

  /** Read-only reactive signal of all expenses */
  public readonly expenses = computed(() => this.expensesSignal());

  /** Read-only reactive signal of filtered expenses */
  public readonly filteredExpenses = computed(() => {
    const list = this.expensesSignal();
    const filter = this.filterSignal();

    return list.filter((item) => {
      // Search query filter (matches title or notes)
      if (filter.searchQuery) {
        const query = filter.searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query) ?? false;
        if (!matchesTitle && !matchesNotes) return false;
      }

      // Category filter
      if (filter.category && item.category !== filter.category) {
        return false;
      }

      // Payment method filter
      if (filter.paymentMethod && item.paymentMethod !== filter.paymentMethod) {
        return false;
      }

      // Start date filter
      if (filter.startDate && item.date < filter.startDate) {
        return false;
      }

      // End date filter
      if (filter.endDate && item.date > filter.endDate) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const field = filter.sortBy || 'date';
      const dir = filter.sortDirection === 'asc' ? 1 : -1;

      if (field === 'amount') {
        return (a.amount - b.amount) * dir;
      }
      if (field === 'title') {
        return a.title.localeCompare(b.title) * dir;
      }
      // Default: date sorting
      return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
    });
  });

  /** Computed financial summary calculations for metrics & charts */
  public readonly financialSummary = computed<FinancialSummary>(() => {
    const list = this.expensesSignal();
    const totalSpent = list.reduce((sum, item) => sum + Number(item.amount), 0);
    const transactionCount = list.length;

    // Current Month Calculation
    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlySpent = list
      .filter((item) => item.date.startsWith(currentMonthPrefix))
      .reduce((sum, item) => sum + Number(item.amount), 0);

    // Category Breakdown Calculation
    const categoryMap = new Map<string, number>();
    list.forEach((item) => {
      const current = categoryMap.get(item.category) || 0;
      categoryMap.set(item.category, current + Number(item.amount));
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([catName, amount]) => {
      const matched = DEFAULT_CATEGORIES.find((c) => c.name === catName);
      return {
        category: catName,
        amount,
        color: matched?.color || '#94a3b8',
        percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0
      };
    }).sort((a, b) => b.amount - a.amount);

    return {
      totalSpent,
      monthlySpent,
      transactionCount,
      categoryBreakdown
    };
  });

  constructor() {
    this.refreshExpenses();
  }

  /**
   * Reload expenses from Dexie IndexedDB into Signals state
   */
  async refreshExpenses(): Promise<void> {
    try {
      const items = await db.expenses.orderBy('date').reverse().toArray();
      this.expensesSignal.set(items);
    } catch (error) {
      console.error('Failed to load expenses from IndexedDB:', error);
    }
  }

  /**
   * Set filter criteria for expense querying
   */
  setFilter(filter: Partial<ExpenseFilter>): void {
    this.filterSignal.update((prev) => ({ ...prev, ...filter }));
  }

  /**
   * Add new expense transaction to IndexedDB
   */
  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const timestamp = new Date().toISOString();
    const newRecord: Expense = {
      ...expense,
      createdAt: timestamp,
      updatedAt: timestamp
    };

    const id = await db.expenses.add(newRecord);
    await this.refreshExpenses();
    return id;
  }

  /**
   * Update existing expense record by primary key ID
   */
  async updateExpense(id: number, changes: Partial<Expense>): Promise<void> {
    const updatedAt = new Date().toISOString();
    await db.expenses.update(id, { ...changes, updatedAt });
    await this.refreshExpenses();
  }

  /**
   * Delete expense record by primary key ID
   */
  async deleteExpense(id: number): Promise<void> {
    await db.expenses.delete(id);
    await this.refreshExpenses();
  }

  /**
   * Clear all expense records from database
   */
  async clearAllExpenses(): Promise<void> {
    await db.expenses.clear();
    await this.refreshExpenses();
  }
}
