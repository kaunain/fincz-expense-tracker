/**
 * @file expense.service.ts
 * @description Core Expense Data Engine with income/expense tracking via Dexie.js and Angular Signals.
 */

import { Injectable, signal, computed } from '@angular/core';
import { db } from '../db/app-database';
import { Expense, ExpenseFilter, FinancialSummary } from '../models/expense.model';
import { DEFAULT_CATEGORIES } from '../models/category.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private expensesSignal = signal<Expense[]>([]);

  private filterSignal = signal<ExpenseFilter>({
    sortBy: 'date',
    sortDirection: 'desc',
  });

  public readonly expenses = computed(() => this.expensesSignal());

  public readonly filteredExpenses = computed(() => {
    const list = this.expensesSignal();
    const filter = this.filterSignal();

    return list
      .filter((item) => {
        if (filter.searchQuery) {
          const query = filter.searchQuery.toLowerCase();
          const matchesTitle = item.title.toLowerCase().includes(query);
          const matchesNotes = item.notes?.toLowerCase().includes(query) ?? false;
          if (!matchesTitle && !matchesNotes) return false;
        }
        if (filter.category && item.category !== filter.category) return false;
        if (filter.paymentMethod && item.paymentMethod !== filter.paymentMethod) return false;
        if (filter.type && item.type !== filter.type) return false;

        // Date range filter
        if (filter.dateRange && filter.dateRange !== 'all') {
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const itemDate = new Date(item.date);
          if (filter.dateRange === 'today') {
            if (itemDate < today) return false;
          } else if (filter.dateRange === 'week') {
            const weekAgo = new Date(today);
            weekAgo.setDate(today.getDate() - 7);
            if (itemDate < weekAgo) return false;
          } else if (filter.dateRange === 'month') {
            const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            if (itemDate < monthStart) return false;
          }
        }

        if (filter.startDate && item.date < filter.startDate) return false;
        if (filter.endDate && item.date > filter.endDate) return false;

        return true;
      })
      .sort((a, b) => {
        const field = filter.sortBy || 'date';
        const dir = filter.sortDirection === 'asc' ? 1 : -1;
        if (field === 'amount') return (a.amount - b.amount) * dir;
        if (field === 'title') return a.title.localeCompare(b.title) * dir;
        return (new Date(a.date).getTime() - new Date(b.date).getTime()) * dir;
      });
  });

  public readonly financialSummary = computed<FinancialSummary>(() => {
    const list = this.expensesSignal();

    const expenses = list.filter((i) => i.type === 'expense' || !i.type);
    const incomes = list.filter((i) => i.type === 'income');

    const totalSpent = expenses.reduce((sum, i) => sum + Number(i.amount), 0);
    const totalIncome = incomes.reduce((sum, i) => sum + Number(i.amount), 0);
    const netBalance = totalIncome - totalSpent;
    const transactionCount = list.length;

    const now = new Date();
    const currentMonthPrefix = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const monthlySpent = expenses
      .filter((i) => i.date.startsWith(currentMonthPrefix))
      .reduce((sum, i) => sum + Number(i.amount), 0);
    const monthlyIncome = incomes
      .filter((i) => i.date.startsWith(currentMonthPrefix))
      .reduce((sum, i) => sum + Number(i.amount), 0);

    const categoryMap = new Map<string, number>();
    expenses.forEach((i) => {
      const current = categoryMap.get(i.category) || 0;
      categoryMap.set(i.category, current + Number(i.amount));
    });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([catName, amount]) => {
        const matched = DEFAULT_CATEGORIES.find((c) => c.name === catName);
        return {
          category: catName,
          amount,
          color: matched?.color || '#94a3b8',
          percentage: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);

    return {
      totalSpent,
      totalIncome,
      netBalance,
      monthlySpent,
      monthlyIncome,
      transactionCount,
      categoryBreakdown,
    };
  });

  constructor() {
    this.refreshExpenses();
  }

  async refreshExpenses(): Promise<void> {
    try {
      const items = await db.expenses.orderBy('date').reverse().toArray();
      this.expensesSignal.set(items);
    } catch (error) {
      console.error('Failed to load expenses from IndexedDB:', error);
    }
  }

  setFilter(filter: Partial<ExpenseFilter>): void {
    this.filterSignal.update((prev) => ({ ...prev, ...filter }));
  }

  async addExpense(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<number> {
    const timestamp = new Date().toISOString();
    const newRecord: Expense = {
      ...expense,
      type: expense.type ?? 'expense',
      createdAt: timestamp,
      updatedAt: timestamp,
    };
    const id = await db.expenses.add(newRecord);
    await this.refreshExpenses();
    return id;
  }

  async updateExpense(id: number, changes: Partial<Expense>): Promise<void> {
    const updatedAt = new Date().toISOString();
    await db.expenses.update(id, { ...changes, updatedAt });
    await this.refreshExpenses();
  }

  async deleteExpense(id: number): Promise<void> {
    await db.expenses.delete(id);
    await this.refreshExpenses();
  }

  async clearAllExpenses(): Promise<void> {
    await db.expenses.clear();
    await this.refreshExpenses();
  }
}
