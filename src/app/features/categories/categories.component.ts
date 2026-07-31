/**
 * @file categories.component.ts
 * @description Category Management View allowing users to view default spending categories and create custom categories.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="categories-page">
      <div class="page-header">
        <div>
          <h1>🏷️ Category Management</h1>
          <p class="subtitle">Customize spending categories and color badges for your expense tracker.</p>
        </div>
      </div>

      <!-- Add New Custom Category Card -->
      <div class="card add-category-card">
        <h3>+ Create Custom Category</h3>
        <div class="form-row">
          <input 
            type="text" 
            [(ngModel)]="newCategoryName" 
            placeholder="Category Name (e.g. Subscriptions)" 
            class="form-control"
          />
          <input 
            type="color" 
            [(ngModel)]="newCategoryColor" 
            class="color-picker" 
            title="Choose Badge Color"
          />
          <button class="btn btn-primary" (click)="addCategory()" [disabled]="!newCategoryName.trim()">
            Save Category
          </button>
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="categories-grid">
        <div *ngFor="let cat of categories()" class="card category-card">
          <div class="category-header">
            <span class="color-badge" [style.background-color]="cat.color"></span>
            <span class="category-title">{{ cat.name }}</span>
          </div>

          <div class="category-meta">
            <span class="tag" [class.system-tag]="cat.isDefault">{{ cat.isDefault ? 'System Default' : 'Custom' }}</span>
            <button 
              *ngIf="!cat.isDefault" 
              class="icon-btn delete-btn" 
              (click)="deleteCategory(cat.id!)" 
              title="Delete Category"
            >
              🗑️
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
      gap: 1.5rem;
    }
    .page-header h1 {
      margin: 0;
      font-size: 1.75rem;
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
    .add-category-card h3 {
      margin-top: 0;
      font-size: 1.1rem;
      color: #0f172a;
    }
    .form-row {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    .form-control {
      flex: 1;
      padding: 0.6rem 0.75rem;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      outline: none;
    }
    .color-picker {
      width: 44px;
      height: 40px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      cursor: pointer;
      padding: 2px;
      background: white;
    }
    .btn {
      padding: 0.6rem 1.2rem;
      border-radius: 8px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }
    .btn-primary {
      background-color: #2563eb;
      color: white;

      &:disabled {
        background-color: #94a3b8;
        cursor: not-allowed;
      }
    }
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1rem;
    }
    .category-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .category-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .color-badge {
      width: 14px;
      height: 14px;
      border-radius: 50%;
    }
    .category-title {
      font-weight: 600;
      color: #1e293b;
    }
    .category-meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .tag {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      background: #e2e8f0;
      color: #475569;
      font-weight: 600;
    }
    .system-tag {
      background: #f1f5f9;
      color: #94a3b8;
    }
    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
    }
  `]
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);

  public categories = this.categoryService.categories;
  public newCategoryName = '';
  public newCategoryColor = '#3b82f6';

  async addCategory(): Promise<void> {
    if (!this.newCategoryName.trim()) return;

    await this.categoryService.addCategory({
      name: this.newCategoryName.trim(),
      icon: 'category',
      color: this.newCategoryColor,
      isDefault: false
    });

    this.newCategoryName = '';
  }

  async deleteCategory(id: number): Promise<void> {
    if (confirm('Delete this custom category?')) {
      await this.categoryService.deleteCategory(id);
    }
  }
}
