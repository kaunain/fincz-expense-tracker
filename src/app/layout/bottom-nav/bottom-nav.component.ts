/**
 * @file bottom-nav.component.ts
 * @description Mobile Bottom Action Bar with two quick-action buttons:
 *   - "New Expense" (blue) — opens dialog pre-filled as expense
 *   - "New Income"  (green) — opens dialog pre-filled as income
 *
 * Navigation links have been moved to the sidebar drawer (hamburger menu).
 * This bar is hidden on desktop (>=768px) via CSS.
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [MatRippleModule],
  template: `
    <nav class="bottom-nav" aria-label="Quick actions">
      <!-- Add Expense button — opens dialog with type preset to 'expense' -->
      <button
        class="action-btn expense-btn"
        (click)="onAddExpense.emit()"
        aria-label="Add new expense"
        matRipple
      >
        <span class="material-symbols-outlined btn-icon">remove_circle</span>
        <span class="btn-label">New Expense</span>
      </button>

      <!-- Divider line between the two buttons -->
      <div class="btn-divider" aria-hidden="true"></div>

      <!-- Add Income button — opens dialog with type preset to 'income' -->
      <button
        class="action-btn income-btn"
        (click)="onAddIncome.emit()"
        aria-label="Add new income"
        matRipple
      >
        <span class="material-symbols-outlined btn-icon">add_circle</span>
        <span class="btn-label">New Income</span>
      </button>
    </nav>
  `,
  styles: [
    `
      /* Fixed bar pinned to bottom of screen, only visible on mobile */
      .bottom-nav {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: calc(64px + var(--safe-area-bottom, 0px));
        padding-bottom: var(--safe-area-bottom, 0px);
        background: rgba(255, 255, 255, 0.96);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border-top: 1px solid #e2e8f0;
        display: flex;
        align-items: center;
        z-index: 1000;
        box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.06);

        /* Hide on desktop — sidebar handles navigation there */
        @media (min-width: 768px) {
          display: none;
        }
      }

      /* Each button takes exactly half the bar width */
      .action-btn {
        flex: 1;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 4px;
        border: none;
        background: transparent;
        cursor: pointer;
        font-family: inherit;
        transition: background-color 0.15s ease;
        padding: 0 0.5rem;
      }

      /* Blue theme for expense */
      .expense-btn {
        color: #2563eb;

        &:active {
          background: rgba(37, 99, 235, 0.08);
        }
      }

      /* Green theme for income */
      .income-btn {
        color: #059669;

        &:active {
          background: rgba(5, 150, 105, 0.08);
        }
      }

      .btn-icon {
        font-size: 26px;
        line-height: 1;
      }

      .btn-label {
        font-size: 0.72rem;
        font-weight: 700;
        letter-spacing: 0.01em;
      }

      /* Thin vertical line separating the two buttons */
      .btn-divider {
        width: 1px;
        height: 36px;
        background: #e2e8f0;
        flex-shrink: 0;
      }
    `,
  ],
})
export class BottomNavComponent {
  /** Emitted when user taps "New Expense" — parent opens dialog with type='expense' */
  @Output() onAddExpense = new EventEmitter<void>();

  /** Emitted when user taps "New Income" — parent opens dialog with type='income' */
  @Output() onAddIncome = new EventEmitter<void>();
}
