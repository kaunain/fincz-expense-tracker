import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { BUILD_INFO } from '../../core/config/build-info';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule],
  template: `
    <div class="about-page m3-card">
      <div class="about-header">
        <img src="https://fincz.com/images/fincz-logo-black.png" alt="Fincz Logo" class="app-logo" />
        <h2>Fincz Expense Tracker</h2>
        <span class="version-badge">{{ buildInfo.appVersion }}</span>
      </div>

      <div class="about-section">
        <p class="app-desc">
          A modern, offline-first personal finance tracker designed for complete privacy and speed.
          All your financial data stays securely on your device using IndexedDB.
        </p>
      </div>

      <div class="features-list">
        <h3>✨ Key Highlights</h3>
        <ul>
          <li>🔒 <strong>Local-First & Offline</strong>: No account, no cloud servers required.</li>
          <li>⚡ <strong>Blazing Fast</strong>: Instant load & sub-millisecond response times.</li>
          <li>📱 <strong>Mobile Native UX</strong>: Simple, clean Monefy-inspired interaction flow.</li>
          <li>📊 <strong>Analytics & Transfers</strong>: Live balance tracking across Cash, Bank & Cards.</li>
        </ul>
      </div>

      <div class="build-info-box">
        <h3>ℹ️ App Information</h3>
        <div class="info-row">
          <span>Version</span>
          <strong>{{ buildInfo.appVersion }}</strong>
        </div>
        <div class="info-row">
          <span>Git Branch</span>
          <strong>{{ buildInfo.gitBranch }}</strong>
        </div>
        <div class="info-row">
          <span>Commit</span>
          <code>{{ buildInfo.commitHash }}</code>
        </div>
        <div class="info-row">
          <span>Build Date</span>
          <strong>{{ buildInfo.lastBuildDate }}</strong>
        </div>
      </div>

      <div class="action-footer">
        <a routerLink="/" mat-flat-button color="primary" class="back-btn">Back to Dashboard</a>
      </div>
    </div>
  `,
  styles: [`
    .about-page {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      max-width: 600px;
      margin: 0 auto;
      padding: 1.75rem;
    }
    .about-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.5rem;
    }
    .app-logo {
      height: 48px;
      width: auto;
      object-fit: contain;
    }
    .about-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--text-main);
    }
    .version-badge {
      background: var(--primary-light);
      color: var(--primary-color);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
    }
    .app-desc {
      color: var(--text-muted);
      font-size: 0.95rem;
      line-height: 1.6;
      text-align: center;
      margin: 0;
    }
    .features-list h3, .build-info-box h3 {
      margin: 0 0 0.75rem 0;
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-main);
    }
    .features-list ul {
      margin: 0;
      padding-left: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .build-info-box {
      background: var(--bg-color);
      border-radius: var(--radius-md);
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .info-row strong, .info-row code {
      color: var(--text-main);
    }
    .action-footer {
      display: flex;
      justify-content: center;
      margin-top: 0.5rem;
    }
    .back-btn {
      border-radius: 12px;
      padding: 0 2rem;
    }
  `]
})
export class AboutComponent {
  public buildInfo = BUILD_INFO;
}
