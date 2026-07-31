/**
 * @file reports.component.ts
 * @description Mobile-First Analytics & Spending Reports View displaying amounts in Indian Rupees (₹).
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
      <div class="page-title-box">
        <h1>📈 Reports & Insights</h1>
        <p class="subtitle">Understand where your money goes every month.</p>
      </div>

      <!-- Lifetime Stats Cards -->
      <div class="stats-grid">
        <div class="m3-card stat-card primary">
          <span class="stat-label">Total Spent</span>
          <span class="stat-value">₹{{ summary().totalSpent | number:'1.2-2' }}</span>
        </div>
        <div class="m3-card stat-card info">
          <span class="stat-label">This Month</span>
          <span class="stat-value">₹{{ summary().monthlySpent | number:'1.2-2' }}</span>
        </div>
        <div class="m3-card stat-card success">
          <span class="stat-label">Transactions</span>
          <span class="stat-value">{{ summary().transactionCount }}</span>
        </div>
      </div>

      <!-- Category Spending Breakdown -->
      <div class="m3-card breakdown-card">
        <h3>🏷️ Category Distribution Breakdown</h3>

        <div *ngIf="summary().categoryBreakdown.length === 0" class="empty-state">
          <span class="material-symbols-outlined empty-icon">pie_chart</span>
          <p>No transaction data available yet.</p>
        </div>

        <div class="breakdown-list">
          <div *ngFor="let item of summary().categoryBreakdown" class="breakdown-item">
            <div class="item-header">
              <span class="cat-name">{{ item.category }}</span>
              <span class="cat-val">₹{{ item.amount | number:'1.2-2' }} ({{ item.percentage }}%)</span>
            </div>
            <div class="bar-bg">
              <div 
                class="bar-fill" 
                [style.width.%]="item.percentage" 
                [style.background-color]="item.color"
              ></div>
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
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 0.85rem;
    }
    .stat-card {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .stat-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
    }
    .stat-value {
      font-size: 1.4rem;
      font-weight: 800;
      color: #0f172a;
    }
    .breakdown-card h3 {
      margin-top: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 1rem;
    }
    .breakdown-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
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
      text-align: center;
      padding: 2.5rem 1rem;
      color: #94a3b8;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class ReportsComponent {
  private expenseService = inject(ExpenseService);

  public summary = this.expenseService.financialSummary;
}
