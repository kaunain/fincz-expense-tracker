/**
 * @file account.model.ts
 * @description Data model and default account presets (Cash, Bank, UPI, Credit/Debit Cards).
 */

import appConfig from '../config/app-config.json';

export interface Account {
  id?: number;
  name: string;
  type: 'cash' | 'bank' | 'upi' | 'card' | 'other';
  icon: string;
  color: string;
  initialBalance: number;
  currentBalance?: number;
}

export const DEFAULT_ACCOUNTS: Omit<Account, 'id'>[] = appConfig.accounts as Omit<Account, 'id'>[];
