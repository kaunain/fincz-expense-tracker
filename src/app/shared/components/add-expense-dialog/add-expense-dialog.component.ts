/**
 * @file add-expense-dialog.component.ts
 * @description Material 3 Dialog for adding/editing expenses with Indian Rupees (₹),
 * native MatDatepicker calendar picker, and auto-complete title suggestions after typing 3+ chars.
 */

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
import { Expense, PaymentMethod } from '../../../core/models/expense.model';

export interface ExpenseDialogData {
  expense?: Expense;
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
        <h2>{{ isEdit ? '✏️ Edit Transaction' : '💸 Add New Expense' }}</h2>
        <button mat-icon-button class="close-btn" (click)="onCancel()">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="dialog-form">
        <!-- Hero Amount Input Field (Indian Rupees ₹) -->
        <div class="amount-field-wrapper">
          <span class="currency-symbol">₹</span>
          <input
            type="number"
            step="0.01"
            formControlName="amount"
            placeholder="0.00"
            class="amount-input"
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
            placeholder="e.g. Grocery, Milk, Petrol"
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
              <mat-option *ngFor="let cat of categories()" [value]="cat.name">
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
            {{ isEdit ? 'Update Expense' : 'Save Expense' }}
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
    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .amount-field-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 16px;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
    }
    .currency-symbol {
      font-size: 2.2rem;
      font-weight: 800;
      color: #2563eb;
      margin-right: 0.35rem;
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

  public expenseForm = this.fb.group({
    title: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [new Date(), Validators.required],
    category: ['Food & Dining', Validators.required],
    paymentMethod: ['UPI' as PaymentMethod, Validators.required],
    notes: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ExpenseDialogData) {
    if (data?.expense) {
      this.isEdit = true;
      this.expenseForm.patchValue({
        title: data.expense.title,
        amount: data.expense.amount,
        date: new Date(data.expense.date),
        category: data.expense.category,
        paymentMethod: data.expense.paymentMethod,
        notes: data.expense.notes || ''
      });
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
      if (exp.title && exp.title.toLowerCase().includes(rawTitle)) {
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
      notes: val.notes
    });
  }
}
