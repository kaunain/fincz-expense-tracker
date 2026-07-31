/**
 * @file expenses.component.ts
 * @description Mobile-First Expenses Manager with sticky search, category chips carousel,
 * transaction list items, and MatDialog / MatSnackBar CRUD integration.
 */

import { Component, inject } from '@angular/core';
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
  imports: [
    CommonModule,
    FormsModule,
    MatRippleModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  template: `
    <div class="expenses-page">
      <!-- Search & Filters Bar -->
      <div class="search-box">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          type="text"
          [(ngModel)]="searchQuery"
          (ngModelChange)="applyFilters()"
          placeholder="Search by description..."
          class="search-input"
        />
        <button *ngIf="searchQuery" class="clear-btn" (click)="clearSearch()">✕</button>
      </div>

      <!-- Category Filter Chips Carousel -->
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
          {{ cat.name }}
        </button>
      </div>

      <!-- Transaction List Section -->
      <div class="transactions-container">
        <div *ngIf="expenses().length === 0" class="empty-state m3-card">
          <span class="material-symbols-outlined empty-icon">receipt_long</span>
          <h3>No transactions found</h3>
          <p>Tap the + button below to add your first expense.</p>
        </div>

        <div *ngFor="let item of expenses()" class="transaction-card m3-card" matRipple (click)="editExpense(item)">
          <div class="card-left">
            <div class="icon-avatar">
              <span class="material-symbols-outlined">payments</span>
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
            <span class="tx-amount">-\${{ item.amount | number:'1.2-2' }}</span>
            <button class="delete-icon-btn" (click)="deleteExpense(item.id!, $event)" title="Delete">
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .expenses-page {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .search-box {
      display: flex;
      align-items: center;
      background: white;
      border-radius: 16px;
      padding: 0.5rem 1rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.04);
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
    .chips-carousel {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding: 0.25rem 0;

      &::-webkit-scrollbar {
        display: none;
      }
    }
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.45rem 0.9rem;
      border-radius: 9999px;
      background: white;
      color: #475569;
      border: 1px solid #cbd5e1;
      font-size: 0.8rem;
      font-weight: 600;
      white-space: nowrap;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .chip-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
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
      background: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .tx-info {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
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
      color: #ef4444;
      font-size: 1.05rem;
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
  `]
})
export class ExpensesComponent {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);

  public expenses = this.expenseService.filteredExpenses;
  public categories = this.categoryService.categories;

  public searchQuery = '';
  public selectedCategory = '';

  applyFilters(): void {
    this.expenseService.setFilter({
      searchQuery: this.searchQuery,
      category: this.selectedCategory
    });
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
      data: { expense }
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result && result.title && result.amount) {
        await this.expenseService.updateExpense(expense.id!, {
          title: result.title,
          amount: Number(result.amount),
          date: result.date,
          category: result.category,
          paymentMethod: result.paymentMethod,
          notes: result.notes || undefined
        });

        this.snackBar.open('Expense updated successfully! ✨', 'Dismiss', {
          duration: 3000
        });
      }
    });
  }

  async deleteExpense(id: number, event: MouseEvent): Promise<void> {
    event.stopPropagation();
    if (confirm('Delete this transaction record?')) {
      await this.expenseService.deleteExpense(id);
      this.snackBar.open('Transaction deleted', 'Dismiss', { duration: 3000 });
    }
  }
}
