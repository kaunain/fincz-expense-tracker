/**
 * @file add-expense-dialog.component.ts
 * @description Dialog for adding or editing a transaction (expense or income).
 *
 * Upgrades:
 * - Title/Description is MANDATORY (min 3 characters, required validator)
 * - Future dates disabled (`[max]="maxDate"` set to Today)
 * - Compact Notes field layout
 * - Emoji vs Material symbol icon rendering fix for category chips
 * - Auto-suggest for description retains search history
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
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
import { MatChipsModule } from '@angular/material/chips';
import { provideNativeDateAdapter } from '@angular/material/core';
import { CategoryService } from '../../../core/services/category.service';
import { ExpenseService } from '../../../core/services/expense.service';
import { Expense, PaymentMethod } from '../../../core/models/expense.model';

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
    MatDatepickerModule,
    MatChipsModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>{{ isEdit ? '✏️ Edit Transaction' : '💸 Add New Transaction' }}</h2>
        <button mat-icon-button class="close-btn" (click)="onCancel()" aria-label="Close dialog">
          <span class="material-symbols-outlined">close</span>
        </button>
      </div>

      <!-- Expense / Income toggle — hidden in edit mode -->
      <div class="type-toggle" *ngIf="!isEdit" role="group" aria-label="Transaction type">
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

      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="dialog-form">

        <!-- Hero amount input — auto-focused, no spinner arrows -->
        <div
          class="amount-field-wrapper"
          [class.income-bg]="selectedType() === 'income'"
          [class.expense-bg]="selectedType() === 'expense'"
        >
          <span class="currency-symbol" [class.income-text]="selectedType() === 'income'">₹</span>
          <input
            #amountInput
            type="number"
            step="0.01"
            formControlName="amount"
            placeholder="0.00"
            class="amount-input"
            [class.income-text]="selectedType() === 'income'"
            aria-label="Amount in rupees"
            (keydown)="filterNonNumericKeys($event)"
            (keydown.enter)="onSubmit()"
          />
        </div>
        <div
          *ngIf="expenseForm.get('amount')?.invalid && expenseForm.get('amount')?.touched"
          class="error-msg"
        >
          Please enter a valid amount.
        </div>

        <!-- Description / Title (MANDATORY, Min 3 characters) -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Description *</mat-label>
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
          <mat-error *ngIf="expenseForm.get('title')?.hasError('required')">
            Description is required.
          </mat-error>
          <mat-error *ngIf="expenseForm.get('title')?.hasError('minlength')">
            Description must be at least 3 characters.
          </mat-error>
        </mat-form-field>

        <!-- Quick category chips — horizontal scrollable, single tap to select -->
        <div class="category-section">
          <label class="section-label">Category</label>
          <div class="category-chips" role="listbox" aria-label="Select category">
            <button
              *ngFor="let cat of filteredCategories()"
              type="button"
              class="cat-chip"
              [class.selected]="expenseForm.get('category')?.value === cat.name"
              [style.--chip-color]="cat.color"
              (click)="selectCategory(cat.name)"
              role="option"
              [attr.aria-selected]="expenseForm.get('category')?.value === cat.name"
            >
              <span class="chip-icon" *ngIf="isEmoji(cat.icon)">{{ cat.icon }}</span>
              <span class="material-symbols-outlined chip-mat-icon" *ngIf="!isEmoji(cat.icon) && cat.icon">{{ cat.icon }}</span>
              <span class="chip-label">{{ cat.name }}</span>
            </button>
          </div>
        </div>

        <div class="form-row">
          <!-- Payment method dropdown -->
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

          <!-- Date picker (Future dates blocked via [max]="maxDate") -->
          <mat-form-field appearance="outline" class="half-width">
            <mat-label>Date</mat-label>
            <input matInput [matDatepicker]="picker" [max]="maxDate" formControlName="date" />
            <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>

        <!-- Compact Optional Notes field -->
        <div class="compact-notes-wrapper">
          <mat-form-field appearance="outline" class="full-width compact-notes">
            <mat-label>Notes (Optional)</mat-label>
            <input matInput formControlName="notes" placeholder="Additional details..." />
          </mat-form-field>
        </div>

        <div class="dialog-actions">
          <button type="button" mat-button (click)="onCancel()">Cancel</button>
          <button
            type="submit"
            mat-flat-button
            color="primary"
            [disabled]="expenseForm.invalid"
            class="save-btn"
          >
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
      margin-bottom: 0.75rem;
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
      margin-bottom: 0.75rem;
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
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .dialog-form {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
    }

    .amount-field-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      padding: 0.6rem 1rem;
      margin-bottom: 0.25rem;
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
      font-size: 2rem;
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

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }

      -moz-appearance: textfield;
    }

    .amount-input.income-text {
      color: #16a34a;
    }

    .category-section {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .section-label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #64748b;
    }

    .category-chips {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 4px;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .cat-chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 0.45rem 0.75rem;
      border-radius: 12px;
      border: 2px solid transparent;
      background: #f8fafc;
      cursor: pointer;
      flex-shrink: 0;
      transition: all 0.15s ease;
      font-family: inherit;

      &:hover {
        background: #f1f5f9;
        border-color: var(--chip-color, #2563eb);
      }
    }

    .cat-chip.selected {
      background: color-mix(in srgb, var(--chip-color, #2563eb) 12%, white);
      border-color: var(--chip-color, #2563eb);
    }

    .chip-icon {
      font-size: 1.3rem;
      line-height: 1;
    }

    .chip-mat-icon {
      font-size: 20px;
      color: #64748b;
    }

    .chip-label {
      font-size: 0.72rem;
      font-weight: 600;
      color: #334155;
      white-space: nowrap;
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

    .compact-notes-wrapper {
      margin-top: -0.25rem;
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
      margin-top: 0.5rem;
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
export class AddExpenseDialogComponent implements AfterViewInit {
  @ViewChild('amountInput') amountInput!: ElementRef<HTMLInputElement>;

  private categoryService = inject(CategoryService);
  private expenseService = inject(ExpenseService);
  private fb = inject(FormBuilder);
  public dialogRef = inject(MatDialogRef<AddExpenseDialogComponent>);

  public categories = this.categoryService.categories;
  public pastExpenses = this.expenseService.expenses;
  public isEdit = false;
  public selectedType = signal<'expense' | 'income'>('expense');

  /** Max date allowed for transactions is TODAY (no future dates) */
  public maxDate: Date = new Date();

  public expenseForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    amount: [null as number | null, [Validators.required, Validators.min(0.01)]],
    date: [new Date(), Validators.required],
    category: ['', Validators.required],
    paymentMethod: ['UPI' as PaymentMethod, Validators.required],
    notes: ['']
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: ExpenseDialogData) {
    if (data?.expense) {
      this.isEdit = true;
      this.selectedType.set(data.expense.type || 'expense');
      this.expenseForm.patchValue({
        title: data.expense.title,
        amount: data.expense.amount,
        date: new Date(data.expense.date),
        category: data.expense.category,
        paymentMethod: data.expense.paymentMethod,
        notes: data.expense.notes || ''
      });
    } else if (data?.defaultType) {
      this.selectedType.set(data.defaultType);
    }

    if (!this.isEdit) {
      const defaultCats = this.filteredCategories();
      if (defaultCats.length > 0) {
        this.expenseForm.patchValue({ category: defaultCats[0].name });
      }
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.amountInput?.nativeElement?.focus();
    }, 150);
  }

  /** Detects whether string is an emoji or Material icon string */
  isEmoji(icon: string | undefined): boolean {
    if (!icon) return false;
    return Array.from(icon).some((char) => char.codePointAt(0)! > 255);
  }

  public filteredCategories = computed(() => {
    return this.categories().filter((c) => c.type === this.selectedType());
  });

  setType(type: 'expense' | 'income'): void {
    if (this.isEdit) return;
    this.selectedType.set(type);

    const defaultCats = this.filteredCategories();
    this.expenseForm.patchValue({
      category: defaultCats.length > 0 ? defaultCats[0].name : ''
    });
  }

  selectCategory(name: string): void {
    this.expenseForm.patchValue({ category: name });
  }

  filterNonNumericKeys(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
      'Home', 'End', '.', ','
    ];

    if (event.ctrlKey || event.metaKey) return;
    if (/^\d$/.test(event.key)) return;
    if (allowedKeys.includes(event.key)) return;

    event.preventDefault();
  }

  public filteredTitleSuggestions = computed(() => {
    const rawTitle = (this.expenseForm.get('title')?.value || '').trim().toLowerCase();
    if (rawTitle.length < 2) return [];

    const uniqueTitles = new Set<string>();
    for (const exp of this.pastExpenses()) {
      if (exp.type === this.selectedType() && exp.title?.toLowerCase().includes(rawTitle)) {
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
      formattedDateStr = new Date(val.date).toISOString().slice(0, 10);
    }

    this.dialogRef.close({
      title: val.title || '',
      amount: val.amount,
      date: formattedDateStr,
      category: val.category,
      paymentMethod: val.paymentMethod,
      notes: val.notes,
      type: this.selectedType()
    });
  }
}
