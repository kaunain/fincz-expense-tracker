/**
 * @file dashboard.component.ts
 * @description Main Financial Dashboard View displaying spending summary cards, category breakdown,
 * and recent transaction history powered by Angular Reactive Signals.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../core/services/expense.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <!-- Header Banner -->
      <div class="dashboard-header">
        <div>
          <h1>📊 Financial Summary Dashboard</h1>
          <p class="subtitle">Real-time local insights from your browser's IndexedDB engine.</p>
        </div>
        <a routerLink="/expenses" class="btn btn-primary">
          <span>+ Add Expense</span>
        </a>
      </div>

      <!-- Metric Summary Cards -->
      <div class="summary-cards">
        <div class="card metric-card primary">
          <div class="metric-icon">💰</div>
          <div class="metric-data">
            <span class="label">Total Expenses</span>
            <span class="value">\${{ summary().totalSpent | number:'1.2-2' }}</span>
          </div>
        </div>

        <div class="card metric-card info">
          <div class="metric-icon">📅</div>
          <div class="metric-data">
            <span class="label">This Month</span>
            <span class="value">\${{ summary().monthlySpent | number:'1.2-2' }}</span>
          </div>
        </div>

        <div class="card metric-card success">
          <div class="metric-icon">🧾</div>
          <div class="metric-data">
            <span class="label">Total Transactions</span>
            <span class="value">{{ summary().transactionCount }}</span>
          </div>
        </div>
      </div>

      <!-- Main Section: Category Breakdown & Recent Expenses -->
      <div class="grid-layout">
        <!-- Category Breakdown Card -->
        <div class="card category-section">
          <h3>🏷️ Top Spending Categories</h3>
          <div *ngIf="summary().categoryBreakdown.length === 0" class="empty-state">
            <p>No expenses recorded yet. Click "+ Add Expense" to start!</p>
          </div>
          <div class="category-list">
            <div *ngFor="let item of summary().categoryBreakdown" class="category-item">
              <div class="category-info">
                <span class="category-name">{{ item.category }}</span>
                <span class="category-amount">\${{ item.amount | number:'1.2-2' }} ({{ item.percentage }}%)</span>
              </div>
              <div class="progress-bar-bg">
                <div 
                  class="progress-bar-fill" 
                  [style.width.%]="item.percentage" 
                  [style.background-color]="item.color"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Transactions Card -->
        <div class="card recent-section">
          <div class="card-header">
            <h3>🕒 Recent Transactions</h3>
            <a routerLink="/expenses" class="link">View All</a>
          </div>
          
          <div *ngIf="recentExpenses().length === 0" class="empty-state">
            <p>No recent activity.</p>
          </div>

          <div class="recent-list">
            <div *ngFor="let item of recentExpenses() | slice:0:5" class="recent-item">
              <div class="recent-details">
                <span class="item-title">{{ item.title }}</span>
                <span class="item-meta">{{ item.date }} • {{ item.category }} • {{ item.paymentMethod }}</span>
              </div>
              <span class="item-amount">-\${{ item.amount | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    h1 {
      margin: 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: #1e293b;
    }
    .subtitle {
      margin: 0.25rem 0 0 0;
      color: #64748b;
      font-size: 0.9rem;
    }
    .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
    }
    .btn-primary {
      background-color: #2563eb;
      color: white;
      border: none;

      &:hover {
        background-color: #1d4ed8;
      }
    }
    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1rem;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.25rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      border: 1px solid #e2e8f0;
    }
    .metric-card {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .metric-icon {
      font-size: 2rem;
      width: 52px;
      height: 52px;
      border-radius: 12px;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .metric-data {
      display: flex;
      flex-direction: column;
    }
    .metric-data .label {
      font-size: 0.85rem;
      color: #64748b;
      font-weight: 500;
    }
    .metric-data .value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #0f172a;
    }
    .grid-layout {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.5rem;
    }
    .category-list, .recent-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }
    .category-info {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      font-weight: 600;
      margin-bottom: 0.35rem;
    }
    .progress-bar-bg {
      height: 8px;
      background: #f1f5f9;
      border-radius: 4px;
      overflow: hidden;
    }
    .progress-bar-fill {
      height: 100%;
      transition: width 0.3s ease;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .link {
      color: #2563eb;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.875rem;
    }
    .recent-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .recent-details {
      display: flex;
      flex-direction: column;
    }
    .item-title {
      font-weight: 600;
      color: #1e293b;
    }
    .item-meta {
      font-size: 0.8rem;
      color: #64748b;
    }
    .item-amount {
      font-weight: 700;
      color: #ef4444;
    }
    .empty-state {
      padding: 1.5rem;
      text-align: center;
      color: #94a3b8;
    }
  `]
})
export class DashboardComponent {
  private expenseService = inject(ExpenseService);

  /** Financial Summary Signal */
  public summary = this.expenseService.financialSummary;

  /** Recent Expenses Signal */
  public recentExpenses = this.expenseService.expenses;
}
