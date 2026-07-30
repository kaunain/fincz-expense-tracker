import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  template: `
    <mat-nav-list class="sidebar-list">
      <a
        mat-list-item
        *ngFor="let item of navItems"
        [routerLink]="item.route"
        routerLinkActive="active-link"
        [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
      >
        <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
        <span matListItemTitle>{{ item.label }}</span>
      </a>
    </mat-nav-list>
  `,
  styles: [`
    .sidebar-list {
      width: 240px;
      padding-top: 10px;
    }
    .active-link {
      background-color: rgba(63, 81, 181, 0.12);
      border-left: 4px solid #3f51b5;
      font-weight: bold;
    }
  `]
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Expenses', icon: 'receipt_long', route: '/expenses' },
    { label: 'Categories', icon: 'category', route: '/categories' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
    { label: 'Settings', icon: 'settings', route: '/settings' }
  ];
}
