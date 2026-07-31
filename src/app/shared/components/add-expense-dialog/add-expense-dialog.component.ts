/**
 * @file add-expense-dialog.component.ts
 * @description Material 3 Dialog for adding or editing expenses with rich touch controls and category icons.
 */

import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../../core/services/category.service';
import { Expense, PaymentMethod } from '../../../core/models/expense.model';

export interface ExpenseDialogData {
  expense?: Expense;
}

@Component({
  selector: 'app-add-expense-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule
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
        <!-- Amount Input Field (Hero focus) -->
        <div class="amount-field-wrapper">
          <span class="currency-symbol">$</span>
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
          Valid amount is required.
        </div>

        <!-- Title / Description -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description / Merchant</mat-label>
          <input matInput formControlName="title" placeholder="e.g. Grocery Store, Coffee" />
          <mat-icon matPrefix>edit_note</mat-icon>
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
              <mat-option value="Cash">💵 Cash</mat-option>
              <mat-option value="Credit Card">💳 Credit Card</mat-option>
              <mat-option value="Debit Card">💳 Debit Card</mat-option>
              <mat-option value="UPI">📱 UPI / Mobile</mat-option>
              <mat-option value="Bank Transfer">🏦 Bank Transfer</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="form-row">
          <!-- Transaction Date -->
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Date</mat-label>
            <input matInput type="date" formControlName="date" />
          </mat-form-field>

          <!-- Optional Notes -->
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Notes (Optional)</mat-label>
            <input matInput formControlName="notes" placeholder="Tags or notes" />
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
      background: #f1f5f9;
      border-radius: 16px;
      padding: 0.75rem 1rem;
      margin-bottom: 0.5rem;
    }
    .currency-symbol {
      font-size: 2rem;
      font-weight: 800;
      color: #64748b;
      margin-right: 0.25rem;
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
    .error-text {
      color: #ef4444;
      font-size: 0.75rem;
      text-align: center;
    }
  `]
})
export class AddExpenseDialogComponent {
  private categoryService = inject(CategoryService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddExpenseDialogComponent>);

  public categories = this.categoryService.categories;
  public isEdit = false;

  public expenseForm = this.fb.group({
    title: ['', Validators.required],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [new Date().toISOString().slice(0, 10), Validators.required],
    category: ['Food & Dining', Validators.required],
    paymentMethod: ['Cash' as PaymentMethod, Validators.required],
    notes: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ExpenseDialogData) {
    if (data?.expense) {
      this.isEdit = true;
      this.expenseForm.patchValue({
        title: data.expense.title,
        amount: data.expense.amount,
        date: data.expense.date,
        category: data.expense.category,
        paymentMethod: data.expense.paymentMethod,
        notes: data.expense.notes || ''
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.expenseForm.invalid) return;
    this.dialogRef.close(this.expenseForm.value);
  }
}
