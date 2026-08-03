/**
 * @file transfer-dialog.component.ts
 * @description Modal dialog for recording money transfers between payment accounts.
 *
 * Features:
 * - Select From / To accounts
 * - Interactive Swap/Interchange button (From ⇄ To)
 * - Amount, date (max today), and optional note
 * - Creates paired Debit (Expense) & Credit (Income) records categorized as 'Transfer'
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExpenseService } from '../../../core/services/expense.service';
import { AccountService } from '../../../core/services/account.service';

const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Credit Card', 'Debit Card'] as const;

@Component({
  selector: 'app-transfer-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatSnackBarModule],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>🔄 Transfer Between Accounts</h2>
        <button mat-icon-button class="close-btn" (click)="onCancel()" aria-label="Close dialog">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form (ngSubmit)="onSubmit()" class="dialog-form">
        <!-- From / Swap / To Selects Row -->
        <div class="form-row swap-row">
          <div class="form-group half-width">
            <label class="form-label" for="transferFrom">From Account</label>
            <select id="transferFrom" class="select-input" [(ngModel)]="transfer.from" name="from">
              <option *ngFor="let acc of accounts()" [value]="acc.name">
                {{ isEmoji(acc.icon) ? acc.icon : '💳' }} {{ acc.name }}
              </option>
            </select>
          </div>

          <!-- Clickable Swap Button to interchange From and To -->
          <button
            type="button"
            class="swap-btn"
            (click)="swapAccounts()"
            aria-label="Interchange From and To accounts"
            title="Swap Accounts"
          >
            <span class="material-symbols-outlined">swap_horiz</span>
          </button>

          <div class="form-group half-width">
            <label class="form-label" for="transferTo">To Account</label>
            <select id="transferTo" class="select-input" [(ngModel)]="transfer.to" name="to">
              <option *ngFor="let acc of accounts()" [value]="acc.name">
                {{ isEmoji(acc.icon) ? acc.icon : '💳' }} {{ acc.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Amount and Date -->
        <div class="form-row">
          <div class="form-group half-width">
            <label class="form-label" for="transferAmount">Amount (₹) *</label>
            <div class="rupee-input-wrap">
              <span class="rupee-prefix">₹</span>
              <input
                id="transferAmount"
                type="number"
                step="0.01"
                class="text-input"
                [(ngModel)]="transfer.amount"
                name="amount"
                placeholder="0.00"
                required
                min="0.01"
              />
            </div>
          </div>

          <div class="form-group half-width">
            <label class="form-label" for="transferDate">Date</label>
            <input
              id="transferDate"
              type="date"
              class="text-input date-input"
              [(ngModel)]="transfer.date"
              [max]="maxDateStr"
              name="date"
              required
            />
          </div>
        </div>

        <!-- Optional Note -->
        <div class="form-group">
          <label class="form-label" for="transferNote">Note (Optional)</label>
          <input
            id="transferNote"
            type="text"
            class="text-input"
            [(ngModel)]="transfer.note"
            name="note"
            placeholder="e.g. Monthly ATM cash withdrawal"
          />
        </div>

        <p class="error-text" *ngIf="transfer.from === transfer.to">
          ⚠️ "From" and "To" accounts must be different.
        </p>

        <div class="dialog-actions">
          <button type="button" mat-button (click)="onCancel()">Cancel</button>
          <button
            type="submit"
            mat-flat-button
            color="primary"
            [disabled]="!transfer.amount || transfer.from === transfer.to"
            class="save-btn"
          >
            Record Transfer
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [
    `
      .dialog-container {
        padding: 0.5rem;
      }
      .dialog-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .dialog-header h2 {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        color: #0f172a;
      }
      .dialog-form {
        display: flex;
        flex-direction: column;
        gap: 0.85rem;
      }
      .form-row {
        display: flex;
        gap: 0.5rem;
        align-items: flex-end;
      }
      .half-width {
        flex: 1;
      }
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
      }
      .form-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #64748b;
      }
      .select-input,
      .text-input {
        padding: 0.6rem 0.85rem;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        font-size: 0.9rem;
        font-family: inherit;
        background: white;
        width: 100%;
        box-sizing: border-box;
        outline: none;

        &:focus {
          border-color: #2563eb;
        }
      }
      .rupee-input-wrap {
        display: flex;
        align-items: center;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        overflow: hidden;

        &:focus-within {
          border-color: #2563eb;
        }
      }
      .rupee-prefix {
        padding: 0.6rem 0.6rem 0.6rem 0.85rem;
        font-weight: 700;
        color: #64748b;
        background: #f8fafc;
        border-right: 1px solid #e2e8f0;
        font-size: 1rem;
      }
      .rupee-input-wrap .text-input {
        border: none;
        border-radius: 0;
      }

      /* Interchange / Swap Button */
      .swap-btn {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        border: 1px solid #cbd5e1;
        background: #f8fafc;
        color: #6366f1;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        margin-bottom: 2px;
        transition: all 0.2s ease;
        flex-shrink: 0;

        &:hover {
          background: #eff6ff;
          border-color: #6366f1;
          transform: rotate(180deg);
        }
      }

      .error-text {
        margin: 0;
        font-size: 0.78rem;
        color: #ef4444;
      }
      .dialog-actions {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-top: 0.75rem;
      }
      .save-btn {
        border-radius: 12px;
        padding: 0 1.5rem;
      }
    `,
  ],
})
export class TransferDialogComponent {
  private expenseService = inject(ExpenseService);
  private accountService = inject(AccountService);
  private snackBar = inject(MatSnackBar);
  public dialogRef = inject(MatDialogRef<TransferDialogComponent>);

  public accounts = this.accountService.accounts;
  public maxDateStr = new Date().toISOString().slice(0, 10);

  public transfer = {
    from: '',
    to: '',
    amount: null as number | null,
    date: new Date().toISOString().slice(0, 10),
    note: '',
  };

  constructor() {
    const list = this.accounts();
    if (list.length > 0) {
      this.transfer.from = list[0].name;
      this.transfer.to = list.length > 1 ? list[1].name : list[0].name;
    }
  }

  isEmoji(icon: string | undefined): boolean {
    if (!icon) return false;
    return Array.from(icon).some((char) => char.codePointAt(0)! > 255);
  }

  /** Swaps/Interchanges From Account and To Account */
  swapAccounts(): void {
    const temp = this.transfer.from;
    this.transfer.from = this.transfer.to;
    this.transfer.to = temp;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  async onSubmit(): Promise<void> {
    if (!this.transfer.amount || this.transfer.from === this.transfer.to) return;

    const { from, to, amount, date, note } = this.transfer;
    const noteText = note || `Transfer: ${from} → ${to}`;

    // Create Debit
    await this.expenseService.addExpense({
      type: 'expense',
      title: `Transfer to ${to}`,
      amount: Number(amount),
      date,
      category: 'Transfer',
      paymentMethod: from as any,
      notes: noteText,
    });

    // Create Credit
    await this.expenseService.addExpense({
      type: 'income',
      title: `Transfer from ${from}`,
      amount: Number(amount),
      date,
      category: 'Transfer',
      paymentMethod: to as any,
      notes: noteText,
    });

    this.snackBar.open(`Transfer of ₹${amount} recorded! 🔄`, 'Dismiss', { duration: 3000 });

    this.dialogRef.close(true);
  }
}
