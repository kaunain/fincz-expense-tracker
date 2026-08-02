/**
 * @file expenses.component.ts
 * @description Transaction list with filtering by type, date range, category, and search.
 *
 * Changes:
 * - Empty state now shows a CTA button to add first transaction
 * - Delete uses Material Dialog confirmation instead of native browser confirm()
 * - emojiMap updated to match new shorter category names
 */

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ExpenseService } from '../../core/services/expense.service';
import { CategoryService } from '../../core/services/category.service';
import { Expense } from '../../core/models/expense.model';
import { AddExpenseDialogComponent } from '../../shared/components/add-expense-dialog/add-expense-dialog.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRippleModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="expenses-page">
      <!-- Income / Expense Tabs -->
      <div class="type-tabs">
        <button
          class="tab-btn"
          [class.active]="selectedType === undefined"
          (click)="selectType(undefined)"
          matRipple
        >
          All
        </button>
        <button
          class="tab-btn"
          [class.active]="selectedType === 'expense'"
          (click)="selectType('expense')"
          matRipple
        >
          Expenses
        </button>
        <button
          class="tab-btn"
          [class.active]="selectedType === 'income'"
          (click)="selectType('income')"
          matRipple
        >
          Income
        </button>
      </div>

      <!-- Date Range Chips -->
      <div class="date-chips-carousel">
        <button
          class="date-chip"
          [class.active]="selectedDateRange === 'today'"
          (click)="selectDateRange('today')"
          matRipple
        >
          Today
        </button>
        <button
          class="date-chip"
          [class.active]="selectedDateRange === 'week'"
          (click)="selectDateRange('week')"
          matRipple
        >
          This Week
        </button>
        <button
          class="date-chip"
          [class.active]="selectedDateRange === 'month'"
          (click)="selectDateRange('month')"
          matRipple
        >
          This Month
        </button>
        <button
          class="date-chip"
          [class.active]="selectedDateRange === 'all'"
          (click)="selectDateRange('all')"
          matRipple
        >
          All Time
        </button>
      </div>

      <!-- Search & Filters Bar -->
      <div class="search-box">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="applyFilters()"
          placeholder="Search by description or notes..."
          class="search-input"
        />
        <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">✕</button>
      </div>

      <!-- Category Filter Chips Carousel -->
      <div class="chips-carousel-wrapper">
        <div class="chips-carousel">
          <button
            class="chip"
            [class.active]="selectedCategory === ''"
            (click)="selectCategory('')"
            matRipple
          >
            All
          </button>
          <button
            *ngFor="let cat of categories()"
            class="chip"
            [class.active]="selectedCategory === cat.name"
            (click)="selectCategory(cat.name)"
            matRipple
          >
            <span class="chip-dot" [style.background-color]="cat.color"></span>
            <span class="chip-name">{{ getCategoryEmoji(cat.name) }} {{ cat.name }}</span>
          </button>
        </div>
      </div>

      <!-- Transaction List Section -->
      <div class="transactions-container">
        <div *ngIf="expenses().length === 0" class="empty-state m3-card">
          <div class="empty-icon">💸</div>
          <h3>No transactions found</h3>
          <p>Adjust your filters or add a new transaction.</p>
          <!-- CTA button shown when there are zero transactions (no filters active) -->
          <button
            *ngIf="!searchQuery && !selectedCategory && selectedType === undefined"
            class="empty-cta-btn"
            (click)="openAddDialog()"
            matRipple
          >
            <span class="material-symbols-outlined">add_circle</span>
            Add your first transaction →
          </button>
        </div>

        <div
          *ngFor="let item of expenses()"
          class="transaction-card m3-card"
          matRipple
          (click)="editExpense(item)"
        >
          <div class="card-left">
            <div
              class="icon-avatar"
              [class.income-bg]="item.type === 'income'"
              [class.expense-bg]="item.type !== 'income'"
            >
              <span class="emoji-icon">{{ getCategoryEmoji(item.category) }}</span>
            </div>
            <div class="tx-info">
              <span class="tx-title">{{ item.title }}</span>
              <div class="tx-meta-row">
                <span class="meta-tag date">{{ item.date }}</span>
                <span class="meta-tag cat">{{ item.category }}</span>
                <span class="meta-tag method">{{ item.paymentMethod }}</span>
              </div>
            </div>
          </div>

          <div class="card-right">
            <span
              class="tx-amount"
              [class.income-text]="item.type === 'income'"
              [class.expense-text]="item.type !== 'income'"
            >
              {{ item.type === 'income' ? '+' : '-' }}₹{{ item.amount | number: '1.2-2' }}
            </span>
            <button
              class="delete-icon-btn"
              (click)="deleteExpense(item.id!, $event)"
              title="Delete"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .expenses-page {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      .type-tabs {
        display: flex;
        background: #f1f5f9;
        border-radius: 12px;
        padding: 0.25rem;
        gap: 0.25rem;
      }
      .tab-btn {
        flex: 1;
        padding: 0.5rem;
        border: none;
        background: transparent;
        border-radius: 8px;
        font-weight: 600;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .tab-btn.active {
        background: white;
        color: #0f172a;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      .date-chips-carousel {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        padding-bottom: 0.25rem;
        scrollbar-width: none;
        &::-webkit-scrollbar {
          display: none;
        }
      }
      .date-chip {
        padding: 0.4rem 1rem;
        border-radius: 20px;
        border: 1px solid #cbd5e1;
        background: white;
        color: #475569;
        font-size: 0.85rem;
        font-weight: 600;
        white-space: nowrap;
        cursor: pointer;
      }
      .date-chip.active {
        background: #1e293b;
        color: white;
        border-color: #1e293b;
      }
      .search-box {
        display: flex;
        align-items: center;
        background: white;
        border-radius: 16px;
        padding: 0.5rem 1rem;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
      }
      .search-icon {
        color: #94a3b8;
        margin-right: 0.5rem;
      }
      .search-input {
        border: none;
        background: transparent;
        outline: none;
        width: 100%;
        font-size: 0.95rem;
        color: #0f172a;
      }
      .clear-btn {
        background: none;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        font-weight: bold;
      }
      .chips-carousel-wrapper {
        width: 100%;
        overflow: hidden;
      }
      .chips-carousel {
        display: flex;
        gap: 0.5rem;
        overflow-x: auto;
        padding: 0.35rem 0.15rem;
        scrollbar-width: none;
        -ms-overflow-style: none;
        -webkit-overflow-scrolling: touch;

        &::-webkit-scrollbar {
          display: none;
        }
      }
      .chip {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.4rem;
        padding: 0.5rem 1rem;
        border-radius: 9999px;
        background: white;
        color: #475569;
        border: 1px solid #cbd5e1;
        font-size: 0.85rem;
        font-weight: 600;
        white-space: nowrap;
        flex-shrink: 0;
        min-height: 38px;
        line-height: 1;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .chip-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        flex-shrink: 0;
      }
      .chip-name {
        white-space: nowrap;
      }
      .chip.active {
        background: #2563eb;
        color: white;
        border-color: #2563eb;
      }
      .transactions-container {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
      }
      .transaction-card {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem;
        cursor: pointer;
      }
      .card-left {
        display: flex;
        align-items: center;
        gap: 0.85rem;
      }
      .icon-avatar {
        width: 44px;
        height: 44px;
        border-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }
      .income-bg {
        background: #dcfce7;
      }
      .expense-bg {
        background: #fee2e2;
      }
      .emoji-icon {
        font-size: 1.5rem;
      }
      .tx-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }
      .tx-title {
        font-weight: 700;
        color: #0f172a;
        font-size: 0.95rem;
      }
      .tx-meta-row {
        display: flex;
        align-items: center;
        gap: 0.35rem;
        flex-wrap: wrap;
      }
      .meta-tag {
        font-size: 0.7rem;
        padding: 0.15rem 0.45rem;
        border-radius: 6px;
        font-weight: 600;
      }
      .meta-tag.date {
        background: #f1f5f9;
        color: #64748b;
      }
      .meta-tag.cat {
        background: #eff6ff;
        color: #1d4ed8;
      }
      .meta-tag.method {
        background: #f8fafc;
        color: #475569;
        border: 1px solid #e2e8f0;
      }
      .card-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .tx-amount {
        font-weight: 800;
        font-size: 1.05rem;
        white-space: nowrap;
      }
      .income-text {
        color: #16a34a;
      }
      .expense-text {
        color: #ef4444;
      }
      .delete-icon-btn {
        background: none;
        border: none;
        color: #cbd5e1;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 50%;

        &:hover {
          color: #ef4444;
        }
      }
      .empty-state {
        text-align: center;
        padding: 3rem 1rem;
        color: #94a3b8;
      }
      .empty-icon {
        font-size: 3rem;
        margin-bottom: 0.5rem;
      }
      /* CTA button shown in empty state when no filters are active */
      .empty-cta-btn {
        margin-top: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: #2563eb;
        color: white;
        border: none;
        border-radius: 14px;
        font-size: 0.95rem;
        font-weight: 700;
        cursor: pointer;
        font-family: inherit;
        transition: background-color 0.2s;

        &:hover {
          background: #1d4ed8;
        }
      }
    `,
  ],
})
export class ExpensesComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.expenseService.refreshExpenses();
    this.applyFilters();
  }

  public expenses = this.expenseService.filteredExpenses;
  public categories = this.categoryService.categories;

  public searchQuery = '';
  public selectedCategory = '';
  public selectedType: 'expense' | 'income' | undefined = undefined;
  public selectedDateRange: 'today' | 'week' | 'month' | 'all' = 'all';

  private emojiMap: Record<string, string> = {
    // Updated to match new shorter category names (v3 migration)
    Food: '🍔',
    Rent: '🏠',
    Transport: '🚗',
    Bills: '⚡',
    Entertainment: '🎬',
    Shopping: '🛍️',
    Health: '❤️',
    Education: '📚',
    Travel: '✈️',
    Miscellaneous: '📦',
    Transfer: '🔄',
    Salary: '💼',
    Freelance: '💻',
    Business: '🏢',
    Investment: '📈',
    Gift: '🎁',
    Rental: '🏘️',
    Pension: '👴',
    Other: '💰',
  };

  getCategoryEmoji(categoryName: string): string {
    return this.emojiMap[categoryName] || '🏷️';
  }

  applyFilters(): void {
    this.expenseService.setFilter({
      searchQuery: this.searchQuery,
      category: this.selectedCategory,
      type: this.selectedType,
      dateRange: this.selectedDateRange,
    });
  }

  selectType(type: 'expense' | 'income' | undefined): void {
    this.selectedType = type;
    this.applyFilters();
  }

  selectDateRange(range: 'today' | 'week' | 'month' | 'all'): void {
    this.selectedDateRange = range;
    this.applyFilters();
  }

  selectCategory(categoryName: string): void {
    this.selectedCategory = categoryName;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

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

        this.snackBar.open('Transaction updated successfully! ✨', 'Dismiss', {
          duration: 3000,
        });
      }
    });
  }

  /** Opens the Add Transaction dialog (used by empty-state CTA button) */
  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '100%',
      maxWidth: '480px',
      panelClass: 'm3-dialog-panel',
      data: { defaultType: 'expense' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.snackBar.open('Transaction saved! 🎉', 'Dismiss', { duration: 3000 });
      }
    });
  }

  async deleteExpense(id: number, event: MouseEvent): Promise<void> {
    event.stopPropagation();

    // Use Material Dialog for a nicer confirmation UX instead of native browser confirm()
    const { ConfirmDialogComponent } =
      await import('../../shared/components/confirm-dialog/confirm-dialog.component');
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
}
