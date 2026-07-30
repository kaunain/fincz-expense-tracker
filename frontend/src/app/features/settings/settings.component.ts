import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>⚙️ Settings View</h2><p>App Preferences and Configurations</p>`
})
export class SettingsComponent {}
