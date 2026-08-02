/**
 * @file header.component.ts
 * @description Top App Bar for Fincz Expense Tracker.
 *
 * Changes:
 * - Hamburger menu button is now visible on BOTH mobile and desktop
 *   (previously it was desktop-only; mobile nav was handled by bottom-nav tabs)
 * - Removed the "Offline First" status badge (clutters the header on small screens)
 * - Logo wrapped in a routerLink to '/' (home page)
 * - "About" info button added (ℹ️) — opens an About dialog
 * - Quick-add (+) button kept in header for desktop convenience
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { inject } from '@angular/core';
import { AboutDialogComponent } from './about-dialog/about-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
  ],
  template: `
    <header class="app-header">
      <div class="header-left">
        <!-- Hamburger/menu toggle — visible on all screen sizes -->
        <button
          mat-icon-button
          class="menu-toggle"
          (click)="toggleSidebar.emit()"
          aria-label="Toggle navigation menu"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>

        <!-- Logo wrapped in home link -->
        <a routerLink="/" class="brand" aria-label="Go to dashboard">
          <img
            src="https://fincz.com/images/fincz-logo-black.png"
            alt="Fincz"
            class="brand-logo-img"
          />
          <span class="app-subtitle">Expense Tracker</span>
        </a>
      </div>

      <div class="header-right">
        <!-- About button — shows app info and version -->
        <button
          mat-icon-button
          class="header-icon-btn"
          (click)="openAboutDialog()"
          aria-label="About this app"
          matTooltip="About Fincz"
        >
          <span class="material-symbols-outlined">info</span>
        </button>

        <!-- Quick add button — desktop users can click here to add a transaction -->
        <button
          mat-icon-button
          class="header-add-btn"
          (click)="onQuickAdd.emit()"
          aria-label="Add transaction"
          matTooltip="Add Expense"
        >
          <span class="material-symbols-outlined">add_circle</span>
        </button>
      </div>
    </header>
  `,
  styles: [
    `
      .app-header {
        position: sticky;
        top: 0;
        z-index: 900;
        height: 60px;
        padding: 0 1.25rem;
        background: rgba(255, 255, 255, 0.92);
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

      /* Hamburger/menu button — always visible (mobile + desktop) */
      .menu-toggle {
        display: inline-flex;
      }

      /* Logo anchor — no underline, flex row */
      .brand {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-decoration: none;
      }

      .brand-logo-img {
        height: 28px;
        width: auto;
        object-fit: contain;
      }

      .app-subtitle {
        font-size: 0.75rem;
        color: #64748b;
        font-weight: 700;
        background: #f1f5f9;
        padding: 0.15rem 0.5rem;
        border-radius: 6px;
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .header-icon-btn {
        color: #64748b;
      }

      .header-add-btn {
        color: #2563eb;
      }
    `,
  ],
})
export class HeaderComponent {
  private dialog = inject(MatDialog);

  /** Emitted when hamburger button is clicked — parent toggles the sidebar drawer */
  @Output() toggleSidebar = new EventEmitter<void>();

  /** Emitted when quick-add (+) button is clicked — parent opens Add Transaction dialog */
  @Output() onQuickAdd = new EventEmitter<void>();

  /** Opens the About dialog showing app info, version, and feature list */
  openAboutDialog(): void {
    this.dialog.open(AboutDialogComponent, {
      width: '100%',
      maxWidth: '400px',
      panelClass: 'm3-dialog-panel',
    });
  }
}
