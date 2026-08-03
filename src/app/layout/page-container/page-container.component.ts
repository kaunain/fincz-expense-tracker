/**
 * @file page-container.component.ts
 * @description Main App Shell integrating Header, Desktop Sidebar, Mobile Bottom Navigation,
 * and global MatDialog / MatSnackBar transaction creation triggers.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BottomNavComponent } from '../bottom-nav/bottom-nav.component';
import { FooterComponent } from '../footer/footer.component';
import { AddExpenseDialogComponent } from '../../shared/components/add-expense-dialog/add-expense-dialog.component';
import { ExpenseService } from '../../core/services/expense.service';
import { PaymentMethod } from '../../core/models/expense.model';

@Component({
  selector: 'app-page-container',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatDialogModule,
    MatSnackBarModule,
    HeaderComponent,
    SidebarComponent,
    BottomNavComponent,
    FooterComponent,
  ],
  template: `
    <div class="main-layout">
      <app-header
        (toggleSidebar)="drawer.toggle()"
        (onQuickAdd)="openAddExpenseDialog()"
      ></app-header>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav
          #drawer
          mode="over"
          [opened]="false"
          class="sidenav"
        >
          <app-sidebar (onNavigate)="drawer.close()"></app-sidebar>
        </mat-sidenav>

        <mat-sidenav-content class="sidenav-content">
          <main class="content-wrapper">
            <router-outlet></router-outlet>
          </main>
          <app-footer></app-footer>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <!-- Mobile Bottom Navigation — 3 quick-action buttons -->
      <app-bottom-nav
        (onAddExpense)="openAddExpenseDialog('expense')"
        (onAddIncome)="openAddExpenseDialog('income')"
        (onTransfer)="openTransferDialog()"
      ></app-bottom-nav>
    </div>
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: #0f172a; // Outer background on desktop
      }
      .main-layout {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 100%;
        max-width: 480px; // Mobile phone width container on Desktop
        margin: 0 auto;
        background: var(--bg-color);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        position: relative;
        overflow: hidden;

        @media (min-width: 768px) {
          height: 92vh;
          border-radius: 28px;
          border: 4px solid #334155;
        }
      }
      .sidenav-container {
        flex: 1;
        background: transparent;
      }
      .sidenav {
        border-right: 1px solid #e2e8f0;
        background: white;
      }
      .sidenav-content {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .content-wrapper {
        padding: 1rem;
        width: 100%;
        margin: 0 auto;
        padding-bottom: 80px;
      }
    `,
  ],
})
export class PageContainerComponent {
  private breakpointObserver = inject(BreakpointObserver);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private expenseService = inject(ExpenseService);

  isMobile = false;

  constructor() {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile = result.matches;
    });
  }

  /**
   * Opens the Add/Edit transaction dialog.
   * @param defaultType - Pre-select 'expense' or 'income' tab in the dialog.
   */
  openAddExpenseDialog(defaultType: 'expense' | 'income' = 'expense'): void {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '100%',
      maxWidth: '480px',
      panelClass: 'm3-dialog-panel',
      // Pass the default transaction type so dialog opens on correct tab
      data: { defaultType },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Generic message that works for both expense and income
        const label = result.type === 'income' ? 'Income' : 'Expense';
        this.snackBar.open(`${label} added successfully! 🎉`, 'Dismiss', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
        });
      }
    });
  }

  /** Opens the Money Transfer Modal dialog */
  async openTransferDialog(): Promise<void> {
    const { TransferDialogComponent } = await import(
      '../../shared/components/transfer-dialog/transfer-dialog.component'
    );
    this.dialog.open(TransferDialogComponent, {
      width: '100%',
      maxWidth: '480px',
      panelClass: 'm3-dialog-panel'
    });
  }
}
