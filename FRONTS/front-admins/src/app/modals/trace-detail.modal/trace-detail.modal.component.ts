import { Component, OnInit, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule, ModalController } from "@ionic/angular";
import { AdminService } from "src/app/core/services/admin.service";
import { PaymentTrace } from "src/app/core/interfaces/payment-trace";

@Component({
  selector: 'app-trace-detail-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './trace-detail.modal.component.html'
})
export class TraceDetailModalComponent implements OnInit {

  @Input() paymentId!: number;

  traces: PaymentTrace[] = [];
  filteredTraces: PaymentTrace[] = [];

  loading = false;
  errorMessage = '';

  constructor(private adminService: AdminService, private modalCtrl: ModalController) {}

  ngOnInit(): void {
    this.loadTraces();
  }

  loadTraces(): void {

    this.loading = true;

    this.adminService.getPaymentTraces(this.paymentId).subscribe({
      next: (res) => {
        this.traces = res;
        this.filteredTraces = res;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Error cargando trazas';
        this.loading = false;
      }
    });
  }

  applyFilter(event: any) {

    const value = event.target.value?.toLowerCase() || '';

    this.filteredTraces = this.traces.filter(t => t.action.toLowerCase().includes(value) || (t.notes || '').toLowerCase().includes(value));
  }

  close() { this.modalCtrl.dismiss(); }

  getNickname(trace: PaymentTrace): string {
    return trace.updatedBy?.person?.nickname || 'Sistema';
  }
}