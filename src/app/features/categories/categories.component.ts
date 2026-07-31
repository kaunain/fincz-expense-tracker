/**
 * @file categories.component.ts
 * @description Mobile-First Category Manager with Material 3 cards, custom palette builder, and snackbar toasts.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatRippleModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, MatRippleModule, MatSnackBarModule],
  template: `
    <div class="categories-page">
      <div class="page-title-box">
        <h1>🏷️ Categories Manager</h1>
        <p class="subtitle">Organize expenses with custom tags & color palettes.</p>
      </div>

      <!-- Add Custom Category Card -->
      <div class="m3-card add-card">
        <h3>+ Add Custom Category</h3>
        <div class="form-row">
          <input 
            type="text" 
            [(ngModel)]="newCategoryName" 
            placeholder="e.g. Subscriptions, Travel" 
            class="input-control"
          />
          <input 
            type="color" 
            [(ngModel)]="newCategoryColor" 
            class="color-picker" 
            title="Badge Color"
          />
          <button class="save-btn" (click)="addCategory()" [disabled]="!newCategoryName.trim()" matRipple>
            Save
          </button>
        </div>
      </div>

      <!-- Category Cards Grid -->
      <div class="categories-grid">
        <div *ngFor="let cat of categories()" class="m3-card category-card" matRipple>
          <div class="cat-left">
            <span class="color-dot" [style.background-color]="cat.color"></span>
            <span class="cat-name">{{ cat.name }}</span>
          </div>

          <div class="cat-right">
            <span class="badge" [class.system]="cat.isDefault">{{ cat.isDefault ? 'Default' : 'Custom' }}</span>
            <button 
              *ngIf="!cat.isDefault" 
              class="delete-btn" 
              (click)="deleteCategory(cat.id!)" 
              title="Delete Category"
            >
              <span class="material-symbols-outlined">delete</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .categories-page {
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
    .add-card h3 {
      margin-top: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 0.75rem;
    }
    .form-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .input-control {
      flex: 1;
      padding: 0.65rem 0.85rem;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      outline: none;
      font-size: 0.9rem;
    }
    .color-picker {
      width: 44px;
      height: 42px;
      border: 1px solid #cbd5e1;
      border-radius: 12px;
      padding: 2px;
      cursor: pointer;
      background: white;
    }
    .save-btn {
      padding: 0.65rem 1.25rem;
      border-radius: 12px;
      background: #2563eb;
      color: white;
      border: none;
      font-weight: 700;
      cursor: pointer;

      &:disabled {
        background: #94a3b8;
        cursor: not-allowed;
      }
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 0.85rem;
    }
    .category-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1rem;
    }
    .cat-left {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .color-dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
    }
    .cat-name {
      font-weight: 700;
      color: #1e293b;
      font-size: 0.9rem;
    }
    .cat-right {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .badge {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      background: #eff6ff;
      color: #1d4ed8;
      font-weight: 700;
    }
    .badge.system {
      background: #f1f5f9;
      color: #64748b;
    }
    .delete-btn {
      background: none;
      border: none;
      color: #cbd5e1;
      cursor: pointer;

      &:hover {
        color: #ef4444;
      }

      .material-symbols-outlined {
        font-size: 20px;
      }
    }
  `]
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  public categories = this.categoryService.categories;
  public newCategoryName = '';
  public newCategoryColor = '#2563eb';

  async addCategory(): Promise<void> {
    if (!this.newCategoryName.trim()) return;

    await this.categoryService.addCategory({
      name: this.newCategoryName.trim(),
      icon: 'category',
      color: this.newCategoryColor,
      isDefault: false
    });

    this.snackBar.open(`Category "${this.newCategoryName}" created! 🏷️`, 'Dismiss', { duration: 3000 });
    this.newCategoryName = '';
  }

  async deleteCategory(id: number): Promise<void> {
    if (confirm('Delete this custom category?')) {
      await this.categoryService.deleteCategory(id);
      this.snackBar.open('Category deleted', 'Dismiss', { duration: 3000 });
    }
  }
}
