/**
 * @file dashboard.component.ts
 * @description Premium Mobile-First Financial Dashboard displaying Net Balance in Indian Rupees (₹),
 * Today's Spend, Monthly Budget Progress, Category Breakdown, and Recent Activity Feed.
 */

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from '../../core/services/expense.service';
import { AddExpenseDialogComponent } from '../../shared/components/add-expense-dialog/add-expense-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatRippleModule],
  template: `
    <div class="dashboard-page">
      <!-- Premium Hero Financial Balance Card (Indian Rupees ₹) -->
      <div class="hero-balance-card">
        <div class="card-header-row">
          <span class="card-label">Total Spent</span>
          <span class="currency-badge">INR (₹)</span>
        </div>
        <div class="hero-amount">₹{{ summary().totalSpent | number:'1.2-2' }}</div>

        <div class="metrics-row">
          <div class="sub-metric">
            <span class="sub-label">Today's Spend</span>
            <span class="sub-value">₹{{ todaySpent() | number:'1.2-2' }}</span>
          </div>
          <div class="divider"></div>
          <div class="sub-metric">
            <span class="sub-label">This Month</span>
            <span class="sub-value">₹{{ summary().monthlySpent | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>

      <!-- Quick Action Buttons (No Overlap Fix) -->
      <div class="quick-actions-bar">
        <button class="action-card primary-card" (click)="openAddModal()" matRipple>
          <span class="material-symbols-outlined action-icon">add_circle</span>
          <span class="action-label">Add Expense</span>
        </button>

        <a routerLink="/expenses" class="action-card" matRipple>
          <span class="material-symbols-outlined action-icon">search</span>
          <span class="action-label">Filter & Find</span>
        </a>

        <a routerLink="/categories" class="action-card" matRipple>
          <span class="material-symbols-outlined action-icon">category</span>
          <span class="action-label">Categories</span>
        </a>

        <a routerLink="/settings" class="action-card" matRipple>
          <span class="material-symbols-outlined action-icon">download</span>
          <span class="action-label">Backup</span>
        </a>
      </div>

      <!-- Main Layout Grid -->
      <div class="grid-section">
        <!-- Category Spending Distribution -->
        <div class="m3-card category-card">
          <div class="section-title-row">
            <h3>🏷️ Category Distribution</h3>
            <a routerLink="/reports" class="see-all-link">Analytics ➔</a>
          </div>

          <div *ngIf="summary().categoryBreakdown.length === 0" class="empty-state">
            <span class="material-symbols-outlined empty-icon">payments</span>
            <p>No expenses recorded yet. Tap "+ Add Expense" to start tracking!</p>
          </div>

          <div class="category-list">
            <div *ngFor="let item of summary().categoryBreakdown | slice:0:5" class="category-row">
              <div class="category-header">
                <span class="category-name">{{ item.category }}</span>
                <span class="category-amount">₹{{ item.amount | number:'1.2-2' }} ({{ item.percentage }}%)</span>
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

        <!-- Recent Activity Feed -->
        <div class="m3-card recent-card">
          <div class="section-title-row">
            <h3>🕒 Recent Transactions</h3>
            <a routerLink="/expenses" class="see-all-link">See All ➔</a>
          </div>

          <div *ngIf="recentExpenses().length === 0" class="empty-state">
            <span class="material-symbols-outlined empty-icon">receipt_long</span>
            <p>Your recent transactions will appear here.</p>
          </div>

          <div class="transaction-list">
            <div *ngFor="let item of recentExpenses() | slice:0:5" class="transaction-item" matRipple>
              <div class="avatar-box">
                <span class="material-symbols-outlined">shopping_cart</span>
              </div>
              <div class="tx-details">
                <span class="tx-title">{{ item.title }}</span>
                <span class="tx-meta">{{ item.date }} • {{ item.category }} • {{ item.paymentMethod }}</span>
              </div>
              <span class="tx-amount">-₹{{ item.amount | number:'1.2-2' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .hero-balance-card {
      background: linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%);
      color: white;
      border-radius: 24px;
      padding: 1.5rem;
      box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.35);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .card-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .card-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #bfdbfe;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .currency-badge {
      background: rgba(255, 255, 255, 0.18);
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .hero-amount {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.1;
    }
    .metrics-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }
    .sub-metric {
      display: flex;
      flex-direction: column;
    }
    .sub-label {
      font-size: 0.75rem;
      color: #93c5fd;
    }
    .sub-value {
      font-size: 1.1rem;
      font-weight: 700;
    }
    .divider {
      width: 1px;
      height: 28px;
      background: rgba(255, 255, 255, 0.2);
    }
    .quick-actions-bar {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.6rem;

      @media (max-width: 480px) {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    .action-card {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem 0.6rem;
      border-radius: 14px;
      background: white;
      color: #334155;
      text-decoration: none;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
      cursor: pointer;
      min-height: 48px;
    }
    .action-icon {
      font-size: 22px !important;
      color: #2563eb;
      flex-shrink: 0;
      line-height: 1;
      margin: 0;
    }
    .action-label {
      font-size: 0.85rem;
      font-weight: 700;
      line-height: 1.2;
      white-space: nowrap;
    }
    .primary-card {
      background: #eff6ff;
      color: #2563eb;
      border-color: #bfdbfe;
    }
    .grid-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1.25rem;
    }
    .section-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .section-title-row h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
    }
    .see-all-link {
      font-size: 0.8rem;
      font-weight: 700;
      color: #2563eb;
      text-decoration: none;
    }
    .category-list, .transaction-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }
    .category-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.85rem;
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
    .transaction-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.6rem;
      border-radius: 12px;
      transition: background-color 0.15s ease;

      &:hover {
        background: #f8fafc;
      }
    }
    .avatar-box {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: #fee2e2;
      color: #ef4444;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tx-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .tx-title {
      font-weight: 700;
      color: #1e293b;
      font-size: 0.95rem;
    }
    .tx-meta {
      font-size: 0.75rem;
      color: #64748b;
    }
    .tx-amount {
      font-weight: 800;
      color: #ef4444;
      font-size: 0.95rem;
    }
    .empty-state {
      text-align: center;
      padding: 2rem 1rem;
      color: #94a3b8;
    }
    .empty-icon {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
  `]
})
export class DashboardComponent {
  private expenseService = inject(ExpenseService);
  private dialog = inject(MatDialog);

  public summary = this.expenseService.financialSummary;
  public recentExpenses = this.expenseService.expenses;

  public todaySpent = computed(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    return this.recentExpenses()
      .filter((e) => e.date === todayStr)
      .reduce((sum, e) => sum + Number(e.amount), 0);
  });

  openAddModal(): void {
    this.dialog.open(AddExpenseDialogComponent, {
      width: '100%',
      maxWidth: '480px'
    });
  }
}
