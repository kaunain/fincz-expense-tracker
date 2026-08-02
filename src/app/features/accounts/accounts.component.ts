/**
 * @file accounts.component.ts
 * @description Accounts management view displaying per-account balance, total wealth, transfer history,
 * and Add/Edit/Delete account options.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AccountService } from '../../core/services/account.service';
import { ExpenseService } from '../../core/services/expense.service';
import { Account } from '../../core/models/account.model';
import { TransferDialogComponent } from '../../shared/components/transfer-dialog/transfer-dialog.component';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRippleModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="accounts-page">
      <div class="page-title-box">
        <h1>💳 Accounts & Liquidity</h1>
        <p class="subtitle">Track balances across Cash, Bank, UPI, Credit Cards & Transfers.</p>
      </div>

      <!-- Total Wealth Header Card -->
      <div class="m3-card total-wealth-card">
        <div class="wealth-info">
          <span class="wealth-label">Total Net Wealth</span>
          <span class="wealth-val">₹{{ accountService.totalWealth() | number: '1.2-2' }}</span>
        </div>
        <button class="btn-transfer-action" (click)="openTransferModal()" matRipple>
          <span class="material-symbols-outlined">swap_horiz</span>
          <span>Transfer Money</span>
        </button>
      </div>

      <!-- Add New Account Form Card -->
      <div class="m3-card add-card">
        <h3>+ Add Custom Account</h3>
        <div class="form-row">
          <input
            type="text"
            [(ngModel)]="newAccIcon"
            placeholder="💳"
            class="input-control icon-input"
            maxlength="2"
          />
          <input
            type="text"
            [(ngModel)]="newAccName"
            placeholder="e.g. HDFC Bank, Savings"
            class="input-control name-input"
          />
          <input
            type="number"
            [(ngModel)]="newAccInitial"
            placeholder="Opening ₹"
            class="input-control initial-input"
          />
          <button class="save-btn" (click)="addAccount()" [disabled]="!newAccName.trim()" matRipple>
            Save
          </button>
        </div>
      </div>

      <!-- Accounts Grid -->
      <div class="accounts-grid">
        <div *ngFor="let acc of accountService.accountsWithBalances()" class="m3-card account-card" matRipple>
          <div class="acc-top">
            <div class="acc-badge">
              <span class="acc-icon" *ngIf="isEmoji(acc.icon)">{{ acc.icon }}</span>
              <span class="material-symbols-outlined acc-mat-icon" *ngIf="!isEmoji(acc.icon) && acc.icon">{{ acc.icon }}</span>
              <span class="acc-name">{{ acc.name }}</span>
            </div>
            <button
              class="delete-btn"
              (click)="deleteAccount(acc.id!)"
              title="Delete Account"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
          <div class="acc-balance">
            <span class="bal-label">Live Balance</span>
            <span class="bal-val" [class.negative]="(acc.currentBalance || 0) < 0">
              ₹{{ acc.currentBalance | number: '1.2-2' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Transfer Transactions History Section -->
      <div class="m3-card transfers-section">
        <h3>🔄 Recent Money Transfers</h3>
        <div *if="transfersList().length === 0" class="empty-transfers">
          No account transfers recorded yet.
        </div>
        <div class="transfer-list">
          <div *ngFor="let t of transfersList()" class="transfer-item">
            <div class="t-left">
              <span class="t-icon">🔄</span>
              <div class="t-info">
                <span class="t-title">{{ t.title }}</span>
                <span class="t-date">{{ t.date }} • {{ t.paymentMethod }}</span>
              </div>
            </div>
            <span class="t-amount" [class.income-text]="t.type === 'income'">
              {{ t.type === 'income' ? '+' : '-' }}₹{{ t.amount | number: '1.2-2' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .accounts-page {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .page-title-box h1 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
      color: #0f172a;
    }
    .subtitle {
      margin: 0.25rem 0 0 0;
      color: #64748b;
      font-size: 0.85rem;
    }

    .total-wealth-card {
      background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-radius: 20px;
    }
    .wealth-info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .wealth-label {
      font-size: 0.82rem;
      color: #c7d2fe;
      font-weight: 600;
    }
    .wealth-val {
      font-size: 2rem;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .btn-transfer-action {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.25);
      font-weight: 700;
      font-size: 0.88rem;
      cursor: pointer;
      font-family: inherit;

      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    }

    .add-card h3 {
      margin-top: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.75rem;
    }
    .form-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .input-control {
      padding: 0.65rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      outline: none;
      font-size: 0.9rem;
    }
    .icon-input {
      width: 50px;
      text-align: center;
    }
    .name-input {
      flex: 1;
    }
    .initial-input {
      width: 120px;
    }
    .save-btn {
      padding: 0.65rem 1.25rem;
      border-radius: 12px;
      background: #2563eb;
      color: white;
      border: none;
      font-weight: 700;
      cursor: pointer;

      &:disabled {
        background: #94a3b8;
        cursor: not-allowed;
      }
    }

    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.85rem;
    }
    .account-card {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      padding: 1rem;
    }
    .acc-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .acc-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .acc-icon {
      font-size: 1.3rem;
    }
    .acc-mat-icon {
      font-size: 22px;
      color: #64748b;
    }
    .acc-name {
      font-weight: 700;
      color: #0f172a;
      font-size: 0.95rem;
    }
    .delete-btn {
      background: none;
      border: none;
      color: #cbd5e1;
      cursor: pointer;
      &:hover { color: #ef4444; }
      .material-symbols-outlined { font-size: 20px; }
    }
    .acc-balance {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .bal-label {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
    }
    .bal-val {
      font-size: 1.25rem;
      font-weight: 800;
      color: #059669;
    }
    .bal-val.negative {
      color: #ef4444;
    }

    .transfers-section h3 {
      margin-top: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.85rem;
    }
    .empty-transfers {
      font-size: 0.85rem;
      color: #94a3b8;
      padding: 1rem 0;
    }
    .transfer-list {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }
    .transfer-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.6rem 0.85rem;
      background: #f8fafc;
      border-radius: 12px;
    }
    .t-left {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .t-icon {
      font-size: 1.2rem;
    }
    .t-info {
      display: flex;
      flex-direction: column;
    }
    .t-title {
      font-size: 0.88rem;
      font-weight: 700;
      color: #0f172a;
    }
    .t-date {
      font-size: 0.75rem;
      color: #64748b;
    }
    .t-amount {
      font-size: 0.9rem;
      font-weight: 800;
      color: #ef4444;
    }
    .t-amount.income-text {
      color: #059669;
    }
  `]
})
export class AccountsComponent {
  public accountService = inject(AccountService);
  private expenseService = inject(ExpenseService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public newAccIcon = '💳';
  public newAccName = '';
  public newAccInitial: number | null = null;

  transfersList() {
    return this.expenseService.expenses().filter(e => e.category === 'Transfer');
  }

  isEmoji(icon: string | undefined): boolean {
    if (!icon) return false;
    return Array.from(icon).some((char) => char.codePointAt(0)! > 255);
  }

  openTransferModal(): void {
    this.dialog.open(TransferDialogComponent, {
      width: '100%',
      maxWidth: '480px',
      panelClass: 'm3-dialog-panel'
    });
  }

  async addAccount(): Promise<void> {
    if (!this.newAccName.trim()) return;

    await this.accountService.addAccount({
      name: this.newAccName.trim(),
      icon: this.newAccIcon || '💳',
      color: '#2563eb',
      type: 'bank',
      initialBalance: Number(this.newAccInitial || 0)
    });

    this.snackBar.open(`Account "${this.newAccName}" created! 💳`, 'Dismiss', { duration: 3000 });
    this.newAccName = '';
    this.newAccIcon = '💳';
    this.newAccInitial = null;
  }

  async deleteAccount(id: number): Promise<void> {
    const { ConfirmDialogComponent } = await import(
      '../../shared/components/confirm-dialog/confirm-dialog.component'
    );
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: { message: 'Delete this account?' }
    });
    ref.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        await this.accountService.deleteAccount(id);
        this.snackBar.open('Account deleted', 'Dismiss', { duration: 3000 });
      }
    });
  }
}
