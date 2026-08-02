import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpenseService } from '../../core/services/expense.service';
import { TransactionType } from '../../core/models/expense.model';

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

      <!-- Month Selector -->
      <div class="month-selector">
        <button class="nav-btn" (click)="prevMonth()">
          <span class="material-symbols-outlined">chevron_left</span>
        </button>
        <div class="current-month">{{ currentMonthLabel() }}</div>
        <button class="nav-btn" (click)="nextMonth()" [disabled]="isCurrentMonth()">
          <span class="material-symbols-outlined">chevron_right</span>
        </button>
      </div>

      <!-- Stats Row -->
      <div class="stats-grid">
        <div class="m3-card stat-card success">
          <span class="stat-label">Income</span>
          <span class="stat-value income-text"
            >+₹{{ currentMonthStats().income | number: '1.2-2' }}</span
          >
        </div>
        <div class="m3-card stat-card primary">
          <span class="stat-label">Expenses</span>
          <span class="stat-value expense-text"
            >-₹{{ currentMonthStats().expenses | number: '1.2-2' }}</span
          >
        </div>
        <div class="m3-card stat-card info">
          <span class="stat-label">Balance</span>
          <span class="stat-value">₹{{ currentMonthStats().balance | number: '1.2-2' }}</span>
        </div>
      </div>

      <!-- Last 6 Months Trend (Pure CSS Bar Chart) -->
      <div class="m3-card trend-card">
        <h3>📊 6-Month Spending Trend</h3>
        <div class="trend-chart-container">
          <div class="trend-bar-wrapper" *ngFor="let month of lastSixMonthsTrend()">
            <div class="trend-amount">₹{{ month.amount | number: '1.0-0' }}</div>
            <div class="trend-bar-bg">
              <div class="trend-bar-fill" [style.height.%]="month.percentage"></div>
            </div>
            <div class="trend-month-label">{{ month.label }}</div>
          </div>
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
              <span class="cat-val"
                >₹{{ item.amount | number: '1.2-2' }} ({{ item.percentage }}%)</span
              >
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

      <!-- CSV Export Button -->
      <button class="csv-btn m3-card" (click)="exportCSV()">
        <span class="material-symbols-outlined">download</span>
        Export {{ currentMonthLabel() }} to CSV
      </button>
    </div>
  `,
  styles: [
    `
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
      .month-selector {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: white;
        padding: 0.5rem 1rem;
        border-radius: 16px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        border: 1px solid #e2e8f0;
      }
      .nav-btn {
        background: #f1f5f9;
        border: none;
        border-radius: 50%;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #475569;
        transition: all 0.2s;
      }
      .nav-btn:hover:not(:disabled) {
        background: #e2e8f0;
        color: #0f172a;
      }
      .nav-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      .current-month {
        font-weight: 700;
        font-size: 1.1rem;
        color: #0f172a;
      }
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        gap: 0.85rem;
      }
      .stat-card {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        padding: 1rem;
      }
      .stat-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #64748b;
      }
      .stat-value {
        font-size: 1.2rem;
        font-weight: 800;
        color: #0f172a;
      }
      .income-text {
        color: #16a34a;
      }
      .expense-text {
        color: #ef4444;
      }

      .trend-card h3 {
        margin-top: 0;
        font-size: 1.05rem;
        font-weight: 700;
        color: #0f172a;
        margin-bottom: 1.5rem;
      }
      .trend-chart-container {
        display: flex;
        justify-content: space-around;
        align-items: flex-end;
        height: 180px;
        padding-top: 20px;
      }
      .trend-bar-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        width: 40px;
      }
      .trend-amount {
        font-size: 0.65rem;
        color: #64748b;
        margin-bottom: 0.5rem;
        font-weight: 600;
        text-align: center;
      }
      .trend-bar-bg {
        flex: 1;
        width: 12px;
        background: #f1f5f9;
        border-radius: 6px;
        display: flex;
        align-items: flex-end;
      }
      .trend-bar-fill {
        width: 100%;
        background: #3b82f6;
        border-radius: 6px;
        transition: height 0.4s ease;
      }
      .trend-month-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: #475569;
        margin-top: 0.5rem;
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

      .csv-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        background: white;
        border: 1px solid #e2e8f0;
        color: #0f172a;
        font-weight: 600;
        font-size: 1rem;
        padding: 1rem;
        cursor: pointer;
        border-radius: 16px;
        transition: background 0.2s;
      }
      .csv-btn:hover {
        background: #f8fafc;
      }
      .csv-btn .material-symbols-outlined {
        font-size: 1.25rem;
      }
    `,
  ],
})
export class ReportsComponent {
  private expenseService = inject(ExpenseService);

  public summary = this.expenseService.financialSummary;
  public expenses = this.expenseService.expenses;

  // Month selector state
  private viewDate = new Date();

  public currentMonthLabel = computed(() => {
    return this.viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  });

  public isCurrentMonth(): boolean {
    const today = new Date();
    return (
      this.viewDate.getMonth() === today.getMonth() &&
      this.viewDate.getFullYear() === today.getFullYear()
    );
  }

  public prevMonth(): void {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
    // Force reactivity update by reassigning
    this.viewDate = new Date(this.viewDate);
  }

  public nextMonth(): void {
    if (!this.isCurrentMonth()) {
      this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
      this.viewDate = new Date(this.viewDate);
    }
  }

  public currentMonthStats = computed(() => {
    const year = this.viewDate.getFullYear();
    const month = this.viewDate.getMonth();

    let income = 0;
    let expenses = 0;

    const filtered = this.expenses().filter((e) => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    filtered.forEach((e) => {
      if (e.type === 'income') income += e.amount;
      else expenses += e.amount;
    });

    return {
      income,
      expenses,
      balance: income - expenses,
      count: filtered.length,
      items: filtered,
    };
  });

  public lastSixMonthsTrend = computed(() => {
    const trend = [];
    const today = new Date(this.viewDate); // Anchor to viewDate or today? usually today for 6-months trend.
    // Let's use today as the anchor for the "Last 6 months"
    const anchor = new Date();

    let maxAmount = 0;
    const monthsData = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(anchor.getFullYear(), anchor.getMonth() - i, 1);
      const label = d.toLocaleString('default', { month: 'short' });

      let amount = 0;
      this.expenses().forEach((e) => {
        const ed = new Date(e.date);
        if (
          ed.getFullYear() === d.getFullYear() &&
          ed.getMonth() === d.getMonth() &&
          e.type !== 'income'
        ) {
          amount += e.amount;
        }
      });

      if (amount > maxAmount) maxAmount = amount;
      monthsData.push({ label, amount });
    }

    // Calculate percentages
    return monthsData.map((m) => ({
      label: m.label,
      amount: m.amount,
      percentage: maxAmount > 0 ? (m.amount / maxAmount) * 100 : 0,
    }));
  });

  public exportCSV(): void {
    const stats = this.currentMonthStats();
    if (stats.items.length === 0) {
      alert('No transactions to export for this month.');
      return;
    }

    const headers = ['Date', 'Title', 'Type', 'Category', 'Amount', 'Payment Method', 'Notes'];
    const rows = stats.items.map((e) => [
      e.date,
      `"${e.title.replace(/"/g, '""')}"`,
      e.type || 'expense',
      `"${e.category}"`,
      e.amount,
      e.paymentMethod,
      `"${(e.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `fincz_transactions_${this.viewDate.getFullYear()}_${this.viewDate.getMonth() + 1}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
