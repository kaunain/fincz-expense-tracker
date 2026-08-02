/**
 * @file sidebar.component.ts
 * @description Desktop Navigation Drawer.
 *
 * On mobile this drawer slides in as an overlay (controlled by PageContainerComponent).
 * On desktop it stays pinned open as a persistent side rail.
 *
 * Changes:
 * - All navigation links remain here (moved from bottom-nav which now only has quick actions)
 * - "Add Expense" button emits onAddExpense so parent can open the dialog
 * - No internal state — parent (PageContainerComponent) controls open/close via mat-sidenav
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';

/** Single navigation item definition */
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
        <!-- Primary CTA: opens the Add Transaction dialog -->
        <button class="add-expense-btn" (click)="onAddExpense.emit()" aria-label="Add expense">
          <span class="material-symbols-outlined">add</span>
          <span>Add Expense</span>
        </button>
      </div>

      <!-- All app navigation links — always present here (desktop pinned, mobile drawer) -->
      <nav class="nav-list" aria-label="Main navigation">
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.route === '/' }"
          class="nav-link"
          matRipple
        >
          <span class="material-symbols-outlined nav-icon">{{ item.icon }}</span>
          <span class="nav-text">{{ item.label }}</span>
        </a>
      </nav>
    </div>
  `,
  styles: [
    `
      .sidebar-wrapper {
        width: 240px;
        padding: 1.25rem 0.75rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        /* Full height so the sidebar fills the drawer */
        min-height: 100%;
      }

      .sidebar-top {
        padding: 0 0.5rem;
      }

      /* Primary blue CTA button */
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
        transition:
          background-color 0.2s,
          transform 0.1s;

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

      /* Highlight the currently active route */
      .nav-link.active {
        background: #eff6ff;
        color: #2563eb;
        font-weight: 700;
      }
    `,
  ],
})
export class SidebarComponent {
  /** Emitted when user clicks "Add Expense" — parent opens the dialog */
  @Output() onAddExpense = new EventEmitter<void>();

  /** Navigation items — routes must match app.routes.ts definitions */
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/' },
    { label: 'Expenses', icon: 'receipt_long', route: '/expenses' },
    { label: 'Categories', icon: 'category', route: '/categories' },
    { label: 'Reports', icon: 'equalizer', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];
}
