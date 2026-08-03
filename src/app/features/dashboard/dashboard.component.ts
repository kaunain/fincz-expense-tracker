/**
 * @file dashboard.component.ts
 * @description Premium Mobile-First Dashboard with Month Navigator, Balance Hero Card,
 * CSS Donut Chart, and Quick Transaction Entry.
 */

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExpenseService } from '../../core/services/expense.service';
import { AccountService } from '../../core/services/account.service';
import { DonutChartComponent } from '../../shared/components/donut-chart/donut-chart.component';
import { AddExpenseDialogComponent } from '../../shared/components/add-expense-dialog/add-expense-dialog.component';
import { PaymentMethod, TransactionType } from '../../core/models/expense.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, MatRippleModule, DonutChartComponent],
  template: `
    <div class="dashboard-page">
      <!-- Total Wealth Card -->
      <div class="m3-card total-wealth-banner">
        <div class="wealth-content">
          <span class="wealth-title">Total Net Wealth</span>
          <span class="wealth-amount">₹{{ accountService.totalWealth() | number: '1.2-2' }}</span>
        </div>
        <a routerLink="/accounts" class="accounts-link" matRipple>
          <span>Accounts</span>
          <span class="material-symbols-outlined">chevron_right</span>
        </a>
      </div>

      <!-- Month Navigator -->
      <div class="month-nav">
        <button class="month-btn" (click)="prevMonth()" matRipple>‹</button>
        <span class="month-label">{{ monthLabel() }}</span>
        <button class="month-btn" (click)="nextMonth()" matRipple [disabled]="isCurrentMonth()">
          ›
        </button>
      </div>

      <!-- Balance Hero Card -->
      <div class="hero-card">
        <div class="hero-metric">
          <span class="metric-label">Income</span>
          <span class="metric-value income"
            >₹{{ monthSummary().monthlyIncome | number: '1.0-0' }}</span
          >
        </div>
        <div class="hero-divider"></div>
        <div class="hero-metric center">
          <span class="metric-label">Balance</span>
          <span class="metric-value balance" [class.negative]="monthSummary().netBalance < 0">
            ₹{{ monthSummary().netBalance | number: '1.0-0' }}
          </span>
        </div>
        <div class="hero-divider"></div>
        <div class="hero-metric">
          <span class="metric-label">Expenses</span>
          <span class="metric-value expense"
            >₹{{ monthSummary().monthlySpent | number: '1.0-0' }}</span
          >
        </div>
      </div>

      <!-- Spending Donut Chart + Legend -->
      <div class="m3-card chart-card" *ngIf="monthSummary().categoryBreakdown.length > 0">
        <div class="section-title-row">
          <h3>💸 Spending Breakdown</h3>
          <a routerLink="/reports" class="see-all-link">Reports ➔</a>
        </div>
        <div class="chart-layout">
          <app-donut-chart
            [data]="monthSummary().categoryBreakdown"
            [centerLabel]="'₹' + (monthSummary().monthlySpent | number: '1.0-0')"
            centerSub="Spent"
            [showLegend]="false"
          ></app-donut-chart>
          <div class="legend">
            <div
              *ngFor="let item of monthSummary().categoryBreakdown | slice: 0 : 5"
              class="legend-item"
            >
              <span class="legend-dot" [style.background]="item.color"></span>
              <span class="legend-name">{{ item.category }}</span>
              <span class="legend-pct">{{ item.percentage }}%</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State for Chart -->
      <div class="m3-card empty-chart" *ngIf="monthSummary().categoryBreakdown.length === 0">
        <span class="empty-emoji">📊</span>
        <p>No expenses recorded this month.</p>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-page {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
      }
      .total-wealth-banner {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.25rem 1.5rem;
        border-radius: 18px;
      }
      .wealth-content {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
      }
      .wealth-title {
        font-size: 0.78rem;
        color: #94a3b8;
        font-weight: 600;
      }
      .wealth-amount {
        font-size: 1.65rem;
        font-weight: 800;
        letter-spacing: -0.01em;
      }
      .accounts-link {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        padding: 0.5rem 0.85rem;
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        text-decoration: none;
        font-weight: 700;
        font-size: 0.82rem;
        transition: background 0.2s;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      }
      .month-nav {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.5rem;
      }
      .month-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        border: 1px solid #e2e8f0;
        background: white;
        font-size: 1.25rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        &:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
      }
      .month-label {
        font-size: 1.1rem;
        font-weight: 800;
        color: #0f172a;
        min-width: 160px;
        text-align: center;
      }
      .hero-card {
        background: linear-gradient(135deg, #1e40af 0%, #2563eb 60%, #3b82f6 100%);
        color: white;
        border-radius: 24px;
        padding: 1.5rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.35);
      }
      .hero-metric {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.2rem;
      }
      .hero-metric.center {
        flex: 1;
      }
      .metric-label {
        font-size: 0.72rem;
        color: #bfdbfe;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .metric-value {
        font-size: 1.25rem;
        font-weight: 800;
        letter-spacing: -0.5px;
      }
      .metric-value.income {
        color: #86efac;
      }
      .metric-value.expense {
        color: #fca5a5;
      }
      .metric-value.balance {
        color: white;
        font-size: 1.5rem;
      }
      .metric-value.balance.negative {
        color: #fca5a5;
      }
      .hero-divider {
        width: 1px;
        height: 40px;
        background: rgba(255, 255, 255, 0.2);
      }
      .quick-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;
      }
      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.85rem 1rem;
        border-radius: 16px;
        border: none;
        font-size: 0.95rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
      }
      .expense-btn {
        background: #fee2e2;
        color: #b91c1c;
      }
      .income-btn {
        background: #dcfce7;
        color: #15803d;
      }
      .btn-icon {
        font-size: 1rem;
      }
      .chart-card {
        display: flex;
        flex-direction: column;
      }
      .chart-layout {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }
      .legend {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }
      .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.82rem;
      }
      .legend-dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .legend-name {
        flex: 1;
        color: #334155;
        font-weight: 600;
      }
      .legend-pct {
        color: #64748b;
        font-weight: 700;
      }
      .section-title-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .section-title-row h3 {
        margin: 0;
        font-size: 1rem;
        font-weight: 700;
        color: #0f172a;
      }
      .see-all-link {
        font-size: 0.8rem;
        font-weight: 700;
        color: #2563eb;
        text-decoration: none;
      }
      .tx-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
      .tx-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0.4rem;
        border-radius: 10px;
      }
      .tx-avatar {
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: #fee2e2;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
        flex-shrink: 0;
      }
      .tx-avatar.income-avatar {
        background: #dcfce7;
      }
      .tx-info {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .tx-title {
        font-weight: 700;
        color: #0f172a;
        font-size: 0.9rem;
      }
      .tx-sub {
        font-size: 0.72rem;
        color: #94a3b8;
      }
      .tx-amount {
        font-weight: 800;
        color: #ef4444;
        font-size: 0.9rem;
      }
      .tx-amount.income-amount {
        color: #16a34a;
      }
      .empty-chart {
        text-align: center;
        padding: 2rem;
        color: #94a3b8;
      }
      .empty-emoji {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 0.5rem;
      }
      .empty-state {
        text-align: center;
        padding: 1.5rem;
        color: #94a3b8;
        font-size: 0.9rem;
      }
    `,
  ],
})
export class DashboardComponent {
  private expenseService = inject(ExpenseService);
  public accountService = inject(AccountService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  // Month navigation state
  selectedYear = signal(new Date().getFullYear());
  selectedMonth = signal(new Date().getMonth()); // 0-indexed

  private MONTHS = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  private CATEGORY_ICONS: Record<string, string> = {
    'Food & Dining': '🍔',
    'Housing & Rent': '🏠',
    Transportation: '🚗',
    'Utilities & Bills': '⚡',
    Entertainment: '🎬',
    Shopping: '🛍️',
    'Health & Fitness': '❤️',
    Education: '📚',
    Travel: '✈️',
    Miscellaneous: '📦',
  };

  monthLabel = computed(() => `${this.MONTHS[this.selectedMonth()]} ${this.selectedYear()}`);

  isCurrentMonth = computed(() => {
    const now = new Date();
    return this.selectedMonth() === now.getMonth() && this.selectedYear() === now.getFullYear();
  });

  // All expenses/incomes filtered to selected month
  private monthPrefix = computed(() => {
    const m = String(this.selectedMonth() + 1).padStart(2, '0');
    return `${this.selectedYear()}-${m}`;
  });

  recentMonthTransactions = computed(() =>
    this.expenseService.expenses().filter((e) => e.date.startsWith(this.monthPrefix()))
  );

  monthSummary = computed(() => {
    const all = this.expenseService.expenses();
    const prefix = this.monthPrefix();
    const monthItems = all.filter((e) => e.date.startsWith(prefix));

    const expenses = monthItems.filter((i) => i.type === 'expense' || !i.type);
    const incomes = monthItems.filter((i) => i.type === 'income');

    const monthlySpent = expenses.reduce((s, i) => s + Number(i.amount), 0);
    const monthlyIncome = incomes.reduce((s, i) => s + Number(i.amount), 0);
    const netBalance = monthlyIncome - monthlySpent;

    const categoryMap = new Map<string, number>();
    expenses.forEach((i) => {
      categoryMap.set(i.category, (categoryMap.get(i.category) || 0) + Number(i.amount));
    });

    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        color:
          this.expenseService
            .financialSummary()
            .categoryBreakdown.find((c) => c.category === category)?.color || '#94a3b8',
        percentage: monthlySpent > 0 ? Math.round((amount / monthlySpent) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { monthlySpent, monthlyIncome, netBalance, categoryBreakdown };
  });

  getCategoryIcon(category: string): string {
    return this.CATEGORY_ICONS[category] || '📦';
  }

  prevMonth(): void {
    if (this.selectedMonth() === 0) {
      this.selectedMonth.set(11);
      this.selectedYear.update((y) => y - 1);
    } else {
      this.selectedMonth.update((m) => m - 1);
    }
  }

  nextMonth(): void {
    if (this.isCurrentMonth()) return;
    if (this.selectedMonth() === 11) {
      this.selectedMonth.set(0);
      this.selectedYear.update((y) => y + 1);
    } else {
      this.selectedMonth.update((m) => m + 1);
    }
  }

  openAdd(type: TransactionType): void {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '100%',
      maxWidth: '480px',
      data: { defaultType: type },
    });
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result?.title && result?.amount) {
        await this.expenseService.addExpense({
          type: result.type || type,
          title: result.title,
          amount: Number(result.amount),
          date: result.date,
          category: result.category,
          paymentMethod: result.paymentMethod as PaymentMethod,
          notes: result.notes || undefined,
        });
        this.snackBar.open(`${type === 'income' ? 'Income' : 'Expense'} added! 🎉`, 'OK', {
          duration: 2500,
        });
      }
    });
  }
}
