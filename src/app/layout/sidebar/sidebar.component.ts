/**
 * @file sidebar.component.ts
 * @description Desktop Navigation Drawer / Rail using Material 3 styling and active indicator pills.
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatRippleModule],
  template: `
    <div class="sidebar-wrapper">
      <div class="sidebar-top">
        <button class="add-expense-btn" (click)="onAddExpense.emit()">
          <span class="material-symbols-outlined">add</span>
          <span>Add Expense</span>
        </button>
      </div>

      <nav class="nav-list">
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
          class="nav-link"
          matRipple
        >
          <span class="material-symbols-outlined nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.label }}</span>
        </a>
      </nav>
    </div>
  `,
  styles: [`
    .sidebar-wrapper {
      width: 240px;
      padding: 1.25rem 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .sidebar-top {
      padding: 0 0.5rem;
    }
    .add-expense-btn {
      width: 100%;
      padding: 0.75rem 1rem;
      border-radius: 16px;
      background: #2563eb;
      color: white;
      border: none;
      font-weight: 700;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      transition: background-color 0.2s, transform 0.1s;

      &:hover {
        background-color: #1d4ed8;
      }
      &:active {
        transform: scale(0.98);
      }
    }
    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .nav-link {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem 1rem;
      border-radius: 12px;
      text-decoration: none;
      color: #64748b;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }
    .nav-icon {
      font-size: 22px;
    }
    .nav-link:hover {
      background: #f1f5f9;
      color: #0f172a;
    }
    .nav-link.active {
      background: #eff6ff;
      color: #2563eb;
      font-weight: 700;
    }
  `]
})
export class SidebarComponent {
  @Output() onAddExpense = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Expenses', icon: 'receipt_long', route: '/expenses' },
    { label: 'Categories', icon: 'category', route: '/categories' },
    { label: 'Reports', icon: 'equalizer', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];
}
