import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { PaymentTrace } from "src/app/core/interfaces/payment-trace";

@Component({
  selector: 'app-trace-detail-dialog',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './trace-detail.dialog.component.html'
})
export class TraceDetailDialogComponent implements OnInit {

  traces: PaymentTrace[] = [];
  filteredTraces: PaymentTrace[] = [];

  loading = true;
  errorMessage = '';

  userMap = new Map<number, string>();

  constructor(private adminService: AdminService, private modalCtrl: ModalController, @Inject('paymentId') public paymentId: number) {}

  ngOnInit(): void {
    this.loadUsersAndTraces();
  }

  loadUsersAndTraces(): void {

    this.loading = true;
    this.errorMessage = '';

    this.adminService.getAdmins().subscribe({
      next: (admins) => {

        admins.forEach(a => {
          if (a.personId) {
            this.userMap.set(a.personId, a.person.nickname);
          }
        });

        this.adminService.getPaymentDetail(this.paymentId).subscribe({
          next: (data) => {

            this.traces = data.traces;
            this.filteredTraces = data.traces;

            this.loading = false;
          },
          error: () => {
            this.errorMessage = 'No se pudieron cargar las trazas del pago';
            this.loading = false;
          }
        });

      },
      error: () => {
        this.errorMessage = 'No se pudieron cargar los administradores.';
        this.loading = false;
      }
    });
  }

  applyFilter(event: any) {

    const value = event.target.value?.toLowerCase() || '';

    this.filteredTraces = this.traces.filter(t => 
      (t.action || '').toLowerCase().includes(value) ||
      (this.getNickname(t.updatedBy) || '').toLowerCase().includes(value)  
    );
  }

  getNickname(adminId?: number): string {
    if (!adminId) return '-';
    return this.userMap.get(adminId) || `ID ${adminId}`;
  }

  close() {
    this.modalCtrl.dismiss();
  }
}