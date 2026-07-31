/**
 * @file header.component.ts
 * @description Material 3 Glassmorphic Top Bar with app branding, sync status, and responsive controls.
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <button mat-icon-button class="desktop-toggle" (click)="toggleSidebar.emit()" aria-label="Toggle Menu">
          <span class="material-symbols-outlined">menu</span>
        </button>
        <div class="brand">
          <span class="brand-logo">💰</span>
          <div class="brand-text">
            <span class="brand-name">Fincz</span>
            <span class="brand-subtitle">Expense Tracker</span>
          </div>
        </div>
      </div>

      <div class="header-right">
        <span class="status-badge" matTooltip="100% Client-Side Local Data Privacy">
          <span class="pulse-dot"></span> Offline First
        </span>
        <button mat-icon-button (click)="onQuickAdd.emit()" class="header-add-btn" matTooltip="Add Expense">
          <span class="material-symbols-outlined">add_circle</span>
        </button>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      position: sticky;
      top: 0;
      z-index: 900;
      height: 60px;
      padding: 0 1.25rem;
      background: rgba(255, 255, 255, 0.88);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .desktop-toggle {
      display: none;
      @media (min-width: 768px) {
        display: inline-flex;
      }
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .brand-logo {
      font-size: 1.5rem;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-weight: 800;
      font-size: 1.15rem;
      color: #0f172a;
      line-height: 1.1;
      letter-spacing: -0.5px;
    }
    .brand-subtitle {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 600;
    }
    .header-right {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      background: #ecfdf5;
      color: #047857;
      font-size: 0.75rem;
      font-weight: 700;
    }
    .pulse-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #10b981;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
    }
    .header-add-btn {
      color: #2563eb;
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  @Output() onQuickAdd = new EventEmitter<void>();
}
