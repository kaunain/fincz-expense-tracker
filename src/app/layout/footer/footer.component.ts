/**
 * @file footer.component.ts
 * @description Minimal Footer component for desktop layouts.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <span>Built with ❤️ for privacy • Fincz Expense Tracker (v0.2.0)</span>
    </footer>
  `,
  styles: [`
    .app-footer {
      padding: 1rem;
      text-align: center;
      font-size: 0.75rem;
      color: #94a3b8;
      border-top: 1px solid #e2e8f0;
      margin-top: 2rem;

      @media (max-width: 767px) {
        display: none;
      }
    }
  `]
})
export class FooterComponent {}
