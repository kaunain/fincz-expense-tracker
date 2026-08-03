/**
 * @file sidebar.component.ts
 * @description Navigation Drawer for Desktop & Mobile views.
 * Includes Dashboard, Accounts, Expenses, Categories, Reports, Settings, and About trigger.
 */

import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AboutDialogComponent } from '../header/about-dialog/about-dialog.component';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule, MatRippleModule, MatDialogModule],
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

        <!-- About full-page route link -->
        <a routerLink="/about" class="nav-link about-btn" (click)="onNavigate.emit()" matRipple>
          <span class="material-symbols-outlined nav-icon">info</span>
          <span class="nav-text">About App</span>
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
      background: transparent;
      border: none;
      cursor: pointer;
      width: 100%;
      text-align: left;
      font-family: inherit;
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

    .about-btn {
      margin-top: 0.5rem;
      border-top: 1px solid #f1f5f9;
      padding-top: 0.85rem;
      border-radius: 0;
    }
  `]
})
export class SidebarComponent {
  private dialog = inject(MatDialog);

  @Output() onNavigate = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/' },
    { label: 'Accounts', icon: 'account_balance_wallet', route: '/accounts' },
    { label: 'Expenses', icon: 'receipt_long', route: '/expenses' },
    { label: 'Categories', icon: 'category', route: '/categories' },
    { label: 'Reports', icon: 'equalizer', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' },
  ];

  openAboutDialog(): void {
    this.onNavigate.emit();
    this.dialog.open(AboutDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      panelClass: 'm3-dialog-panel'
    });
  }
}
