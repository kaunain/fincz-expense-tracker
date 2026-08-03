/**
 * @file expense.model.ts
 * @description Expense entity definition, filter criteria, and summary statistics models.
 */

export type PaymentMethod = string;
export type TransactionType = 'expense' | 'income';

export interface Expense {
  id?: number;
  /** 'expense' or 'income' — determines sign and color in UI */
  type: TransactionType;
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFilter {
  searchQuery?: string;
  category?: string;
  paymentMethod?: string;
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  /** 'today' | 'week' | 'month' | 'all' */
  dateRange?: 'today' | 'week' | 'month' | 'all';
  sortBy?: 'date' | 'amount' | 'title';
  sortDirection?: 'asc' | 'desc';
}

export interface FinancialSummary {
  totalSpent: number;
  totalIncome: number;
  netBalance: number;
  monthlySpent: number;
  monthlyIncome: number;
  transactionCount: number;
  categoryBreakdown: { category: string; amount: number; color: string; percentage: number }[];
}
