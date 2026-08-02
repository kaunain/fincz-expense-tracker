/**
 * @file confirm-dialog.component.ts
 * @description Reusable confirmation dialog to replace native browser confirm() calls.
 *
 * Usage:
 *   const ref = dialog.open(ConfirmDialogComponent, {
 *     width: '320px',
 *     data: { message: 'Are you sure?', confirmLabel: 'Delete', cancelLabel: 'Cancel' }
 *   });
 *   ref.afterClosed().subscribe(confirmed => { if (confirmed) { ... } });
 *
 * Returns: true when user clicks the confirm button, false/undefined otherwise.
 */

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmDialogData {
  /** Main message to show in the dialog body */
  message: string;
  /** Label for the confirm (destructive) button — defaults to 'Delete' */
  confirmLabel?: string;
  /** Label for the cancel button — defaults to 'Cancel' */
  cancelLabel?: string;
}

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="confirm-container">
      <!-- Warning icon -->
      <div class="warn-icon" aria-hidden="true">⚠️</div>

      <!-- Message passed from the parent component -->
      <p class="confirm-message">{{ data.message }}</p>

      <div class="confirm-actions">
        <!-- Cancel — returns false to afterClosed() -->
        <button mat-button (click)="dismiss()">
          {{ data.cancelLabel || 'Cancel' }}
        </button>

        <!-- Confirm — returns true to afterClosed() -->
        <button mat-flat-button color="warn" (click)="confirm()">
          {{ data.confirmLabel || 'Delete' }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirm-container {
        padding: 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
      }

      .warn-icon {
        font-size: 2.5rem;
        line-height: 1;
      }

      .confirm-message {
        margin: 0;
        font-size: 1rem;
        font-weight: 600;
        color: #0f172a;
      }

      .confirm-actions {
        display: flex;
        gap: 0.75rem;
        margin-top: 0.5rem;
      }
    `,
  ],
})
export class ConfirmDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  /** User clicked Confirm — close with true */
  confirm(): void {
    this.dialogRef.close(true);
  }

  /** User clicked Cancel or pressed Escape — close with false */
  dismiss(): void {
    this.dialogRef.close(false);
  }
}
