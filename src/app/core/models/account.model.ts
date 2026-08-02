/**
 * @file account.model.ts
 * @description Data model and default account presets (Cash, Bank, UPI, Credit/Debit Cards).
 */

export interface Account {
  id?: number;
  name: string;
  type: 'cash' | 'bank' | 'upi' | 'card' | 'other';
  icon: string;
  color: string;
  initialBalance: number;
  currentBalance?: number;
}

export const DEFAULT_ACCOUNTS: Omit<Account, 'id'>[] = [
  { name: 'Cash', type: 'cash', icon: '💵', color: '#10b981', initialBalance: 0 },
  { name: 'Bank Transfer', type: 'bank', icon: '🏦', color: '#2563eb', initialBalance: 0 },
  { name: 'UPI', type: 'upi', icon: '📱', color: '#8b5cf6', initialBalance: 0 },
  { name: 'Credit Card', type: 'card', icon: '💳', color: '#ef4444', initialBalance: 0 },
  { name: 'Debit Card', type: 'card', icon: '💳', color: '#06b6d4', initialBalance: 0 },
];
