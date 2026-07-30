import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>📈 Reports View</h2><p>Analyze your spending habits</p>`
})
export class ReportsComponent {}
