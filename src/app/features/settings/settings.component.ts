/**
 * @file settings.component.ts
 * @description Settings page for Fincz Expense Tracker.
 *
 * Features:
 * - Data Backup & Restore (export/import JSON)
 * - Danger Zone — wipe all data
 * - App Info — version, git hash, build date
 * - Income Configuration — set monthly income target
 * - Transfer Between Accounts — move money between payment methods
 *   (creates 2 transactions: expense debit + income credit, both with 'Transfer' category)
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ImportExportService } from '../../core/services/import-export.service';
import { ExpenseService } from '../../core/services/expense.service';
import { BUILD_INFO } from '../../core/config/build-info';

/** Payment method options — keep in sync with expense.model.ts PaymentMethod type */
const PAYMENT_METHODS = ['Cash', 'UPI', 'Bank Transfer', 'Credit Card', 'Debit Card'] as const;

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatRippleModule, MatSnackBarModule],
  template: `
    <div class="settings-page">
      <div class="page-title-box">
        <h1>⚙️ Settings & Backup</h1>
        <p class="subtitle">Manage local IndexedDB storage, export backups & restore data.</p>
      </div>

      <!-- ============================================================
           SECTION: Data Backup & Portability
           ============================================================ -->
      <div class="m3-card settings-card">
        <div class="card-icon-header">
          <span class="material-symbols-outlined header-icon">cloud_sync</span>
          <div>
            <h3>Data Backup & Safety</h3>
            <p class="card-desc">Your financial records are stored 100% locally on this device.</p>
          </div>
        </div>

        <div class="action-buttons">
          <button class="btn btn-primary" (click)="exportBackup()" matRipple>
            <span class="material-symbols-outlined">download</span>
            <span>Export Backup (JSON)</span>
          </button>

          <label class="btn btn-outline file-btn" matRipple>
            <span class="material-symbols-outlined">upload</span>
            <span>Import Backup (JSON)</span>
            <input type="file" accept=".json" (change)="onFileSelected($event)" hidden />
          </label>
        </div>
      </div>

      <!-- ============================================================
           SECTION: Income Configuration
           ============================================================ -->
      <div class="m3-card settings-card">
        <div class="card-icon-header">
          <span class="material-symbols-outlined header-icon income-icon">trending_up</span>
          <div>
            <h3>Income Configuration</h3>
            <p class="card-desc">Set your monthly income target for dashboard progress tracking.</p>
          </div>
        </div>

        <!-- Monthly income target input -->
        <div class="form-group">
          <label class="form-label" for="monthlyTarget">Monthly Income Target (₹)</label>
          <div class="input-row">
            <div class="rupee-input-wrap">
              <span class="rupee-prefix">₹</span>
              <input
                id="monthlyTarget"
                type="number"
                class="text-input"
                [(ngModel)]="monthlyIncomeTarget"
                placeholder="e.g. 50000"
                min="0"
              />
            </div>
            <button class="btn btn-primary btn-sm" (click)="saveMonthlyTarget()" matRipple>
              Save
            </button>
          </div>
          <p class="hint-text" *ngIf="monthlyTargetSaved">
            ✅ Saved! Dashboard will show progress toward ₹{{ monthlyIncomeTarget | number }}.
          </p>
        </div>

        <!-- Quick link to manage income categories -->
        <div class="quick-link-row">
          <span class="quick-link-label">Manage income categories</span>
          <a routerLink="/categories" class="btn btn-outline btn-sm" matRipple>
            <span class="material-symbols-outlined" style="font-size:18px">arrow_forward</span>
            Open Categories
          </a>
        </div>
      </div>

      <!-- ============================================================
           SECTION: Danger Zone
           ============================================================ -->
      <div class="m3-card settings-card danger-card">
        <div class="card-icon-header">
          <span class="material-symbols-outlined danger-icon">warning</span>
          <div>
            <h3 class="danger-title">Danger Zone</h3>
            <p class="card-desc">
              Permanently wipe all transactions from your browser's IndexedDB database.
            </p>
          </div>
        </div>

        <button class="btn btn-danger" (click)="clearDatabase()" matRipple>
          <span class="material-symbols-outlined">delete_forever</span>
          <span>Clear Local Database</span>
        </button>
      </div>

      <!-- ============================================================
           SECTION: App Information
           ============================================================ -->
      <div class="m3-card settings-card">
        <h3>ℹ️ App Information</h3>
        <div class="info-list">
          <div class="info-item">
            <span class="info-label">App Version</span>
            <span class="info-val">{{ buildInfo.appVersion }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Git Branch</span>
            <span class="info-val">{{ buildInfo.gitBranch }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Last Commit Hash</span>
            <span class="info-val font-mono">{{ buildInfo.commitHash }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Last Build Date</span>
            <span class="info-val">{{ buildInfo.lastBuildDate }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-page {
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

      .settings-card h3 {
        margin: 0;
        font-size: 1.05rem;
        font-weight: 700;
        color: #0f172a;
      }

      .card-icon-header {
        display: flex;
        gap: 0.85rem;
        align-items: flex-start;
        margin-bottom: 1.25rem;
      }

      .header-icon {
        font-size: 2rem;
        color: #2563eb;
      }

      /* Green for income section icon */
      .income-icon {
        color: #059669;
      }

      /* Purple for transfer section icon */
      .transfer-icon {
        color: #6366f1;
      }

      .danger-icon {
        font-size: 2rem;
        color: #ef4444;
      }

      .card-desc {
        margin: 0.25rem 0 0 0;
        font-size: 0.85rem;
        color: #64748b;
      }

      .action-buttons {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
      }

      /* ---- Buttons ---- */
      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.7rem 1.25rem;
        border-radius: 14px;
        font-size: 0.88rem;
        font-weight: 700;
        border: none;
        cursor: pointer;
        font-family: inherit;
        text-decoration: none;
      }

      .btn-sm {
        padding: 0.5rem 0.9rem;
        font-size: 0.82rem;
      }

      .btn-primary {
        background: #2563eb;
        color: white;

        &:disabled {
          background: #94a3b8;
          cursor: not-allowed;
        }
      }

      .btn-outline {
        background: #f1f5f9;
        color: #334155;
        border: 1px solid #cbd5e1;
      }

      .file-btn {
        cursor: pointer;
      }

      .danger-card {
        background: #fff5f5;
        border-color: #fecaca;
      }

      .danger-title {
        color: #991b1b !important;
      }

      .btn-danger {
        background: #ef4444;
        color: white;
      }

      /* ---- Form elements ---- */
      .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        flex: 1;
      }

      .form-label {
        font-size: 0.82rem;
        font-weight: 600;
        color: #64748b;
      }

      /* Generic text input box */
      .text-input {
        padding: 0.6rem 0.85rem;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        font-size: 0.9rem;
        outline: none;
        font-family: inherit;
        width: 100%;
        box-sizing: border-box;

        &:focus {
          border-color: #2563eb;
        }
      }

      .date-input {
        color: #0f172a;
      }

      .select-input {
        padding: 0.6rem 0.85rem;
        border: 1px solid #cbd5e1;
        border-radius: 10px;
        font-size: 0.9rem;
        font-family: inherit;
        background: white;
        width: 100%;
        box-sizing: border-box;
      }

      /* ₹ prefix wrapper */
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
        padding-left: 0.6rem;

        &:focus {
          border: none;
        }
      }

      /* Row with input + save button side by side */
      .input-row {
        display: flex;
        gap: 0.5rem;
        align-items: center;
      }

      .input-row .rupee-input-wrap {
        flex: 1;
      }

      .hint-text {
        margin: 0;
        font-size: 0.8rem;
        color: #059669;
      }

      /* Quick link row — label on left, button on right */
      .quick-link-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid #f1f5f9;
      }

      .quick-link-label {
        font-size: 0.85rem;
        color: #64748b;
      }

      /* ---- Transfer form layout ---- */
      .transfer-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      /* Two equal columns side by side */
      .form-row-2 {
        display: flex;
        gap: 0.75rem;
        align-items: flex-end;
      }

      /* Arrow icon between From and To selects */
      .arrow-divider {
        display: flex;
        align-items: center;
        padding-bottom: 0.4rem;
        color: #94a3b8;
        flex-shrink: 0;
      }

      .error-text {
        margin: 0;
        font-size: 0.8rem;
        color: #ef4444;
      }

      /* ---- App info table ---- */
      .info-list {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 1rem;
      }

      .info-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.88rem;
        border-bottom: 1px solid #f1f5f9;
        padding-bottom: 0.6rem;
      }

      .info-label {
        color: #64748b;
        font-weight: 500;
      }

      .info-val {
        color: #0f172a;
        font-weight: 700;
      }

      .font-mono {
        font-family: monospace;
        background: #f1f5f9;
        padding: 0.15rem 0.45rem;
        border-radius: 6px;
      }
    `,
  ],
})
export class SettingsComponent {
  private importExportService = inject(ImportExportService);
  private expenseService = inject(ExpenseService);
  private snackBar = inject(MatSnackBar);

  public buildInfo = BUILD_INFO;

  /** Available payment method options for the transfer form */
  public paymentMethods = PAYMENT_METHODS;

  /** Monthly income target — used for dashboard progress bar (stored in localStorage) */
  public monthlyIncomeTarget: number = this.loadMonthlyTarget();
  public monthlyTargetSaved = false;

  /** Transfer form state */
  public transfer = {
    from: 'Cash' as string,
    to: 'Bank Transfer' as string,
    amount: null as number | null,
    date: new Date().toISOString().slice(0, 10), // Default to today
    note: '',
  };

  /** Load previously saved monthly income target from localStorage */
  private loadMonthlyTarget(): number {
    try {
      // localStorage access is safe here — settings page is browser-only
      const saved = localStorage.getItem('fincz_monthly_income_target');
      return saved ? Number(saved) : 0;
    } catch {
      return 0;
    }
  }

  /** Save monthly income target to localStorage */
  saveMonthlyTarget(): void {
    try {
      localStorage.setItem('fincz_monthly_income_target', String(this.monthlyIncomeTarget));
      this.monthlyTargetSaved = true;
      setTimeout(() => (this.monthlyTargetSaved = false), 3000);
    } catch {
      this.snackBar.open('Could not save target', 'Dismiss', { duration: 3000 });
    }
  }

  async exportBackup(): Promise<void> {
    try {
      await this.importExportService.exportData();
      this.snackBar.open('JSON Backup file exported! 📥', 'Dismiss', { duration: 3000 });
    } catch {
      this.snackBar.open('Export failed', 'Dismiss', { duration: 3000 });
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const result = await this.importExportService.importData(file);
    this.snackBar.open(result.message, 'Dismiss', { duration: 4000 });
  }

  async clearDatabase(): Promise<void> {
    if (confirm('Are you sure you want to delete all local expense records?')) {
      await this.expenseService.clearAllExpenses();
      this.snackBar.open('Local database cleared 🗑️', 'Dismiss', { duration: 3000 });
    }
  }
}
