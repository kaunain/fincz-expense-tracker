import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AccountService } from '../../core/services/account.service';
import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-transfer-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule],
  template: `
    <div class="transfer-page m3-card">
      <div class="header">
        <h2>🔄 Transfer Money</h2>
        <p class="subtitle">Move funds between Cash, Bank, and Card accounts</p>
      </div>

      <form (ngSubmit)="onSubmit()" class="transfer-form">
        <div class="amount-box">
          <span class="currency">₹</span>
          <input
            type="number"
            step="0.01"
            [(ngModel)]="amount"
            name="amount"
            placeholder="0.00"
            class="amount-input"
            required
            min="0.01"
          />
        </div>

        <div class="accounts-row">
          <div class="field-group">
            <label>From Account</label>
            <select [(ngModel)]="fromAccount" name="fromAccount" class="select-control">
              <option *ngFor="let acc of accounts()" [value]="acc.name">{{ acc.icon }} {{ acc.name }}</option>
            </select>
          </div>

          <div class="swap-icon">➔</div>

          <div class="field-group">
            <label>To Account</label>
            <select [(ngModel)]="toAccount" name="toAccount" class="select-control">
              <option *ngFor="let acc of accounts()" [value]="acc.name">{{ acc.icon }} {{ acc.name }}</option>
            </select>
          </div>
        </div>

        <div class="field-group">
          <label>Date</label>
          <input type="date" [(ngModel)]="dateStr" name="dateStr" class="input-control" [max]="todayStr" />
        </div>

        <div class="field-group">
          <label>Notes (Optional)</label>
          <input type="text" [(ngModel)]="notes" name="notes" placeholder="e.g. ATM Cash Withdrawal, Rent share" class="input-control" />
        </div>

        <div class="actions">
          <a routerLink="/accounts" mat-button>Cancel</a>
          <button type="submit" mat-flat-button color="primary" [disabled]="!amount || amount <= 0 || fromAccount === toAccount" class="save-btn">
            Execute Transfer
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .transfer-page {
      max-width: 520px;
      margin: 0 auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .header h2 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .subtitle {
      margin: 0.25rem 0 0 0;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .transfer-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .amount-box {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-light);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
    }
    .currency {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary-color);
      margin-right: 0.5rem;
    }
    .amount-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 2.25rem;
      font-weight: 800;
      width: 100%;
      text-align: center;
      color: var(--text-main);
    }
    .accounts-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .swap-icon {
      margin-top: 1.25rem;
      font-size: 1.2rem;
      color: var(--text-muted);
    }
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      flex: 1;
    }
    .field-group label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
    }
    .select-control, .input-control {
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      background: var(--surface-color);
      color: var(--text-main);
      font-size: 0.9rem;
      outline: none;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .save-btn {
      border-radius: 12px;
      padding: 0 1.5rem;
    }
  `]
})
export class TransferPageComponent {
  private accountService = inject(AccountService);
  private expenseService = inject(ExpenseService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  public accounts = this.accountService.accountsWithBalances;
  public amount: number | null = null;
  public fromAccount = 'Cash';
  public toAccount = 'Bank Transfer';
  public notes = '';
  public todayStr = new Date().toISOString().split('T')[0];
  public dateStr = this.todayStr;

  async onSubmit(): Promise<void> {
    if (!this.amount || this.amount <= 0 || this.fromAccount === this.toAccount) return;

    // Outflow record from source account
    await this.expenseService.addExpense({
      type: 'expense',
      title: `Transfer to ${this.toAccount}`,
      amount: Number(this.amount),
      category: 'Transfer',
      paymentMethod: this.fromAccount as any,
      date: this.dateStr,
      notes: this.notes || undefined,
    });

    // Inflow record into destination account
    await this.expenseService.addExpense({
      type: 'income',
      title: `Transfer from ${this.fromAccount}`,
      amount: Number(this.amount),
      category: 'Transfer',
      paymentMethod: this.toAccount as any,
      date: this.dateStr,
      notes: this.notes || undefined,
    });

    this.snackBar.open(`₹${this.amount} transferred successfully! 🔄`, 'OK', { duration: 3000 });
    this.router.navigate(['/accounts']);
  }
}
