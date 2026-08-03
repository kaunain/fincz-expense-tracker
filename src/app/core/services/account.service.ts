/**
 * @file account.service.ts
 * @description Service managing accounts, balances, and calculations.
 */

import { Injectable, signal, computed, inject } from '@angular/core';
import { db } from '../db/app-database';
import { Account, DEFAULT_ACCOUNTS } from '../models/account.model';
import { ExpenseService } from './expense.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private expenseService = inject(ExpenseService);

  private accountsSignal = signal<Account[]>([]);
  public readonly accounts = computed(() => this.accountsSignal());

  public readonly totalWealth = computed(() => {
    return this.accountsWithBalances().reduce((sum, acc) => sum + (acc.currentBalance || 0), 0);
  });

  public readonly accountsWithBalances = computed(() => {
    const rawAccounts = this.accountsSignal();
    const expensesList = this.expenseService.expenses();

    return rawAccounts.map((acc) => {
      let balance = acc.initialBalance || 0;

      for (const exp of expensesList) {
        if (exp.paymentMethod === acc.name) {
          if (exp.type === 'income') {
            balance += exp.amount;
          } else {
            balance -= exp.amount;
          }
        }
      }

      return {
        ...acc,
        currentBalance: balance,
      };
    });
  });

  constructor() {
    this.initAccounts();
  }

  private async initAccounts(): Promise<void> {
    try {
      let all = await db.accounts.toArray();
      if (all.length === 0) {
        await db.accounts.bulkAdd(DEFAULT_ACCOUNTS);
        all = await db.accounts.toArray();
      }
      this.accountsSignal.set(all);
    } catch {
      this.accountsSignal.set([]);
    }
  }

  async addAccount(account: Omit<Account, 'id'>): Promise<void> {
    await db.accounts.add(account as Account);
    await this.refreshAccounts();
  }

  async updateAccount(id: number, oldName: string, changes: Partial<Account>): Promise<void> {
    await db.accounts.update(id, changes);
    if (changes.name && changes.name !== oldName) {
      await db.expenses
        .where('paymentMethod')
        .equals(oldName)
        .modify({ paymentMethod: changes.name });
      await this.expenseService.refreshExpenses();
    }
    await this.refreshAccounts();
  }

  async deleteAccount(id: number, accountName: string): Promise<void> {
    await db.accounts.delete(id);
    // Move expenses associated with deleted account to 'Cash' (or first available account)
    const remaining = this.accountsSignal().filter((a) => a.id !== id);
    const fallbackName = remaining.length > 0 ? remaining[0].name : 'Cash';
    await db.expenses
      .where('paymentMethod')
      .equals(accountName)
      .modify({ paymentMethod: fallbackName });
    await this.expenseService.refreshExpenses();
    await this.refreshAccounts();
  }

  private async refreshAccounts(): Promise<void> {
    const all = await db.accounts.toArray();
    this.accountsSignal.set(all);
  }
}
