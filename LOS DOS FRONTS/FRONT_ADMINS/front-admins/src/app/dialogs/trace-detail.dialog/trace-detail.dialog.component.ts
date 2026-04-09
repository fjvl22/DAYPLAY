import { Component, Inject, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { AdminService } from "../../core/services/admin.service";
import { PaymentTrace } from "../../core/interfaces/payment-trace";

@Component({
  selector: 'app-trace-detail.dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatProgressSpinnerModule, MatTableModule, MatPaginatorModule, MatFormField, MatLabel],
  templateUrl: './trace-detail.dialog.component.html',
  styleUrl: './trace-detail.dialog.component.css'
})
export class TraceDetailDialogComponent implements OnInit {
  traces: PaymentTrace[] = [];
  loading = true;
  errorMessage = '';
  userMap = new Map<number, string>();
  dataSource = new MatTableDataSource<PaymentTrace>();
  displayedColumns: string[] = ['traceDate', 'action', 'notes', 'updateBy'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(public dialogRef: MatDialogRef<TraceDetailDialogComponent>, @Inject(MAT_DIALOG_DATA) public paymentId: number, private adminService: AdminService) {}
  ngOnInit(): void {
    this.loadUsersAndTraces();
  }
  loadUsersAndTraces(): void {
    this.loading = true;
    this.errorMessage = '';
    this.adminService.getAdmins().subscribe({
      next: (admins) => {
        admins.forEach(a => {if (a.personId) {this.userMap.set(a.personId, a.person.nickname);}});
        this.adminService.getPaymentDetail(this.paymentId).subscribe({
          next: (data) => {
            this.traces = data.traces;
            this.dataSource.data = this.traces;
            this.dataSource.paginator = this.paginator;
            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'No se pudieron cargar las trazas del pago';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los administradores';
        this.loading = false;
      }
    });
  }
  getNickname(adminId?: number): string {
    if (!adminId) return '-';
    return this.userMap.get(adminId) || `ID ${adminId}`;
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  close(): void {
    this.dialogRef.close();
  }
}