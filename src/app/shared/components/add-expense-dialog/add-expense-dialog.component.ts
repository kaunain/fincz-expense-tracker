import { Component, Inject, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CategoryService } from '../../../core/services/category.service';
import { ExpenseService } from '../../../core/services/expense.service';
import { Expense, PaymentMethod, TransactionType } from '../../../core/models/expense.model';

export interface ExpenseDialogData {
  expense?: Expense;
  defaultType?: 'expense' | 'income';
}

@Component({
  selector: 'app-add-expense-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDatepickerModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>{{ isEdit ? '✏️ Edit Transaction' : '💸 Add New Transaction' }}</h2>
        <button mat-icon-button class="close-btn" (click)="onCancel()">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <div class="type-toggle" *ngIf="!isEdit">
        <button type="button" class="toggle-btn" [class.active]="selectedType === 'expense'" (click)="setType('expense')">Expense</button>
        <button type="button" class="toggle-btn" [class.active]="selectedType === 'income'" (click)="setType('income')">Income</button>
      </div>

      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="dialog-form">
        <!-- Hero Amount Input Field (Indian Rupees ₹) -->
        <div class="amount-field-wrapper" [class.income-bg]="selectedType === 'income'" [class.expense-bg]="selectedType === 'expense'">
          <span class="currency-symbol" [class.income-text]="selectedType === 'income'">₹</span>
          <input
            type="number"
            step="0.01"
            formControlName="amount"
            placeholder="0.00"
            class="amount-input"
            [class.income-text]="selectedType === 'income'"
            autofocus
          />
        </div>
        <div *ngIf="expenseForm.get('amount')?.invalid && expenseForm.get('amount')?.touched" class="error-msg">
          Please enter a valid amount.
        </div>

        <!-- Description / Title with Auto-suggest (min 3 chars) -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description / Item Name</mat-label>
          <input
            type="text"
            matInput
            formControlName="title"
            [matAutocomplete]="auto"
            placeholder="e.g. Grocery, Salary"
          />
          <mat-icon matPrefix>edit_note</mat-icon>

          <mat-autocomplete #auto="matAutocomplete">
            <mat-option *ngFor="let suggestion of filteredTitleSuggestions()" [value]="suggestion">
              <span class="suggestion-item">
                <span class="material-symbols-outlined sugg-icon">history</span>
                {{ suggestion }}
              </span>
            </mat-option>
          </mat-autocomplete>
        </mat-form-field>

        <div class="form-row">
          <!-- Category Selector -->
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option *ngFor="let cat of filteredCategories()" [value]="cat.name">
                <span class="cat-option">
                  <span class="cat-dot" [style.background-color]="cat.color"></span>
                  {{ cat.name }}
                </span>
              </mat-option>
            </mat-select>
          </mat-form-field>

          <!-- Payment Method -->
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Payment Method</mat-label>
            <mat-select formControlName="paymentMethod">
              <mat-option value="UPI">📱 UPI / GPay</mat-option>
              <mat-option value="Cash">💵 Cash</mat-option>
              <mat-option value="Credit Card">💳 Credit Card</mat-option>
              <mat-option value="Debit Card">💳 Debit Card</mat-option>
              <mat-option value="Bank Transfer">🏦 Bank Transfer</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <!-- Calendar Date Picker (Clickable Native Calendar) -->
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" formControlName="date" />
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>

          <!-- Notes (Optional) -->
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Notes (Optional)</mat-label>
            <input matInput formControlName="notes" placeholder="Additional notes" />
          </mat-form-field>
        </div>

        <div class="dialog-actions">
          <button type="button" mat-button (click)="onCancel()">Cancel</button>
          <button type="submit" mat-flat-button color="primary" [disabled]="expenseForm.invalid" class="save-btn">
            {{ isEdit ? 'Update Transaction' : 'Save Transaction' }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 0.5rem;
    }
    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .dialog-header h2 {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
    }
    .type-toggle {
      display: flex;
      background: #f1f5f9;
      border-radius: 12px;
      padding: 0.25rem;
      margin-bottom: 1rem;
      gap: 0.25rem;
    }
    .toggle-btn {
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
    .toggle-btn.active {
      background: white;
      color: #0f172a;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .amount-field-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
    }
    .amount-field-wrapper.expense-bg {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
    }
    .amount-field-wrapper.income-bg {
      background: #dcfce7;
      border: 1px solid #bbf7d0;
    }
    .currency-symbol {
      font-size: 2.2rem;
      font-weight: 800;
      color: #2563eb;
      margin-right: 0.35rem;
    }
    .currency-symbol.income-text {
      color: #16a34a;
    }
    .amount-input {
      font-size: 2.25rem;
      font-weight: 800;
      color: #0f172a;
      border: none;
      background: transparent;
      outline: none;
      width: 100%;
      text-align: center;
    }
    .amount-input.income-text {
      color: #16a34a;
    }
    .full-width {
      width: 100%;
    }
    .form-row {
      display: flex;
      gap: 0.75rem;
    }
    .half-width {
      flex: 1;
    }
    .cat-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .cat-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }
    .sugg-icon {
      font-size: 18px;
      color: #94a3b8;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 1rem;
    }
    .save-btn {
      border-radius: 12px;
      padding: 0 1.5rem;
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.75rem;
      text-align: center;
    }
  `]
})
export class AddExpenseDialogComponent {
  private categoryService = inject(CategoryService);
  private expenseService = inject(ExpenseService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddExpenseDialogComponent>);

  public categories = this.categoryService.categories;
  public pastExpenses = this.expenseService.expenses;
  public isEdit = false;
  public selectedType: 'expense' | 'income' = 'expense';

  public expenseForm = this.fb.group({
    title: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [new Date(), Validators.required],
    category: ['', Validators.required],
    paymentMethod: ['UPI' as PaymentMethod, Validators.required],
    notes: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ExpenseDialogData) {
    if (data?.expense) {
      this.isEdit = true;
      this.selectedType = data.expense.type || 'expense';
      this.expenseForm.patchValue({
        title: data.expense.title,
        amount: data.expense.amount,
        date: new Date(data.expense.date),
        category: data.expense.category,
        paymentMethod: data.expense.paymentMethod,
        notes: data.expense.notes || ''
      });
    } else if (data?.defaultType) {
      this.selectedType = data.defaultType;
    }

    // Initialize category with a default for the type if not editing
    if (!this.isEdit) {
      const defaultCats = this.filteredCategories();
      if (defaultCats.length > 0) {
        this.expenseForm.patchValue({ category: defaultCats[0].name });
      }
    }
  }

  public filteredCategories = computed(() => {
    return this.categories().filter(c => c.type === this.selectedType);
  });

  setType(type: 'expense' | 'income'): void {
    if (this.isEdit) return; // Prevent changing type during edit
    this.selectedType = type;
    
    // Update category selection to a valid one for the new type
    const defaultCats = this.filteredCategories();
    if (defaultCats.length > 0) {
      this.expenseForm.patchValue({ category: defaultCats[0].name });
    } else {
      this.expenseForm.patchValue({ category: '' });
    }
  }

  /**
   * Auto-suggest title list when user types 3 or more characters
   */
  public filteredTitleSuggestions = computed(() => {
    const rawTitle = (this.expenseForm.get('title')?.value || '').trim().toLowerCase();
    if (rawTitle.length < 3) return [];

    const uniqueTitles = new Set<string>();
    for (const exp of this.pastExpenses()) {
      // Filter suggestions by type? Maybe not strictly necessary but nice.
      if (exp.type === this.selectedType && exp.title && exp.title.toLowerCase().includes(rawTitle)) {
        uniqueTitles.add(exp.title);
      }
    }
    return Array.from(uniqueTitles).slice(0, 5);
  });

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) return;

    const val = this.expenseForm.value;
    let formattedDateStr = new Date().toISOString().slice(0, 10);
    if (val.date) {
      const d = new Date(val.date);
      formattedDateStr = d.toISOString().slice(0, 10);
    }

    this.dialogRef.close({
      title: val.title,
      amount: val.amount,
      date: formattedDateStr,
      category: val.category,
      paymentMethod: val.paymentMethod,
      notes: val.notes,
      type: this.selectedType
    });
  }
}
