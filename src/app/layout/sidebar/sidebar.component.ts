/**
 * @file sidebar.component.ts
 * @description Navigation Drawer for Desktop & Mobile views.
 *
 * Changes:
 * - Removed duplicate "Add Expense" button to clean up sidebar layout.
 * - Emits `navigate` event when any navigation link is clicked so the parent
 *   (PageContainerComponent) can automatically close the mobile drawer.
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
      <nav class="nav-list" aria-label="Main navigation">
        <a
          *ngFor="let item of navItems"
          [routerLink]="item.route"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: item.route === '/' }"
          class="nav-link"
          (click)="onNavigate.emit()"
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
      gap: 1rem;
      min-height: 100%;
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
  /** Emitted whenever a nav item is tapped/clicked */
  @Output() onNavigate = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/' },
    { label: 'Expenses', icon: 'receipt_long', route: '/expenses' },
    { label: 'Categories', icon: 'category', route: '/categories' },
    { label: 'Reports', icon: 'equalizer', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];
}
