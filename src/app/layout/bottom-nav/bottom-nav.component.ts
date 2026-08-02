/**
 * @file bottom-nav.component.ts
 * @description Mobile Bottom Action Bar with 3 main quick-action triggers:
 *   - "New Expense" (blue)
 *   - "New Income"  (green)
 *   - "Transfer"    (purple)
 */

import { Component, EventEmitter, Output } from '@angular/core';
import { MatRippleModule } from '@angular/material/core';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [MatRippleModule],
  template: `
    <nav class="bottom-nav" aria-label="Quick actions">
      <button
        class="action-btn expense-btn"
        (click)="onAddExpense.emit()"
        aria-label="Add new expense"
        matRipple
      >
        <span class="material-symbols-outlined btn-icon">remove_circle</span>
        <span class="btn-label">New Expense</span>
      </button>

      <div class="btn-divider" aria-hidden="true"></div>

      <button
        class="action-btn income-btn"
        (click)="onAddIncome.emit()"
        aria-label="Add new income"
        matRipple
      >
        <span class="material-symbols-outlined btn-icon">add_circle</span>
        <span class="btn-label">New Income</span>
      </button>

      <div class="btn-divider" aria-hidden="true"></div>

      <button
        class="action-btn transfer-btn"
        (click)="onTransfer.emit()"
        aria-label="Transfer between accounts"
        matRipple
      >
        <span class="material-symbols-outlined btn-icon">swap_horiz</span>
        <span class="btn-label">Transfer</span>
      </button>
    </nav>
  `,
  styles: [`
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

      @media (min-width: 768px) {
        display: none;
      }
    }

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
      padding: 0 0.25rem;
    }

    .expense-btn {
      color: #2563eb;
      &:active {
        background: rgba(37, 99, 235, 0.08);
      }
    }

    .income-btn {
      color: #059669;
      &:active {
        background: rgba(5, 150, 105, 0.08);
      }
    }

    .transfer-btn {
      color: #6366f1;
      &:active {
        background: rgba(99, 102, 241, 0.08);
      }
    }

    .btn-icon {
      font-size: 24px;
      line-height: 1;
    }

    .btn-label {
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.01em;
    }

    .btn-divider {
      width: 1px;
      height: 32px;
      background: #e2e8f0;
      flex-shrink: 0;
    }
  `]
})
export class BottomNavComponent {
  @Output() onAddExpense = new EventEmitter<void>();
  @Output() onAddIncome = new EventEmitter<void>();
  @Output() onTransfer = new EventEmitter<void>();
}
