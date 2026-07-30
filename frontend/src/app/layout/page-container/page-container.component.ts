import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent
  ],
  template: `
    <div class="main-layout">
      <app-header (toggleSidebar)="drawer.toggle()"></app-header>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav
          #drawer
          [mode]="isMobile ? 'over' : 'side'"
          [opened]="!isMobile"
          class="sidenav"
        >
          <app-sidebar></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="sidenav-content">
          <div class="content-wrapper">
            <router-outlet></router-outlet>
          </div>
          <app-footer></app-footer>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .main-layout {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }
    .sidenav-container {
      flex: 1;
    }
    .sidenav {
      border-right: 1px solid #e0e0e0;
    }
    .sidenav-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .content-wrapper {
      padding: 24px;
      min-height: calc(100vh - 120px);
    }
  `]
})
export class PageContainerComponent {
  private breakpointObserver = inject(BreakpointObserver);
  isMobile = false;

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      this.isMobile = result.matches;
    });
  }
}
