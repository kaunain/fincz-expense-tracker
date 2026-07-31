/**
 * @file expenses.component.ts
 * @description Expense Management Component supporting full CRUD operations, live reactive filtering,
 * category selection, and modal transaction creation.
 */

import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../../core/services/expense.service';
import { CategoryService } from '../../core/services/category.service';
import { Expense, PaymentMethod } from '../../core/models/expense.model';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="expenses-page">
      <!-- Header -->
      <div class="page-header">
        <div>
          <h1>💸 Expenses Manager</h1>
          <p class="subtitle">Add, filter, and track all your daily transactions locally.</p>
        </div>
        <button class="btn btn-primary" (click)="openAddModal()">
          + Add New Expense
        </button>
      </div>

      <!-- Filters Toolbar -->
      <div class="card filter-toolbar">
        <div class="filter-group">
          <label>Search</label>
          <input 
            type="text" 
            placeholder="Search by title or notes..." 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="applyFilters()"
            class="form-control"
          />
        </div>

        <div class="filter-group">
          <label>Category</label>
          <select [(ngModel)]="selectedCategory" (change)="applyFilters()" class="form-control">
            <option value="">All Categories</option>
            <option *ngFor="let cat of categories()" [value]="cat.name">{{ cat.name }}</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Payment Method</label>
          <select [(ngModel)]="selectedPaymentMethod" (change)="applyFilters()" class="form-control">
            <option value="">All Payment Methods</option>
            <option value="Cash">Cash</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="UPI">UPI</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>
        </div>

        <button class="btn btn-secondary" (click)="resetFilters()">Reset Filters</button>
      </div>

      <!-- Transactions List Table -->
      <div class="card table-card">
        <div *ngIf="expenses().length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No expenses found</h3>
          <p>Try clearing your filters or click "+ Add New Expense" to create one.</p>
        </div>

        <div *ngIf="expenses().length > 0" class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Title</th>
                <th>Category</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of expenses()">
                <td class="date-col">{{ item.date }}</td>
                <td>
                  <div class="item-title">{{ item.title }}</div>
                  <small *ngIf="item.notes" class="item-notes">{{ item.notes }}</small>
                </td>
                <td>
                  <span class="badge category-badge">{{ item.category }}</span>
                </td>
                <td>
                  <span class="badge method-badge">{{ item.paymentMethod }}</span>
                </td>
                <td class="amount-col">-\${{ item.amount | number:'1.2-2' }}</td>
                <td class="text-right actions-col">
                  <button class="icon-btn edit-btn" (click)="editExpense(item)" title="Edit">✏️</button>
                  <button class="icon-btn delete-btn" (click)="deleteExpense(item.id!)" title="Delete">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add/Edit Expense Modal Overlay -->
      <div *ngIf="showModal()" class="modal-backdrop" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>{{ editingId() ? 'Edit Expense' : 'Add New Expense' }}</h2>
            <button class="close-btn" (click)="closeModal()">✕</button>
          </div>

          <form [formGroup]="expenseForm" (ngSubmit)="saveExpense()">
            <div class="form-group">
              <label>Title / Description *</label>
              <input type="text" formControlName="title" placeholder="e.g. Grocery Shopping" class="form-control" />
              <small *ngIf="expenseForm.get('title')?.invalid && expenseForm.get('title')?.touched" class="error-text">
                Title is required.
              </small>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Amount (\$) *</label>
                <input type="number" step="0.01" formControlName="amount" placeholder="0.00" class="form-control" />
              </div>

              <div class="form-group">
                <label>Date *</label>
                <input type="date" formControlName="date" class="form-control" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Category *</label>
                <select formControlName="category" class="form-control">
                  <option *ngFor="let cat of categories()" [value]="cat.name">{{ cat.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label>Payment Method *</label>
                <select formControlName="paymentMethod" class="form-control">
                  <option value="Cash">Cash</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Notes (Optional)</label>
              <textarea formControlName="notes" rows="2" placeholder="Additional details..." class="form-control"></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" [disabled]="expenseForm.invalid" class="btn btn-primary">
                {{ editingId() ? 'Update Transaction' : 'Save Expense' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .expenses-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .page-header {
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
    .card {
      background: white;
      border-radius: 12px;
      padding: 1.25rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .filter-toolbar {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-end;
    }
    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      flex: 1;
      min-width: 180px;
    }
    .filter-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #475569;
    }
    .form-control {
      padding: 0.6rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }
    .form-control:focus {
      border-color: #2563eb;
    }
    .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
    }
    .btn-primary {
      background-color: #2563eb;
      color: white;

      &:hover {
        background-color: #1d4ed8;
      }

      &:disabled {
        background-color: #94a3b8;
        cursor: not-allowed;
      }
    }
    .btn-secondary {
      background-color: #f1f5f9;
      color: #334155;

      &:hover {
        background-color: #e2e8f0;
      }
    }
    .data-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .data-table th, .data-table td {
      padding: 0.85rem 1rem;
      border-bottom: 1px solid #f1f5f9;
    }
    .data-table th {
      background: #f8fafc;
      font-size: 0.8rem;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
    }
    .item-title {
      font-weight: 600;
      color: #1e293b;
    }
    .item-notes {
      color: #64748b;
      font-size: 0.8rem;
    }
    .badge {
      padding: 0.25rem 0.6rem;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .category-badge {
      background: #eff6ff;
      color: #1d4ed8;
    }
    .method-badge {
      background: #f1f5f9;
      color: #475569;
    }
    .amount-col {
      font-weight: 700;
      color: #ef4444;
    }
    .text-right {
      text-align: right;
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.1rem;
      padding: 0.25rem;
      margin-left: 0.25rem;
    }
    .empty-state {
      text-align: center;
      padding: 3rem 1rem;
      color: #64748b;
    }
    .empty-icon {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(15, 23, 42, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background: white;
      border-radius: 12px;
      width: 90%;
      max-width: 540px;
      padding: 1.5rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    .modal-header h2 {
      margin: 0;
      font-size: 1.25rem;
      color: #0f172a;
    }
    .close-btn {
      background: none;
      border: none;
      font-size: 1.25rem;
      cursor: pointer;
      color: #64748b;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 1rem;
    }
    .form-group label {
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1.5rem;
    }
    .error-text {
      color: #ef4444;
      font-size: 0.75rem;
    }
  `]
})
export class ExpensesComponent {
  private expenseService = inject(ExpenseService);
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);

  /** Public Signals */
  public expenses = this.expenseService.filteredExpenses;
  public categories = this.categoryService.categories;

  /** Filter Local State */
  public searchQuery = '';
  public selectedCategory = '';
  public selectedPaymentMethod = '';

  /** Modal State Signals */
  public showModal = signal<boolean>(false);
  public editingId = signal<number | null>(null);

  /** Reactive Form */
  public expenseForm = this.fb.group({
    title: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    category: ['Food & Dining', Validators.required],
    paymentMethod: ['Cash' as PaymentMethod, Validators.required],
    notes: ['']
  });

  applyFilters(): void {
    this.expenseService.setFilter({
      searchQuery: this.searchQuery,
      category: this.selectedCategory,
      paymentMethod: this.selectedPaymentMethod
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedPaymentMethod = '';
    this.applyFilters();
  }

  openAddModal(): void {
    this.editingId.set(null);
    this.expenseForm.reset({
      title: '',
      amount: null,
      date: new Date().toISOString().slice(0, 10),
      category: this.categories()[0]?.name || 'Food & Dining',
      paymentMethod: 'Cash',
      notes: ''
    });
    this.showModal.set(true);
  }

  editExpense(expense: Expense): void {
    this.editingId.set(expense.id || null);
    this.expenseForm.patchValue({
      title: expense.title,
      amount: expense.amount,
      date: expense.date,
      category: expense.category,
      paymentMethod: expense.paymentMethod,
      notes: expense.notes || ''
    });
    this.showModal.set(true);
  }

  closeModal(): void {
    this.showModal.set(false);
  }

  async saveExpense(): Promise<void> {
    if (this.expenseForm.invalid) return;

    const formVal = this.expenseForm.value;
    const expenseData = {
      title: formVal.title!,
      amount: Number(formVal.amount!),
      date: formVal.date!,
      category: formVal.category!,
      paymentMethod: formVal.paymentMethod as PaymentMethod,
      notes: formVal.notes || undefined
    };

    if (this.editingId()) {
      await this.expenseService.updateExpense(this.editingId()!, expenseData);
    } else {
      await this.expenseService.addExpense(expenseData);
    }

    this.closeModal();
  }

  async deleteExpense(id: number): Promise<void> {
    if (confirm('Are you sure you want to delete this expense record?')) {
      await this.expenseService.deleteExpense(id);
    }
  }
}
