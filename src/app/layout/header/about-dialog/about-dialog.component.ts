/**
 * @file about-dialog.component.ts
 * @description About dialog showing app name, version, feature list, and Fincz.com link.
 * Triggered by the ℹ️ (info) button in the header.
 */

import { Component, inject } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { BUILD_INFO } from '../../../core/config/build-info';

@Component({
  selector: 'app-about-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="about-container">
      <!-- Header with logo -->
      <div class="about-header">
        <img
          src="https://fincz.com/images/fincz-logo-black.png"
          alt="Fincz Logo"
          class="about-logo"
        />
        <span class="version-chip">{{ version }}</span>
      </div>

      <h2 class="app-title">Expense Tracker</h2>
      <p class="app-tagline">Your personal finance companion — works 100% offline.</p>

      <!-- Feature list -->
      <ul class="feature-list">
        <li>
          <span class="feat-icon">📱</span>
          <span>Offline-first — no internet needed</span>
        </li>
        <li>
          <span class="feat-icon">🔒</span>
          <span>All data stored locally on your device (IndexedDB)</span>
        </li>
        <li>
          <span class="feat-icon">💸</span>
          <span>Track expenses and income separately</span>
        </li>
        <li>
          <span class="feat-icon">🏷️</span>
          <span>Custom categories with colors and icons</span>
        </li>
        <li>
          <span class="feat-icon">📊</span>
          <span>Reports and spending insights</span>
        </li>
        <li>
          <span class="feat-icon">📤</span>
          <span>Export and import your data (JSON/CSV)</span>
        </li>
      </ul>

      <!-- Footer with link and close button -->
      <div class="about-footer">
        <a href="https://fincz.com" target="_blank" rel="noopener noreferrer" class="fincz-link">
          🌐 Visit fincz.com
        </a>
        <button mat-flat-button color="primary" (click)="close()">Close</button>
      </div>
    </div>
  `,
  styles: [
    `
      .about-container {
        padding: 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .about-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
      }

      .about-logo {
        height: 32px;
        width: auto;
      }

      /* Small version pill next to the logo */
      .version-chip {
        font-size: 0.72rem;
        font-weight: 700;
        background: #eff6ff;
        color: #2563eb;
        padding: 0.2rem 0.6rem;
        border-radius: 9999px;
      }

      .app-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 800;
        color: #0f172a;
      }

      .app-tagline {
        margin: 0;
        font-size: 0.88rem;
        color: #64748b;
      }

      /* List of key features */
      .feature-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
      }

      .feature-list li {
        display: flex;
        align-items: flex-start;
        gap: 0.6rem;
        font-size: 0.88rem;
        color: #334155;
      }

      .feat-icon {
        font-size: 1rem;
        flex-shrink: 0;
        margin-top: 1px;
      }

      .about-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 0.5rem;
        border-top: 1px solid #f1f5f9;
      }

      .fincz-link {
        font-size: 0.85rem;
        color: #2563eb;
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    `,
  ],
})
export class AboutDialogComponent {
  private dialogRef = inject(MatDialogRef<AboutDialogComponent>);

  /** App version pulled from build-info config */
  version = BUILD_INFO.appVersion;

  close(): void {
    this.dialogRef.close();
  }
}
