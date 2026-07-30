import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>🏷️ Categories View</h2><p>Organize expense categories</p>`
})
export class CategoriesComponent {}
