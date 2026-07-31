/**
 * @file bottom-nav.component.ts
 * @description Mobile-First Bottom Navigation Bar providing one-handed thumb navigation and quick FAB expense entry.
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatRippleModule } from '@angular/material/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, MatRippleModule],
  template: `
    <nav class="bottom-nav">
      <a
        *ngFor="let item of navItems"
        [routerLink]="item.route"
        routerLinkActive="active"
        [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
        class="nav-item"
        matRipple
      >
        <span class="material-symbols-outlined nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </a>

      <!-- Quick Add Floating Action Button -->
      <button class="nav-fab" (click)="onAddClick.emit()" aria-label="Add Expense" matRipple>
        <span class="material-symbols-outlined">add</span>
      </button>
    </nav>
  `,
  styles: [`
    .bottom-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: calc(64px + var(--safe-area-bottom));
      padding-bottom: var(--safe-area-bottom);
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-top: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-around;
      z-index: 1000;
      box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.04);

      @media (min-width: 768px) {
        display: none;
      }
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      color: #64748b;
      font-size: 0.72rem;
      font-weight: 600;
      flex: 1;
      height: 100%;
      transition: color 0.2s ease;
    }
    .nav-icon {
      font-size: 24px;
      margin-bottom: 2px;
      transition: transform 0.2s ease;
    }
    .nav-item.active {
      color: #2563eb;
    }
    .nav-item.active .nav-icon {
      font-weight: bold;
      transform: translateY(-2px);
    }
    .nav-fab {
      position: absolute;
      top: -24px;
      right: 1.25rem;
      width: 52px;
      height: 52px;
      border-radius: 16px;
      background: #2563eb;
      color: white;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 16px rgba(37, 99, 235, 0.35);
      cursor: pointer;

      .material-symbols-outlined {
        font-size: 28px;
      }

      &:active {
        transform: scale(0.92);
      }
    }
  `]
})
export class BottomNavComponent {
  @Output() onAddClick = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Expenses', icon: 'receipt_long', route: '/expenses' },
    { label: 'Categories', icon: 'category', route: '/categories' },
    { label: 'Reports', icon: 'equalizer', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];
}
