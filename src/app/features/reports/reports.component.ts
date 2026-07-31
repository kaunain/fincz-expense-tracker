/**
 * @file reports.component.ts
 * @description Reports & Analytics view calculating category distribution breakdown and monthly spending trends.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="reports-page">
      <div class="page-header">
        <div>
          <h1>📈 Spending Reports & Analytics</h1>
          <p class="subtitle">Deep dive into your expense distribution and financial health.</p>
        </div>
      </div>

      <!-- Financial Metrics Summary -->
      <div class="metrics-grid">
        <div class="card metric">
          <span class="label">Total Lifetime Spent</span>
          <span class="value">\${{ summary().totalSpent | number:'1.2-2' }}</span>
        </div>
        <div class="card metric">
          <span class="label">Current Month Spent</span>
          <span class="value">\${{ summary().monthlySpent | number:'1.2-2' }}</span>
        </div>
        <div class="card metric">
          <span class="label">Total Transactions</span>
          <span class="value">{{ summary().transactionCount }}</span>
        </div>
      </div>

      <!-- Category Breakdown Section -->
      <div class="card breakdown-card">
        <h3>🏷️ Category Distribution Breakdown</h3>
        <div *ngIf="summary().categoryBreakdown.length === 0" class="empty-state">
          <p>No transaction data available to generate reports.</p>
        </div>

        <div class="breakdown-list">
          <div *ngFor="let item of summary().categoryBreakdown" class="breakdown-row">
            <div class="row-header">
              <span class="cat-title">{{ item.category }}</span>
              <span class="cat-amount">\${{ item.amount | number:'1.2-2' }} ({{ item.percentage }}%)</span>
            </div>
            <div class="bar-bg">
              <div class="bar-fill" [style.width.%]="item.percentage" [style.background-color]="item.color"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reports-page {
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
      padding: 1.25rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 1rem;
    }
    .metric {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .metric .label {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }
    .metric .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
    }
    .breakdown-card h3 {
      margin-top: 0;
      font-size: 1.15rem;
      color: #0f172a;
    }
    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    .row-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
    }
    .bar-bg {
      height: 10px;
      background: #f1f5f9;
      border-radius: 5px;
      overflow: hidden;
    }
    .bar-fill {
      height: 100%;
      transition: width 0.3s ease;
    }
    .empty-state {
      padding: 2rem;
      text-align: center;
      color: #94a3b8;
    }
  `]
})
export class ReportsComponent {
  private expenseService = inject(ExpenseService);

  public summary = this.expenseService.financialSummary;
}
