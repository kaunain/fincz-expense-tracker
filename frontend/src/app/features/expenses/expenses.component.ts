import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>💳 Expenses View</h2><p>Manage your daily expenses</p>`
})
export class ExpensesComponent {}
