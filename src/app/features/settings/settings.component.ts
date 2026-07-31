/**
 * @file settings.component.ts
 * @description Mobile-First Settings View displaying ONLY requested App Information details
 * (app version, git branch, short commit hash, last build date) and data portability controls.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ImportExportService } from '../../core/services/import-export.service';
import { ExpenseService } from '../../core/services/expense.service';
import { BUILD_INFO } from '../../core/config/build-info';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, MatRippleModule, MatSnackBarModule],
  template: `
    <div class="settings-page">
      <div class="page-title-box">
        <h1>⚙️ Settings & Backup</h1>
        <p class="subtitle">Manage local IndexedDB storage, export backups & restore data.</p>
      </div>

      <!-- Data Backup & Portability Card -->
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

      <!-- Danger Zone Card -->
      <div class="m3-card settings-card danger-card">
        <div class="card-icon-header">
          <span class="material-symbols-outlined danger-icon">warning</span>
          <div>
            <h3 class="danger-title">Danger Zone</h3>
            <p class="card-desc">Permanently wipe all transactions from your browser's IndexedDB database.</p>
          </div>
        </div>

        <button class="btn btn-danger" (click)="clearDatabase()" matRipple>
          <span class="material-symbols-outlined">delete_forever</span>
          <span>Clear Local Database</span>
        </button>
      </div>

      <!-- App Information Card (Only 4 requested fields) -->
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
  styles: [`
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
    }
    .btn-primary {
      background: #2563eb;
      color: white;
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
  `]
})
export class SettingsComponent {
  private importExportService = inject(ImportExportService);
  private expenseService = inject(ExpenseService);
  private snackBar = inject(MatSnackBar);

  public buildInfo = BUILD_INFO;

  async exportBackup(): Promise<void> {
    try {
      await this.importExportService.exportData();
      this.snackBar.open('JSON Backup file exported! 📥', 'Dismiss', { duration: 3000 });
    } catch (error) {
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
