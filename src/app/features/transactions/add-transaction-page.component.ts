import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from '../../core/services/category.service';
import { ExpenseService } from '../../core/services/expense.service';
import { PaymentMethod } from '../../core/models/expense.model';

@Component({
  selector: 'app-add-transaction-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, MatButtonModule],
  template: `
    <div class="transaction-page m3-card">
      <div class="header">
        <h2>{{ selectedType() === 'income' ? '💰 New Income' : '💸 New Expense' }}</h2>
        <p class="subtitle">Quick single-tap transaction entry</p>
      </div>

      <!-- Expense / Income Toggle -->
      <div class="type-toggle">
        <button
          type="button"
          class="toggle-btn"
          [class.active]="selectedType() === 'expense'"
          (click)="setType('expense')"
        >
          Expense
        </button>
        <button
          type="button"
          class="toggle-btn"
          [class.active]="selectedType() === 'income'"
          (click)="setType('income')"
        >
          Income
        </button>
      </div>

      <form (ngSubmit)="onSubmit()" class="tx-form">
        <!-- Hero Amount Box -->
        <div class="amount-box" [class.income-bg]="selectedType() === 'income'">
          <span class="currency" [class.income-text]="selectedType() === 'income'">₹</span>
          <input
            type="number"
            step="0.01"
            [(ngModel)]="amount"
            name="amount"
            placeholder="0.00"
            class="amount-input"
            [class.income-text]="selectedType() === 'income'"
            required
            autofocus
          />
        </div>

        <!-- Notes Input (Single entry detail field) -->
        <div class="field-group">
          <label>Notes (Optional)</label>
          <input
            type="text"
            [(ngModel)]="notes"
            name="notes"
            placeholder="e.g. Lunch at Cafe, Monthly Salary"
            class="input-control"
          />
        </div>

        <!-- Category Grid -->
        <div class="field-group">
          <label>Category</label>
          <div class="category-grid">
            <button
              *ngFor="let cat of filteredCategories()"
              type="button"
              class="cat-chip"
              [class.selected]="selectedCategory === cat.name"
              [style.--chip-color]="cat.color"
              (click)="selectedCategory = cat.name"
            >
              <span class="chip-icon" *ngIf="isEmoji(cat.icon)">{{ cat.icon }}</span>
              <span class="material-symbols-outlined chip-mat-icon" *ngIf="!isEmoji(cat.icon) && cat.icon">{{ cat.icon }}</span>
              <span class="chip-label">{{ cat.name }}</span>
            </button>
          </div>
        </div>

        <div class="form-row">
          <div class="field-group half">
            <label>Payment Method</label>
            <select [(ngModel)]="paymentMethod" name="paymentMethod" class="select-control">
              <option value="UPI">📱 UPI / GPay</option>
              <option value="Cash">💵 Cash</option>
              <option value="Credit Card">💳 Credit Card</option>
              <option value="Debit Card">💳 Debit Card</option>
              <option value="Bank Transfer">🏦 Bank Transfer</option>
            </select>
          </div>

          <div class="field-group half">
            <label>Date</label>
            <input type="date" [(ngModel)]="dateStr" name="dateStr" class="input-control" [max]="todayStr" />
          </div>
        </div>

        <div class="actions">
          <a routerLink="/" mat-button>Cancel</a>
          <button
            type="submit"
            mat-flat-button
            color="primary"
            [disabled]="!amount || amount <= 0"
            class="save-btn"
          >
            Save Transaction
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .transaction-page {
      max-width: 520px;
      margin: 0 auto;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .header h2 {
      margin: 0;
      font-size: 1.35rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .subtitle {
      margin: 0.25rem 0 0 0;
      color: var(--text-muted);
      font-size: 0.85rem;
    }
    .type-toggle {
      display: flex;
      background: var(--bg-color);
      border-radius: var(--radius-sm);
      padding: 0.25rem;
      gap: 0.25rem;
    }
    .toggle-btn {
      flex: 1;
      padding: 0.5rem;
      border: none;
      background: transparent;
      border-radius: 6px;
      font-weight: 700;
      color: var(--text-muted);
      cursor: pointer;
    }
    .toggle-btn.active {
      background: var(--surface-color);
      color: var(--text-main);
      box-shadow: var(--shadow-sm);
    }
    .tx-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .amount-box {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-light);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      padding: 0.75rem 1rem;
    }
    .amount-box.income-bg {
      background: #dcfce7;
    }
    .currency {
      font-size: 2rem;
      font-weight: 800;
      color: var(--primary-color);
      margin-right: 0.5rem;
    }
    .currency.income-text, .amount-input.income-text {
      color: #16a34a;
    }
    .amount-input {
      border: none;
      background: transparent;
      outline: none;
      font-size: 2.25rem;
      font-weight: 800;
      width: 100%;
      text-align: center;
      color: var(--text-main);
    }
    .field-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .field-group label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-muted);
    }
    .select-control, .input-control {
      padding: 0.75rem;
      border-radius: var(--radius-sm);
      border: 1px solid var(--border-color);
      background: var(--surface-color);
      color: var(--text-main);
      font-size: 0.9rem;
      outline: none;
    }
    .category-grid {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.35rem;
    }
    .cat-chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 0.5rem 0.85rem;
      border-radius: 12px;
      border: 2px solid transparent;
      background: var(--bg-color);
      cursor: pointer;
      flex-shrink: 0;
    }
    .cat-chip.selected {
      background: var(--surface-color);
      border-color: var(--chip-color, var(--primary-color));
      box-shadow: var(--shadow-sm);
    }
    .chip-icon { font-size: 1.25rem; }
    .chip-label { font-size: 0.72rem; font-weight: 700; color: var(--text-main); }
    .form-row { display: flex; gap: 0.75rem; }
    .half { flex: 1; }
    .actions { display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 0.5rem; }
    .save-btn { border-radius: 12px; padding: 0 1.5rem; }
  `]
})
export class AddTransactionPageComponent {
  private categoryService = inject(CategoryService);
  private expenseService = inject(ExpenseService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  public selectedType = signal<'expense' | 'income'>('expense');
  public amount: number | null = null;
  public notes = '';
  public selectedCategory = '';
  public paymentMethod: PaymentMethod = 'UPI';
  public todayStr = new Date().toISOString().split('T')[0];
  public dateStr = this.todayStr;

  public categories = this.categoryService.categories;

  public filteredCategories = computed(() =>
    this.categories().filter((c) => c.type === this.selectedType())
  );

  constructor() {
    this.route.queryParams.subscribe((params) => {
      if (params['type'] === 'income') {
        this.setType('income');
      } else {
        this.setType('expense');
      }
    });
  }

  isEmoji(icon: string | undefined): boolean {
    if (!icon) return false;
    return Array.from(icon).some((char) => char.codePointAt(0)! > 255);
  }

  setType(type: 'expense' | 'income'): void {
    this.selectedType.set(type);
    const cats = this.filteredCategories();
    this.selectedCategory = cats.length > 0 ? cats[0].name : '';
  }

  async onSubmit(): Promise<void> {
    if (!this.amount || this.amount <= 0) return;

    const catName = this.selectedCategory || (this.selectedType() === 'income' ? 'Salary' : 'Food');

    await this.expenseService.addExpense({
      type: this.selectedType(),
      title: this.notes.trim() || catName,
      amount: Number(this.amount),
      category: catName,
      paymentMethod: this.paymentMethod,
      date: this.dateStr,
      notes: this.notes.trim() || undefined,
    });

    this.snackBar.open(`${this.selectedType() === 'income' ? 'Income' : 'Expense'} recorded! 🎉`, 'OK', { duration: 3000 });
    this.router.navigate(['/expenses']);
  }
}
