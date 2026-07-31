/**
 * @file expense.model.ts
 * @description Expense entity definition, filter criteria, and summary statistics models.
 */

export type PaymentMethod = 'Cash' | 'Credit Card' | 'Debit Card' | 'UPI' | 'Bank Transfer' | 'Other';

export interface Expense {
  /** Auto-incremented primary key in Dexie.js (IndexedDB) */
  id?: number;

  /** Title or short description of the transaction */
  title: string;

  /** Monetary value of the expense (positive number) */
  amount: number;

  /** Name of the category (maps to Category.name) */
  category: string;

  /** Transaction date in ISO format string (YYYY-MM-DD) */
  date: string;

  /** Payment method used for the expense */
  paymentMethod: PaymentMethod;

  /** Optional detailed notes or tags */
  notes?: string;

  /** ISO Timestamp when the record was created */
  createdAt: string;

  /** ISO Timestamp when the record was last modified */
  updatedAt: string;
}

/**
 * Filter object used to query expenses in the UI
 */
export interface ExpenseFilter {
  searchQuery?: string;
  category?: string;
  paymentMethod?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'date' | 'amount' | 'title';
  sortDirection?: 'asc' | 'desc';
}

/**
 * Aggregated summary stats for dashboard widgets
 */
export interface FinancialSummary {
  totalSpent: number;
  monthlySpent: number;
  transactionCount: number;
  categoryBreakdown: { category: string; amount: number; color: string; percentage: number }[];
}
