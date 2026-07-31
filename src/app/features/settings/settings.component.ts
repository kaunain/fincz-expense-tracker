/**
 * @file settings.component.ts
 * @description Application Settings & Data Portability view for JSON Backup Export/Import and Database Management.
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImportExportService } from '../../core/services/import-export.service';
import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings-page">
      <div class="page-header">
        <div>
          <h1>⚙️ Settings & Backup</h1>
          <p class="subtitle">Manage local data storage, export JSON backups, and restore user data.</p>
        </div>
      </div>

      <!-- Backup & Data Portability -->
      <div class="card settings-card">
        <h3>💾 Data Backup & Portability</h3>
        <p class="description">
          Fincz Expense Tracker operates on a <strong>Local-First Architecture</strong>. Your financial data is stored 100% locally inside your browser's IndexedDB. Export your data regularly to create safe offline backups or transfer to another device.
        </p>

        <div class="actions-row">
          <button class="btn btn-primary" (click)="exportBackup()">
            📥 Export Backup (JSON)
          </button>

          <label class="btn btn-secondary file-upload-btn">
            📤 Import Backup (JSON)
            <input type="file" accept=".json" (change)="onFileSelected($event)" hidden />
          </label>
        </div>

        <div *ngIf="statusMessage()" class="status-alert" [class.success]="isSuccess()" [class.error]="!isSuccess()">
          {{ statusMessage() }}
        </div>
      </div>

      <!-- Danger Zone -->
      <div class="card settings-card danger-card">
        <h3 class="danger-title">⚠️ Danger Zone</h3>
        <p class="description">
          Wipe all transactions stored in your local browser IndexedDB database. This action cannot be undone unless you have exported a JSON backup.
        </p>

        <button class="btn btn-danger" (click)="clearDatabase()">
          🗑️ Clear All Database Records
        </button>
      </div>

      <!-- Open Source Meta -->
      <div class="card settings-card info-card">
        <h3>ℹ️ Open Source Application Details</h3>
        <ul class="meta-list">
          <li><strong>Application:</strong> Fincz Expense Tracker (v0.2.0)</li>
          <li><strong>Architecture:</strong> Local-First Static Client-Side Web Application</li>
          <li><strong>Primary Storage Engine:</strong> IndexedDB via Dexie.js</li>
          <li><strong>Framework:</strong> Angular 20+ (Standalone Components, Signals)</li>
          <li><strong>License:</strong> MIT Open Source License</li>
          <li><strong>Author:</strong> Kaunain Ahmad</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .settings-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header h1 {
      margin: 0;
      font-size: 1.75rem;
      color: #1e293b;
    }
    .subtitle {
      margin: 0.25rem 0 0 0;
      color: #64748b;
      font-size: 0.9rem;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .settings-card h3 {
      margin-top: 0;
      font-size: 1.15rem;
      color: #0f172a;
    }
    .description {
      color: #475569;
      font-size: 0.9rem;
      line-height: 1.5;
    }
    .actions-row {
      display: flex;
      gap: 1rem;
      margin-top: 1.25rem;
      flex-wrap: wrap;
    }
    .btn {
      padding: 0.65rem 1.25rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      border: none;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
    }
    .btn-primary {
      background-color: #2563eb;
      color: white;

      &:hover {
        background-color: #1d4ed8;
      }
    }
    .btn-secondary {
      background-color: #f1f5f9;
      color: #334155;

      &:hover {
        background-color: #e2e8f0;
      }
    }
    .file-upload-btn {
      cursor: pointer;
    }
    .btn-danger {
      background-color: #ef4444;
      color: white;

      &:hover {
        background-color: #dc2626;
      }
    }
    .status-alert {
      margin-top: 1rem;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    .status-alert.success {
      background-color: #dcfce7;
      color: #15803d;
    }
    .status-alert.error {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    .danger-card {
      border-color: #fecaca;
      background: #fff5f5;
    }
    .danger-title {
      color: #991b1b;
    }
    .meta-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #334155;
    }
  `]
})
export class SettingsComponent {
  private importExportService = inject(ImportExportService);
  private expenseService = inject(ExpenseService);

  public statusMessage = signal<string>('');
  public isSuccess = signal<boolean>(true);

  async exportBackup(): Promise<void> {
    try {
      await this.importExportService.exportData();
      this.isSuccess.set(true);
      this.statusMessage.set('JSON Backup file downloaded successfully!');
    } catch (error) {
      this.isSuccess.set(false);
      this.statusMessage.set('Export failed.');
    }
  }

  async onFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];
    const result = await this.importExportService.importData(file);

    this.isSuccess.set(result.success);
    this.statusMessage.set(result.message);
  }

  async clearDatabase(): Promise<void> {
    if (confirm('Are you absolutely sure you want to delete all local expense records?')) {
      await this.expenseService.clearAllExpenses();
      this.isSuccess.set(true);
      this.statusMessage.set('IndexedDB cleared successfully.');
    }
  }
}
