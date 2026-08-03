import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExpenseService } from '../../core/services/expense.service';
import { Expense } from '../../core/models/expense.model';
import { AddExpenseDialogComponent } from '../../shared/components/add-expense-dialog/add-expense-dialog.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRippleModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="reports-page">
      <div class="page-title-box">
        <h1>📈 Reports</h1>
        <p class="subtitle">Daily analysis & transaction management</p>
      </div>

      <!-- Single Date Selector Section -->
      <div class="m3-card date-filter-card">
        <h3>📅 Select Date</h3>
        <div class="date-inputs-row">
          <div class="date-field">
            <label>Date</label>
            <input
              type="date"
              [value]="selectedDate()"
              (input)="onDateChange($event)"
              (change)="onDateChange($event)"
              class="date-input"
              [max]="todayDate"
            />
          </div>
        </div>
      </div>

      <!-- Stats Summary Grid -->
      <div class="stats-grid">
        <div class="m3-card stat-card success">
          <span class="stat-label">Income</span>
          <span class="stat-value income-text">+₹{{ dateFilteredStats().income | number: '1.2-2' }}</span>
        </div>
        <div class="m3-card stat-card primary">
          <span class="stat-label">Expenses</span>
          <span class="stat-value expense-text">-₹{{ dateFilteredStats().expenses | number: '1.2-2' }}</span>
        </div>
        <div class="m3-card stat-card info">
          <span class="stat-label">Balance</span>
          <span class="stat-value">₹{{ dateFilteredStats().balance | number: '1.2-2' }}</span>
        </div>
      </div>

      <!-- Category Spending Breakdown -->
      <div class="m3-card breakdown-card">
        <h3>🏷️ Category Breakdown</h3>
        @if (dateFilteredStats().categoryBreakdown.length === 0) {
          <div class="empty-state">
            <span class="material-symbols-outlined empty-icon">pie_chart</span>
            <p>No transactions in selected range.</p>
          </div>
        } @else {
          <div class="breakdown-list">
            <div *ngFor="let item of dateFilteredStats().categoryBreakdown" class="breakdown-item">
              <div class="item-header">
                <span class="cat-name">{{ item.category }}</span>
                <span class="cat-val">₹{{ item.amount | number: '1.2-2' }} ({{ item.percentage }}%)</span>
              </div>
              <div class="bar-bg">
                <div class="bar-fill" [style.width.%]="item.percentage" [style.background-color]="item.color"></div>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Inline Transaction List with Direct Edit & Delete -->
      <div class="m3-card tx-section">
        <div class="tx-header-row">
          <h3>📝 Filtered Transactions ({{ dateFilteredStats().items.length }})</h3>
          <button class="csv-btn" (click)="exportCSV()" matRipple>
            <span class="material-symbols-outlined">download</span> Export CSV
          </button>
        </div>

        @if (dateFilteredStats().items.length === 0) {
          <div class="empty-state">No transactions recorded for this period.</div>
        } @else {
          <div class="tx-list">
            <div *ngFor="let item of dateFilteredStats().items" class="tx-card" (click)="editExpense(item)" matRipple>
              <div class="tx-left">
                <div class="tx-avatar" [class.income-bg]="item.type === 'income'">
                  {{ item.type === 'income' ? '📈' : '💸' }}
                </div>
                <div class="tx-info">
                  <span class="tx-title">{{ item.title }}</span>
                  <span class="tx-sub">{{ item.date }} • {{ item.category }} • {{ item.paymentMethod }}</span>
                </div>
              </div>
              <div class="tx-right">
                <span class="tx-amount" [class.income-text]="item.type === 'income'">
                  {{ item.type === 'income' ? '+' : '-' }}₹{{ item.amount | number: '1.2-2' }}
                </span>
                <button class="delete-btn" (click)="deleteExpense(item.id!, $event)" title="Delete">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .reports-page { display: flex; flex-direction: column; gap: 1.25rem; }
    .page-title-box h1 { margin: 0; font-size: 1.5rem; font-weight: 800; color: #0f172a; }
    .subtitle { margin: 0.25rem 0 0 0; color: #64748b; font-size: 0.85rem; }
    .date-filter-card h3, .breakdown-card h3, .tx-section h3 { margin-top: 0; font-size: 1.05rem; font-weight: 700; color: #0f172a; }
    .date-inputs-row { display: flex; align-items: flex-end; gap: 0.75rem; flex-wrap: wrap; }
    .date-field { display: flex; flex-direction: column; gap: 0.25rem; flex: 1; min-width: 120px; }
    .date-field label { font-size: 0.75rem; font-weight: 700; color: #64748b; }
    .date-input { padding: 0.5rem; border-radius: 10px; border: 1px solid #cbd5e1; outline: none; font-size: 0.88rem; }
    .reset-date-btn { padding: 0.55rem 1rem; border-radius: 10px; border: 1px solid #cbd5e1; background: #f8fafc; font-weight: 700; cursor: pointer; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(100px, 1fr)); gap: 0.85rem; }
    .stat-card { display: flex; flex-direction: column; gap: 0.25rem; padding: 1rem; }
    .stat-label { font-size: 0.75rem; font-weight: 600; color: #64748b; }
    .stat-value { font-size: 1.2rem; font-weight: 800; color: #0f172a; }
    .income-text { color: #16a34a; }
    .expense-text { color: #ef4444; }
    .breakdown-list { display: flex; flex-direction: column; gap: 0.85rem; }
    .item-header { display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600; margin-bottom: 0.35rem; }
    .bar-bg { height: 10px; background: #f1f5f9; border-radius: 5px; overflow: hidden; }
    .bar-fill { height: 100%; transition: width 0.3s ease; }
    .tx-header-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; }
    .csv-btn { display: flex; align-items: center; gap: 0.35rem; padding: 0.4rem 0.85rem; border-radius: 10px; border: 1px solid #cbd5e1; background: white; font-weight: 700; font-size: 0.8rem; cursor: pointer; }
    .tx-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .tx-card { display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0.85rem; background: #f8fafc; border-radius: 12px; cursor: pointer; }
    .tx-left { display: flex; align-items: center; gap: 0.75rem; }
    .tx-avatar { width: 36px; height: 36px; border-radius: 10px; background: #fee2e2; display: flex; align-items: center; justify-content: center; font-size: 1rem; }
    .tx-avatar.income-bg { background: #dcfce7; }
    .tx-info { display: flex; flex-direction: column; }
    .tx-title { font-weight: 700; font-size: 0.88rem; color: #0f172a; }
    .tx-sub { font-size: 0.72rem; color: #64748b; }
    .tx-right { display: flex; align-items: center; gap: 0.5rem; }
    .tx-amount { font-weight: 800; font-size: 0.95rem; color: #ef4444; }
    .delete-btn { background: none; border: none; color: #cbd5e1; cursor: pointer; &:hover { color: #ef4444; } }
    .empty-state { text-align: center; padding: 1.5rem; color: #94a3b8; font-size: 0.88rem; }
  `]
})
export class ReportsComponent {
  private expenseService = inject(ExpenseService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public expenses = this.expenseService.expenses;

  public todayDate = new Date().toISOString().split('T')[0];
  public selectedDate = signal<string>(this.todayDate);

  onDateChange(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    if (val) {
      this.selectedDate.set(val);
    }
  }

  public dateFilteredStats = computed(() => {
    const all = this.expenses();
    const dateVal = this.selectedDate();
    const items = all.filter((e) => {
      if (!e.date) return false;
      const cleanItemDate = e.date.includes('T') ? e.date.split('T')[0] : e.date;
      return cleanItemDate === dateVal;
    });

    let income = 0;
    let expenses = 0;
    const catMap = new Map<string, number>();

    items.forEach((e) => {
      if (e.type === 'income') {
        income += Number(e.amount);
      } else {
        expenses += Number(e.amount);
        catMap.set(e.category, (catMap.get(e.category) || 0) + Number(e.amount));
      }
    });

    const categoryBreakdown = Array.from(catMap.entries())
      .map(([category, amount]) => ({
        category,
        amount,
        color: '#2563eb',
        percentage: expenses > 0 ? Math.round((amount / expenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return { income, expenses, balance: income - expenses, items, categoryBreakdown };
  });

  editExpense(expense: Expense): void {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '100%',
      maxWidth: '480px',
      data: { expense },
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.title && result.amount) {
        await this.expenseService.updateExpense(expense.id!, {
          title: result.title,
          amount: Number(result.amount),
          date: result.date,
          category: result.category,
          paymentMethod: result.paymentMethod,
          notes: result.notes || undefined,
          type: result.type,
        });

        this.snackBar.open('Transaction updated! ✨', 'Dismiss', { duration: 3000 });
      }
    });
  }

  async deleteExpense(id: number, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    const { ConfirmDialogComponent } = await import('../../shared/components/confirm-dialog/confirm-dialog.component');
    const confirmRef = this.dialog.open(ConfirmDialogComponent, {
      width: '320px',
      data: { message: 'Delete this transaction?' },
    });

    confirmRef.afterClosed().subscribe(async (confirmed) => {
      if (confirmed) {
        await this.expenseService.deleteExpense(id);
        this.snackBar.open('Transaction deleted', 'Dismiss', { duration: 3000 });
      }
    });
  }

  exportCSV(): void {
    const stats = this.dateFilteredStats();
    if (stats.items.length === 0) return;

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
    link.setAttribute('download', `fincz_report_${this.selectedDate()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
