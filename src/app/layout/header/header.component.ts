/**
 * @file header.component.ts
 * @description Top App Bar for Fincz Expense Tracker.
 *
 * Changes:
 * - Hamburger menu toggle for mobile & desktop drawer.
 * - Logo wrapped in home link.
 * - Header right action: 🔄 Transfer icon button (opens TransferDialogComponent).
 * - "About" button moved to sidebar navigation.
 */

import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TransferDialogComponent } from '../../shared/components/transfer-dialog/transfer-dialog.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule
  ],
  template: `
    <header class="app-header">
      <div class="header-left">
        <button
          mat-icon-button
          class="menu-toggle"
          (click)="toggleSidebar.emit()"
          aria-label="Toggle navigation menu"
        >
          <span class="material-symbols-outlined">menu</span>
        </button>

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
        <!-- Transfer Button replacing old + button -->
        <button
          mat-icon-button
          class="header-transfer-btn"
          (click)="openTransferDialog()"
          aria-label="Transfer between accounts"
          matTooltip="Transfer Money"
        >
          <span class="material-symbols-outlined">swap_horiz</span>
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

    .menu-toggle {
      display: inline-flex;
    }

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

    .header-transfer-btn {
      color: #6366f1;
    }
  `]
})
export class HeaderComponent {
  private dialog = inject(MatDialog);

  @Output() toggleSidebar = new EventEmitter<void>();

  openTransferDialog(): void {
    this.dialog.open(TransferDialogComponent, {
      width: '100%',
      maxWidth: '480px',
      panelClass: 'm3-dialog-panel'
    });
  }
}
