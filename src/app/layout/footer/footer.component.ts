import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="app-footer">
      <p>&copy; {{ currentYear }} Fincz Expense Tracker v0.1. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    .app-footer {
      text-align: center;
      padding: 12px;
      background-color: #f5f5f5;
      color: #666;
      font-size: 0.85rem;
      border-top: 1px solid #e0e0e0;
    }
    p { margin: 0; }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}
