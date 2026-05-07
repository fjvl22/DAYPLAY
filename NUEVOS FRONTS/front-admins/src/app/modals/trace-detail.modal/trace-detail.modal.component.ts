import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { PaymentTrace } from "src/app/core/interfaces/payment-trace";
import { forkJoin } from "rxjs";

@Component({
  selector: 'app-trace-detail-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './trace-detail.modal.component.html'
})
export class TraceDetailModalComponent implements OnInit {

  paymentId!: number;

  traces: PaymentTrace[] = [];
  filteredTraces: PaymentTrace[] = [];

  loading = true;
  errorMessage = '';

  userMap = new Map<number, string>();

  constructor(
    private adminService: AdminService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    this.loadUsersAndTraces();
  }

  loadUsersAndTraces(): void {

    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      admins: this.adminService.getAdmins(),
      payment: this.adminService.getPaymentDetail(this.paymentId)
    }).subscribe({
      next: ({ admins, payment }) => {

        admins.forEach(a => {
          if (a.personId) {
            this.userMap.set(a.personId, a.person.nickname);
          }
        });

        this.traces = payment.traces;
        this.filteredTraces = payment.traces;

        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error cargando los datos';
        this.loading = false;
      }
    });
  }

  applyFilter(event: Event) {

    const value = (event.target as HTMLInputElement).value?.toLowerCase() || '';

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