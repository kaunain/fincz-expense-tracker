/**
 * @file donut-chart.component.ts
 * @description Pure SVG Donut Chart component for spending category visualization.
 * No external charting library required — uses SVG stroke-dasharray technique.
 */

import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChartSlice {
  category: string;
  amount: number;
  color: string;
  percentage: number;
  // SVG stroke properties
  strokeDasharray: string;
  strokeDashoffset: number;
}

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="donut-wrapper">
      <svg viewBox="0 0 100 100" class="donut-svg">
        <circle
          cx="50" cy="50" r="35"
          fill="none"
          stroke="#f1f5f9"
          stroke-width="12"
        />
        <circle
          *ngFor="let slice of slices"
          cx="50" cy="50" r="35"
          fill="none"
          [attr.stroke]="slice.color"
          stroke-width="12"
          stroke-linecap="round"
          [attr.stroke-dasharray]="slice.strokeDasharray"
          [attr.stroke-dashoffset]="slice.strokeDashoffset"
          class="donut-slice"
        />
      </svg>
      <div class="donut-center">
        <span class="center-label">{{ centerLabel }}</span>
        <span class="center-sublabel">{{ centerSub }}</span>
      </div>
    </div>

    <div class="legend" *ngIf="showLegend">
      <div *ngFor="let slice of slices | slice:0:5" class="legend-item">
        <span class="legend-dot" [style.background]="slice.color"></span>
        <span class="legend-name">{{ slice.category }}</span>
        <span class="legend-pct">{{ slice.percentage }}%</span>
      </div>
    </div>
  `,
  styles: [`
    .donut-wrapper {
      position: relative;
      width: 160px;
      height: 160px;
      margin: 0 auto;
    }
    .donut-svg {
      width: 100%;
      height: 100%;
      transform: rotate(-90deg);
    }
    .donut-slice {
      transition: stroke-dasharray 0.6s ease;
    }
    .donut-center {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      pointer-events: none;
    }
    .center-label {
      display: block;
      font-size: 1rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.1;
    }
    .center-sublabel {
      display: block;
      font-size: 0.65rem;
      color: #64748b;
      font-weight: 600;
    }
    .legend {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      margin-top: 1rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.82rem;
    }
    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .legend-name {
      flex: 1;
      color: #334155;
      font-weight: 600;
    }
    .legend-pct {
      color: #64748b;
      font-weight: 700;
    }
  `]
})
export class DonutChartComponent implements OnChanges {
  @Input() data: { category: string; amount: number; color: string; percentage: number }[] = [];
  @Input() centerLabel = '';
  @Input() centerSub = 'Spent';
  @Input() showLegend = true;

  slices: ChartSlice[] = [];

  private readonly CIRCUMFERENCE = 2 * Math.PI * 35; // 2πr

  ngOnChanges(): void {
    this.buildSlices();
  }

  private buildSlices(): void {
    let cumulativeOffset = 0;
    this.slices = this.data.map(item => {
      const dash = (item.percentage / 100) * this.CIRCUMFERENCE;
      const gap = this.CIRCUMFERENCE - dash;
      const dasharray = `${dash.toFixed(2)} ${gap.toFixed(2)}`;
      const dashoffset = -cumulativeOffset;
      cumulativeOffset += dash;
      return {
        ...item,
        strokeDasharray: dasharray,
        strokeDashoffset: dashoffset
      };
    });
  }
}
