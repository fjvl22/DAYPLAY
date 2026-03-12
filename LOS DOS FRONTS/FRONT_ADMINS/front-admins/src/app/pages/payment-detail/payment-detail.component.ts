import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { AdminService } from "../../core/services/admin.service";
import { PaymentDetailResponse } from "../../core/interfaces/payment-detail-response";
import { PaymentTrace } from "../../core/interfaces/payment-trace";
import { TraceDetailDialogComponent } from "../../dialogs/trace-detail.dialog/trace-detail.dialog.component";

@Component({
  selector: 'app-payment-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TraceDetailDialogComponent
  ],
  templateUrl: './payment-detail.component.html',
  styleUrl: './payment-detail.component.css'
})
export class PaymentDetailComponent implements OnInit {
  paymentDetail?: PaymentDetailResponse;
  loading = true;
  errorMessage = '';
  dataSource = new MatTableDataSource<PaymentTrace>();
  displayedColumns: string[] = ['traceDate', 'description', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  constructor(private route: ActivatedRoute, private admin: AdminService, private dialog: MatDialog) {}
  ngOnInit(): void {
    this.loadPayment();
  }
  loadPayment(): void {
    this.loading = true;
    this.errorMessage = '';
    const paymentId = Number(this.route.snapshot.paramMap.get('id'));
    if (!paymentId) {
      this.errorMessage = 'ID de pago inválido';
      this.loading = false;
      return;
    }
    this.admin.getPaymentDetail(paymentId).subscribe({
      next: (data) => {
        this.paymentDetail = data;
        this.dataSource.data = data.traces;
        this.dataSource.paginator = this.paginator;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'No se pudo cargar el detalle del pago';
        this.loading = false;
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  viewTrace(trace: PaymentTrace) {
    this.dialog.open(TraceDetailDialogComponent, {
      width: '400px',
      data: trace
    });
  }
}